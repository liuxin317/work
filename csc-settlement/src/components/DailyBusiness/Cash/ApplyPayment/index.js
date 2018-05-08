import React, { Component } from 'react';
import './style.scss';
import { DatePicker, Select, Input, Button, InputNumber, message } from 'antd';
import moment from 'moment';
import TableList from './components/TablePayment';
import TreeDroplist from "../../../common/OrgMy";
import BatchFreezeDialog from '../common/BatchFreezeDialog';
import BatchEditDialog from '../common/BatchEditDialog';

const { RangePicker } = DatePicker;
const Option = Select.Option;

const dateFormat = 'YYYY-MM-DD';
// const date = new Date();
// const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();

// defaultValue={[moment(`${year}/${month}/01`, dateFormat), moment(`${year}/${month}/${day}`, dateFormat)]}

export default class ApplyPayment extends Component {
	state = {
		menuSwitch: [{ // 头部菜单数据
			name: '待审核',
			active: true,
			state: '5,8',
		},{ 
			name: '支付失败',
			active: false,
			state: 3,
		}],
		columnType: 1, // 表格类型(1、未审核，2、审核中，3、支付失败)
		tableData: [], //表格数据
		sectionOption: false, // 区间显示;
		orgsOfTree: '', //组织机构数据
		bussInitial: [],
		state: '5,8', // 查询状态;
		pageNumber: 1, // 查询页码
		pageSize: 10, // 查询每页的条数
		startCreatedTime: '', //生成日期起始日期
		endCreatedTime: '', //生成日期结束日期
		orgCode: '', //组织机构code
		restriction: '>', //金额区间
		startAmount: '', //金额起字段
		endAmount: '', //金额始字段
		keyword: '', //输入框内容
		startPrePayTime: '', //预支付起日期
		endPrePayTime: '', //预支付始日期
		exportUrl: '', //导出链接
		tableTotal: '', //总页码
    batchFreezeVisible: false, //批量冻结弹框
    batchFreezeData: [], //批量冻结处理的数据
    batchEditVisible: false, //批量编辑弹框
    batchEditData: [], //批量编辑处理的数据
    selRows: [], //表格选择的行
	}

	componentDidMount () {
		this.getOrgsOfTree();
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

		document.getElementsByClassName('cur-sel-text')[0].innerHTML = '';

		this.setState({
			menuSwitch,
			columnType: type,
			state: data.state,
			startCreatedTime: '',
			endCreatedTime: '',
			orgCode: '',
			restriction: '>',
			startAmount: '',
			endAmount: '',
			startPrePayTime: '',
			endPrePayTime: '',
			keyword: '',
			sectionOption: false,
			exportUrl: '',
      selRows: [],
		}, () => {
			this.sreachOrders()
		})
	}
	
	// 日期选择;
	dateChange = (dates, dateStrings) => {
		this.setState({
			startCreatedTime: dateStrings[0] + ' 00:00:00',
			endCreatedTime: dateStrings[1] + ' 23:59:59'
		})
	}

