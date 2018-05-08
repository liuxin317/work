import React, { Component } from 'react';
import ModalInputForm from './ModalInputForm';
import BankPagination from './../common/BankPagination';
import moment from 'moment';
import { Button, Table, Modal, DatePicker, message } from 'antd';

const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

class ModalDetailTable extends Component {

  state = {
    tableData: [],
    showModal: false,
    rowData: {},
    modalInputData: {}
  }
  
  // 时间区间选择
  rangeDatePicker = (date, dateString) => {
    const [ startDate, endDate ] = dateString;

    this.setState({ startTime: startDate, endTime: endDate });
  }

  // 搜索详情列表
  search = () => {
    this.setState({ total: 0 });
    this._getAccountDetailListByKeyword();
  }

  // 获取录入弹窗数据
  getFormData = (data) => {
    const { rowData } = this.state;

    this.setState({ rowData: Object.assign({}, rowData, data) })
  }

  // 编辑
  edit = (record) => {
    this.setState({ rowData: record, showModal: true })
  }

  // 更新
  update = () => {
    const { rowData } = this.state;
    let onOff = true;
    
    if (!Object.keys(rowData).length) {
      message.warning('请填写录入内容');
      return;
    }

    for (let key in rowData) {
      if (key !== 'tradeNumber' && !rowData[key]) {
        message.warning('请完整填写必填项')
        onOff = false;
        return;
      }
    }

    if (!/^[0-9]{1,14}(\.[0-9]{1,2})?$/.test(rowData.amount)) {
      message.warning('输入金额只能为数字，长度不能超过14位且最多保留两位小数'); 
      return;
    }

    if (onOff) {
      this._updateAccountDetail(rowData).then(res => {
        this._getAccountDetailListByKeyword(); // 刷新弹窗列表
        this.props.trigger(); // 触发页面弹窗列表刷新
        this.setState({ showModal: false })
      });
    }
  }

  // 删除
  delate = (record) => {
    const _this = this;

    confirm({
      title: '提示',
      content: '是否要永久删除此条数据？',
      onOk() {
        _this._deleteAccountDetail(record.id).then(res => {
          _this._getAccountDetailListByKeyword();
          _this.props.trigger(); // 触发页面弹窗列表刷新
          _this.setState({ showModal: false });
        });
      },
      onCancel() {},
    });
  }

  // 下载
  downLoad = () => {
    this._exportExcelData();
  }

  // 获取表头
  getColumns = () => {
    const { payChannel } = this.props;
    
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
        title: '交易序号',
        dataIndex: 'tradeNumber',
        render: text => text ? text : '--'
      },{
        title: '借/贷',
        dataIndex: 'borrowLend',
        render: (text) => {
          switch (text) {
            case 0:
              return '借';
            case 1:
              return '贷';
          }
        }
      }, {
        title: '金额',
        dataIndex: 'amountStr'
      }, {
        title: '用途',
        dataIndex: 'useScope'
      }, {
        title: '发生日期',
        dataIndex: 'occerTime'
      }, {
        title: <div style={{textAlign: 'center'}}>操作</div>,
        width: 120,
        render: row => {
          return (
            <div className="table-option">
              {
                // 银企直联为是，不能编辑
                payChannel === '1' ? '' : <a onClick={this.edit.bind(this, row)}>编辑</a>
              }
              <a onClick={this.delate.bind(this, row)}>删除</a>
            </div>
          )
        }
      }
    ]

    return columns
  }

  componentDidMount () {
    this._getAccountDetailListByKeyword();
  }

  getDateParams = () => {
    const { startTime, endTime } = this.state;
    const { createdTime } = this.props;
    let startDate, endDate;

    if (!startTime || !endTime) {
      startDate = endDate = moment(createdTime).format('YYYY-MM'); 
    } else {
      startDate = startTime
      endDate = endTime
    }

    return { startTime: startDate, endTime: endDate }
  }

  // 分页
  changePage = (pageNumber, pageSize) => {
    this._getAccountDetailListByKeyword({ pageNumber, pageSize });
  }

  // 获取详情弹窗列表请求
  _getAccountDetailListByKeyword = (params) => {
    const { accountId, organizationName, accountName } = this.props;
    const { startTime, endTime } = this.getDateParams();

    const obj = Object.assign({ 
      accountId,
      accountName,
      organizationName,
      pageNumber: 1, 
      pageSize: 10,
      startTime,
      endTime
    }, params)

    Util.comFetch({
      addr: 'getAccountDetailListByKeyword',
      ...obj
    }, res => {
      this.setState({ tableData: res.data, total: res.total });
    })
  }

  // 更新请求
  _updateAccountDetail = (params) => {
    return new Promise((resolve) => {
      Util.comFetch({
        addr: 'updateAccountDetail',
        accountInfo: JSON.stringify(params)
      }, res => {
        resolve(res);
      })
    });
  }

  // 删除请求
  _deleteAccountDetail = (id) => {
    return new Promise((resolve) => {
      Util.comFetch({
        addr: 'deleteAccountDetail',
        accountDetailId: id
      }, res => {
        resolve(res);
      })
    });
  }

  // 下载请求
  _exportExcelData = () => {
    const { accountId, organizationName, accountName } = this.props;
    const { startTime, endTime } = this.getDateParams();

    const obj = Object.assign({ 
      accountId,
      accountName,
      organizationName,
      startTime,
      endTime
    })

    Util.comFetch({
      addr: 'exportExcelData',
      ...obj
    }, res => {
      let url = encodeURI(AppConf.downloadPrefix + res.data.url);
      window.open(url);
    })
  }

  render () {
    const { tableData, showModal, rowData, startTime, total } = this.state;

    return (
      <div className="bank-account">
        <div className="bank-account-toolbar">
          <div className="bank-account-conditions">
            <div className="search-conditions-item" >
              <RangePicker style={{width: '260px'}}
                format="YYYY-MM"
                allowClear={false}
                onChange={this.rangeDatePicker}
              />
            </div>
            <Button type="primary" shape="circle" icon="search" onClick={this.search}/>
          </div>
          <Button type="primary" shape="circle" icon="upload" onClick={this.downLoad}/>
        </div>
        <Table rowKey="id"
          columns={this.getColumns()} 
          dataSource={tableData} 
          pagination={false}
        />
        { total ? <BankPagination total={total} onChangePage={this.changePage} /> : '' }

        {
          showModal
          ? (
              <Modal wrapClassName="bank-account-modal"
                title="提示"
                visible={showModal}
                maskClosable={false}
                onOk={this.update}
                onCancel={() => {
                  this.setState({ showModal: false })
                }}
              >
                <ModalInputForm {...rowData} formType={2} getData={this.getFormData} />
              </Modal>
            )
          : ''
        }
        
      </div>
    );
  }
}

export default ModalDetailTable;
