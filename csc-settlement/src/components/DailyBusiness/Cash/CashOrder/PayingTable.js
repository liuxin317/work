import React from 'react';
import { Table } from 'antd';

// 处理中表格
class PayingTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  getColumns() {
    const columns = [
      {
        title: '订单号',
        key: 'code',
        sorter: true,
        render: (text, record, index) => {
          return (
            <div>
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
      // {
      //   title: '付款方式',
      //   key: 'payway',
      //   dataIndex: 'payer',
      //   render: (text, record, index) => {
      //     return (
      //       <div>
      //         <div>币种:{record.myAccount ? record.myAccount.currencyName : ''}</div>
      //       </div>
      //     );
      //   }
      // },
      {
        title: '预支付日期',
        key: 'prePayTime',
        dataIndex: 'prePayTime',
        sorter: true,
      },
      {
        title: '实支付日期',
        key: 'realPayTime',
        dataIndex: 'realPayTime',
        sorter: true,
      },
      {
        title: '操作',
        key: 'op',
        dataIndex: 'op',
        render: (text, record, index) => {
          return (
            <span>
              <a href="javascript:void(0);" onClick={()=>{this.handleDetail(record, index)}}>详情</a>
            </span>
          );
        }
      }
    ];
    return columns;
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
    const { data, total, current } = this.props;

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

  }
}

export default PayingTable;
