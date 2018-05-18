var fs = require('fs');
var data = '';
// 创建可读流
const readerStream = fs.createReadStream('input.txt');

// 设置编码utf-8
readerStream.setEncoding('UTF8');

// 处理流的事件，data、end、error
readerStream.on('data', check => {
  data += check
})

readerStream.on('end',function(){
  console.log(data);
});

readerStream.on('error', err => {
  console.log(err.stack);
});

console.log('ending...');