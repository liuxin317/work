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
import 'moment/locale/zh-cn';
import './style.scss';
import  CashPay  from './CashPay.js';

import  TreeDroplist  from "../../common/TreeDroplist/index.js";

import  DetailAdd  from  "./detailsAdd.js";
import  TableDetails  from  "./tableDetails.js";
import  RuleConflict  from  "./RuleConflict.js";
import EditDialog from './EditDialog';

const TreeNode = TreeSelect.TreeNode;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

export default class ConfigurationRule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            searchName: "",
            pageNumber: 1,
            pageSize: 10,
            name: "",
            //往来对象名
            customerName: "",
            customerMulti: true,
            //获取的往来对象名
            objName: [],
            //获取的业务类型
            getOrderTypeData: [],
            // 业务类型名
            busTypeName: "",
            businessTypeVals: "",
            busTypeMulti: true,
            // 业务类型id
            busTypeId: "",
            //是否挂账
            handAccount: "",
            // 是否显示新增编辑弹框
            configVisible: false,
            // 当前处理的行的数据
            curRowData: null,
            value: undefined,
            // 付款方账户全部数据
            accData: {},
            // 付款方账户-银行
            bank: '',
            banks: [],
            // 付款方账户-银行支行
            subBank: '',
            subBanks: [],
            // 付款方账户-银行卡号
            bankAcc: '',
            bankAccs: [],
            // 付款方账户名称
            bankAccName: '',
            //规则名称
            ruleDefine: '',
            ruleDefineArray: [],
            detailsData: "",
            dataSource: "",
            // //判断是编辑还是添加
            // edit: true,
            //表格详情
            tableDetailVisible: false,
            //冲突页面
            conflictVisible: false,
            //冲突详情
            conflictData: [],
            //现在的数据
            lastPostData: null,
            //当前规则名字
            lastPostDataRuleDefine: "",
            //是否替换
            IsReplace: "",
            // 配置规则新增或编辑
            isEdit: false,
            searchName: "",
            // 编辑某一行
            rowId: "",
            //分期还是即付
            tab:'1',
            //表格详情 开户行别
            tableDetailBackCode:''
        };
    }

    componentDidMount() {
        this.search();
        this.getAccount();
    };

    //添加配置规则
    addConfig = () => {
        this.setState({
            configVisible: true,
            curRowData: null,
            isEdit: false
        });
        return;
    };
    ruleNameV = (event, type) => {
        let ruleNameV = event.target.value;
        ruleNameV = ruleNameV.replace(/(^\s+)|(\s+$)/g, "").replace (/&|@|#|￥|%/g, "");
        this.setState({'searchName': ruleNameV})
    };
    search = (pageSize, pageNumber) => {
        let requestParam = {};
        requestParam.addr = Api.getRuleConf;
        requestParam.pageSize = pageSize ? pageSize : this.state.pageSize;
        requestParam.pageNumber = pageNumber ? pageNumber : this.state.pageNumber;
        requestParam.keyword = this.state.searchName;
        requestParam.handAccount = true;

        //获取用户信息
        Util.comFetch(requestParam, (data) => {
            console.log("table数据", data);
            this.setState({
                dataSource: data.data.rows,
                tableDataTotal: data.data.total
            });
        });
    };

    /**
     * 进入冲突弹框,解决掉所有冲突后返回的新的规则配置数据
     * @param conf 规则配置数据
     */
    conflictSolved = (conf) => {
        console.log('conf', conf);
        const {lastPostData} = this.state;
        // this._lastPostData
        let postData = Object.assign({}, lastPostData);
        postData.conf = conf;
        // 调用第二个接口,保存规则配置
        let requestParam = {};
        requestParam.data = JSON.stringify(postData);
        requestParam.addr = Api.saveRuleConf;
        Util.comFetch(requestParam, (dataS) => {
            console.log("提交成功", dataS);
            if (this.state.isEdit) {
                this.search()
            } else {
                this.search(10, 1);
                this.setState({
                    currentPage: 1,
                })
            }
            this.setState({
                configVisible: false
            });
            message.success('提交成功');
        })
    };
    getRuleDefineArray = (data, ruleDefine) => {
        console.log("编辑里拿的data", data, "拿来的ruleDefine", ruleDefine)
        this.setState({
            ruleDefineArray: data,
            ruleDefine: ruleDefine,
        })
    };
    //规则定义名称
    ruleDefine = (value) => {
        this.state.ruleDefineArray.map((v, i) => {
            if (v.id == value) {
                this.setState({
                    ruleDefine: value,
                    detailsData: v
                });
                console.log("detailsData", v)
            }
        })
    };
    //获取当前规则
    postDataRuleDefine = (value) => {
        console.log("v获取当前规则", value)
        let ruleDefineName = '';
        this.state.ruleDefineArray.some((item, index) => {
            if (item.id == value) {
                ruleDefineName = item.name;
                console.log("获取当前规则", item.name)
                return true;
            }
        });
        return ruleDefineName;
    };

    // 获取付款方账户
    getAccount() {
        Util.comFetch({
            addr: Api.getPayerAccount
        }, (re) => {
            this.setState({
                getAccountData: re.data
            });
        })
    }
    //详情
    showDetails = (row) => {
        console.log('详情row:', row);
        let requestParam = {};
        requestParam.addr = Api.findOneRuleConf;
        requestParam.ruleConfId = row.id;
        Util.comFetch(requestParam, (data) => {
            console.log("某行的详情", data.data);
            let editItemData = data.data;

            let  backCode="";
            this.state.getAccountData.map((v,i)=>{
                let  code=v.split(",")
                console.log("银行",code)
                if(editItemData.pBankCategoryCode==code[4]){
                    backCode=code[0]
                };
            });
            console.log("开户行",backCode)
            this.setState({
                tableDetailBackCode:backCode,
                // 某一行的详情

                tableDetail: editItemData,
                tableDetailVisible: true,
            })
        });
    };
    //编辑规则配置
    editItem = (row) => {
        this.setState({
            configVisible: true,
            curRowData: row,
            isEdit: true,
            rowId: row.id,
        });
        return;
        console.log('编辑的row:', row);
    };
    //删除规则配置
    deleteItem = (row) => {
        console.log('删除的row:', row);
        let requestParam = {};
        requestParam.addr = Api.deleteRuleConf;
        requestParam.ruleConfId = row.id;
        Util.comFetch(requestParam, (data) => {
            console.log("某行的删除", data.data)
            message.success('删除成功');
            this.search();
        });
    };
    RuleConflictClose = () => {
        this.setState({conflictVisible: false})
    };
    // 保存规则配置
    saveConfig = (data) => {
        console.log("填写的数据", data)
        let requestParam = {};
        requestParam.data = JSON.stringify(data);
        requestParam.addr = Api.findConflictConf;
        // 保存提交的数据,调用第一个接口查重通过后,再调用第二个接口配置规则
        this.setState({
            lastPostData: data
        });
        if (data.conf.length >= 1) {
            if (data.conf[0].customerName && data.conf[0].busTypeName) {
                Util.comFetch(requestParam, (data) => {
                    if (data.data.length > 0) {
                        let lastRule = this.postDataRuleDefine(this.state.ruleDefine);
                        this.setState({
                            lastPostDataRuleDefine: lastRule,
                            conflictVisible: true,
                            conflictData: data.data,
                        })
                    } else {
                        requestParam.addr = Api.saveRuleConf;
                        Util.comFetch(requestParam, (dataS) => {
                            console.log("提交成功", dataS);
                            if (this.state.isEdit) {
                                this.search();
                            } else {
                                this.setState({
                                    currentPage: 1
                                });
                                this.search(10, 1);
                            }
                            this.setState({
                                configVisible: false
                            });
                            message.success('提交成功');
                        })
                    }
                });
            } else {
                if (data.conf[0].customerName) {
                    message.info("请选择业务类型!")
                } else if (data.conf[0].busTypeName) {
                    message.info("请选择收支对象!")
                }
            }
        } else {
            message.info("请选择收支对象和业务类型!")
        }
    };
    handleTabChange=(e)=>{
        this.setState({
            tab:e.target.value,
        })
    };
    render() {
        const state = this.state;
        //table表格
        const self = this;
        const paginationOpt = {
            current: this.state.currentPage,
            showTotal: (total, range) => `共 ${total} 条`,
            total: this.state.tableDataTotal,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                this.setState({'pageSize': pageSize, 'pageNumber': 1, 'currentPage': 1});
                this.search(pageSize, 1);
            },
            onChange: (page, size) => {
                this.setState({'pageNumber': page, 'currentPage': page});
                this.search(null, page);
            },
        };
        const columns = [
            {
                title: '规则名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '规则模板',
                dataIndex: 'ruleDefine.name',
                key: 'ruleDefine.name',
            },
            {
                title: '收支对象名称',
                dataIndex: 'customerName',
                key: 'customerName',
            },
            {
                title: '业务类型',
                dataIndex: 'busTypeName',
                key: 'busTypeName',
            },
            // {
            //     title: '挂往来',
            //     dataIndex: '',
            //     key: '',
            //     render: (value, row) => (
            //         <span>{row.handAccount == true ? '是' : '否'}</span>
            //     )
            // },
            {
                title: '付款方账号',
                dataIndex: 'pAccountNumber',
                key: 'pAccountNumber',
            },
            {
                title: '付款方账号开户行行别',
                dataIndex: 'pBankCategoryName',
                key: 'pBankCategoryName',
            },
            {
                title: '操作',
                dataIndex: 'accountId',
                key: 'accountId',
                width: 200,
                render: (value, row) => (
                    <div key="accountId">
                        <a className="opreate-style"
                           onClick={() => this.editItem(row)} href="javascript:void(0)">编辑</a>
                        <Popconfirm title="确定删除?" onConfirm={() => this.deleteItem(row)}>
                            <a className="opreate-style" href="javascript:void(0)">删除</a>
                        </Popconfirm>
                        <a className="opreate-style" href="javascript:void(0)"
                           onClick={() => this.showDetails(row)}>详情</a>
                    </div>
                )
            }];
        return (
            <div>
                <div className="CashTab page-container">
                <p style={{marginBottom:"10px"}}  className="title"><span className="light-black">当前位置:</span>规则配置</p>
                    <Radio.Group value={this.state.tab} onChange={this.handleTabChange}>
                        <Radio.Button value="1">挂账</Radio.Button>
                        <Radio.Button value="2">即付</Radio.Button>
                    </Radio.Group>
                </div>
                {this.state.tab=='1'?<div className="trans-Ledger page-container">
                    <div>
                        <Input placeholder="用途/收支对象名字/付款方账号" style={{width: "300px"}} value={this.state.searchName}
                               onChange={(event) => {
                                   this.ruleNameV(event, 1)
                               }}
                               className="search-input"/>

                        <Button style={{marginLeft: "20px"}}  className="search-item-common" type="primary" shape="circle"
                                onClick={() => this.search()} icon="search"/>

                        <Button style={{float:'right',width:'32px'}}
                                onClick={() => this.addConfig()}
                                type="primary"  icon="plus"/>
                    </div>
                    <div>
                        <Table style={{ marginTop: "20px"}} className="common-margin15"
                               dataSource={this.state.dataSource}
                               columns={columns}
                               pagination={paginationOpt}
                               bordered={true}/>
                    </div>
                    {
                        state.configVisible ?
                            <EditDialog
                                getRuleDefineArray={this.getRuleDefineArray}
                                isEdit={state.isEdit}
                                ok={this.saveConfig}
                                close={() => {
                                    this.setState({configVisible: false})
                                }}
                                curRowData={state.curRowData}/> :
                            null
                    }

                    {
                        this.state.tableDetailVisible && <TableDetails
                            close={() => {
                                this.setState({tableDetailVisible: false})
                            }}
                            tableDetailBackCode={this.state.tableDetailBackCode}
                            visible={this.state.tableDetailVisible}
                            tableDetail={this.state.tableDetail}
                        />
                    }

                    {
                        state.conflictVisible ?
                            <RuleConflict
                                isEdit={state.isEdit}
                                RuleConflictClose={this.RuleConflictClose}
                                conflictSolved={this.conflictSolved}
                                postData={state.lastPostData}
                                visible={state.conflictVisible}
                                conflictData={state.conflictData}
                                postDataRuleDefine={state.lastPostDataRuleDefine}
                            /> :
                            null
                    }
                </div>:null}
                {this.state.tab=='2'? <CashPay/>:null}
            </div>
        )
    }
}