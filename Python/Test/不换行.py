#!/usr/bin/python3


x = "Hello"
y = 123
list = [ 'abcd', 786 , 2.23, 'runoob', 70.2 ]
tuple = ('abcd', 786 , 2.23, 'runoob', 70.2)
student = {'Tom', 'Jim', 'Mary', 'Tom', 'Jack', 'Rose'}
tinydict = {'name': 'runoob','code':1, 'site': 'www.runoob.com'}

# tuple[1] = 987

print(x)
print(y)
print(tuple)
print(student)
print(tinydict)

del y

list[1] = 987

print(x, end="")
print(list[0:2], end="")