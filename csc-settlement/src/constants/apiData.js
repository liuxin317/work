export default {
    //通用下拉框查询
    getDropdownList: "getDropdownList",
    //==========获取菜单============
    getResourceTree: "getResourceTree",
    //==========我的账户模块============
    //添加我的账户
    addMyAccount: "addMyAccount",
    //删除我的账户
    deleteMyAccount: "deleteMyAccount",
    //修改我的账户信息
    updateMyAccount: "updateMyAccount",
    //查询我账户
    getMyAccount: "getMyAccount",
    //根据id查询我的账户单个的值
    getMyAccountByAccountId: "getMyAccountByAccountId",
    //支付方式
    getPayChannel:"getPayChannel",
    //支持银行
    getSuportBank:"getSuportBank",
    //获取主账号
    getAccountNumbersBycategory:"getAccountNumbersBycategory",

    //==========往来对象模块============
    //添加交易对象
    addACAccount: "addACAccount",
    //删除我的交易对象
    deleteACAccount: "deleteACAccount",
    //修改我的交易对象
    updateACAccount: "updateACAccount",
    //查询交易对象
    getACAccount: "getACAccount",
    //根据id查询当个往来账户的值
    getACAccountByAccountId: "getACAccountByAccountId",
    //导出往来账户列表数据
    exportACAccount: "exportACAccount",

    //======往来账户改造=======
    //查询收支对象
    findCurrentCustomerByCondition:"findCurrentCustomerByCondition",
    //查询银行账号
    findCurrentCustomerBankByCondition:"findCurrentCustomerBankByCondition",
    //新增对象信息
    addCurrentCustomer:'addCurrentCustomer',
    //新增银行信息
    addCurrentCustomerBank:"addCurrentCustomerBank",
    //修改对象信息
    updateCurrentCustomer:"updateCurrentCustomer",
    //修改银行信息
    updateCurrentCustomerBank:"updateCurrentCustomerBank",
    //删除对象
    deleteCurrentCustomer:"deleteCurrentCustomer",
    //删除银行信息
    deleteCurrentCustomerBank:"deleteCurrentCustomerBank",
    //冻结银行信息
    freezeCurrentCustomerBank:"freezeCurrentCustomerBank",
    //冻结收支对象
    freezeCurrentCustomer:'freezeCurrentCustomer',
    //默认账户设置
    setDefaultAccount:"setDefaultAccount",


    //==========交易明细模块============
    //获取交易明细首页信息
    getAllAccount: "getAllAccount",
    //点击某个账户的交易明细信息查询
    getTransactionDetail: "getTransactionDetail",
    //导出交易历史记录明细
    exportTransactionDetail: "exportTransactionDetail",
    // 导出交易明细
    exportAllAccount: "exportAllAccount",

    //==========结算订单模块============
    // 获取结算订单
    orders: "orders",
    // 退回结算订单
    cancel: "cancel",
    // 支付结算订单
    pay: "pay",
    // 导出结算订单
    export: "export",
    // 冻结结算订单
    freeze: "freeze",
    // 解冻结算订单
    unfreeze: "unfreeze",
    // 冻结/解冻多条订单
    freezeMany: "freezeMany",
    // 废弃结算订单
    invalidOne: "invalidOne",
    // 批量废弃结算订单
    invalidMany: "invalidMany",
    // 结算订单支付弹框，获取付款方账户
    getPayerAccount: "getPayerAccount",
    // 付款申请-查询收款方账户(不查出已经冻结的账户)
    getPayeeAccountByCustomerName: "getPayeeAccountByCustomerName",
    // 待支付-退回
    cancelWaitcheck: "cancelWaitcheck",
    // 待支付-资金调拨退回
    returnCheck: "returnCheck",
    // 结算订单支付弹框，获取支付渠道
    getMyAccountByAccountNumber: "getMyAccountByAccountNumber",
    //导入往来账户的Excel
    importACAccount: "importACAccount",
    //导入我的账户Excel
    importMyAccount: "importMyAccount",
    //冻结账户
    freezeACAccount: "freezeACAccount",
    //获取模板地址
    getTempletAddress: "getTempletAddress",
    //总账记录
    getAllAccountTotal: "getAllAccountTotal",
    exportAccountTotal: "exportAccountTotal",

    //  ==============规则定义模块==========
    //刷新页面获取table信息
    getRuleDefine: "getRuleDefine",
    //编辑
    updateRuleDefine: "updateRuleDefine",
    //添加规则
    addRuleDefine: "addRuleDefine",
    //规则编辑获取数据
    getRuleDefineById: "getRuleDefineById",
    //删除规则
    deleteRuleDefine: "deleteRuleDefine",
    //详情
    getRuleDetailById: "getRuleDetailById",
    //=============规则配置模块============
    //获取往来对象名
    findCustomerNames: "findCustomerNames",
    saveRuleConf: "saveRuleConf",
    //表格搜索
    getRuleConf: "getRuleConf",
    //编辑规则配置
    findOneRuleConf: "findOneRuleConf",
    //删除规则配置
    deleteRuleConf: "deleteRuleConf",
    //规则冲突
    findConflictConf: "findConflictConf",
    //添加配置
    addRuleConf: "addRuleConf",
    // 获取收款方账户
    getPayeeAccount: "getPayeeAccount",
    // 异常订单-往来对象异常恢复
    recover: "recover",
    // 异常订单-获取规则
    getRuleDetailByOrderCode: "getRuleDetailByOrderCode",

    //==========收付款确认模块============
    //收款列表
    getReceivablesByKeyword: "getReceivablesByKeyword",
    //收款详情
    getDetail: "getDetail",
    //业务类型
    getOrderType: "getOrderType",
    // 上传图片到imgservice后，保存图片到结算平台后端
    uploadFiles: "uploadFiles",

    // 收款确认-在租户云单创建订单
    addBussOrder: "addBussOrder",
    // 收款确认-保存租户云单订单订单号
    saveOrderCode: "saveOrderCode",
    // 收款确认-导出
    exportReceivables: "exportReceivables",
    // 付款列表
    getPaymentByKeyword: "getPaymentByKeyword",
    // 付款确认-导出
    exportPayment: "exportPayment",
    // 逾期配置-查看逾期日期
    getExpireDays: "getExpireDays",
    // 逾期配置-设置逾期日期
    savaExpireDays: "savaExpireDays",
    // 逾期配置-获取逾期未确认列表
    getExpireTradeConfirmByKeyword: "getExpireTradeConfirmByKeyword",
    // 逾期配置-获取到期未支付列表
    getExpiredOrders: "getExpiredOrders",

    //==========保管信息模块========
    // 新增保管信息
    addCustodyInfo: "addCustodyInfo",
    //获取组织机构下拉树
    getOrgsOfTree: "getOrgsOfTree",
    //根据机构获取银行账号
    getMyAccountByOrg: "getMyAccountByOrg",
    //获取账号详情
    getMyAccountBypAccountNumber: "getMyAccountBypAccountNumber",
    //获取table数据
    findAllCustodyInfo: "findAllCustodyInfo",
    //冻结
    freezeCustody: "freezeCustody",
    //编辑保存
    updateCustody: "updateCustody",
    //日志
    findBycustodyInfoId: "findBycustodyInfoId",
    //获取编辑数据
    findCustodyById: "findCustodyById",
    //详情
    findUserOrgs: "findUserOrgs",
    //现汇订单详情变更记录
    OrderLog: "OrderLog",
}

