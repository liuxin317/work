#!/usr/bin/python3

var1 = 'Hello World!'
var2 = "Runoob789"

print(var1 + '\r')
print(var2)

print("d" in var1) # d在var1中吗？
print("a" not in var2) #a不再var2中吗？

print("liuxin".capitalize()) #将字符串的第一个字符串转换为大写

print(var2.center(40, "*")) #方法返回一个指定的宽度 width 居中的字符串，fillchar 为填充的字符，默认为空格。

print(var1.count("l", 0, 10)) #于统计字符串里某个字符出现的次数。可选参数为在字符串搜索的开始与结束位置

var3 = "刘鑫".encode("GBK") #转码
print(var3)
print(var3.decode("GBK", "strict")) #解码

print(var1.find("or")) #检索字符串
print(var1.find("orq")) #检索字符串

print(var1.isalnum()) #如果是纯英文或者数字则返回false，否则返回true
print(var2.isalnum())