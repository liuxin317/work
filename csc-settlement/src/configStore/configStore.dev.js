import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from '../reducers';

// 合并reducer
let combinedReducers = combineReducers(Object.assign({}, { app: reducer }));

// 带中间件的store函数
function configStore(initialState) {
  let store = createStore(combinedReducers, initialState,
    compose(
      applyMiddleware(
        thunkMiddleware
      ),
      window.devToolsExtension ? window.devToolsExtension() : f => f // chrome扩展redux调试工具
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextCombinedReducers = combineReducers(Object.assign({}, { app: reducer }));
      store.replaceReducer(nextCombinedReducers);
    });
  }

  return store;
}

export default configStore;
