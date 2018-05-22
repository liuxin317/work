// node 全局对象
global.a = 2;
b = 3

console.log(global.a, global.b);

// __filename 当前文件文件名,输出当前文件所在的绝对位置
console.time(__filename)
console.timeEnd(__filename)

process.on('exit', function(code) {

  // 以下代码永远不会执行
  setTimeout(function() {
    console.log("该代码不会执行");
  }, 0);
  
  console.log('退出码为:', code);
});
console.log("程序执行结束");