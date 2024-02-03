import json

from websocket_server import WebsocketServer
import alib.pr as apr
from henMoitor import Monitor

class WServer:
	def __init__(self, host, port, log_level, fpath_config):
		self.host = host
		self.port = port
		self.log = apr.Log(show_level=log_level)
		self.hmtr = Monitor()
		self.fpath_config = fpath_config

	def _close_session(self, client):
		client["handler"].send_close(1000, b'')

	def _send_msg(self, server, client, msg):
		server.send_message(client, msg)

	def _msgReceived(self, client, server, msg):
		if msg == '0':
			try:
				with open(self.fpath_config, 'r') as o:
					if self.hmtr.parse_config(o.read()) == -1:
						self.log('Unable to parse the config.', 3)
						self._send_msg(server, client, 'SRV_ERR')
						# self._close_session(client)
						return -1
			except:
				self.log('Failed to open the config file.', 3)
				self._send_msg(server, client, 'SRV_ERR')
				# self._close_session(client)
				return -1
			self.hmtr.poll()
			self._send_msg(server, client, json.dumps(self.hmtr.dumps_srv()))
		else:
			self.log.print('Bad request from %s.' % client['address'], 2)
			self._send_msg(server, client, 'BAD_REQ')
		# self._close_session(client)
		return 0
		
	def start(self):
		server = WebsocketServer(port=self.port, host=self.host)
		server.set_fn_message_received(self._msgReceived)
		self.log.print(f"Listening on {self.host}:{self.port}...", 1)
		server.run_forever()
