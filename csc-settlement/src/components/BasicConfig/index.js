import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import PageLoading from '../common/PageLoading';
import './style.scss';

// 我方账户
const LoadableMyAccount = Loadable({
  loader: () => import('./MyAccount'),
  loading: PageLoading
});

// 往来账户
const LoadableTradeAccount = Loadable({
  loader: () => import('./TradeAccount'),
  loading: PageLoading
});

// 保管信息
const LoadableKeepInformations = Loadable({
  loader: () => import('./KeepInformations'),
  loading: PageLoading
});

// 规则模板(原规则定义)
const LoadableRuleTemplate = Loadable({
  loader: () => import('./DefinitionRule'),
  loading: PageLoading
});

// 规则配置
const LoadableConfigurationRule = Loadable({
  loader: () => import('./ConfigurationRule'),
  loading: PageLoading
});

// 授权配置
const AuthorizationConfig = Loadable({
  loader: () => import('./AuthorizationConfig'),
  loading: PageLoading
});


// 结算订单模块
class BasicConfig extends React.Component {
  render() {
    return (
      <div className="payment-confirm settle-order cash">
        <Route path={`${this.props.match.path}/my_account`} component={LoadableMyAccount}></Route>
        <Route path={this.props.match.path + '/trade_account'} component={LoadableTradeAccount}></Route>
        <Route path={`${this.props.match.path}/keep_information`} component={LoadableKeepInformations}></Route>
        <Route path={`${this.props.match.path}/rule_template`} component={LoadableRuleTemplate}></Route>
        <Route path={`${this.props.match.path}/configuration_rule`} component={LoadableConfigurationRule}></Route>
        <Route path={`${this.props.match.path}/authorization_config`} component={AuthorizationConfig}></Route>
      </div>
    );
  }
}``

export default BasicConfig;