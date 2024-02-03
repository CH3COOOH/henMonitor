import sys
import wsrv

if __name__ == '__main__':
	host, port = sys.argv[1].split(':')
	log_lv = int(sys.argv[3])
	fpath_config = sys.argv[2]
	with open(fpath_config, 'r') as o:
		s_config = o.read()
	s = wsrv.WServer(host, int(port), log_lv, s_config)
	s.start()