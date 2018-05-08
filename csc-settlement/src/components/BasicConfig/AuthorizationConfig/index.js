import React, { Component } from 'react';
import Template from './common/Template';
import './style.scss';
import { Select, Button, message, Icon } from 'antd';
const Option = Select.Option;

export default class AuthorizationConfig extends Component {
	componentDidMount () {
		this.getProcessTemp();
	}

	// 获取授权层级数组
	getProcessTemp = (type) => {
		Util.comFetch({
	      addr: 'getProcessTemp',
		  directoryName: '付款申请,调拨申请',
		  companyId: userInfo.companyRowId
	    }, res => {
		  let paymentData = res.data[0]; // 付款申请的数据
		  let allocationData = res.data[1]; // 调拨申请的数据
		  if (type == 1) {
			this.refs.t1.initData(paymentData);
		  } else if (type == 2) {
			this.refs.t2.initData(allocationData);
		  } else {
			this.refs.t1.initData(paymentData);
			this.refs.t2.initData(allocationData);
		  }
	    })
    }

	render () {
		return (
			<section className="config-box">
				<h2 className="column-title">当前位置：授权配置</h2>
				<Template 
					ref="t1"
					getProcessTemp={ this.getProcessTemp } 
					menuType="1" 
				/>
				<Template
					ref="t2" 
					getProcessTemp={ this.getProcessTemp } 
					menuType="2" 
				/>
			</section>
		)
	}
}