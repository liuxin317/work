import React from 'react';
import { Table, Popconfirm } from 'antd';
import ListDetails from '../ApplyAllocation/component/details';
import AddEditList from '../ApplyAllocation/component/AddEditList/index';

// 资金调拨表格
class FundAllocationTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 显示异常原因的订单号
      showAbnormalCode: '',
      // 详情弹框
      openDetailVisible: false,
      // 当前操作的行数据
      rowData: {},
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.resetShowAbnormal);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.resetShowAbnormal);
  }

  // 显示异常详情
  showAbnormalText = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      showAbnormalCode: record.code,
    });
  }

  // 点击其他区域，隐藏异常原因弹框
  resetShowAbnormal = () => {
    this.setState({
      showAbnormalCode: '',
    });
  }

  // 获取Table的columns数据
  getColumns() {
    const columns = [
      {
        title: '订单号',
        key: 'orderCode',
        sorter: true,
        className: 'type-icons-column',
        render: (text, record, index) => {
          return (
            <div className="type-icons-wrapper">
              <div className="type-icons">
                <span className="order-type-icon freeze" style={{ display: record.freeze ? '' : 'none' }}></span>
                <span className="order-type-icon abnormal" onClick={(e) => {
                  this.showAbnormalText(e, record)
                }} style={{ display: !record.freeze && record.state === 'ABNORMAL' ? '' : 'none' }}></span>
              </div>
              {
                this.state.showAbnormalCode === record.code ?
                  <div className="abnormal-text">
                    <p>异常理由</p>
                    <p style={{ marginTop: '10px', color: '#f33' }}>{record.remark}</p>
                  </div> :
                  null
              }
              <div>{record.orderCode}</div>
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
        title: '收款方账号',
        key: 'payeeAcc',
        render: (text, record, index) => {
          return (
            <div>
              <div className={record.receiveAccountFlag ? "bg-red" : ""}>{record.receiveAccount}</div>
            </div>
          );
        }
      },
      {
        title: "金额",
        key: "amount",
        dataIndex: "amount",
        sorter: true,
        render: (text, record, index) => {
          return <span className={record.amountFlag ? "bg-red" : ""}>{Util.num2Decimal(record.amount)}</span>
        }
      },
      {
        title: '付款方账号',
        key: 'payer',
        dataIndex: 'payer',
        render: (text, record, index) => {
          return (
            <div>
              <div className={record.payAccountFlag ? "bg-red" : ""}>{record.payAccount}</div>
            </div>
          );
        }
      },
      {
        title: '预支付日期',
        key: 'prePayTime',
        dataIndex: 'prePayTime',
        sorter: true,
        render: (text, record) => {
          return <span className={record.prePayTimeFlag ? "bg-red" : ""}>{record.prePayTime.split(' ')[0]}</span>
        },
      },
      // {
      //   title: '实支付日期',
      //   key: 'realPayTime',
      //   dataIndex: 'realPayTime',
      //   sorter: true
      // },
      // {
      //   title: '状态',
      //   key: 'status',
      //   dataIndex: 'state',
      //   render: (text, record, index) => {
      //     switch (text) {
      //       case 'UNPAID':
      //         return '待支付';
      //       case 'PROCESSED':
      //         return '处理中';
      //       case 'SUCCESSFUL':
      //         return '支付成功';
      //       case 'FAILED':
      //         return '支付失败';
      //       case 'CANCELED':
      //         return '已退回';
      //       case 'CLEARING':
      //         return '已结清';
      //       case 'INVALID':
      //         return '已作废';
      //       case 'CHECKING':
      //         return '审核中';
      //       case 'WAITCHECK':
      //         return '待审核';
      //       case 'ABNORMAL':
      //         return '异常';
      //       default:
      //         return '';
      //     }
      //   }
      // },
      {
        title: '操作',
        key: 'op',
        dataIndex: 'op',
        render: (text, record, index) => {
          return (
            <div>
              <Popconfirm title={record.freeze ? '确认解冻？' : '确认冻结?'} onConfirm={() => {
                this.handleFreezeToggle(record, index)
              }}>
                <a className="tab-op-btn" href="javascript:void(0);">{record.freeze ? '解冻' : '冻结'}</a>
              </Popconfirm>
              <a className="tab-op-btn" href="javascript:void(0);" onClick={() => { this.openEditModal(record, index) }}>编辑</a>
              <a className="tab-op-btn" href="javascript:void(0);" onClick={() => { this.handleDetail(record, index) }}>详情</a>
              <a className="tab-op-btn" href="javascript:void(0);" onClick={()=>{this.handleReturn(record, index)}}>退回重审</a>
            </div>
          );
        }
      }
    ];
    return columns;
  }

  // 点击冻结，解冻
  handleFreezeToggle(record, index) {
    this.props.toggleFreeze(record, index);
  }

  // 处理表格分页，排序变化
  handleTableChange = (pagination, filters, sorter) => {
    this.props.skipPage(pagination.current, pagination.pageSize, sorter);
  }

  // // 查看详情
  // handleDetail = (record, index) => {
  //   this.props.showDetail(record, index);
  // }

  // 打开列表详情列表弹窗;
  handleDetail = (rowData) => {
    this.listDetails.initModalNavBar();

    this.setState({
      openDetailVisible: true,
      rowData
    }, () => {
      this.getDetailInfoById();
    });
  }

  // 详情接口
  getDetailInfoById = () => {
    Util.comFetch({
      addr: 'getDetailInfoById',
      fundtransferId: this.state.rowData.id
    }, res => {
      this.setState({
        getDetailInfo: res.fundTransferModel
      })
    })
  }

  // 关闭列表详情弹窗;
  closeListDetailsModal = () => {
    this.setState({
      openDetailVisible: false,
    });
  }

  // 刷新表格，编辑返回后调用
  refreshList = () => {
    this.props.skipPage(this.props.current);
  }

  // 打开编辑框
  openEditModal = (rowData) => {
    this.setState({
      rowData
    });

    this.addEdit.openModal(2, rowData);
    this.addEdit.getFundTransferMyAccountName();
  }

  // 点击退回重审
  handleReturn(record, index) {
    this.props.setSendBack(record, 'fund');
  }

  // 表格选框勾选
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.props.selRowsUpdate(selectedRowKeys);
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
          rowSelection={rowSelection}
          onChange={this.handleTableChange}
          columns={this.columns}/>

        <ListDetails
          ref={(listDetails) => {
            this.listDetails = listDetails;
          }}
          detailData={this.state.getDetailInfo}
          detailVisible={this.state.openDetailVisible}
          closeListDetailsModal={this.closeListDetailsModal}/>

        <AddEditList
          ref={(addEdit) => {
            this.addEdit = addEdit;
          }}
          sreachOrders={this.refreshList}/>

      </div>
    );
  }
}

export default FundAllocationTable;
