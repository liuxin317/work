import React, { Component } from 'react';
import { Table, Icon, Button, Modal, Radio, Input, DatePicker, Select, message } from 'antd';
import PaymentListDetails from '../../../common/ListDetails/index';
import AllocationListDetails from '../../../DailyBusiness/Cash/ApplyAllocation/component/details';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const format = 'YYYY-MM-DD';
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;
const date = new Date();
const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();

const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};

export default class TableBox extends Component {
  state = {
    visible: false, // 处理弹窗的开关
    confirmLoading: false, //确认按钮的Loading开关
    handleType: 1, // 处理类型1（提交）,2（审核）
    handleTypeValue: 4, // 1是提交审核,4、审核通过，2是撤销流程,3终止流程 
    editVisible: false, //编辑弹窗开关;
    editEnterLoading: false, //编辑确认Loading开关
    paymentTypeValue: 1, // 编辑支付方式(1、预支付，2、立即支付)
    dropdownMove: false, //付款方信息下拉图标显示
    // 默认展示联动数据
    cities: cityData[provinceData[0]],
    secondCity: cityData[provinceData[0]][0],
    openDetailVisible: false, // 付款申请列表详情弹窗开关
    openAllocationDetailVisible: false, // 调拨申请谈储藏开关
    rowData: '', // 选择该列的数据
    refusal: '', //拒绝理由
    orderRowInfo: '', //付款列表详情数据;
    allocationOrderRowInfo: '', // 调拨列表详情数据;
    editPrePayTime: '', // 编辑修改的预支付日期;
    immediate: false, // 编辑支付字段(false、预支付，true、立即支付)
    accountInfo: [], // 银行账户信息
    linkageAccountName: [], //联动银行名称
    linkageAccountBranch: [], //联动银行支行名称
    linkageCardNumber: [], //联动卡号
    activeAccountName: '', // 当前选择的银行名称下拉
    activeAccountBranch: '', // 当前选择的银行支行名称下拉
    activeCardNumber: '', // 当前选择的联动卡号下拉
    paymentAccountName: '', //联动账户名
    payMode: '', // 支付方式英文
    payModeName: '', // 支付方式中文
    payChannel: [], // 支付渠道
    settChannel: '', //支付渠道英文名称
    settChannelName: '', //支付渠道中文名称
    isInitPayChannel: true, //是否是初始化支付渠道
  }

  // 打开处理弹窗
  showHandleModal = (rowData) => {
    this.setState({
      rowData,
      confirmLoading: false,
      visible: true,
      handleTypeValue: 3
    })
  }

  // 确认处理弹窗
  handleOk = (e) => {
    this.finishProcess();
  }

  // 关闭处理弹窗;
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  // 将日期转成时间戳
	get_unix_time = (dateStr) => {
    var newstr = dateStr.replace(/-/g,'/'); 
    var date =  new Date(newstr); 
    var time_str = date.getTime().toString();
    return time_str.substr(0, 10);
	}

  // 关闭处理弹窗;
  editCancel = (e) => {
    this.setState({
      editVisible: false,
    });
  }

  // 选择的编辑支付类型value
  onChangePaymentValue = (e) => {
    this.setState({
      paymentTypeValue: e.target.value,
      immediate: e.target.value == 2 ? true : false,
      editPrePayTime: this.state.editPrePayTime
    });
  }
  
  // 监听预支付日期
  onChangeDate = (value, date) => {
    this.setState({
      editPrePayTime: date
    })
  }

  // 付款方信息下拉
  dropdownFun = () => {
    let bool;

    if (this.state.dropdownMove) {
      bool = false;
    } else {
      bool = true;
    }

    this.setState({
      dropdownMove: bool
    })
  }

  // 联动change事件
  handleProvinceChange = (value) => {
    this.setState({
      cities: cityData[value],
      secondCity: cityData[value][0],
    });
  }

  onSecondCityChange = (value) => {
    this.setState({
      secondCity: value,
    });
  }

  // 关闭列表详情弹窗;
  closeListDetailsModal = () => {
    this.setState({
      openDetailVisible: false,
    });
  }

  // 调拨申请关闭列表详情弹窗
  closeAllocationListDetailsModal = () => {
    this.setState({
      openAllocationDetailVisible: false,
    });
  }
  
