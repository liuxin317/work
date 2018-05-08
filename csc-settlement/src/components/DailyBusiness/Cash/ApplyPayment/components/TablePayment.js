import React, { Component } from 'react';
import { Table, Icon, Button, Modal, Radio, Input, DatePicker, Select, message } from 'antd';
// import ListDetails from './details';
import ListDetails from '../../../../common/ListDetails';
import EditObjDialog from './EditObjDialog';
import EditRuleDialog from './EditRuleDialog';
import moment from 'moment';
import Freeze from '../../../../../imgs/freeze.png';
import Abnormal from '../../../../../imgs/abnormal.png';
import Return from '../../../../../imgs/return.png';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
// const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;

const dateFormat = 'YYYY-MM-DD';
const date = new Date();
const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();

const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};

const submissionAuditTableHeader = [{
	title: '会计凭证号',
	dataIndex: 'busCode',
	width: '40%'
},
{
	title: '未清号',
	dataIndex: 'code',
	width: '40%'
},
{
	title: '金额',
	render: (text, record) => {
		return <span>{record.amount > 0 ? `-${record.amount}` : record.amount}</span>
	},
	width: '20%'
}];

export default class TableList extends Component {
	state = {
		frozenVisible: false, // 冻结弹窗;
		frozenEnterLoading: false, // 冻结Loading
		editVisible: false, // 编辑弹窗
		editEnterLoading: false, //编辑Loading
		dropdownMove: true, //付款方信息下拉图标显示
		dropdownMovePayee: true, //收款方信息下拉图标显示
		// 默认展示联动数据
	    cities: cityData[provinceData[0]],
	    secondCity: cityData[provinceData[0]][0],

	    submissionAuditVisible: false, // 提交审核弹窗开关
	    submissionAuditLoading: false, // 提交审核Loading
	    submissionModalType: 1, // 提交审核类别(1、无负数， 2、有负数)
	    fallbackVisible: false, // 退回弹窗开关
	    fallbackLoading: false, // 退回Loading
	    fallbackValue: 0, // 退回类别（0、退回扫单人，1、退回客户）
    	openDetailVisible: false, // 列表详情弹窗开关
    	rowData: {}, // 当前列的数据;
    	paymentTypeValue: 1, // 编辑支付方式(1、预支付，2、立即支付)
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
    	editPrePayTime: '', // 编辑修改的预支付日期;
    	remark: '', // 退回原因
    	isPrePayTime: '', //在提交审核的另一种状态中是否修改了预支付日期;
			submissionAuditData: [], // 未支付/预支付款项;
			isInitPayChannel: true, //是否是初始化支付渠道

    // 是否显示编辑往来对象弹框
    showEditObj: false,
		// 是否显示编辑付款方（规则）弹框
    showEditRule: false,

		// 显示异常文本的订单code
    showAbnormalCode: '',
		// 显示退回原因的订单code
    showReturnCode: '',

    // 收款方账户全部数据
    accData: {},
    // 收款方账户-银行
    bank: '',
    banks: [],
    // 收款方账户-银行支行
    subBank: '',
    subBanks: [],
    // 收款方账户-银行卡号
    bankAcc: '',
    bankAccs: [],
    // 收款方账户名称
    bankAccName: '',
	}

	componentWillMount() {
		this.getColumns();
	}

