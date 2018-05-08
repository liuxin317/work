import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import PageLoading from './../../../common/PageLoading';
import './style.scss';


// 银行流水录入
const LoadableBankBalance = Loadable({
  loader: () => import('./BankBalance'),
  loading: PageLoading
});
// 银行对账
const LoadableBankCheck = Loadable({
  loader: () => import('./BankCheck'),
  loading: PageLoading
});
// 银行余额初始化
const LoadableBankStatement = Loadable({
  loader: () => import('./BankStatement'),
  loading: PageLoading
});
// 科目余额初始化
const LoadableSubjectBalance = Loadable({
  loader: () => import('./SubjectBalance'),
  loading: PageLoading
});


// 银行对账模块
class BankAccount extends React.Component {
  render() {
    return (
      <div className="bank-account">
        <Route path={`${this.props.match.path}/balance`} 
          component={LoadableBankBalance}>
        </Route>
        <Route path={`${this.props.match.path}/check`} 
          component={LoadableBankCheck}>
        </Route>
        <Route path={`${this.props.match.path}/statement`} 
          component={LoadableBankStatement}>
        </Route>
        <Route path={`${this.props.match.path}/subject`} 
          component={LoadableSubjectBalance}>
        </Route>
      </div>
    );
  }
}

export default BankAccount;
