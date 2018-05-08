(function () {

  // 静态文件路径
  let contextPath = '/dist/';
  // 路由根路径
  let routeRootPath = '/';
  // 接口路径
  let apiPath = 'http://localhost:8088/api';
  let imageApiPath = 'http://localhost:8088/imgapi';
  let fileApiPath = 'http://localhost:8088/fileapi';

  // 生产环境配置
  if (process.env.NODE_ENV === 'production') {
    contextPath = '/csc-settlement/';
    routeRootPath = '/csc-settlement/';
    apiPath = '/csc-settlement/serviceServlet';
    imageApiPath = '/csc-settlement/imgUploadServlet';
    fileApiPath = '/csc-settlement/fileUploadServlet';
  }

  // 上传文件后提交文件地址到服务器时,文件路径拼装IP,根据地址栏url不同采用不同ip地址前缀
  let uploadFilePathIp = '';
  if (window.location.href.indexOf('ysx.sunscloud.com') > -1) {
    uploadFilePathIp = window.location.protocol + '//10.4.68.16:8085';
  } else if (window.location.href.indexOf('csza.chfcloud.com') > -1) {
    uploadFilePathIp = window.location.protocol + '//10.4.68.7:8085';
  } else {
    uploadFilePathIp = window.location.protocol + '//10.4.68.7:8085';
  }

  // 下载地址前缀
  const downloadPrefix = window.location.host.indexOf('localhost') > -1 ?
    'http://csza.chfcloud.com/download/' :
    window.location.protocol + '//' + window.location.host + '/download/';


  let appConf = {
    info: 'app configure',
    apiPath: apiPath,
    imageApiPath: imageApiPath,
    fileApiPath: fileApiPath,
    contextPath: contextPath,
    routeRootPath: routeRootPath,
    uploadFilePathIp: uploadFilePathIp,
    downloadPrefix: downloadPrefix,
  };
  let userInfo = {
    token: '',
    tenantId: '',
    companyId: '',
    userId: '',
    orgCode:'',
    compName:'',
  };
  // 全局变量APP配置信息
  window.AppConf = appConf;
  // 全局变量用户信息
  window.userInfo = userInfo;
  initLoginState();
}());

/**
 * 初始化登录状态，先从location.search中取，如果没有再尝试从localStorage中取
 */
function initLoginState() {
  const keys = ['token', 'tenantId', 'companyId', 'companyRowId', 'userId','orgCode','compName'];
  let storage = window.localStorage;
  let infoObj = {};
  keys.every((key, index) => {
    return infoObj[key] = getQueryString(key);
  });
  let validInfo = keys.every((key, index) => {
    return infoObj[key];
  });

  if (!validInfo) {
    // 尝试从localStorage中读取
    try {
      infoObj = JSON.parse(storage.getItem('settle_login_info'));
      validInfo = keys.every((key, index) => {
        return infoObj[key];
      });
    } catch (e) {
      console.log('从localStorage读取结算平台用户信息失败');
      validInfo = false;
    }
    if (validInfo) {
      userInfo = infoObj;
    } else {
      alert('请重新登录');
    }
  } else {
    // location.search传入的最新信息写入localStorage
    storage.setItem('settle_login_info', JSON.stringify(infoObj));
    userInfo = infoObj;
  }

  // let token = getQueryString('token');
  // let tenantId = getQueryString('tenantId');
  // let companyId = getQueryString('companyId');
  // let companyRowId = getQueryString('companyRowId');
  // let userId = getQueryString('userId');
  //
  // //地址栏没有参数
  // if (!token || !tenantId || !companyId || !companyRowId || !userId) {
  //   let st_token, st_tenantId, st_companyId, st_companyRowId, st_userId;
  //   st_token = storage.getItem('st_token');
  //   st_tenantId = storage.getItem('st_tenantId');
  //   st_companyId = storage.getItem('st_companyId');
  //   st_companyRowId = storage.getItem('st_companyRowId');
  //   st_userId = storage.getItem('st_userId');
  //   if (st_token && st_tenantId && st_companyId && st_companyRowId && st_userId) {
  //     userInfo.token = st_token;
  //     userInfo.tenantId = st_tenantId;
  //     userInfo.companyId = st_companyId;
  //     userInfo.companyRowId = st_companyRowId;
  //     userInfo.userId = st_userId;
  //   }
  //   else {
  //     //跳转回租户云单
  //     alert('请重新登录');
  //     //location.href = 'http://csza.chfcloud.com/csc/index.html';
  //   }
  // }
  // //地址栏参数都有
  // else {
  //   storage.setItem('st_token', token);
  //   storage.setItem('st_tenantId', tenantId);
  //   storage.setItem('st_companyId', companyId);
  //   storage.setItem('st_companyRowId', companyRowId);
  //   storage.setItem('st_userId', userId);
  //
  //   userInfo.token = token;
  //   userInfo.tenantId = tenantId;
  //   userInfo.companyId = companyId;
  //   userInfo.companyRowId = companyRowId;
  //   userInfo.userId = userId;
  // }
}

function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let matches = window.location.search.substring(1).match(reg);
  if (matches != null) {
    return decodeURIComponent(matches[2]);
  }
  return null;
}
