/**
 * 从后台接口返回数据,转换下拉框数据
 * @param array
 */
export function getDropDownListUtil(array) {
  return array.map((object, index) => {
    let newData = {};
    newData.code=object.dictCode;
    newData.key = object.dictId + '';
    newData.value = object.dictName;
    return newData;
  });
}

/**
 * 根据
 * @param checkList [兴业银行, 工商银行] 选中的列表
 * @param valueList [{key:1,value:兴业银行},{key:2,value:工商银行},{key:3,value:农业银行}] 数据源
 * 返回: [1,2]
 */
export function getIdListByValue(checkList, valueList) {
  let reList = [];
  checkList.forEach((outterStr) => {
    return valueList.some((innerObj) => {
      if (outterStr === innerObj.value) {
        reList.push(innerObj.key);
        return true;
      }
      return false;
    });
  });
  return reList;
}


/**
 * 根据
 * @param checkList [兴业银行, 工商银行] 选中的列表
 * @param valueList [{key:1,value:兴业银行},{key:2,value:工商银行},{key:3,value:农业银行}] 数据源
 * 返回: [{key:1,value:兴业银行},{key:2,value:工商银行}]
 */
export function getListByValue(checkList, valueList) {
  let reList = [];
  valueList.forEach((outerObject, index) => {
    checkList.forEach((innerObject) => {
      if (innerObject === outerObject.name) {
        reList.push(outerObject);
      }
    });
  });
  return reList;
}

/**
 * create by james  2017年08月16日15:58:59
 * @param valueList [{key:1,value:兴业银行},{key:2,value:工商银行}] 数据源
 * 返回: ["兴业银行","工商银行"]
 */
export function getValueListByList(valueList) {
  let reList = [];
  if (valueList) {
    valueList.forEach((item, index) => {
      reList.push(item.value + '');
    });
  }
  return reList;
}

/**
 * create by james  2017年08月16日15:58:45
 * @param   name query 参数获取    http://baidu.com?id=124
 * 调用getQueryString('id')
 * 返回 124
 */
export function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}


/**
 * 将后台返回的['银行，支行，卡号', ...]数组，转换三级银行，支行，卡号级联数据
 * from:
 * [
 *   "兴业银行,游仙区支行,117010100100197137",
 *   "兴业银行,游仙区支行,117010100100000177",
 *   "工商银行,xxx支行,99999999999",
 * ]
 * to:
 * [
 *   {
 *     name: '兴业银行',
 *     children: [
 *       {
 *         name: '游仙区支行',
 *         children: [
 *           {
 *              name: '117010100100197137'
 *           },
 *           ...
 *         ]
 *       },
 *       ...
 *     ]
 *   },
 *   ...
 * ]
 *
 */
// 银行-支行-卡号:账户名
// 银行-账户名-卡号:支行
export function trans3LvlBankData(list) {
  let objList = [];
  // 辅助对象，记录是否处理过相同数据
  let helpObj = {};
  // 辅助对象，记录银行，支行在数组中的序号
  let indexMap = {};
  let bankIndex = 0;
  let subIndex = 0;

  for (let i = 0; i < list.length; i++) {
    let [bank, sub, acc, accName, ...more] = list[i].split(',');
    let obj = {};

    if (!helpObj[bank]) {
      // 如果是未设置的银行，添加一条银行数据
      helpObj[bank] = {
        [sub]: {
          [acc]: true
        }
      };
      // subIndex = 0;
      // indexMap[bank] = bankIndex;
      // indexMap[bank + '_' + sub] = subIndex;
      // bankIndex += 1;
      // subIndex += 1;
      obj = {
        name: bank,
        children: [
          {
            name: sub,
            children: [
              {
                name: acc,
                accName: accName,
                more: more
              }
            ]
          }
        ]
      };
      objList.push(obj);

      bankIndex = objList.length - 1;
      indexMap[bank] = bankIndex;
      indexMap[bank + '_' + sub] = objList[bankIndex].children.length - 1;
    } else if (!helpObj[bank][sub]) {
      // 如果是未设置的支行，在所属银行的children中添加一条支行数据
      helpObj[bank][sub] = {
        [acc]: true
      };
      // indexMap[bank + '_' + sub] = subIndex;
      // subIndex += 1;
      obj = {
        ['name']: sub,
        ['children']: [
          {
            ['name']: acc,
            ['accName']: accName,
            ['more']: more
          }
        ]
      };
      bankIndex = indexMap[bank];
      objList[bankIndex]['children'].push(obj);
      subIndex = objList[bankIndex].children.length - 1;
      indexMap[bank + '_' + sub] = subIndex;
    } else if (!helpObj[bank][sub][acc]) {
      // 如果是未设置过的卡号，在所属银行的所属支行的children中添加一条卡号数据
      obj = {
        ['name']: acc,
        ['accName']: accName,
        ['more']: more
      };
      objList[indexMap[bank]]['children'][indexMap[bank + '_' + sub]]['children'].push(obj);

    }
  }
  return objList;
}

