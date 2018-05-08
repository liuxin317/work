import React from 'react';
import { Modal, Input, message } from 'antd';

// 结算输入理由，退回重审弹框
class ReturnDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 理由
      val: '',
    };
  }

  // 确认
  ok = () => {
    const { orderData } = this.props;
    let code = orderData ? orderData.code || orderData.orderCode : '';
    let val = this.state.val;
    if (val.length) {
      let sendParam = {
        addr: Api.cancelWaitcheck,
        code: code,
        remark: val,
      };
      if (this.props.source === 'fund') {
        sendParam.addr = Api.returnCheck;
        sendParam.state = 0;
        sendParam.fundtransferId = orderData.id;
      }
      Util.comFetch(sendParam, (re) => {
        message.success('订单退回成功');
        // 退回成功后，调用cancel方法关闭弹框
        this.cancel(true);
      });
    } else {
      Modal.warning({title: '提示', content: '请输入退回原因'});
    }
  }

  // 取消
  cancel = (refresh) => {
    if (typeof refresh === 'boolean') {
      this.props.return(false, refresh);
    } else {
      this.props.return(false);
    }
  }

  // 输入框内容改变
  onChg = (e) => {
    this.setState({val: e.target.value});
  }

  render() {
    const { val } = this.state;

    return (
      <Modal
        onOk={this.ok}
        onCancel={this.cancel}
        visible={true}>
        <div className="abandon-order" style={{padding: '20px 0'}}>
          原因：
          <Input value={val} onChange={this.onChg} style={{ width: '410px' }}/>
        </div>
      </Modal>
    );
  }
}

export default ReturnDialog;
