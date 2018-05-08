import { message } from 'antd';
import Types from '../actions/ActionType';
import Store from '../store/CreateStore';
import { setCookie, getCookie, getURLValue } from '../components/common/method';

// 初始进入页面获取并存储用户TOKEN
if (window.location.search) {
    setCookie('TOKEN', getURLValue('token'));
    setCookie('ID', getURLValue('id'));
    setCookie('openId', getURLValue('openId'));
};

// 获取TOKEN;
let TOKEN = getCookie('TOKEN');
let ID = getCookie('ID');
let CryptoJS = window.CryptoJS;

// 格式化请求参数
function formatParam(param = {}) {
    let qArr = [];
    qArr.push('_y=' + encodeURIComponent(JSON.stringify(param)));

    for (let k in param) {
        let val = param[k];
        if (typeof val !== 'string') {
            val = val.toString();
        }
        qArr.push(encodeURIComponent(k) + '=' + encodeURIComponent(encryptByAES(val)));
    }
    return qArr.join('&');
}

// 请求参数des加密
// function encryptByDES(message) {
//     var keyHex = CryptoJS.enc.Utf8.parse('4174a44b57636288bd8cb8a666bab217');
//     var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//     });
//     return encrypted.toString();
// }

// 请求参数aes加密
function encryptByAES(message) {
    var keyHex = CryptoJS.enc.Utf8.parse('aabbccddeeffgghh');
    var encrypted = CryptoJS.AES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: CryptoJS.enc.Utf8.parse('aabbccddeeffgghh')
    });
    return encrypted.toString();
}

/**
 * 
 * @url {*请求的地址} url 
 * @method {*请求的方式，默认POST} method 
 * @param {*请求参数} params 
 * @successBack {*成功的回调} successBack 
 * @errorBack {*失败的回调} errorBack 
 */
function httpRequest (params, successBack, url = '/csc-settlement-opr/serviceServlet', method = "POST", errorBack = null) {
    Store.dispatch({ type: Types.LOAD_STATE, payload: { LoadState: true } });

    let obj = {};
    params.token = TOKEN;
    params.ID = ID;

    if (method === 'GET') { // 区分请求方式传参方式不一样
        url = url + '?' + formatParam(params);
    } else {
        params = formatParam(params);
        obj.body = params;
    }

    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        ...obj
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        Store.dispatch({ type: Types.LOAD_STATE, payload: { LoadState: false } });

        if (data.rspCode === '000000') {
            successBack && successBack(data);
        } else if (data.rspCode === '100004') { // 100004是Token失效状态吗,要做跳转处理
            message.warning(data.rspDesc);
        } else {
            message.warning(data.rspDesc);
        }
    })
    .catch(error => {
        Store.dispatch({ type: Types.LOAD_STATE, payload: { LoadState: false } });

        message.error('喔唷，崩溃啦！');
        errorBack && errorBack();
    })
}

export default httpRequest;