export default [
  {
    code: '1',
    url: '',
    name: '工作台',
    children: [
      {
        code: '11',
        url: 'work_bench/my_agent',
        name: '我的待办',
        children: [],
      },
    ],
  },
  {
    code: '2',
    url: '',
    name: '基础配置',
    children: [
      {
        code: '21',
        url: 'basic_config/my_account',
        name: '我方账户',
        children: [],
      },
      {
        code: '22',
        url: 'basic_config/trade_account',
        name: '往来账户',
        children: [],
      },
      {
        code: '23',
        url: 'basic_config/keep_information',
        name: '保管信息',
        children: [],
      },
      {
        code: '24',
        url: 'basic_config/rule_template',
        name: '规则模板',
        children: [],
      },
      {
        code: '25',
        url: 'basic_config/configuration_rule',
        name: '规则配置',
        children: [],
      },
      {
        code: '26',
        url: 'basic_config/authorization_config',
        name: '授权配置',
        children: [],
      },
    ],
  },
  {
    code: '3',
    url: '',
    name: '日常业务',
    children: [
      {
        code: '31',
        url: '',
        name: '现汇',
        children: [
          {
            code: '311',
            url: 'daily_business/cash/apply_payment',
            name: '付款申请',
            children: [],
          },
          {
            code: '312',
            url: 'daily_business/cash/cash_order',
            name: '付款查询',
            children: [],
          },
          {
            code: '313',
            url: '',
            name: '薪酬结算',
            children: [],
          },
          {
            code: '314',
            url: '',
            name: '资金调拨',
            children: [],
          },
          {
            code: '315',
            url: 'daily_business/cash/income_confirm',
            name: '收款确认',
            children: [],
          },
          {
            code: '316',
            url: 'daily_business/cash/pay_confirm',
            name: '付款确认',
            children: [],
          },
          {
            code: '317',
            url: 'daily_business/cash/abnormal_order',
            name: '异常申请',
            children: [],
          },
        ],
      },
    ],
  },
  {
    code: '4',
    url: '',
    name: '业务管理',
    children: [
      {
        code: '41',
        url: '',
        name: '现汇管理',
        children: [
          {
            code: '411',
            url: 'business_management/cash_management/transaction_detail',
            name: '交易明细',
            children: [],
          },
          {
            code: '412',
            url: '',
            name: '银企对账',
            children: [
              {
                code: '4121',
                url: 'business_management/cash_management/bank_account/subject',
                name: '科目余额初始化',
                children: []
              },
              {
                code: '4122',
                url: 'business_management/cash_management/bank_account/statement',
                name: '银行余额初始化',
                children: []
              },
              {
                code: '4123',
                url: 'business_management/cash_management/bank_account/balance',
                name: '银行流水录入',
                children: []
              },
              {
                code: '4124',
                url: 'business_management/cash_management/bank_account/check',
                name: '银行对账',
                children: []
              }
            ],
          },
        ]
      },
      {
        code: '42',
        url: '',
        name: '异常监控',
        children: [
          {
            code: '421',
            url: '',
            name: '到期未支付',
            children: [],
          },
          {
            code: '422',
            url: '',
            name: '逾期未确认',
            children: [],
          },
        ]
      },
      {
        code: '43',
        url: '',
        name: '信用管理',
        children: []
      },
    ],
  }
];
