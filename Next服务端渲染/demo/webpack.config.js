var CleanWebpackPlugin = require('clean-webpack-plugin'); // 打包之前自动删除之前打包的内容
var path = require('path');

module.exports = {
    mode: "production",
    entry: {
        index: './pages/index.js',
        details: './pages/details.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'), // 所有输出文件的目标路径
        filename: "[name][hash].js", // 输出模块的文件名
        publicPath: "", //输出解析文件目录，url相对于html
    },
    module: {
        // 关于模块配置
        rules: [
            // 模块规则（配置 loader、解析器等选项）
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    plugins:[
        new CleanWebpackPlugin(['dist'])
    ],
    devServer: {
        port: '3000', // 请求的端口号
        proxy: [{ // 如果要将多个特定路径代理给同一个目标，可以使用具有上下文属性的一个或多个对象的数组：
            context: ["/ServiceServlet"],
            target: "http://csza.chfcloud.com",
            "changeOrigin": true, // 转发时一定要添加此属性，允许跨域
            "secure": false
        }],
        open: true, // 自动打开页面
    }
}