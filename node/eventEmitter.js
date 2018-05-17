// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();

var connectHandler = () => {
  console.log('连接成功。');
  
  // 触发 data_received 事件 
  eventEmitter.emit('data_received');
};

// 绑定事件及事件的处理函数
eventEmitter.on('connection', connectHandler);

// 使用匿名函数绑定 data_received 事件
eventEmitter.on('data_received', function(){
  console.log('数据接收成功。');
});

// 触发
eventEmitter.emit('connection');

eventEmitter.addListener('add', (a, b) => {
  console.log(`add: ${a + b}`);
});

eventEmitter.emit('add', 10, 50);

console.log("程序执行完毕。");