  // 打开列表详情列表弹窗;
  openListDetailsModal = (rowData) => {
    if (this.props.menuState == 1) { // 打开付款详情
      this.refs.paymentListDetails.initModalNavBar(); // 初始化默认选项

      this.setState({
        rowData
      }, () => {
        this.getOrderInfo(1);
      });
    } else { // 打开调拨详情
      this.refs.allocationListDetails.initModalNavBar(); // 初始化默认选项

      this.setState({
        rowData
      }, () => {
        this.getDetailInfoById();
      });
    }
  }

  // 调拨申请详情接口
	getDetailInfoById = () => {
		Util.comFetch({
			addr: 'getDetailInfoById',
			fundtransferId: this.state.rowData.orderId
		}, res => {
      this.setState({
        openAllocationDetailVisible: true,
        allocationOrderRowInfo: res.fundTransferModel
      });
		})
	} 

  // 监听拒绝理由input
  handleRefusal = (e) => {
    let refusal = e.target.value;
    this.setState({
      refusal
    })
  }
  
  // 处理提交
  finishProcess = () => {
    let obj = {};

    if (this.props.menuState == 1) { // 付款申请
      obj.orderId = this.state.rowData.orderId;
    } else { // 调拨申请
      obj.transferId = this.state.rowData.orderId;
    };

    Util.comFetch({
      addr: this.props.menuState == 1 ? 'finishProcess' : 'finishProcessForTransfer',
      companyId: userInfo.companyRowId,
      flag: this.state.handleTypeValue,
      ...obj
    }, res => {
      this.props.sreachOrders();
      message.success('提交成功');
      this.setState({
        visible: false
      });
    })
  }

  // 获取详情;（type=1详情弹窗，type=2编辑弹窗）
  getOrderInfo = (type) => {
    Util.comFetch({
      addr: 'getOrderInfo',
      companyId: userInfo.companyRowId,
      orderId: this.state.rowData.orderId
    }, res => {
      let openDetailVisible = false, editVisible = false;
      if (type === 1) {
        openDetailVisible = true;
      } else {
        editVisible = true;
      }

      res.data.orderId = this.state.rowData.orderId;

      this.setState({
        orderRowInfo: res.data,
        openDetailVisible,
        editVisible
      }, () => {
        if (editVisible) {
          this.openEditModal(res.data)
        }
      })
    })
  }
  
  // 打开编辑弹窗
  openEditModal = (rowData) => {
    if (rowData.freeze) {
      message.success('冻结状态不能编辑');
    } else {
      this.setState({
        activeAccountName: '',
        activeAccountBranch: '',
        activeCardNumber: '',
      }, () => {
        this.setState({
          editVisible: true,
          editEnterLoading: false,
          paymentTypeValue: rowData.immediate ? 2 : 1,
          immediate: rowData.immediate,
          editPrePayTime: rowData.prePayTime ? moment(rowData.prePayTime).format(dateFormat) : '',
          activeAccountName: rowData.myAccount.bankCategoryName,
          activeAccountBranch: rowData.myAccount.accountBankName,
          activeCardNumber: rowData.myAccount.accountNumber,
          paymentAccountName: rowData.myAccount.accountName,
          payModeName: rowData.payModeName ? rowData.payModeName : '',
          payMode: rowData.payMode ? rowData.payMode : '',
          settChannel: rowData.payChannel ? rowData.payChannel : '',
          settChannelName: rowData.payChannelName ? rowData.payChannelName : '',
					isInitPayChannel: true
        }, () => {
          this.getPayerAccount();
        })
      })
    }
  }

  // 联动银行名称change事件
  handleAccountName = (value) => {
    this.setState({
      activeAccountName: value,
      activeAccountBranch: '',
      activeCardNumber: '',
      paymentAccountName: '',
			isInitPayChannel: false
    }, () => {
      this.filterAccountBranch(value)
    });
  }

  // 获取选择的银行支行change
  handleAccountBranch = (value) => {
    this.setState({
      activeAccountBranch: value,
      activeCardNumber: '',
      paymentAccountName: '',
			isInitPayChannel: false
    }, () => {
      this.filterCardNumber(value)
    })
  }

  // 获取联动卡号change
  handleCardNumber = (value) => {
    this.setState({
      activeCardNumber: value,
      paymentAccountName: ''
    }, () => {
      this.filterPaymentAccountName(value)
    })
  }

  // 支付方式监听
  handlePayModeChange = (value) => {
    let payModeName = value, payMode;
    
    if (payModeName == '现汇') {
      payMode = 'payMode_cash';
    } else if (payModeName == '票据') {
      payMode = 'payMode_bill';
    } else if (payModeName == '信用证') {
      payMode = 'payMode_LC';
    };

    this.setState({
      payModeName,
			payMode
    })
  }

  // 获取付款方账户信息;
  getPayerAccount = () => {
    Util.comFetch({
      addr: 'getPayerAccount'
    }, res => {
      let linkageAccountName = [];
      let setLinkageAccountName = new Set();
      
      // 处理去重银行名称;
      res.data.forEach(item => {
        linkageAccountName.push(item.split(',')[0])
      });

      linkageAccountName.forEach(item => {
        setLinkageAccountName.add(item)
      });

      linkageAccountName = [];

      for (let i of setLinkageAccountName) {
        linkageAccountName.push(i)
      }

      this.setState({
        accountInfo: res.data,
        linkageAccountName,
        activeAccountName: this.state.activeAccountName === '' ? linkageAccountName[0] : this.state.activeAccountName
      }, () => {
        this.filterAccountBranch(this.state.activeAccountName)
      })
    })
  }
  
  // 筛选银行支行
  filterAccountBranch = (name) => {
    let linkageAccountBranch = [];
    let setLinkageAccountBranch = new Set();

    this.state.accountInfo.forEach(item => {
      item = item.split(',');

      if (item[0] === name) {
        linkageAccountBranch.push(item[1])
      }
    })

    linkageAccountBranch.forEach(item => {
      setLinkageAccountBranch.add(item)
    });

    linkageAccountBranch = [];

    for (let i of setLinkageAccountBranch) {
      linkageAccountBranch.push(i)
    }

    this.setState({
      linkageAccountBranch,
      activeAccountBranch: this.state.activeAccountBranch === '' ? linkageAccountBranch[0] : this.state.activeAccountBranch
    }, () => {
      this.filterCardNumber(this.state.activeAccountBranch)
    })
  }

  // 筛选联动卡号
  filterCardNumber = (name) => {
    let linkageCardNumber = [];

    this.state.accountInfo.forEach(item => {
      item = item.split(',');

      if (this.state.activeAccountName === item[0] && item[1] === name) {
        linkageCardNumber.push(item[2])
      }
    })

    this.setState({
      linkageCardNumber,
      activeCardNumber: this.state.activeCardNumber === '' ? linkageCardNumber[0] : this.state.activeCardNumber
    }, () => {
      this.filterPaymentAccountName(this.state.activeCardNumber);
      this.getMyAccountByAccountNumber();
    })
  }

  // 筛选联动账户名
  filterPaymentAccountName = (name) => {
    let paymentAccountName = '';

    this.state.accountInfo.forEach(item => {
      item = item.split(',');

      if (this.state.activeAccountName === item[0] && this.state.activeAccountBranch === item[1] && name === item[2]) {
        paymentAccountName = item[3]
      }
    })

    this.setState({
      paymentAccountName
    })
  }

  // 支付渠道
  getMyAccountByAccountNumber = () => {
    Util.comFetch({
      addr: 'getMyAccountByAccountNumber',
      accountNumber: this.state.activeCardNumber
    }, res => {
			const { isInitPayChannel } = this.state;
			let settChannelName, settChannel;
			
			if (isInitPayChannel) {
				if (this.state.settChannelName) {
					settChannelName = this.state.settChannelName;
					settChannel = this.state.settChannel;
				} else {
					settChannelName = '';
					settChannel = '';
				}
			} else {
				if (res.data.length) {
					settChannelName = res.data.length ? res.data[0].value : '';
					settChannel = res.data.length ? res.data[0].key : '';
				} else {
					settChannelName = '';
					settChannel = '';
				}
			}

			this.setState({
				payChannel: res.data,
				settChannelName,
				settChannel
			})
    })
  }

