import React, { Component } from 'react';
import { Table, Icon, Button, Modal, Radio, Input, DatePicker, Select, message } from 'antd';
// import ListDetails from './details';
import ListDetails from '../../ApplyAllocation/component/details';
import moment from 'moment';
import Freeze from '../../../../../imgs/freeze.png';

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
			rowData: {}, // 当前列的数据;
			getDetailInfo: '', //订单详情;
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

	//页码change
	pageHandleChange = (number) => {
		this.props.onPageChange(number)
	}

	render () {
		const { columnType, data, tableTotal, pageSize, current } = this.props;
		let columns;
		
		const tabelCommonHeader = [{ // 公共头部;
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
			width: columnType === 1 ? '15%': '18%',
			key: 'payAccount',
			render: (text, record) => {
				return <span>{ record.payAccount }</span>
			}
		  }, {
			title: '收款方账号',
			width: columnType === 1 ? '15%': '18%',
			key: 'receiveAccount',
			render: (text, record) => {
				return <span>{ record.receiveAccount }</span>
			}
		  }, {
			title: '金额',
			width: '10%',
			key: 'amount',
			render: (text, record) => {
			  return <span>{`${record.amount}`}</span>
			}
		  },{
			title: '预支付日期',
			dataIndex: 'prePayTime',
			key: 'prePayTime',
			width: '14%',
			render: (text, record) => {
				return <span>{record.prePayTime ? record.prePayTime.split(' ')[0] : ''}</span>
			}
		  }, {
			title: '实支付日期',
			dataIndex: 'realPayTime',
			width: '14%',
			render: (text, record) => {
				return <span>{record.realPayTime ? record.realPayTime.split(' ')[0] : ''}</span>
			}
		  }, {
			title: '详情',
			render: (text, record) => {
			  return (
				  <div className="operation">
					  <a href="javascript: " onClick={ this.openListDetailsModal.bind(this, record) }  className="details">详情</a>
				  </div>
			  )
			},
			width: '10%'
		  }];

		if (columnType === 1) {
			tabelCommonHeader.splice(6, 0,{
				title: '状态',
				width: '10%',
				render: (text, record) => {
					let state = "";
					switch (record.state) {
						case 0:
							state =  "待审核"
							break;
						case 1:
							state = "审核中"
							break;
						case 2:
							state = "待支付"
							break;
						case 3: 
							state = "银行处理中"
							break;
						case 4:
							state = "支付成功"
							break;
						case 5:
							state = "支付失败"
							break;
						default:
							state = ""
					}
					return (
						<span>{ state }</span>
					)
				}
			});
		}else if (columnType === 2) {
			tabelCommonHeader.splice(5, 1);
		}

		columns = tabelCommonHeader;

		return (
			<section className="table-box">
						<Table pagination={{showQuickJumper: true, total: tableTotal, pageSize, current, onChange: this.pageHandleChange, showTotal: total => `共 ${total} 条`}} columns={columns} rowKey="id" dataSource={data} />
				
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