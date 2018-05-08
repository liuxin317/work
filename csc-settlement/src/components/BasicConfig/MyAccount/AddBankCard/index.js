import React from 'react';
import { Button, Input, Select, Checkbox, Popover, Tabs, Form, Cascader, Radio, message ,Modal} from 'antd';
import './style.scss';
import cascaderOption from '../../../../constants/cascader-address-options';
import BIN from 'bankcardinfo';
import { BankArray, BankData } from '../../../../constants/bankData.js';
import  Org   from   "../../../common/Org/addOrg";
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

//添加银行卡
class AddBankCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 判断是否冲突
            confs:"0",
            isEdit: false,
            //银行开户姓名
            userCardName: '',
            //银行账号
            userCardCode: '',
            //开户行名称
            bankName: '',
            //Select 支持银行,币种,账户性质===当前选中值
            bankType: '',
            moneyType: '',
            userType: '',
            //Select 支持银行,币种,账户性质====数组
            bankArray: [],
            moneyTypeArray: [],
            userTypeArray: [],

            //checkBox 支付方式和支付渠道
            // payModeCheckArray: [],
            payChanleCheckArray: [],
            //checkBox 支付方式和支付渠道
            // payModeArray: [],
            payChanleArray: [],
            provinceCity: ['510000', '510700'],
            //支付方式选择现汇的时候，才展示支付渠道选项
            showCompanyCode: false,

            //支付方式选择的值
            checkedValue:'',

            getOrgsOfTre: "",
            //组织机构选择的
            treeValue:'',
            orgCode: "",
            OrgId: [],
            //支持银行数据
            supporBankArray:[],

            activeKey:'',
            amountRadio:'1',

            mainAccount:'',
            mianData:[],  //没有过滤前的主账户数据
            mainAccountData:[],
            accountNumberEdit:'',
        };
    }
    componentWillMount() {
        console.log(window.location);
        this.getOrgsOfTre();
        this.setState({
            'isEdit': window.location.href.indexOf('id') != -1 ? true : false
        })
    }
    cascaderChange = (value, selectedOptions) => {
        console.log('cascaderChange:' + value);
        console.log('selectedOptions:' + value);
    };
    componentDidMount() {
        this.getSelectData();
        // if (this.state.isEdit) {
        //     this.getEditData();
        // }
    }
    //获取组织结构下拉数据
    getOrgsOfTre = () => {
        let requestParam = {};
        requestParam.code = userInfo.orgCode;
        requestParam.addr = Api.getOrgsOfTree;
        Util.comFetch(requestParam, (data) => {
            console.log("获取组织结构下拉数据", data.orgs);
            this.setState({
                getOrgsOfTre: data.orgs
            }),
                message.success('获取成功');
        });
    };

    TreeValue=(value,id)=>{
        console.log("树",value,id)
        this.setState({
            treeValue: value,
            OrgId: id
        })
    };

    // setFieldsValue 这个方法调用时机必须在onKeyUp 之后调用,在oninput 事件调用是不生效的
    getMaxLengthNumber = (e) => {
        console.log('getMaxLengthNumber', e.target.value);
        let value = e.target.value;
        if (value.length > 5) {
            value = value.slice(0, 5)
        }
        let formData = {};
        formData.userCardCode = value;
        this.props.form.setFieldsValue(formData);
    };


