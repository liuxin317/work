import React from 'react';
import { Modal ,Radio,message} from 'antd';
const RadioGroup = Radio.Group;

// 退回弹框
class SendBAckDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textVal: '',
      SendBackPerson:'0'
    };
  }

  componentWillUpdate(nextProps) {
    if (this.props.visible && !nextProps.visible) {
      this.setState({textVal: ''});
    }
  }
  txtChg = (e) => {
      let   txtV=e.target.value;
            txtV = txtV.replace(/(^\s+)|(\s+$)/g, "");
      let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
      let specialStr = "";
      for(var i = 0; i < txtV.length;  i++)
      {
          specialStr = specialStr+txtV.substr(i, 1).replace(pattern, '');
      }
      this.setState({textVal: specialStr});
  }

  handleOk = () => {
    if(this.state.textVal==""){
      message.error("请填写退回原因!")
    }else{
        this.props.ok(this.state.textVal,this.state.SendBackPerson);
    }
  }
  handleCancel = () => {
    this.props.chgVisible(false, 'back');
  };

  render() {
    return (
      <Modal
        title="退回"
        className="settle-order-dialog"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div className="row">
          <div   style={{  marginLeft:"61px",marginBottom:"20px"}}>
            <RadioGroup value={this.state.SendBackPerson}  onChange={(e)=>this.setState({SendBackPerson:e.target.value})} >
              <Radio value="0">退回扫单人</Radio>
              <Radio value="1">退回客服</Radio>
            </RadioGroup>
          </div>
          <p className="desc">原因 :&nbsp;</p>
          <div className="row-item">
            <textarea  maxLength="200" value={this.state.textVal} onChange={this.txtChg} style={{width: '250px', resize: 'none'}}></textarea>
          </div>
        </div>
      </Modal>
    );
  }
}

export default SendBAckDialog;
