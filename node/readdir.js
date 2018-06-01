// 读取目录
var fs = require('fs');

console.log("查看 /test 目录");
fs.readdir('./test', function(err, files) {
  if (err) {
    return console.error(err);
  }

  files.forEach(item => {
    console.log(item)
  })
})