/**
 * Created by Summer on 2017/11/6.
 */
import React from 'react';
import Loadable from 'react-loadable';
import {Route} from 'react-router-dom';
import PageLoading from '../../../common/PageLoading';

// 按需加载的保管页面
const Main = Loadable({
    loader: () => import('./Main'),
    loading: PageLoading
});

// 按需加载的保管页面
const TransactionHistory = Loadable({
    loader: () => import('./TransactionHistory'),
    loading: PageLoading
});
// 保管信息模块
class KeepInformations extends React.Component {
    render() {
        return (
            <div className="acc-rule">
                <Route exact path={`${this.props.match.path}`} component={Main}/>
                <Route exact path={`${this.props.match.path}/history`} component={TransactionHistory}/>
            </div>
        );
    }
}
export default KeepInformations;