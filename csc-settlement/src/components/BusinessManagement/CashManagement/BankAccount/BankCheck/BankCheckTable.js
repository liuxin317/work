import React, { Component } from 'react';
import { Table, Checkbox, Tabs, Button, InputNumber, message } from 'antd';

const TabPane = Tabs.TabPane;

class BankCheckTable extends Component {

  state = {
    originalCompData: [], // 未对账公司缓存数据
    originalBankData: [], // 未对账银行缓存数据
    compData: [],
    bankData: [],
    accountData: {},
    startDate: '',
    endDate:'',
    activeKey: '0',
    backBatch: null,
    selectedCompRows: [], 
    selectedBankRows: [],
    compCheckAll: false, 
    bankCheckAll: false,
    compIndeterminate: false,
    bankIndeterminate: false,
    tableScroll: { x: '100%', y: 350 }
  }

  initState = () => {
    const { compData, bankData } = this.state;

    this.setState({
      compData: this.__setChecked(compData, false),
      bankData: this.__setChecked(bankData, false),
      selectedCompRows: [], 
      selectedBankRows: [],
      compCheckAll: false, 
      bankCheckAll: false,
      compIndeterminate: false,
      bankIndeterminate: false,
      backBatch: null
    });
  }

  // 切换tab标签页 key: 0未对账，1已对账
  tabChange = (key) => {
    this.setState({ 
      activeKey: key
    }, () => {
      this._getAccountCheckData({ type: Number(key) }).then(res => {
        if (key === '1') { // 缓存一份未对账数据，为批次过滤使用
          const { compData: originalCompData, bankData: originalBankData } = this.state;
          
          this.setState({ originalCompData, originalBankData });
        }
      });
    })
    this.initState();
  }

  // 公司列表表头
  getCompColumns = () => {
    let columns = [
      {
        title: '凭证日期',
        dataIndex: 'voucherTime',
        width: 120
      }, {
        title: '凭证号',
        dataIndex: 'voucherCode',
        width: 120
      }, {
        title: '已收金额',
        dataIndex: 'debitAmount',
        width: 100
      }, {
        title: '已付金额',
        dataIndex: 'creditAmount',
        width: 100
      }, {
        title: '摘要',
        dataIndex: 'summary'
      }
    ]

    return this.__getCoumns(columns, '1');
  }

  // 银行列表表头
  getBankColumns = () => {
    let columns = [
      {
        title: '日期',
        dataIndex: 'occerTime',
        width: 120,
        render: str => {
          let reg = /(\S*)\s/g;
          let arr = str.match(reg);

          if (arr) {
            return arr[0].trim();
          } else {
            return str;
          }
        }
      }, {
        title: '交易序号',
        dataIndex: 'transactionNo',
        width: 120
      }, {
        title: '已收金额',
        dataIndex: 'creditAmount',
        width: 100
      }, {
        title: '已付金额',
        dataIndex: 'debitAmount',
        width: 100
      }, {
        title: '摘要',
        dataIndex: 'useScope'
      }
    ]

    return this.__getCoumns(columns, '2');
  }

  // 获取表头
  __getCoumns = (columns, type) => {
    const { activeKey, backBatch,
      compCheckAll, bankCheckAll,
      compIndeterminate, bankIndeterminate
    } = this.state;

    // 操作列
    const opt = {
      title: (
        <div style={{textAlign: 'center'}}>
          <Checkbox indeterminate={type === '1' ? compIndeterminate : bankIndeterminate}
            checked={type === '1' ? compCheckAll : bankCheckAll}
            onChange={this.checkedAll.bind(this, type)} 
          />
          {/* 操作 */}
        </div>
      ),
      width: 40,
      render: (record) => {
        return (
          <div style={{textAlign: 'center'}}>
            <Checkbox
              checked={record.checked} 
              onChange={this.onSelectedRow.bind(this, type, record)} 
            />
          </div>
        )
      }
    }

    // 批次
    const batch = {
      title: '批次',
      dataIndex: 'batch',
      width: 50
    }

    // 已对账回退功能是opt和batch的组合
    let cols = [];

    if (/^\d+$/.test(backBatch)) {
      cols = [batch, opt]
    } else {
      cols = [batch];
    }
    
    switch (activeKey) {
      case '0': // 未对账
        columns.push(opt);
        break;
    
      case '1': // 已对账
        columns = columns.concat(cols);
        break;
    }
    
    return columns;
  }
  
