import React, { Component } from 'react';
import { DatePicker, Select, Input, Button, InputNumber, message } from 'antd';
import Table from './component/Table';
import HttpRequest from '../../../request/Fetch';
import moment from 'moment';
import '../rule/style.scss';
import './style.scss';

// 组织机构组件
import TreeOrg from '../../common/tree/TreeOrg';

const { RangePicker } = DatePicker;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';

class Account extends Component {
    state = {
        pageNumber: 1, //查询页码
        pageSize: 10, //查询每页的条数
        total: '', //总页码
        data: [], // 列表数据
        bussInitial: [], // 初始化组织机构
        orgCode: '', // 选择组织机构code
        startPrePayTime: '', // 预支付起始日期
        endPrePayTime: '', // 预支付结束日期
        startCreatedTime: '', //结算单起始日期
        endCreatedTime: '', //结算单结束日期
        startRealPayTime: '', //实支付起始日期
        endRealPayTime: '', // 实支付结束日期
        keyword: '', // 关键词查询
        restriction: '>', //金额区间
		startAmount: '', //金额起字段
        endAmount: '', //金额始字段
        sectionOption: false, // 金额区间显示;
        searchState: [{ // 搜索状态
			name: '全部状态',
			active: true,
			state: '0,1,2,3,4,5,6,7,8,9',
		},{ 
			name: '待审核',
			active: false,
			state: '8',
        },{ 
			name: '审核中',
			active: false,
			state: '9',
		},{ 
			name: '待支付',
			active: false,
			state: '0',
        },{ 
			name: '处理中',
			active: false,
			state: '1',
		},{ 
			name: '支付成功',
			active: false,
			state: '2',
        },{ 
			name: '支付失败',
			active: false,
			state: '3',
        },{ 
			name: '已退回',
			active: false,
			state: '4',
        },{ 
			name: '已结清',
			active: false,
			state: '6',
        },{ 
			name: '已作废',
			active: false,
			state: '7',
        }],
        state: '0,1,2,3,4,5,6,7,8,9', // 选中得搜索状态
        TreeData: [], // 组织机构树
        searchPostionData: '', // 搜索组织机构;
    }

    componentDidMount () {
        this.getOrgsOfTree();
    }

    // 页码回调
    onPageChange = (num) => {
        this.setState({
            pageNumber: num,
        }, () => {
            this.ordersApi();
        })
    }

    // 组织机构选中数据;
	// orgCheckValue = (vals) => {
    //     let orgCode = vals.join(',');
        
	// 	this.setState({
	// 	   orgCode
	// 	})
    // };
    
    // 监听结算单日期选择;
	dateJSChange = (dates, dateStrings) => {
		this.setState({
			startCreatedTime: dateStrings[0] + ' 00:00:00',
			endCreatedTime: dateStrings[1] + ' 23:59:59'
		})
    }

    // 监听预支付日期选择;
	datePreChange = (dates, dateStrings) => {
		this.setState({
			startPrePayTime: dateStrings[0] + ' 00:00:00',
			endPrePayTime: dateStrings[1] + ' 23:59:59'
		})
    }

    // 监听实支付日期选择;
	dateRealChange = (dates, dateStrings) => {
		this.setState({
			startRealPayTime: dateStrings[0] + ' 00:00:00',
			endRealPayTime: dateStrings[1] + ' 23:59:59'
		})
    }
    
    // 金额区间选择
	handleSectionChange = (value) => {
		let sectionOption;
		if (value === 'between') {
			sectionOption = true;
		} else {
			sectionOption = false;
		}

		this.setState({
			sectionOption,
			restriction: value
		})
    }
    
    // 金额区间起金额；
	stateChangeMoney = (value) => {
		let startAmount = value;
		this.setState({
			startAmount
		})
	}
	
	// 金额区间始金额；
	endChangeMoney = (value) => {
		let endAmount = value;
		this.setState({
			endAmount
		})
    }

    // 监听搜索状态
    handleStateChange = (value) => {
        this.setState({
            state: value
        })
    }

    // 搜索前检测;
	searchOldTest = () => {
		let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;

		if (this.state.keyword) {
			if (!reg.test(this.state.keyword)) {
				message.warning('搜索内容不能有特殊字符')
				return false
			}
		}

		if (this.state.restriction === 'between') {
			if (!this.state.startAmount) {
				message.warning('请输入起始金额');
				return false;
			} else if (!this.state.endAmount) {
				message.warning('请输入结束金额');
				return false;
			} else if (Number(this.state.startAmount) >= Number(this.state.endAmount)) {
				message.warning('金额起始要小于结束金额')
				return false;
			}
        }

        this.setState({
            pageNumber: 1,
        }, () => {
            this.ordersApi();
        });
    }

    // 获取组织机构数据;
    getOrgsOfTree = () => {
        HttpRequest({
            addr: 'getOrgsOfTree'
        }, respone => {
            this.setState({
                TreeData: respone.orgs
            }, () => {
                this.ordersApi();
            })
        })
    }
    
    // 监听关键词搜索
    handleKeywordChange = (e) => {
        let keyword = e.target.value;

        this.setState({
            keyword
        })
    }

