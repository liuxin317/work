import React from 'react';
import { Form, Select, Radio, Input, Button, message } from 'antd';
import Org from "../../../common/Org/addOrg";
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';

// 新增保管信息表单第3步
class FormStep3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //密钥保管人
      keyCustodian: "",
      //密码保管人
      passwordCustodian: "",
    };
  }

  componentDidMount() {
    const { isEdit } = this.props;
    if (isEdit) {
      this.getEditData();
    }
  }

  //获取编辑数据
  getEditData() {
    const { data } = this.props;
    // 如果是从上一步退回，isEdit也为true，用编辑过的数据，恢复之前编辑后的状态
    if (data) {
      this.setEditStatus(data);
      return ;
    }

    Util.comFetch(
      {
        addr: Api.findCustodyById,
        custodyId: Util.getQueryString('id')
      },
      (data) => {
        this.setEditStatus(data.data);
      }
    );
  }

  /**
   * 设置、恢复(点上一步时)编辑状态
   * @param remoteData 远程数据、之前编辑好的数据
   */
  setEditStatus(remoteData) {
    this.setState({
      remoteData:remoteData
    });
    let formData = {};
    //密钥保管
    formData.keyCustodian= remoteData.keyCustodian;
    formData.passwordCustodian= remoteData.passwordCustodian;
    this.props.form.setFieldsValue(formData);
  }

  // 上一步
  prev = () => {
    this.props.prev();
  }

  // 下一步
  next = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log('values', values);
        this.props.next(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <div className="row">
          <span className="desc">U盾/数字密钥保管人:</span>
          <div className="form-item">
            <FormItem
              hasFeedback
            >
              {getFieldDecorator('keyCustodian', {
                rules: [{
                  required: true, message: '请输入出纳姓名',
                },{min:1,max:20,message:'输入字符长度有误!'}],
                getValueFromEvent: (e) => {
                  let s = e.target.value;
                  s = s.replace(/(^\s+)|(\s+$)/g, "");
                  let pattern = new RegExp("[	˜%+》《`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
                  var value = "";
                  for (var i = 0; i < s.length; i++) {
                    value = value+s.substr(i, 1).replace(pattern, '');
                  }
                  return value;
                },
              })(
                <Input placeholder="请输入U盾/数字密钥保管人"/>
              )}
            </FormItem>
          </div>
        </div>
        <div className="row">
          <span className="desc">密码保管人:</span>
          <div className="form-item">
            <FormItem
              hasFeedback
            >
              {getFieldDecorator('passwordCustodian', {
                rules: [{
                  required: true, message: '请输入出纳姓名',
                },{min:1,max:20,message:'输入字符长度有误!'}],
                getValueFromEvent: (e) => {
                  let s = e.target.value;
                  s = s.replace(/(^\s+)|(\s+$)/g, "");
                  let pattern = new RegExp("[	˜%+》《`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
                  var value = "";
                  for (var i = 0; i < s.length; i++) {
                    value = value+s.substr(i, 1).replace(pattern, '');
                  }
                  return value;
                },
              })(
                <Input placeholder="请输入密码保管人"/>
              )}
            </FormItem>
          </div>
        </div>

        <div className="tac">
          <Button onClick={this.prev} type="primary" style={{marginRight: '10px'}}>上一步</Button>
          <Button onClick={this.next} type="primary">确定</Button>
        </div>
      </Form>
    );
  }
}

FormStep3 = Form.create()(FormStep3);
export default FormStep3;
