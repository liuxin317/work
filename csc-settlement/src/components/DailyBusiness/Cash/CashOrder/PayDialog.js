import React from 'react';
import { Modal, Radio, Select, DatePicker } from 'antd';
const RadioGroup = Radio.Group;
const Option = Select.Option;

// 支付弹框
class PayDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 支付类型 预支付 立即支付
      payType: 'pre',
      // 预支付日期
      preDate: '',
      // 是否显示更多信息
      showMore: false,

      // 付款方账户全部数据
      accData: {},
      // 付款方账户-银行
      bank: '',
      banks: [],
      // 付款方账户-银行支行
      subBank: '',
      subBanks: [],
      // 付款方账户-银行卡号
      bankAcc: '',
      bankAccs: [],

      // 付款方账户名称
      bankAccName: '',

      // 支付方式
      payWay: '',
      payWayData: [],

      // 支付渠道
      payChannel: '',
      payChannelData: [],
    }
  }

  componentWillMount() {
    this.getPayWay();
  }

  componentWillReceiveProps(nextProps) {
    // 弹框弹出后，获取最新的账户信息
    if (!this.props.visible && nextProps.visible) {
      this.getAccount();
    }
  }

  componentDidUpdate(preProps, preState) {
    const state = this.state;
    if (state.bankAcc && state.bankAcc !== preState.bankAcc) {
      this.getPayChannelData(state.bankAcc);
    }
  }

  // 获取付款方账户
  getAccount() {
    Util.comFetch({
      companyId: userInfo.companyId,
      tenantId: userInfo.tenantId,
      addr: Api.getPayerAccount
    }, (re) => {
      // 后台返回的银行-支行-卡号数据是逗号分隔的字符串，用trans3LvlBankData转换为带层级的对象
      let accData = Util.trans3LvlBankData(re.data);

      // 表格中订单的付款方信息
      let specAcc = this.props.orderData.myAccount;
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
          if (item === accStr) {
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

  // 获取支付方式，不同订单是相同的
  getPayWay() {
    Util.comFetch({
      addr: Api.getDropdownList,
      dictType: 'payMode'
    }, (re)=>{
      console.log('支付方式', re);
      let payWayData = [];
      re.data.rows.forEach((item) => {
        payWayData.push({
          key: item.dictCode,
          label: item.dictName
        });
      });
      this.setState({ payWayData, payWay: payWayData[0].label });
    });
  }

  // 获取支付渠道
  getPayChannelData(accountNumber) {
    Util.comFetch({
      addr: Api.getMyAccountByAccountNumber,
      accountNumber: accountNumber
    }, (re)=>{
      let payChannel = '';
      if (re.data.length) {
        payChannel = re.data[0].value;
      }
      this.setState({ payChannelData: re.data, payChannel });
    });
  }

  // 付款方账户，银行-支行-卡号，根据选择的前一级，确定后级的数据
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

  handleOk = () => {

    const state = this.state;
    let data = {
      accountNumber: state.bankAcc,
      prePayTime: state.preDate,
      settChannelName: state.payChannel,
      payModeName: state.payWay,
      immediate: state.payType === 'immediate'
    };
    if (state.payType !== 'immediate') {
      if (state.preDate === '') {
        Modal.warning({
          title: '提示',
          content: '请选择预支付日期'
        });
        return ;
      }
    }

    // console.log('data', data);
    this.props.ok(data);
  }

  handleCancel = () => {
    this.props.chgVisible(false);
  }

  payTypeChange = (e) => {
    this.setState({payType: e.target.value});
  }

  preDateChange = (moment, str) => {
    this.setState({ preDate: str });
  }

  // 切换更多信息显示
  toggleMore = () => {
    this.setState({showMore: !this.state.showMore})
  }

  // 付款方选择银行， 需要重新设置支行和卡号
  bankChange = (value) => {
    this.setState({bank: value});
    this.calcAccSelect(this.state.accData, value);
  }

  // 付款方选择支行， 需要重新设置卡号
  subBankChange = (value) => {
    this.setState({subBank: value});
    this.calcAccSelect(this.state.accData, this.state.bank, value);
  }

  // 付款方选择卡号
  bankAccChange = (value) => {
    this.setState({bankAcc: value});
  }

  // 支付方式改变
  payWayChange = (value) => {
    console.log('v1', value);
    this.setState({payWay: value });
  }

  payChannelChange = (e) => {
    this.setState({payChannel: e.target.value});
  }

  render() {
    const state = this.state;
    const { payType, bank, banks, subBank, subBanks, bankAcc, bankAccs, bankAccName } = this.state;
    const radioStyle = {
      display: 'block'
    };

    return (
      <Modal
        title="支付"
        className="settle-order-dialog"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div className="default-info">
          <RadioGroup onChange={this.payTypeChange} value={this.state.payType}>
            <Radio value={'pre'}>预支付</Radio>
            <Radio value={'immediate'}>立即支付</Radio>
          </RadioGroup>
          <div className="pre-date" style={{display: payType === 'pre' ? '' : 'none'}}>
            预支付日期 :
            <DatePicker
              showToday={false}
              onChange={this.preDateChange}
              disabledDate={(current) => {return current && current.valueOf() < Date.now()}} />
          </div>
        </div>
        <div className="show-more-info">
          <span className="show-more" onClick={this.toggleMore}>付款方信息<i>(可修改)</i></span>
        </div>
        <div className="more-info" style={{display: this.state.showMore ? '' : 'none'}}>
          <div className="row">
            <span className="desc">付款方账户 :&nbsp;</span>
            <div className="row-item">
              <Select value={bank} style={{ width: 100 }} onChange={this.bankChange}>
                {banks.map((item, index) => {
                  return (<Option key={index} value={item.name}>{item.name}</Option>)
                })}
              </Select>
              <Select value={subBank} style={{ width: 120 }} onChange={this.subBankChange}>
                {subBanks.map((item, index) => {
                  return (<Option key={index} value={item.name}>{item.name}</Option>)
                })}
              </Select>
              <Select value={bankAcc} style={{ width: 160 }} onChange={this.bankAccChange}>
                {bankAccs.map((item, index) => {
                  return (<Option key={index} value={item.name}>{item.name}</Option>)
                })}
              </Select>
            </div>
          </div>
          <div className="row">
            <span className="desc">付款方账户名:&nbsp;</span>
            <div className="row-item">{bankAccName}</div>
          </div>
          <div className="row">
            <span className="desc">支付方式 :&nbsp;</span>
            <div className="row-item">
              <Select value={state.payWay} style={{ width: 120 }} onChange={this.payWayChange}>
                {state.payWayData.map((item, index) => {
                  return (<Option key={index} value={item.label}>{item.label}</Option>)
                })}
              </Select>
            </div>
          </div>
          <div className="row">
            <span className="desc">支付渠道 :&nbsp;</span>
            <div className="row-item">
              <RadioGroup onChange={this.payChannelChange} value={this.state.payChannel}>
                {state.payChannelData.map((item, index) => {
                  return (<Radio key={index} style={radioStyle} value={item.value}>{item.value}</Radio>);
                })}
              </RadioGroup>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default PayDialog;
