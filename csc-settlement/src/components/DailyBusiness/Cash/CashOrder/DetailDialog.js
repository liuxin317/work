import React from 'react';
import { Modal,Radio} from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const showRemarkMap = {
  'FAILED': 1,
  'CANCELED': 1
};

// 详情弹框
class DetailDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        detailCheck:'1'
    }
  }

  handleOk = () => {
    this.props.chgVisible(false);
  }

  handleCancel = () => {
    this.props.chgVisible(false);
  }

  calcState(text) {
    switch (text) {
      case 'UNPAID':
        return '待支付';
      case 'PROCESSED':
        return '处理中';
      case 'SUCCESSFUL':
        return '支付成功';
      case 'FAILED':
        return '支付失败';
      case 'CANCELED':
        return '已退回';
      case 'CLEARING':
        return '已结清';
      case 'INVALID':
        return '已作废';
      default:
        return '';
    }
  }
    detailCheck=(event)=>{
      this.setState({
          detailCheck:event.target.value
      })
    };
  render() {
    let record = Object.assign({}, this.props.detailData);
    if (!record.acAccount) {
      record.acAccount = {};
    }
    if (!record.myAccount) {
      record.myAccount = {};
    }


    return (
      <Modal
        className="settle-order-detail"
        width={720}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <RadioGroup value={this.state.detailCheck}
                    onChange={(event) => this.detailCheck(event)}
        >
          <RadioButton value="1">订单详情</RadioButton>
          <RadioButton value="2">变更记录</RadioButton>
        </RadioGroup>
          {this.state.detailCheck=='1'?
        <div    className="all-info">
          <div className="info-row">
            <div className="info-block">
              <p className="info-line">订单信息</p>
              <div>生成日期:{record.createdTime}</div>
              <div>业务订单号:{record.busCode}</div>
              <div>清算单号:{record.clearingCode}</div>
              <div>结算中心单号:{record.code}</div>
              <div>来源:{record.sourceName}</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-block">
              <p className="info-line">收款方信息</p>
              <div>往来对象:{record.acAccount.customerName}</div>
              <div>银行账户名称:{record.acAccount.accountName}</div>
              <div>银行账号:{record.acAccount.accountNumber}</div>
              <div>开户行名称:{record.acAccount.accountBankName}</div>
            </div>
            <div className="info-block">
              <p className="info-line">付款方信息</p>
              <div>银行账户名称:{record.myAccount.accountName}</div>
              <div>银行账号:{record.myAccount.accountNumber}</div>
              <div>开户行名称:{record.myAccount.accountBankName}</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-block">
              <p className="info-line">付款方式</p>
              <div>币种:{record.myAccount.currencyName}</div>
              <div>支付方式:{record.payModeName}</div>
              <div>支付渠道:{record.payChannelName}</div>
            </div>
            <div className="info-block">
              <p className="info-line">金额</p>
              <div>{record.amount}</div>
            </div>
          </div>

          <div className="info-row" style={{border: 'none'}}>
            <div className="info-block">
              <p className="info-line">付款日期</p>
              <div className="info-line">预支付日期:{record.prePayTime}</div>
              <div className="info-line">实支付日期:{record.realPayTime}</div>
              <div className="info-line" style={{display: record.state === 'CANCELED' ? '' : 'none'}}>退回日期:{record.backTime}</div>
            </div>
            <div className="info-block">
              <p className="info-line">支付状态</p>
              <div className="info-line">状态:{this.calcState(record.state)}</div>
              <div className="info-line" style={{display: showRemarkMap[record.state] ? '' : 'none'}}>备注:{record.remark}</div>
            </div>
          </div>
        </div> :null}
          {this.state.detailCheck=='2'?
        <div  className="changeDetail">
          <div >{
            this.props.ChangeLog.map((v,i)=>
                <div key={i}  className="changeRow"> <span className="changeLeft" >变更时间:{v.operTime}</span>  <span className="changeRight">变更前的金额:{v.amount}</span></div>
            )
          }
              {/*<div className="changeRow"> <span className="changeLeft" >创建时间:{record.createdTime}</span>  <span className="changeRight">金额:{record.amount}</span></div>*/}
          </div>
        </div>:null}
      </Modal>
    );
  }
}
export default DetailDialog;