	componentDidMount() {
		window.addEventListener('click', this.resetShowAbnormal);
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.resetShowAbnormal);
	}

	// 点击其他区域，重置对象
	resetShowAbnormal = () => {
    this.setState({
			showAbnormalCode: '',
      showReturnCode: '',
    });
	}

	// 打开冻结弹窗;
	openFrozenModal = (rowData) => {
		this.setState({
			frozenVisible: true,
			frozenEnterLoading: false,
			rowData
		})
	}
	
	// 确认冻结弹窗;
	frozenOk = () => {
		this.setState({
			frozenVisible: true,
		})

		this.freezeFun();
	}

	// 取消冻结弹窗
	frozenCancel = () => {
		this.setState({
			frozenVisible: false
		})
	}
	
	// 打开编辑弹窗
	openEditModal = (rowData) => {
		if (rowData.freeze) {
			message.success('冻结状态不能编辑');
		} else if (rowData.state === 'ABNORMAL') {
			// 异常订单，根据异常类型，有两种编辑方式
      let exceptionCode = parseInt(rowData.exceptionCode);
      if (exceptionCode >= 200) {
        this.setState({
          showEditRule: true,
          rowData: rowData
        });
      } else {
        this.setState({
          showEditObj: true,
          rowData: rowData
        });
      }
		} else {
			this.setState({
				activeAccountName: '',
				activeAccountBranch: '',
				activeCardNumber: '',
			}, () => {
				this.setState({
				  editVisible: true,
				  editEnterLoading: false,
				  rowData,
				  paymentTypeValue: rowData.immediate ? 2 : 1,
				  immediate: rowData.immediate,
				  editPrePayTime: rowData.prePayTime ? rowData.prePayTime.split(' ')[0] : '',
				  activeAccountName: rowData.myAccount.bankCategoryName,
				  activeAccountBranch: rowData.myAccount.accountBankName,
				  activeCardNumber: rowData.myAccount.accountNumber,
				  paymentAccountName: rowData.myAccount.accountName,
					payModeName: rowData.payModeName ? rowData.payModeName : '',
					payMode: rowData.payMode ? rowData.payMode : '',
					settChannelName: rowData.payChannelName ? rowData.payChannelName : '',
					isInitPayChannel: true,
					settChannel: rowData.payChannel ? rowData.payChannel : ''
				}, () => {
					this.getPayerAccount();
					this.getPayeeAccount();
				})
			})
		}
	}

	// 获取收款方信息
  getPayeeAccount() {
    Util.comFetch({
      companyId: userInfo.companyId,
      tenantId: userInfo.tenantId,
      // customerName: this.state.rowData.customerName,
      code: this.state.rowData.code,
      // addr: Api.getPayeeAccount
      addr: Api.getPayeeAccountByCustomerName
    }, (re) => {
      // 后台返回的银行-支行-卡号数据是逗号分隔的字符串，用trans3LvlBankData转换为带层级的对象
      let accData = Util.trans3LvlBankData(re.data);
      // 表格中订单的收款方信息
      let specAcc = this.state.rowData.currentCustomerBank;
      // 是否使用订单中的账号标志
      let useOrderAcc = false;

      // 单条订单支付时，优先使用表格中的订单的付款方账号。
      // 遍历返回的账号列表，如果有和表格中账号相同的，就使用表格中的账号，否则使用第一个默认账号。
      if (specAcc && !this.props.multiFlag) {
        let accStr = [
          specAcc.bankCategoryName,
          specAcc.accountBankName,
          specAcc.accountNumber,
          specAcc.accountName
        ].join(',');
        re.data.some((item) => {
          if (item.indexOf(accStr) === 0) {
            useOrderAcc = true;
            return true;
          }
        });
      }

      // 设置付款方账户银行，支行，卡号三级选框数据
      if (useOrderAcc) {
        let bank = specAcc.bankCategoryName;
        let subBank = specAcc.accountBankName;
        let bankAcc = specAcc.accountNumber;
        let bankAccName = specAcc.accountName;
        let banks = accData;
        let subBanks = [];
        let bankAccs = [];
        banks.some((item) => {
          if (item.name === bank) {
            subBanks = item.children;
            return true;
          }
        });
        subBanks.some((item) => {
          if (item.name === subBank) {
            bankAccs = item.children;
            return true;
          }
        });
        this.setState({ banks, bank, subBanks, subBank, bankAccs, bankAcc, bankAccName});
      } else {
        this.calcAccSelect(accData);
      }
      this.setState({accData});
    });
  }

  // 收款款方账户，银行-支行-卡号，根据选择的前一级，确定后级的数据
  calcAccSelect(data, bankSpec, subBankSpec) {
    const state = this.state;
    let bank = bankSpec || state.bank, subBank = subBankSpec || state.subBank, bankAcc = '', bankAccName = '';
    let banks = state.banks, subBanks = state.subBanks, bankAccs = state.bankAccs;

    if (!bankSpec) {
      banks = data;
      bank = banks[0].name;
      subBanks = banks[0].children;
      subBank = subBanks[0].name;
      bankAccs = subBanks[0].children;
      bankAcc = bankAccs[0].name;
      bankAccName = bankAccs[0].accName;
    } else if (!subBankSpec) {
      data.some((item) => {
        if(item.name === bankSpec) {
          subBanks = item.children;
          return true;
        }
      });
      subBank = subBanks[0].name;
      bankAccs = subBanks[0].children;
      bankAcc = bankAccs[0].name;
      bankAccName = bankAccs[0].accName;
    } else {
      subBanks.forEach((item) => {
        if (item.name === subBankSpec) {
          bankAccs = item.children;
          return true;
        }
      });
      bankAcc = bankAccs[0].name;
      bankAccName = bankAccs[0].accName;
    }
    this.setState({ banks, bank, subBanks, subBank, bankAccs, bankAcc, bankAccName});
  }

  // 收款方选择银行， 需要重新设置支行和卡号
  bankChange = (value) => {
    this.setState({bank: value});
    this.calcAccSelect(this.state.accData, value);
  }

  // 收款方选择支行， 需要重新设置卡号
  subBankChange = (value) => {
    this.setState({subBank: value});
    this.calcAccSelect(this.state.accData, this.state.bank, value);
  }

  // 收款方选择卡号
  bankAccChange = (bankAcc) => {
	  const { bankAccs } = this.state;
	  let accName = '';
	  bankAccs.some((item) => {
	    if (item.name === bankAcc) {
        accName = item.accName;
	      return true;
      }
    })
    this.setState({bankAcc, accName});
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

	// 关闭处理弹窗;
	editCancel = (e) => {
		this.setState({
		  editVisible: false,
		});
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

	// 收款方信息下拉
  dropdownFunPayee = () => {
		this.setState({
      dropdownMovePayee: !this.state.dropdownMovePayee
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
	
	// 打开提交审核弹窗
	openSubmissionAudit = (rowData) => {
		this.setState({
			rowData,
			submissionAuditData: [],
			isPrePayTime: ''
			// submissionAuditVisible: true,
		}, () => {
			this.clearingInfo(rowData);
		})
	}

	// 提交审核
	startProcess = () => {
		let { rowData, isPrePayTime } = this.state;

		Util.comFetch({
			addr: 'startProcess',
			type: 1,
			companyId: userInfo.companyRowId,
			name: rowData.currentCustomerBank.accountName,
			price: rowData.amount,
			orderId: rowData.id,
			date: isPrePayTime === '' ? rowData.prePayTime ? rowData.prePayTime + ' 00:00:00' : '' : isPrePayTime
		}, res => {
			message.success('提交成功');
			this.props.sreachOrders();
			this.setState({
			  submissionAuditVisible: false
			});
		})
	}
	
	// 提交审核确认弹窗
	submissionOk = () => {
		this.startProcess()
	}
	
	// 提交审核取消弹窗
	submissionCancel = () => {
		this.setState({
		  submissionAuditVisible: false
		});
	}
	
	// 打开退回弹窗
	openfallbackModal = (rowData) => {
		this.setState({
			fallbackVisible: true,
			fallbackLoading: false,
			rowData,
			fallbackValue: 0,
			remark: ''
		})
	}
	
	// 确认退回按钮
	fallbackOk = () => {
		this.setCancel()
	}
	
	// 取消退回按钮
	fallbackCancel = () => {
		this.setState({
			fallbackVisible: false
		})
	}

	// 监听退回类别
	onChangeFallbackValue = (e) => {
		this.setState({
			fallbackValue: e.target.value
		})
	}

	// 关闭列表详情弹窗;
	closeListDetailsModal = () => {
		this.setState({
		  openDetailVisible: false,
		});
	}

	// 打开列表详情列表弹窗;
	openListDetailsModal = (rowData) => {
		this.refs.listDetails.initModalNavBar(); // 初始化默认选项
		this.setState({
		  openDetailVisible: true,
		  rowData
		});
	}

	// 监听预支付日期
	onChangeDate = (value, date) => {
		this.setState({
			editPrePayTime: date
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

	// 解冻接口
	freezeFun = () => {
		let addr;

		if (this.state.rowData.freeze) {
			addr = 'unfreeze';
		} else {
			addr = 'freeze';
		}

		Util.comFetch({
			addr,
			code: this.state.rowData.code
		}, res => {
			if (addr === 'unfreeze') {
				message.success('解冻成功');
			} else {
				message.success('冻结成功');
			}

			this.setState({
				frozenVisible: false,
			})

			this.props.sreachOrders();
		})
	}

	// 保存编辑
	updateOrder = () => {
		let { activeCardNumber, editPrePayTime, settChannelName, settChannel, payMode, payModeName, rowData, immediate, bankAcc } = this.state;
		Util.comFetch({
			addr: 'updateOrder',
			orderId: rowData.id,
			orderCode: rowData.code,
      acAccountNumber: bankAcc,
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
				this.props.sreachOrders(this.state.rowData);
			} else {
				this.props.sreachOrders();
			}

			this.setState({
				editVisible: false
			})
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
		}

		this.setState({
			payModeName,
			payMode
		})
	}

	// 监听订单退回原因
	remarkChange = (e) => {
		// let remark = e.target.value;
        let   txtV=e.target.value;
        txtV = txtV.replace(/(^\s+)|(\s+$)/g, "");
        let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
        let specialStr = "";
        for(var i = 0; i < txtV.length;  i++)
        {
            specialStr = specialStr+txtV.substr(i, 1).replace(pattern, '');
        }

		this.setState({
			remark:specialStr
		})
	}

	// 订单回退
	setCancel = () => {
		let { rowData, remark, fallbackValue } = this.state;
		
		if (remark === '') {
			message.warning('请填写原因');
		} else {
			Util.comFetch({
				addr: 'cancel',
				code: rowData.code,
				remark,
				cancelType: fallbackValue
			}, res => {
				message.warning('退回成功');

				this.setState({
					fallbackVisible: false
				})
				this.props.sreachOrders();
			})
		}
	}

	// 提交审核前状态识别
	clearingInfo = (rowData) => {
		Util.comFetch({
			addr: 'clearingInfo',
			customerName: rowData.customerName
		}, res => {
			let submissionModalType;

			if (res.data.length) {
				submissionModalType = 2;
			} else {
				submissionModalType = 1;
			}
			this.setState({
			  submissionAuditData: res.data,
			  submissionAuditVisible: true,
			  submissionModalType,
			  submissionAuditLoading: false
			});
		})
	}

	//页码change
	pageHandleChange = (number) => {
		this.props.onPageChange(number)
	}

	// Can not select days before today and today
	disabledDate = (current) => {
		return current && current.valueOf() < Date.now() - (24*60*60*1000);
	}

	// 在提交审核更改了编辑保存过后更新当前rowData的值
	upRowData = (data) => {
		console.log(data);
		const { rowData } = this.state;

		data.forEach(item => {
			if (item.id == rowData.id) {
				this.setState({
					rowData: item
				})
			}
		})
	}

	// 将日期转成时间戳
	get_unix_time = (dateStr) => {
    var newstr = dateStr.replace(/-/g,'/'); 
    var date =  new Date(newstr); 
    var time_str = date.getTime().toString();
    return time_str.substr(0, 10);
	};

  // 设置异常订单编辑弹框隐藏
  chgEditDialogVisible = (visible, type) => {
    if (type === 'obj') {
      this.setState({ showEditObj: visible });
    } else if (type === 'rule') {
      this.setState({ showEditRule: visible });
    }
  }

  // 异常订单编辑成功
  editConfirmed = () => {
    message.success('处理成功');
    this.setState({ showEditRule: false, showEditObj: false });
    this.props.sreachOrders();
  }

  // 显示异常详情
  showAbnormalText = (e, record) => {
  	e.preventDefault();
  	e.stopPropagation();
  	this.setState({
			showAbnormalCode: record.code,
      showReturnCode: ''
		});
	}

	// 显示退回详情
  showReturnText = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      showReturnCode: record.code,
			showAbnormalCode: ''
    });
	}

	// 获取Table的columns
	getColumns() {
    const unauditedHeader = [{ // 未审核表头;
      title: '订单号',
      dataIndex: 'code',
      width: '14%',
      render: (text, record) => {
        return (
					<div style={{position: 'relative'}}>
						<span>{ record.code }</span>
            {
              record.freeze ?
								<img style={{ position: 'absolute', top: '50%', left: '0', transform: 'translate(0, -50%)'  }} src={ Freeze } />
                :
                null
            }
            {
              !record.freeze && record.state === 'ABNORMAL' ?
								<img key={0} onClick={(e)=>{this.showAbnormalText(e, record)}} style={{ position: 'absolute', top: '50%', left: '0', transform: 'translate(0, -50%)'  }} src={ Abnormal } /> :
                null
            }
            {
              this.state.showAbnormalCode === record.code ?
								<div className="abnormal-text">
									<p>异常理由</p>
									<p style={{marginTop: '10px', color: '#f33'}}>{record.remark}</p>
								</div> :
                null
            }
            {
              !record.freeze && record.backUserName ?
								<img onClick={(e)=>{this.showReturnText(e, record)}} style={{ position: 'absolute', top: '50%', left: '0', transform: 'translate(0, -50%)'  }} src={ Return } /> :
                null
            }
            {
              this.state.showReturnCode === record.code ?
								<div className="abnormal-text">
									<p>退回理由：<span style={{color: '#f33'}}>{record.remark}</span></p>
									<p style={{marginTop: '10px'}}>退回人：<span style={{color: '#f33'}}>{record.backUserName}</span></p>
								</div> :
                null
            }
					</div>
        )
      }
    }, {
      title: '收支对象名称',
      width: '14%',
      render: (text, record) => {
        return <span>{ record.customerName }</span>
      }
    }, {
      title: '收款方账户名称',
      width: '14%',
      render: (text, record) => {
        return <span className={record.acAccountNumberFlag=="0"?"":"bg-red"}>{ record.currentCustomerBank ? record.currentCustomerBank.accountName : null}</span>
      }
    }, {
      title: '金额',
      dataIndex: 'amount',
      width: '14%',
      render: (text, record) => {

        return <span  className={record.amountFlag=="0"?"":"bg-red"}  >{`${record.amount}`}</span>
      }
    }, {
      title: '付款方账号',
      render: (text, record) => {
        return <span  className={record.accountNumberFlag=="0"?"":"bg-red"}>{ record.myAccount.accountNumber }</span>
      },
      width: '14%'
    }, {
      title: '预支付日期',
      dataIndex: 'prePayTime',
      width: '10%',
      render: (text, record) => {
        return <span  className={record.prePayTimeFlag=="0"?"":"bg-red"}>{ record.prePayTime }</span>
      },
    }, {
      title: '操作',
      render: (text, record) => {
        return (
					<div className="operation">
						<a href="javascript: " onClick={ this.openFrozenModal.bind(this, record) } className="details">{ record.freeze ? '解冻' : '冻结' }</a>
            {
              record.freeze
                ?
                ''
                :
								<span>
						<a href="javascript: " onClick={ this.openEditModal.bind(this, record) } className="details">{record.state === 'ABNORMAL' ? '处理' : '编辑'}</a>
                  {record.state === 'ABNORMAL' ? '': <a href="javascript: " onClick={ this.openSubmissionAudit.bind(this, record, 2) } className="details">提交审核</a>}
                  {
                    record.handAccount
                      ?
                      ''
                      :
											<a href="javascript: " onClick={ this.openfallbackModal.bind(this, record) } className="details">退回</a>
                  }
						</span>
            }
						<a href="javascript: " onClick={ this.openListDetailsModal.bind(this, record) }  className="details">详情</a>
					</div>
        )
      },
    }];

    // const audit = [{ // 审核中;
    //   title: '订单号',
    //   dataIndex: 'code',
    //   width: '14%',
    //   render: (text, record) => {
    //     return (
			// 		<div style={{position: 'relative'}}>
			// 			<span>{ record.code }</span>
    //         {
    //           record.freeze ?
			// 					<img style={{ position: 'absolute', top: '50%', left: '0', transform: 'translate(0, -50%)'  }} src={ Freeze } />
    //             :
    //             ''
    //         }
			// 		</div>
    //     )
    //   }
    // }, {
    //   title: '收支对象名称',
    //   width: '14%',
    //   render: (text, record) => {
    //     return <span>{ record.customerName }</span>
    //   }
    // }, {
    //   title: '收款方账户名称',
    //   width: '14%',
    //   render: (text, record) => {
    //     return <span>{ record.acAccount.accountName }</span>
    //   }
    // }, {
    //   title: '金额',
    //   dataIndex: 'amount',
    //   width: '14%',
    //   render: (text, record) => {
    //     return <span  className={record.amountFlag=="0"?"":"bg-red"}>{`${record.amount}`}</span>
    //   }
    // }, {
    //   title: '付款方账号',
    //   render: (text, record) => {
    //     return <span className={record.accountNumberFlag=="0"?"":"bg-red"}>{ record.myAccount.accountNumber }</span>
    //   },
    //   width: '14%'
    // }, {
    //   title: '预支付日期',
    //   dataIndex: 'prePayTime',
    //   width: '10%',
    //   render: (text, record) => {
    //     return <span  className={record.prePayTimeFlag=="0"?"":"bg-red"}>{ record.prePayTime }</span>
    //   }
    // }, {
    //   title: '操作',
    //   render: (text, record) => {
    //     return (
			// 		<div className="operation">
			// 			<a href="javascript: " onClick={ this.openListDetailsModal.bind(this, record) }  className="details">详情</a>
			// 		</div>
    //     )
    //   },
    //   width: '20%'
    // }];

    const paymentFail = [{ // 支付失败;
      title: '订单号',
      dataIndex: 'code',
      width: '14%',
      render: (text, record) => {
        return (
					<div style={{position: 'relative'}}>
						<span>{ record.code }</span>
            {
              record.freeze ?
								<img style={{ position: 'absolute', top: '50%', left: '0', transform: 'translate(0, -50%)'  }} src={ Freeze } />
                :
                ''
            }
					</div>
        )
      }
    },
    // {
    //   title: '收支对象名称',
    //   render: (text, record) => {
    //     return <span>{ record.customerName }</span>
    //   },
    //   width: '10%'
    // },
			{
      title: '收款方账户名称',
      width: '10%',
      render: (text, record) => {
        return <span className={record.acAccountNumberFlag=="0"?"":"bg-red"}>{ record.currentCustomerBank ? record.currentCustomerBank.accountName : null}</span>
      }
    }, {
      title: '金额',
      dataIndex: 'amount',
      width: '14%',
      render: (text, record) => {
        return <span  className={record.amountFlag=="0"?"":"bg-red"}>{`${record.amount}`}</span>
      }
    }, {
      title: '付款方账号',
      key: 'action',
      render: (text, record) => {
        return <span   className={record.accountNumberFlag=="0"?"":"bg-red"}>{ record.myAccount.accountNumber }</span>
      },
      width: '10%'
    }, {
      title: '预支付日期',
      dataIndex: 'prePayTime',
      width: '10%',
      render: (text, record) => {
        return <span  className={record.prePayTimeFlag=="0"?"":"bg-red"}>{ record.prePayTime }</span>
      }
    }, {
      title: '实支付日期',
      dataIndex: 'realPayTime',
      width: '10%'
    }, {
      title: '备注',
      dataIndex: 'remark',
      width: '10%'
    }, {
      title: '操作',
      render: (text, record) => {
        return (
					<div className="operation">
						<a href="javascript: " onClick={ this.openFrozenModal.bind(this, record) } className="details">{ record.freeze ? '解冻' : '冻结' }</a>
            {
              record.freeze
                ?
                ''
                :
								<span>
						<a href="javascript: " onClick={ this.openEditModal.bind(this, record) } className="details">编辑</a>
                  {record.state === 'ABNORMAL' ?'':<a href="javascript: " onClick={ this.openSubmissionAudit.bind(this, record, 2) } className="details">提交审核</a>}
                  {
                    record.handAccount
                      ?
                      ''
                      :
											<a href="javascript: " onClick={ this.openfallbackModal.bind(this, record) } className="details">退回</a>
                  }
									<a href="javascript: " onClick={ this.openListDetailsModal.bind(this, record) }  className="details">详情</a>
						</span>
            }
					</div>
        )
      },
    }];
    this.unauditedHeader = unauditedHeader;
    this.paymentFail = paymentFail;
    this.paymentFail = paymentFail;
	}

  // 表格选框勾选
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.props.selRowsUpdate(selectedRowKeys);
  }

	render () {
		const {
      showEditObj,
      showEditRule,
			rowData,
      bank,
      banks,
      subBank,
      subBanks,
      bankAcc,
      bankAccs,
      bankAccName,
		} = this.state;



		const { columnType, data, tableTotal, pageSize, current, selRows } = this.props;
		let columns;
    let rowSelection;

		if (columnType === 1) {
			columns = this.unauditedHeader;
		} else if (columnType === 2) {
			// columns = audit;
			columns = this.paymentFail;
		} else if (columnType === 3) {
			columns = this.paymentFail;
		}

    rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys: selRows
    };


		return (
			<section className="table-box">
				<Table
					rowSelection={rowSelection}
					pagination={{showQuickJumper: true, total: tableTotal, pageSize, current, onChange: this.pageHandleChange, showTotal: total => `共 ${total} 条`}}
					rowKey={(record, index) => index}
					columns={columns}
					dataSource={data} />
			
				{/* 冻结提醒 */}
				<Modal
					title={ `${this.state.rowData.freeze ? '解冻' : '冻结'}提醒` }
					visible={this.state.frozenVisible}
					onOk={this.frozenOk}
					onCancel={this.frozenCancel}
					maskClosable={ false }
					confirmLoading={ this.state.frozenEnterLoading }
					className="frozen-box"
				>
					<p className="frozen-waring">你确定要{ this.state.rowData.freeze ? '解冻' : '冻结' }该信息吗？</p>
		    </Modal>

				{/* 编辑弹窗 */}
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

                  {/*收款方信息*/}
                  <div className="edit-row payment-info" onClick={this.dropdownFunPayee}>
										<a className="pull-left" href="javascript: ">收款方信息 </a>
										<Icon className={ `pull-left ${ this.state.dropdownMovePayee ? "transform-rotate" : "" }` } type="caret-up" />
										<div className="clear"></div>
									</div>

                  <div className={ `payment-drop ${ this.state.dropdownMovePayee ? "payment-drop-active" : "" }` }>
                    <div className="payment-drop__row">
                      <span className="pull-left name">收款方账户：</span>
                      <div className="pull-left">
                        <Select size="large" value={bank} style={{ width: 120 }} onChange={this.bankChange}>
                          {banks.map((item, index) => {
                            return (<Option key={index} value={item.name}>{item.name}</Option>)
                          })}
                        </Select>
                        <Select size="large" value={subBank} style={{ width: 230, marginLeft: 10 }} onChange={this.subBankChange}>
                          {subBanks.map((item, index) => {
                            return (<Option key={index} value={item.name}>{item.name}</Option>)
                          })}
                        </Select>
                      </div>
                        <div className="clear"></div>
                    </div>

                    <div className="payment-drop__row">
                      <span className="pull-left name"></span>
                      <div className="pull-left">
                        <Select size="large" value={bankAcc}  style={{ width: 360 }} onChange={this.bankAccChange}>
                          {bankAccs.map((item, index) => {
                            return (<Option key={index} value={item.name}>{item.name}</Option>)
                          })}
                        </Select>
                      </div>
                      <div className="clear"></div>
                    </div>

                    <div className="payment-drop__row">
                      <span className="pull-left name">收款方账户名：</span>
                      <div className="pull-left">
                        <em className="user-name">{bankAccName}</em>
                      </div>
                      <div className="clear"></div>
                    </div>
                  </div>

	              </article>
		        </Modal>

		    	{/* 提交审核弹窗 */}
				
				<Modal
					title="提交审核"
					visible={this.state.submissionAuditVisible}
					onOk={this.submissionOk}
					onCancel={this.submissionCancel}
					maskClosable={ false }
					confirmLoading={ this.state.submissionAuditLoading }
					className={`frozen-box submission-box ${this.state.submissionModalType === 1 ? 'active' : ''}`}
				>
		        	<article>
						{
							this.state.submissionModalType === 1
							?
							<p className="frozen-waring">确定要提交审核吗？</p>
							:
							<div>
								<p className="frozen-waring text-left">检测到有支付/预付等款项，确认需要本次支付吗？</p>
								<Table 
									rowKey={ (record, index) => index }
									className="submission-table"
									columns={submissionAuditTableHeader} 
									dataSource={this.state.submissionAuditData} 
									pagination={ false }
									scroll={{ x: 310, y: 240 }}
								/>
							</div>
						}

						{
							this.state.submissionModalType === 1
							?
							''
							:
							<Button className="change" onClick={ this.openEditModal.bind(this, this.state.rowData) } type="primary">更改支付日期</Button>
						}
		        	</article>
		        </Modal>

				
				{/* 退回弹窗 */}
				<Modal
					title="退回"
					visible={this.state.fallbackVisible}
					onOk={this.fallbackOk}
					onCancel={this.fallbackCancel}
					maskClosable={ false }
					confirmLoading={ this.state.fallbackLoading }
					className="frozen-box fallback-box"
				>
					<article>
						<RadioGroup 
							onChange={this.onChangeFallbackValue} 
							value={this.state.fallbackValue}
						>
							<Radio value={0}>退回扫单人</Radio>
                    		<Radio value={1}>退回客服</Radio>
                    	</RadioGroup>

                    	<div className="textarea-group">
							<span className="pull-left name">原因：</span>
							<TextArea  maxLength="200" onChange={ this.remarkChange } className="pull-left text-area" placeholder="请输入原因" value={ this.state.remark } autosize={{ minRows: 3, maxRows: 6 }} />
							<div className="clear">`</div>
                    	</div>
					</article>
		    </Modal>

				{/* 列表详情 */}
				<ListDetails 
					ref="listDetails"
					detailData={ this.state.rowData }
					detailVisible={ this.state.openDetailVisible }
					closeListDetailsModal={ this.closeListDetailsModal }
				/>

				{
          showEditObj ?
						<EditObjDialog
							visible={showEditObj}
							curOrder={rowData}
							confirmed={this.editConfirmed}
							chgVisible={this.chgEditDialogVisible}/> :
            null
				}
				{
          showEditRule ?
						<EditRuleDialog
							visible={showEditRule}
							curOrder={rowData}
							confirmed={this.editConfirmed}
							chgVisible={this.chgEditDialogVisible}/> :
						null
				}
			</section>
		)
	}
}
