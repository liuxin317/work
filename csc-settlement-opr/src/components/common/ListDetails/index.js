import React, { Component } from 'react';
import { Modal, Table } from 'antd';
import HttpRequest from '../../../request/Fetch';
import moment from 'moment';
import { getCookie } from '../method';
import soptIcon from '../../../imgs/spot_icon.png';
import soptBlueIcon from '../../../imgs/spot_blue_icon.png';
import soptRedIcon from '../../../imgs/spot__red_icon.png';
import './style.scss';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const columns = [
	{
	  title: '变更时间',
	  key: 'operTime',
	  dataIndex: 'operTime',
	  width: 150,
	},
	{
	  title: '变更对象',
	  dataIndex: 'newAccountNumber',
	  width: 150,
        render: (text, record) => {
			if(record.newAccountNumber){
				return <span>付款方账号</span>
			}
			else  if(record.newAmount||record.newAmount=="0"){
				return <span>金额</span>
			}else  if(record.newPrePayTime){
                return <span>预付款日期</span>
			} else if (record.newAcAccountNumber) {
				return <span>收款方账号</span>
			}
			// return <span>{`${record.amount}`}</span>
    	}
    },
	{
	  title: '变更前值',
	  dataIndex: 'amount',
	  width: 200,
        render: (text, record) => {
            if(record.newAccountNumber){
                return <span>{record.oldAccountNumber}</span>
            }
            else  if(record.newAmount||record.newAmount=="0"){
                return <span>{record.oldAmount}</span>
            }else  if(record.newPrePayTime){
                return <span>{record.oldPrePayTime}</span>
            } else if (record.oldAcAccountNumber) {
            	return <span>{record.newAcAccountNumber}</span>
						}
        }
	},
	{
		title: '变更后值',
		dataIndex: 'oldPrePayTime',
		width: 200,
        render: (text, record) => {
            if(record.newAccountNumber){
                return <span>{record.newAccountNumber}</span>
            }
            else  if(record.newAmount||record.newAmount=="0"){
                return <span>{record.newAmount}</span>
            }else  if(record.newPrePayTime){
                return <span>{record.newPrePayTime}</span>
            } else if (record.oldAcAccountNumber) {
            	return <span>{record.oldAcAccountNumber}</span>
						}
        }
	},
	{
		title: '变更人',
		dataIndex: 'openUserName',
		width: 150,
	}
];

// 订单详情弹框组件
// 付款申请，付款查询，异常订单，我的待办 页面共用
export default class ListDetails extends Component {
	state = {
		modalNavBar: [ // 弹窗头部切换
			{title: '订单详情', active: true, index: 1},
			{title: '变更记录', active: false, index: 2},
			{title: '流程审核记录', active: false, index: 3}
		],
		orderLogData: [], //变更记录
		processLogData: [], //流程审核记录
		names: [] //垃圾后台
	}

	// 初始化头部默认
	initModalNavBar = () => {
		const modalNavBar = this.state.modalNavBar;
		let next = [];

		modalNavBar.forEach((item, index) => {
		  let tmp = Object.assign({}, item);
			if (index === 0) {
				tmp.active = true;
			} else {
				tmp.active = false;
			}
			next.push(tmp);
		})

		this.setState({modalNavBar: next});
	}
	
	// 导航切换
	modalNavBarActive = (data) => {
		let modalNavBar = this.state.modalNavBar;
    	let next = [];

		modalNavBar.forEach(item => {
		  let tmp = Object.assign({}, item);
			if (data.title === tmp.title) {
				tmp.active = true;
				if (data.title === '变更记录') {
					this.setState({
						orderLogData: []
					})
					this.orderLog()
				} else if (data.title === '流程审核记录') {
					this.setState({
						processLogData: []
					})
					this.getProcessLog()
				}
			} else {
				tmp.active = false;
			}
      next.push(tmp);
		})

		this.setState({modalNavBar: next});
	}
	
	// 请求变更记录
	orderLog = () => {
		const { detailData } = this.props;
		HttpRequest({
			addr: 'OrderLog',
			code: detailData.code
		}, res => {
			this.setState({
				orderLogData: res.data
			})
		})
	}

