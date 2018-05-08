import React from 'react';
import { Modal, Select } from 'antd';
import cascaderOption from '../../../../../constants/cascader-address-options';
const Option = Select.Option;

// 编辑往来对象（收款方）弹框
class EditObjDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 开户行
      bank: '',
      banks: [],
      // 银行开户名称
      accName: '',
      accNames: [],
      // 银行账号
      bankAcc: '',
      bankAccs: [],
      // 账户全部数据
      accData: {},

      // 省
      province: '',
      // 市
      city: '',
      // 支行
      subBankName: '',
    };
  }

  componentWillMount() {
    this.getAccount();
  }

  // componentWillReceiveProps(nextProps) {
  //   // 弹框弹出后，获取最新的账户信息
  //   if (!this.props.visible && nextProps.visible) {
  //     // this.getAccount();
  //   }
  // }

  // 获取往来账户
  getAccount() {
    const { curOrder } = this.props;
    Util.comFetch({
      addr: Api.getPayeeAccountByCustomerName,
      code: curOrder.code,
    }, (re) => {
      // 处理数据，将 银行,支行,卡号,账号 转换为 银行,账号,卡号,支行
        if(re.data){
            re.data.forEach((item, index) => {
              let arr = item.split(',');
              let tmp = arr[1];
              arr[1] = arr[3];
              arr[3] = tmp;
              re.data[index] = arr.join(',');
            });

            // 后台返回的银行-支行-卡号数据是逗号分隔的字符串，用trans3LvlBankData转换为带层级的对象
            let accData = Util.trans3LvlBankData(re.data);

            if (accData.length) {
              let banks = accData;
              let bank = accData[0].name;
              let accNames = banks[0].children;
              let accName = banks[0].children[0].name;
              let bankAccs = accNames[0].children;
              let bankAcc = accNames[0].children[0].name;
              let subBankName = accNames[0].children[0].accName;

              let province = accNames[0].children[0].more[0];
              let city = accNames[0].children[0].more[1];

              let pcName = this.getProvinceCity(province, city);
              province = pcName.province;
              city = pcName.city;

              this.setState({
                banks,
                bank,
                accNames,
                accName,
                bankAccs,
                bankAcc,
                accData,
                subBankName,
                province,
                city,
              });
            }}
    });
  }

  // // 查询账号详情，开户行，省市
  // getAccountDetail() {
  //   Util.comFetch(
  //     {
  //       addr: Api.getMyAccountByAccountId,
  //       accountId: Util.getQueryString('id')
  //     },
  //     (data) => {
  //       //开户行省市赋值
  //       // formData.provinceCity = [remoteData.province, remoteData.city];
  //     }
  //   );
  // }

  /**
   * 付款方账户，银行-账号-卡号，根据选择的前一级，确定后级的数据
   * @param data 完整账户数据
   * @param bankSpec 指定银行
   * @param accNameSpec 指定账户名
   */
  calcAccSelect(data, bankSpec, accNameSpec) {
    const state = this.state;
    let bank = bankSpec || state.bank,
      accName = accNameSpec || state.accName,
      bankAcc = '';
    let banks = state.banks,
      accNames = state.accNames,
      bankAccs = state.bankAccs,
      subBankName = state.subBankName;

    if (!bankSpec) {
      banks = data;
      bank = banks[0].name;
      accNames = banks[0].children;
      accName = accNames[0].name;
      bankAccs = accNames[0].children;
      bankAcc = bankAccs[0].name;
      subBankName = bankAccs[0].accName;
    } else if (!accNameSpec) {
      data.some((item) => {
        if(item.name === bankSpec) {
          accNames = item.children;
          return true;
        }
      });
      accName = accNames[0].name;
      bankAccs = accNames[0].children;
      bankAcc = bankAccs[0].name;
      subBankName = bankAccs[0].accName;
    } else {
      accNames.forEach((item) => {
        if (item.name === accNameSpec) {
          bankAccs = item.children;
          return true;
        }
      });
      bankAcc = bankAccs[0].name;
      subBankName = bankAccs[0].accName;
    }
    this.setState({ banks, bank, accNames, accName, bankAccs, bankAcc, subBankName});
  }

  handleCancel = () => {
    this.props.chgVisible(false, 'obj');
  }

  // 选择银行， 需要重新设置账号和卡号
  bankChange = (value) => {
    this.setState({bank: value});
    this.calcAccSelect(this.state.accData, value);
  }

  // 选择账号， 需要重新设置卡号
  accNameChange = (value) => {
    this.setState({accName: value});
    this.calcAccSelect(this.state.accData, this.state.bank, value);
  }

  // 选择卡号
  bankAccChange = (value) => {
    this.setState({bankAcc: value});
  }

  // 异常订单编辑确认
  orderConfirm = () => {
    const curOrder = this.props.curOrder || {};
    const { banks, bank, accName, bankAcc } = this.state;
    if (!banks.length) {
      Modal.warning({
        title: '提示',
        content: '往来对象未维护，请先维护往来对象',
        zIndex: 10000
      });
      return ;
    }
    Util.comFetch({
      addr: Api.recover,
      accountNumber: bankAcc,
      code: curOrder.code,
      // bankCategoryCode: curOrder.acAccount.bankCategoryCode,
      // accountName: accName,
    }, (re) => {
      this.props.confirmed();
    });
  }

  // 获取省市、支行信息
  getProvinceCity(province, city) {
    console.log('cascaderOption', cascaderOption);
    let pNm = '';
    let cNm = '';
    cascaderOption.some(function (item) {
      if (item.value === province) {
        pNm = item.label;
        item.children.some(function (itemCity) {
          if (itemCity.value === city) {
            cNm = itemCity.label;
            return true;
          }
        })
        return true;
      }
    });

    return {
      province: pNm,
      city: cNm
    };
  }

  render() {
    const { curOrder } = this.props;
    const {
      bank,
      banks,
      accName,
      accNames,
      bankAcc,
      bankAccs,
      subBankName,
      province,
      city,
    } = this.state;
    let receiverAccName = curOrder.myAccount ? curOrder.myAccount.accountName : '';

    return (
      <Modal
        title="编辑"
        className="settle-order-dialog"
        onCancel={this.handleCancel}
        onOk={this.orderConfirm}
        visible={this.props.visible}>
        <div className="row">
          <span className="desc">往来对象名称 :&nbsp;</span>
          <div className="row-item">{curOrder.customerName}</div>
        </div>
        <div className="row">
          <span className="desc">开户行行别 :&nbsp;</span>
          <div className="row-item">
            <Select value={bank} style={{ width: 200 }} onChange={this.bankChange}>
              {banks.map((item, index) => {
                return (<Option key={index} value={item.name} title={item.name}>{item.name}</Option>)
              })}
            </Select>
          </div>
        </div>
        <div className="row">
          <span className="desc">银行开户名称 :&nbsp;</span>
          <div className="row-item">
            <Select value={accName} style={{ width: 200 }} onChange={this.accNameChange}>
              {accNames.map((item, index) => {
                return (<Option key={index} value={item.name} title={item.name}>{item.name}</Option>)
              })}
            </Select>
          </div>
        </div>
        <div className="row">
          <span className="desc">银行账号 :&nbsp;</span>
          <div className="row-item">
            <Select value={bankAcc} style={{ width: 200 }} onChange={this.bankAccChange}>
              {bankAccs.map((item, index) => {
                return (<Option key={index} value={item.name} title={item.name}>{item.name}</Option>)
              })}
            </Select>
          </div>
        </div>
        <div className="row">
          <span className="desc">开户行名称 :&nbsp;</span>
          <div className="row-item">{province} {city} {subBankName}</div>
        </div>
      </Modal>
    );
  }
}

export default EditObjDialog;
