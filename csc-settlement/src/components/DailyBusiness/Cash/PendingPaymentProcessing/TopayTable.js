import React from 'react';
import { Table,Popconfirm } from 'antd';
import EditModal from './EditModal';
// 待支付表格
class TopayTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        editVisible: false, // 编辑弹窗
        rowData: {}, // 当前列的数据;
        //待支付row
        payRowData:"",
    };
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
                {record.freeze ? null:<span className="order-type-icon" style={{display: record.expiredPrePayTime ? '': 'none'}}></span>}
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

            <div className="operation">


                <Popconfirm title={record.freeze?'确认解冻？':'确认冻结?'} onConfirm={()=>{this.handleFreezeToggle(record, index)}}>
                    {/*<a className="keepOpreate-style" href="javascript:void(0)">{row.freeze?'解冻':'冻结'}</a>*/}
                    <a className="tab-op-btn" href="javascript:void(0);" >{record.freeze ? '解冻' : '冻结'}</a>
                </Popconfirm>
            {
                record.freeze
                    ?
                    ''
                    :
                    <span>
                        {/*<a className="tab-op-btn" href="javascript:void(0);" onClick={()=>{this.handlePay(record, index)}}>支付</a>*/}
						<a href="javascript: " onClick={ this.openEditModal.bind(this, record) } className="tab-op-btn">编辑</a>
                        <a href="javascript: " onClick={()=>{this.handleDetail(record, index)}}  className="tab-op-btn">详情</a>
                        {record.backFlag==1 ? null:<a href="javascript: " onClick={()=>{this.handleReturn(record, index)}}  className="tab-op-btn">退回重审</a>}
                    </span>
            }
            </div>
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
  // 点击退回重审
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
  // 打开编辑弹窗    付款申请模块的编辑
    openEditModal = (rowData) => {
      this.setState({
          editVisible:true,
          payRowData:rowData,
      })
    };

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
      showTotal: (total, range)=>`共 ${total} 条`,
      total: total,
      current: current,
      showQuickJumper: true,
      onChange: (page, size) => {
        this.props.skipPage(page, size);
      },
    };
    const { page }=this.props;

    return (
        <div>
            {data  &&<Table
            pagination={paginationOpt}
            dataSource={data}
            rowSelection={rowSelection}
            onChange={this.handleTableChange}
            columns={this.columns} />}
            {/*待支付表格*/}
            {/*<Table*/}
                {/*pagination={paginationOpt}*/}
                {/*dataSource={data}*/}
                {/*onChange={this.handleTableChange}*/}
                {/*columns={this.columns} />*/}
            {/*资金调拨表格*/}

            {/* 编辑弹窗 */}
            {this.state.editVisible?<EditModal
                payRowData={this.state.payRowData}
                page={this.props.page}
                skipPage={this.props.skipPage}
                cancel={()=>this.setState({editVisible:false})}
                />:null}
        </div>

    );
  }
}

export default TopayTable;