//修改获取用户信息
    getEditData() {
        Util.comFetch(
            {
                addr: Api.getMyAccountByAccountId,
                accountId: Util.getQueryString('id')
            },
            (data) => {
                this.setState({
                   confs:data.confs
                });
                let remoteData = data.data;
                this.setState({
                    treeValue:remoteData.orgCode,
                    amountRadio:remoteData.accountType+"",
                    mainAccount:remoteData.pAccountNo,
                    accountNumberEdit:remoteData.accountNumber,
                });
                this.getMainAccount(remoteData.bankCategoryCode,remoteData.accountNumber);
                let formData = {};
                formData.userCardName = remoteData.accountName;
                formData.userCardCode = remoteData.accountNumber;
                formData.bankName = remoteData.accountBankName;

                //Select 赋值
                formData.bankType = remoteData.bankCategoryCode;
                formData.userType = remoteData.accountTypeCode;
                formData.moneyType = remoteData.currencyCode;



                //CheckBox 赋值
                // formData.payMode = Util.getValueListByList(remoteData.payModeJson);
                // this.payModeAndPayChanleChange(formData.payMode, 'showPayChanle', '现汇');
                //开户行省市赋值
                formData.provinceCity = [remoteData.province, remoteData.city];
                //银企直联赋值
                formData.payChanle = Util.getValueListByList(remoteData.payChannelJson);
                //如果勾选的是银企直联,要显示下面的客户号
                this.payModeAndPayChanleChange(formData.payChanle, 'showCompanyCode', '银企直联');
                formData.companyCode = remoteData.customerNo;
                console.log('修改用户,填充给form的数据:', formData);
                this.props.form.setFieldsValue(formData);
            }

        );
    }

    //输入银行卡之后的回调
    cardInputChange = (value) => {
        console.log('输入银行卡之后的回调');
        // let  mainData=this.state.mianData;
        // mainData.map((value,index)=>{
        //     if(value == value){
        //         mainData.splice(index,1)
        //     }
        // });
        // this.setState({
        //     mainAccountData:mainData
        // });
        let self = this;
        if (value.length < 15)
            return;
        BIN.getBankBin(value)
            .then(function (data) {
                let bankName = data.bankName;
                self.state.bankArray.some((item, index) => {
                    if (item.value === bankName) {
                        self.props.form.setFieldsValue({ 'bankType': item.code });
                        return true;
                    }
                });
            })
            .catch(function (err) {
                console.log('识别银行卡卡号错误:', err);
            })
    };
    SupporBank=(activeKey)=>{
        this.setState({ activeKey });
        console.log("支持一样",activeKey)
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.activeKey !== this.state.activeKey) {
            this.getSuppor();
        }
    }
    getSuppor=()=>{
        Util.comFetch(
            {
                addr: Api.getSuportBank,
                channelCode:this.state.activeKey,
            },
            (data) => {
                console.log("支持银行",data)
                this.setState({
                    supporBankArray: data.rows,
                });
            },
            null, {noPending:true}
        );
    };

