# coding=utf-8

import sys
import time

import alib.tcp_latency as tcp_latency
import alib.ping_latency as ping_latency
import alib.json as ajs

VERSION = '20240201-1'

class IsAlive:
	def __init__(self, timeout=3.):
		self.timeout = timeout

	def icmp(self, host):
		return ping_latency.getLatency(host, self.timeout)

	def tcp(self, host_port):
		return tcp_latency.getLatency(host_port, self.timeout)

class Monitor:
	def __init__(self):
		self.servers = {}
		self.ia = IsAlive(timeout=3.)
	
	def toReport(self):
		report = ''
		for label in self.servers.keys():
			report += f"[{label}]\nServer: {self.servers[label][0]}\nProtocol: {self.servers[label][1]}\n"
			if self.servers[label][2] >= 0:
				report += 'Latency: %.2f ms\n------\n' % (self.servers[label][2] * 1000)
			else:
				report += '*** Unreachable ***\n------\n'
		return report
	
	def parse_config(self, s_config):
		ctr = 0
		for srv in s_config.split('\n'):
			ctr += 1
			srv = srv.replace('\n', '').replace('\r', '')
			if srv == '' or srv[0] == '#':
				continue
			else:
				try:
					proto, host, label = srv.split('\t')
					self.servers[label] = [host, proto, 0]
				except:
					print('**Bad format in line %d. Exit.' % ctr)
					return -1
		return 0
	
	def poll(self, isPrint=False):
		for label in self.servers.keys():
			if self.servers[label][1] == 'icmp':
				self.servers[label][2] = self.ia.icmp(self.servers[label][0])
			elif self.servers[label][1] == 'tcp':
				self.servers[label][2] = self.ia.tcp(self.servers[label][0])
		if isPrint == True:
			print(self.toReport())
		return self.servers
	
	def dump_srv(self, fpath):
		ajs.gracefulDumpJSON(fpath, self.servers)
	
	def dumps_srv(self):
		return self.servers

if __name__ == '__main__':
	print('simpleMonitor <server_list>')
	print('Simple Monitor %s running...' % VERSION)
	fname_server = sys.argv[1]

	mtr = Monitor()

	with open(fname_server, 'r') as o:
		s_config = o.read()
		
	if mtr.parse_config(s_config) == -1:
		exit(-1)
	
	mtr.poll(isPrint=True)
	
