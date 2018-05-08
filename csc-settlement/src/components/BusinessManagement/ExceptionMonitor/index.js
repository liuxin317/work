import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import PageLoading from '../../common/PageLoading';
import './style.scss';

// 异常订单
const LoadableAbnormalOrder = Loadable({
  loader: () => import('./AbnormalOrder/index.js'),
  loading: PageLoading
});

// 逾期未确认
const LoadableExpireUncomfirmed = Loadable({
  loader: () => import('./ExpireUncomfirmed'),
  loading: PageLoading,
});

// 到期未支付
const LoadableExpireUnpaid = Loadable({
  loader: () => import('./ExpireUnpaid'),
  loading: PageLoading,
});

// 异常监控模块
class ExceptionMonitor extends React.Component {
  render() {
    return (
      <div className="exception-monitor">
        <Route path={`${this.props.match.path}/abnormal_order`} component={LoadableAbnormalOrder}></Route>
        <Route path={`${this.props.match.path}/expire_unconfirmed`} component={LoadableExpireUncomfirmed}></Route>
        <Route path={`${this.props.match.path}/expire_unpaid`} component={LoadableExpireUnpaid}></Route>
      </div>
    );
  }
}

export default ExceptionMonitor;
