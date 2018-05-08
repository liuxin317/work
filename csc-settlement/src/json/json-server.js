const abnormalOrders = require('./abnormalOrders.json');

module.exports = () => {
  const data = {
    // 异常订单列表
    'orders_abnormal': abnormalOrders
  };

  return data;
};
