import React from 'react';
import {Button, Input, DatePicker, Select, Form, message, Radio, TreeSelect, Tree, Checkbox, Upload, Icon,} from 'antd';
import './style.scss';
import 'moment/locale/zh-cn';
import  Org   from   "../../../common/Org/addOrg";
import moment from 'moment';

// import BIN from 'bankcardinfo';
// import {BankArray, BankData} from '../../../../constants/bankData.js';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;
//添加交易对象
class AddKeepInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //是否新增
            isEdit: false,
            //组织结构
            orgCode: "",
            OrgId: [],
            //开户行别
            pBankCategoryCode: "",
            getAccountData: [],
            //银行账号
            pAccountNumber: "",
            //银行账号详情
            bankDetail: "",
            //开户人姓名
            accHolderName: "",
            //开户人电话
            accHolderTel: "",
            //开户人身份证
            accHolderCardId: "",
            //法人姓名
            legalPersonName: "",
            //法人电话
            legalPersonTel: "",
            //法人身份证
            legalPersonCardNo: 0,
            //法人预留印章
            legalPersonSeal: "",
            //出纳姓名
            cashierName: "",
            //出纳电话
            cashierTel: "",
            //出纳身份证
            cashierCardNo: "",
            //出纳预留印章
            cashierSeal: "",
            //是否开通网银
            ebankOpen: "1",
            //开通网银时间
            ebankOpenTime: null,
            //是否开通银企直联
            b2eOpen: "1",
            //开通银企直连时间
            b2eOpenTime: null,
            //密钥保管人
            keyCustodian: "",
            //密码保管人
            passwordCustodian: "",
            userTypeArray: [],
            // 银行, 开户行名, 卡号
            bank: '',
            banks: [],
            subBank: '',
            subBanks: [],
            bankAcc: '',
            bankAccs: [],
            // getOrgsOfTre: [],
            //组织机构选择的
            treeValue: undefined,
            //组织机构的多选控制
            treeCheckStrictly: true,
            //法人
            uploadNameLegal:'',
            uploadUrlLegal:'',
            // 法人图片本地预览地址
            uploadUrlLegalPreview: '',
            //出纳
            uploadNameCashier:'',
            uploadUrlCashier:'',
            uploadUrlCashierPreview:'',

            getOrgsOfTre: "",
            //组织机构选择的
            treeValue:'',
            orgCode: "",
            OrgId: [],
            // 编辑的数据
            remoteData:'',
        };
    }
    componentWillMount(){
        this.setState({
            'isEdit': window.location.href.indexOf('id') != -1 ? true : false
        })
    };
    componentDidMount() {
        this.getOrgsOfTre();
    };
    EditBankPush(){
        Util.comFetch(
            {
                addr: Api.findCustodyById,
                custodyId: Util.getQueryString('id')
            },
            (data) => {
                let remoteData=data.data;
                console.log("银行编辑",remoteData)
                this.setState({
                     bank: remoteData.pBankCategoryCode,
                     subBank:remoteData.pAccountNumber,
                })
            })
    };
    // 获取付款方账户
    getMyAccountByOrg() {
        let requestParam = {};
        requestParam.addr = Api.getMyAccountByOrg;
        requestParam.orgCode = this.state.treeValue;
        Util.comFetch(requestParam, (re) => {
            if(this.state.isEdit){
                this.EditBankPush()
            }
            // 转成银行-账户名-卡号的数据结构
            //转成银行-卡号  的数据结构
            let reData = re.data;
            console.log("获取账号", re.data)
            this.setState({
                getAccountData: re.data
            });
            let reDATA = [];
            reData.map((v, i) => {
                let reR = v.split(",");
                let reName = reR[3];
                reR[3] = reR[1];
                reR[1] = reName;
                reR = reR.toString();
                reDATA.push(reR);
            });
            // 后台返回的银行-支行-卡号数据是逗号分隔的字符串，用trans3LvlBankData转换为带层级的对象
            let accData = Util.trans3LvlBankData(reDATA);
            this.calcAccSelect(accData);
            this.setState({accData});
        });
    }
    // 付款方账户，银行-支行-卡号，根据选择的前一级，确定后级的数据
    calcAccSelect(data, bankSpec, subBankSpec) {
        const state = this.state;
        let bank = bankSpec || state.bank, subBank = subBankSpec || state.subBank, bankAcc = '', bankAccName = '';
        let banks = state.banks, subBanks = state.subBanks, bankAccs = state.bankAccs;

        if (!bankSpec) {
            banks = data;
            bank = banks[0].name;
            subBanks = banks[0].children;
            subBank = subBanks[0].name;
            bankAccs = subBanks[0].children;
            bankAcc = bankAccs[0].name;
            bankAccName = bankAccs[0].accName;
        } else if (!subBankSpec) {
            data.some((item) => {
                if (item.name === bankSpec) {
                    subBanks = item.children;
                    return true;
                }
            });
            subBank = subBanks[0].name;
            bankAccs = subBanks[0].children;
            bankAcc = bankAccs[0].name;
            bankAccName = bankAccs[0].accName;
        } else {
            subBanks.forEach((item) => {
                if (item.name === subBankSpec) {
                    bankAccs = item.children;
                    return true;
                }
            });
            bankAcc = bankAccs[0].name;
            bankAccName = bankAccs[0].accName;
        }
        this.setState({banks, bank, subBanks, subBank, bankAccs, bankAcc, bankAccName});
    };

    // 付款方选择银行， 需要重新设置支行和卡号
    bankChange = (value) => {
        this.setState({bank: value});
        this.calcAccSelect(this.state.accData, value);
    };
    // 付款方选择支行， 需要重新设置卡号
    subBankChange = (value) => {
        console.log("设置卡号", value);
        this.setState({subBank: value});
        this.calcAccSelect(this.state.accData, this.state.bank, value);
    };
    //上传检查
    chkImg=()=>{
           if(this.state.uploadUrlLegal==''){
               message.error("请上传法人印章");
               return  false;
           }
           if(this.state.uploadUrlCashier==''){
               message.error("请上传出纳印章");
               return  false;
           }
           return true;
    };
    //提交
    postData = (e) =>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, formData) => {
            console.log("机构",this.state.treeValue);
            if(this.state.treeValue==""){
                message.error("请选择组织机构");
            }else {
                let chkpass = this.chkImg();
                if (!chkpass) {
                    return ;
                };
                if (!err) {
                    console.log("formData", formData);
                    let postData = {};
                    let data = {};
                    //组织结构
                    data.orgCode = this.state.treeValue;
                    //开户行别,银行账号
                    let backCode = "";
                    this.state.getAccountData.map((v, i) => {
                        let code = v.split(",");
                        console.log("银行", code);
                        if (this.state.bank == code[0]) {
                            backCode = code[0]
                        };
                    });
                    data.pBankCategoryCode = backCode;
                    data.pAccountNumber = this.state.subBank;
                    //开户人,电话,身份证
                    data.accHolderName = formData.accHolderName;
                    data.accHolderTel = formData.accHolderTel;
                    data.accHolderCardId = formData.accHolderCardId;
                    //法人,电话,身份证,预留印章
                    data.legalPersonName = formData.legalPersonName;
                    data.legalPersonTel = formData.legalPersonTel;
                    data.legalPersonCardNo = formData.legalPersonCardNo;
                    //出纳,电话,身份证,预留印章
                    data.cashierName = formData.cashierName;
                    data.cashierTel = formData.cashierTel;
                    data.cashierCardNo = formData.cashierCardNo;
                    if(this.state.isEdit){
                        data.legalPersonSeal =this.state.uploadUrlLegal;
                        data.cashierSeal =this.state.uploadUrlCashier;
                    }else{
                        data.legalPersonSeal = AppConf.uploadFilePathIp + '/imgservice/download/' + this.state.uploadUrlLegal;
                        data.cashierSeal = AppConf.uploadFilePathIp + '/imgservice/download/' + this.state.uploadUrlCashier;
                    };
                    //是否开通网银,开通网银时间
                    data.ebankOpen = this.state.ebankOpen;
                    // let d = new Date('Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)');
                    let d = new Date(formData.ebankOpenTime);
                    let youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                    if (this.state.ebankOpen == "1") {
                        data.ebankOpenTime = youWant;
                    }
                    //是否开通银企直联,开通银企直连时间
                    data.b2eOpen = this.state.b2eOpen;
                    let d2 = new Date(formData.b2eOpenTime);
                    let youWant2 = d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                    if (this.state.b2eOpen == "1") {
                        data.b2eOpenTime = youWant2;
                    }
                    //密钥保管
                    data.keyCustodian = formData.keyCustodian;
                    data.passwordCustodian = formData.passwordCustodian;
                    if (this.state.isEdit) {
                        data.custodyId = Util.getQueryString('id')
                        postData.addr = Api.updateCustody;
                    }
                    else {
                        postData.addr = Api.addCustodyInfo;
                    }
                    //DATA
                    postData.data = JSON.stringify(data);
                    //提交数据
                    Util.comFetch(postData, (data) => {
                        message.success(this.state.isEdit ? '修改成功' : '保存成功');
                        this.props.history.goBack();
                    });
                }
            }});
    };
    //获取组织结构下拉数据
    getOrgsOfTre = () => {
        let requestParam = {};
        requestParam.code = userInfo.orgCode;
        requestParam.addr = Api.getOrgsOfTree;
        Util.comFetch(requestParam, (data) => {
            console.log("获取组织结构下拉数据", data.orgs);
            this.setState({
                    getOrgsOfTre: data.orgs
                });
            if(this.state.isEdit){
                this.getEditData();
            }else{
                this.getMyAccountByOrg()
            }
        });
    };

    TreeValue=(value,id)=>{
        console.log("树",value,id)
        this.setState({
            treeValue: value,
            OrgId: id
        })
    };
    //修改获取用户信息
    getEditData() {
        Util.comFetch(
            {
                addr: Api.findCustodyById,
                custodyId: Util.getQueryString('id')
            },
            (data) => {
                let remoteData = data.data;
                this.setState({
                    treeValue:remoteData.orgCode,
                },()=>this.getMyAccountByOrg());

                this.setState({
                    remoteData:remoteData,
                    // bank: remoteData.pBankCategoryCode,
                    // subBank: remoteData.pAccountNumber,
                    //是否开通网银
                    ebankOpen :remoteData.ebankOpen+"",
                    //是否开通银企直联
                    b2eOpen: remoteData.b2eOpen+"",


                    uploadUrlLegal:remoteData.legalPersonSeal,
                    uploadUrlLegalPreview: remoteData.legalPersonSeal,
                    uploadUrlCashier:remoteData.cashierSeal,
                    uploadUrlCashierPreview:remoteData.cashierSeal,

                    // treeValue:remoteData.orgCode,
                });
                let formData = {};
                console.log('往来账户,修改账户获取到的信息:', remoteData);
                //开户人,电话,身份证
                formData.accHolderName = remoteData.accHolderName;
                formData.accHolderTel = remoteData.accHolderTel;
                formData.accHolderCardId = remoteData.accHolderCardId;
                //法人,电话,身份证,预留印章
                formData.legalPersonName = remoteData.legalPersonName;
                formData.legalPersonTel = remoteData.legalPersonTel;
                formData.legalPersonCardNo = remoteData.legalPersonCardNo;
                // formData.legalPersonSeal = remoteData.legalPersonSeal;
                //出纳姓名,电话,身份证,预留印章
                formData.cashierName = remoteData.cashierName;
                formData.cashierTel = remoteData.cashierTel;
                formData.cashierCardNo = remoteData.cashierCardNo;
                // formData.cashierSeal = remoteData.cashierSeal;
                //密钥保管
                formData.keyCustodian= remoteData.keyCustodian;
                formData.passwordCustodian= remoteData.passwordCustodian;
                //时间
                let ebankT = moment(remoteData.ebankOpenTime);
                let b2eOpenT = moment(remoteData.b2eOpenTime);
                // this.setState({
                //     ebankOpenTime:ebankT,
                //     b2eOpenTime:b2eOpenT,
                // });
                formData.ebankOpenTime=ebankT;
                formData.b2eOpenTime=b2eOpenT;
                this.props.form.setFieldsValue(formData);
            }
        );
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.treeValue !== this.state.treeValue) {
            this.getMyAccountByOrg()
        }
        if (prevState.subBank !== this.state.subBank) {
            this.getDetail()
        }

    };

    //根据银行账号获取相关详情
    getDetail = () => {
        let requestParam = {};
        requestParam.addr = Api.getMyAccountBypAccountNumber;
        requestParam.pAccountNumber = this.state.subBank;
        Util.comFetch(requestParam, (data) => {
            console.log("相关详情", data.data[0].split(","));
            this.setState({
                bankDetail: data.data[0].split(",")
            });
        })
    };
    bankDetailS = (v) => {
        console.log("vvvvv", v)
        if (v == "CNY") {
            return "人民币"
        } else if (v == "USD") {
            return "美元"
        } else if (v == "JPY") {
            return "日元"
        }
    };

    getBase64=(img, callback)=> {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    beforeUpload=(file)=> {
        // const isJPG = file.type === 'image/jpeg';
        // if (!isJPG) {
        //     message.error('上传图片格式不正确!');
        // }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('上传图片过大!');
        }
        return isLt2M;
        // return isJPG && isLt2M;
    };
    //上传法人印章
    handleChangeLawMan = (info) => {
        console.log("info",info);
        if (info.file.status === 'done') {
            let  val=info.file.response.rspCode;
            if ( val !== '000000') {
                console.log("信息2" , val);
                this.setState({"uploadNameLegal":""});
                message.error('上传文件失败,请重新选择文件');
            } else {
                this.setState({
                    uploadUrlLegal: info.file.response.url,
                    uploadUrlLegalPreview: AppConf.uploadFilePathIp + '/imgservice/download/'+info.file.response.url,
                    'uploadNameLegal':info.file.name});
            }
            // this.getBase64(info.file.originFileObj, imageUrl => this.setState({ uploadUrlLegal:imageUrl}));
        }
    };
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
                    'uploadUrlCashier':info.file.response.url,
                    uploadUrlCashierPreview :AppConf.uploadFilePathIp + '/imgservice/download/'+ info.file.response.url,
                    'uploadNameCashier':info.file.name});
            }
            // this.getBase64(info.file.originFileObj, imageUrl => this.setState({ uploadUrlCashierBase64:imageUrl }));
        }
    };
    render() {
        const { uploadUrlLegalPreview,uploadUrlCashierPreview } = this.state;
        const uploadUrlLegal = this.state.uploadUrlLegal;
        const  uploadUrlCashier=this.state.uploadUrlCashier;
        const  upLoadM={
            name: 'img1',
            action: window.AppConf.imageApiPath,
            headers: {},
            data: {
                token: window.userInfo.token,
                addr: 'uploadFile',
                fileType: 1
            },
        };
        const {getFieldDecorator} = this.props.form;
        const state = this.state;
        const props = this.props;
        const {bank, banks, subBank, subBanks, bankAcc, bankAccs} = this.state;
        return (
            <div>
                <Form>
                    <div className="add-keep-information">
                        {/*---开户行名称---*/}
                        <div className="row">账户信息</div>

                        {this.state.getOrgsOfTre!==''  && <div className="row">
                            <span className="desc">组织机构:</span>
                            <div   style={{height:"30px"}}   className="form-item">
                                <Org
                                    ValueEdit={this.state.treeValue}
                                    OrgData={this.state.getOrgsOfTre}
                                    TreeValue={this.TreeValue}
                                />
                            </div>
                        </div>}
                        <div className="row"    style={{marginBottom:'20px'}}>
                            <span className="desc">开户行行别:</span>
                            <div className="form-item">
                                <Select className="common-left-input" value={bank} style={{width: 200}}
                                        onChange={this.bankChange}>
                                    {banks.map((item, index) => {
                                        return (<Option key={index} value={item.name}>{item.name}</Option>)
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="row" style={{marginBottom:'20px'}}>
                            <span className="desc">银行账号:</span>
                            <div className="form-item">
                                <Select className="common-left-input" value={subBank} style={{width: 200}}
                                        onChange={this.subBankChange}>
                                    {subBanks.map((item, index) => {
                                        return (<Option key={index} value={item.name}>{item.name}</Option>)
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="row">
                            <span className="desc">银行开户名称:</span>
                            <div className="form-item">{state.bankDetail[0]}
                            </div>
                        </div>
                        <div className="row">
                            <span className="desc">开户行名称:</span>
                            <div className="form-item">{state.bankDetail[1]}
                            </div>
                        </div>
                        <div className="row">
                            <span className="desc">币种:</span>
                            <div className="form-item">{this.bankDetailS(state.bankDetail[2])}
                            </div>
                        </div>
                        <div className="row">
                            <span className="desc">账户性质:</span>
                            <div className="form-item">{state.bankDetail[3]}

                            </div>
                        </div>
                        <div className="row">开户人信息</div>
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
                        <div className="row">法人信息</div>
                        <div className="row">
                            <span className="desc">法人姓名:</span>
                            <div className="form-item">
                                <FormItem
                                    hasFeedback
                                >
                                    {getFieldDecorator('legalPersonName', {
                                        rules: [{
                                            required: true, message: '请输入法人姓名',
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
                                        <Input placeholder="请输入法人姓名"/>
                                    )}
                                </FormItem>
                            </div>
                        </div>
                        <div className="row">
                            <span className="desc">法人电话:</span>
                            <div className="form-item">
                                <FormItem
                                    hasFeedback
                                >
                                    {getFieldDecorator('legalPersonTel', {
                                        rules: [{
                                            required: true, message: '请输入法人电话',
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
                                        <Input placeholder="请输入法人电话"/>
                                    )}
                                </FormItem>
                            </div>
                        </div>
                        <div className="row">
                            <span className="desc">法人身份证:</span>
                            <div className="form-item">
                                <FormItem
                                    hasFeedback
                                >
                                    {getFieldDecorator('legalPersonCardNo', {
                                        rules: [{
                                            required: true, message: '请输入法人身份证',
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
                                        <Input placeholder="请输入法人身份证"/>
                                    )}
                                </FormItem>
                            </div>
                        </div>
                        <div className="row">
                            <span className="desc">法人预留印章:</span>
                            <Upload
                                className="avatar-uploader"
                                // name="avatar"
                                showUploadList={false}
                                // action="//jsonplaceholder.typicode.com/posts/"
                                // action={window.AppConf.imageApiPath}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChangeLawMan}
                                {...upLoadM}
                            >
                                {
                                    uploadUrlLegal ?
                                        <img src={uploadUrlLegalPreview} alt="" className="avatar" /> :
                                        <Icon type="plus" className="avatar-uploader-trigger" />
                                }
                            </Upload>
                        </div>
                        <div className="row">出纳信息</div>
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
                        <div className="row"> 网银信息</div>
                        <div className="row">
                            <div className="desc" style={{width: "200px", marginLeft: "50px"}}>
                                <RadioGroup value={this.state.ebankOpen}
                                            onChange={(e) => this.setState({ebankOpen: e.target.value})}>
                                    <Radio value="1">已开通</Radio>
                                    <Radio value="2">未开通</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                        {this.state.ebankOpen == "1" && <div className="row">
                            <span className="desc">开通时间:</span>
                            <div className="form-item">
                                <FormItem
                                    hasFeedback
                                >
                                    {getFieldDecorator('ebankOpenTime', {
                                        rules: [{
                                            required: true, message: "请输入开通日期"
                                        }],
                                    })(
                                        <DatePicker
                                            className="search-time-range"  format={dateFormat}
                                        />
                                    )}
                                </FormItem>
                            </div>
                        </div>}
                        <div className="row">银企直联</div>
                        <div className="row">
                            <div className="desc" style={{width: "200px", marginLeft: "50px"}}>
                                <RadioGroup value={this.state.b2eOpen}
                                            onChange={(e) => this.setState({b2eOpen: e.target.value})}>
                                    <Radio value="1">已开通</Radio>
                                    <Radio value="2">未开通</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                        {this.state.b2eOpen == "1" && <div className="row">
                            <span className="desc">开通时间:</span>
                            <div className="form-item">
                                <FormItem
                                    hasFeedback
                                >
                                    {getFieldDecorator('b2eOpenTime', {
                                        rules: [{
                                            required: true, message: "请输入开通日期"
                                        }],
                                    })(
                                        <DatePicker
                                            className="search-time-range"  format={dateFormat}
                                        />
                                    )}
                                </FormItem>
                            </div>
                        </div>}
                        <div className="row">密钥保管</div>
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
                        <div className="button-style">
                            <Button type="primary"
                                    onClick={() => this.props.history.goBack()}>取消</Button>
                            <Button className="quit-btn-style" type="primary"
                                    onClick={this.postData}>{this.state.isEdit ? '确认修改' : '提交'}</Button>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}
AddKeepInformation = Form.create()(AddKeepInformation);
export default AddKeepInformation;