  // 全选
  checkedAll = (type, e) => {
    const { compData, bankData, compBatch, bankBatch } = this.state;
    let checked = e.target.checked;
    let tempComp = [];
    let tempBank = [];

    switch (type) {
      case '1':
        this.setState({
          compData: this.__setChecked(compData, checked),
          compCheckAll: checked,
          compIndeterminate: false, // 全选或者全不选状态
          selectedCompRows: checked ? compData : []
        });
        break;
      case '2':
        this.setState({
          bankData: this.__setChecked(bankData, checked),
          bankCheckAll: checked,
          bankIndeterminate: false, // 全选或者全不选状态
          selectedBankRows: checked ? bankData : []
        })
        break;
    }
  }

  // 为数据添加checked属性
  __setChecked = (arr, flag) => {
    arr.forEach(item => {
      item.checked = flag;
    });

    return arr;
  }

  // 复选框操作
  onSelectedRow = (type, row) => {
    const { compData, bankData } = this.state;

    // type: '1'是企业勾选 '2'是银行勾选
    switch (type) {
      case '1':
        compData.forEach(item => {
          if (item.id === row.id) {
            item.checked = !item.checked;
          }
        });
        
        // 保存选中的企业
        const selectedCompRows = compData.filter(item => item.checked)

        this.__setCheckAllState('1', compData, selectedCompRows);
        this.setState({ compData, selectedCompRows })
        break;
    
      case '2':
        bankData.forEach(item => {
          if (item.id === row.id) {
            item.checked = !item.checked;
          }
        });

        // 保存选中的银行
        const selectedBankRows = bankData.filter(item => item.checked)

        this.__setCheckAllState('2', bankData, selectedBankRows);
        this.setState({ bankData, selectedBankRows })
        break;
    }
  }

  // 设置全选半选状态
  __setCheckAllState = (type, data, selectedData) => {
    const dLen = data.length; // 列表长度
    const sLen = selectedData.length; // 选中的长度

    switch (type) {
      case '1':
        if (sLen === 0) {
          this.setState({ compCheckAll: false, compIndeterminate: false });
        } else if (sLen < dLen) {
          this.setState({ compCheckAll: false, compIndeterminate: true });
        } else if (sLen === dLen) {
          this.setState({ compCheckAll: true, compIndeterminate: false });
        }
        break;
    
      case '2':
        if (sLen === 0) {
          this.setState({ bankCheckAll: false, bankIndeterminate: false });
        } else if (sLen < dLen) {
          this.setState({ bankCheckAll: false, bankIndeterminate: true });
        } else if (sLen === dLen) {
          this.setState({ bankCheckAll: true, bankIndeterminate: false });
        }
        break;
    }
  }

  // 保存对账数据：比对按钮type为0保存勾选数据，下一步按钮type为1保存所有数据
  checkCompare = (type) => {
    const { compData, bankData, selectedCompRows, selectedBankRows } = this.state;
    const compIdsArr = this.__getVoucher(compData, 'id');
    const bankIdsArr = this.__getFields(bankData, 'id');
    const selectedCompIdsArr = this.__getVoucher(selectedCompRows, 'id');
    const selectedBankIdsArr = this.__getFields(selectedBankRows, 'id');

    let voucherIds = '';
    let bankIds = '';

    switch (type) {
      case 0:
        voucherIds = JSON.stringify(selectedCompIdsArr);
        bankIds = selectedBankIdsArr.join(',');
        // 验证对账逻辑
        if (this.__checkFlag(selectedCompRows, selectedBankRows)) {
          this._saveAccountCheckRal({ voucherIds, bankIds, type }).then(res => {
            // 刷新未对账列表
            this._getAccountCheckData({ type });
          })
        }
        break;
      case 1:
        voucherIds = JSON.stringify(compIdsArr);
        bankIds = bankIdsArr.join(',');
        // 保存全部id，跳转到余额调节表
        this._saveAccountCheckRal({ voucherIds, bankIds, type }).then(res => {
          this.props.checkType(this.props.data);
        })
        break;
    }
  }

