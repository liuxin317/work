#!/usr/bin/python3

import sys;
from sys import argv,path  #  导入特定的成员

print('================Python import mode==========================');
print ('命令行参数为:')
for i in sys.argv:
  print (i)
print ('\n python 路径为',sys.path)

print('================python from import===================================')
print('path:',path) # 因为已经导入path成员，所以此处引用时不需要加sys.path