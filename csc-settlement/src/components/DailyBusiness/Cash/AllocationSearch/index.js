import React, { Component } from 'react';
import { Tooltip, Icon, Button, Modal, Select } from 'antd';
import SearchTable from './component/SearchTable';

import './style.scss';

const Option = Select.Option;

export default class ApplyAllocation extends Component {
    state = {
        menuSwitch: [{ // 头部菜单数据
			name: '全部',
			active: true,
			state: '',
		},{ 
			name: '待审核',
			active: false,
			state: 0,
        },{ // 头部菜单数据
			name: '审核中',
			active: false,
			state: 1,
		},{ 
			name: '待支付',
			active: false,
			state: 2,
        },{ // 头部菜单数据
			name: '银行处理中',
			active: false,
			state: 3,
		},{ 
			name: '支付成功',
			active: false,
			state: 4,
        },{ 
			name: '支付失败',
			active: false,
			state: 5,
        }],
        state: '', // 查询状态;
        columnType: 1, // 表格类型(1、全部，2、待审核, 3、审核中，4、待支付，5、银行处理中，6、支付成功，7、支付失败)
        addVisible: false, // 新增弹窗开关
		pageNumber: 1, // 查询页码
        pageSize: 10, // 查询每页的条数
		tableTotal: '', //总页码
        tableData: [], //表格数据
        startTime: '', //查询起始日期
        endTime: '', //查询结束日期
        receiveAccount: '', // 收款方账号
    }

    componentDidMount () {
        this.sreachOrders();
    }

    // 菜单切换;
	menuSwitchActive = (data) => {
		let menuSwitch = this.state.menuSwitch;
		let type;

		menuSwitch.forEach((item, index) => {
			if (data.name === item.name) {
				item.active = true;
				type = index + 1;
			} else {
				item.active = false;
			}
		})

		this.setState({
			menuSwitch,
			columnType: type,
            state: data.state,
            pageNumber: 1,
		}, () => {
			this.sreachOrders()
		})
    }

    // 打开新增弹窗
    openAddModal = () => {
        this.setState({
            addVisible: true
        })
    }
    
    // 新增确定
    addOk = () => {

    }

    // 新增取消
    addCancel = () => {
        this.setState({
            addVisible: false
        })
    }

    // 新增银行名称选择
    bankNameChange = (value) => {

    }

    // 查询列表;
	sreachOrders = () => {
        const { startTime, endTime, state, pageNumber, pageSize, receiveAccount } = this.state;

		Util.comFetch({
            addr: 'getFundTransferList',
            startTime,
            endTime,
            state,
            pageNumber,
            pageSize,
            receiveAccount
        }, res => {
            let tableData = res.rows;
            let tableTotal = res.total;

            this.setState({
                tableData,
                tableTotal
            })
        })
    }
    
    // 页码回调函数
	onPageChange = (number) => {
		this.setState({
			pageNumber: number
		}, () => {
			this.sreachOrders()
		});
	}

    render () {
        return (
            <section className="apply-payment-box">
                <p  style={{marginBottom:'15px',fontSize:'16px'}} className="title"><span className="light-black">当前位置:</span> 调拨查询</p>

                <div className="menu-switch">
					<ul className="pull-left list-inline">
						{
							this.state.menuSwitch.map((item, index) => {
								return <li onClick={ this.menuSwitchActive.bind(this, item) } key={ index } className={`${item.active ? 'active' : ''}`}>{item.name}</li>
							})
						}
					</ul>

                    <div className="clear"></div>
				</div>
                
                {/* 表格 */}
                <SearchTable
                    ref="tableList"
					columnType={ this.state.columnType } 
					current={ this.state.pageNumber } 
					pageSize={ this.state.pageSize } 
					tableTotal={ this.state.tableTotal } 
					data={this.state.tableData} 
					onPageChange={ this.onPageChange }
					sreachOrders={ this.sreachOrders } 
                />
            </section>
        )
    }
}