import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Router,
  Route,
} from 'react-router-dom';

import './style.scss';
import './config';
import { Modal } from 'antd';
import Nav from './components/common/Nav';
import Loading from './components/common/Loading';

// 工作台
import WorkBench from "./components/WorkBench";
// 基础配置
import BasicConfig from "./components/BasicConfig";
// 日常业务
import DailyBusiness from "./components/DailyBusiness";
// 业务管理
import BusinessManagement from "./components/BusinessManagement";

class App extends Component {
  constructor(props) {
    super(props);

    this.manualRedirect = this.manualRedirect.bind(this);
    this.state = {
      navData: []
    };
  }

  manualRedirect() {
    this.props.history.push('/test');
  }

  warning(text) {
    Modal.warning({
      title: '提示',
      content: text,
      zIndex: 10000
    });
  }

  componentWillMount() {
    // console.log('componentWillMount');
    let storage = window.localStorage;
    // this.setState({xxx: 124});
    Util.comFetch({
      systemName: "结算平台",
      addr: Api.getResourceTree,
      companyId: userInfo.companyRowId
    }, (data) => {
      let menuData = data.data.menu;
      if (process.env.NODE_ENV === 'production') {
        menuData = Util.getRealUrl(menuData);
      }
      // console.log('经过处理之后的菜单信息:', menuData);
      this.setState({ 'navData': menuData });
    });
    if (window.location.pathname === AppConf.routeRootPath) {
      this.props.history.push(AppConf.routeRootPath + "work_bench/my_agent");
    }
  }


  componentWillUpdate(nextProps) {
    if (nextProps.common.msg !== '' && this.props.common.msg === '') {
      this.warning(nextProps.common.msg);
    }
  }

  render() {
    const { common } = this.props;

    return (
      <Router history={this.props.history}>
        <div className="container">
          <Route path={AppConf.routeRootPath} render={(props) => (
            <Nav {...props} navData={this.state.navData}/>
          )}/>

          <Route path={AppConf.routeRootPath + "work_bench"} component={WorkBench}></Route>

          <Route path={AppConf.routeRootPath + "basic_config"} component={BasicConfig}></Route>

          <Route path={AppConf.routeRootPath + "daily_business"} component={DailyBusiness}></Route>

          <Route path={AppConf.routeRootPath + "business_management"} component={BusinessManagement}></Route>









{/*
          <Route exact path={AppConf.routeRootPath + "my_account"} component={MyAccount}></Route>

          <Route path={AppConf.routeRootPath + "my_account/add"} component={AddBankCard}></Route>

          <Route exact path={AppConf.routeRootPath + "trade_account"} component={TradeAccount}></Route>
          <Route path={AppConf.routeRootPath + "trade_account/add"} component={AddNewTradeAccount}></Route>

          <Route path={AppConf.routeRootPath + "settle_order"} component={SettleOrder}></Route>
          <Route path={AppConf.routeRootPath + "payment_confirm"} component={PaymentConfirm}></Route>


          <Route exact path={AppConf.routeRootPath + "trans_detail"} component={TransactionDetail}></Route>
          <Route path={AppConf.routeRootPath + "trans_detail/history"} component={TranscationHistory}></Route>
          <Route path={AppConf.routeRootPath + "trans_detail/ledger"} component={TranscationLedger}></Route>

          <Route path={AppConf.routeRootPath + "account_rule"} component={AccountRule}></Route>
          <Route path={AppConf.routeRootPath + "bank_account"} component={BankAccount}></Route>
      	  <Route path={AppConf.routeRootPath + "keep_information"} component={KeepInformation}></Route>
          <Route path={AppConf.routeRootPath + "my_agent"} component={MyAgent}></Route>
*/}


          <Loading show={common.loading}/>

          <div style={{ width: 0, height: 0, overflow: 'hidden' }}>
            <iframe title="download_iframe" id="download_iframe" src="" frameBorder="0"></iframe>
          </div>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    common: state.app.common
  };
};
export default connect(
  mapStateToProps
)(App);
