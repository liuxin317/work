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
      // 银行入账日期
      createDate: [],
      createDateStrs: [],
      // 金额类型
      moneyType: '>',
      moneyLeft: '',
      moneyRight: '',
      // 订单类型
      orderType: '',
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
  }
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

  // 银行入账日期
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
    if (val !== '') {
      val = val.replace(/^[^\d\.]*/, '').match(/^[1-9]+(\.\d{0,2}|\d*)|0?\.\d{0,2}|0/);
      val = val ? val[0] : '';
    }
    this.setState({
      moneyLeft: val
    })
  }
  changeValue = (e) => {
    let val = e.target.value;
    if (val !== '') {
      val = val.replace(/^[^\d\.]*/, '').match(/^[1-9]+(\.\d{0,2}|\d*)|0?\.\d{0,2}|0/);
      val = val ? val[0] : '';
    }
    this.setState({
      moneyRight: val
    });
  }
  //为金额结束加0 失去焦点事件
  addZ = () => {
    let val = this.state.moneyRight;
    if (val.length) {
      val = val.replace(/^\./, '0.');
      let dotIndex = val.indexOf('.');
      if (dotIndex > -1) {
        while (dotIndex + 2 > val.length - 1) {
          val += '0';
        }
      }
    }
    this.setState({
      moneyRight: val
    });
  }
  //为金额开始加0 失去焦点事件
  addStartZ = () => {
    let val = this.state.moneyLeft;
    if (val.length) {
      val = val.replace(/^\./, '0.');
      let dotIndex = val.indexOf('.');
      if (dotIndex > -1) {
        while (dotIndex + 2 > val.length - 1) {
          val += '0';
        }
      }
    }
    this.setState({
      moneyLeft: val
    });
  }

  // 币种
  orderTypeChg = (value, option) => {
    this.setState({ orderType: value });
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

  // 逾期配置
  handleExpire = () => {
    this.props.expire(true);
  }

  /**
   * 搜索、导出时，生成查询参数
   * 主要目的在于满足后台查询接口有值才传参数的要求
   * @returns {{}}
   */
  getParam() {
    const { createDateStrs,treeValue, moneyType, moneyLeft, moneyRight, keyword, orderType } = this.state;
    let conditionObj = {};
    // 银行入账日期
    if (createDateStrs.join('') !== '') {
      conditionObj['inAccountStartDate'] = createDateStrs[0] + ' 00:00:00';
      conditionObj['inAccountEndDate'] = createDateStrs[1] + ' 23:59:59';
    }
    //组织机构
      if (treeValue !== '') {
          conditionObj['orgCode'] = treeValue.toString();
      }
    // 金额
    if (moneyLeft !== '') {
      if (moneyType === 'between' && moneyRight !== '') {
        conditionObj['compareSign'] = moneyType;
        conditionObj['amount'] = moneyLeft;
        conditionObj['amountEnd'] = moneyRight;
      } else {
        conditionObj['compareSign'] = moneyType;
        conditionObj['amount'] = moneyLeft;
      }
    }
    // 状态
    if (orderType !== '') {
      conditionObj['stateName'] = orderType;
    }
    // 输入框
    if (keyword !== '') {
      conditionObj['accountInfo'] = keyword;
    }
    return conditionObj;
  }

  render() {
    const props = this.props;
    const {
      createDate,
      moneyType,
      orderType,
      keyword,
    } = this.state;

    return (
      <div className="conditions">

        <div className="item-wrapper">
          <Input
            value={keyword}
            onChange={this.handleKeywordChg}
            onBlur={(e) => {this.setState({keyword: e.target.value.trim()})}}
            style={{ width: '415px' }}
            placeholder="收款方账号/付款方银行开户名称"/>
        </div>

        <div  style={{display:'inline-block',verticalAlign:'top', height: '30px', lineHeight: '28px', marginRight: '10px'}}>
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
              placeholder="请输入金额"
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

        <div style={{marginLeft:"10px"}} className="item-wrapper">
          <span className="desc">银行入账日期:</span>
          <RangePicker value={createDate} style={{ width: '230px' }} onChange={this.handleCreateChg}/>
        </div>

        <div className="item-wrapper">
          <Select onSelect={this.orderTypeChg} value={orderType} style={{ width: '150px' }}>
            {props.orderTypeList.map((item, index) => {
              return (<Option key={index} value={item.key} title={item.label}>{item.label}</Option>)
            })}
          </Select>
        </div>

        <div className="item-wrapper">
          <div style={{marginLeft:"15px"}}>
            <Button onClick={this.handleSearch} style={{  marginRight: '5px' }} type="primary" shape="circle"
                    icon="search"/>
            {/*<Button onClick={ this.handleExport} className="export" type="primary">导出</Button>*/}
          </div>
        </div>

      </div>
    );
  }
}

export default SearchCondition;
