import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import loadable from 'react-loadable'; // 懒加载
import PreLoading from '../common/Preloading';

// 异常处理
const LoadableTransaction = loadable({
    loader: () => import('./transaction'),
    loading: PreLoading
});

export default class ExceptionHandling extends Component {
    render () {
        const { match } = this.props;

        return (
            <section className="aggregate-query">
                <Route path={`${match.path}/transaction`} component={ LoadableTransaction } />
            </section>
        )
    }
}
