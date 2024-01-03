from websocket_server import WebsocketServer
from azlib import pr

class Server:
	def __init__(self, host, port, log_level, db_path=None):
		self.host = host
		self.port = port
		self.log = pr.Log(show_level=log_level)

	def _close_session(self, client):
		client["handler"].send_close(1000, b'')

	def _send_msg(self, server, client, msg):
		server.send_message(client, msg)

	def _msgReceived(self, client, server, msg):
		pass

	# def _

	def start(self):
		server = WebsocketServer(port=self.port, host=self.host)
		server.set_fn_message_received(self._msgReceived)
		self.log.print(f"Listening on {self.host}:{self.port}...", 1)
		server.run_forever()
