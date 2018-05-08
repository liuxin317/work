import React from 'react';
import { Modal, Button, message } from 'antd';
import FormStep1 from './FormStep1';
import FormStep2_1 from './FormStep2_1';
import FormStep2_2 from './FormStep2_2';
import FormStep2_3 from './FormStep2_3';
import FormStep3 from './FormStep3';
import './style.scss';

// 新增/编辑保管信息弹框
class AddModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 是否新增
      isEdit: false,
      // 步骤序号
      step: 0,
      // 子步骤序号
      subStep: 0,
      // 各步骤表单数据
      formDatas: [],
      // 当前form是否是从上一步退回的，点上一步时设为true，点下一步时设为false
      stepBack: false,
    };
  }

  componentWillMount(){
    this.setState({
      'isEdit': window.location.href.indexOf('id') !== -1
    });
  }

  // 取消编辑，回到列表页面
  cancel = () => {
    const props = this.props;
    props.history.replace(props.match.path.split('/add')[0]);
  }

  // 获取当前显示的form
  getCurForm() {
    const { isEdit, step, subStep, formDatas, stepBack } = this.state;
    let data;
    if (step === 0) {
      data = formDatas[step];
      return (<FormStep1 data={data} stepBack={stepBack} prev={this.prev} next={this.next} isEdit={isEdit}></FormStep1>);
    } else if (step === 1) {
      if (subStep === 0) {
        data = formDatas[step];
        return (<FormStep2_1 data={data} stepBack={stepBack} prev={this.prev} next={this.next} isEdit={isEdit}></FormStep2_1>);
      } else if (subStep === 1) {
        data = formDatas[step + subStep];
        return (<FormStep2_2 data={data} stepBack={stepBack} prev={this.prev} next={this.next} isEdit={isEdit}></FormStep2_2>);
      } else {
        data = formDatas[step + subStep];
        return (<FormStep2_3 data={data} stepBack={stepBack} prev={this.prev} next={this.next} isEdit={isEdit}></FormStep2_3>);
      }
    } else {
      data = null;
      return (<FormStep3 data={data} prev={this.prev} next={this.next} isEdit={isEdit}></FormStep3>);
    }
  }

  // 上一个表单
  prev = () => {
    const { step, subStep, formDatas } = this.state;
    let nextStep = step, nextSubStep = subStep;
    if (step === 2) {
      nextStep -= 1;
      nextSubStep = 2;
    } else if (step === 1) {
      if (subStep > 0) {
        nextSubStep -= 1;
      } else {
        nextStep -= 1;
      }
    }
    let sliceEnd = nextStep + nextSubStep + 1;
    let datas = formDatas.slice(0, sliceEnd);
    this.setState({
      formDatas: datas,
      step: nextStep,
      subStep: nextSubStep,
      stepBack: true,
    });
  }

  // 下一个表单
  next = (data) => {
    const { step, subStep, formDatas } = this.state;
    let datas = formDatas.slice();
    datas.splice(step + subStep, 1, data);
    this.setState({formDatas: datas});
    let nextStep = step, nextSubStep = subStep;
    if (step === 0) {
      nextStep += 1;
      nextSubStep = 0;
    } else if (step === 1) {
      if (subStep === 2) {
        nextStep += 1;
        nextSubStep = 0;
      } else {
        nextSubStep += 1;
      }
    } else {
      // 提交表单
      let dataList = formDatas.slice();
      dataList.push(data);
      this.postData(dataList);
      return;
    }
    this.setState({
      step: nextStep,
      subStep: nextSubStep,
      stepBack: false,
    });
  }

  // 发送数据
  postData(dataList) {
    let sendParam = {};
    let data = {};
    
    // step1
    data.orgCode = dataList[0].treeValue;
    data.pBankCategoryCode = dataList[0].bank
    data.pAccountNumber = dataList[0].subBank;
    data.ebankOpen = dataList[0].ebankOpen;
    data.b2eOpen = dataList[0].b2eOpen;
    data.b2eOpenTime = dataList[0].b2eOpenTime || '';
    data.ebankOpenTime = dataList[0].ebankOpenTime || '';
    //step2-1
    data.accHolderName = dataList[1].accHolderName;
    data.accHolderTel = dataList[1].accHolderTel;
    data.accHolderCardId = dataList[1].accHolderCardId;
    //step2-2
    data.legalPersonName = dataList[2].legalPersonName;
    data.legalPersonTel = dataList[2].legalPersonTel;
    data.legalPersonCardNo = dataList[2].legalPersonCardNo;
    data.legalPersonSeal = dataList[2].legalPersonSeal;
    //step2-3
    data.cashierName = dataList[3].cashierName;
    data.cashierTel = dataList[3].cashierTel;
    data.cashierCardNo = dataList[3].cashierCardNo;
    data.cashierSeal = dataList[3].cashierSeal;
    //step3
    data.keyCustodian = dataList[4].keyCustodian;
    data.passwordCustodian = dataList[4].passwordCustodian;
    // 新增，编辑调用不同接口
    if (this.state.isEdit) {
      data.custodyId = Util.getQueryString('id')
      sendParam.addr = Api.updateCustody;
    }
    else {
      sendParam.addr = Api.addCustodyInfo;
    }
    sendParam.data = JSON.stringify(data);
    Util.comFetch(sendParam, (data) => {
      message.success(this.state.isEdit ? '修改成功' : '保存成功');
      // this.props.history.goBack();
      this.props.history.replace(this.props.match.path.split('/add')[0] + '?addback=' + new Date().getTime());
    });
  }

  render() {
    const { isEdit, step, subStep } = this.state;
    let title = isEdit ? '编辑' : '新增';

    const curForm = this.getCurForm();

    return (
      <Modal
        className="add-keep-info"
        onCancel={this.cancel}
        maskClosable={false}
        visible={true}
        width={680}
        footer={null}
        title={title}>
        <div className="steps">
          <div className={"step"+(step===0?' cur':' pass')}>账户信息</div>
          <span className="step-arrow"></span>
          <div className={"step"+(step===1?' cur':step>1?' pass':'')}>个人信息</div>
          <span className="step-arrow"></span>
          <div className={"step"+(step===2?' cur':'')}>秘钥保管</div>
        </div>
        <div className={"sub-steps"+(step===1?'':' hide')}>
          <div className={"sub-step"+(subStep===0?' cur':'')}>开户人信息<span className='arr-r'></span></div>
          <div className={"sub-step"+(subStep===1?' cur':'')}>法人信息<span className='arr-r'></span></div>
          <div className={"sub-step"+(subStep===2?' cur':'')}>出纳信息<span className='arr-r'></span></div>
        </div>
        {curForm}
      </Modal>
    );
  }
}

export default AddModal;
