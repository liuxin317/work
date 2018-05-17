var fs = require('fs');

// 阻塞实例
var data = fs.readFileSync('./input.txt');

console.log(data.toString());
console.log("程序执行结束!");