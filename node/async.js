// node.js 文件系统
var fs = require('fs');

// 异步读取
fs.readFile('input.txt', (error, data) => {
  if (error) {
    return console.error(error)
  }
  console.log(data.toString())
});

console.log('异步ending...');

// 同步读取
var data = fs.readFileSync('input.txt');
console.log('同步读取：' + data.toString());
console.log('同步ending...');