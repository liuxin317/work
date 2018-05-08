import React, { Component } from 'react';
import { Tooltip, Icon, Button, Modal, Select, Input, InputNumber, message } from 'antd';
import ApplyTable from './component/ApplyTable';
import AddEditList from './component/AddEditList/index';

import './style.scss';

// 资金调拨
export default class ApplyAllocation extends Component {
    state = {
        menuSwitch: [{ // 头部菜单数据
			name: '待审核',
			active: true,
			state: 0,
		},{ 
			name: '支付失败',
			active: false,
			state: 5,
        }],
        state: 0, // 查询状态;
        columnType: 1, // 表格类型(1、未审核，2、支付失败)
		pageNumber: 1, // 查询页码
        pageSize: 10, // 查询每页的条数
		tableTotal: '', //总页码
        tableData: [], //表格数据
        startTime: '', //查询起始日期
        endTime: '', //查询结束日期
        receiveAccount: '', // 查询收款方账号
      batchFreezeVisible: false, //批量冻结弹框
      batchFreezeData: [], //批量冻结处理的数据
      batchEditVisible: false, //批量编辑弹框
      batchEditData: [], //批量编辑处理的数据
      selRows: [], //表格选择的行
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
      selRows: [],
		}, () => {
			this.sreachOrders()
		})
    }

    // 打开新增弹窗
    openAddModal = () => {
        this.refs.addEdit.openModal(1); //1、新增弹窗
        // this.refs.addEdit.getFundTransferACAccountName();
        this.refs.addEdit.getFundTransferMyAccountName();
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
        return (
            <section className="apply-payment-box">
                <p  style={{marginBottom:'15px',fontSize:'16px'}} className="title"><span className="light-black">当前位置:</span> 调拨申请</p>

                <div className="menu-switch">
					<ul className="pull-left list-inline">
						{
							this.state.menuSwitch.map((item, index) => {
								return <li onClick={ this.menuSwitchActive.bind(this, item) } key={ index } className={`${item.active ? 'active' : ''}`}>{item.name}</li>
							})
						}
					</ul>

                    <div className="pull-right">
                        {
                            this.state.columnType === 1
                            ?
                            <Tooltip title="新增">
                                <Button className="add-order" type="primary" placement="bottom" icon="plus" onClick={ this.openAddModal } />
                            </Tooltip>
                            :
                            ''
                        }
                        
                    </div>

                    <div className="clear"></div>
				</div>

      <div className="search-box">
        <div className="search-input-export">
          <div className="pull-right">
            {/*<Button key={0} onClick={ this.batchFreeze } title="批量冻结/解冻" type="button" className="ant-btn  ant-btn-primary" style={{marginRight:'10px'}}>批量冻结/解冻</Button>*/}
            {/*暂时隐藏资金调拨批量编辑*/}
            {/*<Button key={1} onClick={ this.batchEdit } title="批量编辑" type="button" className="ant-btn  ant-btn-primary" style={{marginRight:'10px'}}>批量编辑</Button>*/}
          </div>
          <div className="clear"></div>
        </div>
      </div>

                <AddEditList 
                    ref="addEdit"
					sreachOrders={ this.sreachOrders }  
                />
                
                {/* 表格 */}
                <ApplyTable
                  selRowsUpdate={this.selRowsUpdate}
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