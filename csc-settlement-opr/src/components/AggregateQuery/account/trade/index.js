import React, { Component } from 'react';
import { DatePicker, Select, Input, Button, InputNumber, Icon, message } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Table from './component/Table';
import httpRequest from '../../../../request/Fetch';
import { routeRootPath } from '../../../common/method';
import '../style.scss';

const { RangePicker } = DatePicker;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const date = new Date();
let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();

month = String(month).length === 1 ? `0${month}` : month;
day = String(day).length === 1 ? `0${day}` : day;

class TradeDetail extends Component {
    state = {
        menuSwitch: [{ // 栏目菜单数据
			name: '全部',
			active: true,
			state: '',
		},{ 
			name: '收款',
			active: false,
			state: '贷',
		},{ 
			name: '付款',
			active: false,
			state: '借',
        }],
        monthSwitch: [{ // 月份菜单查询
			name: '近一个月',
			active: false
		},{ 
			name: '近三个月',
			active: false
        }],
        pageNumber: 1, //查询页码
        pageSize: 10, //查询每页的条数
        total: '', //总页码
        data: [], // 列表数据
        accountingStartDate: '', //记账日期起始日期
        accountingEndDate: '', //记账日期结束日期
        inAccountStartDate: '', //银行入账起日期
        inAccountEndDate: '', //银行入账结束日期
        restriction: '>', //金额区间
		startAmount: '', //金额起字段
        endAmount: '', //金额始字段
        sectionOption: false, // 金额区间显示;
        busCode: '', //会计订单号
        paymentCode: '', //结算订单号
        opposite: '', //对方开户名称
        prSign: '', //收付款（收：贷，付：借）
        exportURL: '', // 导出的链接
    }

    componentDidMount () {
        this.getTransactionDetail();
    }

    // 栏目切换;
	menuSwitchActive = (data) => {
        let { menuSwitch, monthSwitch } = this.state;

        monthSwitch.forEach((item, index) => {
            item.active = false;
        });

		menuSwitch.forEach((item, index) => {
			if (data.name === item.name) {
                item.active = true;
                
                this.setState({
                    menuSwitch,
                    monthSwitch,
                    prSign: data.state,
                    pageNumber: 1,
                    busCode: '',
                    paymentCode: '',
                    opposite: '',
                    accountingStartDate: '',
                    accountingEndDate: '',
                    inAccountStartDate: '',
                    inAccountEndDate: '',
                    restriction: '>',
                    sectionOption: false,
                    startAmount: '',
                    endAmount: ''
                }, () => {
                    this.getTransactionDetail();
                })
			} else {
				item.active = false;
			}
        });
    }

    // 月份菜单切换
    monthSwitchActive = (data) => {
        let monthSwitch = this.state.monthSwitch;

		monthSwitch.forEach((item, index) => {
			if (data.name === item.name) {
                item.active = true;

                this.setState({
                    pageNumber: 1
                }, () => {
                    if (data.name === '近一个月') {
                        this.nearOneMonth();
                    } else {
                        this.nearThreeMonth();
                    }
                });
			} else {
				item.active = false;
            }
        })
        
        this.setState({
            monthSwitch
        })
    }

    // 记账日期选择;
	dateJZChange = (dates, dateStrings) => {
		this.setState({
			accountingStartDate: dateStrings[0] + ' 00:00:00',
			accountingEndDate: dateStrings[1] + ' 23:59:59'
		})
    }

