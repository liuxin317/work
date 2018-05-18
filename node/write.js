// 写入流
var fs = require('fs');
var data = 'Hello，I am LiuXin';

// 创建一个可以写入的流，写入到output.txt文件
var writeStream = fs.createWriteStream('output.txt');

// 使用utf8编码写入
writeStream.write(data, 'UTF8');

// 标记文件末尾
writeStream.end();

// 处理流事件，data、end、error
writeStream.on('finish', () => {
  console.log("写入完成。");
})

writeStream.on('error', function(err){
  console.log(err.stack);
});

console.log('ending...');