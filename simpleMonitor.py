# coding=utf-8
## simpleMonitor <server_list> <output> <0 | timeout> <isPrint>

import sys

import alib.tcp_latency as tcp_latency
import alib.ping_latency as ping_latency
import alib.tidyTimer as ttimer

VERSION = '20230321'

class isAlive:
	def __init__(self, timeout=3.):
		self.timeout = timeout

	def icmp(self, host):
		return ping_latency.getLatency(host, self.timeout)

	def tcp(self, host_port):
		return tcp_latency.getLatency(host_port, self.timeout)


if __name__ == '__main__':
	print('simpleMonitor <server_list> <output> <0|timeout> <isPrint>')
	print('Simple Monitor %s running...' % VERSION)
	fname_server = sys.argv[1]
	fname_output = sys.argv[2]
	check_interval = int(sys.argv[3])  ## <1 for one-shot
	isPrint = int(sys.argv[4])

	ia = isAlive()
	server_list = []
	## Will be [[proto, host, (parameter)], [[proto, host, (parameter)], ...]
	with open(fname_server, 'r') as o:
		buf = o.read()
	for srv in buf.split('\n'):
		srv = srv.replace('\n', '')
		if srv == '' or srv[0] == '#':
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
		output_board = ''

		for srv in server_list:
			result = func_rack[srv[0]](srv[1])
			if result == -1:
				result_show = 'FAILED'
			else:
				result_show = '%.2f' % (result*1000)
			server_status = '[%s]\nServer: %s\nProtocol: %s\nLatency: %s ms\n' % (srv[2], srv[1], srv[0], result_show)
			output_board += (server_status + '\n')

		if isPrint == 1:
			print(output_board)
		with open(fname_output, 'w') as o:
			o.write(output_board)
		## Is one-shot or not
		if check_interval >= 1:
			timer.endpoint()
		else:
			break
