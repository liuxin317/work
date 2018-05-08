import React from 'react';
import { Modal, Button, Select, Input, message } from 'antd';
import PicThumb from './PicThumb';
import TreeDroplist from '../../../common/TreeDroplist';

const Option = Select.Option;

// 确认弹框，收款、付款页面共用
class ConfirmDialog extends React.Component {
  constructor(props) {
    super(props);

    let picPrefix = '';
    if (window.location.href.indexOf('localhost') > -1) {
      picPrefix = 'http://csza.chfcloud.com/imgservice/download/';
    } else {
      picPrefix = window.location.protocol + '//' + window.location.host + '/imgservice/download/';
    }

    this.state = {
      // 业务类型数据
      treeData: [],
      // 业务类型
      bussType: [],
      // 图片访问地址前缀
      picPrefix: picPrefix,
      // 说明
      remark: '',
    };
  }

  componentWillMount() {
    this.getBussType();
  }

  // 获取业务类型
  getBussType() {
    Util.comFetch({addr: Api.getOrderType}, (re) => {
      let treeData = Util.formatBusTypeData(re.list);
      console.log('ywlx tree', re, treeData);
      this.setState({treeData: treeData});
    });
  }

  // 取消
  handleCancel = () => {
    this.props.chgVisible(false, 'confirm');
  }

  // 打开单据扫描
  billScan = () => {
    this.props.showBillScan();
  }

  // 业务类型改变
  bussChg = (list) => {
    console.log('ywlx sel', list);
    this.setState({bussType: list});
  }

  //
  remarkChg = (e) => {
    this.setState({remark: e.target.value});
  }

  // 检查表单输入
  chkInput() {
    const { remark, bussType } = this.state;
    const { bills } = this.props;
    if (bussType.length === 0) {
      this.warning('请选择业务类型!');
      return false;
    }
    if (remark.trim() === '') {
      this.warning('说明不能为空!');
      return false;
    }
    // 暂时允许不上传单据
    // if (bills.length === 0) {
    //   this.warning('请上传单据!');
    //   return false;
    // }
    return true;
  }

  // 保存时输入不正确提示
  warning(text) {
    Modal.warning({
      title: '提示',
      content: text,
      zIndex: 10000
    });
  }

  // 在租户云单-创建订单
  createOrder = () => {
    let chkpass = this.chkInput();
    if (!chkpass) {
      return ;
    }
    const state = this.state;
    const curData = this.props.curData || {};
    let orderData = {
        bussTypeCode: state.bussType[0].value,
        orgReleation: '',
        picIds: this.props.bills.map((item) => { return item.picId; }),
        remark: state.remark.trim(),
        source: '7',
        urgent: '0',
        tenantId: window.userInfo.tenantId,
        companyId: window.userInfo.companyId,
        userId: window.userInfo.userId,
      };
    let payData = {
      accountNumber: curData.myAccountNo || '',
      accountName: curData.myAccountName || '',
      amount: curData.amount || '',
      currencyName: curData.currency || '',
      customerAccountNumber: curData.currentAccountNo || '',
      customerName: curData.currentAccountName || '',
      payWay: curData.payWay || '',
      payDate: curData.tradeTime.split(' ')[0] || '',
    };
    // 如果是收款确认，交换收付款方的账户名和账号
    if (this.props.income) {
      let tmp;
      tmp = payData.accountNumber;
      payData.accountNumber = payData.customerAccountNumber;
      payData.customerAccountNumber = tmp;
      tmp = payData.accountName;
      payData.accountName = payData.customerName;
      payData.customerName = tmp;
    }
    let sendParam = {
      addr: Api.addBussOrder,
      orderData: JSON.stringify(orderData),
      payData: JSON.stringify(payData),
    };
    console.log('sendParam', sendParam);
    Util.comFetch(sendParam, (re) => {
      console.log('保存收款确认', re);
      this.saveOrderCode(re.bussOrderCode);
    });
  }

  // 保存创建的租户云单的订单号
  saveOrderCode(code) {
    const curData = this.props.curData || {};
    Util.comFetch({
      addr: Api.saveOrderCode,
      confirmId: curData.id,
      busCode: code,
      stateName: '草稿',
    }, (re) => {
      this.props.confirmed();
    });
  }


  render() {
    const {
      treeData,
      picPrefix,
      remark,
    } = this.state;
    const { bills } = this.props;

    return (
      <Modal
        title={'确认'}
        footer={[
          <Button key="cancel" onClick={this.handleCancel}>取消</Button>,
          <Button key="create" onClick={this.createOrder} type="primary">创建会计订单</Button>
        ]}
        onCancel={this.handleCancel}
        className="payment-confirm-dialog"
        visible={this.props.visible} >
        <div className="row">
          <span className="desc">业务类型 :&nbsp;</span>
          <div className="row-item">
            <TreeDroplist onChg={this.bussChg} data={treeData}></TreeDroplist>
          </div>
        </div>

        <div className="row">
          <span className="desc">说明 :&nbsp;</span>
          <div className="row-item">
            <Input onChange={this.remarkChg} value={remark} type="text"/>
          </div>
        </div>

        <div className="row bills">
          <span className="desc">单据扫描 :&nbsp;</span>
          <div className="row-item">
            {
              bills.map((item, index) => {
                return (
                  <PicThumb
                    key={index}
                    index={index}
                    delBill={this.props.delBill}
                    picUrl={picPrefix + item.originalUrl}></PicThumb>
                );
              })
            }
            <span className="pic-add" onClick={this.billScan}>+</span>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ConfirmDialog;
