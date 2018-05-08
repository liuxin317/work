import React, { Component } from 'react';
import SearchConditions from './../common/SearchConditions';
import BankUploader from './../common/BankUploader';
import BankPagination from './../common/BankPagination';
import moment from 'moment';
import { Form, Icon, Input, Button, Table, Modal, message, DatePicker } from 'antd';

const { MonthPicker } = DatePicker;

class InitalData extends Component {
  
  state = {
    showModal: false,
    showUploaderModal: false,
    searchData: {},
    tableData: [],
    rowData: {}
  }

  // 获取工具条数据
  getSearchData = data => {
    this.setState({ searchData: data });
  }

  search = () => {
    this.setState({ total: 0 });
    this._getAccountAmountInitList();
  }

  // 获取表格表头
  getColumns = () => {
    const columns = [
      {
        title: '组织机构',
        dataIndex: 'organizationName'
      }, {
        title: '银行账户名称',
        dataIndex: 'accountName'
      }, {
        title: '银行开户账号',
        dataIndex: 'accountNumber'
      }, {
        title: '金额',
        dataIndex: 'initValue'
      }, {
        title: '银企直联',
        dataIndex: 'isBankCompany',
        render: (type) => {
          switch (type) {
            case 0:
              return '否';
            case 1:
              return '是'
          }
        } 
      }, {
        title: '截止日期',
        dataIndex: 'initDate'
      }, {
        title: '状态',
        dataIndex: 'initType',
        render: (type) => {
          switch (type) {
            case 1:
              return '已录入';
            case 2:
              return '未录入'
          }
        } 
      }, {
        title: <div style={{textAlign: 'center'}}>操作</div>,
        width: 120,
        render: (row) => {
          switch (row.initType) {
            case 1: // 已录入状态
              return (
                <div className="table-option">
                  <a onClick={this.handleEdit.bind(this, row)}>修改</a>
                </div>
              )
          
            case 2: // 未录入状态
              return (
                <div className="table-option">
                  <a onClick={this.handleEdit.bind(this, row)}>录入</a>
                </div>
              )
          }
        }
      }
    ];

    return columns;
  }

  // 弹窗开关控制
  switchModal = (flag) => {
    this.setState({ showModal: flag });
  }

  // 金额
  changeMoney = (e) => {
    const rowData = { ...this.state.rowData };
    const initValue = e.target.value;

    rowData['initValue'] = initValue;
    this.setState({ rowData })
  }

  // 截止月份
  changeDate = (data, str) => {
    const rowData = { ...this.state.rowData };
    
    rowData['initDate'] = str;
    this.setState({ rowData });
  }

  // 清除数据
  clearData = () => {
    this.setState({ rowData: {} });
  }

  // 录入、修改
  handleEdit = (record) => {
    this.setState({ rowData: record })
    this.switchModal(true)
  }

  // 更新数据
  update = () => {
    const { accountId, initValue, initDate } = this.state.rowData;
    const vInitValue = initValue ? initValue.replace(/,/g, '') : null;

    if (!vInitValue) {
      message.warning('录入金额不能为空'); 
      return;
    } else {
      if (!/^[0-9]{1,14}(\.[0-9]{1,2})?$/.test(vInitValue)) {
        message.warning('输入金额只能为数字，长度不能超过14位且最多保留两位小数'); 
        return;
      }
    }

    if (!initDate) {
      message.warning('截止月份不能为空'); 
      return;
    }

    this._getAccountCheckInitList({ accountId, initValue: vInitValue, initDate }).then(res => {
      this.search(); // 刷新列表
      this.switchModal(false)
    })
  }

  uploadSuccess = (flag) => {
    console.log(flag)
    if (flag) {
      this.setState({ showUploaderModal: false });
      this.search();
    }
  }

  // 分页
  changePage = (pageNumber, pageSize) => {
    this._getAccountAmountInitList({ pageNumber, pageSize });
  }

