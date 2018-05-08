import React from 'react';
import { Form, Select, Radio, Input, Button, message } from 'antd';
import Org from "../../../common/Org/addOrg";
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';

// 新增保管信息表单第2-1步
class FormStep2_1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //开户人姓名
      accHolderName: "",
      //开户人电话
      accHolderTel: "",
      //开户人身份证
      accHolderCardId: "",
    };
  }

  componentDidMount() {
    const { isEdit, stepBack } = this.props;
    if (isEdit || stepBack) {
        this.getEditData();
    }
  }

  //获取编辑数据
  getEditData() {
    const { data } = this.props;
    // 如果是从上一步退回，isEdit也为true，用编辑过的数据，恢复之前编辑后的状态
    // debugger;
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
    //开户人,电话,身份证
    formData.accHolderName = remoteData.accHolderName;
    formData.accHolderTel = remoteData.accHolderTel;
    formData.accHolderCardId = remoteData.accHolderCardId;
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
          <span className="desc">开户人姓名:</span>
          <div className="form-item">
            <FormItem
              hasFeedback
            >
              {getFieldDecorator('accHolderName', {
                rules: [{
                  required: true, message: '请输入开户人姓名',
                },{
                  min:1,max:20,message:'输入字符长度有误!'
                }],
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
                <Input placeholder="请输入开户人姓名"/>
              )}
            </FormItem>
          </div>
        </div>
        <div className="row">
          <span className="desc">开户人电话:</span>
          <div className="form-item">
            <FormItem
              hasFeedback
            >
              {getFieldDecorator('accHolderTel', {
                rules: [{
                  required: true, message: '请输入开户人电话',
                },
                  {
                    pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
                    message: "输入的电话有误!"
                  }
                ],
                getValueFromEvent: (e) => {
                  let value = e.target.value;
                  if (value.length > 30)
                    value = value.substr(0, 30)
                  return value;
                },
              })(
                <Input placeholder="请输入开户人电话"/>
              )}
            </FormItem>
          </div>
        </div>
        <div className="row">
          <span className="desc">开户人身份证:</span>
          <div className="form-item">
            <FormItem
              hasFeedback
            >
              {getFieldDecorator('accHolderCardId', {
                rules: [{
                  required: true, message: '请输入开户人身份证',
                },
                  {
                    pattern:/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
                    message:"输入的身份证格式有误!"
                  }
                ],
                getValueFromEvent: (e) => {
                  let value = e.target.value;
                  if (value.length > 30)
                    value = value.substr(0, 30)
                  return value;
                },
              })(
                <Input placeholder="请输入开户人身份证"/>
              )}
            </FormItem>
          </div>
        </div>
        <div className="tac">
          <Button onClick={this.prev} type="primary" style={{marginRight: '10px'}}>上一步</Button>
          <Button onClick={this.next} type="primary">下一步</Button>
        </div>
      </Form>
    );
  }
}

FormStep2_1 = Form.create()(FormStep2_1);
export default FormStep2_1;
