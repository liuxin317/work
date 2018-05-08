import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import PageLoading from '../../common/PageLoading';
import './style.scss';

// 付款查询(现汇订单)
const LoadableCashOrder = Loadable({
  loader: () => import('./CashOrder'),
  loading: PageLoading
});

// 异常订单已移动到 业务管理-异常监控
// // 异常订单
// const LoadableAbnormalOrder = Loadable({
//   loader: () => import('./AbnormalOrder'),
//   loading: PageLoading
// });

// 收款确认
const LoadableIncomeConfirm = Loadable({
  loader: () => import('./IncomeConfirm'),
  loading: PageLoading
});

// 付款确认
const LoadablePayConfirm = Loadable({
  loader: () => import('./PayConfirm'),
  loading: PageLoading
});

// 付款申请
const ApplyPayment = Loadable({
  loader: () => import('./ApplyPayment'),
  loading: PageLoading
});
//待支付处理
const PendingPaymentProcessing = Loadable({
    loader: () => import('./PendingPaymentProcessing'),
    loading: PageLoading
});

// 调拨申请
const ApplyAllocation = Loadable({
  loader: () => import('./ApplyAllocation'),
  loading: PageLoading
})

// 调拨查询
const AllocationSearch = Loadable({
  loader: () => import('./AllocationSearch'),
  loading: PageLoading
})

// 结算订单模块
class PaymentConfirm extends React.Component {
  render() {
    return (
      <div className="cash">
        <Route path={this.props.match.path + '/apply_payment'} component={ApplyPayment}></Route>
        <Route path={this.props.match.path + '/pending_payment'} component={PendingPaymentProcessing}></Route>
        <Route path={`${this.props.match.path}/cash_order`} component={LoadableCashOrder}></Route>
        <Route path={`${this.props.match.path}/income_confirm`} component={LoadableIncomeConfirm}></Route>
        <Route path={this.props.match.path + '/pay_confirm'} component={LoadablePayConfirm}></Route>
        <Route path={this.props.match.path + '/apply_allocation'} component={ApplyAllocation}></Route>
        <Route path={this.props.match.path + '/allocation_search'} component={AllocationSearch}></Route>
      </div>
    );
  }
}

export default PaymentConfirm;