  // 请求列表
  _getAccountAmountInitList = (params) => {
    const { amountType, initType } = this.props;
    const { searchData } = this.state;

    if (!searchData['orgCode'] || !searchData['orgCode'].length) {
      message.warning('请选择组织机构');
      return;
    }
    
    const obj = Object.assign({
      amountType,
      pageNumber: 1,
      pageSize: 10
    }, searchData, params);

    Util.comFetch({
      addr: 'getAccountCheckInitList',
      ...obj
    }, res => {
      this.setState({ tableData: res.rows, total: res.total });
    })
  }

  // 修改
  _getAccountCheckInitList = (params) => {
    const { amountType } = this.props;
    const obj = Object.assign({
      amountType
    }, params);

    return new Promise((resolve) => {
      Util.comFetch({
        addr: 'saveAccountCheckInitData',
        ...obj
      }, res => {
        resolve(res);
        message.success('操作成功');
      })
    });
  }

  render () {
    const { tableData, rowData, showModal, showUploaderModal, total } = this.state;
    const { menuName, amountType } = this.props;
    
    return (
      <div className="bank-account-wrapper">
        <div className="bank-account-hd">
          <div className="bank-account-title">{menuName}</div>
        </div>
        <div className="bank-account-bd">
          <div className="bank-account-toolbar">
            <div className="bank-account-conditions">
              <SearchConditions searchData={this.getSearchData} showDatePicker={false} />
              <Button type="primary" shape="circle" icon="search" onClick={this.search}/>
            </div>
            <Button type="primary" shape="circle" icon="download" 
              onClick={() => {
                this.setState({ showUploaderModal: true });
              }}
            />
          </div>
          <div className="bank-account-table">
            <Table dataSource={tableData} 
              columns={this.getColumns()} 
              rowKey="accountId"
              pagination={false}
            />
            { total ? <BankPagination total={total} onChangePage={this.changePage} /> : '' }
          </div>
        </div>
        <div className="bank-account-ft">
        {
          showModal
          ? (
            <Modal wrapClassName="bank-account-modal"
              title="提示"
              maskClosable={false}
              visible={showModal}
              afterClose={this.clearData}
              onOk={this.update}
              onCancel={this.switchModal.bind(this, false)}
            >
              <div className="form-modal">
                <div className="form-modal-row">
                  <div className="form-modal-row__label">组织机构：</div>
                  <div className="form-modal-row__col">{rowData.organizationName}</div>
                </div>
                <div className="form-modal-row">
                  <div className="form-modal-row__label">银行开户账号：</div>
                  <div className="form-modal-row__col">{rowData.accountNumber}</div>
                </div>
                <div className="form-modal-row">
                  <div className="form-modal-row__label">银行开户户名：</div>
                  <div className="form-modal-row__col">{rowData.accountName}</div>
                </div>
                <div className="form-modal-row">
                  <div className="form-modal-row__label">银企直联：</div>
                  <div className="form-modal-row__col">
                    {rowData.isBankCompany === 1 ? '是' : '否'}
                  </div>
                </div>
                <div className="form-modal-row">
                  <div className="form-modal-row__label">金额：</div>
                  <div className="form-modal-row__col">
                    <Input placeholder="请输入金额"
                      onBlur={this.changeMoney} 
                      defaultValue={rowData.initValue ? rowData.initValue.replace(/,/g, '') : null}
                    />
                  </div>
                </div>
                <div className="form-modal-row">
                  <div className="form-modal-row__label">截止月份：</div>
                  <div className="form-modal-row__col">
                    <MonthPicker placeholder="请选择截止月份"
                      allowClear={false}
                      defaultValue={rowData.initDate ? moment(rowData.initDate) : null}
                      onChange={this.changeDate} 
                    />
                  </div>
                </div>
              </div>
            </Modal>
          )
          : ''
        }
        {
          showUploaderModal
          ? (
              <Modal title="提示"
                footer={null}
                maskClosable={false}
                visible={showUploaderModal}
                onCancel={() => {
                  this.setState({ showUploaderModal: false });
                }}
              >
                <BankUploader data={this.state.rowData} 
                  templateType={27} 
                  amountType={amountType}
                  uploadSuccess={this.uploadSuccess}
                />
              </Modal>
            )
          : ''
        }
        </div>
      </div>
    )
  }
}

export default InitalData;