    // 查询付款列表
    ordersApi = () => {
        const { pageNumber, pageSize, orgCode, startPrePayTime, endPrePayTime, startCreatedTime, endCreatedTime, startRealPayTime, endRealPayTime, keyword, restriction, startAmount, endAmount, state } = this.state;

        let params = {
            addr: 'ordersApi',
            pageNumber,
            pageSize,
            orgCode,
            startPrePayTime,
            endPrePayTime,
            startCreatedTime,
            endCreatedTime,
            startRealPayTime,
            endRealPayTime,
            keyword,
            restriction,
            startAmount,
            endAmount,
            state
        };

        // 判断字段为空不传
        for (let key in params) {
            if (!params[key]) {
                delete params[key]
            }
        };

        HttpRequest(params, respone => {
            this.setState({
                data: respone.data.rows,
                total: respone.data.total
            })
        })
    }

    // 组织机构选中数据;
    setSearchPostionData = (data) => { // 选中查询数据替换;
        var str = '';
        data.forEach(function(item) {
          str += item.code +','
        });
    
        this.setState({
            orgCode: str.substr(0, str.length-1)
        });
    }

    clearSearchPostionData = () => { // 清空选择;
        this.setState({
          searchPostionData: ''
        });
    }

    render () {
        return (
            <section className="container rule-box payment-box">
                <h4 className="column-title">当前位置：付款查询</h4>

                <div className="search-group search-box">
                    <div className="pull-left search-small-group">
                        <TreeOrg name="组织机构：" isDisplayBox={true} displaySearch={true} checkbox={true} postionData={this.setSearchPostionData} orgsOfTree={this.state.TreeData} clearSearchPostionData={this.clearSearchPostionData} oneTreeData={false} openRetract={ true } />
                    </div>

                    <div className="pull-left search-small-group">
                        <span className="pull-left name">结账单日期：</span>

                        <RangePicker
                            className="pull-left date-style"	
                            size="large"
                            allowClear={ false }
                            format={dateFormat}
                            value={this.state.startCreatedTime ? [moment(this.state.startCreatedTime,dateFormat), moment(this.state.endCreatedTime, dateFormat)] : []}
                            onChange={ this.dateJSChange }
                        />
                    </div>

                    <div className="pull-left search-small-group">
                        <span className="pull-left name">金额：</span>

                        <Select className="pull-left" size="large" value={ this.state.restriction } style={{ width: 80 }} onChange={this.handleSectionChange}>
                            <Option value=">">></Option>
                            <Option value="<">{'<'}</Option>
                            <Option value="=">=</Option>
                            <Option value="between">区间</Option>
                        </Select>

                        <InputNumber min={1} step={0.01} precision={2} onChange={ this.stateChangeMoney } placeholder="请输入金额" value={this.state.startAmount} className="pull-left line-style" style={{ width: 100, height: 32, marginLeft: 10 }} />

                        {
                            this.state.sectionOption 
                            ? 
                            <div className="pull-left section-group">
                                <span className="pull-left">~</span>
                                <InputNumber min={1} step={0.01} precision={2} onChange={ this.endChangeMoney } placeholder="请输入金额" value={this.state.endAmount} className="pull-left line-style" style={{ width: 100, height: 32 }} />
                            </div>
                            :
                            ''
                        }
                    </div>

                    <div className="pull-left search-small-group">
                        <span className="pull-left name">预支付日期：</span>

                        <RangePicker
                            className="pull-left date-style"	
                            size="large"
                            allowClear={ false }
                            format={dateFormat}
                            value={this.state.startPrePayTime ? [moment(this.state.startPrePayTime, dateFormat), moment(this.state.endPrePayTime, dateFormat)] : []}
                            onChange={ this.datePreChange }
                        />
                    </div>
                    
                    <div className="clear"></div>
                </div>

                <div className="search-group search-box" style={{ marginTop: 10 }}>
                    <div className="pull-left search-small-group">
                        <span className="pull-left name">实支付日期：</span>

                        <RangePicker
                            className="pull-left date-style"	
                            size="large"
                            allowClear={ false }
                            format={dateFormat}
                            value={this.state.startRealPayTime ? [moment(this.state.startRealPayTime, dateFormat), moment(this.state.endRealPayTime, dateFormat)] : []}
                            onChange={ this.dateRealChange }
                        />
                    </div>

                    <div className="pull-left search-small-group">
                        <span className="pull-left name">状态：</span>

                        <Select className="pull-left" size="large" value={ this.state.state } style={{ width: 110 }} onChange={this.handleStateChange}>
                            {
                                this.state.searchState.map((item, index) => {
                                    return <Option value={ item.state } key={ index }>{ item.name }</Option>
                                })
                            }
                        </Select>
                    </div>
                    
                    <div className="pull-left search-small-group">
                        <Input style={{ width: 500, height: 32 }} placeholder="结算单号/收支对象名称/收款方账户名称/付款方账号" onChange={ this.handleKeywordChange } />
                    </div>

                    <div className="pull-left search-small-group">
                        <Button onClick={ this.searchOldTest } className="pull-left search-button" type="primary" shape="circle" icon="search" />
                    </div> 

                    <div className="clear"></div>
                </div>

                <div className="table-box">
                    <Table
                        pageSize={ this.state.pageSize }
                        total={ this.state.total }
                        current={ this.state.pageNumber }
                        onPageChange={ this.onPageChange }
                        data = { this.state.data }
                    />
                </div>
            </section>
        )
    }
}

export default Account;