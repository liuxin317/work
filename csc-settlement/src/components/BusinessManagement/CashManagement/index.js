import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import PageLoading from '../../common/PageLoading';
// import './style.scss';

// 交易明细
const LoadableTransactionDetail = Loadable({
  loader: () => import('./TransactionDetail/index.js'),
  loading: PageLoading
});

// 银企对账
const LoadableBankAccount = Loadable({
  loader: () => import('./BankAccount/index.js'),
  loading: PageLoading
});

// 业务管理模块
class PaymentConfirm extends React.Component {
  render() {
    return (
      <div className="payment-confirm settle-order cash">
        <Route path={`${this.props.match.path}/transaction_detail`} component={LoadableTransactionDetail}></Route>
        <Route path={`${this.props.match.path}/bank_account`} component={LoadableBankAccount}></Route>
      </div>
    );
  }
}

export default PaymentConfirm;