    // 银行入账日期选择;
	dateYHChange = (dates, dateStrings) => {
		this.setState({
			inAccountStartDate: dateStrings[0] + ' 00:00:00',
			inAccountEndDate: dateStrings[1] + ' 23:59:59'
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
    
    // 页码回调
    onPageChange = (num) => {
        this.setState({
            pageNumber: num
        }, () => {
            this.getTransactionDetail()
        })
    }

    // 获取交易明细搜索列表
    getTransactionDetail = () => {
        const { pageSize, pageNumber, startAmount, endAmount, accountingStartDate, accountingEndDate, inAccountStartDate, inAccountEndDate, restriction, opposite, paymentCode, busCode, prSign  } = this.state;

        httpRequest({
            addr: 'getTransactionDetail',
            amountEnd: endAmount,
            amount: startAmount,
            pageSize,
            pageNumber,
            accountingStartDate,
            accountingEndDate,
            inAccountStartDate,
            inAccountEndDate,
            compareSign: restriction,
            opposite,
            busCode,
            paymentCode,
            prSign,
            accountNumber: this.props.location ? this.props.location.state.accountNumber : ''
        }, respone => {
            this.setState({
                data: respone.data.rows,
                total: respone.data.total
            }, () => {
                // 导出请求
                // this.exportTransactionDetail();
            })
        })
    }

    // 监听对方开户名称
    oppositeChange = (e) => {
        let opposite = e.target.value;

        this.setState({
            opposite
        });
    }

    // 监听结算订单号名称
    paymentCodeChange = (e) => {
        let paymentCode = e.target.value;

        this.setState({
            paymentCode
        });
    }

    // 监听会计服务订单号名称
    busCodeChange = (e) => {
        let busCode = e.target.value;

        this.setState({
            busCode
        });
    }

    // 近一月入账查询
    nearOneMonth = () => {
        this.setState({
            inAccountStartDate: `${year}-${month}-01`,
            inAccountEndDate: `${year}-${month}-${day}`,
        },() => {
            this.getTransactionDetail();
        });
    }

    // 近三月入账查询
    nearThreeMonth = () => {
        let mm = '';
        let yy = '';

        if (Number(month) - 3 > 0) {
            mm = `0${(Number(month) - 3)}`;
            yy = year;
        } else {
            yy = Number(year) - 1;
            mm = `${12 + (Number(month) - 3)}`
            mm = String(mm).length === 1 ? `0${mm}` : mm;
        }

        this.setState({
            inAccountStartDate: `${yy}-${mm}-01`,
            inAccountEndDate: `${year}-${month}-${day}`,
        },() => {
            this.getTransactionDetail();
        });
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
            pageNumber: 1
        }, () => {
            this.getTransactionDetail()
        });
    }

    // 导出接口
    exportTransactionDetail = () => {
        const { pageSize, pageNumber, startAmount, endAmount, accountingStartDate, accountingEndDate, inAccountStartDate, inAccountEndDate, restriction, opposite, paymentCode, busCode, prSign  } = this.state;

        httpRequest({
            addr: 'exportTransactionDetail',
            amountEnd: endAmount,
            amount: startAmount,
            pageSize,
            pageNumber,
            accountingStartDate,
            accountingEndDate,
            inAccountStartDate,
            inAccountEndDate,
            compareSign: restriction,
            opposite,
            busCode,
            paymentCode,
            prSign,
            accountNumber: this.props.location ? this.props.location.state.accountNumber : ''
        }, respone => {
            this.setState({
                exportURL: respone.url
            });
        })
    }

    // 点击导出按钮
    handleExportButton = () => {
        const { exportURL } = this.state;

        if (exportURL) {
            window.open(encodeURI(window.location.protocol + '//' + window.location.host + '/imgservice/download/' + exportURL));
        } else {
            message.warning('正在加载...请稍后再试');
        }
    }

    render () {
        const { location } = this.props;

        return (
            <section className="trade-box">
                <nav className="bread-navbar">
                    <div className="container" style={{ backgroundColor: '#f5f8fa' }}>
                        <div className="pull-left location-back">
                            <Link to={routeRootPath + "aggregate-query/account"}>
                                <Icon type="left" />
                                <span>返回</span>
                            </Link>
                        </div>

                        <ul className="pull-left list-inline navbar-group">
                            <li>账户查询 > </li>
                            <li>{ location.state ? location.state.accountName : '' }</li>
                        </ul>
                        <div className="clear"></div>
                    </div>
                </nav>

                <div className="trade-content">
                    <div className="account-info">
                        <span className="info-group">
                            银行开户名称：<em>{ location.state ? location.state.accountName : '' }</em>
                        </span>
                        
                        <span className="info-group">
                            银行账号：<em>{ location.state ? location.state.accountNumber : '' }</em>
                        </span>

                        <span className="info-group">
                            币种：<em>{ location.state ? location.state.currencyName : '' }</em>
                        </span>
                    </div>

                    <div className="menu-switch">
                        <ul className="list-inline">
                            {
                                this.state.menuSwitch.map((item, index) => {
                                    return <li onClick={ this.menuSwitchActive.bind(this, item) } key={ index } className={`${item.active ? 'active' : ''}`}>{item.name}</li>
                                })
                            }
                        </ul>
                    </div>

                    <div className="container search-box" style={{marginBottom: 10}}>
                        <div className="pull-left search-group">
                            <Input style={{ width: 250, height: 32 }} onChange={ this.oppositeChange } placeholder="对方开户名称/账号" value={ this.state.opposite } />
                        </div>

                        <div className="pull-left search-group">
                            <Input style={{ width: 250, height: 32 }} onChange={ this.paymentCodeChange } placeholder="结算订单号" value={ this.state.paymentCode } />
                        </div>

                        <div className="pull-left search-group">
                            <Input style={{ width: 250, height: 32 }} onChange={ this.busCodeChange } placeholder="会计服务订单号" value={ this.state.busCode } />
                        </div>

                        <div className="pull-left search-group">
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

                        <div className="clear"></div>
                    </div>

                    <div className="container search-box" style={{marginTop: 0}}>
                        <div className="pull-left search-group">
                            <span className="pull-left name">记账日期：</span>

                            <RangePicker
                                className="pull-left date-style"	
                                size="large"
                                allowClear={ false }
                                format={dateFormat}
                                value={this.state.accountingStartDate ? [moment(this.state.accountingStartDate,dateFormat), moment(this.state.accountingEndDate, dateFormat)] : []}
                                onChange={ this.dateJZChange }
                            />
                        </div>

                        <div className="pull-left search-group">
                            <span className="pull-left name">银行入账日期：</span>

                            <RangePicker
                                className="pull-left date-style"	
                                size="large"
                                allowClear={ false }
                                format={dateFormat}
                                value={this.state.inAccountStartDate ? [moment(this.state.inAccountStartDate, dateFormat), moment(this.state.inAccountEndDate, dateFormat)] : []}
                                onChange={ this.dateYHChange }
                            />
                        </div>
                        
                        <div className="pull-left search-group">
                            <Button onClick={this.searchOldTest} style={{ width: 32, height: 32, borderRadius: 32, fontSize: 18 }} type="primary" shape="circle" icon="search" />
                        </div>

                        <div className="clear"></div>
                    </div>

                    <div className="container export-group">
                        <div className="pull-left month-search">
                            <ul className="list-inline">
                                {
                                    this.state.monthSwitch.map((item, index) => {
                                        return <li onClick={ this.monthSwitchActive.bind(this, item) } key={ index } className={`${item.active ? 'active' : ''}`}>{item.name}</li>
                                    })
                                }
                            </ul>
                        </div>
                        <div className="pull-right export">
                            <Button onClick={ this.handleExportButton } type="primary" style={{ width: 72, height: 32, backgroundColor: '#23b8f6', borderColor: '#23b8f6' }}>导出</Button>
                        </div>
                        <div className="clear"></div>
                    </div>

                    <div className="table-box">
                        <Table
                            pageSize={ this.state.pageSize }
                            total={ this.state.total }
                            curId={location.state ? location.state.accountNumber : ''}
                            current={ this.state.pageNumber }
                            onPageChange={ this.onPageChange }
                            data = { this.state.data }
                        />
                    </div>
                </div>
            </section>
        )
    }
}

export default TradeDetail;