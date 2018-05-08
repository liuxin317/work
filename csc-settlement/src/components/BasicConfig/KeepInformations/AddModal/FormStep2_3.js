import React from 'react';
import { Form, Select, Radio, Input, Button, message, Upload, Icon } from 'antd';
import Org from "../../../common/Org/addOrg";
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';

// 新增保管信息表单第2-3步
class FormStep2_3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //出纳姓名
      cashierName: "",
      //出纳电话
      cashierTel: "",
      //出纳身份证
      cashierCardNo: "",
      //出纳预留印章
      cashierSeal: "",

      //出纳图片
      uploadNameCashier:'',
      uploadUrlCashier:'',
      // 出纳图片本地预览地址
      uploadUrlCashierPreview:'',
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
      remoteData:remoteData,
      uploadUrlCashier:remoteData.cashierSeal,
      uploadUrlCashierPreview:remoteData.cashierSeal,
    });
    let formData = {};
    //出纳姓名,电话,身份证,预留印章
    formData.cashierName = remoteData.cashierName;
    formData.cashierTel = remoteData.cashierTel;
    formData.cashierCardNo = remoteData.cashierCardNo;
    this.props.form.setFieldsValue(formData);
  }

  //上传检查
  chkImg = () => {
    if (this.state.uploadUrlLegal == '') {
      message.error("请上传出纳印章");
      return false;
    }
    return true;
  }

  // 上一步
  prev = () => {
    this.props.prev();
  }

  // 下一步
  next = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        let chkpass = this.chkImg();
        if (!chkpass) {
          return;
        }
        let curFormData = Object.assign({}, values);
        if(this.props.isEdit){
          curFormData.cashierSeal =this.state.uploadUrlCashier;
        }else{
          // curFormData.cashierSeal = AppConf.uploadFilePathIp + '/imgservice/download/' + this.state.uploadUrlCashier;
          curFormData.cashierSeal = this.state.uploadUrlCashier;
        }
        this.props.next(curFormData);
      }
    });
  }

  //上传出纳印章
  handleChangeOutNa = (info) => {
    console.log("info",info);
    if (info.file.status === 'done') {
      let  val=info.file.response.rspCode;
      if ( val !== '000000') {
        console.log("信息2" , val);
        this.setState({"uploadNameCashier":""});
        message.error('上传文件失败,请重新选择文件');
      } else {
        this.setState({
          uploadUrlCashier: AppConf.uploadFilePathIp + '/imgservice/download/'+ info.file.response.url,
          cashierSeal: AppConf.uploadFilePathIp + '/imgservice/download/'+ info.file.response.url,
          uploadUrlCashierPreview :AppConf.uploadFilePathIp + '/imgservice/download/'+ info.file.response.url,
          uploadNameCashier:info.file.name});
      }
      // this.getBase64(info.file.originFileObj, imageUrl => this.setState({ uploadUrlCashierBase64:imageUrl }));
    }
  }

  render() {
    const { uploadUrlCashier, uploadUrlCashierPreview } = this.state;
    const { getFieldDecorator } = this.props.form;
    const upLoadM = {
      name: 'img1',
      action: window.AppConf.imageApiPath,
      headers: {},
      data: {
        token: window.userInfo.token,
        addr: 'uploadFile',
        fileType: 1
      },
    };

    return (
      <Form>
        <div className="row">
          <span className="desc">出纳姓名:</span>
          <div className="form-item">
            <FormItem
              hasFeedback
            >
              {getFieldDecorator('cashierName', {
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
                <Input placeholder="请输入出纳姓名"/>
              )}
            </FormItem>
          </div>
        </div>
        <div className="row">
          <span className="desc">出纳电话:</span>
          <div className="form-item">
            <FormItem
              hasFeedback
            >
              {getFieldDecorator('cashierTel', {
                rules: [{
                  required: true, message: '请输入出纳电话',
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
                <Input placeholder="请输入出纳电话"/>
              )}
            </FormItem>
          </div>
        </div>
        <div className="row">
          <span className="desc">出纳身份证:</span>
          <div className="form-item">
            <FormItem
              hasFeedback
            >
              {getFieldDecorator('cashierCardNo', {
                rules: [{
                  required: true, message: '请输入出纳身份证',
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
                <Input placeholder="请输入出纳身份证"/>
              )}
            </FormItem>
          </div>
        </div>
        <div className="row">
          <span className="desc">出纳预留印章:</span>
          <Upload
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChangeOutNa}
            {...upLoadM}
          >
            {
              uploadUrlCashier ?
                <img src={uploadUrlCashierPreview} alt="" className="avatar" /> :
                <Icon type="plus" className="avatar-uploader-trigger" />
            }
          </Upload>
        </div>

        <div className="tac">
          <Button onClick={this.prev} type="primary" style={{ marginRight: '10px' }}>上一步</Button>
          <Button onClick={this.next} type="primary">下一步</Button>
        </div>
      </Form>
    );
  }
}

FormStep2_3 = Form.create()(FormStep2_3);
export default FormStep2_3;
