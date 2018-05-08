import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import PageLoading from '../common/PageLoading';
// import './style.scss';

// 现汇管理模块
const LoadableCashManagement = Loadable({
  loader: () => import('./CashManagement'),
  loading: PageLoading
});

// 异常监控模块
const LoadableExceptionMonitor = Loadable({
  loader: () => import('./ExceptionMonitor'),
  loading: PageLoading
});

// 业务管理模块
class BusinessManagement extends React.Component {
  render() {
    return [
      <Route key={0} path={`${this.props.match.path}/cash_management`} component={LoadableCashManagement}></Route>,
      <Route key={1} path={`${this.props.match.path}/exception_monitor`} component={LoadableExceptionMonitor}></Route>,
    ];
  }
}

export default BusinessManagement;