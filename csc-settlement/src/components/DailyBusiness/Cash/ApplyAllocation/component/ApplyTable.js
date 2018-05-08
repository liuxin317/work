import React, { Component } from 'react';
import { Table, Icon, Button, Modal, Radio, Input, DatePicker, Select, message, InputNumber } from 'antd';
// import ListDetails from './details';
import ListDetails from '../component/details';
import moment from 'moment';
import Freeze from '../../../../../imgs/freeze.png';
import AddEditList from './AddEditList/index';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
// const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;

const dateFormat = 'YYYY-MM-DD';
const date = new Date();
const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();

const submissionAuditTableHeader = [{
	title: '会计凭证号',
	dataIndex: 'busCode',
	width: '40%'
},
{
	title: '未清号',
	dataIndex: 'code',
	width: '40%'
},
{
	title: '金额',
	render: (text, record) => {
		return <span>{record.amount > 0 ? `-${record.amount}` : record.amount}</span>
	},
	width: '20%'
}];

export default class ApplyTable extends Component {
	state = {
		frozenVisible: false, // 冻结弹窗;
		frozenEnterLoading: false, // 冻结Loading
		dropdownMove: true, //付款方信息下拉图标显示
	    submissionAuditVisible: false, // 提交审核弹窗开关
	    submissionAuditLoading: false, // 提交审核Loading
	    fallbackVisible: false, // 退回弹窗开关
	    fallbackLoading: false, // 退回Loading
	    fallbackValue: 0, // 退回类别（0、退回扫单人，1、退回客户）
    	openDetailVisible: false, // 列表详情弹窗开关
    	rowData: {}, // 当前列的数据;
    	isPrePayTime: '', //在提交审核的另一种状态中是否修改了预支付日期;
		submissionAuditData: [], // 未支付/预支付款项;
		isInitPayChannel: true, //是否是初始化支付渠道
		getDetailInfo: '', // 详情数据
	}

	// 打开冻结弹窗;
	openFrozenModal = (rowData) => {
		this.setState({
			frozenVisible: true,
			frozenEnterLoading: false,
			rowData
		})
	}
	
	// 确认冻结弹窗;
	frozenOk = () => {
		this.setState({
			frozenVisible: true,
		})

		this.freezeFun();
	}

	// 取消冻结弹窗
	frozenCancel = () => {
		this.setState({
			frozenVisible: false
		})
	}
	
	// 打开编辑弹窗
	openEditModal = (rowData) => {
		this.setState({
			rowData
		})

		this.refs.addEdit.openModal(2, rowData); //2、编辑弹窗
        // this.refs.addEdit.getFundTransferACAccountName();
        this.refs.addEdit.getFundTransferMyAccountName();
	}

	// 确认处理弹窗
	editOk = (e) => {
		
	}

	// 关闭处理弹窗;
	editCancel = (e) => {
		this.setState({
		  editVisible: false,
		});
	}
	
	// 打开提交审核弹窗
	openSubmissionAudit = (rowData) => {
		this.setState({
			rowData,
			submissionAuditVisible: true
		})
	}

	// 提交审核
	startProcessForTransfer = () => {
		let { rowData } = this.state;

		Util.comFetch({
			addr: 'startProcessForTransfer',
			companyId: userInfo.companyRowId,
			payerAccount: rowData.payAccount,
			receivablesAccount: rowData.receiveAccount,
			transferId: rowData.id,
			price: rowData.amount,
			date: rowData.prePayTime
		}, res => {
			message.success('提交成功');
			this.props.sreachOrders();
			this.setState({
			  submissionAuditVisible: false
			});
		})
	}
	
	// 提交审核确认弹窗
	submissionOk = () => {
		this.startProcessForTransfer()
	}
	
	// 提交审核取消弹窗
	submissionCancel = () => {
		this.setState({
		  submissionAuditVisible: false
		});
	}
	
	// 打开删除弹窗
	openfallbackModal = (rowData) => {
		this.setState({
			fallbackVisible: true,
			fallbackLoading: false,
			rowData,
			fallbackValue: 0,
		})
	}
	
	// 确认删除按钮
	fallbackOk = () => {
		this.setCancel()
	}
	
	// 取消删除按钮
	fallbackCancel = () => {
		this.setState({
			fallbackVisible: false
		})
	}

	// 删除结算单
	setCancel = () => {
		Util.comFetch({
			addr: 'deleteByIds',
			fundtransferIds: this.state.rowData.id
		}, res => {
			this.setState({
				fallbackVisible: false
			})
			this.props.sreachOrders();
			message.success('删除成功');
		})
	}

