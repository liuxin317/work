import React from 'react';
import { Button, Input, Select, DatePicker,message } from 'antd';
import  TreeDroplist  from "../../../common/OrgMy";
const { RangePicker } = DatePicker;
const Option = Select.Option;

// 搜索条件
class SearchConditon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 生成日期
      createDate: [],
      createDateStrs: [],
      // 往来对象
      obj: '',
      // 金额类型
      moneyType: '>',
      // 金额左区间
      moneyLeft: '',
      // 金额右区间
      moneyRight: '',
      // 订单类型
      orderState: '',
      // 币种
      currency: '',
      // 付款方账号
      account: '',
      // 预支付日期
      preDate: [],
      preDateStrs: [],
      // 实际支付日期
      realDate: [],
      realDateStrs: [],
      // 搜索关键字
      keyword: '',

      // '0'预支付,'1'处理中,'2'支付成功,'3'支付失败,'4'已退回
      // 是否显示实际支付日期，'0'预支付,'1'处理中时不显示
      showRealDate: props.tab !== '0' && props.tab !== '1',
      // 是否显示批量支付，'1'处理中,'2'支付成功,'4'已退回，时不显示
      showPayBtn: props.tab === '0' || props.tab === '3',
      // 是否显示订单状态下拉框
      showState: props.tab === '9',

        getOrgsOfTre:'',
        //组织机构选择的
        treeValue:[],
        bussInitial: [],
    };
  }
    componentWillMount(){
        this.getOrgsOfTre();
    }

  componentWillUpdate(nextProps) {
    if (nextProps.tab !== this.props.tab) {
      this.resetValue(nextProps.tab);
    }
  }

  // 重置筛选条件的值
  resetValue(tab) {
    this.setState({
      // 生成日期
      createDate: [],
      createDateStrs: [],
      // 往来对象
      obj: '',
      // 金额类型
      moneyType: '>',
      moneyLeft: '',
      moneyRight: '',
      // 订单类型
      orderState: '',
      // 币种
      currency: '',
      // 付款方账号
      account: '',
      // 预支付日期
      preDate: [],
      preDateStrs: [],
      // 实际支付日期
      realDate: [],
      realDateStrs: [],
      // 搜索关键字
      keyword: '',
      // 是否显示实际支付日期
      showRealDate: tab !== '0' && tab !== '1',
      // 是否显示批量支付
      showPayBtn: tab === '0' || tab === '3',
      // 是否显示订单状态下拉框
      showState: tab === '9',
    });
  }

  // 生成日期
  handleCreateChg = (dates, dateStrings) => {
    this.setState({
      createDate: dates,
      createDateStrs: dateStrings
    });
  }

  // 往来对象
  handleObjChg = (e, b, c) => {
    this.setState({
      obj: e.target.value
    });
  }

  // 金额类型
  moneyTypeChg = (value, option) => {
    this.setState({ moneyType: value });
  }

  // 订单类型
  orderStateChg = (value, option) => {
    this.setState({ orderState: value });
  }

  // 金额输入框
  // handleMoneyChg = (e, type) => {
  //   let key = '';
  //   if (type === 'left') {
  //
  //     key = 'moneyLeft';
  //   } else {
  //     key = 'moneyRight';
  //   }
  //   this.setState({ [key]: e.target.value });
  // }
    // 验证输入框的值改变
    changeStartValue=(e)=>{
        let val = e.target.value;
        //修复第一个字符是小数点 的情况.
        if(val !=''&& val.substr(0,1) == '.'){
            val="";
        }
        val = val.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
        val = val.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
        val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
        val = val.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
        if(val.indexOf(".")< 0 && val !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            if(val.substr(0,1) == '0' && val.length == 2){
                val= val.substr(1,val.length);
            }
        }
        this.setState({
            moneyLeft:val
        })
    }
    changeValue=(e)=>{
        let val = e.target.value;
        console.log(val);

        //修复第一个字符是小数点 的情况.
        if(val !=''&& val.substr(0,1) == '.'){
            val="";
        }
        val = val.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
        val = val.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
        val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
        val = val.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
        if(val.indexOf(".")< 0 && val !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            if(val.substr(0,1) == '0' && val.length == 2){
                val= val.substr(1,val.length);
            }
        }
        this.setState({
            moneyRight:val
        })

    }
    //为金额结束加0 失去焦点事件
    addZ=()=>{
        let val = this.state.moneyRight;
        console.log(val)
        if(val.match(/^\d+$/)) //为整数字符串在末尾添加.00
        {val += '.00';}
        if(/^(\d+\.\d{1,1}|\d+)$/.test(val)) //为0.1字符串在末尾添加.10
        {val += '0';}
        this.setState({
            moneyRight:val
        })
    }
    //为金额开始加0 失去焦点事件
    addStartZ=()=>{
        let val = this.state.moneyLeft;
        console.log(val)
        if(val.match(/^\d+$/)) //为整数字符串在末尾添加.00
        { val += '.00';}
        if(/^(\d+\.\d{1,1}|\d+)$/.test(val)) //为0.1字符串在末尾添加.10
        {val += '0';}
        this.setState({
            moneyLeft:val
        })
    }

  // 付款方账号
  handleAccountChg = (e) => {
    this.setState({ account: e.target.value });
  }

  // 预支付日期
  handlePreChg = (dates, dateStrings) => {
    this.setState({
      preDate: dates,
      preDateStrs: dateStrings
    });
  }

  // 币种
  currencyChg = (value, option) => {
    this.setState({currency: value});
  }

  // 实际支付日期
  handleRealChg = (dates, dateStrings) => {
    this.setState({
      realDate: dates,
      realDateStrs: dateStrings
    });
  }

  handleKeywordChg = (e) => {
    this.setState({keyword: e.target.value});
  }

  // 搜索，生成查询参数对象
  handleSearch = () => {
    let conditionObj = this.getParam();
    this.props.search(conditionObj);
  }

  // 导出
  handleExport = () => {
    let conditionObj = this.getParam();
    this.props.exportData(conditionObj);
  }

  /**
   * 搜索、导出时，生成查询参数
   * 主要目的在于满足后台查询接口有值才传参数的要求
   * @returns {{}}
   */
  getParam() {
    const { treeValue,createDateStrs, obj, moneyType, moneyLeft, moneyRight, account, preDateStrs, realDateStrs, orderState, keyword, currency } = this.state;
    let conditionObj = {};
    if (createDateStrs.join('') !== '') {
      conditionObj['startCreatedTime'] = createDateStrs[0] + ' 00:00:00';
      conditionObj['endCreatedTime'] = createDateStrs[1] + ' 23:59:59';
    }
    if(treeValue  !==''){
        conditionObj['orgCode'] = treeValue.toString();
    }
    if (obj !== '') {
      conditionObj['customerName'] = obj;
    }
    if (account !== '') {
      conditionObj['accountNumber'] = account;
    }
    if (preDateStrs.join('') !== '') {
      conditionObj['startPrePayTime'] = preDateStrs[0] + ' 00:00:00';
      conditionObj['endPrePayTime'] = preDateStrs[1] + ' 23:59:59';
    }
    if (realDateStrs.join('') !== '') {
      conditionObj['startRealPayTime'] = realDateStrs[0] + ' 00:00:00';
      conditionObj['endRealPayTime'] = realDateStrs[1] + ' 23:59:59';
    }
    if (moneyLeft !== '') {
      if (moneyType === 'between' && moneyRight !== '') {
        conditionObj['restriction'] = moneyType;
        conditionObj['startAmount'] = moneyLeft;
        conditionObj['endAmount'] = moneyRight;
      } else {
        conditionObj['restriction'] = moneyType;
        conditionObj['startAmount'] = moneyLeft;
      }
    }
    if (orderState !== '') {
      conditionObj['orderState'] = orderState;
    }
    if (currency !== '') {
      conditionObj['currencyCode'] = currency;
    }
    if (keyword !== '') {
      conditionObj['keyword'] = keyword;
    }
    return conditionObj;
  }

  handleMultiPay = () => {
    this.props.multiPay();
  };
    //获取组织结构下拉数据
    getOrgsOfTre = () => {
        let requestParam = {};
        requestParam.code = userInfo.orgCode;
        requestParam.addr = Api.getOrgsOfTree;
        Util.comFetch(requestParam, (data) => {
            let treeData = Util.getOrgData(data.orgs);
            console.log("获取组织结构下拉数据", treeData);
            this.setState({
                getOrgsOfTre: treeData
            });
        });
    };

    OrgCheckValue = (vals) => {
        console.log("组织机构vals",vals)
        this.setState({
            treeValue:vals,
        })
    };

  render() {
    const state = this.state;
    const props = this.props;
    const { createDate, obj, moneyType, moneyLeft, moneyRight, account, preDate, realDate, orderState, currency, keyword } = this.state;

    return (
      <div className="conditions">
        <div className="item-wrapper">
          <span className="desc">生成日期:</span>
          <RangePicker value={createDate} style={{ width: '230px' }} onChange={this.handleCreateChg}/>
        </div>

        <div className="item-wrapper" style={{display: 'none'}}>
          <Input
            value={obj}
            onChange={this.handleObjChg}
            onBlur={(e) => {this.setState({obj: e.target.value.trim()})}}
            style={{ width: '120px' }}
            placeholder="往来对象"/>
        </div>

          <div className="org" style={{verticalAlign: 'top', display: (this.props.tab === '1'?'none':'inline-block'), height: '30px', lineHeight: '28px'}}>
              <span>组织机构:</span>
              {this.state.getOrgsOfTre!==''&&<TreeDroplist
                   style={{width:"400px"  ,  display:"inline-block"}}
                   data={this.state.getOrgsOfTre}
                   multi={true}
                   edit={false}
                   initialSels={this.state.bussInitial}
                   onChg={(vals) => {
                       this.OrgCheckValue(vals)
                   }}
              />}
          </div>



        <div className="item-wrapper">
          <span className="desc">金额:</span>
          <Select onSelect={this.moneyTypeChg} value={moneyType} style={{ width: '60px' }}>
            <Option value=">">&gt;</Option>
            <Option value="<">&lt;</Option>
            <Option value="=">=</Option>
            <Option value="between">区间</Option>
          </Select>
          <Input
              maxLength="21"
            value={this.state.moneyLeft}
            onBlur={this.addStartZ}
            onChange={this.changeStartValue}
            style={{ width: '80px' , marginLeft:"5px" }}/>
          <span style={{display: moneyType === 'between' ? '' : 'none'}}>~</span>
          <Input
              maxLength="21"
              value={this.state.moneyRight}
            onBlur={this.addZ}
            onChange={(e)=>this.changeValue(e,1)}
            style={{ width: '80px', marginLeft: '2px', display: (moneyType === 'between' ? '' : 'none') }}/>
        </div>

        <div className="item-wrapper" style={{display: 'none'}}>
          <Input
            value={account}
            onChange={this.handleAccountChg}
            onBlur={(e) => {this.setState({account: e.target.value.trim()})}}
            style={{ width: '120px' }}
            placeholder="付款方账号"/>
        </div>

        <div className="item-wrapper">
          <span className="desc">预支付日期:</span>
          <RangePicker value={preDate} style={{ width: '230px' }} onChange={this.handlePreChg}/>
        </div>

        <div className="item-wrapper" style={{ display: state.showRealDate ? '' : 'none' }}>
          <span className="desc">实支付日期:</span>
          <RangePicker value={realDate} style={{ width: '230px' }} onChange={this.handleRealChg}/>
        </div>

        <div className="item-wrapper" style={{ display: state.showState ? '' : 'none' }}>
          <Select onSelect={this.orderStateChg} value={orderState}>
            <Option value="">全部状态</Option>
            <Option value="0">待支付</Option>
            <Option value="1">处理中</Option>
            <Option value="2">支付成功</Option>
            <Option value="3">支付失败</Option>
            <Option value="4">已退回</Option>
          </Select>
        </div>

        <div className="item-wrapper" style={{display: (this.props.tab === '1'?'none':'inline-block')}}>
          <Select onSelect={this.currencyChg} value={currency} style={{ width: '90px' }}>
            {props.currencyList.map((item, index) => {
              return (<Option key={index} value={item.key}>{item.label}</Option>)
            })}
          </Select>
        </div>

        <div className="item-wrapper">
          <Input
            value={keyword}
            onChange={this.handleKeywordChg}
            onBlur={(e) => {this.setState({keyword: e.target.value.trim()})}}
            style={{ width: '580px' }}
            placeholder="结算中心单号/往来对象/业务订单号/会计服务订单号/收款方银行账户名称/付款方银行帐号"/>
        </div>

        <div className="item-wrapper" style={{marginRight:0}}>
          <div>
            {/*<Button onClick={this.handleMultiPay} type="primary"
                    style={{  marginRight: '5px', verticalAlign: 'top', display: state.showPayBtn ? '' : 'none' }}>批量支付</Button>*/}
            <Button onClick={this.handleSearch} style={{  marginRight: '5px' }} type="primary" shape="circle"
                    icon="search"/>
            {/*<Button onClick={this.handleExport} type="primary" shape="circle" icon="download"/>*/}
            {/*<Button key={0} onClick={ this.props.batchFreeze } title="批量冻结/解冻" type="button" className="ant-btn  ant-btn-primary" style={{marginRight:'10px'}}>批量冻结/解冻</Button>*/}
            {/*<Button key={1} onClick={ this.props.batchEdit } title="批量编辑" type="button" className="ant-btn  ant-btn-primary" style={{display: this.props.tab ==='1'?'none':'', marginRight:'10px'}}>批量编辑</Button>*/}
            <Button style={{display: (this.props.tab === '1'?'none':'inline-block')}} onClick={ this.handleExport } className="export" type="primary">导出</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchConditon;