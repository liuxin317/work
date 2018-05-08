import React from 'react';
import {Button, Input, Select, Form, Cascader, message,Radio} from 'antd';
import './style.scss';
import BIN from 'bankcardinfo';
import {BankArray, BankData} from '../../../../constants/bankData.js';
import cascaderOption from '../../../../constants/cascader-address-options';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

//添加交易对象
class AddNewTradeAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            userType: '',
            userTypeArray: [],
            userName: '',
            bankUserName: '',
            bankCode: '',
            bankType: '',
            bankTypeArray: BankArray,
            provinceCity: ['510000', '510700'],
            incomeType:"1",
        };
    }
    postData = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, formData) => {
            if (!err) {
                console.log("formData", formData);
                let postData = {};
                let data = {};
                //对象类型
                this.state.userTypeArray.some((item) => {
                    if (item.key === formData.userType) {
                        data.typeName = item.value;
                        data.typeCode = item.key;
                        return true;
                    }
                });
                //收支对象类型
                data.accountType=this.state.incomeType;
                //身份证或者营业执照
                data.cardNo=formData.cardNo;
                //客户名称
                data.customerName = formData.userName;
                //银行开户姓名
                data.accountName = formData.bankUserName;
                // if(formData.userName!==formData.bankUserName){
                //     message.error("收支对象名称与银行开户名称不一致!");
                //     return  false
                // };
                //银行账号
                data.accountNumber = formData.bankCode;
                //开户行别
                data.bankCategoryCode = formData.bankType;
                //开户行
                data.bankCategoryName = BankData[formData.bankType];
                //开户行省市获取
                data.province = formData.provinceCity[0];
                data.city = formData.provinceCity[1];
                //开户行名称
                data.accountBankName = formData.bankName;
                if (this.state.isEdit) {
                    //修改
                    data.accountId = Util.getQueryString('id');
                    postData.addr = Api.updateACAccount;
                }
                else {
                    //增加
                    postData.addr = Api.addACAccount;
                }
                //DATA
                postData.data = JSON.stringify(data);
                //addr
                //提交数据
                Util.comFetch(postData, (data) => {
                    message.success(this.state.isEdit ? '修改成功' : '保存成功');
                    this.props.history.goBack();
                });
            }
        });
    };

    //修改获取用户信息
    getEditData() {
        Util.comFetch(
            {
                addr: Api.getACAccountByAccountId,
                accountId: Util.getQueryString('id')
            },
            (data) => {
                let remoteData = data.data.rows[0];
                let formData = {};
                console.log('往来账户,修改账户获取到的信息:', remoteData);
                //收支对象类型
                this.setState({
                    incomeType:remoteData.accountType+""
                });
                //身份证或者营业执照
                formData.cardNo=remoteData.cardNo;
                formData.userName = remoteData.customerName;
                formData.bankUserName = remoteData.accountName;
                formData.bankCode = remoteData.accountNumber;
                //Select 赋值
                formData.userType = remoteData.typeCode;
                formData.bankType = remoteData.bankCategoryCode;
                //开户行省市赋值
                formData.provinceCity = [remoteData.province, remoteData.city];
                //开户行名称
                formData.bankName = remoteData.accountBankName;
                this.props.form.setFieldsValue(formData);
            }
        );
    }
    componentWillMount() {
        if (window.location.href.indexOf('id') != -1) {
            this.setState({'isEdit': true});
        }
    }
    componentDidMount() {
        this.getDropDownData();
        if (this.state.isEdit) {
            this.getEditData();
        }
    }

    getDropDownData() {
        //获取对象类型,
        let apiArrayDrop = [];
        apiArrayDrop.push({api: "objectType", target: 'userTypeArray', valKey: 'userType'});

        for (let i = 0; i < apiArrayDrop.length; i++) {
            Util.comFetch({
                addr: Api.getDropdownList,
                dictType: apiArrayDrop[i].api
            }, (data) => {
                let resultList = Util.getDropDownListUtil(data.data.rows);
                console.log("对象类型", resultList);
                this.setState({
                    [apiArrayDrop[i].target]: resultList,
                    //form 表单交给ANTD 处理之后,赋默认值Select key 不能给 value
                    [apiArrayDrop[i].valKey]: resultList.length > 0 ? resultList[0].key : ''
                })
            });
        }
    }

    //输入银行卡之后的回调
    cardInputChange = (value) => {
        let self = this;
        console.log('输入的银行卡数据:' + value);
        if (value.length < 15)
            return;
        console.log('开始调用API');
        BIN.getBankBin(value)
            .then(function (data) {
                console.log('识别银行卡返回的数据:', data);
                self.setState({'bankType': data.bankCode});
            })
            .catch(function (err) {
                console.log('识别银行卡卡号错误:', err);
            })
    };

    incomeType = (e) => {
        console.log("incomeType",e.target.value)
        this.setState({
            incomeType: e.target.value
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form>
                <div className="add-trade-account">
                    <div className="row"  >
                        <div>
                            <span className="desc">收支对象类型:</span>
                            <RadioGroup style={{marginLeft: "20px"}} value={this.state.incomeType}
                                        onChange={this.incomeType}>
                                <Radio value="1">个人</Radio>
                                <Radio value="2">企业</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <div className="row">
                        <span className="desc">收支对象名称:</span>
                        <div className="form-item">
                            <FormItem
                                hasFeedback
                            >
                                {getFieldDecorator('userName', {
                                    rules: [{
                                        required: true, message: '请输入对象名称',
                                    }],
                                    getValueFromEvent: (e) => {
                                        let value = e.target.value;
                                        value=value.replace(/(^\s+)|(\s+$)/g, "");
                                        if (value.length > 30)
                                            value = value.substr(0, 30)
                                        return value;
                                    },
                                })(
                                    <Input placeholder="请输入对象名称"/>
                                )}
                            </FormItem>
                        </div>
                    </div>


                    <div className="row">
                        <span  className="desc">{this.state.incomeType=="1"?"身份证:":"营业执照:"}</span>
                        <div className="form-item">
                            <FormItem
                                hasFeedback
                            >
                                {getFieldDecorator('cardNo', {
                                    rules: [{
                                        required: true, message:'请输入身份证/营业执照',
                                    }, {
                                        min: 11, max: 23, message: '身份证/营业执照位数不正确'
                                    }],
                                    getValueFromEvent: (e) => {
                                        let value = e.target.value;
                                        value=value.replace(/[^\w\.\/]/ig,'');
                                        if (value.length > 30)
                                            value = value.substr(0, 30)
                                        return value;
                                    },
                                })(
                                    <Input    placeholder={this.state.incomeType=="1"?"请输入身份证":"请输入营业执照"}/>
                                )}
                            </FormItem>
                        </div>
                    </div>
                    <div className="row">
                        <span className="desc">银行开户名称:</span>
                        <div className="form-item">
                            <FormItem
                                hasFeedback
                            >
                                {getFieldDecorator('bankUserName', {
                                    rules: [{
                                        required: true, message: '请输入银行开户名称',
                                    }],
                                    getValueFromEvent: (e) => {
                                        let value = e.target.value;
                                        value=value.replace(/(^\s+)|(\s+$)/g, "");
                                        if (value.length > 30)
                                            value = value.substr(0, 30)
                                        return value;
                                    },
                                })(
                                    <Input placeholder="请输入银行开户名称"/>
                                )}
                            </FormItem>
                        </div>
                    </div>
                    <div className="row">
                        <span className="desc">银行账号:</span>
                        <div className="form-item">
                            <FormItem
                                hasFeedback
                            >
                                {getFieldDecorator('bankCode', {
                                    rules: [{
                                        required: true, message: '请输入银行账号',
                                    }, {
                                        min: 11, max: 23, message: '银行卡位数不正确'
                                    }],
                                    getValueFromEvent: (e) => {
                                        let value = e.target.value;
                                        if (value.length > 30)
                                            value = value.substr(0, 30)
                                        return value;
                                    },
                                })(
                                    <Input type="number" onChange={(e) => this.cardInputChange(e.target.value)}
                                           placeholder="请输入银行账号"/>
                                )}
                            </FormItem>
                        </div>
                    </div>
                    <div className="row">
                        <span className="desc">开户行行别:</span>
                        <div className="form-item">
                            <FormItem hasFeedback>
                                {getFieldDecorator('bankType',
                                    {
                                        "initialValue": this.state.bankType,
                                        rules: [{
                                            required: true, message: '请输入开户行行别',
                                        }],
                                    })(
                                    <Select
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >{
                                        this.state.bankTypeArray.map((object, index) =>
                                            <Option key={index} value={object.key}>{object.value}</Option>
                                        )
                                    }
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="desc desc-End ">开户行名称:</div>
                        <div className="form-item">
                            <FormItem>
                                {getFieldDecorator('provinceCity', {
                                    "initialValue": this.state.provinceCity,
                                    rules: [{
                                        required: true, message: '请选择省市',
                                    }],
                                })(
                                    <Cascader options={cascaderOption} placeholder="请选择省市"/>
                                )}
                            </FormItem>

                        </div>
                        <div className="adds">
                            <FormItem
                                hasFeedback
                            >
                                {getFieldDecorator('bankName', {
                                    rules: [{
                                        required: true, message: '请输入开户行名称',
                                    }],
                                    getValueFromEvent: (e) => {
                                        let value = e.target.value;
                                        if (value.length > 30)
                                            value = value.substr(0, 30)
                                        return value;
                                    },
                                })(
                                    <Input placeholder="请输入开户行名称"/>
                                )}
                            </FormItem>
                        </div>
                    </div>
                    <div className="row">
                        <span className="desc">往来对象类型:</span>
                        <div className="form-item">
                            <FormItem>
                                {getFieldDecorator('userType', {"initialValue": this.state.userType})(
                                    <Select style={{width: 100}}>{
                                        this.state.userTypeArray.map((object, index) =>
                                            <Option key={index} value={object.key}>{object.value}</Option>
                                        )
                                    }
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                    </div>
                    <div className="button-style">
                        <Button type="primary" onClick={this.postData}>{this.state.isEdit ? '确认修改' : '提交'}</Button>
                        <Button className="quit-btn-style" type="primary"
                                onClick={() => this.props.history.goBack()}>取消</Button>
                    </div>
                </div>
            </Form>
        );
    }
}

AddNewTradeAccount = Form.create()(AddNewTradeAccount);
export default AddNewTradeAccount;

