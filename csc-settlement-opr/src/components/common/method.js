// 设置Cookie
function getCookie(name)
{
    var arr=document.cookie.split('; ');
    var i=0;
    for(i=0;i<arr.length;i++)
    {
        var arr2=arr[i].split('=');
         
        if(String(arr2[0])===String(name))
        {  
            var getC = decodeURIComponent(arr2[1]);
            return getC;
        }
    }
    
    return '';
}

// 获取cookie;
function setCookie(name, value, iDay) {
    var oDate=new Date();

    oDate.setDate(oDate.getDate()+iDay);

    document.cookie=name+'='+encodeURIComponent(value)+';expires='+oDate;
}

// 删除cookie;
function removeCookie(name) {
    setCookie(name, '1', -1);
}

// 截取URL的字符值
function getURLValue (name) {
    let search = window.location.search;
    let value = search.split(name)[1].split('=')[1];

    if (value.indexOf('&') > -1) {
        value = value.split('&')[0];
    }

    return value;
}

// 路由根路径
let routeRootPath = '/';

// 生产环境跟路径
if (window.location.hostname !== 'localhost') {
    routeRootPath = '/csc-settlement-opr/';
}

export { getCookie, setCookie, removeCookie, getURLValue, routeRootPath };