	// 监听退回类别
	onChangeFallbackValue = (e) => {
		this.setState({
			fallbackValue: e.target.value
		})
	}

	// 关闭列表详情弹窗;
	closeListDetailsModal = () => {
		this.setState({
		  openDetailVisible: false,
		});
	}

	// 打开列表详情列表弹窗;
	openListDetailsModal = (rowData) => {
		this.refs.listDetails.initModalNavBar(); // 初始化默认选项

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

	// 解冻接口
	freezeFun = () => {
		Util.comFetch({
			addr: 'updateFreezeState',
			freezeState: this.state.rowData.freeze ? 0 : 1,
			fundtransferId: this.state.rowData.id
		}, res => {
			if (!this.state.rowData.freeze) {
				message.success('冻结成功');
			} else {
				message.success('解冻成功');
			}

			this.setState({
				frozenVisible: false,
			})

			this.props.sreachOrders();
		})
	}

	//页码change
	pageHandleChange = (number) => {
		this.props.onPageChange(number)
	}

	// Can not select days before today and today
	disabledDate = (current) => {
		return current && current.valueOf() < Date.now() - (24*60*60*1000);
	}

	// 在提交审核更改了编辑保存过后更新当前rowData的值
	upRowData = (data) => {
		const { rowData } = this.state;

		data.forEach(item => {
			if (item.id == rowData.id) {
				this.setState({
					rowData: item
				})
			}
		})
	}

	// 将日期转成时间戳
	get_unix_time = (dateStr) => {
        var newstr = dateStr.replace(/-/g,'/'); 
        var date =  new Date(newstr); 
        var time_str = date.getTime().toString();
        return time_str.substr(0, 10);
	}

  // 表格选框勾选
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.props.selRowsUpdate(selectedRowKeys);
  }

	render () {
		const unauditedHeader = [{ // 待审核表头;
		  title: '订单号',
          width: '14%',
          key: 'orderCode',
		  render: (text, record) => {
		  	return (
		  		<div style={{position: 'relative'}}>
		  			<span>{ record.orderCode }</span>
		  			{
		  				record.freeze ?
						<img style={{ position: 'absolute', top: '50%', left: '0', transform: 'translate(0, -50%)'  }} src={ Freeze } />
						:
						''
		  			}
		  		</div>
		  	)
		  }
		}, {
		  title: '付款方账号',
          width: '14%',
          key: 'payAccount',
		  render: (text, record) => {
		  	return <span>{ record.payAccount }</span>
		  }
		}, {
		  title: '收款方账号',
          width: '14%',
          key: 'receiveAccount',
		  render: (text, record) => {
		  	return <span>{ record.receiveAccount }</span>
		  }
		}, {
		  title: '金额',
          width: '14%',
          key: 'amount',
          render: (text, record) => {
            return <span>{`${record.amount}`}</span>
          }
		},{
			title: '预支付日期',
			width: '10%',
			render: (text, record) => {
				return <span>{record.prePayTime ? record.prePayTime.split(' ')[0] : ''}</span>
			}
		}, {
          title: '操作',
		  render: (text, record) => {
		    return (
		    	<div className="operation">
					<a href="javascript: " onClick={ this.openFrozenModal.bind(this, record) } className="details">{ record.freeze ? '解冻' : '冻结' }</a>
					{
						record.freeze
						?
						''
						:
						<span>
						<a href="javascript: " onClick={ this.openEditModal.bind(this, record) } className="details">编辑</a>
						<a href="javascript: " onClick={ this.openSubmissionAudit.bind(this, record, 2) } className="details">提交审核</a>
						<a href="javascript: " onClick={ this.openfallbackModal.bind(this, record) } className="details">删除</a>
						<a href="javascript: " onClick={ this.openListDetailsModal.bind(this, record) }  className="details">详情</a>
						</span>
					}
		    	</div>
		    )
		  },
		  width: '20%'
		}];

		const paymentFail = [{ // 支付失败;
		  title: '订单号',
		  width: '10%',
		  key: 'orderCode',
		  render: (text, record) => {
		  	return (
		  		<div style={{position: 'relative'}}>
		  			<span>{ record.orderCode }</span>
		  			{
		  				record.freeze ?
						<img style={{ position: 'absolute', top: '50%', left: '0', transform: 'translate(0, -50%)'  }} src={ Freeze } />
						:
						''
		  			}
		  		</div>
		  	)
		  }
		}, {
		  title: '付款方账号',
		  render: (text, record) => {
		  	return <span>{ record.payAccount }</span>
		  },
		  width: '10%'
		}, {
		  title: '收款方账号',
		  width: '10%',
		  render: (text, record) => {
		  	return <span>{ record.receiveAccount }</span>
		  }
		}, {
		  title: '金额',
		  dataIndex: 'amount',
		  width: '8%',
			render: (text, record) => {
				return <span>{`${record.amount}`}</span>
			}
		},{
		  title: '预支付日期',
		  width: '10%',
		  render: (text, record) => {
			  return <span>{record.prePayTime ? record.prePayTime.split(' ')[0] : ''}</span>
		  }
		}, {
		  title: '实支付日期',
		  dataIndex: 'realPayTime',
		  width: '10%',
		  render: (text, record) => {
			  return <span>{record.realPayTime ? record.realPayTime.split(' ')[0] : ''}</span>
		  }
		}, {
		  title: '操作',
		  render: (text, record) => {
		    return (
		    	<div className="operation">
					<a href="javascript: " onClick={ this.openFrozenModal.bind(this, record) } className="details">{ record.freeze ? '解冻' : '冻结' }</a>
					{
						record.freeze
						?
						''
						:
						<span>
						<a href="javascript: " onClick={ this.openEditModal.bind(this, record) } className="details">编辑</a>
						<a href="javascript: " onClick={ this.openSubmissionAudit.bind(this, record, 2) } className="details">提交审核</a>
						<a href="javascript: " onClick={ this.openfallbackModal.bind(this, record) } className="details">删除</a>
						<a href="javascript: " onClick={ this.openListDetailsModal.bind(this, record) }  className="details">详情</a>
						</span>
					}
		    	</div>
		    )
		  },
		  width: '20%'
		}];

		const { columnType, data, tableTotal, pageSize, current, selRows } = this.props;
		let columns;

		if (columnType === 1) {
			columns = unauditedHeader;
		} else if (columnType === 2) {
			columns = paymentFail;
		} else if (columnType === 3) {
			columns = paymentFail;
		}

    let rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys: selRows
    };

