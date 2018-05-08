import React from 'react';
import { Table } from 'antd';

// 异常订单表格
class AbnormalTable extends React.Component {
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
      {
          title: "收支对象名称",
          key: "accountName",
          dataIndex: "customerName",
      },
      {
        title: '收款方账户名称',
        key: 'payee',
        render: (text, record, index) => {
          return (
            <div>
              <div>{record.acAccount.accountName}</div>
            </div>
          );
        }
      },
      {
        title: '收款方银行账号',
        key: 'payeeAc',
        render: (text, record, index) => {
          return (
            <div>
              <div>{record.acAccount.accountNumber}</div>
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
      // {
      //   title: "挂账",
      //   key: "oncredit",
      //   dataIndex: "oncredit",
      //   render: (text, record, index) => {
      //     return (
      //       <div>{record.handAccount ? '是' : '否'}</div>
      //     );
      //   }
      // },
      {
        title: "原因",
        key: "remark",
        dataIndex: "remark",
      },
      {
        title: '操作',
        key: 'op',
        dataIndex: 'op',
        render: (text, record, index) => {
          return (
            <span>
              <a className="tab-op-btn" href="javascript:void(0);" onClick={()=>{this.handleDetail(record, index)}}>详情</a>
            </span>
          );
        }
      },

      // {
      //   title: '操作',
      //   key: 'op',
      //   dataIndex: 'op',
      //   render: (text, record, index) => {
      //     return (
      //       <span>
      //         <a className="tab-op-btn" href="javascript:void(0);" onClick={()=>{this.handleEdit(record, index)}}>编辑</a>
      //         <a className="tab-op-btn" href="javascript:void(0);" onClick={()=>{this.handleReturn(record, index)}} style={{display: record.handAccount ? 'none' : ''}}>退回</a>
      //       </span>
      //     );
      //   }
      // }
    ];
    return columns;
  }

  // 点击编辑按钮
  handleEdit(record, index) {
    this.props.setEdit(record, index);
  }

  // 点击退回
  handleReturn(record, index) {
    this.props.setSendBack(record, index);
  }

  // 处理表格分页，排序变化
  handleTableChange = (pagination, filters, sorter) => {
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

export default AbnormalTable;
