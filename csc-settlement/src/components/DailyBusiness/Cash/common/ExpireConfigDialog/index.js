import React from 'react';
import { Modal, Input, message } from 'antd';

export default class ExpireConfigDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      val: ''
    };
  }

  componentWillMount() {
    Util.comFetch({
      addr: Api.getExpireDays,
    }, (re) => {
      this.setState({val: re.expireDays + ''});
      console.log('查看逾期配置的时间:', re);
    })
  }

  // 确认
  ok = () => {
    let val = this.state.val;

    if (val.replace(/[^\d]/g, '') !== val) {
      Modal.warning({title: '提示', content: '请输入大于0的整数'});
      return ;
    }
    val = val.replace(/[^\d]/g, '');
    val = parseInt(val);
    if (val > 0) {
      console.log('设置逾期时间: ', val);
      Util.comFetch({
        addr: Api.savaExpireDays,
        expireDays: val,
      }, (re) => {
        message.success('设置成功');
        this.cancel();
      });
    } else {
      Modal.warning({title: '提示', content: '请输入大于0的整数'});
    }
  }

  // 取消
  cancel = () => {
    this.props.expire(false);
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
        <div style={{padding: '20px 0'}}>
          银行交易后
          <Input value={val} onChange={this.onChg} style={{ width: '50px' }}/>
          日
        </div>
      </Modal>
    );
  }
}