/**
 * 在测试环境和本地环境使用的URL 不一样,测试环境的URL需要添加/csc-settlement
 */
export function getRealUrl(menuData) {
  return menuData;
  // 新配置了菜单路径，不再需要处理了
  // return menuData.map((item, index) => {
  //   if (item.url.indexOf('/csc-settlement') !== 0) {
  //     // item.url = item.url.replace('csc-settlement/', '');
  //     item.url = '/csc-settlement' + item.url;
  //   }
  //   if (item.children) {
  //     getRealUrl(item.children);
  //   }
  //   return item;
  // })
}

/**
 * 
 * @param date
 * @param offsetDays
 * @param end
 * @returns {Date}
 */
export function getDayTime(date, offsetDays, end) {
  let y = date.getFullYear();
  let m = date.getMonth();
  let d = date.getDate();
  if (offsetDays) {
    d += offsetDays;
  }
  if (end) {
    d += 1;
  }
  var dateNew = new Date(y, m, d);
  return dateNew;
}

/**
 * 从location.search中获取参数值
 * @param name 制定的参数名,如果不传,返回包含全部参数的对象
 * @returns {*}
 */
export function getSearchParam(name) {
    let params = window.location.search.replace(/^\?/, '').split('&');
    let re = {};
    params.forEach((item) => {
        if (item !== '') {
            let keyVal = item.split('=');
            re[keyVal[0]] = keyVal[1];
        }
    });
    if (!name) {
        return re;
    } else {
        return re[name];
    }
}


/**
 * 格式化接口返回的业务类型数据，转换为适合treeSelect使用的格式
 * @param data
 */
export function formatBusTypeData(data) {
  let re = [];
  recursivelyProcess(data, re);
  return re;

  function recursivelyProcess(rawData, reData) {
    rawData.forEach((item, index) => {
      let tmp = {
        id:item.id,
        label: item.name,
        value: item.orderTypeCode,
        children: []
      };
      if (item.children && item.children.length) {
        recursivelyProcess(item.children, tmp.children);
      }
      reData.push(tmp);
    });
  }
}/**
 * 格式化接口返回的组织机构数据，转换为适合treeSelect使用的格式
 * @param data
 */
export function getOrgData(data) {
  let re = [];
  recursivelyProcess(data, re);
  return re;

  function recursivelyProcess(rawData, reData) {
    rawData.forEach((item, index) => {
      let tmp = {
        id:item.id,
        label: item.name,
        value: item.code,
        children: []
      };
      if (item.children && item.children.length) {
        recursivelyProcess(item.children, tmp.children);
      }
      reData.push(tmp);
    });
  }
}

/**
 * 数字转换为保留两位小数字符串，用于显示
 * @param num
 * @returns {string}
 */
export function num2Decimal(num) {
  var np = '';
  if (num < 0) {
    np = '-';
    num = Math.abs(num);
  }
  num = Math.round(num * 100).toString();
  while (num.length < 3) {
    num = '0' + num;
  }
  return np + num.replace(/(\d{2})$/, '.$1');
}
