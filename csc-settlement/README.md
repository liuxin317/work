# 结算平台

### 项目简介

结算平台是云尚行的子项目，入口位于租户云单中，从租户云单跳转到结算平台时会将token和用户信息带过来。
结算平台基于react技术栈，项目用create-react-app创建，并ejec出配置做了一些自定义修改，主要涉及less、sass、和antd的一些配置。

### 模块说明

```
.
+-- config create-react-app生成的配置
+-- dist  打包输出目录
+-- public 模板文件目录、html直接引用文件(图片、库)目录
+-- scripts create-react-app生成的脚本
|
+-- src  源代码目录
|   +-- actions  redux actions
|   +-- components  react 组件
|   |   +-- WorkBench 工作台
|   |   |   +-- MyAgent 我的待办
|   |   |   +-- MyOrder 我的订单
|   |   |
|   |   +-- BasicConfig 基础配置
|   |   |   +-- AuthorizationConfig 授权配置
|   |   |   +-- ConfigurationRule 规则配置
|   |   |   +-- DefinitionRule 规则模板
|   |   |   +-- KeepInformations 保管信息
|   |   |   +-- MyAccount 我方账户
|   |   |   +-- TradeAccount 往来账户
|   |   |
|   |   +-- DailyBusiness 日常业务
|   |   |   +-- Cash 现汇
|   |   |       +-- AllocationSearch  调拨查询
|   |   |       +-- ApplyAllocation  调拨申请
|   |   |       +-- ApplyPayment 付款申请
|   |   |       +-- CashOrder  付款查询
|   |   |       +-- common 现汇模块通用组件
|   |   |       |   +-- AbandonDialog 结算单作废弹框(收款申请、付款查询)
|   |   |       |   +-- ExpireConfigDialog 逾期配置(收款确认、付款确认)
|   |   |       |   
|   |   |       +-- IncomeConfirm  收款确认
|   |   |       +-- PayConfirm  付款确认
|   |   |       +-- PendingPaymentProcessing 待支付处理
|   |   |
|   |   +-- BusinessManagement  业务管理
|   |   |   +-- CashManagement  现汇管理
|   |   |   |   +-- BankAccount 银企对账
|   |   |   |   |   +-- SubjectBalance 科目余额初始化
|   |   |   |   |   +-- BankStatement 银行余额初始化
|   |   |   |   |   +-- BankBalance 银行流水录入
|   |   |   |   |   +-- BankCheck 银行对账
|   |   |   |   |   
|   |   |   |   +-- TransactionDetail 交易明细
|   |   |   |       +-- TransactionHistory  交易记录查询
|   |   |   |       +-- TransactionLedger  总账查询
|   |   |   |
|   |   |   +-- ExceptionMonitor 异常监控
|   |   |   |   +-- AbnormalOrder 异常订单
|   |   |   |   +-- ExpireUncomfirmed 逾期未确认
|   |   |   |   +-- ExpireUnpaid 到期未支付
|   |   |   |
|   |   |   +-- CreditManagement 信用管理
|   |   |
|   |   +-- common  公用组件
|   |   |   +-- ListDetails 订单详情组件，用于付款申请、付款查询、异常订单、 我的待办等页面
|   |   |   +-- Nav 顶部导航
|   |   |   +-- Loading 接口请求中转圈
|   |   |   +-- PageLoading 页面加载中时显示的内容
|   |   |   +-- TreeDroplist 可多选的树形结构数据选择框
|   |   +
|   |
|   +-- configStore  redux store
|   +-- constants  一些常量数据
|   +-- imgs  css中引用的图片目录,url-loader处理
|   +-- json  模拟接口数据
|   +-- reducers  redux reducers
|   +-- utils  通用方法
|   +-- App.js  应用组件
|   +-- common.scss 全局通用样式
|   +-- config.js 全局通用配置
|   +-- index.js entry文件
|   +-- style.scss 全局样式
|   +-- vars.scss 全局通用scss变量
|   +-- vendors.js 配置打包到vendor包里面的模块
|
.


```

### 开发环境

启动开发：

> npm run start

打包:

> npm run build

关于接口访问:

在config.js中设置了全局对象AppConf，根据开发和生产环境配置了一些不同属性。
其中apiPath用于指定接口访问的地址，在开发环境时，接口统一访问这个地址http://localhost:8088/api 。
配置nginx监听8088端口，将这个地址proxy_pass到http://csza.chfcloud.com/csc-settlement/serviceServlet 。
参考nginx配置如下：

```
server {
    listen       8088;
    server_name  localhost;

    location /api {
        add_header 'Access-Control-Allow-Origin' 'http://localhost:3000' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With' always;
        
        proxy_pass http://csza.chfcloud.com/csc-settlement/serviceServlet;
    }
}
```

###关于开发环境的token

结算平台是从租户云单跳转过来的，结算平台本身并没有管理用户的注册登录。
结算平台的token信息是从租户云单跳转过来时通过url中的参数带过来的。
在本地开发时需要先打开租户云单csza.chfcloud.com（不管host是否指向本地都行）,点击结算平台，
会打开一个类似如下的链接：

> http://csza.chfcloud.com/csc-settlement/?token=a2c59d83f921a2f34d7f792c5519b518&companyId=4&userId=84&tenantId=1&companyRowId=3&orgCode=010010006&stamp=1515745041549

注意，测试环境访问上面这个地址时，地址栏会往前跳转到其他地址，点一下后退就可以了。
将url参数部分复制下来，放到localhost:3000后面，在浏览器中打开，像这样：

> http://localhost:3000?token=a2c59d83f921a2f34d7f792c5519b518&companyId=4&userId=84&tenantId=1&companyRowId=3&orgCode=010010006&stamp=1515745041549


### 项目中的全局变量

项目中的全局变量，命名规则约定采用首字母大写的驼峰，或全大写方式命名。
但由于历史原因，但项目中的全局变量命名并没有全部遵守约定。项目中的全局变量：
```
AppConf //应用全局配置
userInfo //用户信息
Util //通用方法
Api //接口地址
```

### 模拟接口数据

可以使用json-server来模拟接口数据，具体参见src/json/目录中的readme.md