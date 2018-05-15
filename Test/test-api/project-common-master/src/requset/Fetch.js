import { message } from 'antd';
import Types from '../action/Type';
import Store from '../store';

// 格式化请求参数
function formatParam(param = {}) {
    let qArr = [];

    for (let k in param) {
        let val = param[k];
        if (typeof val !== 'string') {
            val = val.toString();
        }
        qArr.push(encodeURIComponent(k) + '=' + encodeURIComponent(val));
    }
    return qArr.join('&');
}

/**
 * 
 * @url {*请求的地址} url 
 * @method {*请求的方式，POST, GET} method 
 * @param {*请求参数} params 
 * @successBack {*成功的回调} successBack 
 * @errorBack {*失败的回调} errorBack 
 */
function httpRequest (url, method, params, successBack, errorBack = null) {
    Store.dispatch({ type: Types.LOAD_STATE, payload: { loading: true } });

    let newOptions = {};

    if (method === 'GET') { // 区分请求方式传参方式不一样
        url = url + '?' + formatParam(params);
    } else {
        params = formatParam(params);
        newOptions.body = params;
    }

    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        ...newOptions
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        Store.dispatch({ type: Types.LOAD_STATE, payload: { loading: false } });

        successBack && successBack(data);
    })
    .catch(error => {
        Store.dispatch({ type: Types.LOAD_STATE, payload: { loading: false } });

        message.error('喔唷，崩溃啦！');
        errorBack && errorBack();
    })
}

export default httpRequest;