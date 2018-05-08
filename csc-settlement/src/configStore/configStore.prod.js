import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from '../reducers';

// 合并App和react-router的reducer
let combinedReducers = combineReducers(Object.assign({}, { app: reducer }));

// 带中间件的store函数
function configStore(initialState) {
  let store = createStore(combinedReducers, initialState,
    compose(
      applyMiddleware(
        thunkMiddleware
      )
    )
  );

  return store;
}

export default configStore;
