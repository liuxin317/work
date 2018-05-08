// 中文版
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Store from './store/CreateStore';
import { Provider } from 'react-redux'; // 可以让容器组件拿到state,dispatch
import registerServiceWorker from './registerServiceWorker';

// IE Promise
import 'core-js/fn/promise';
// IE object.assign
import 'core-js/fn/object/assign';
// 为旧版本提供promise polyfill
require('es6-promise').polyfill(); 

ReactDOM.render(
    (
        <Provider store={ Store }>
            <LocaleProvider locale={zh_CN}><App /></LocaleProvider>
        </Provider>
    ), 
    document.getElementById('root')
);

registerServiceWorker();
