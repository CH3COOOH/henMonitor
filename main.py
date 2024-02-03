import sys
import wsrv

if __name__ == '__main__':
	host, port = sys.argv[1].split(':')
	log_lv = int(sys.argv[3])
	fpath_config = sys.argv[2]
	s = wsrv.WServer(host, int(port), log_lv, fpath_config)
	s.start()