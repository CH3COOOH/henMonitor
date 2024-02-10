import requests
from time import time

def isReachable(url, timeout=3., exp_code=200, exp_str=None):
	try:
		res = requests.get(url, verify=False, timeout=timeout)
	except:
		return -2
	if exp_str != None:
		if str(exp_str) not in res.text:
			return -1
	if res.status_code != exp_code:
		return -1
	return 0

if __name__ == '__main__':
	print(isReachable('https://app.henchat.net'))
	print(isReachable('https://app.henchat.net/xxx.htm'))
	print(isReachable('http://192.168.0.1'))
