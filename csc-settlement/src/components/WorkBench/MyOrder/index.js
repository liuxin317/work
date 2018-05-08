import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, Icon, Button } from 'antd';
import TableBox from './components/table';
import './style.scss';

export default class PaymentApply extends Component {
  constructor (props) {
    super(props)
  }

  state = {
    menuSwitch: [{ // 头部菜单数据
			name: '处理中',
			active: true,
			state: 1,
		},{ 
      name: '已完成',
      active: false,
      state: 2,
    }],
    menuList: [{
      title: '付款申请',
      state: 1,
      active: true
    },{
      title: '调拨申请',
      state: 2,
      active: false
    },],
    pageNumber: 1, //查询页码
    pageSize: 10, //查询每页的条数
    accountName: '', //查询字段
    processData: '', // 列表数据
    row: '', //待处理num
    tableTotal: '', //总页码
    menuListState: 1, //当前处理那个菜单（1、付款申请；2、调拨申请）
    menuSwitchState: 1, // 1、处理中，2、已完成
  }

  componentDidMount () {
    this.getUserProcess();
  }

  menuActive = (data) => { // 栏目列表切换菜单;
    let menuListData = this.state.menuList;

    menuListData.forEach(item => {
      if (data.title === item.title) {
        item.active = true;
      } else {
        item.active = false;
      }
    });

    this.setState({
      menuList: menuListData,
      menuListState: data.state,
      accountName: '',
      pageNumber: 1,
    }, () => {
      this.getUserProcess()
    })
  }
  
  // 获取列表
  getUserProcess = () => {
    const { pageNumber, pageSize, accountName, menuSwitchState, menuListState } = this.state;

    Util.comFetch({
      addr: 'getUserProcess',
      companyId: userInfo.companyRowId,
      type: menuListState,
      pageNumber,
      pageSize,
      accountName,
      state: menuSwitchState
    }, res => {
      this.setState({
        processData: res.data,
        row: res.row,
        tableTotal: res.data.total
      })
    })
  }

  // 监听搜索框内容
  searchInput = (e) => {
    let accountName = e.target.value;

    this.setState({
      accountName
    })
  }

  // 页码回调函数
  onPageChange = (number) => {
    this.setState({
      pageNumber: number
    }, () => {
      this.getUserProcess()
    });
  }

  // 点击搜索按钮
  searchList = () => {
		this.setState({pageNumber: 1}, () => { this.getUserProcess() })
  }

  // 状态菜单切换;
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
      menuSwitchState: data.state,
      accountName: '',
      pageNumber: 1,
    }, () => {
      this.getUserProcess()
    })
  }

  render () {
    return (
      <section className="payment-apply-box">
        <h2 className="column-title">当前位置：我的订单</h2>

        <div className="menu-switch-top">
					<ul className="pull-left list-inline">
						{
							this.state.menuSwitch.map((item, index) => {
								return <li onClick={ this.menuSwitchActive.bind(this, item) } key={ index } className={`${item.active ? 'active' : ''}`}>{item.name}</li>
							})
						}
					</ul>

          <div className="clear"></div>
				</div>
        
        <div className="pull-left menu-switch-list">
          <ul className="menu-listed">
            {
              this.state.menuList.map((item, index)=> {
                  if (item.active) {
                    return (
                      <li key={ index } className="menu-listed-active">{ item.title }</li>
                    )
                  } else {
                    return (
                      <li key={ index } onClick={ this.menuActive.bind(this, item) }>{ item.title }</li>
                    )
                  }
              })
            }
          </ul>
        </div>

        <div className="pull-right menu-content">
            <div className="menu-content__top">
              <em className="pull-left untreated">{ this.state.menuSwitchState === 1 ? '待处理项' : '已完成项'}：<span className="untreated-number">{ this.state.row }</span></em>
              <div className="pull-right search-box">
                <Input value={ this.state.accountName } className="pull-left search-box__input" onChange={ this.searchInput } placeholder={ this.state.menuListState === 1 ? "收款方账户名称" : "收款方账号"}/>
                <Button onClick={ this.searchList } className="pull-left search-box__button" type="primary" shape="circle" icon="search" />
                <div className="clear"></div>
              </div>
              <div className="clear"></div>
            </div>

            <TableBox 
              menuSwitchState={ this.state.menuSwitchState }
              menuState={ this.state.menuListState } 
              sreachOrders={ this.getUserProcess } 
              tableData={ this.state.processData } 
              current={ this.state.pageNumber } 
              pageSize={ this.state.pageSize } 
              tableTotal={ this.state.tableTotal } 
              onPageChange={ this.onPageChange }
            />
        </div>

        <div className="clear"></div>
      </section>
    )
  }
}
