import React from 'react';
import { Table } from 'antd';

// 待支付表格
class TopayTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.columns = null;
  }

  getColumns() {
    const columns = [
      {
        title: '订单号',
        key: 'code',
        sorter: true,
        className: 'type-icons-column',
        render: (text, record, index) => {
          return (
            <div className="type-icons-wrapper">
              <div className="type-icons">
                <span className="order-type-icon freeze" style={{display: record.freeze ? '': 'none'}}></span>
                <span className="order-type-icon" style={{display: record.expiredPrePayTime && !record.freeze ? '': 'none'}}></span>
              </div>
              <div>{record.code}</div>
            </div>
          );
        }
      },
      // {
      //   title: '收支对象名称',
      //   key: 'payee',
      //   render: (text, record, index) => {
      //     return (
      //       <div>
      //         <div>{record.customerName}</div>
      //       </div>
      //     );
      //   }
      // },
      {
        title: '收款方账户名称',
        key: 'payeeAc',
        render: (text, record, index) => {
          return (
            <div>
              <div>{ record.currentCustomerBank ? record.currentCustomerBank.accountName : null}</div>
            </div>
          );
        }
      },
      {
        title: "金额",
        key: "amount",
        dataIndex: "amount",
        sorter: true,
      },
      {
        title: '付款方账号',
        key: 'payer',
        dataIndex: 'payer',
        render: (text, record, index) => {
          if (record.myAccount) {
            return (
              <div>
                <div>{record.myAccount.accountNumber}</div>
              </div>
            );
          } else {
            return '';
          }
        }
      },
      {
        title: '预支付日期',
        key: 'prePayTime',
        dataIndex: 'prePayTime',
        sorter: true,
      },
      {
        title: '操作',
        key: 'op',
        dataIndex: 'op',
        width:150,
        render: (text, record, index) => {
          return (
            <span>
              <a className="tab-op-btn" href="javascript:void(0);" onClick={()=>{this.handleDetail(record, index)}}>详情</a>
            </span>
          );
        }
      }
      // {
      //   title: '操作',
      //   key: 'op',
      //   dataIndex: 'op',
      //     width:150,
      //   render: (text, record, index) => {
      //     return (
      //       <span>
      //         <a className="tab-op-btn" href="javascript:void(0);" onClick={()=>{this.handleFreezeToggle(record, index)}}>{record.freeze ? '解冻' : '冻结'}</a>
      //         <a className="tab-op-btn" href="javascript:void(0);" onClick={()=>{this.handlePay(record, index)}}>支付</a>
      //         <a className="tab-op-btn" href="javascript:void(0);" onClick={()=>{this.handleReturn(record, index)}} style={{display: record.handAccount ? 'none' : ''}}>退回</a>
      //         <a className="tab-op-btn" href="javascript:void(0);" onClick={()=>{this.handleDetail(record, index)}}>详情</a>
      //       </span>
      //     );
      //   }
      // }
    ];
    return columns;
  }

  // 点击支付
  handlePay(record, index) {
    // console.log(record, index);
    this.props.setPay(record);
  }

  // 点击退回
  handleReturn(record, index) {
    // console.log(record, index);
    this.props.setSendBack(record);
  }

  // 点击冻结，解冻
  handleFreezeToggle(record, index) {
    this.props.toggleFreeze(record, index);
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.props.selRowsUpdate(selectedRowKeys);
  }

  // 处理表格分页，排序变化
  handleTableChange = (pagination, filters, sorter) => {
    // console.log(pagination, filters, sorter);
    this.props.skipPage(pagination.current, pagination.pageSize, sorter);
  }

  // 查看详情
  handleDetail = (record, index) => {
    this.props.showDetail(record, index);
  }

  render() {
    const { data, total, current, selRows } = this.props;
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys: selRows
    };
    if (!this.columns) {
      this.columns = this.getColumns();
    }

    const paginationOpt = {
      showTotal: (total, range)=>`共 ${total} 条`,
      total: total,
      current: current,
      showQuickJumper: true,
      // onChange: (page, size) => {
      //   this.props.skipPage(page, size);
      // },
    };

    return (
      <Table
        pagination={paginationOpt}
        dataSource={data}
        onChange={this.handleTableChange}
        columns={this.columns} />
    );

    // return (
    //   <Table
    //     pagination={paginationOpt}
    //     rowSelection={rowSelection}
    //     dataSource={data}
    //     onChange={this.handleTableChange}
    //     columns={this.columns} />
    // );

  }
}

export default TopayTable;