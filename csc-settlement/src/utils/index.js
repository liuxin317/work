import { comFetch, refStore } from './fetchUtil';
import * as comUtil from './commonUtil';

const utils = {
  // 通用fetch方法
  comFetch: comFetch,
  // 引用store
  refStore: refStore,

  getDropDownListUtil: comUtil.getDropDownListUtil,
  getIdListByValue: comUtil.getIdListByValue,
  getListByValue: comUtil.getListByValue,
  getValueListByList: comUtil.getValueListByList,
  getQueryString: comUtil.getQueryString,
  trans3LvlBankData: comUtil.trans3LvlBankData,
  getRealUrl: comUtil.getRealUrl,
  getSearchParam: comUtil.getSearchParam,
  formatBusTypeData: comUtil.formatBusTypeData,
  getOrgData: comUtil.getOrgData,
  // 数字转换为两位小数的格式
  num2Decimal: comUtil.num2Decimal,

};

export default utils;
