import React from 'react';
import { Modal, message } from 'antd';
import apiData from "../../../../../constants/apiData";
import './style.scss';

// 批量冻结/解冻组件。后面可以考虑优化为批量冻结和冻结共用
class BatchFreezeDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // 确认冻结
  frozenOk = () => {
    const { data, dataType } = this.props;
    let freeze = [];
    let unfreeze = [];
    let codes = [];
    data.forEach((item, index) => {
      if (item.freeze) {
        unfreeze.push(item);
      } else {
        freeze.push(item);
      }
      codes.push(item.code);
    });

    // 调用批量冻结解冻接口。暂时测试只处理第一条数据
    // let addr = freeze.length ? 'freeze' : 'unfreeze';
    // let code = freeze.length ? freeze[0].code : unfreeze[0].code;
    
    // todo 根据dataType选择调用的接口，dataType为fund时调用资金调拨的接口
    let addr = apiData.freezeMany;

    Util.comFetch({
      addr,
      codes
    }, res => {
      if (addr === 'unfreeze') {
        message.success('解冻成功');
      } else {
        message.success('冻结成功');
      }
      this.props.close(true);
    });
  }

  // 取消冻结
  frozenCancel = () => {
    this.props.close();
  }

  render() {
    const { data } = this.props;
    let freeze = [];
    let unfreeze = [];
    data.forEach((item, index) => {
      if (item.freeze) {
        unfreeze.push(
          <div key={index}>{item.code}</div>
        );
      } else {
        freeze.push(
          <div key={index}>{item.code}</div>
        );
      }
    });

    return (
      <Modal
        title={'批量解冻/冻结提醒'}
        visible={this.props.visible}
        onOk={this.frozenOk}
        onCancel={this.frozenCancel}
        maskClosable={false}
        className="frozen-box"
      >
        <div className="frozen-waring">你确定要
          <span style={{display: freeze.length?'':'none'}}>冻结</span>
          <div style={{marginLeft:'20px',display:freeze.length?'':'none'}}>{freeze}</div>
          <span style={{display: freeze.length && unfreeze.length?'':'none'}}>/</span>
          <span style={{display: unfreeze.length?'':'none'}}>解冻</span>
          <div style={{marginLeft:'20px',display:unfreeze.length?'':'none'}}>{unfreeze}</div>
          这些信息吗？
        </div>
      </Modal>
    );
  }
}

export default BatchFreezeDialog;
