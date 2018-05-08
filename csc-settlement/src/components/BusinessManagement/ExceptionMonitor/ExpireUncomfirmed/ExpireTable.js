import React from 'react';
import { Table } from 'antd';

// 逾期未确认表格
class IncomeTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      relevance: false,
      busCode: "",
      record: "",
    };
  }


  getColumns() {
    const columns = [
      {
        title: '收款方银行开户名称',
        key: 'payee',
        render: (text, record) => {
          return (
            <div>{record.myAccountName}</div>
          );
        }
      },
      {
        title: '收款方银行账号',
        key: 'payee',
        render: (text, record) => {
          return (
            <div>{record.myAccountNo}</div>
          );
        }
      },
      {
        title: '付款方银行开户名称',
        key: 'payer',
        render: (text, record) => {
          if (record) {
            return (
              <div>
                <div>{record.currentAccountName}</div>
              </div>
            );
          } else {
            return '';
          }
        }
      },
      {
        title: '付款方银行账号',
        key: 'payer',
        render: (text, record, index) => {
          if (record) {
            return (
              <div>
                <div>{record.currentAccountNo}</div>
              </div>
            );
          } else {
            return '';
          }
        }
      },
      {
          title: "金额",
          key: "amount",
          dataIndex: "amount",
          // sorter: true,
      },
      {
        title: '银行入账日期',
        key: 'accDate',
        dataIndex: 'tradeTime',
        render: (text, record, index) => {
          return (
            <div>
              <div>{record.tradeTime}</div>
            </div>
          );
        }
      },
      {
        title: "类型",
        key: "dcFlag",
        dataIndex: "dcFlag",
          render:(text,record)=>{
            return(
                <div>
                    {record.dcFlag === 'C'  ?"收款":"付款"}
                </div>
            )
          }
      },
      {
        title: "状态",
        key: "state",
        dataIndex: "stateName",
      },
      // {
      //   title: "认款日期",
      //   key: "state1",
      //   dataIndex: "stateName1",
      // },
      {
        title: '操作',
        key: 'op',
        dataIndex: 'op',
        render: (text, record, index) => {
          return (
            <span>
              <a className="tab-op-btn" href="javascript:void(0);" onClick={() => {
                this.handleDetail(record, index)
              }}>详情</a>
            </span>
          );
        }
      }
    ];
    return columns;
  }

  // 查看详情
  handleDetail = (record, index) => {
    this.props.showDetail(record, index);
  }

  // 处理表格分页，排序变化
  handleTableChange = (pagination, filters, sorter) => {
    this.props.skipPage(pagination.current, pagination.pageSize, sorter);
  }

  render() {
    const { data, total, current } = this.props;

    if (!this.columns) {
      this.columns = this.getColumns();
    }

    const paginationOpt = {
      showTotal: (total, range) => `共 ${total} 条`,
      total: total,
      current: current,
      showQuickJumper: true,
    };

    return (


      <div>
        <Table
          pagination={paginationOpt}
          dataSource={data}
          onChange={this.handleTableChange}
          columns={this.columns}/>
      </div>
    );

  }
}

export default IncomeTable;
