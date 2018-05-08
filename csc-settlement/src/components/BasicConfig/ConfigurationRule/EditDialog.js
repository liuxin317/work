import React from 'react';
import {
    Radio,
    Input,
    DatePicker,
    Button,
    message,
    InputNumber,
    Modal,
    Table,
    Select,
    Checkbox,
    Row,
    Col,
    Popconfirm,
    TreeSelect
} from 'antd';
import  DetailAdd  from  "./detailsAdd";
import  TreeDroplist  from "../../common/TreeDroplist";
const RadioGroup = Radio.Group;
const Option = Select.Option;
// 新增,编辑规则配置弹框
export default class ConfigurationRule extends React.Component {
    constructor(props) {
        super(props);
        let handAccount = '';
        if (props.isEdit) {
            handAccount = props.curRowData.handAccount == true ? "" : "1";
        }
        this.state = {
            addId: '',
            // 规则名字
            name: '',

            rowId:"",
            // 往来对象接口返回列表
            objName: [],
            customInitial: [],
            // 往来对象选择数据
            customerName: "",
            // 往来对象是否多选
            customerMulti: true,
            // 业务类型接口返回列表
            getOrderTypeData: [],
            bussInitial: [],
            // 业务类型选择数据
            busTypeName: "",
            businessTypeVals:[],
            // 业务类型是否多选
            busTypeMulti: true,
            // 挂账标志 '1' 否 '' 挂账
            handAccount: '',
            // handAccount: handAccount,
            // 付款方账户全部数据
            accData: {},
            // 银行, 开户行名, 卡号
            bank: '',
            banks: [],
            subBank: '',
            subBanks: [],
            bankAcc: '',
            bankAccs: [],
            // 规则
            ruleDefine: '',
            // 规则下拉框数据
            ruleDefineArray: [],
            // 规则详情数据
            detailsData: "",
            //银行数据
            getAccountData:[],

            // 银行列表请求过了
            bankRequested: false,
        };
    }
    componentWillMount() {
        this.getObjName();
        this.getOrderType();
        this.getAccount();
        this.getRules();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.handAccount !== this.state.handAccount) {
            this.getRules();
        }
    }
    //获取往来对象名
    getObjName = () => {
        const { isEdit, curRowData } = this.props;
        let requestParam = {};
        let initialSels = [];
        requestParam.addr = Api.findCustomerNames;
        //获取用户信息
        Util.comFetch(requestParam, (data) => {
            let treeData = data.data.map((item, index) => {
                if (isEdit) {
                    if (item === curRowData.customerName) {
                        initialSels = [{label: item, value: item}];
                    }
                }
                return {
                    label: item,
                    value: item,
                    children: null
                };
            });
            this.setState({
                objName: treeData,
                customInitial: initialSels,
            });
        });
    };

    //获取业务类型
    getOrderType = () => {
        const { isEdit, curRowData } = this.props;
        let requestParam = {};
        let initialSels = [];
        requestParam.addr = Api.getOrderType;
        Util.comFetch(requestParam, (data) => {
            let treeData = Util.formatBusTypeData(data.list);
            if (isEdit) {
                let buss = this.getBussDataById(treeData, curRowData.busTypeId);
                if (buss) {
                    initialSels.push(buss)
                }
            }
            this.setState({
                getOrderTypeData: treeData,
                bussInitial: initialSels,
            })
        });
    }

    // 根据业务类型id,找到下拉选框数据中对应的业务类型对象
    getBussDataById(treeData, id) {
        let buss = null;
        treeData.some((item, index) => {
            if (item.id === id) {
                buss = item;
            } else if (item.children && item.children.length) {
                buss = this.getBussDataById(item.children, id);
            }
            return buss;
        });
        return buss;
    }
    // 获取规则定义列表
    getRules() {
        const { curRowData, isEdit } = this.props;
        let requestParam = {};
        requestParam.addr = Api.getRuleDefine;
        requestParam.pageSize = 10000;
        requestParam.pageNumber = 1;
        requestParam.payLimit = this.state.handAccount;
        Util.comFetch(requestParam, (data) => {
            this.setState({
                ruleDefineArray: data.data.rows,
            });
            if (isEdit){
                let matchRule = null;
                let hasOption = data.data.rows.some((item) => {
                    if (item.id === curRowData.ruleDefine.id) {
                        matchRule = item;
                        return true;
                    }
                });
                console.log(hasOption);
                if (hasOption) {
                    this.setState({
                        ruleDefine: matchRule.id + "",
                        detailsData: matchRule
                    })
                } else {
                    this.setState({
                        ruleDefine: data.data.rows[0].id + "",
                        detailsData: data.data.rows[0]
                    })
                }
            } else {
                this.setState({
                    ruleDefine: data.data.rows[0].id + "",
                    detailsData: data.data.rows[0]
                })
            }

        });
    }
    // 编辑时,获取规则配置详情数据
    getDetail() {
        const { curRowData } = this.props;
        let requestParam = {};
        requestParam.addr = Api.findOneRuleConf;
        requestParam.ruleConfId = curRowData.id;
        Util.comFetch(requestParam, (data) => {
                console.log("某行的编辑", data.data);
                let editItemData = data.data;
                let businessTypeV={};
                let businessTypeVals=[];
                    businessTypeV.label=editItemData.busTypeName;
                    businessTypeV.id=editItemData.busTypeId;
                    businessTypeVals.push(businessTypeV);
                let  backCode="";
                this.state.getAccountData.map((v,i)=>{
                    let  code=v.split(",")
                    console.log("银行",code)
                    if(editItemData.pBankCategoryCode==code[4]){
                        backCode=code[0]
                        };
                    });
                this.setState({
                    name: editItemData.name,
                    //是否是新增
                    addId: "1",
                    rowId:editItemData.id,
                    //往来对象名
                    customInitial: editItemData.customerName.split(","),
                    // customerName: editItemData.customerName + "",
                    customerMulti: false,
                    // 业务类型名
                    busTypeName: editItemData.busTypeName,
                    businessTypeVals:businessTypeVals,
                    busTypeMulti: false,
                    // 业务类型id
                    busTypeId: editItemData.busTypeId + "",
                    //是否挂账
                    handAccount: editItemData.handAccount == true ? "" : "1",
                    // 付款方账户-银行
                    bank: backCode+'',
                    // 付款方账户-银行账户名
                    subBank: editItemData.pAccountName + "",
                    // 付款方账户-银行卡号
                    bankAcc: editItemData.pAccountNumber + "",
                    // 付款方账户名称
                    bankAccName: '',
                    //规则名称
                    ruleDefine: editItemData.ruleDefineModel.id + "",
                    //规则详情
                    detailsData: editItemData.ruleDefineModel,
                });
            }
        );

    }
    // 获取付款方账户
    getAccount() {
        Util.comFetch({
            addr: Api.getPayerAccount
        }, (re) => {
            if (this.props.isEdit) {
                this.getDetail();
            }
            //转成银行-账户名-卡号的数据结构
            let reData = re.data;
            this.setState({
                getAccountData:re.data
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
            // if (!this.props.isEdit) {
            //     this.calcAccSelect(accData);
            // }
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
        this.setState({subBank: value});
        this.calcAccSelect(this.state.accData, this.state.bank, value);
    };
    // 付款方选择卡号
    bankAccChange = (value) => {
        this.setState({bankAcc: value});
    };
    //是否挂账
    // handAccount = (e) => {
    //     this.setState({
    //         handAccount: e.target.value
    //     });
    // };
    //规则定义选择
    ruleDefine = (value) => {
        this.state.ruleDefineArray.map((v, i) => {
            if (v.id == value) {
                this.setState({
                    ruleDefine: value,
                    detailsData: v
                });
            }
        })
    };
    // 选择的业务类型
    businessType = (vals) => {
        console.log("业务类型vals",vals)
        if (vals.length){
            let businessTypeArry = [];
            let businessTypeIdArry = [];
            vals.map((v, i) => {
                let valueName = v.label;
                let valueId = v.id;
                businessTypeArry.push(valueName);
                businessTypeIdArry.push(valueId);
                this.setState({
                    businessTypeVals: vals,
                    busTypeName: businessTypeArry,
                    busTypeId: businessTypeIdArry,
                });
                //编辑时禁止多选
                if (this.props.isEdit){
                    this.setState({
                        busTypeMulti:false,
                        customerMulti: false,
                    })
                }else{
                    if (vals.length > 1) {
                        this.setState({
                            customerMulti: false,
                        })
                    } else {
                        this.setState({
                            customerMulti: true,
                        })
                    }
                }
            });
        }else{
            if (this.props.isEdit){
                this.setState({
                    businessTypeVals:[],
                    busTypeMulti:false,
                    customerMulti: false,
                })
            }else{
                this.setState({
                    businessTypeVals:[],
                    customerMulti: true,
                })
            }
        }
    }

    // 对象名字
    setObjName = (vals) => {
        console.log("对象名称vals",vals)
        let setObjNameArry = [];
        if (vals.length) {
            vals.map((v, i) => {
                let value = v.label;
                setObjNameArry.push(value);
                console.log("选择的对象",setObjNameArry)
                this.setState({
                    customInitial:setObjNameArry,
                    // customerName: setObjNameArry,
                });
                //编辑的时候禁止多选
                if (this.props.isEdit){
                    this.setState({
                        busTypeMulti:false,
                        customerMulti: false,
                    })
                }else{
                    this.setState({
                        busTypeMulti: setObjNameArry.length > 1 ? false : true,
                    });
                }
            });
        } else {
            if (this.props.isEdit){
                this.setState({
                    customInitial: [],
                    busTypeMulti:false,
                    customerMulti: false,
                })
            }else{
                this.setState({
                    customInitial: [],
                    busTypeMulti: true
                });
            }
        }
    }

    // 根据选择的往来对象和业务类型,获取对象和业务类型配对数组
    getConf() {
        const {customerName, busTypeName, busTypeId, businessTypeVals,customInitial} = this.state;
        let conf = [];
        if (customInitial.length === 0 || businessTypeVals.length === 0) {
            conf.push({
                id: '',
                customerName: customInitial.length ? customInitial[0] : '',
                busTypeName: businessTypeVals.length ? businessTypeVals[0] : ''
            });
        } else if (customInitial.length > 1) {
            customInitial.forEach(item => conf.push({
                "id": this.state.addId,
                "customerName": item,
                "busTypeName": busTypeName[0],
                "busTypeId": busTypeId[0]
            }));
        } else {
            businessTypeVals.forEach(item => conf.push({
                "customerName": customInitial[0],
                "busTypeName": item.label,
                "busTypeId": item.id
            }));
        }
        return conf;
    }

    cancel = () => {
        this.props.close();
    };

    ok = () => {
        const state = this.state;
        let data = {};
        data.name = state.name;
        data.conf = this.getConf();
        console.log("data.conf",data.conf);
        data.handAccount = state.handAccount == "" ? true : false;
        let  backCode="";
        this.state.getAccountData.map((v,i)=>{
            let  code=v.split(",")
            console.log("银行",code)
            if(state.bank==code[0]){
                backCode=code[4]
            };
        });
        data.pBankCategoryCode = backCode;
        data.pAccountName = state.subBank;
        data.pAccountNumber = state.bankAcc;
        if(this.props.isEdit){
            data.id=this.state.rowId;
        };
        data.ruleDefineId = parseInt(state.ruleDefine);
        this.props.getRuleDefineArray(state.ruleDefineArray,state.ruleDefine);
        if(data.name==""){
           message.info("请输入规则名字!")
        }else{
            this.props.ok(data);
             }
        };
    render() {
        const state = this.state;
        const props = this.props;
        const { bank, banks, subBank, subBanks, bankAcc, bankAccs } = this.state;
        return (
            <Modal
                wrapClassName="addConfig"
                width={800}
                title={this.props.isEdit?"编辑规则配置":"新增规则配置"}
                footer={null}
                closable={true}
                onCancel={this.cancel}
                visible={true}
                maskClosable={false}
            >
                <Row>
                    <Col className="addConfig-left" span={11}>
                        <div className="common-left">规则名字:
                            <Input value={state.name} require="require"
                                   className="common-left-input"
                                   onChange={(event) => this.setState({'name': event.target.value})}
                                   type="text"/>
                        </div>
                        <div className="common-left">收支对象名称:
                            <TreeDroplist 
                                data={state.objName}
                                edit={this.props.isEdit}
                                multi={state.customerMulti}
                                initialSels={state.customInitial}
                                onChg={this.setObjName}
                            />
                        </div>
                        <div className="common-left">业务类型:
                            <TreeDroplist
                                edit={this.props.isEdit}
                                data={state.getOrderTypeData}
                                multi={state.busTypeMulti}
                                initialSels={state.bussInitial}
                                onChg={(vals) => {
                                    this.businessType(vals)
                                }}
                            />
                        </div>
                        {/*<div className="common-left" style={{marginRight: "105px"}}>挂账:*/}
                            {/*<RadioGroup style={{marginLeft: "20px"}} value={state.handAccount}*/}
                                        {/*onChange={this.handAccount}>*/}
                                {/*<Radio value="">是</Radio>*/}
                                {/*<Radio value="1">否</Radio>*/}
                            {/*</RadioGroup>*/}
                        {/*</div>*/}
                        <div className="common-left" style={{width: "330px",fontSize:'16px' ,fontWeight:'bold' ,marginBottom:"10px",paddingTop:"10px" }}>付款方信息:</div>
                        <div className="common-left">开户行行别:
                            <Select className="common-left-input" value={bank} style={{width: 200}}
                                    onChange={this.bankChange}>
                                {banks.map((item, index) => {
                                    return (<Option key={index} value={item.name}>{item.name}</Option>)
                                })}
                            </Select>
                        </div>
                        <div className="common-left">银行开户名称:
                            <Select className="common-left-input" value={subBank} style={{width: 200}}
                                    onChange={this.subBankChange}>
                                {subBanks.map((item, index) => {
                                    return (<Option key={index} value={item.name}>{item.name}</Option>)
                                })}
                            </Select>
                        </div>
                        <div className="common-left">银行开户账号:
                            <Select className="common-left-input" value={bankAcc} style={{width: 200}}
                                    onChange={this.bankAccChange}>
                                {bankAccs.map((item, index) => {
                                    return (<Option key={index} value={item.name}>{item.name}</Option>)
                                })}
                            </Select>
                        </div>
                    </Col>
                    <Col span={13}>
                        <div style={{marginLeft:"100px"}}>规则模板:
                            <Select value={state.ruleDefine} style={{width: 120, marginLeft: 10}}onChange={this.ruleDefine}>
                                    {state.ruleDefineArray.map((v, i) => <Option key={i} value={v.id + ""}>{v.name}</Option>)}
                            </Select>
                        </div>
                        <DetailAdd
                            DetailsData={state.detailsData}
                        />
                    </Col>
                </Row>
                <div style={{width: 200, margin: "auto"}}>
                    <Button onClick={this.cancel}
                            style={{marginRight: "30px",backgroundColor:'#ccc'}}>取消</Button>
                    <Button onClick={this.ok} type="primary">确认</Button>
                </div>
            </Modal>
        );
    }
}
