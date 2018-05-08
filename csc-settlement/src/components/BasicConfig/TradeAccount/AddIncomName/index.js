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
class AddIncomName extends React.Component {
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
        const {curRowData}=this.props;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, formData) => {
            if (!err) {
                console.log("formData", formData);
                let postData = {};
                let data = {};
                //对象类型
                this.state.userTypeArray.some((item) => {
                    if (item.code === formData.userType) {
                        data.typeName = item.value;
                        data.typeCode = item.code;
                        return true;
                    }
                });
                //收支对象类型
                data.accountType=this.state.incomeType;
                //身份证或者营业执照
                data.customerCardNo=formData.cardNo;
                //客户名称
                data.customerName = formData.userName;
                if (this.props.curRowData.id) {
                    //修改
                    // data.accountId = Util.getQueryString('id');
                    data.id = this.props.curRowData.id;
                    data.companyName = curRowData.companyName;
                    data.createdTime = curRowData.createdTime;
                    data.createdUser = curRowData.createdUser;
                    data.delFlag = curRowData.delFlag;
                    data.effectivity = curRowData.effectivity;
                    data.freeze = curRowData.freeze;
                    data.key = curRowData.key;
                    data.modifiedTime = curRowData.modifiedTime;
                    data.version = curRowData.version;
                    postData.addr = Api.updateCurrentCustomer;
                }
                else {
                    //增加
                    postData.addr = Api.addCurrentCustomer;
                }
                postData.data = JSON.stringify(data);
                //提交数据
                Util.comFetch(postData, (data) => {
                    message.success(this.props.curRowData.id ? '修改成功' : '保存成功');
                    this.props.cancel();
                    if(this.props.curRowData.id){
                        this.props.getTableData();
                    }else{
                        this.props.getTableData(10,1);
                    }
                    // this.props.history.goBack();
                });
            }
        });
    };

    //修改获取用户信息
    getEditData() {
        const {curRowData,isEdit}=this.props;
        let formData = {};
        console.log('往来账户,修改账户获取到的信息:', curRowData);
        //收支对象类型
        this.setState({
            incomeType:curRowData.accountType+""
        });
        //身份证或者营业执照
        formData.cardNo=curRowData.customerCardNo;
        formData.userName = curRowData.customerName;
        //Select 赋值
        formData.userType = curRowData.typeCode;
        this.props.form.setFieldsValue(formData);



        // Util.comFetch(
        //     {
        //         addr: Api.getACAccountByAccountId,
        //         accountId: curRowData.accountId,
        //     },
        //     (data) => {
        //         let remoteData = data.data.rows[0];
        //         let formData = {};
        //         console.log('往来账户,修改账户获取到的信息:', remoteData);
        //         //收支对象类型
        //         this.setState({
        //             incomeType:remoteData.accountType+""
        //         });
        //         //身份证或者营业执照
        //         formData.cardNo=remoteData.cardNo;
        //         formData.userName = remoteData.customerName;
        //         formData.bankUserName = remoteData.accountName;
        //         formData.bankCode = remoteData.accountNumber;
        //         //Select 赋值
        //         formData.userType = remoteData.typeCode;
        //         formData.bankType = remoteData.bankCategoryCode;
        //         //开户行省市赋值
        //         formData.provinceCity = [remoteData.province, remoteData.city];
        //         //开户行名称
        //         formData.bankName = remoteData.accountBankName;
        //         this.props.form.setFieldsValue(formData);
        //     }
        // );
    }
    componentWillMount() {
        if (this.props.curRowData.id) {
            this.setState({'isEdit': true});
        }
    }
    componentDidMount() {
        this.getDropDownData();
        if (this.props.curRowData.id) {
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
                    [apiArrayDrop[i].valKey]: resultList.length > 0 ? resultList[0].code : ''
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
        console.log(this.props);
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
                            <span  className="desc">{this.state.incomeType=="1"?"手机号码:":"营业执照:"}</span>
                            <div className="form-item">
                                <FormItem
                                    hasFeedback
                                >
                                    {getFieldDecorator('cardNo', {
                                        rules: [{
                                            required: true, message:'请输入手机号码/营业执照',
                                        }, {
                                            min: 11, max: 23, message: '手机号码/营业执照位数不正确'
                                        }],
                                        getValueFromEvent: (e) => {
                                            let value = e.target.value;
                                            value=value.replace(/[^\w\.\/]/ig,'');
                                            if (value.length > 30)
                                                value = value.substr(0, 30)
                                            return value;
                                        },
                                    })(
                                        <Input    placeholder={this.state.incomeType=="1"?"请输入手机号码":"请输入营业执照"}/>
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
                                                <Option key={index} value={object.code}>{object.value}</Option>
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
                                    onClick={() => this.props.cancel()}>取消</Button>
                        </div>
                    </div>
                </Form>
            </Modal>
        );
    }
}

AddIncomName = Form.create()(AddIncomName);
export default AddIncomName;
