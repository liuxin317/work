var fs = require('fs');

// 非阻塞实例

fs.readFile('./input.txt', (err, data) => {
  if (err) return console.error(err);
  console.error(data.toString());
});

console.log("程序执行结束!");