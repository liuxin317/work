import React, { Component } from 'react';
import { Modal, Table } from 'antd';
import soptIcon from '../../../../../imgs/spot_icon.png';
import soptBlueIcon from '../../../../../imgs/spot_blue_icon.png';
import soptRedIcon from '../../../../../imgs/spot__red_icon.png';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export default class ListDetails extends Component {
	state = {
		modalNavBar: [ // 弹窗头部切换
			{title: '订单详情', active: true, index: 1},
			{title: '流程审核记录', active: false, index: 3}
		],
		processLogData: [], //流程审核记录
		names: [] //垃圾后台
	}

	// 初始化头部默认
	initModalNavBar = () => {
		let modalNavBar = this.state.modalNavBar;

		modalNavBar.forEach((item, index) => {
			if (index === 0) {
				item.active = true;
			} else {
				item.active = false;
			}
		})

		this.setState(
			modalNavBar
		)
	}
	
	// 导航切换
	modalNavBarActive = (data) => {
		let modalNavBar = this.state.modalNavBar;

		modalNavBar.forEach(item => {
			if (data.title === item.title) {
				item.active = true;
				if (data.title === '流程审核记录') {
					this.setState({
						processLogData: []
					})
					this.getProcessLog()
				}
			} else {
				item.active = false;
			}
		})

		this.setState(
			modalNavBar
		)
	}

	// 流程审核记录
	getProcessLog = () => {
		const { detailData, rowData } = this.props;

		Util.comFetch({
			addr: 'getProcessLogForTransfer',
			companyId: userInfo.companyRowId,
      processInstId: rowData ? rowData.processInstId : 0,
      transferId: detailData.id
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
									{
										detailData
										?
										<article className={`order-details ${ item.index === 1 ? '' : 'none' }`}>
											<div className="order-details__row">
												<h4 className="details-title">订单信息：</h4>

												<div className="info-row">
													<span className="pull-left">生成日期：</span>
													<em className="pull-left">{ detailData.createTime }</em>
													<div className="clear"></div>
												</div>

												<div className="info-row">
													<span className="pull-left">会计服务订单号：</span>
													<em className="pull-left">{ detailData.busCode }</em>
													<div className="clear"></div>
												</div>

												<div className="info-row">
													<span className="pull-left">结算中心单号：</span>
													<em className="pull-left">{ detailData.orderCode }</em>
													<div className="clear"></div>
												</div>
											</div>

											<div className="order-details__row">
												<div className="pull-left order-details__row-group">
													<h4 className="details-title">收款方信息：</h4>

													<div className="info-row">
														<span className="pull-left">银行账户名称：</span>
														<em className="pull-left">{ detailData.receiveAccountName }</em>
														<div className="clear"></div>
													</div>

													<div className="info-row">
														<span className="pull-left">银行账号：</span>
														<em className="pull-left">{ detailData.receiveAccount }</em>
														<div className="clear"></div>
													</div>

													<div className="info-row">
														<span className="pull-left">开户行名称：</span>
														<em className="pull-left">{detailData.receiveAccountBankName}</em>
														<div className="clear"></div>
													</div>
												</div>

												<div className="pull-left order-details__row-group">
													<h4 className="details-title">付款方信息：</h4>

													<div className="info-row">
														<span className="pull-left">银行账户名称：</span>
														<em className="pull-left">{ detailData.payAccountName }</em>
														<div className="clear"></div>
													</div>

													<div className="info-row">
														<span className="pull-left">银行账号：</span>
														<em className="pull-left">{ detailData.payAccount }</em>
														<div className="clear"></div>
													</div>

													<div className="info-row">
														<span className="pull-left">开户行名称：</span>
														<em className="pull-left">{ detailData.payAccountBankName }</em>
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
														<em className="pull-left">{ detailData.currency }</em>
														<div className="clear"></div>
													</div>

													<div className="info-row">
														<span className="pull-left">支付方式：</span>
														<em className="pull-left">{ detailData.payModel }</em>
														<div className="clear"></div>
													</div>

													<div className="info-row">
														<span className="pull-left">支付渠道：</span>
														<em className="pull-left">{ detailData.payChannel }</em>
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
														<em className="pull-left">{ detailData.prePayTime ? detailData.prePayTime.split(' ')[0] : '' }</em>
														<div className="clear"></div>
													</div>

													<div className="info-row">
														<span className="pull-left">实支付日期：</span>
														<em className="pull-left">{ detailData.realPayTime ? detailData.realPayTime.split(' ')[0] : '' }</em>
														<div className="clear"></div>
													</div>
												</div>

												<div className="pull-left order-details__row-group">
													<h4 className="details-title">支付状态：</h4>

													<div className="info-row">
														<span className="pull-left" style={{ textAlign: 'left', marginLeft: 50 }}>
															{   
																(function (){
																	switch (detailData.state) {
																		case 0:
																			return '待审核'
																			break;

																		case 1:
																			return '审核中'
																			break;

																		case 2:
																			return '待支付'
																			break;

																		case 3:
																			return '银行处理中'
																			break;

																		case 4:
																			return '支付成功'
																			break;

																		case 5:
																			return '支付失败'
																			break;
																		default:
																			return ''
																			break;
																	}
																})()
															}
														</span>
														<em className="pull-left"></em>
														<div className="clear"></div>
													</div>
												</div>
												
												<div className="clear"></div>
											</div>
										</article>
										:
										''
									}

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
						}
					})
				}
			</Modal>
		)
	}
}