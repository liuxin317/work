import React, { Component } from 'react';
import { Select, Button, message, Icon } from 'antd';
const Option = Select.Option;

let isTrue = true;

/**
 * this.props => data是数据, menuType 1、付款申请, 2、调拨申请, getProcessTemp更新数据方法
 */
export default class Template extends Component {
    state = {
		getProcessTempData: [], // 授权层级
		templateProcessDefName: '', 
		templateProcessChName: '',
		ProcessUrl: '', // 配置链接
		status: '2', //是否启动状态;(2、未启动，1、启用)
		used: false, // 是否点过used
	}

	initData = (data) => {
		let { templateProcessDefName, templateProcessChName } = this.state;
		let status, used;

		if (data && data.length) {
			if (templateProcessDefName === '') {
				data.forEach(item => {
					if (item.state == 1) {
						templateProcessDefName = item.processDefName;
						templateProcessChName = item.processChName;
						status = item.state;
						used = item.used;
					}
				});

				if (templateProcessDefName === '') {
					templateProcessDefName = data[0].processDefName;
					templateProcessChName = data[0].processChName;
					status = data[0].state;
					used = data[0].used;
				}

				this.setState({
					getProcessTempData: data,
					templateProcessDefName,
					templateProcessChName,
					status,
					used
				}, () => {
					this.getProcessUrl()
				})
			} else {
				data.forEach(item => {
					if (item.processDefName == templateProcessDefName) {
						status = item.state;
						used = item.used;
					}
				});

				this.setState({
					getProcessTempData: data,
					status,
					used
				}, () => {
					this.getProcessUrl()
				})
			}	
		}
	}
    
    // 选择层级;
	handleChange = (value) => {
        let item = JSON.parse(value);
        this.setState({
            templateProcessDefName: item.processDefName,
            templateProcessChName: item.processChName,
			status: item.state,
			used: item.used
        }, () => {
            this.getProcessUrl()
        })
    }

    // 确认选中层级请求;
	creatProcess = () => {
		Util.comFetch({
			addr: 'creatProcess',
			type: this.props.menuType,
			companyId: userInfo.companyRowId,
			templateProcessDefName: this.state.templateProcessDefName,
			templateProcessChName: this.state.templateProcessChName
		}, res => {
			this.props.getProcessTemp(this.props.menuType);
			message.success('请求成功');
		}, error => {
			message.warning(error);
		})
	}

	// 配置请求;
	getProcessUrl = () => {
		Util.comFetch({
			addr: 'getProcessUrl',
			companyId: userInfo.companyRowId,
			templateProcessDefName: this.state.templateProcessDefName
		}, res => {
			this.setState({
				ProcessUrl: res.data
			})
		}, error => {
			this.setState({
				ProcessUrl: 'error'
			})
		})
	}
	
	// 跳转配置链接
	openProcessUrl = () => {
		if (this.state.ProcessUrl === '') {
			message.warning('配置请求中...请稍后再试')
		} else if (this.state.ProcessUrl === 'error') {
			message.warning('当前公司还未创建此模板的流程定义！')
		} else {
			window.open(this.state.ProcessUrl)
		}
	}

	// 启用
	releaseProcess = () => {
		Util.comFetch({
			addr: 'releaseProcess',
			type: this.props.menuType,
			companyId: userInfo.companyRowId,
			templateProcessDefName: this.state.templateProcessDefName
		}, res => {
			this.props.getProcessTemp(this.props.menuType);
			message.success('启用成功');
		}, error => {
			message.warning(error)
		})
    }
    
    render () {
		const authorizationLevel = this.state.getProcessTempData.map((item, index) => {
			return (
				<Option key={index} value={ JSON.stringify(item) }>{ item.processChName }</Option>
			)
		});

        return (
            <div className="config-box__group">
                <h4 className="title">{ this.props.menuType == 1 ? '付款申请' : '调拨申请' }</h4>

                <div className="group-content">
                    <div className="select-group">
                        <span className="pull-left name">授权层级：</span>
                        {
                            this.state.getProcessTempData.length ?
                            <Select 
                            className="pull-left" 
                            value={  this.state.templateProcessChName } 
                            style={{ width: 120 }} 
                            onChange={ this.handleChange } 
                            size="large">
                                { authorizationLevel }
                            </Select>
                            :
                            ''
                        }
                        
                        {
                            this.state.status == 2 ?
                            <Button onClick={ this.creatProcess } className="pull-left enter-button" type="primary">确认</Button>
                            :
                            <Icon className="pull-left icon-style" type="check-circle" />
                        }
                        
                        <div className="clear"></div>
                    </div>
                    
                    {
                        this.state.used ? 
						<div className="button-group">
                            <Button onClick={ this.openProcessUrl } className="btn enter-btn">配置</Button>
                            <Button onClick={ this.releaseProcess } className="btn cancel-btn">启用</Button>
                        </div>
                        :
                        <div className="button-group">
                            <Button onClick={ this.openProcessUrl } className="btn">配置</Button>
                            <Button onClick={ this.releaseProcess } className="btn">启用</Button>
                        </div>
                    }
                    

                    <p className="prompt" style={{ magrinTop: 10 }}>*确定按钮(存在) => 配置按钮 => 启用按钮</p>
                </div>
            </div>
        )
    }
}