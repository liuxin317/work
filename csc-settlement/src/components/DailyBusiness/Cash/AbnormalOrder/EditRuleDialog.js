import React from 'react';
import { Modal } from 'antd';

// 编辑规则弹框
class EditRuleDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ruleData: {},
    };
  }

  componentWillMount() {
    this.getRule();
  }

  // 获取规则数据
  getRule() {
    const { curOrder } = this.props;
    Util.comFetch({
      addr: Api.getRuleDetailByOrderCode,
      code: curOrder.code,
    }, (re) => {
      console.log('rule re', re);
      let ruleData = re.data || {};
      this.setState({ruleData: ruleData});
    });
  }

  // 取消
  handleCancel = () => {
    this.props.chgVisible(false, 'rule');
  }

  // 异常订单编辑确认
  orderConfirm = () => {
    const curOrder = this.props.curOrder || {};
    const { ruleData } = this.state;
    if (!ruleData.name) {
      Modal.warning({
        title: '提示',
        content: '没有匹配到规则，请先配置规则',
        zIndex: 10000
      });
      return ;
    }
    Util.comFetch({
      addr: Api.recover,
      code: curOrder.code
    }, (re) => {
      this.props.confirmed();
    });
  }

  // 获取分期类型
  getLabel(type, index) {
    type = type + '';
    if (index == '0') {
      return '起算日';
    }
    switch (type) {
      case '1':
        return index + '月后';
      case '2':
        return index + '天后';
      case '3':
        return index + '年后';
      case '4':
        return index + '周后';
      default:
        return '';
    }
  }

  // 规则为分期类型时，获取分期详情
  getInstallmentDetail() {
    const { ruleData } = this.state;
    const ruleDefineModel = ruleData.ruleDefineModel || {};

    let timeInterval = ruleDefineModel.timeNo.split(',');
    if (timeInterval[0] === '') {
      timeInterval.shift();
    }
    let ratioInterval = ruleDefineModel.ratio.split(',');
    if (ratioInterval[0] === '') {
      ratioInterval.shift();
    }

    let timeArr = [];
    timeInterval.map((item, index) => {
      timeArr.push(this.getLabel(ruleDefineModel.instalmentIntervalType, item));
    })
    timeArr = timeArr.join(',');
    let ratioArr = [];
    ratioInterval.map((item, index) => {
      ratioArr.push(item+'%');
    });
    ratioArr = ratioArr.join(',');

    return (
      <div className="installment-detail">
        <div style={{width: '100%', marginTop: '10px', borderBottom: 'solid 1px #e1e1e1'}}>分期详情</div>
        <div className="row">
          <span className="desc">结算类型 :&nbsp;</span>
          <div className="row-item">{ruleDefineModel.settleType}</div>
        </div>
        <div className="row">
          <span className="desc">延期付款天数 :&nbsp;</span>
        <div className="row-item">{ruleDefineModel.latestPayDay}日</div>
        </div>
        <div className="row">
          <span className="desc">分期次数 :&nbsp;</span>
          <div className="row-item">{ruleDefineModel.instalmentCnt}期</div>
        </div>
        <div className="row">
          <span className="desc">分期间隔 :&nbsp;</span>
          <div className="row-item">{ruleDefineModel.instalmentInterval} {timeArr}</div>
        </div>
        <div className="row">
          <span className="desc">分期比例 :&nbsp;</span>
          <div className="row-item">{ruleDefineModel.instalmentRatio} {ratioArr}</div>
        </div>
      </div>
    );
  }


  render() {
    const { ruleData } = this.state;
    const { curOrder } = this.props;
    const ruleDefineModel = ruleData.ruleDefineModel || {};

    const installment = ruleDefineModel.payLimit === '分期';

    let installmentDetail = installment ? this.getInstallmentDetail() : null;

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
          <span className="desc">用途 :&nbsp;</span>
          <div className="row-item">{curOrder.busTypeName}</div>
        </div>
        <div className="row">
          <span className="desc">是否挂账 :&nbsp;</span>
          <div className="row-item">{curOrder.handAccount ? '是' : '否'}</div>
        </div>
        <div className="row">
          <span className="desc">规则名称 :&nbsp;</span>
          <div className="row-item">{ruleData.name}</div>
        </div>
        <div className="row">
          <span className="desc">付款方式 :&nbsp;</span>
          <div className="row-item">{ruleDefineModel.payChannel}</div>
        </div>
        <div className="row">
          <span className="desc">付款额度 :&nbsp;</span>
          <div className="row-item">{ruleDefineModel.payLimit}</div>
        </div>
        {installmentDetail}
      </Modal>
    );
  }
}

export default EditRuleDialog;