	// 流程审核记录
	getProcessLog = () => {
		const { detailData } = this.props;

		HttpRequest({
			addr: 'getProcessLog',
			tenantId: detailData.tenantId,
			companyId: detailData.companyId,
			orderId: detailData.id, // 工作台和日常详情合并差异
			openId: getCookie('openId'),
			jsToken: getCookie('TOKEN')
		}, res => {
			let processLogData = [];
			let data = res.data;
			let names = [];

			data.forEach((item, index) => {
				if (item.date) {
					item.date = moment(item.date).format(dateFormat)
				}

				if (item.flag == 0) {
					if (names.join(',').indexOf(item.name) == -1) {
						names.push(item.name);
					}
				}
			});

			data.forEach(item => {
				processLogData.push(item);
			});

			processLogData = processLogData.reverse();

			this.setState({
				processLogData,
				names
			})
		})
	}

	render() { 
		const { detailData } = this.props;
		const { processLogData } = this.state;
		let num = 0;
		let myAccount = detailData.myAccount ? detailData.myAccount : {};
		let acAccount = detailData.currentCustomerBank ? detailData.currentCustomerBank : {};

		return (
			<Modal
				title={(
					<ul className="list-inline modal-header">
						{
							this.state.modalNavBar.map((item, index) => {
								return item.active 
								? <li key={ index } className="active">{ item.title }</li>
								: <li key={ index } onClick={ this.modalNavBarActive.bind(this, item) }>{ item.title }</li>
							})
						}
					</ul>
				)}
				visible={this.props.detailVisible}
				onCancel={ this.props.closeListDetailsModal }
				footer={ null }
				className="list-detail-box"
			>
				{
					this.state.modalNavBar.map((item, index) => {
						if (item.active) {
							return (
								<div key={ index }>
									{/* 订单详情 */}	
									<article className={`order-details ${ item.index === 1 ? '' : 'none' }`}>
										<div className="order-details__row">
											<h4 className="details-title">订单信息：</h4>
											
											<div className="info-row">
												<span className="pull-left">生成日期：</span>
												<em className="pull-left">{ detailData.createdTime }</em>
												<div className="clear"></div>
											</div>

											<div className="info-row">
												<span className="pull-left">会计服务订单号：</span>
												<em className="pull-left">{detailData.busCode}</em>
												<div className="clear"></div>
											</div>

											<div className="info-row">
												<span className="pull-left">业务订单号：</span>
												<em className="pull-left">{detailData.clearingCode}</em>
												<div className="clear"></div>
											</div>

											<div className="info-row">
												<span className="pull-left">结算中心单号：</span>
												<em className="pull-left">{ detailData.code }</em>
												<div className="clear"></div>
											</div>

											<div className="info-row">
												<span className="pull-left">来源：</span>
												<em className="pull-left">{ detailData.sourceName }</em>
												<div className="clear"></div>
											</div>
										</div>

										<div className="order-details__row">
											<div className="pull-left order-details__row-group">
												<h4 className="details-title">收款方信息：</h4>

												<div className="info-row">
													<span className="pull-left">银行账户名称：</span>
													<em className="pull-left">{ acAccount ?acAccount.accountName ? acAccount.accountName : detailData.customerName : detailData.customerName }</em>
													<div className="clear"></div>
												</div>

												<div className="info-row">
													<span className="pull-left">银行账号：</span>
													<em className="pull-left">{ acAccount.accountNumber }</em>
													<div className="clear"></div>
												</div>

												<div className="info-row">
													<span className="pull-left">开户行名称：</span>
													<em className="pull-left">{acAccount.accountBankName}</em>
													<div className="clear"></div>
												</div>

												<div className="info-row">
													<span className="pull-left">收支对象名称：</span>
													<em className="pull-left">{ detailData.customerName }</em>
													<div className="clear"></div>
												</div>
											</div>

											<div className="pull-left order-details__row-group">
												<h4 className="details-title">付款方信息：</h4>

												<div className="info-row">
													<span className="pull-left">银行账户名称：</span>
													<em className="pull-left">{ myAccount.accountName }</em>
													<div className="clear"></div>
												</div>

												<div className="info-row">
													<span className="pull-left">银行账号：</span>
													<em className="pull-left">{ myAccount.accountNumber }</em>
													<div className="clear"></div>
												</div>

												<div className="info-row">
													<span className="pull-left">开户行名称：</span>
													<em className="pull-left">{ myAccount.accountBankName }</em>
													<div className="clear"></div>
												</div>
											</div>
											
											<div className="clear"></div>
										</div>

										<div className="order-details__row">
											<div className="pull-left order-details__row-group">
												<h4 className="details-title">付款方式：</h4>

												<div className="info-row">
													<span className="pull-left">币种：</span>
													<em className="pull-left">{ myAccount.currencyName }</em>
													<div className="clear"></div>
												</div>

												<div className="info-row">
													<span className="pull-left">支付方式：</span>
													<em className="pull-left">{ detailData.payModeName }</em>
													<div className="clear"></div>
												</div>

												<div className="info-row">
													<span className="pull-left">支付渠道：</span>
													<em className="pull-left">{ detailData.payChannelName }</em>
													<div className="clear"></div>
												</div>
											</div>

											<div className="pull-left order-details__row-group">
												<h4 className="details-title">金额：</h4>

												<div className="info-row">
													<span className="pull-left" style={{ textAlign: 'left', marginLeft: 50 }}>{ detailData.amount }</span>
													<em className="pull-left"></em>
													<div className="clear"></div>
												</div>
											</div>
											
											<div className="clear"></div>
										</div>

										<div className="order-details__row">
											<div className="pull-left order-details__row-group">
												<h4 className="details-title">付款日期：</h4>

												<div className="info-row">
													<span className="pull-left">预支付日期：</span>
													<em className="pull-left">{ detailData.prePayTime }</em>
													<div className="clear"></div>
												</div>

												<div className="info-row">
													<span className="pull-left">实支付日期：</span>
													<em className="pull-left">{ detailData.realPayTime }</em>
													<div className="clear"></div>
												</div>
											</div>

											<div className="pull-left order-details__row-group">
												<h4 className="details-title">支付状态：</h4>

												<div className="info-row">
													<span className="pull-left" style={{ textAlign: 'left', marginLeft: 50 }}>{ detailData.stateDesc }</span>
													<em className="pull-left"></em>
													<div className="clear"></div>
												</div>
											</div>
											
											<div className="clear"></div>
										</div>
									</article>
					
									{/* 变更记录 */}
									<article className={`change-record ${ item.index === 2 ? '' : 'none' }`}>
										<Table 
											rowKey={ (item, index) => index } 
											columns={columns} 
											dataSource={this.state.orderLogData} 
											scroll={{ y: 240 }}
											pagination={false} />
									</article>

									{/* 流程审核记录 */}
									<article className={`audit-record ${ item.index === 3 ? '' : 'none' }`}>
										<div className="audit-record__box">
											<div className="record-group">
											{
												processLogData.length 
												?
												processLogData.map((d, index) => {
													let name, imgUrl;

													if (index == 0) {
														name = '发起人：';
													} else if (item.flag == 60) {
														name = '';
													} else {
														name = '审核人：';
													}

													if (d.flag == 10) {
														imgUrl = soptRedIcon;
													} else if (d.flag == 20) {
														imgUrl = soptBlueIcon;
													} else if (d.flag == 30) {
														imgUrl = soptRedIcon;
													} else if (d.flag == 40) {
														imgUrl = soptBlueIcon;
													} else if (d.flag == 50) {
														imgUrl = soptRedIcon;
													} else if (d.flag == 60) {
														imgUrl = soptBlueIcon;
													} else if (d.flag == 70) {
														imgUrl = soptBlueIcon;
													} else if (d.flag == 0) {
														imgUrl = soptIcon;
														num++;
													} 

													if (d.flag == 0) {
														if (num == 1) {
															return (
																<div key={ index } className="record-row ">
																	<img className="pull-left" src={ imgUrl } alt="" />
																	
																	<div className="pull-left">
																		<p className="record-row-info">
																			<span>{ d.activityName }：<em>{ this.state.names.join('，') }</em></span>
																			{
																				d.date
																				?
																				<span>时间： <em>{ d.date }</em></span>
																				:
																				''
																			}
																			{
																				!d.state ? '' : <span>处理摘要： <em>{d.state}</em></span>
																			}
																		</p>
																	</div>
																	<div className="clear"></div>
																</div>
															)
														} else {
															return false;
														}
													} else {
														return (
															<div key={ index } className="record-row ">
																<img className="pull-left" src={ imgUrl } alt="" />
																
																<div className="pull-left">
																	<p className="record-row-info">
																		<span>{ d.activityName }：<em>{ d.name }</em></span>
																		{
																			d.date
																			?
																			<span>时间： <em>{ d.date }</em></span>
																			:
																			''
																		}
																		{
																			!d.state ? '' : <span>处理摘要： <em>{d.state}</em></span>
																		}
																		{/* 添加备注 */}
																		{
																			!d.remark ? '' : <span>备注： <em>{d.remark}</em></span>
																		}
																	</p>
																</div>
																<div className="clear"></div>
															</div>
														)
													}
												})
												:
												''
											}
											</div>
										</div>
									</article>
								</div>
							)
						} else {
							return false;
						}
					})
				}
			</Modal>
		)
	}
}