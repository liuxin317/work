import React from 'react';
import { Table } from 'antd';

// 到期未支付表格
class ExpireTable extends React.Component {
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
        className: 'type-icons-column',
        render: (text, record, index) => {
          return (
            <div>{record.code}</div>
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
        key: 'payeeAcc',
        render: (text, record, index) => {
          return (
            <div>
              <div >{record.acAccount ? record.acAccount.accountName : '' }</div>
            </div>
          );
        }
      },
      {
        title: "金额",
        key: "amount",
        dataIndex: "amount",
        sorter: true,
        render: (text, record) => {
          return <span  className={record.amountFlag=="0"?"":"bg-red"}  >{`${record.amount}`}</span>
        }
      },
      {
        title: '付款方账号',
        key: 'payer',
        dataIndex: 'payer',
        render: (text, record, index) => {
          if (record.myAccount) {
            return (
              <div >
                <div className={record.accountNumberFlag=="0"?"":"bg-red"}>{record.myAccount.accountNumber}</div>
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
        render: (text, record) => {
          return <span  className={record.prePayTimeFlag=="0"?"":"bg-red"}>{ record.prePayTime }</span>
        },
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'state',
        render: (text, record, index) => {
          switch (text) {
            case 'UNPAID':
              return '待支付';
            case 'PROCESSED':
              return '处理中';
            case 'SUCCESSFUL':
              return '支付成功';
            case 'FAILED':
              return '支付失败';
            case 'CANCELED':
              return '已退回';
            case 'CLEARING':
              return '已结清';
            case 'INVALID':
              return '已作废';
            case 'CHECKING':
              return '审核中';
            case 'WAITCHECK':
              return '待审核';
            case 'ABNORMAL':
              return '异常';
            default:
              return '';
          }
        }
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

export default ExpireTable;
