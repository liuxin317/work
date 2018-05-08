import React, { Component } from 'react';
import SearchConditions from './../common/SearchConditions';
import BankBalanceTable from './BankBalanceTable'; // 余额调节表
import BankCheckTable from './BankCheckTable'; // 手工对账表
import BankInfoTable from './BankInfoTable'; // 对账明细表
import BankPagination from './../common/BankPagination';
import { Form, Icon, Input, Button, Table, Modal, Radio, DatePicker, message } from 'antd';

const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

class BankCheck extends Component {

  state = {
    searchData: {},
    pageTitle: '银行对账',
    tableData: [],
    selectedRowKeys: [],
    tableComp: null // 动态组件：余额调节表/对账明细表/手工对账表
  }

  // 获取工具条数据
  getSearchData = data => {
    console.log(data)
    this.setState({ searchData: data });
  }

  // 搜索列表
  search = () => {
    this.setState({ total: 0 });
    this._getAccountCheckList();
  }

  // 确认对账完成，刷新列表
  getRefresh = () => {
    this.search();
  }

  // 自动对账：批量和单个自动对账
  autoCheck = (recordIds) => {
    const { selectedRowKeys } = this.state;
    let ids = ''

    if (recordIds) {
      ids = recordIds + '';
    } else {
      if (!selectedRowKeys.length) {
        message.warning('请勾选要自动对账的内容');
        return;
      } else {
        ids = selectedRowKeys.join(',')
      }
    }

    this._automaticAccountCheckList(ids).then(res => {
      this.setState({ selectedRowKeys: []});
      this.search();
    });
  }

  // 确认对账：显示余额调节表
  sureCheck = (record) => {
    const { accountId, startDate, endDate } = record;

    this._getAccountCheckTotal({
      accountId,
      startDate,
      endDate
    }).then(res => {
      this.setState({ 
        pageTitle: '银行存款余额调节表',
        tableComp: <BankBalanceTable showBtn={true} data={res.data} refresh={this.getRefresh} /> 
      })
    });
  }

  // 查看：显示对账明细表
  infoCheck = (record) => {
    const { accountId, startDate, endDate } = record;
    // 先请求余额调节表
    this._getAccountCheckTotal({
      accountId,
      startDate,
      endDate
    }).then(res => {
      this.setState({
        pageTitle: '对账记录',
        tableComp: <BankInfoTable  data={record}>
          <BankBalanceTable showBtn={true} data={res.data} compName="info" /> 
        </BankInfoTable>
      });
    })
  }

  // 手工对账：显示手工对账组件
  handCheck = (record) => {
    this.setState({
      pageTitle: '手工对账',
      tableComp: <BankCheckTable data={record} checkType={this.getCheckType} /> 
    })
  }

  // 删除记录
  delCheck = (record) => {
    let _this = this;
    confirm({
      title: '此操作将永久删除该条数据，确认删除吗？',
      onOk() {
        _this._deleteAccountCheckList({ recordIds: record.checkId }).then(res => {
          _this.search();
        });
      },
      onCancel() {},
    });
    
  }

  // 点击下一步按钮，保存未对账，打开余额调节表
  getCheckType = (record) => {
    this.sureCheck(record);
  }

  componentDidMount () {
    // this._getAccountCheckList();
  }

  // 分页
  changePage = (pageNumber, pageSize) => {
    this._getAccountCheckList({ pageNumber, pageSize });
  }

  // 对账列表
  _getAccountCheckList = (params) => {
    const { searchData } = this.state;
    let  dateObj = {};

    
    // if (startDate) {
    //   params = Object.assign(params, { startDate, endDate });
    // }

    // if (accountNumber) {
    //   params = Object.assign(params, { accountNumber });
    // }

    // if (orgCode && orgCode.length) {
    //   params = Object.assign(params, { orgCode });
    // } else {
    //   message.warning('请选择组织机构');
    //   return;
    // }

    if (!searchData['orgCode'] || !searchData['orgCode'].length) {
      message.warning('请选择组织机构');
      return;
    }

    if (searchData['startDate']) {
      dateObj = { startDate: searchData['startDate'], endDate: searchData['endDate'] };
    }

    let obj = Object.assign({ 
      pageNumber: 1, 
      pageSize: 10,
      accountNumber: searchData['accountNumber'], 
      orgCode: searchData['orgCode']
    }, dateObj, params);

    Util.comFetch({
      addr: 'getAccountCheckList',
      ...obj
    }, res => {
      this.setState({ tableData: res.rows, total: res.total });
    })
  }

