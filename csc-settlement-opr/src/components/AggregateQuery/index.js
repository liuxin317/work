import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import loadable from 'react-loadable'; // 懒加载
import PreLoading from '../common/Preloading';

// 规则查询
const LoadableRule = loadable({
  loader: () => import('./rule'),
  loading: PreLoading
});

// 账户查询
const LoadableAccount = loadable({
  loader: () => import('./account'),
  loading: PreLoading
});

// 账户查询下的交易明细
const LoadableTradeDetails = loadable({
    loader: () => import('./account/trade'),
    loading: PreLoading
});

// 付款查询
const LoadablePayment = loadable({
  loader: () => import('./payment'),
  loading: PreLoading
});

export default class AggregateQuery extends Component {
    render () {
        const { match } = this.props;

        return (
            <section className="aggregate-query">
                <Route path={`${match.path}/rule`} component={ LoadableRule } />
                <Route path={`${match.path}/account`} component={ LoadableAccount } />
                <Route path={`${match.path}/trade-details`} component={ LoadableTradeDetails } />
                <Route path={`${match.path}/payment`} component={ LoadablePayment } />
            </section>
        )
    }
}