parse 将网址解析成为对象

url.parse('https://www.imooc.com/course/list', true, true)
// 1 - 域名 2 - 接受的参数是否是转化对象 3 - 是否需要带上协议

{
  protocol: 'https:', // 协议
  slashes: true, // 是否有双斜线
  auth: null,
  host: 'www.imooc.com', // 域名
  port: null, // 端口号
  hostname: 'www.imooc.com', // 主机名
  hash: null, 
  search: null, // 查询字符串参数
  query: null, // 发送http数据
  pathname: '/course/list', // 资源路径名
  path: '/course/list', // 路径
  href: 'https://www.imooc.com/course/list' }