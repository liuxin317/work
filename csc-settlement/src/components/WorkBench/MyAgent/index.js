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
    menuState: 1, //当前处理那个菜单（1、付款申请；2、调拨申请）
  }

  componentDidMount () {
    this.getProcessHandle();
  }

  menuActive = (data) => { // 切换菜单;
    let menuListData = this.state.menuList;

    menuListData.forEach(item => {
      if (data.title === item.title) {
        item.active = true;
      } else {
        item.active = false;
      }
    });

    this.setState({
      processData: [],
      menuList: menuListData,
      menuState: data.state,
      accountName: '',
      pageNumber: 1,
    }, () => {
      this.getProcessHandle();
    })
  }
  
  // 获取列表
  getProcessHandle = () => {
    const { pageNumber, pageSize, accountName } = this.state;

    Util.comFetch({
      addr: 'getProcessHandle',
      companyId: userInfo.companyRowId,
      type: this.state.menuState,
      pageNumber,
      pageSize,
      accountName
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
      this.getProcessHandle()
    });
  }

  // 点击搜索按钮
  searchList = () => {
		this.setState({pageNumber: 1}, () => { this.getProcessHandle() })
  }

  render () {
    return (
      <section className="payment-apply-box">
        <h2 className="column-title">当前位置：我的待办</h2>
        
        <div className="pull-left menu-switch">
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
              <em className="pull-left untreated">待处理项：<span className="untreated-number">{ this.state.row }</span></em>
              <div className="pull-right search-box">
                <Input value={ this.state.accountName } className="pull-left search-box__input" onChange={ this.searchInput } placeholder={ this.state.menuState == 1 ? '收款方账户名称' : '收款方账号' }/>
                <Button onClick={ this.searchList } className="pull-left search-box__button" type="primary" shape="circle" icon="search" />
                <div className="clear"></div>
              </div>
              <div className="clear"></div>
            </div>

            <TableBox 
              menuState={ this.state.menuState } 
              sreachOrders={ this.getProcessHandle } 
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
