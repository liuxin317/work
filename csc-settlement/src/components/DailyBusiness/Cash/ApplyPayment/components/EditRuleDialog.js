import React from 'react';
import { Modal } from 'antd';

// 编辑规则（付款方）弹框
class EditRuleDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ruleData: {},
    };
  }

  componentWillMount() {
    // this.getRule();
    this.orderConfirm();
  }

  // // 获取规则数据
  // getRule() {
  //   const { curOrder } = this.props;
  //   Util.comFetch({
  //     addr: Api.getRuleDetailByOrderCode,
  //     code: curOrder.code,
  //   }, (re) => {
  //     console.log('rule re', re);
  //     let ruleData = re.data || {};
  //     this.setState({ruleData: ruleData}, () => {
  //       this.orderConfirm();
  //     });
  //   });
  // }

  // 取消
  handleCancel = () => {
    this.props.chgVisible(false, 'rule');
  }

  // 异常订单编辑确认
  orderConfirm = () => {
    const curOrder = this.props.curOrder || {};
    // const { ruleData } = this.state;
    // if (!ruleData.name) {
    //   Modal.warning({
    //     title: '提示',
    //     content: '没有默认付款账号，请维护默认付款账号',
    //     zIndex: 10000
    //   });
    //   this.handleCancel();
    //   return ;
    // }

    Util.comFetch({
      addr: Api.recover,
      code: curOrder.code
    }, (re) => {
      this.props.confirmed();
    }, (errMsg) => {
      Modal.warning({
        title: '提示',
        content: errMsg,
        zIndex: 10000
      });
      this.handleCancel();
    });
  }

  // // 获取分期类型
  // getLabel(type, index) {
  //   type = type + '';
  //   if (index == '0') {
  //     return '起算日';
  //   }
  //   switch (type) {
  //     case '1':
  //       return index + '月后';
  //     case '2':
  //       return index + '天后';
  //     case '3':
  //       return index + '年后';
  //     case '4':
  //       return index + '周后';
  //     default:
  //       return '';
  //   }
  // }

  // // 规则为分期类型时，获取分期详情
  // getInstallmentDetail() {
  //   const { ruleData } = this.state;
  //   const ruleDefineModel = ruleData.ruleDefineModel || {};
  //
  //   let timeInterval = ruleDefineModel.timeNo.split(',');
  //   if (timeInterval[0] === '') {
  //     timeInterval.shift();
  //   }
  //   let ratioInterval = ruleDefineModel.ratio.split(',');
  //   if (ratioInterval[0] === '') {
  //     ratioInterval.shift();
  //   }
  //
  //   let timeArr = [];
  //   timeInterval.map((item, index) => {
  //     timeArr.push(this.getLabel(ruleDefineModel.instalmentIntervalType, item));
  //   })
  //   timeArr = timeArr.join(',');
  //   let ratioArr = [];
  //   ratioInterval.map((item, index) => {
  //     ratioArr.push(item+'%');
  //   });
  //   ratioArr = ratioArr.join(',');
  //
  //   return (
  //     <div className="installment-detail">
  //       <div style={{width: '100%', marginTop: '10px', borderBottom: 'solid 1px #e1e1e1'}}>分期详情</div>
  //       <div className="row">
  //         <span className="desc">结算类型 :&nbsp;</span>
  //         <div className="row-item">{ruleDefineModel.settleType}</div>
  //       </div>
  //       <div className="row">
  //         <span className="desc">延期付款天数 :&nbsp;</span>
  //       <div className="row-item">{ruleDefineModel.latestPayDay}日</div>
  //       </div>
  //       <div className="row">
  //         <span className="desc">分期次数 :&nbsp;</span>
  //         <div className="row-item">{ruleDefineModel.instalmentCnt}期</div>
  //       </div>
  //       <div className="row">
  //         <span className="desc">分期间隔 :&nbsp;</span>
  //         <div className="row-item">{ruleDefineModel.instalmentInterval} {timeArr}</div>
  //       </div>
  //       <div className="row">
  //         <span className="desc">分期比例 :&nbsp;</span>
  //         <div className="row-item">{ruleDefineModel.instalmentRatio} {ratioArr}</div>
  //       </div>
  //     </div>
  //   );
  // }


  render() {
    // const { ruleData } = this.state;
    // const { curOrder } = this.props;
    // const ruleDefineModel = ruleData.ruleDefineModel || {};
    //
    // const installment = ruleDefineModel.payLimit === '分期';
    //
    // let installmentDetail = installment ? this.getInstallmentDetail() : null;

    return (
      <div style={{display: 'none'}}></div>
    );
  }
}

export default EditRuleDialog;