  /**
    需求原话：当前生产系统里对账，普通用户对账只要勾了银行的账，就必须 双方收一致且双方付一致；如果没有勾了银行的账，允许企业账借贷相减为0。 主管权限允许在勾了银行账的情况下，双方的 收/借-付/贷的余额一致就进行勾账
  */
  __checkFlag = (selectedCompRows, selectedBankRows) => {
    // 获取勾选数组
    const compCreditArr = this.__getFields(selectedCompRows, 'creditAmount');
    const compDebitArr = this.__getFields(selectedCompRows, 'debitAmount');
    const bankCreditArr = this.__getFields(selectedBankRows, 'creditAmount');
    const bankDebitArr = this.__getFields(selectedBankRows, 'debitAmount');
    // 计算数组内金额总合
    const compCreditTotal = !compCreditArr.length ? 0 : compCreditArr.reduce((prev, curr) => prev + curr);
    const compDebitTotal = !compDebitArr.length ? 0 : compDebitArr.reduce((prev, curr) => prev + curr);
    const bankCreditTotal = !bankCreditArr.length ? 0 : bankCreditArr.reduce((prev, curr) => prev + curr);
    const bankDebitTotal = !bankDebitArr.length ? 0 : bankDebitArr.reduce((prev, curr) => prev + curr);
  

    /**
     * 字段对应：
     *  公司已收：comp - debitAmount
     *  公司已付：comp - creditAmount
     *  银行已收：bank - creditAmount
     *  银行已付：bank - debitAmount
     * 
     * 对应关系：
     *  公司已收 - 银行已收     公司已付 - 银行已付
     * 
     * 普通用户权限：
     *  未勾选银行 compCreditTotal === compDebitTotal
     *  已勾选银行 compCreditTotal === bankDebitTotal && compDebitTotal === bankCreditTotal
     * 
     * 主管用户权限：
     *  已勾选银行：两边都勾选，满足支出金额和勾选金额相等
     */
    const auth = true; // 权限
    if (auth) { // 普通用户对账逻辑

      // 未勾选银行，企业单边对账
      if (selectedBankRows.length === 0) {
        if (compCreditTotal === compDebitTotal) {
          return true;
        } else {
          message.warning('单边对账支付和收入金额不相等');
          return false;
        }
      } 
      
      // 已勾选银行，混合对账
      if (selectedBankRows.length) {
        if (compCreditTotal === bankDebitTotal && compDebitTotal === bankCreditTotal) {
          return true;
        } else {
          message.warning('对应支付和收入金额不相等');
          return false;
        }
      }
    } else { // 主管用户对账逻辑
      
    }
  }
  
  // 获取选中字段的内容
  __getFields = (arr, key) => {
    return arr.map(item => {
      // 涉及到金额的字段单独处理: 货币型字符串转换成数字
      // 由于js小数计算精度问题，将金额放大100倍再进行计算逻辑
      if (key === 'creditAmount' || key === 'debitAmount') {
        return item[key] ? Number(item[key].replace(/,/g, '')) * 100 : 0;
      } else {
        return item[key];
      }
    });
  }

  // 获取接口所需的公司数据
  __getVoucher = (arr) => {
    return arr.map(item => {
      return {
        accItem: item.accItem,
        orderCode: item.orderCode,
        voucherCode: item.voucherCode
      }
    });
  }

  // 改变批次
  changeBatch = (type) => {
    const { originalCompData, originalBankData} = this.state;
    const compBatch = type ? this.__filterBy(originalCompData, 'batch', type) : originalCompData;
    const bankBatch = type ? this.__filterBy(originalBankData, 'batch', type) : originalBankData;

    this.initState();
    this.setState({ backBatch: type, compData: compBatch, bankData: bankBatch });
  }

  // 过滤批次
  __filterBy = (arr, key, value) => {
    return arr.filter(item => {
      return item[key] === value;
    });
  }

  // 回退批次
  goBankBatch = () => {
    const { startDate, endDate, backBatch, selectedCompRows, selectedBankRows } = this.state;

    // 获取勾选数组
    const selectedCompIdsArr = this.__getVoucher(selectedCompRows, 'id');
    const selectedBankIdsArr = this.__getFields(selectedBankRows, 'id');
    // 接口所需id字符串
    const voucherIds = JSON.stringify(selectedCompIdsArr);
    const bankIds = selectedBankIdsArr.join(',');

    // 验证对账逻辑
    if (this.__checkFlag(selectedCompRows, selectedBankRows)) {
      this._fallbackAccountCheckBatch({
        startDate,
        endDate,
        batch: backBatch,
        voucherIds,
        bankIds
      }).then(res => {
        // 刷新已对账列表
        this._getAccountCheckData({ type: 1 });
      });
    }
  }

  // 获取最小批次
  getMinBatch = () => {
    const { originalCompData, originalBankData } = this.state;
    const compBatchArr = this.__getFields(originalCompData, 'batch');
    const bankBatchArr = this.__getFields(originalBankData, 'batch');
    
    return Math.min.apply(null, compBatchArr.concat(bankBatchArr));
  }

