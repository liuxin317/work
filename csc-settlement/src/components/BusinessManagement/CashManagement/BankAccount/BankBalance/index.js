import React, { Component } from 'react';
import SearchConditions from './../common/SearchConditions';
import BankUploader from './../common/BankUploader';
import ModalDetailTable from './ModalDetailTable';
import ModalInputForm from './ModalInputForm';
import BankPagination from './../common/BankPagination';
import moment from 'moment';
import { Form, Icon, Input, Button, Table, Modal, Radio, message } from 'antd';

const confirm = Modal.confirm;

class SubjectBalance extends Component {

  state = {
    confirmLoading: false,
    modalImportVisible: false, // 导入弹窗
    modalDetailVisible: false, // 查看弹窗
    modalInputVisible: false,  // 录入弹窗
    modalInputData: {},
    searchData: {},
    tableData: [],
    rowData: {}
  }

  // 获取工具条数据
  getSearchData = data => {
    this.setState({ searchData: data });
  }

  // 弹窗类型控制开关
  showModal = (modalStr, flag) => {
    this.setState(() => {
      switch (modalStr) {
        case 'modalImport':
          return { modalImportVisible: flag };
        case 'modalDetail':
          return { modalDetailVisible: flag };
        case 'modalInput':
          return { modalInputVisible: flag, modalInputData: {} };
      }
    });
  }

  // 获取录入弹窗数据
  getFormData = (data) => {
    this.setState(() => {
      return {
        modalInputData: data
      }
    })
  }

  // 提交录入弹窗数据
  handleInputUpdate = () => {
    const { modalInputData } = this.state;
    let onOff = false;

    if (!Object.keys(modalInputData).length) {
      message.warning('请填写录入内容');
      return;
    }

    for (let key in modalInputData) {
      if (key !== 'tradeNumber' && !modalInputData[key]) {
        message.warning('请完整填写必填项')
        onOff = false;
        return;
      }
    }

    // 单独验证金额
    if (!/^[0-9]{1,14}(\.[0-9]{1,2})?$/.test(modalInputData.amount)) {
      message.warning('输入金额只能为数字，长度不能超过14位且最多保留两位小数'); 
      return;
    }

    this._saveAccountDetail(modalInputData);
  }

  search = () => {
    this.setState({ total: 0 });
    this._getAccountListByKeyword();  // 刷新列表
  }

  // 导入录入查看
  handleClick = (record, str) => {
    this.setState({ rowData: record });
    this.showModal(str, true);
  }

  uploadSuccess = (flag) => {
    if (flag) {
      this.showModal('modalImport', false);
      this.search();
    }
  }

  componentDidMount () {
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
        title: '银企直联',
        dataIndex: 'payChannel',
        render: (value) => {
          switch (value) {
            case '0':
              return '否'
            case '1':
              return '是'
          }
        }
      }, {
        title: '截止日期',
        dataIndex: 'createdTime',
        render: (timeStamp) => {
          if (timeStamp) {
            return moment(timeStamp).format('YYYY-MM');
          } else {
            return '--';
          }
        }
      }, {
        title: <div style={{textAlign: 'center'}}>操作</div>,
        width: 180,
        render: row => {
          return (
            <div className="table-option">
              <a  onClick={this.handleClick.bind(this, row, 'modalImport')}>导入</a>
              <a onClick={this.handleClick.bind(this, row, 'modalInput')}>录入</a>
              {
                row.createdTime
                ? <a onClick={this.handleClick.bind(this, row, 'modalDetail')}>查看</a>
                : <a style={{color: '#ddd'}}>查看</a>
              }
            </div>
          )
        }
      }
    ]

    return columns;
  }

  // 分页
  changePage = (pageNumber, pageSize) => {
    this._getAccountListByKeyword({ pageNumber, pageSize });
  }

  // 获取列表请求
  _getAccountListByKeyword = (params) => {
    const { searchData } = this.state;

    if (!searchData['orgCode'] || !searchData['orgCode'].length) {
      message.warning('请选择组织机构');
      return;
    }

    const obj = Object.assign({
      accountNumber: searchData.accountNumber,
      orgCode: searchData.orgCode,
      state: searchData.initType,
      pageNumber: 1,
      pageSize: 10
    }, params);

    Util.comFetch({
      addr: 'getAccountListByKeyword',
      ...obj
    }, res => {
      this.setState({ tableData: res.data, total: res.total });
    })
  }

  // 录入请求
  _saveAccountDetail = (params, isPass) => {
    let _this = this;

    return new Promise((resolve) => {
      Util.comFetch({
        addr: 'saveAccountDetail',
        accountInfo: JSON.stringify(params),
        isPass
      }, res => {
        // 确认是否二次录入
        if (res.rspCode === '100161') {
          confirm({
            title: res.rspDesc,
            onOk() {
              _this._saveAccountDetail(params, 'pass')
            },
            onCancel() {

            },
          });
        } else {
          resolve(res);
          _this.search();
          _this.showModal('modalInput', false)
        }
      })
    });
  }

  render () {
    const { 
      tableData, rowData, total,
      modalImportVisible, modalInputVisible, modalDetailVisible
    } = this.state;

    return (
      <div className="bank-account-wrapper">
        <div className="bank-account-hd">
          <div className="bank-account-title"><span>当前位置:银行流水录入</span></div>
        </div>
        <div className="bank-account-bd">
          <div className="bank-account-toolbar">
            <div className="bank-account-conditions">
              <SearchConditions searchData={this.getSearchData} />
              <Button type="primary" shape="circle" icon="search" onClick={this.search}/>
            </div>
          </div>
          <div className="bank-account-table">
            <Table 
              rowKey="accountId"
              columns={this.getColumns()} 
              dataSource={tableData}
              pagination={false}
            />
            { total ? <BankPagination total={total} onChangePage={this.changePage} /> : '' }
          </div>
        </div>
        <div className="bank-account-ft">
         {
          // 导入功能弹窗
          modalImportVisible
          ? (
              <Modal title="提示"
                footer={null}
                maskClosable={false}
                visible={modalImportVisible}
                onCancel={() => {
                  this.showModal('modalImport', false);
                }}
              >
                <BankUploader data={this.state.rowData} 
                  templateType={28} 
                  uploadSuccess={this.uploadSuccess} 
                />
              </Modal>
            )
          : ''
         }
          {
            // 查看功能弹窗
            modalDetailVisible
            ? (
                <Modal wrapClassName="bank-account-modal" title="提示" width="80%"
                  footer={null}
                  maskClosable={false}
                  visible={modalDetailVisible}
                  onCancel={() => {
                    this.showModal('modalDetail', false);
                  }}
                >
                  <ModalDetailTable {...rowData} trigger={this.search} />
                </Modal>
              )
            : ''
          }
          
          {
            // 录入功能弹窗
            modalInputVisible
            ? (
                <Modal wrapClassName="bank-account-modal" 
                  title="提示"
                  maskClosable={false}
                  visible={modalInputVisible}
                  onOk={this.handleInputUpdate}
                  confirmLoading={this.state.confirmLoading}
                  onCancel={() => {
                    this.showModal('modalInput', false);
                  }}
                >
                  <ModalInputForm {...rowData} formType={1} getData={this.getFormData} />
                </Modal>
              )
            : ''
          }
        </div>
      </div>
    )
  }
}

export default SubjectBalance;
