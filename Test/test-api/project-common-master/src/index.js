// 中文版
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'; // 让容器组件拿到store和dispath
import Store from './store/index';
import Type from './action/Type';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// IE Promise
import 'core-js/fn/promise';
// IE object.assign
import 'core-js/fn/object/assign';
// 为旧版本提供promise polyfill
require('es6-promise').polyfill();

Store.dispatch({ type: Type.LOAD_STATE, payload: { loading: true } });

ReactDOM.render(
  <Provider store={ Store }>
    <LocaleProvider locale={zh_CN}><App /></LocaleProvider>
  </Provider>, 
  document.getElementById('root')
);
registerServiceWorker();
