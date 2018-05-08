#!/usr/bin/python3
import random

a = 10
b = 5.00
c = 3.14j
list = [1,2,3,4,5,6]

print(int(b)) # 转化成整数型
print(float(a)) # 转化成浮点数
print(complex(b)) # 转化成一个复数

a = -3
print(abs(a)) # 返回数字的绝对值

b = 5.2368
print(round(b, 2)) # 返回浮点数的四舍五入

print(max(list)) #返回最大值
print(min(list)) #返回最小值

print(random.choice(list)) #从某个区间中随机挑选一个整数。

print(random.randrange(100)) 

print(random.random()) #随机返回0-1随机数

random.shuffle(list)
print(list) #随机排列

print(random.uniform(1,10)) #生成1-10之间随机浮点数