// 删除目录
var fs = require('fs');

console.log("准备删除目录 ./test");
fs.rmdir('./test/a', function (err) {
  if (err) {
    return console.error(err);
  }
  console.log("读取 /test 目录");

  fs.readdir('./test', function(err, files) {
    if (err) {
      return console.error(err);
    }

    files.forEach( function (file){
      console.log( file );
    });
  })
})