  componentDidMount () {
    this._getAccountCheckData({ type: 0 });
  }

  // 手工对账数据请求 type类型：0未对账 1已对账
  _getAccountCheckData = (params) => {
    const { checkId, startDate, endDate } = this.props.data;
    const obj = Object.assign({
      recordId: checkId,
      startDate,
      endDate,
    }, params);

    return new Promise((resolve) => {
      Util.comFetch({
        addr: 'getAccountCheckData',
        ...obj
      }, res => {
        const { accountList, voucherList, myAccount, startDate, endDate } = res.data;

        resolve(res);
        this.setState({
          compData: this.__setChecked(voucherList, false), 
          bankData: this.__setChecked(accountList, false),
          accountData: myAccount,
          startDate,
          endDate
        });
        // 初始化state
        this.initState();
      });
    });
  }

  // 保存比对数据 type类型：0未对账 1已对账
  _saveAccountCheckRal = (params) => {
    const { accountId } = this.props.data;
    const { startDate, endDate } = this.state;
    const obj = Object.assign({
      accountId,
      startDate,
      endDate
    }, params);

    return new Promise((resolve) => {
      Util.comFetch({
        addr: 'saveAccountCheckRal',
        ...obj
      }, res => {
        // message.success('保存成功');
        resolve(res);
      });
    });
  }

  // 回退批次请求
  _fallbackAccountCheckBatch = (params) => {
    const { accountId } = this.props.data;
    const obj = Object.assign({ accountId }, params);

    return new Promise((resolve) => {
      Util.comFetch({
        addr: 'fallbackAccountCheckBatch',
        ...obj
      }, res => {
        resolve(res);
        this.initState();
      });
    });
  }

  render () {
    const { 
      compData, bankData, originalBankData, originalCompData, 
      accountData, selectedCompRows, selectedBankRows,
      backBatch, tableScroll
    } = this.state;
    const { accountName, accountNumber } = accountData;

    return (
      <Tabs type="card" onChange={this.tabChange}>
        <TabPane tab="未对上" key="0">
          <div className="bank-check-container">
            <div className="bank-check-table">
              <div className="bank-check-table__item">
                <p>　</p>
                <p>　</p>
                <Table rowKey="id" bordered size="middle"
                  columns={this.getCompColumns()}
                  dataSource={compData}
                  pagination={false}
                  scroll={tableScroll}
                >
                </Table>
              </div>
              <div className="bank-check-table__item">
                <p>开户户名：{accountName}</p>
                <p>开户账号：{accountNumber}</p>
                <Table rowKey="id" bordered size="middle"
                  columns={this.getBankColumns()}
                  dataSource={bankData}
                  pagination={false}
                  scroll={tableScroll}
                >
                </Table>
              </div>
            </div>
            <div className="table-bank-balance__btns">
              <Button type="primary" size="large"
                disabled={!selectedCompRows.length && !selectedBankRows.length}
                onClick={this.checkCompare.bind(this, 0)}
              >
                对比
              </Button>
              <Button type="primary" size="large"
                disabled={!compData.length && !bankData.length}
                onClick={this.checkCompare.bind(this, 1)}
              >
                下一步
              </Button>
            </div>
          </div>
        </TabPane>
        <TabPane tab="已对上" key="1">
          <div className="bank-check-container">
            <div className="bank-check-table">
              <div className="bank-check-table__item">
                <p>　</p>
                <p>　</p>
                <Table rowKey="id" bordered size="middle"
                  columns={this.getCompColumns()}
                  dataSource={compData}
                  pagination={false}
                  scroll={tableScroll}
                >
                </Table>
              </div>
              <div className="bank-check-table__item">
                <p>开户户名：{accountName}</p>
                <p>开户账号：{accountNumber}</p>
                <Table rowKey="id" bordered size="middle"
                  columns={this.getBankColumns()}
                  dataSource={bankData}
                  pagination={false}
                  scroll={tableScroll}
                >
                </Table>
              </div>
            </div>
            <div className="table-bank-balance__btns">
              <InputNumber size="large" 
                min={this.getMinBatch()}
                value={backBatch}
                onChange={this.changeBatch}
                disabled={!originalCompData.length && !originalBankData.length}
              />
              <Button type="primary" size="large"
                disabled={!selectedCompRows.length && !selectedBankRows.length}
                onClick={this.goBankBatch}
              >
                回退
              </Button>
            </div>
          </div>
        </TabPane>
      </Tabs>
    )
  }
}

export default BankCheckTable;
