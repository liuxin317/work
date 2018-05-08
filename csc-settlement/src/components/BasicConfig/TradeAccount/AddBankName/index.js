import React from 'react';
import {Button, Input, Select, Form, Cascader, message,Radio,Modal} from 'antd';
import './style.scss';
import BIN from 'bankcardinfo';
import {BankArray, BankData} from '../../../../constants/bankData.js';
import cascaderOption from '../../../../constants/cascader-address-options';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

//添加交易对象
class AddBankName extends React.Component {
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
        const {curRowData,parentId,parentData}=this.props;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, formData) => {
            if (!err) {
                console.log("formData", formData);
                let postData = {};
                let data = {};
                // if(parentData.customerName!==formData.bankUserName){
                //     Modal.warning({
                //         title: '收支对象名称与银行开户名称不一致!',
                //     });
                //     return false;
                // };
                //银行开户名称
                data.accountName = this.state.bankUserName;
                // data.accountName = formData.bankUserName;
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
                    data.accountBankCode = curRowData.accountBankCode;
                    data.createdTime = curRowData.createdTime;
                    data.currentCustomerId = curRowData.currentCustomerId;
                    data.defaultFlag = curRowData.defaultFlag;
                    data.delFlag = curRowData.delFlag;
                    data.effectivity = curRowData.effectivity;
                    data.freeze = curRowData.freeze;
                    data.id = curRowData.id;
                    data.modifiedTime = curRowData.modifiedTime;
                    data.version = curRowData.version;
                    //修改
                    postData.addr = Api.updateCurrentCustomerBank;
                }
                else {
                    //增加   同一个收支对象增加账号
                    data.currentCustomerId = parentId;
                    postData.addr = Api.addCurrentCustomerBank;
                }
                //DATA
                postData.data = JSON.stringify(data);
                //提交数据
                Util.comFetch(postData, (data) => {
                    message.success(this.props.curRowData.id ? '修改成功' : '保存成功');
                    this.props.cancel();
                    if(this.props.curRowData.id){
                        this.props.getTableBankData();
                    }else{
                        this.props.getTableBankData(10,1);
                    }

                    // this.props.history.goBack();
                });
            }
        });
    };

    //修改获取用户信息
    getEditData() {
        const {curRowData}=this.props;
                let formData = {};
                console.log('往来账户,修改账户获取到的信息:', curRowData);
                //银行开户名
                this.setState({
                    bankUserName:curRowData.accountName,
                })
                // formData.bankUserName = curRowData.accountName;
                //银行账号
                formData.bankCode = curRowData.accountNumber;
                //Select 赋值 开户行行别
                formData.bankType = curRowData.bankCategoryCode;
                //开户行省市赋值
                formData.provinceCity = [curRowData.province, curRowData.city];
                //开户行名称
                formData.bankName = curRowData.accountBankName;
                this.props.form.setFieldsValue(formData);
    }

    componentDidMount() {
        this.getDropDownData();
        if (this.props.curRowData.id) {
            this.setState({'isEdit': true});
            this.getEditData();
        }else{
            //  新增的时候把收支对象同步过来
            const {parentData}=this.props;

            this.setState({
                bankUserName:parentData.customerName,
            })
            // let formData = {};
            // formData.bankUserName = parentData.customerName;
            // this.props.form.setFieldsValue(formData);
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
    //关闭模态框
    cancel=()=>{
        this.props.cancel()
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Modal
                visible={true}
                // onOk={this.hideModal}
                // onCancel={this.hideModal}
                // okText="确认"
                // cancelText="取消"
                closable={false}
                footer={null}
            >
            <Form>
                <div className="add-trade-account">
                    <div className="row">
                        <span className="desc">银行开户名称:</span>


                        <div className="form-item"  style={{'lineHeight':'28px'}}> {this.state.bankUserName}</div>
                        {/*<div className="form-item">*/}
                            {/*<FormItem*/}
                                {/*hasFeedback*/}
                            {/*>*/}
                                {/*{getFieldDecorator('bankUserName', {*/}
                                    {/*rules: [{*/}
                                        {/*required: true, message: '请输入银行开户名称',*/}
                                    {/*}],*/}
                                    {/*getValueFromEvent: (e) => {*/}
                                        {/*let value = e.target.value;*/}
                                        {/*value=value.replace(/(^\s+)|(\s+$)/g, "");*/}
                                        {/*if (value.length > 30)*/}
                                            {/*value = value.substr(0, 30)*/}
                                        {/*return value;*/}
                                    {/*},*/}
                                {/*})(*/}
                                    {/*<Input placeholder="请输入银行开户名称"/>*/}
                                {/*)}*/}
                            {/*</FormItem>*/}
                        {/*</div>*/}
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
                                    // rules: [{
                                    //     required: true, message: '请输入开户行名称',
                                    // }],
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
                    <div className="button-style">
                        <Button type="primary" onClick={this.postData}>{this.state.isEdit ? '确认修改' : '提交'}</Button>
                        <Button className="quit-btn-style" type="primary"
                                onClick={this.cancel}>取消</Button>
                    </div>
                </div>
            </Form>
            </Modal>
        );
    }
}
AddBankName = Form.create()(AddBankName);
export default AddBankName;

