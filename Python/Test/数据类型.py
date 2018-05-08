#!/usr/bin/python3
import sys     
print(sys.path)
# Number、String、List、Tuple（元组）、Sets（集合）、Dictionary（字典）

str1 = 'Runoob'
# str[1] = 'y' 不能修改
print(str1[1])

list = [ 'abcd', 786 , 2.23, 'runoob', 70.2 ] #可以修改
list[1] = 987
print(list)

tuple = ( 'abcd', 786 , 2.23, 'runoob', 70.2  ) # 不能修改
# tuple[1] = 987
print(tuple[1])

student = {'Tom', 'Jim', 'Mary', 'Tom', 'Jack', 'Rose'} # 集合是一个无序不重复的序列
print(student)

tinydict = {'name': 'runoob','code':1, 'site': 'www.runoob.com'} #字典是无序的对象集合。区别在于：字典当中的元素是通过键来存取的，而不是通过偏移存取。
# print(tinydict[2]) 不是通过偏移存取
print(tinydict['code'])

#将对象转化成字符串
str2 = str(tinydict)
print(str2[2])

# 用来计算在字符串中的有效Python表达式,并返回一个对象
tinydict2 = eval(str2)
print(tinydict2['name'])