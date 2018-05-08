import React from 'react';
import { Form, Select, Radio, DatePicker, Button, message } from 'antd';
import Org from "../../../common/Org/addOrg";
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';

// 新增保管信息表单第1步
class FormStep1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 银行, 开户行名, 卡号
      bank: '',
      banks: [],
      subBank: '',
      subBanks: [],
      bankAcc: '',
      bankAccs: [],
      // 银行账号详情
      bankDetail: "",
      // 银行数据
      getAccountData: [],

      // 组织机构数据
      getOrgsOfTre: '',
      //组织机构选择的
      treeValue: '',
      orgCode: "",
      OrgId: [],

      //是否开通网银
      ebankOpen: "1",
      //开通网银时间
      ebankOpenTime: null,

      //是否开通银企直联
      b2eOpen: "1",
      //开通银企直连时间
      b2eOpenTime: null,

      // 编辑的数据
      remoteData:'',
    };
  }

  componentDidMount() {
    this.getOrgsOfTre();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.treeValue !== this.state.treeValue) {
      this.getMyAccountByOrg()
    }
    if (prevState.subBank !== this.state.subBank) {
      this.getDetail()
    }
  }

  //获取组织结构下拉数据
  getOrgsOfTre = () => {
    let requestParam = {};
    requestParam.code = userInfo.orgCode;
    requestParam.addr = Api.getOrgsOfTree;
    Util.comFetch(requestParam, (data) => {
      this.setState({
        getOrgsOfTre: data.orgs
      });
      if(this.props.isEdit || this.props.stepBack){
        this.getEditData();
      }else{
        this.getMyAccountByOrg()
      }
    });
  }

  //根据银行账号获取相关详情
  getDetail = () => {
    let requestParam = {};
    requestParam.addr = Api.getMyAccountBypAccountNumber;
    requestParam.pAccountNumber = this.state.subBank;
    Util.comFetch(requestParam, (data) => {
      this.setState({
        bankDetail: data.data[0].split(",")
      });
    })
  }


  //修改获取用户信息
  getEditData() {
    const { data } = this.props;
    // 如果是从上一步退回，isEdit也为true，用编辑过的数据，恢复之前编辑后的状态
    if (data) {
      this.setEditStatus(data);
      return ;
    }

    Util.comFetch(
      {
        addr: Api.findCustodyById,
        custodyId: Util.getQueryString('id')
      },
      (data) => {
        this.setEditStatus(data.data);
      }
    );
  }

  /**
   * 设置、恢复(点上一步时)编辑状态
   * @param remoteData 远程数据、之前编辑好的数据
   */
  setEditStatus(remoteData) {
    this.setState({
      treeValue: remoteData.treeValue || remoteData.orgCode,
    });

    this.setState({
      remoteData: remoteData,
      ebankOpen: remoteData.ebankOpen+"",
      b2eOpen: remoteData.b2eOpen+"",
    });
    let formData = {};
    //时间
    if (remoteData.ebankOpen+'' === '1') {
      formData.ebankOpenTime = moment(remoteData.ebankOpenTime);
    }
    if (remoteData.b2eOpen+'' === '1') {
      formData.b2eOpenTime = moment(remoteData.b2eOpenTime);
    }
    this.props.form.setFieldsValue(formData);
  }

  // /**
  //  * 设置、恢复(点上一步时)编辑状态
  //  * @param remoteData 远程数据、之前编辑好的数据
  //  */
  // setEditStatus(remoteData) {
  //   this.setState({
  //     remoteData:remoteData
  //   });
  //   let formData = {};
  //   //开户人,电话,身份证
  //   formData.accHolderName = remoteData.accHolderName;
  //   formData.accHolderTel = remoteData.accHolderTel;
  //   formData.accHolderCardId = remoteData.accHolderCardId;
  //   this.props.form.setFieldsValue(formData);
  // }

  // 获取付款方账户
  getMyAccountByOrg() {
    let requestParam = {};
    requestParam.addr = Api.getMyAccountByOrg;
    requestParam.orgCode = this.state.treeValue;
    Util.comFetch(requestParam, (re) => {
      if(this.props.isEdit){
        this.EditBankPush()
      }
      // 转成银行-账户名-卡号的数据结构
      //转成银行-卡号  的数据结构
      let reData = re.data;
      console.log("获取账号", re.data)
      this.setState({
        getAccountData: re.data
      });
      let reDATA = [];
      reData.map((v, i) => {
        let reR = v.split(",");
        let reName = reR[3];
        reR[3] = reR[1];
        reR[1] = reName;
        reR = reR.toString();
        reDATA.push(reR);
      });
      // 后台返回的银行-支行-卡号数据是逗号分隔的字符串，用trans3LvlBankData转换为带层级的对象
      let accData = Util.trans3LvlBankData(reDATA);
      this.calcAccSelect(accData);
      this.setState({accData});

      // 点上一步返回，设置之前选择的银行
      if (this.props.stepBack) {
        this.setState({
          bank: this.props.data.bank,
          subBank: this.props.data.subBank,
        });
      }
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
        if (item.name === bankSpec) {
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
    this.setState({banks, bank, subBanks, subBank, bankAccs, bankAcc, bankAccName});
  }

  // 银行编辑数据
  EditBankPush(){
    Util.comFetch(
      {
        addr: Api.findCustodyById,
        custodyId: Util.getQueryString('id')
      },
      (data) => {
        let remoteData=data.data;
        console.log("银行编辑",remoteData)
        this.setState({
          bank: remoteData.pBankCategoryCode,
          subBank:remoteData.pAccountNumber,
        })
      })
  }

  // 设置组织机构value选择
  TreeValue = (value, id) => {
    this.setState({
      treeValue: value,
      OrgId: id
    })
  }

  // 币种转换
  bankDetailS = (v) => {
    if (v == "CNY") {
      return "人民币"
    } else if (v == "USD") {
      return "美元"
    } else if (v == "JPY") {
      return "日元"
    }
  }

  // 付款方选择银行， 需要重新设置支行和卡号
  bankChange = (value) => {
    this.setState({bank: value});
    this.calcAccSelect(this.state.accData, value);
  }

  // 付款方选择支行， 需要重新设置卡号
  subBankChange = (value) => {
    console.log("设置卡号", value);
    this.setState({subBank: value});
    this.calcAccSelect(this.state.accData, this.state.bank, value);
  }

  // 下一步
  next = () => {
    const { treeValue, ebankOpen, b2eOpen, bank, subBank } = this.state;
    this.props.form.validateFields((errors, values) => {
      if(this.state.treeValue == ""){
        message.error("请选择组织机构");
      } else {
        if (!errors) {
          let curFormData = Object.assign({}, values, {
            treeValue: treeValue,
            bank: bank,
            subBank: subBank,
            ebankOpen: ebankOpen,
            b2eOpen: b2eOpen,
          });
          if (curFormData.b2eOpen == '1') {
            curFormData.b2eOpenTime = this.transDate(values.b2eOpenTime);
          }
          if (curFormData.ebankOpen == '1') {
            curFormData.ebankOpenTime = this.transDate(values.ebankOpenTime);
          }
          this.props.next(curFormData);
        }
      }
    });
  }

  // 转换时间格式
  transDate(dateStr) {
    let date = new Date(dateStr);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  render() {
    const { getOrgsOfTre, treeValue, bank, banks, subBank, subBanks, bankDetail } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        {
          getOrgsOfTre !== '' &&
          <div className="row">
            <span className="desc">组织机构:</span>
            <div style={{ height: "30px" }} className="form-item">
              <Org
                ValueEdit={treeValue}
                OrgData={getOrgsOfTre}
                TreeValue={this.TreeValue}
              />
            </div>
          </div>
        }
        <div className="row">
          <span className="desc">开户行行别:</span>
          <div className="form-item">
            <Select className="common-left-input" value={bank} style={{ width: 200 }}
                    onChange={this.bankChange}>
              {banks.map((item, index) => {
                return (<Option key={index} value={item.name}>{item.name}</Option>)
              })}
            </Select>
          </div>
        </div>
        <div className="row">
          <span className="desc">银行账号:</span>
          <div className="form-item">
            <Select className="common-left-input" value={subBank} style={{ width: 200 }}
                    onChange={this.subBankChange}>
              {subBanks.map((item, index) => {
                return (<Option key={index} value={item.name}>{item.name}</Option>)
              })}
            </Select>
          </div>
        </div>
        <div className="row">
          <span className="desc">银行开户名称:</span>
          <div className="form-item">{bankDetail[0]}
          </div>
        </div>
        <div className="row">
          <span className="desc">开户行名称:</span>
          <div className="form-item">{bankDetail[1]}
          </div>
        </div>
        <div className="row">
          <span className="desc">币种:</span>
          <div className="form-item">{this.bankDetailS(bankDetail[2])}
          </div>
        </div>
        <div className="row">
          <span className="desc">账户性质:</span>
          <div className="form-item">{bankDetail[3]}

          </div>
        </div>

        <div className="row"> 网银信息</div>
        <div className="row">
          <div className="desc" style={{ width: "200px", marginLeft: "50px" }}>
            <RadioGroup value={this.state.ebankOpen}
                        onChange={(e) => this.setState({ ebankOpen: e.target.value })}>
              <Radio value="1">已开通</Radio>
              <Radio value="2">未开通</Radio>
            </RadioGroup>
          </div>
          {
            this.state.ebankOpen == "1" &&
            <div className="time-wrapper">
              <span>开通时间:</span>
              <div className="form-item">
                <FormItem
                  hasFeedback
                >
                  {getFieldDecorator('ebankOpenTime', {
                    rules: [{
                      required: true, message: "请输入开通日期"
                    }],
                  })(
                    <DatePicker
                      className="search-time-range" format={dateFormat}
                    />
                  )}
                </FormItem>
              </div>
            </div>
          }
        </div>

        <div className="row">银企直联</div>
        <div className="row">
          <div className="desc" style={{ width: "200px", marginLeft: "50px" }}>
            <RadioGroup value={this.state.b2eOpen}
                        onChange={(e) => this.setState({ b2eOpen: e.target.value })}>
              <Radio value="1">已开通</Radio>
              <Radio value="2">未开通</Radio>
            </RadioGroup>
          </div>
          {
            this.state.b2eOpen == "1" &&
            <div className="time-wrapper">
              <span>开通时间:</span>
              <div className="form-item">
                <FormItem
                  hasFeedback
                >
                  {getFieldDecorator('b2eOpenTime', {
                    rules: [{
                      required: true, message: "请输入开通日期"
                    }],
                  })(
                    <DatePicker
                      className="search-time-range" format={dateFormat}
                    />
                  )}
                </FormItem>
              </div>
            </div>
          }
        </div>

        <div className="tac">
          <Button onClick={this.next} type="primary">下一步</Button>
        </div>
      </Form>
    );

  }
}

FormStep1 = Form.create()(FormStep1);
export default FormStep1;
