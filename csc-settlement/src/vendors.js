// module.exports = [
//   'react',
//   'react-dom',
//   // vendor中不包含antd，因为antd做了按需加载，包含 antd会打包完整的antd
//   // 'antd'
// ];

// 打包到vendor中的模块
module.exports = [
  'react',
  'react-dom',
  'react-router-dom',
  'redux',
  'react-redux',
  'react-loadable',
  'whatwg-fetch',
  'core-js',
  'bankcardinfo',
  'object-assign',
];
