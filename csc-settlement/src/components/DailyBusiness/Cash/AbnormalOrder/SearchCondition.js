import React from 'react';
import { Button, Input, Select, DatePicker } from 'antd';
import  TreeDroplist  from "../../../common/OrgMy";
const { RangePicker } = DatePicker;
const Option = Select.Option;


// 搜索条件
class SearchCondition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 生成日期
      createDate: [],
      createDateStrs: [],
      // 金额类型
      moneyType: '>',
      moneyLeft: '',
      moneyRight: '',
      // 币种
      currency: '',
      // 搜索关键字
      keyword: '',

      getOrgsOfTre:'',
      //组织机构选择的
      treeValue:[],
      bussInitial: [],
    };
  }
  componentWillMount(){
      this.getOrgsOfTre();
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
              // getOrgsOfTre: data.orgs,
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
  // 生成日期
  handleCreateChg = (dates, dateStrings) => {
    this.setState({
      createDate: dates,
      createDateStrs: dateStrings
    });
  }

  // 金额类型
  moneyTypeChg = (value, option) => {
    this.setState({ moneyType: value });
  }

  // 验证输入框的值改变
  changeStartValue = (e) => {
    let val = e.target.value;
    //修复第一个字符是小数点 的情况.
    if (val != '' && val.substr(0, 1) == '.') {
      val = "";
    }
    val = val.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
    val = val.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
    if (val.indexOf(".") < 0 && val != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      if (val.substr(0, 1) == '0' && val.length == 2) {
        val = val.substr(1, val.length);
      }
    }
    this.setState({
      moneyLeft: val
    })
  }
  changeValue = (e) => {
    let val = e.target.value;
    console.log(val);

    //修复第一个字符是小数点 的情况.
    if (val != '' && val.substr(0, 1) == '.') {
      val = "";
    }
    val = val.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
    val = val.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
    if (val.indexOf(".") < 0 && val != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      if (val.substr(0, 1) == '0' && val.length == 2) {
        val = val.substr(1, val.length);
      }
    }
    this.setState({
      moneyRight: val
    })

  }
  //为金额结束加0 失去焦点事件
  addZ = () => {
    let val = this.state.moneyRight;
    console.log(val)
    if (val.match(/^\d+$/)) {
      //为整数字符串在末尾添加.00
      val += '.00';
    }
    if (/^(\d+\.\d{1,1}|\d+)$/.test(val)) {
      //为0.1字符串在末尾添加.10
      val += '0';
    }
    this.setState({
      moneyRight: val
    })
  }
  //为金额开始加0 失去焦点事件
  addStartZ = () => {
    let val = this.state.moneyLeft;
    if (val.match(/^\d+$/)) {
      //为整数字符串在末尾添加.00
      val += '.00';
    }
    if (/^(\d+\.\d{1,1}|\d+)$/.test(val)) {
      //为0.1字符串在末尾添加.10
      val += '0';
    }
    this.setState({
      moneyLeft: val
    })
  }

  // 币种
  currencyChg = (value, option) => {
    this.setState({ currency: value });
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
    const { treeValue,createDateStrs, moneyType, moneyLeft, moneyRight, keyword, currency } = this.state;
    let conditionObj = {};
    if (createDateStrs.join('') !== '') {
      conditionObj['startCreatedTime'] = createDateStrs[0] + ' 00:00:00';
      conditionObj['endCreatedTime'] = createDateStrs[1] + ' 23:59:59';
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
    if(treeValue!==''){
        conditionObj['orgCode'] = treeValue;
    }
    if (currency !== '') {
      conditionObj['currencyCode'] = currency;
    }
    if (keyword !== '') {
      conditionObj['keyword'] = keyword;
    }
    return conditionObj;
  }

  render() {
    const props = this.props;
    const {
      createDate,
      moneyType,
      currency,
      keyword,
    } = this.state;

    return (
      <div className="conditions">
        <div className="item-wrapper">
          <span className="desc">生成日期:</span>
          <RangePicker value={createDate} style={{ width: '230px' }} onChange={this.handleCreateChg}/>
        </div>
        <div  style={{display:'inline-block',verticalAlign:'top', height: '30px', lineHeight: '28px'}}>
          <span  style={{marginLeft:"20px"}}>组织机构:  </span>
            {this.state.getOrgsOfTre!==''&&<TreeDroplist
                data={this.state.getOrgsOfTre}
                multi={true}
                edit={false}
                initialSels={this.state.bussInitial}
                onChg={(vals) => {
                    this.OrgCheckValue(vals)
                }}
            />}
        </div>
        <div style={{marginLeft:"10px"}} className="item-wrapper">
          <span className="desc">金额:</span>
          <Select onSelect={this.moneyTypeChg} value={moneyType} style={{ width: '60px' }}>
            <Option value=">">&gt;</Option>
            <Option value="<">&lt;</Option>
            <Option value="=">=</Option>
            <Option value="between">区间</Option>
          </Select>
          <Input
            maxLength="21"
            placeholder="请输入金额"
            value={this.state.moneyLeft}
            onBlur={this.addStartZ}
            onChange={this.changeStartValue}
            style={{ width: '90px', marginLeft: "5px" }}/>
          <span style={{ display: moneyType === 'between' ? '' : 'none' }}>~</span>
          <Input
            maxLength="21"
            placeholder="请输入金额"
            value={this.state.moneyRight}
            onBlur={this.addZ}
            onChange={(e) => this.changeValue(e, 1)}
            style={{ width: '90px', marginLeft: '2px', display: (moneyType === 'between' ? '' : 'none') }}/>
        </div>

        <div className="item-wrapper">币种:
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
            style={{ width: '475px' }}
            placeholder="结算中心单号/往来对象/业务订单号/收款方银行账户名称/付款方银行帐号"/>
        </div>

        <div className="item-wrapper">
          <div style={{marginLeft:"15px"}}>
            <Button onClick={this.handleSearch} style={{  marginRight: '5px' }} type="primary" shape="circle"
                    icon="search"/>
            <Button onClick={this.handleExport} type="primary" shape="circle" icon="download"/>
          </div>
        </div>

      </div>
    );
  }
}

export default SearchCondition;
