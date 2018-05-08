import React, { Component } from 'react';
import { Table, Icon, Button, Modal, Radio, Input, DatePicker, Select, message } from 'antd';
import PaymentListDetails from '../../../common/ListDetails/index';
import AllocationListDetails from '../../../DailyBusiness/Cash/ApplyAllocation/component/details';
import Freeze from '../../../../imgs/freeze.png';
import EditOrder from './EditOrder';
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
    openAllocatDetailVisible: false, // 调拨申请列表详情弹窗开关
    rowData: '', // 选择该列的数据
    refusal: '', //拒绝理由
    orderRowInfo: '', //列表详情;
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
    allocationOrderRowInfo: '', //调拨详情的数据
    handleFreeze: false, // 判断是否隐藏审核通过
  }

  // 打开处理弹窗
  showHandleModal = (rowData) => {
    Util.comFetch({
      addr: 'processFlag',
      companyId: userInfo.companyRowId,
      processInstId: rowData.processInstId,
      orderId: rowData.orderId
    }, res => {
      let handleType = res.flag ? 1 : 2;

      this.setState({
        rowData,
        confirmLoading: false,
        handleType,
        handleFreeze: res.freeze
      })
  
      if (handleType === 1) {
        this.setState({
          visible: true,
          handleTypeValue: 3
        })
      } else {
        this.setState({
          visible: true,
          handleTypeValue: 4,
          refusal: ''
        })
      };

      //如果freeze为true那么拒绝输入框就会显示
      if (res.freeze) {
        this.setState({
          handleTypeValue: 2
        })
      }
    })
  }

  // 确认处理弹窗
  handleOk = (e) => {
    if (this.props.menuState == 1) { // 付款申请
      this.finishProcess();
    } else { // 调拨申请
      this.finishProcessForTransfer();
    }
  }

  // 关闭处理弹窗;
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  // 选择的处理类型value
  onChangeHanldeValue = (e) => {
    this.setState({
      handleTypeValue: e.target.value,
    });
  }

  // 确认处理弹窗
  editOk = (e) => {
    if (!this.state.immediate) {
      if (this.state.editPrePayTime === '') {
        message.warning('预支付日期不能为空')
        return false;
      }

      if (Number(this.get_unix_time(this.state.editPrePayTime)) < Number(this.get_unix_time(`${year}-${month}-${day}`))) {
        message.warning('预支付日期不能小于当前日期');
        return false;
      }
    }

    this.updateOrder();
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

  // 关闭付款申请列表详情弹窗;
  closeListDetailsModal = () => {
    this.setState({
      openDetailVisible: false,
    });
  }

  // 关闭调拨申请列表详情弹窗
  closeAllocatListDetailsModal = () => {
    this.setState({
      openAllocatDetailVisible: false,
    });
  }
  
  // 打开列表详情列表弹窗;
  openListDetailsModal = (rowData) => {
    if (this.props.menuState == 1) { // 付款申请的详情 
      this.refs.paymentListDetails.initModalNavBar(); // 初始化默认选项

      this.setState({
        rowData
      }, () => {
        this.getOrderInfo(1);
      });
    } else { // 调拨申请的详情
      this.refs.allocationListDetails.initModalNavBar(); // 初始化默认选项
      this.setState({
        rowData
      }, () => {
        this.getDetailInfoById(true) // true代表打开的是详情的弹窗
      });
    }
  }

  // 监听拒绝理由input
  handleRefusal = (e) => {
    let refusal = e.target.value;
    this.setState({
      refusal
    })
  }
  
  // 处理付款申请提交
  finishProcess = () => {
    Util.comFetch({
      addr: 'finishProcess',
      companyId: userInfo.companyRowId,
      orderId: this.state.rowData.orderId,
      remark: this.state.refusal,
      flag: this.state.handleTypeValue == 4 ? 1 : this.state.handleTypeValue
    }, res => {
      this.props.sreachOrders();
      message.success('提交成功');
      this.setState({
        visible: false
      });
    })
  }

  // 处理调拨申请提交
  finishProcessForTransfer = () => {
    Util.comFetch({
      addr: 'finishProcessForTransfer',
      companyId: userInfo.companyRowId,
      transferId: this.state.rowData.orderId,
      remark: this.state.refusal,
      flag: this.state.handleTypeValue == 4 ? 1 : this.state.handleTypeValue
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
      acAccountNumber: orderRowInfo.acAccount ? orderRowInfo.acAccount.accountNumber : '',
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

  // 无法选择今天和今天之前的日子
	disabledDate = (current) => {
		return current && current.valueOf() < Date.now() - (24*60*60*1000);
  }
  
  // 打开审核中得编辑弹窗
  openAuditModal = () => {
    if (this.props.menuState == 1) { // 付款申请的编辑弹窗
      this.getOrderInfo(2);
    } else { // 调拨申请的编辑弹窗
      this.getDetailInfoById()
    }
  }

  // 调拨申请详情接口
	getDetailInfoById = (bol) => {
		Util.comFetch({
			addr: 'getDetailInfoById',
			fundtransferId: this.state.rowData.orderId
		}, res => {
      if (bol) { // 打开调拨详情弹窗
        this.setState({
          openAllocatDetailVisible: true,
          allocationOrderRowInfo: res.fundTransferModel
        });
      } else { // 打开调拨编辑弹窗
        this.refs.editOrder.openModal(res.fundTransferModel);
        this.refs.editOrder.getFundTransferMyAccountName();
      }
		})
	} 

  render () {
    const { columnType, data, tableTotal, pageSize, current, tableData, menuState } = this.props;
    // 表头;
    const columns = [{
      title: '流程节点名称',
      key: 'activityName',
      dataIndex: 'activityName',
      width: '15%',
    },{
      title: '收款方账户名称',
      key: 'account',
      dataIndex: 'account',
      width: '20%',
      render: (text, record) => {
        return (
          <div style={{ position: 'relative' }}>
            {
              record.freeze
              ?
              <img style={{ position: 'absolute', top: '50%', left: '0', transform: 'translate(0, -50%)'  }} src={ Freeze } alt=""/>
              :
              ''
            }
            <span className={ record.accountNumberFlag == 1 ? "bg-red" : "" }>{ record.account }</span>
          </div>
        )
      }
    }, {
      title: '金额',
      dataIndex: 'price',
      width: menuState === 1 ? '15%' : '10%',
      render: (text, record) => {
        return <span className={ record.amountFlag == 1 ? "bg-red" : "" }>{ record.price }</span>
      }
    }, {
      title: '预支付日期',
      width: menuState === 1 ? '20%' : '15%',
      render: (text, record) => {
        return <span className={ record.prePayTimeFlag == 1 ? "bg-red" : "" }>{ record.date ? moment(record.date).format(format) : '' }</span>
      }
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Button className="handle-button" type="primary" onClick={ this.showHandleModal.bind(this, record) }>处理</Button>
      ),
      width: '15%'
    }, {
      title: '详情',
      render: (text, record) => {
        return <a href="javascript: " onClick={ this.openListDetailsModal.bind(this, record) } className="details">详情</a>
      },
      width: '10%'
    }];

    // 联动遍历options
    const provinceOptions = provinceData.map(province => <Option key={province}>{province}</Option>);
    const cityOptions = this.state.cities.map(city => <Option key={city}>{city}</Option>);

    if (menuState === 2) {
      columns.splice(0, 2, {
        title: '流程节点名称',
        key: 'activityName',
        dataIndex: 'activityName',
        width: '15%',
      },
      {
        title: '付款方账号',
        dataIndex: 'payAccount',
        width: '18%',
        render: (text, record) => {
          return <span className={ record.accountNumberFlag == 1 ? "bg-red" : "" }>{ record.payAccount }</span>
        }
      }, {
        title: '收款方账号',
        dataIndex: 'account',
        width: '17%'
      })
    }

    return (
      <section className="table-box">
        <Table pagination={{showQuickJumper: true, total: tableTotal, pageSize, current, onChange: this.pageHandleChange, showTotal: total => `共 ${total} 条`}} rowKey={(record, index) => index} columns={columns} dataSource={tableData.rows} />

        {/* 处理弹窗 */}
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          closable={ false }
          maskClosable={ false }
          confirmLoading={ this.state.confirmLoading }
          className="modal-box"
        >
          <article className="modal-content">
            <div className="handle-type">
              <RadioGroup onChange={this.onChangeHanldeValue} value={this.state.handleTypeValue}>
                {
                  this.state.handleType === 1 ?
                  <div>
                    <Radio value={3}>终止流程</Radio>
                    <Radio value={1}>提交审核</Radio>
                  </div>
                  :
                  <div>
                    {
                      this.state.handleFreeze
                      ?
                      ''
                      :
                      <Radio value={4}>审核通过</Radio>
                    }
                    <Radio value={2}>审核不通过</Radio>
                  </div>
                }
              </RadioGroup>
            </div>

            <div className="handle-type__content">
              {
                this.state.handleTypeValue === 2
                ?
                <TextArea onChange={ this.handleRefusal } className="refuse-input" placeholder="请输入拒绝理由" autosize={{ minRows: 3, maxRows: 6 }} />
                : 
                this.state.handleTypeValue === 1
                  ? <a className="edit" onClick={ this.openAuditModal } href="javascript: ">编辑</a>
                  : ''
              }
            </div>
          </article>
        </Modal>
        
        {/* 提交审核编辑弹窗 */}
        <Modal
          title="编辑"
          visible={this.state.editVisible}
          zIndex="1010"
          onOk={this.editOk}
          onCancel={this.editCancel}
          maskClosable={ false }
          confirmLoading={ this.state.editEnterLoading }
          className="modal-box edit-modal-box"
        >
            <article className="edit-content">
              <RadioGroup 
                onChange={this.onChangePaymentValue} 
                value={this.state.paymentTypeValue}
              >
                <Radio value={1}>预支付</Radio>
                <Radio value={2}>立即支付</Radio>
              </RadioGroup>
              {
                this.state.paymentTypeValue == 2
                ?
                ''
                :
                <div className="edit-row payment-date">
                  <span className="pull-left">预支付日期：</span>
                  {
                    this.state.editPrePayTime 
                    ?
                    <DatePicker value={moment(this.state.editPrePayTime, dateFormat)} className="pull-left" allowClear={ false } onChange={this.onChangeDate} disabledDate={this.disabledDate} />
                    :
                    <DatePicker className="pull-left" allowClear={ false } onChange={this.onChangeDate} disabledDate={this.disabledDate} />
                  }
                  <div className="clear"></div>
                </div>
              }
              <div className="edit-row payment-info" onClick={this.dropdownFun}>
                <a className="pull-left" href="javascript: ">付款方信息 </a>
                <Icon className={ `pull-left ${ this.state.dropdownMove ? "transform-rotate" : "" }` } type="caret-up" />
                <div className="clear"></div>
              </div>

              <div className={ `payment-drop ${ this.state.dropdownMove ? "payment-drop-active" : "" }` }>
                <div className="payment-drop__row">
                  <span className="pull-left name">付款方账户：</span>
                  <div className="pull-left">
                    <Select size="large" value={this.state.activeAccountName} style={{ width: 120 }} onChange={this.handleAccountName}>
                      {
                        this.state.linkageAccountName.length ?
                        this.state.linkageAccountName.map((item, index) => {
                          return <Option key={item}>{item}</Option>
                        })
                        :
                        ''
                      }
                    </Select>
                    <Select size="large" value={this.state.activeAccountBranch} style={{ width: 230, marginLeft: 10 }} onChange={this.handleAccountBranch}>
                      {
                        this.state.linkageAccountBranch.length ?
                        this.state.linkageAccountBranch.map((item, index) => {
                          return <Option key={item}>{item}</Option>
                        })
                        :
                        ''
                      }
                    </Select>
                  </div>
                  <div className="clear"></div>
                </div>

                <div className="payment-drop__row">
                  <span className="pull-left name"></span>
                  <div className="pull-left">
                    <Select size="large" value={this.state.activeCardNumber} style={{ width: 360 }} onChange={this.handleCardNumber}>
                      {
                        this.state.linkageCardNumber.length ?
                        this.state.linkageCardNumber.map((item, index) => {
                          return <Option key={item}>{item}</Option>
                        })
                        :
                        ''
                      }
                    </Select>
                  </div>
                  <div className="clear"></div>
                </div>

                <div className="payment-drop__row">
                  <span className="pull-left name">付款方账户名：</span>
                  <div className="pull-left">
                    <em className="user-name">{this.state.paymentAccountName}</em>
                  </div>
                  <div className="clear"></div>
                </div>

                <div className="payment-drop__row">
                  <span className="pull-left name">支付方式：</span>
                  <div className="pull-left">
                    <Select size="large" value={this.state.payModeName} style={{ width: 95 }} onChange={this.handlePayModeChange}>
                      <Option key="现汇">现汇</Option>
                      <Option key="票据">票据</Option>
                      <Option key="信用证">信用证</Option>
                    </Select>
                  </div>
                  <div className="clear"></div>
                </div>

                <div className="payment-drop__row">
                  <span className="pull-left name">支付渠道：</span>
                  <div className="pull-left">
                    {
                      this.state.payChannel.length ?
                      <RadioGroup 
                        onChange={this.handleSettChannelName} 
                        value={ this.state.settChannelName }
                      >
                        {
                          this.state.payChannel.map((item, index) => {
                            return (
                              <Radio key={ index } style={{ display: 'block', lineHeight: '32px' }}  value={item.value}>{ item.value }</Radio>
                            )
                          })
                        }
                      </RadioGroup>
                      :
                      ''
                    }
                    
                  </div>
                  <div className="clear"></div>
                </div>
              </div>
            </article>
        </Modal>

        {/* 付款列表详情 */}
        <PaymentListDetails 
          ref="paymentListDetails"
          detailVisible={ this.state.openDetailVisible } 
          closeListDetailsModal={ this.closeListDetailsModal } 
          detailData={ this.state.orderRowInfo }
          rowData={ this.state.rowData }
          source={ true }
        />

        {/* 调拨列表详情 */}
        <AllocationListDetails 
          ref="allocationListDetails"
          detailVisible={ this.state.openAllocatDetailVisible } 
          closeListDetailsModal={ this.closeAllocatListDetailsModal } 
          detailData={ this.state.allocationOrderRowInfo }
          rowData={ this.state.rowData }
        />
        
        {/* 调拨申请编辑 */}
        <EditOrder 
          ref="editOrder" 
          sreachOrders={ this.props.sreachOrders }
        />
      </section>
    )
  }
}
