import React from 'react';
import { Modal } from 'antd';

const showRemarkMap = {
  'FAILED': 1,
  'CANCELED': 1
};

// 详情弹框
class DetailDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullData: null
    };
  }

  componentWillMount() {
    const { detailData } = this.props;
    let sendParam = {
      addr: Api.getDetail,
      confirmId: detailData.id
    };
    Util.comFetch(sendParam, (re) => {
      // let rows = re.data.rows;
      // rows.forEach((item, index) => item.key = index);
      console.log('re', re);
      this.setState({
        fullData: re.data
      });
    });
  }

  handleOk = () => {
    this.props.chgVisible(false, 'detail');
  }

  handleCancel = () => {
    this.props.chgVisible(false, 'detail');
  }

  // calcState(text) {
  //   switch (text) {
  //     case 'UNPAID':
  //       return '待支付';
  //     case 'PROCESSED':
  //       return '处理中';
  //     case 'SUCCESSFUL':
  //       return '支付成功';
  //     case 'FAILED':
  //       return '支付失败';
  //     case 'CANCELED':
  //       return '已退回';
  //     default:
  //       return '';
  //   }
  // }

  render() {
    let record = Object.assign({}, this.state.fullData);
    if (!record.acAccount) {
      record.acAccount = {};
    }
    if (!record.myAccount) {
      record.myAccount = {};
    }


    return (
      <Modal
        title="详情"
        className="confirm-detail"
        width={720}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div className="all-info">

          <div className="info-row">
            <div className="info-block">
              <p className="info-line">订单信息</p>
              <div>会计服务订单号:{record.busCode}</div>
              <div>会计凭证号:{record.voucherCode}</div>
              <div>业务类型:{record.businessType}</div>
              <div>记账日期:{record.accountTime && record.accountTime.split(' ')[0]}</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-block">
              <p className="info-line">收款方信息</p>
              <div>银行账户名称:{record.acAccount.accountName}</div>
              <div>银行账号:{record.recieveNo}</div>
              <div>开户行名称:{record.recieveBankName}</div>
            </div>
            <div className="info-block">
              <p className="info-line">付款方信息</p>
              <div>银行账户名称:{record.paymentName}</div>
              <div>银行账号:{record.paymentNo}</div>
              <div>开户行名称:{record.myAccount.accountBankName}</div>
              {/*<div>往来对象:{record.acAccount.customerName}</div>*/}
            </div>
          </div>

          <div className="info-row">
            <div className="info-block">
              <p className="info-line">金额</p>
              <div>{record.amount}</div>
            </div>
            <div className="info-block">
              <p className="info-line">银行入账日期</p>
              <div>{record.tradeTime && record.tradeTime.split(' ')[0]}</div>
            </div>
          </div>

        </div>
      </Modal>
    );
  }
}

export default DetailDialog;