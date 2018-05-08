/**
 * Created by Summer on 2017/11/6.
 */
import React from 'react';
import Loadable from 'react-loadable';
import {Route} from 'react-router-dom';
import PageLoading from '../../common/PageLoading';
import AddModal from './AddModal';

// 按需加载的保管页面
const LoadableKeepInformation = Loadable({
    loader: () => import('./KeepInformation'),
    loading: PageLoading
});

// // 按需加载的保管页面
// const LoadableAddKeepInformation = Loadable({
//     loader: () => import('./AddKeepInformation'),
//     loading: PageLoading
// });

// 保管信息模块
class KeepInformations extends React.Component {
    render() {
        return (
            <div className="acc-rule">
                <Route path={`${this.props.match.path}`} component={LoadableKeepInformation}/>
                {/*<Route exact path={`${this.props.match.path}/add`} component={LoadableAddKeepInformation}/>*/}
                <Route exact path={`${this.props.match.path}/add`} component={AddModal}/>
            </div>
        );
    }
}
export default KeepInformations;