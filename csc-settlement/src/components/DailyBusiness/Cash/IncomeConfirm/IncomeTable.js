import React from 'react';
import { Table, Modal, Button, Input, message } from 'antd';

// 收款确认表格
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
        title: '收款方账号',
        key: 'payee',
        render: (text, record, index) => {
          return (
            <div className="type-icons-wrapper">
              <div className="type-icons">
                <span className="order-type-icon" style={{display: record.expired ? '': 'none'}}></span>
              </div>
              <div>{record.myAccountNo}</div>
            </div>
          );
        }
      },
      {
        title: "金额",
        key: "amount",
        dataIndex: "amount",
        // sorter: true,
      },
      {
        title: '付款方信息',
        key: 'payer',
        render: (text, record, index) => {
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
        title: '银行入账日期',
        key: 'accDate',
        dataIndex: 'tradeTime',
        // sorter: true,
        render: (text, record, index) => {
          return (
            <div>
              <div>{record.tradeTime}</div>
            </div>
          );
        }
      },
      {
        title: "摘要",
        key: "summary",
        dataIndex: "summary",
      },
      {
          title: "状态",
          key: "state",
          dataIndex: "stateName",
      },
      {
        title: "认款日期",
        key: "state1",
        dataIndex: "confirmTime",
      },
      {
        title: '操作',
        key: 'op',
        dataIndex: 'op',
        render: (text, record, index) => {
          if (record.stateName !== '待确认') {
            return (
              <span>
                <a href="javascript:void(0);" onClick={() => {
                  this.handleDetail(record, index)
                }}>详情</a>
              </span>
            );
          } else {
            return (
              <span>
                <a className="tab-op-btn" href="javascript:void(0);" onClick={() => {
                  this.confirm(record, index)
                }}>确认</a>
                <a className="tab-op-btn" href="javascript:void(0);" onClick={() => {
                  this.relevance(record, index)
                }}>关联</a>
                <a className="tab-op-btn" href="javascript:void(0);" onClick={() => {
                  this.handleDetail(record, index)
                }}>详情</a>
              </span>
            );
          }
        }
      }
    ];
    return columns;
  }

  // 确认
  confirm(record, index) {
    this.props.confirm(record, index);
  }

  // 关联
  relevance(record, index) {
    console.log("关联", record, index)
    this.setState({
      record: record,
      relevance: true
    });
    // this.props.relevance(record, index);
  }

  // 关联账号
  relevancePost = (code) => {
    const { data, total, current } = this.props;
    // const curData = this.props.curData || {};
    debugger;
    if (this.state.busCode !== "") {
      Util.comFetch({
        addr: Api.saveOrderCode,
        confirmIds: this.state.record.id,
        busCode: this.state.busCode,
        operType: "1",
      }, (re) => {
        this.setState({
          relevance: false,
          busCode: "",
        }, () => this.props.relevance(current))
        // this.props.confirmed();
      });
    } else {
      message.info("请输入业务订单号")
    }

  };
  // 查看详情
  handleDetail = (record, index) => {
    this.props.showDetail(record, index);
  }

  // 处理表格分页，排序变化
  handleTableChange = (pagination, filters, sorter) => {
    this.props.skipPage(pagination.current, pagination.pageSize, sorter);
  }

  // 表格选框勾选
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.props.selRowsUpdate(selectedRowKeys);
  }

  render() {
    const { data, total, current, selRows } = this.props;

    if (!this.columns) {
      this.columns = this.getColumns();
    }

    const paginationOpt = {
      showTotal: (total, range) => `共 ${total} 条`,
      total: total,
      current: current,
      showQuickJumper: true,
      // onChange: (page, size) => {
      //   this.props.skipPage(page, size);
      // },
    };

    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys: selRows,
      getCheckboxProps: function (value) {
        return {
          defaultChecked: false,
          disabled: value.stateName !== '待确认',
        };
      }
    };

    return (


      <div>
        <Table
          rowSelection={rowSelection}
          pagination={paginationOpt}
          dataSource={data}
          onChange={this.handleTableChange}
          columns={this.columns}/>


        <Modal
          title={'关联'}
          wrapClassName="relevance"
          style={{ top: 100, left: 80 }}
          width={"350px"}
          footer={null}
          cancelText="确定"
          visible={this.state.relevance}
          maskClosable={false}
          onCancel={() => this.setState({ 'relevance': false, busCode: '' })}
        >
          <div>
            业务订单号: <Input value={this.state.busCode}
                          onChange={(event) => this.setState({ busCode: event.target.value })} placehoder="请输入关联账号"
                          style={{ width: "200px" }}/>
          </div>
          <div style={{ margin: "auto", marginTop: "20px", textAlign: 'right' }}>
            <Button onClick={() => this.setState({ relevance: false, busCode: '' })}
                    style={{ marginRight: "8px" }}>取消</Button>
            <Button onClick={this.relevancePost}
                    type="primary">确认</Button>
          </div>
        </Modal>


      </div>
    );

  }
}

export default IncomeTable;
