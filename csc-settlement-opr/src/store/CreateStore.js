import { createStore, combineReducers, applyMiddleware } from 'redux'; // combineReducers合并reducer, applyMiddleware中间件
import thunk from 'redux-thunk';
import common from '../reducer/common';

let store = createStore(combineReducers({
    common
}), applyMiddleware(thunk));

export default store;