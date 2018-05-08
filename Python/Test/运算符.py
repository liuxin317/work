#!/usr/bin/python3

a = 10
b = 20
list = [10, 20, 50, 60]
str = "module"

print(a and b) #如果 x 为 False，x and y 返回 False，否则它返回 y 的计算值
print(a or b) #	布尔"或" - 如果 x 是 True，它返回 x 的值，否则它返回 y 的计算值。

a = False
print(not a) #布尔"非" - 如果 x 为 True，返回 False 。如果 x 为 False，它返回 True

print(b in list) #如果在指定的序列中找到值返回 True，否则返回 False。
print(a not in list) #如果在指定的序列中没有找到值返回 True，否则返回 False。
print("b" in str)

a = 20
print(a is b) #is 是判断两个标识符是不是引用自一个对象
print(id(a) == id(b))
print(a is not b) #	is not 是判断两个标识符是不是引用自不同对象