		return (
			<section className="table-box">
                <Table
									rowSelection={rowSelection}
									pagination={{showQuickJumper: true, total: tableTotal, pageSize, current, onChange: this.pageHandleChange, showTotal: total => `共 ${total} 条`}}
									columns={columns}
									rowKey="id"
									dataSource={data} />
			
				{/* 冻结提醒 */}
				<Modal
		          title={ `${this.state.rowData.freeze ? '解冻' : '冻结'}提醒` }
		          visible={this.state.frozenVisible}
		          onOk={this.frozenOk}
		          onCancel={this.frozenCancel}
		          maskClosable={ false }
		          confirmLoading={ this.state.frozenEnterLoading }
		          className="frozen-box"
		        >
					<p className="frozen-waring">你确定要{ this.state.rowData.freeze ? '解冻' : '冻结' }该结算单吗？</p>
		        </Modal>

		        {/* 编辑弹窗 */}
				<AddEditList
					ref="addEdit"
					sreachOrders={ this.props.sreachOrders } 
				/>

		    	{/* 提交审核弹窗 */}
				<Modal
		          title="提交审核"
		          visible={this.state.submissionAuditVisible}
		          onOk={this.submissionOk}
		          onCancel={this.submissionCancel}
		          maskClosable={ false }
		          confirmLoading={ this.state.submissionAuditLoading }
		          className={`frozen-box submission-box active`}
		        >
		        	<article>
						<p className="frozen-waring">确定要提交审核吗？</p>
		        	</article>
		        </Modal>

				{/* 退回弹窗 */}
				<Modal
		          title="删除"
		          visible={this.state.fallbackVisible}
		          onOk={this.fallbackOk}
		          onCancel={this.fallbackCancel}
		          maskClosable={ false }
		          confirmLoading={ this.state.fallbackLoading }
		          className="frozen-box fallback-box"
		        >
					<p className="frozen-waring">你确定要删除该结算单吗？</p>
		        </Modal>

		        {/* 列表详情 */}
		        <ListDetails 
		          ref="listDetails"
				  detailData={ this.state.getDetailInfo }
		          detailVisible={ this.state.openDetailVisible }
		          closeListDetailsModal={ this.closeListDetailsModal }
		        />
	        </section>
		)
	}
}