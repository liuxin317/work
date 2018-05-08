import React, { Component } from  'react';
import moment from 'moment';
import { Form, Icon, Input, Button, Radio, DatePicker, message } from 'antd';

const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;

class ModalForm extends Component {

  state = {
    formData: {
      borrowLend: '',
      tradeNumber: '',
      amount: '',
      occerTime: '',
      useScope: ''
    }
  }

  getFormData = (key, value) => {
    const { formType, accountId, accountNumber, getData } = this.props;
    const { formData } = this.state;

    // formType表格弹窗类型：1录入 2编辑
    if (formType === 2) {
      for (let key in this.props) {
        if (key === 'borrowLend') { // 后台返回number，转化成string处理
          formData['borrowLend'] = this.props['borrowLend'] + '';
        } else {
          formData[key] = this.props[key]; // 编辑时候添加默认值
        }
      }
    }

    formData[key] = value;
    formData['accountId'] = accountId;
    formData['accountNumber'] = accountNumber;

    getData(formData);
    this.setState({ formData });
  }

  getDefaultValue = (value) => {
    // formType表格弹窗类型：1录入 2编辑
    const { formType } = this.props;

    switch (formType) {
      case 1:
        return null
      case 2:
        return value;
    }
  }
  
  componentDidMount () {
    // console.log(this.props.formData)
  }

  render () {
    const { formType, accountName, accountNumber, borrowLend, tradeNumber, occerTime, amount, useScope } = this.props;
    const { formData } = this.state;

    return (
      <div className="form-modal">
        <div className="form-modal-row">
          <div className="form-modal-row__label">银行账户名称：</div>
          <div className="form-modal-row__col">{ accountName }</div>
        </div>
        <div className="form-modal-row">
          <div className="form-modal-row__label">银行开户账号：</div>
          <div className="form-modal-row__col">{ accountNumber }</div>
        </div>
        <div className="form-modal-row">
          <div className="form-modal-row__label required">借/贷：</div>
          <div className="form-modal-row__col">
            <RadioGroup defaultValue={this.getDefaultValue(borrowLend) + ''}
              onChange={(e) => this.getFormData('borrowLend', e.target.value)}
            >
              <Radio value="0">借</Radio>
              <Radio value="1">贷</Radio>
            </RadioGroup>
          </div>
        </div>
        <div className="form-modal-row">
          <div className="form-modal-row__label">交易序号：</div>
          <div className="form-modal-row__col">
            <Input defaultValue={this.getDefaultValue(tradeNumber)}
              onBlur={(e) => this.getFormData('tradeNumber', e.target.value)} 
            />
          </div>
        </div>
        <div className="form-modal-row">
          <div className="form-modal-row__label required">发生日期：</div>
          <div className="form-modal-row__col">
            <DatePicker allowClear={false}
              disabled={formType === 2 ? true : false}
              defaultValue={formType === 2 ? moment(this.getDefaultValue(occerTime)) : null}
              onChange={(date, dateString) => this.getFormData('occerTime', dateString)}
            />
          </div>
        </div>
        <div className="form-modal-row">
          <div className="form-modal-row__label required">发生金额：</div>
          <div className="form-modal-row__col">
            <Input type="text" defaultValue={this.getDefaultValue(amount)}
              onBlur={(e) => this.getFormData('amount', e.target.value)}
            />
          </div>
        </div>
        <div className="form-modal-row">
          <div className="form-modal-row__label required">用途：</div>
          <div className="form-modal-row__col">
            <Input defaultValue={this.getDefaultValue(useScope)} 
              onBlur={(e) => this.getFormData('useScope', e.target.value)} 
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ModalForm;
