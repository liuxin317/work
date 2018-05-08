import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import PageLoading from '../common/PageLoading';
// import './style.scss';

// 我的待办(代办)?
const LoadableMyAgent = Loadable({
  loader: () => import('./MyAgent'),
  loading: PageLoading
});

// 我的订单
const LoadableMyOrder = Loadable({
  loader: () => import('./MyOrder'),
  loading: PageLoading
});

// 我的已办
const LoadableMyTodo = Loadable({
  loader: () => import('./MyTodo'),
  loading: PageLoading
})


// 工作台模块
class WorkBench extends React.Component {
  render() {
    return (
      <div className="workbench">
        <Route path={`${this.props.match.path}/my_agent`} component={LoadableMyAgent}></Route>
        <Route path={`${this.props.match.path}/my_order`} component={LoadableMyOrder}></Route>
        <Route path={`${this.props.match.path}/my_todo`} component={LoadableMyTodo}></Route>
      </div>
    );
  }
}

export default WorkBench;