  // 保存编辑
  updateOrder = () => {
    let { activeCardNumber, orderRowInfo, editPrePayTime, settChannelName, settChannel, payModeName, payMode, rowData, immediate } = this.state;
    Util.comFetch({
      addr: 'updateOrder',
      orderId: rowData.orderId,
      orderCode: orderRowInfo.code,
      accountNumber: activeCardNumber,
      prePayTime: immediate ? '' : editPrePayTime + ' 00:00:00',
      settChannel,
      settChannelName,
      payModeName,
      immediate,
      payMode
    }, res => {
			message.success('保存成功')
      if (this.state.submissionAuditVisible) { // 如果提交审核的弹窗已打开那么就要存储修改预支付日期
        this.setState({
          isPrePayTime: immediate ? '' : editPrePayTime + ' 00:00:00'
        })
      }
      this.props.sreachOrders();

      this.setState({
        editVisible: false
      })
    })
  }

  //页码change
  pageHandleChange = (number) => {
    this.props.onPageChange(number)
  }

  // 监听支付渠道选择
  handleSettChannelName = (e) => {
    let settChannel;
    this.state.payChannel.forEach(item => {
      if (e.target.value == item.value) {
        settChannel = item.key
      }
    });

    this.setState({
      settChannelName: e.target.value,
      settChannel
    })
  }

  // Can not select days before today and today
	disabledDate = (current) => {
		return current && current.valueOf() < Date.now() - (24*60*60*1000);
	}

  render () {
    const { columnType, data, tableTotal, pageSize, current, tableData, menuState, menuSwitchState } = this.props;
    // 表头;
    const columns = [{
      title: '收款方账户名称',
      key: 'account',
      dataIndex: 'account',
      width: '25%'
    }, {
      title: '金额',
      dataIndex: 'price',
      width: menuState === 1 ? '25%' : '15%',
      render: (text, record) => {
        return <span className={ record.amountFlag == 1 ? "bg-red" : "" }>{ record.price }</span>
      }
    }, {
      title: '预支付日期',
      width: '20%',
      render: (text, record) => {
        return <span className={ record.prePayTimeFlag == 1 ? "bg-red" : "" }>{ record.preDate ? moment(record.preDate).format(format) : '' }</span>
      }
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
          <div>
            {
              menuSwitchState != 2
              ?
              <a href="javascript: " style={{ marginRight: 15 }} onClick={ this.showHandleModal.bind(this, record) } className="details">终止流程</a>
              :
              ''
            }
            
            <a href="javascript: " onClick={ this.openListDetailsModal.bind(this, record) } className="details">详情</a>
          </div>
      ),
      width: '15%'
    }];

    // 联动遍历options
    const provinceOptions = provinceData.map(province => <Option key={province}>{province}</Option>);
    const cityOptions = this.state.cities.map(city => <Option key={city}>{city}</Option>);

    if (menuState === 2) {
      columns.splice(0, 1, {
        title: '付款方账号',
        dataIndex: 'payAccount',
        width: '20%',
        render: (text, record) => {
          return <span className={ record.accountNumberFlag == 1 ? "bg-red" : "" }>{ record.payAccount }</span>
        }
      }, {
        title: '收款方账号',
        dataIndex: 'account',
        width: '20%'
      })
    } else {
      columns.splice(3, 0, {
        title: '提交时间',
        width: '10%',
        render: (text, record) => {
          return <span>{ record.startDate ? moment(record.startDate).format(format) : '' }</span>
        }
      })
    }

    return (
      <section className="table-box">
        <Table pagination={{showQuickJumper: true, total: tableTotal, pageSize, current, onChange: this.pageHandleChange, showTotal: total => `共 ${total} 条`}} rowKey={(record, index) => index} columns={columns} dataSource={tableData.rows} />

        {/* 处理弹窗 */}
        <Modal
          title="终止流程"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={ false }
          confirmLoading={ this.state.confirmLoading }
          className="modal-box modal-wid"
          style={{ width: 460 }}
        >
          <p className="frozen-waring">你确定要终止该订单吗？</p>
        </Modal>

        {/* 付款申请列表详情 */}
        <PaymentListDetails 
          ref="paymentListDetails"
          detailVisible={ this.state.openDetailVisible } 
          closeListDetailsModal={ this.closeListDetailsModal } 
          detailData={ this.state.orderRowInfo }
          source={ true }
        />

        {/* 调拨申请列表详情 */}
        <AllocationListDetails 
          ref="allocationListDetails"
          detailVisible={ this.state.openAllocationDetailVisible } 
          closeListDetailsModal={ this.closeAllocationListDetailsModal } 
          detailData={ this.state.allocationOrderRowInfo }
          source={ true }
        />
      </section>
    )
  }
}
