var http = require('http');

http.createServer((req, res) => {
  // 发送 HTTP 头部 
  // HTTP 状态值: 200 : OK
  // 内容类型: text/plain
  res.writeHead(200, { 'Content-Type': 'text/path' });
  res.end('Hello Node.js');
}).listen(1337, '127.0.0.1');

console.log('http://127.0.0.1:1337');