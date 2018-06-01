// 创建node，web服务
var http = require('http');
var fs = require('fs');
var url = require('url');

// 创建服务器
http.createServer(function(request, response) {
  // 解析请求，包括文件名
  var pathname = url.parse(request.url).pathname;

  // 输出请求文件名
  console.log('文件名:' + pathname);

  // 从文件系统中读取请求的文件内容
  fs.readFile(pathname.substr(1), function (err, data) {
    if (err) {
      console.log(err);
      // HTTP 状态码: 404 : NOT FOUND
      // Content Type: text/plain
      response.writeHead(404, {'Content-Type': 'text/html'})
    }else{ 
      // HTTP 状态码: 200 : OK
      // Content Type: text/plain
    }
  })
}).listen(8080)