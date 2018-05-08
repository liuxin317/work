### 模拟接口数据的json文件

orders - 查询现汇订单列表接口数据

abnormalOrders - 查询异常订单列表接口数据

incomeConfirmOrders - 查询收款确认订单列表接口数据

payConfirmOrders - 查询付款确认订单列表接口数据

paymentConfirmDetail - 收付款确认详情


### 使用方式

#### 直接引用

```
// 示例
import('../../../../json/abnormalOrders.json').then((re) => {
    //...
}
```


#### 使用json-server

1. npm i -g json-server

2. 将模拟数据添加到json-server.js中

3. json-server src\json\json-server.js -p 5000

```
// 示例
Util.comFetch(sendParam, (re)=>{
    //...
}, null, {method: 'get'}, 'http://localhost:5000/orders_abnormal');
```
