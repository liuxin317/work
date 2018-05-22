// 缓冲区

const buf = Buffer.from('liuxin', 'ascii');
console.log(buf.toString('base64'));

// 创建一个长度为 10、且用 0 填充的 Buffer。
const buf1 = Buffer.alloc(10);

// 创建一个长度为 10、且用 0x1 填充的 Buffer。 
const buf2 = Buffer.alloc(10, 1);

// 创建一个长度为 10、且未初始化的 Buffer。
// 这个方法比调用 Buffer.alloc() 更快，
// 但返回的 Buffer 实例可能包含旧数据，
// 因此需要使用 fill() 或 write() 重写。
const buf3 = Buffer.allocUnsafe(10);

// 创建一个包含 [0x1, 0x2, 0x3] 的 Buffer。
const buf4 = Buffer.from([1, 2, 3]);

// 创建一个包含 UTF-8 字节 [0x74, 0xc3, 0xa9, 0x73, 0x74] 的 Buffer。
const buf5 = Buffer.from('tést');

// 创建一个包含 Latin-1 字节 [0x74, 0xe9, 0x73, 0x74] 的 Buffer。
const buf6 = Buffer.from('tést', 'latin1');

// 写入缓冲区
const buffer = Buffer.alloc(1024);
let len = buffer.write('刘鑫');
console.log(len)

// 读取数据
console.log(buffer.toString('utf-8', 0, 3))

//转换成JSON对象
const json = JSON.stringify(buf5);
console.log(json)

//缓冲区合并
var buffer3 = Buffer.concat([buffer,buf5]);
console.log("buffer3 内容: " + buffer3.toString());

// 缓冲区比较
const rejust = buf5.compare(buffer)
console.log(rejust)

// 拷贝缓冲区
buf5.copy(buffer, 6)
console.log(buffer.toString())

// 缓冲区裁剪
const slice = buffer.slice(0, 6)
console.log(slice.toString())

//缓冲区长度
console.log(buffer.length);