	// 预支付日期选择;
	PaymentDateChange = (dates, dateStrings) => {
		this.setState({
			startPrePayTime: dateStrings[0] + ' 00:00:00',
			endPrePayTime: dateStrings[1] + ' 23:59:59'
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

	// 获取组织机构
	getOrgsOfTree = () => {
		Util.comFetch({
			addr: 'getOrgsOfTree',
			code: userInfo.orgCode
		}, res => {
			let treeData = Util.getOrgData(res.orgs);
			
			this.setState({
				orgsOfTree: treeData
			})
		})
	}
	
	// 组织机构选中数据;
	orgCheckValue = (vals) => {
		let orgCode = vals.join(',');
		this.setState({
		   orgCode
		})
	};
	
	// 金额区间起金额；
	stateChangeMoney = (value) => {
		let startAmount = value;
		console.log(value)
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

	// 搜索框内容;
	keyWordsChange = (e) => {
		let keyword = e.target.value;
		this.setState({
			keyword
		})
	}
	
	// 查询列表;
	sreachOrders = (rowData) => {
		let { pageNumber, 
				pageSize, 
				state, 
				startCreatedTime, 
				endCreatedTime, 
				orgCode, 
				restriction, 
				startAmount,
				endAmount,
				keyword,
				startPrePayTime,
				endPrePayTime, } = this.state;

		let parames = {
			pageNumber,
			pageSize,
			state,
			startCreatedTime,
			endCreatedTime,
			orgCode,
			keyword,
			startAmount,
			endAmount,
			startPrePayTime,
			endPrePayTime,
		};

		if (startAmount) {
			parames.restriction = restriction;
		}

		Util.comFetch({
			addr: 'orders',
			...parames
		}, res => {
      res.data.rows.forEach((row) => {
        if (!row.acAccount) {
          row.acAccount = {};
        }
        if (!row.myAccount) {
        	row.myAccount = {};
				}
      });
			this.getExport();
			this.setState({
				tableData: res.data.rows,
				tableTotal: res.data.total
			}, () => {
				if (rowData) {
					this.refs.tableList.upRowData(res.data.rows)
				}
			})
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

		this.sreachOrders();
	}

	// 导出
	getExport = () => {
		let { state, 
			startCreatedTime, 
			endCreatedTime, 
			orgCode, 
			restriction, 
			startAmount,
			endAmount,
			keyword,
			startPrePayTime,
			endPrePayTime, } = this.state;

		let parames = {
			state,
			startCreatedTime,
			endCreatedTime,
			orgCode,
			keyword,
			startAmount,
			endAmount,
			startPrePayTime,
			endPrePayTime,
		};

		if (startAmount) {
			parames.restriction = restriction;
		}

		Util.comFetch({
			addr: 'export',
			pageSize: 10000,
			pageNumber: 1,
			...parames
		}, res => {
			let exportUrl = encodeURI(AppConf.downloadPrefix + res.data);
			this.setState({
				exportUrl
			})
		})
	}

	// 打开导出链接;
	openExportUrl = () => {
		if (!this.state.tableData.length) {
			message.warning('无数据')
		} else {
			if (this.state.exportUrl === '') {
				message.warning('正在请求...请稍后再试')
			} else {
				window.open(this.state.exportUrl);
			}
		}
	}

	// 页码回调函数
	onPageChange = (number) => {
		this.setState({
			pageNumber: number
		}, () => {
			this.sreachOrders()
		});
	}

	// 点击搜索按钮
	searchList = () => {
		this.setState({pageNumber: 1}, () => { this.searchOldTest() })
	}

  // 更新表格选中行的序号
  selRowsUpdate = (rows) => {
    this.setState({selRows: rows});
  }

  // 检查当前页是否有选中项
  chkSeld() {
    const { selRows, tableData } = this.state;
    let hasSeled = false;
    let rowsData = [];
    let ascRows = selRows.slice().sort((a, b) => { return a < b ? -1 : 1; });
    ascRows.forEach((num) => {
      if (tableData[num]) {
      	hasSeled = true;
      	rowsData.push(tableData[num]);
      }
    });
    return {
    	hasSeled,
			rowsData
    };
	}

  // 点击批量冻结/解冻按钮
  batchFreeze = () => {
    let chk = this.chkSeld();
		if (!chk.hasSeled) {
      message.warning('请选择需要处理的数据项');
      return;
		}

		this.setState({
			batchFreezeVisible: true,
			batchFreezeData: chk.rowsData
		});
	}

	// 批量冻结/解冻弹框关闭
  batchFreezeClose = (refresh) => {
		this.setState({
      batchFreezeVisible: false
		});
		if (refresh) {
			this.sreachOrders();
		}
	}

  // 点击批量编辑按钮
  batchEdit = () => {
    let chk = this.chkSeld();
    if (!chk.hasSeled) {
      message.warning('请选择需要处理的数据项');
      return;
    }
    let hasFreeze = chk.rowsData.some(item => item.freeze);
    let hasAbnormal = chk.rowsData.some(item => item.state === 'ABNORMAL');
    if (hasFreeze) {
      message.warning('请选择未冻结的数据项');
      return;
    }
    if (hasAbnormal) {
      message.warning('请选择非异常的数据项');
      return;
    }

    this.setState({
      batchEditVisible: true,
      batchEditData: chk.rowsData
    });
  }

  // 批量编辑弹框关闭
  batchEditClose = (refresh) => {
    this.setState({
      batchEditVisible: false
    });
    if (refresh) {
      this.sreachOrders();
    }
  }

	render () {
		const { selRows, batchFreezeVisible, batchFreezeData, batchEditVisible, batchEditData } = this.state;

		return (
			<section className="apply-payment-box">
				{/*<h2 className="column-title">当前位置：付款申请</h2>*/}
				<p  style={{marginBottom:'10px',fontSize:'16px'}} className="title"><span className="light-black">当前位置:</span>付款申请</p>

				<div className="menu-switch">
					<ul className="list-inline">
						{
							this.state.menuSwitch.map((item, index) => {
								return <li onClick={ this.menuSwitchActive.bind(this, item) } key={ index } className={`${item.active ? 'active' : ''}`}>{item.name}</li>
							})
						}
					</ul>
				</div>

				<div className="search-box">
					<div className="pull-left search-group">
						<span className="pull-left name">生成日期：</span>

						<RangePicker
						   className="pull-left date-style"	
						   size="large"
						   allowClear={ false }
					      format={dateFormat}
					      value={this.state.startCreatedTime ? [moment(this.state.startCreatedTime, dateFormat), moment(this.state.endCreatedTime, dateFormat)] : []}
					      onChange={ this.dateChange }
					    />
					</div>
					<div  style={{display:'inline-block',verticalAlign: 'top', height: '30px', lineHeight: '28px'}}>
						<span  style={{marginLeft:"20px"}}>组织机构:  </span>
						{this.state.orgsOfTree!==''&&<TreeDroplist
							// style={{width:"400px"  ,  display:"inline-block"}}
							data={this.state.orgsOfTree}
							multi={true}
							edit={false}
							initialSels={this.state.bussInitial}
							onChg={(vals) => {
								this.orgCheckValue(vals)
							}}
	              />}
					</div>

					<div className="pull-left search-group">
						<span className="pull-left name">金额：</span>
						<Select className="pull-left" size="large" value={ this.state.restriction } style={{ width: 72 }} onChange={this.handleSectionChange}>
					      <Option value=">">></Option>
					      <Option value="<">{'<'}</Option>
					      <Option value="=">=</Option>
					      <Option value="between">区间</Option>
					    </Select>
					    <InputNumber min={0} step={0.01} precision={2} onChange={ this.stateChangeMoney } placeholder="请输入金额" value={this.state.startAmount} className="pull-left line-style" style={{ width: 128, height: 32, marginLeft: 10 }} />
					    {
					    	this.state.sectionOption 
					    	? 
					    	<div className="pull-left section-group">
								<span className="pull-left">~</span>
								<InputNumber min={0} step={0.01} precision={2} onChange={ this.endChangeMoney } placeholder="请输入金额" value={this.state.endAmount} className="pull-left line-style" style={{ width: 128, height: 32 }} />
						    </div>
						    :
						    ''
					    }
					</div>

					<div className="pull-left search-group">
						<span className="pull-left name">预支付日期：</span>
						<RangePicker
						  	className="pull-left date-style"	
						  	size="large"
					      format={dateFormat}
					      allowClear={ false }
					      value={this.state.startPrePayTime ? [moment(this.state.startPrePayTime, dateFormat), moment(this.state.endPrePayTime, dateFormat)] : []}
					      onChange={ this.PaymentDateChange }
					    />
					</div>

					<div className="clear"></div>

					<div className="search-input-export">
						<div className="pull-left search-input">
							<Input onChange={ this.keyWordsChange } value={ this.state.keyword } className="pull-left" style={{ width: 500, height: 32, marginRight: 15 }} placeholder="结算中心单号/收支对象名称/业务订单号/收款方银行账户名称/付款方银行账号"/>
                			<Button onClick={ this.searchList } className="pull-left" style={{ width: 32, height: 32, borderRadius: 32, fontSize: 18 }} type="primary" shape="circle" icon="search" />
                			<div className="clear"></div>
						</div>
						<div className="pull-right">
							{/* <Button onClick={ this.openExportUrl } className="export" type="primary">导出</Button> */}
							{/*<button key={0} onClick={ this.batchFreeze } title="批量冻结/解冻" type="button" className="ant-btn  ant-btn-primary" style={{marginRight:'10px'}}>批量冻结/解冻</button>*/}
							{/*<button key={1} onClick={ this.batchEdit } title="批量编辑" type="button" className="ant-btn  ant-btn-primary" style={{marginRight:'10px'}}>批量编辑</button>*/}
							<button onClick={ this.openExportUrl } title="导出" type="button" className="ant-btn  ant-btn-primary ant-btn-circle"><i className="anticon anticon-upload"></i></button>
						</div>
						<div className="clear"></div>
					</div>
				</div>

				<TableList 
					ref="tableList"
					selRowsUpdate={this.selRowsUpdate}
					selRows={selRows}
					columnType={ this.state.columnType } 
					current={ this.state.pageNumber } 
					pageSize={ this.state.pageSize } 
					tableTotal={ this.state.tableTotal } 
					data={this.state.tableData} 
					onPageChange={ this.onPageChange }
					sreachOrders={ this.sreachOrders } />

				{
					batchFreezeVisible ?
						<BatchFreezeDialog
							data={batchFreezeData}
							visible={batchFreezeVisible}
							close={this.batchFreezeClose} />
						:
						null
				}
				{
					batchEditVisible ?
            <BatchEditDialog
							data={batchEditData}
							visible={batchEditVisible}
							close={this.batchEditClose} />
						:
						null
				}
			</section>
		)
	}
}