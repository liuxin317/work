import React from 'react';
import ReactDOM from 'react-dom';
// import { AppContainer } from 'react-hot-loader';
import createBrowserHistory from 'history/createBrowserHistory';

// IE Promise
import 'core-js/fn/promise';
// IE object.assign
import 'core-js/fn/object/assign';
// polyfill
import "whatwg-fetch";

import App from './App';
import configStore from './configStore';

// utils
import util from './utils';
import apiData from './constants/apiData.js';


window.Util = util;
window.Api = apiData;

// 热加载参考
// https://github.com/gaearon/react-hot-boilerplate/tree/next
// https://webpack.js.org/guides/hot-module-replacement/
// https://github.com/facebookincubator/create-react-app/issues/2317

const history = createBrowserHistory();
const store = configStore();

// 安全部测试，暴露导航对象到全局环境
window.innerNav = history;

util.refStore(store);

const rootEle = document.getElementById('root');

ReactDOM.render(<App history={history} store={store} />, rootEle);

// const render = (Component) => {
//   ReactDOM.render(
//     <AppContainer>
//       <Component history={history} store={store}></Component>
//     </AppContainer>,
//     rootEle
//   );
// };

// render(App);

// if (module.hot) {
//   module.hot.accept('./App', () => {
//     render(App);
//   });
// }
