import React from 'react';
import { Button, message, Modal, Input } from 'antd';

class BatchRelevance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      busCode: ''
    };
  }

  ok = () => {
    if (this.state.busCode !== "") {
      Util.comFetch({
        addr: Api.saveOrderCode,
        confirmIds: this.props.ids.join(','),
        busCode: this.state.busCode,
        operType: "1",
      }, (re) => {
        this.props.close(true);
      });
    } else {
      message.info("请输入业务订单号")
    }
  }

  cancel = () => {
    this.setState({ busCode: '' });
    this.props.close();
  }

  inputChg = (e) => {
    this.setState({ busCode: e.target.value })
  }

  render() {
    return (
      <Modal
        title={'关联'}
        wrapClassName="relevance"
        style={{ top: 100, left: 80 }}
        width={"350px"}
        footer={null}
        cancelText="确定"
        visible={true}
        maskClosable={false}
        onCancel={this.cancel}
      >
        <div>业务订单号:
          <Input
            value={this.state.busCode}
            onChange={this.inputChg}
            placehoder="请输入关联账号"
            style={{ width: "200px" }}/>
        </div>
        <div style={{ margin: "auto", marginTop: "20px", textAlign: 'right' }}>
          <Button onClick={this.cancel} style={{ marginRight: "8px" }}>取消</Button>
          <Button onClick={this.ok} type="primary">确认</Button>
        </div>
      </Modal>
    );
  }
}

export default BatchRelevance;