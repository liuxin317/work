import $ from 'jquery';
require('../../style.css');

document.write('<h1>我是首页5</h1>');

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

fetch('/ServiceServlet', {
    method: "POST",
    body: formatParam({
        operType: 'updatePwd-exit',
        addr: 'getUserOperUrl',
        companyId: 2000,
    }),
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
})
.then(response => {
    return response.json();
})
.then(data => {
    
})