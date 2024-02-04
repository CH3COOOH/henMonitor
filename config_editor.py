def update_srv_list(fpath, label, host, proto, op=0):
	try:
		with open(fpath, 'r') as o:
			s_conf = o.read()
		a_conf = s_conf.split('\n')
		if op >= 0:
			a_conf.append(f"{proto}\t{host}\t{label}")
		else:
			for i in range(len(a_conf)):
				a_conf[i] = a_conf[i].replace('\n', '').replace('\r', '')
				if a_conf[i].split('\t')[-1] == label:
					del a_conf[i]
					break
		with open(fpath, 'w') as o:
			o.write('\n'.join(a_conf))
		return 0
	except:
		return -1