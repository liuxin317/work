#!/usr/bin/python3

'''
多行注释
'''
print('Hello World!')

word = '字符串'
sentence = "这是一个句子。"

if True:
    print ("True\nlinux") # 使用反斜杠(\)+n转义特殊字符
    print(sentence[0:-1]) # 输出第一个到倒数第二个所有字符
    print(sentence[0]) # 输出第一个字符
    print(word * 2) # 输出两次
else:
    print ("False")