import json

from websocket_server import WebsocketServer
import alib.pr as apr
from henMoitor import Monitor

class WServer:
	def __init__(self, host, port, log_level, mtr_config):
		self.host = host
		self.port = port
		self.log = apr.Log(show_level=log_level)
		self.hmtr = Monitor()
		self.hmtr.parse_config(mtr_config)

	def _close_session(self, client):
		client["handler"].send_close(1000, b'')

	def _send_msg(self, server, client, msg):
		server.send_message(client, msg)

	def _msgReceived(self, client, server, msg):
		if msg == '0':
			self.hmtr.poll()
			self._send_msg(server, client, json.dumps(self.hmtr.dumps_srv()))
		else:
			self.log.print('Bad request from %s.' % client['address'], 2)
			self._close_session(client)
		
	def start(self):
		server = WebsocketServer(port=self.port, host=self.host)
		server.set_fn_message_received(self._msgReceived)
		self.log.print(f"Listening on {self.host}:{self.port}...", 1)
		server.run_forever()
