import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import loadable from 'react-loadable'; // 懒加载
import PreLoading from '../common/Preloading';


// 个人查询
const LoadablePersonage = loadable({
  loader: () => import('./personage'),
  loading: PreLoading
});

export default class PersonalSummary extends Component {
    render () {
        const { match } = this.props;

        return (
            <section className="aggregate-query">
                <Route path={`${match.path}/personage`} component={ LoadablePersonage } />
            </section>
        )
    }
}