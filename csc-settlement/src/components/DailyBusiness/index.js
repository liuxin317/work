import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import PageLoading from '../common/PageLoading';
// import './style.scss';

// 现汇模块
const LoadableCash = Loadable({
  loader: () => import('./Cash'),
  loading: PageLoading
});


// 日常业务模块
class DailyBusiness extends React.Component {
  render() {
    return (
      <Route path={`${this.props.match.path}/cash`} component={LoadableCash}></Route>
    );
  }
}

export default DailyBusiness;