//获取支持的银行
    getSupportBank() {
        // let data = this.state.bankArray;
        // let list = [];
        // let banks = [];
        // data.forEach((item, index) => {
        //     banks.push(
        //         <span style={{ padding: '0 5px', display: 'inline-block', width: '33%' }}
        //               key={index}>{item.value}</span>
        //     );
        //     if ((index + 1) % 4 === 0) {
        //         banks.push(
        //             <br key={index * -1}/>
        //         );
        //     }
        // });
        // return(
        // <Tabs defaultActiveKey="1">
        //     <TabPane tab="银企直联" key="1">
        //         <div className="tab-style">
        //             {banks}
        //         </div>
        //     </TabPane>
        //     <TabPane tab="网上银行" key="2"><p>暂不支持谢谢</p></TabPane>
        // </Tabs>
        // )
        return (
            <Tabs defaultActiveKey="1"   activeKey={this.state.activeKey}   onChange={this.SupporBank}>
                {this.state.payChanleArray.map((v,i)=>
                    <TabPane tab={v.name} key={v.code}>
                        <div className="tab-style">
                            {/*{banks}*/}
                            { this.state.supporBankArray.length ?
                                this.state.supporBankArray.map((v,i)=>
                                    <span style={{ padding: '0 5px', display: 'inline-block', width: '50%' }}
                                          key={i}>{v.name}</span>
                                ) :null
                            }
                        </div>
                    </TabPane>
                )}
            </Tabs>
        )
    }

    //需求: 支付方式选择现汇的时候，才展示支付渠道选项
    //需求: 支付渠道选择银企直连的时候，显示【公司代码】字段，进行值录入
    payModeAndPayChanleChange = (checkedValue, controlValue, compareValue) => {

        this.setState({
            checkedValue:checkedValue,
        });
        let condition = compareValue === '现汇' ? '现汇' : '银企直联';
        let  res=checkedValue.some((item)=>{
                    if (condition == item) {
                        return true;
                    }
                    return  false;
        });
        if(res){
            this.setState({
                showCompanyCode:true
            })
        }else if (!res){
            this.setState({
                showCompanyCode:false
            });
            let formData = {};
            formData.companyCode = '';
            this.props.form.setFieldsValue(formData);
        }
        // let result = checkedValue.some((item) => {
        //     if (condition === item) {
        //         this.setState({ showCompanyCode:true });
        //         return true;
        //     }
        // });
        // if (!result) {
        //     this.setState({ showCompanyCode:false });
        //     let formData = {};
        //     formData.companyCode = '';
        //     this.props.form.setFieldsValue(formData);
        // }
    };

    getSelectData() {
        //获取支持的银行,
        let apiArrayDrop = [];
        apiArrayDrop.push({ api: "supportBank", target: 'bankArray', valKey: 'bankType' });
        apiArrayDrop.push({ api: "sett_currency", target: 'moneyTypeArray', valKey: 'moneyType' });
        apiArrayDrop.push({ api: "accountType", target: 'userTypeArray', valKey: 'userType' });

        for (let i = 0; i < apiArrayDrop.length; i++) {
            Util.comFetch({
                addr: Api.getDropdownList,
                dictType: apiArrayDrop[i].api
            }, (data) => {
                let resultList = Util.getDropDownListUtil(data.data.rows);
                this.setState({
                    [apiArrayDrop[i].target]: resultList,
                    //form 表单交给ANTD 处理之后,赋默认值Select key 不能给 value
                    [apiArrayDrop[i].valKey]: resultList.length > 0 ? resultList[0].code : ''
                })
                //获取主账号
                if([apiArrayDrop[i].target]=='bankArray' && resultList && !this.state.isEdit){
                    // this.getMainAccount(resultList[0].code)
                }
            });
        }
    //支付方式,支付渠道的下拉框数据获取
        let apiArrayCheckBox = [];
        // apiArrayCheckBox.push({ api: "payMode", target: 'payModeArray' });
        apiArrayCheckBox.push({ api: "payChannel", target: 'payChanleArray' });
        for (let i = 0; i < apiArrayCheckBox.length; i++) {
            Util.comFetch(
                // {
                //     addr: Api.getDropdownList,
                //     dictType: apiArrayCheckBox[i].api
                // },
                {addr:Api.getPayChannel},
                (data) => {
                    if (this.state.isEdit) {
                        this.getEditData();
                    }
                    console.log("payChannel",data);
                    this.setState({
                        // [apiArrayCheckBox[i].target]: Util.getDropDownListUtil(data.data.rows),
                        [apiArrayCheckBox[i].target]: data.rows,
                    });
                }
            );
        }
    }

    // 通用获取input值方法
    getInputValue = (key, value) => {
        this.setState({ [key]: value });
    };
    //获取下拉选中值的方法
    getSelectValue = (key, value) => {
        this.setState({ [key]: value });
    };
    //获取多选框组选中的值
    onCheckBoxGroupChange = (key, value) => {
        this.setState({ [key]: value });
    };
    //改变银行类型
    changeBankType=(value)=>{
        this.setState({
            mainAccount:'',
        });
        this.getMainAccount(value,this.state.accountNumberEdit)
    };

    //获取主账号
    getMainAccount = (value,accountNumber) => {
        let  postData={};
        postData.addr=Api.getAccountNumbersBycategory;
        this.state.bankArray.some((item) => {
            if (item.code === value) {
                postData.bankCategoryName = item.value;
                return true;
            }
        });
        Util.comFetch(postData, (data) => {
            //没有过滤之前的数据
            // this.setState({
            //     mianData:data.data,
            // })
            if (accountNumber && accountNumber!==''){
                data.data.map((value,index)=>{
                    if(value == accountNumber){
                        data.data.splice(index,1)
                    }
                })
            }
            console.log("data",data.data);
            this.setState({
               mainAccountData:data.data,
            })
        });
    };
    //提交数据
    postData = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, formData) => {
            console.log("机构",this.state.treeValue);
            if(this.state.treeValue==""){
                message.error("请选择组织机构");
            }else {
                if (!err){
                    console.log("fromData", formData);
                    let postData = {};
                    let data = {};
                    //开户人名称,开户人账号
                    data.orgCode=this.state.treeValue;
                    data.accountName = formData.userCardName;
                    data.accountName=userInfo.compName;
                    data.accountNumber = formData.userCardCode;
                    //开户行行别
                    console.log("银行数组", this.state.bankArray);
                    this.state.bankArray.some((item) => {
                        if (item.code === formData.bankType) {
                            data.bankCategoryName = item.value;
                            // data.bankCategoryCode = item.key;
                            data.bankCategoryCode = item.code;
                            return true;
                        }
                    });

                    //开户行省市获取
                    data.province = formData.provinceCity[0];
                    data.city = formData.provinceCity[1];
                    //开户行名称
                    data.accountBankName = formData.bankName;
                    //币种
                    this.state.moneyTypeArray.some((item) => {
                        if (item.code === formData.moneyType) {
                            data.currencyName = item.value;
                            // data.currencyCode = item.key;
                            data.currencyCode = item.code;
                            return true;
                        }
                    });
                    //账户性质
                    this.state.userTypeArray.some((item) => {
                        if (item.code === formData.userType) {
                            data.accountTypeName = item.value;
                            // data.accountTypeCode = item.key;
                             data.accountTypeCode = item.code;
                            return true;
                        }
                    });
                    //账户属性和主账号
                    data.accountType  = this.state.amountRadio;
                    if(this.state.mainAccount && this.state.amountRadio=="2"){
                        data.pAccountNo =this.state.mainAccount;
                    }
                    else if(this.state.amountRadio=="2"){
                            message.info("请选择主账号!")
                            return false;
                    }
                    //支付方式
                    // let tempPayMode = Util.getListByValue(formData.payMode, this.state.payModeArray);
                    let tempStr = '';
                    // tempPayMode.forEach((item, index, array) => {
                    //   if ((array.length == 1) || (index == array.length - 1)) {
                    //     tempStr += item.key + '=' + item.value;
                    //   }
                    //   else {
                    //     tempStr += item.key + '=' + item.value + ",";
                    //   }
                    // });
                    // data.payMode = tempStr;
                    // tempStr = '';
                    //支付渠道
                    if(this.state.checkedValue!==''){
                        let tempPayChanle = Util.getListByValue(formData.payChanle, this.state.payChanleArray);
                        console.log("处理后的数据",tempPayChanle);
                        tempPayChanle.forEach((item, index, array) => {
                            if ((array.length == 1) || (index == array.length - 1)) {
                                tempStr += item.code + '=' + item.name;
                            }
                            else {
                                tempStr += item.code + '=' + item.name + ",";
                            }
                        });
                        data.payChannel = tempStr;
                    }else{
                        data.payChannel='';
                    }
                    //客户号
                    data.customerNo = formData.companyCode;
                    if (this.state.isEdit) {
                        //修改
                        data.accountId = Util.getQueryString('id');
                        postData.addr = Api.updateMyAccount;
                    }
                    else {
                        //增加
                        postData.addr = Api.addMyAccount;
                    }
                    //DATA
                    postData.data = JSON.stringify(data);
                    //addr
                    //提交数据
                    console.log('postData', data);
                    let self = this;
                    if (this.state.confs != "0") {
                        confirm({
                            title: '该账户已经在结算规则中维护，修改账户后，结算规则配置中对应的账户也会被更新',
                            // content: 'Some descriptions',
                            okText: '确认',
                            cancelText: '取消',
                            onOk() {
                                Util.comFetch(postData, (data) => {
                                    message.success(self.state.isEdit ? '修改成功' : '保存成功');
                                    self.props.history.goBack();
                                });
                            },
                            onCancel() {
                            },
                        });
                    } else {
                        Util.comFetch(postData, (data) => {
                            message.success(this.state.isEdit ? '修改成功' : '保存成功');
                            this.props.history.goBack();
                        });
                    }
                    // Util.comFetch(postData, (data) => {
                    //     message.success(this.state.isEdit ? '修改成功' : '保存成功');
                    //     this.props.history.goBack();
                    // });
                }
            }});
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <div className="add-bank-card">

                    {/*组织机构树*/}
                    {this.state.getOrgsOfTre!==''  && <div    className="row" >
                        <span className="desc">组织机构:</span>
                        <div   style={{height:"30px"}}   className="form-item">
                            <Org
                                ValueEdit={this.state.treeValue}
                                OrgData={this.state.getOrgsOfTre}
                                TreeValue={this.TreeValue}
                            />
                        </div>
                    </div>}
                    {/*---开户行名称---*/}
                    <div className="row">
                        <span className="desc">银行开户名称:</span>
                        <div className="form-item"  style={{lineHeight:"28px"}}>{userInfo.compName}</div>
                        {/*<div className="form-item">*/}
                            {/*<FormItem*/}
                                {/*hasFeedback*/}
                            {/*>*/}
                                {/*{getFieldDecorator('userCardName', {*/}
                                    {/*rules: [{*/}
                                        {/*required: true, message: '请输入银行开户名称',*/}
                                    {/*}],*/}
                                    {/*getValueFromEvent:(e)=>{*/}
                                     {/*let  value=e.target.value;*/}
                                     {/*if(value.length>30)*/}
                                        {/*value=value.substr(0,30)*/}
                                        {/*return  value;*/}
                                    {/*},*/}
                                {/*})(*/}
                                    {/*<Input step={0} placeholder="请输入银行开户名称"/>*/}
                                {/*)}*/}
                            {/*</FormItem>*/}
                        {/*</div>*/}
                    </div>
                    {/*---银行账号---*/}
                    <div className="row">
                        <span className="desc">银行账号:</span>
                        <div className="form-item">
                            <FormItem
                                hasFeedback
                            >
                                {getFieldDecorator('userCardCode', {
                                    rules: [{
                                        required: true, message: '请输入银行账号',
                                    }, {
                                        min: 11, max: 23, message: '银行卡位数不正确'
                                }],
                                    getValueFromEvent:(e)=>{
                                        let value = e.target.value;
                                        if(value.length>30) value = value.substr(0,30)
                                        return value;
                                    }
                                })(
                                    <Input type="number" onChange={(e) => this.cardInputChange(e.target.value)}
                                           placeholder="请输入银行账号"/>
                                )}
                            </FormItem>

                        </div>
                        <div className="adds">
                            <Popover placement="right" content={this.getSupportBank()}>
                                <a href="javascript:void(0)">支持银行</a>
                            </Popover>
                        </div>
                    </div>
                    <div className="row">
                        <span className="desc">开户行行别:</span>
                        <div className="form-item">
                            <FormItem>
                                {getFieldDecorator('bankType', {
                                    rules: [{
                                        required: true, message: '请选择开户行行别',
                                    }]
                                })(
                                    <Select
                                        style={{ width: 100 }}
                                        onChange={this.changeBankType}
                                    >
                                        {
                                            this.state.bankArray.map((object, index) =>
                                            <Option key={index} value={object.code}>{object.value}</Option>)
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                    </div>

                    <div className="row">
                        <span className="desc">币种:</span>
                        <div className="form-item">
                            <FormItem>
                                {getFieldDecorator('moneyType', { "initialValue": this.state.moneyType })(
                                    <Select style={{ width: 100 }}>{
                                        this.state.moneyTypeArray.map((object, index) =>
                                            <Option key={index} value={object.code}>{object.value}</Option>
                                        )
                                    }
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                    </div>
                    <div className="row">
                        <span className="desc">账户性质:</span>
                        <div className="form-item">
                            <FormItem>
                                {getFieldDecorator('userType', { "initialValue": this.state.userType })(
                                    <Select style={{ width: 100 }}>{
                                        this.state.userTypeArray.map((object, index) =>
                                            <Option key={index} value={object.code}>{object.value}</Option>
                                        )
                                    }
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                    </div>

                    <div className="row">
                        <span className="desc">账户属性:</span>
                        <div className="form-item">
                            <div>
                                {/*{getFieldDecorator('amountRadio', { "initialValue": this.state.amountRadio })(*/}
                                {/*)}*/}
                                    <RadioGroup value={this.state.amountRadio}   onChange={(e)=>this.setState({amountRadio:e.target.value})}>
                                        <Radio value="1"> 主账户</Radio>
                                        <Radio value="2"> 子账户</Radio>
                                    </RadioGroup>
                            </div>
                        </div>
                    </div>
                    {this.state.amountRadio=="2"?<div className="row">
                        <span className="desc">主账号:</span>
                        <div className="form-item">
                            <div>
                                {/*{getFieldDecorator('mainAccount', )(*/}
                                    {/*<Select value={this.state.mainAccount} style={{ width: 200 }}>{*/}
                                        {/*this.state.mainAccountData.map((object, index) =>*/}
                                            {/*<Option key={index} value={object}>{object}</Option>*/}
                                        {/*)*/}
                                    {/*}*/}
                                    {/*</Select>*/}
                                 {/*)}*/}

                                <Select value={this.state.mainAccount} style={{ width: 200 }} onSelect={(value)=>this.setState({mainAccount:value})}>{
                                this.state.mainAccountData.map((object, index) =>
                                <Option key={index} value={object}>{object}</Option>
                                )
                                }
                                </Select>
                            </div>
                        </div>
                    </div>:null}

                    <div className="row">
                        <span className="desc">开户行名称:</span>
                        <div className="form-item">
                            <FormItem>
                                {getFieldDecorator('provinceCity', { "initialValue": this.state.provinceCity })(
                                    <Cascader options={cascaderOption} onChange={this.cascaderChange}
                                              placeholder="请选择省市"/>
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
                                })(
                                    <Input placeholder="请输入开户行名称"/>
                                )}
                            </FormItem>
                        </div>
                    </div>

                    {/*<div className="row">*/}
                    {/*<span className="desc">支付方式:</span>*/}
                    {/*<div className="form-item">*/}
                    {/*<FormItem*/}
                    {/*hasFeedback*/}
                    {/*>*/}
                    {/*{getFieldDecorator('payMode', {*/}
                    {/*rules: [{*/}
                    {/*required: true, message: '请选择支付方式',*/}
                    {/*}],*/}
                    {/*})(*/}
                    {/*<RadioGroup*/}
                    {/*// onChange={(checklist) => this.payModeAndPayChanleChange(checklist, 'showPayChanle', '现汇')}*/}
                    {/*onChange={(e) => this.radioGroupChange(e)}*/}
                    {/*options={*/}
                    {/*this.state.payModeArray.map((object, index) => {*/}
                    {/*return object.value;*/}
                    {/*})*/}
                    {/*}/>*/}
                    {/*)}*/}
                    {/*</FormItem>*/}
                    {/*</div>*/}
                    {/*</div>*/}

                    <div className="row">
                        <span className="desc">支付渠道:</span>
                        <div className="form-item">
                            <FormItem
                                hasFeedback
                            >
                                {getFieldDecorator('payChanle', {
                                    rules: [],
                                })(
                                    <CheckboxGroup
                                        onChange={(checklist) => this.payModeAndPayChanleChange(checklist, 'showCompanyCode', '银企直联')}
                                        options={
                                            this.state.payChanleArray.map((object, index) => {
                                                return   object.name
                                                // return object.value;
                                            })
                                        }/>
                                )}
                            </FormItem>
                        </div>
                    </div>
                    <div className="row" style={{ display: this.state.showCompanyCode ? 'block' : 'none' }}>
                        <span className="desc">客户号:</span>
                        <div className="form-item">
                            <FormItem
                                hasFeedback
                            >
                                {getFieldDecorator('companyCode', {
                                    rules: this.state.showCompanyCode ? [{
                                        required: true, message: '请输入客户号',
                                    }] : []
                                })(
                                    <Input step={0} placeholder="银行签约分配的代码/客户号"/>
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
        )
    }
}
AddBankCard = Form.create()(AddBankCard);
export default AddBankCard;


