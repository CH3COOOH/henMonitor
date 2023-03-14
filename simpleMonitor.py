import sys
import time

import alib.tcp_latency as tcp_latency
import alib.ping_latency as ping_latency
import alib.tidyTimer as ttimer

class isAlive:
	def __init__(self, timeout=3.):
		self.timeout = timeout

	def icmp(self, host):
		return ping_latency.getLatency(host, self.timeout)

	def tcp(self, host_port):
		return tcp_latency.getLatency(host_port, self.timeout)


if __name__ == '__main__':
	fname_server = sys.argv[1]
	check_interval = int(sys.argv[2])  ## -1 for one-shot

	ia = isAlive()
	server_list = []
	## Will be [[proto, host, (parameter)], [[proto, host, (parameter)], ...]
	with open(fname_server, 'r') as o:
		buf = o.read()
	for srv in buf.split('\n'):
		srv = srv.replace('\n', '')
		if srv == '':
			continue
		else:
			server_list.append(srv.split('\t'))

	func_rack = {
			'tcp': ia.tcp,
			'icmp': ia.icmp
	}
	result = None
	timer = ttimer.Timer(check_interval)
	while True:
		timer.startpoint()	
		for srv in server_list:
			if len(srv) == 2:
				result = func_rack[srv[0]](srv[1])
			else:
				result = func_rack[srv[0]](srv[1:])
			if result == -1:
				result_show = 'FAILED'
			else:
				result_show = '%.2f' % result
			server_status = '%s\t%s\t%s' % (srv[0], '|'.join(srv[1:]), result_show)
			print(server_status)
		if check_interval > 0:
			timer.endpoint()
		else:
			break
