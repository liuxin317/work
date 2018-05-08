import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Loading from './container/ConnectLoad';
import { connect } from 'react-redux';
import Types from './actions/ActionType';
import { routeRootPath } from './components/common/method';
import loadable from 'react-loadable'; // 懒加载
import PreLoading from './components/common/Preloading';
import './common.scss';

// 头部导航
import Header from './components/common/header';
// 汇总查询
import AggregateQuery from './components/AggregateQuery';
// 个人汇总
import PersonalSummary from './components/PersonalSummary';
// 异常处理
import ExceptionHandling from './components/ExceptionHandling';



// 规则查询
const LoadableRule = loadable({
  loader: () => import('./components/AggregateQuery/rule'),
  loading: PreLoading
});

// 账户查询
const LoadableAccount = loadable({
  loader: () => import('./components/AggregateQuery/account'),
  loading: PreLoading
});

// 付款查询
const LoadablePayment = loadable({
  loader: () => import('./components/AggregateQuery/payment'),
  loading: PreLoading
});

// 个人查询
const LoadablePersonage = loadable({
  loader: () => import('./components/PersonalSummary/personage'),
  loading: PreLoading
});

// 退汇查询
// const LoadableReexchange = loadable({
//   loader: () => import('./components/AggregateQuery/reexchange'),
//   loading: PreLoading
// });

// 交易处理
const LoadableTransaction = loadable({
  loader: () => import('./components/ExceptionHandling/transaction'),
  loading: PreLoading
});

class App extends Component {
  state = {
    isPer: '', // 判断有无
    initOneMenu: ''
  }

  componentWillReceiveProps (nextProps) {
    let filterMenu = nextProps.filterMenu;
    
    let num = 0;

    // 初始化获取筛选过后的第一节点菜单
    if (filterMenu) {
      filterMenu.forEach(item => {
        if (item.active) {
          num++;
          if (num === 1) {
            let twoNum = 0;
            this.props.upMenuState(item.state);

            item.children.forEach(d => {
              if (d.active) {
                twoNum++;
                
                if (twoNum === 1) {
                  this.setState({
                    initOneMenu: d.url.match(/[^/]*$/)[0]
                  })
                }
              }
            });
          }
        };
      });

      this.setState({
        isPer: num ? true : false
      });
    }
  }

  render() {
    let IndexRoute = null;

    switch (this.state.initOneMenu) {
      case 'rule':
        IndexRoute = LoadableRule;
        break;

      case 'account':
        IndexRoute = LoadableAccount;
        break;

      case 'payment':
        IndexRoute = LoadablePayment;
        break;

      case 'personage':
        IndexRoute = LoadablePersonage;
        break;
    };

    return (
      <Router>
        <div className="App">
          <Loading />
          <Header />
          {/* 根据用户权限默认展示第一节点菜单 */}
          {
            this.state.isPer
            ?
            <Route path={ routeRootPath } component={ IndexRoute } exact />
            :
            ''
          }
          
          <Route path={ routeRootPath + "aggregate-query"} component={ AggregateQuery } />
          <Route path={ routeRootPath + "personal-summary"} component={ PersonalSummary } />
          <Route path={ routeRootPath + "exception-handling"} component={ ExceptionHandling } />
        </div>
      </Router>
    );
  }
}

// 获取初始化所在菜单
const mapStateToProps = (state) => {
  return {
    menuState: state.common.menuState,
    filterMenu: state.common.filterMenu
  }
}

// 输出初始化菜单
const mapDispatchToProps = (dispatch) => {
  return {
    upMenuState: (state) => { dispatch({ type: Types.MENU_STATE, payload: { menuState: state } }) }
  }
}

const ConnectApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default ConnectApp;
