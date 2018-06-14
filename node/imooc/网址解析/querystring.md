# 处理参数

querystring.stringify({ name: 'liuxin', list: ['react', 'node'] })
=>
'name=liuxin&list=react&list=node'

querystring.stringify({ name: 'liuxin', list: ['react', 'node'] }, ',')
=>
'name=liuxin,list=react,list=node'

querystring.stringify({ name: 'liuxin', list: ['react', 'node'] }, ',', ':')
=>
'name:liuxin,list:react,list:node'

querystring.parse('name=liuxin&list=react&list=node')
=>
{ name: 'liuxin', list: [ 'react', 'node' ] }

querystring.parse('name=liuxin,list=react,list=node', ',')
=>
{ name: 'liuxin', list: [ 'react', 'node' ] }

querystring.parse('name:liuxin,list:react,list:node', ',', ':')
=>
{ name: 'liuxin', list: [ 'react', 'node' ] }

querystring.parse('name:liuxin,list:react,list:node', ',', ':', 1000)
=> 最多解析1000个字符

## 转义

querystring.escape('<撒>')
=> '%3C%E6%92%92%3E'

querystring.unescape('%3C%E6%92%92%3E')
=> '<撒>