  // 获取表格头
  getColumns = () => {
    const columns = [
      {
        title: '组织机构',
        dataIndex: 'organizationName'
      }, {
        title: '银行账户名称',
        dataIndex: 'accountBankName'
      }, {
        title: '开户银行名称',
        dataIndex: 'accountName'
      }, {
        title: '开户账号',
        dataIndex: 'accountNumber'
      }, {
        title: '帐户类型',
        dataIndex: 'accountTypeName'
      }, {
        title: '对账日期',
        dataIndex: 'date'
      }, {
        title: '状态',
        dataIndex: 'state',
        render: (state) => {
          //状态: 0未对账，1已对账，4对账一致，5对账差异
          switch (state) {
            case 0:
              return '未对账'
            case 1:
              return '已对账'
            case 4:
              return '对账一致'
            case 5:
              return '对账差异'
          }
        }
      }, {
        title:  <div style={{textAlign: 'center'}}>操作</div>,
        render: row => {
          const state = row.state; // 根据state状态显示对应功能

          switch (state) {
            case 0:
              return (
                <div className="table-option">
                  <p><a onClick={this.handCheck.bind(this, row)}>手工对账</a></p>
                  <p><a onClick={this.autoCheck.bind(this, row.checkId)}>自动对账</a></p>
                </div>
              )
            case 1:
              return (
                <div className="table-option">
                  <a onClick={this.infoCheck.bind(this, row)}>查看</a>
                  <a onClick={this.delCheck.bind(this, row)}>删除</a>
                </div>
              )
            case 4:
              return (
                <div className="table-option">
                  <a onClick={this.sureCheck.bind(this, row)}>确认对账</a>
                </div>
              )
            case 5:
              return (
                <div className="table-option">
                  <a onClick={this.handCheck.bind(this, row)}>手工对账</a>
                </div>
              )
          }
        }
      }
    ]

    return columns;
  }

  // 表格复选框配置
  getRowSelection = () => ({
    selectedRowKeys: this.state.selectedRowKeys,
    onChange: this.onSelectChange
  })

  // 勾选复选框
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  // 页面返回按钮
  rollback = () => {
    this.setState({tableComp: null, pageTitle: '银行对账'});
  }

  // 自动对账请求
  _automaticAccountCheckList = (ids) => {
    return new Promise((resolve, reject) => {
      Util.comFetch({
        addr: 'automaticAccountCheckList',
        recordIds: ids
      }, res => {
        message.success('操作成功');
        resolve(res);
      })
    });
  }

  // 获取余额调节表请求
  _getAccountCheckTotal = (params) => {
    return new Promise((resolve) => {
      Util.comFetch({
        addr: 'getAccountCheckTotal',
        ...params
      }, res => {
        resolve(res);
      })
    });
  }

  // 删除请求
  _deleteAccountCheckList = (params) => {
    const obj = Object.assign({}, params);

    return new Promise((resolve) => {
      Util.comFetch({
        addr: 'deleteAccountCheckList',
        ...obj
      }, res => {
        resolve(res);
      });
    });
  }

  render () {
    const { pageTitle, tableData, selectedRowKeys, tableComp, total } = this.state;

    return (
      <div className="bank-account-wrapper">
        <div className="bank-account-hd">
          <div className="bank-account-title">
            <span><span>当前位置:</span>{pageTitle}</span>
            {
              tableComp
              ? (
                  <Button type="primary" shape="circle" icon="rollback" 
                    onClick={this.rollback}>
                  </Button>
                )
              : ''
            }
          </div>
        </div>
        <div className="bank-account-bd" style={{ display: tableComp ? 'none' : 'block' }}>
          <div className="bank-account-toolbar">
            <div className="bank-account-conditions">
              <SearchConditions searchData={this.getSearchData} 
                showInitType={false} 
                showDatePicker={true} 
              />
              <Button type="primary" shape="circle" icon="search" onClick={this.search}/>
            </div>
            <Button onClick={this.autoCheck.bind(this, null)}>批量自动对账</Button>
          </div>
          <div className="bank-account-table">
            <Table rowKey="checkId"
              dataSource={tableData}
              columns={this.getColumns()} 
              rowSelection={this.getRowSelection()}
              pagination={false}
            />
            { total ? <BankPagination total={total} onChangePage={this.changePage} /> : '' }
          </div>
        </div>
        <div className="bank-account-bd">
          { tableComp }
        </div>
      </div>
    )
  }
}

export default BankCheck;
