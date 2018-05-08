/* global CryptoJS */
// 对store的引用，用于在comFetch中dispatch action
let store = {};

// 格式化请求参数
function formatParam(param = {}) {
  let qArr = [];
  for (let k in param) {
    let val = param[k];
    if (typeof val !== 'string') {
      val = val + '';
    }
    qArr.push(encodeURIComponent(k) + '=' + encodeURIComponent(encryptByAES(val)));
    // qArr.push(encodeURIComponent(k) + '=' + encodeURIComponent(val));
  }
  return qArr.join('&');
}

// 检查http状态码
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.status + '.' + response.statusText);
    console.log(response.status);
    error.response = response;
    throw error;
  }
}

// 请求参数des加密
function encryptByDES(message) {
  var keyHex = CryptoJS.enc.Utf8.parse('4174a44b57636288bd8cb8a666bab217');
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}
window.encryptByDES = encryptByDES;

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
window.encryptByAES = encryptByAES;

/**
 * 请求接口的方法，一般接口请求通用，对fetch方法进行了一层简单封装。
 * @param param 请求参数
 * @param succ 成功回调
 * @param fail 失败回调
 * @param option 请求参数
 * @param url 请求地址
 */
function comFetch(param, succ, fail, option = {}, url) {
  let fetchUrl = url || AppConf.apiPath;
  let method = option.method ? option.method.toUpperCase() : 'POST';
  let sendPending = true;

  // 接口请求发起时，默认发送统一的pending。option中传入noPending可以阻止发送。
  if (option && option.noPending) {
    sendPending = false;
  }
  if (sendPending) {
    store.dispatch({
      type: 'COM_LOADING_STATUS_UPDATE',
      status: 'pending'
    });
  }

  // 设置请求头
  let fetchOption = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: method
  };

  // 请求带上cookie
  fetchOption['credentials'] = 'include';


  if (param) {
    if (method === 'GET') {
      fetchUrl += '?' + formatParam(param);
    } else {
      if (typeof param === 'string') {
        fetchOption['body'] = param;
      } else {
        // 接口地址都是api，添加_x=addr参数，方便本地开发时查看接口
        if (fetchUrl === AppConf.apiPath) {
          fetchUrl += '?_x=' + param.addr;
        }
        param.token = userInfo.token;
        param.tenantId = userInfo.tenantId;
        if (!param.companyId) {
          param.companyId = userInfo.companyId;
        }
        fetchOption['body'] = '_y=' + JSON.stringify(param) + '&' + formatParam(param);
        // if (process.env.NODE_ENV === 'development') {
        //   fetchOption['body'] = '_y=' + JSON.stringify(param) + '&' + formatParam(param);
        // } else {
        //   fetchOption['body'] = formatParam(param);
        // }
      }
    }
  }

  fetch(fetchUrl, fetchOption)
    .then(checkStatus)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      if (sendPending) {
        store.dispatch({
          type: 'COM_LOADING_STATUS_UPDATE',
          status: 'succ',
          msg: json.errorMessage || ''
        });
      }
      /**
       * 异常状态码在业务逻辑中单独处理：
       * 100161 银行明细录入 API: getAccountListByKeyword
       */
      if (json.rspCode === '000000' || json.rspCode === '100161') {
        succ && succ(json);
      } else {
        if (fail) {
          fail(json.rspDesc);
        } else {
          store.dispatch({
            type: 'COM_SET_ALERT_MSG',
            msg: json.rspDesc
          });
        }
      }
    }, function (error) {
      if (sendPending) {
        store.dispatch({
          type: 'COM_LOADING_STATUS_UPDATE',
          status: 'fail',
          msg: '喔唷，崩溃啦！'
        });
      }
      fail && fail(error.message);
    });
}

// 引用store
function refStore(reduxStore) {
  store = reduxStore;
}

export {
  comFetch,
  refStore
};
