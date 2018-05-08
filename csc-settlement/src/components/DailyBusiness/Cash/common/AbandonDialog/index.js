import React from 'react';
import { Modal, Input, message } from 'antd';

// 结算单废弃弹框
class AbandonDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 废弃理由
      val: '',
    };
  }

  // 确认
  ok = () => {
    let codes = this.props.codes;
    let val = this.state.val;
    if (val.length) {
      Util.comFetch({
        addr: Api.invalidOne,
        code: codes,
        remark: val,
      }, (re) => {
        message.success('订单作废成功');
        this.cancel();
      });
    } else {
      Modal.warning({title: '提示', content: '请输入作废原因'});
    }
  }

  // 取消
  cancel = () => {
    this.props.abandon(false);
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

export default AbandonDialog;
