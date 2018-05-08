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
    Popconfirm
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './style.scss';
import utils from "../../../utils/index";
import Page from "../../common/Page/index";
import InstallmentRatio from './InstallmentRatio';
// import InputNumber from "antd/es/input-number/index.d";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;
//月结算开始日期
const children = [];
for (let i = 1; i < 31; i++) {
    children.push(<Option key={i} value={i + ''}>{i}日</Option>);
}
const time = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
// 规则定义
export default class DefinitionRule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            pageSize: 10,
            //刷新数据
            dataSource: [],
            ruleName: "",
            //请求checkBox 支付方式和支付渠道
            payModeArray: [],
            payChanleArray: [],
            name: "",
            //方式
            payMode: "",
            //渠道
            payChannel: "",
            //额度
            payLimit: "1",
            //结算类型
            settleType: "1",
            //月结起始日
            settleBeginDay: "1",
            //延迟天数
            latestPayDay: "",
            //分期次数
            instalmentCnt: "",
            //分期间隔
            instalmentInterval: "1",
            //分期类型自定义
            instalmentIntervalType: "1",
            //分期类型自定义时间
            timeNo: [],
            //分期比例类型
            instalmentRatio: "1",
            //分期比例，以逗号分隔
            ratio: [],

            currentPage: 1,
            value: "",
            currency: "",
            //添加规则模态
            agingVisible: false,
            //说明模态
            startExplain: false,
            limitConfigExplain: false,
            //设置模态
            intervalSetVisible: false,
            ratioSetVisible: false,
            //详情模态
            Details: false,
            //详情数据
            DetailsData: "",
            //间隔详情
            intervalDetailsVisible: false,
            //比例详情
            ratioDetailsVisible: false,
            //表格间隔详情
            TableIntervalDetailsVisible: false,
            //表格比例详情
            TableRatioDetailsVisible: false,
            //分期间隔详情数组
            DetailsDataTimeNo: [],
            //分期比例详情数组
            DetailsDataRatio: [],
            //是否点击的编辑
            edit: false,
            //是否关联规则配置
            confs: "0",
        };
    }

    componentDidMount() {
        this.getSelectData();
        this.search();
    };

    ruleNameV = (event, type) => {
        let ruleNameV = event.target.value;
        ruleNameV = ruleNameV.replace(/(^\s+)|(\s+$)/g, "").replace (/&|@|#|￥|%/g, "");
        this.setState({'ruleName': ruleNameV})
    };
    //验证比例;
    sumRatio = (vals) => {
        let sum = 0;
        let addsum = (vals) => {
            for (var i = 0; i < vals.length; i++) {
                sum += parseFloat(vals[i]);
            }
            return sum;
        };
        addsum(vals);
        console.log("sum", sum)
        if (sum !== 100) {
            message.info("请输入正确的比例")
        } else {
            this.setState({
                ratio: vals,
                ratioSetVisible: false
            })
        }
    }
    hint = (type) => {
        if (this.state.instalmentCnt == "" || !this.state.instalmentCnt) {
            message.info("请输入分期次数!")
        } else {
            if (type == "1") {
                this.setState({'intervalSetVisible': true})
            }
            else if (type == "2") {
                if (this.state.instalmentInterval == "0") {
                    if (this.state.timeNo.length >= 1) {
                        this.setState({'ratioSetVisible': true})
                    } else {
                        message.info("请输入自定义分期时间间隔!")
                    }
                } else {
                    this.setState({'ratioSetVisible': true})
                }

            }
        }
        ;
    };
    //添加规则
    addRule = () => {
        this.setState({
            //是否关联规则配置
            confs: "0",
            //方式
            payMode: this.state.payModeArray[0].code,
            //渠道
            payChannel: this.state.payChanleArray[0].code,
            ruleName: "",
            name: "",
            //额度
            payLimit: "1",
            //结算类型
            settleType: "1",
            //月结起始日
            settleBeginDay: "1",
            //延迟天数
            latestPayDay: "",
            //分期次数
            instalmentCnt: "",
            //分期间隔
            instalmentInterval: "1",
            //分期类型自定义
            instalmentIntervalType: "1",
            //分期类型自定义时间
            timeNo: [],
            timeNoTwo: [],
            //分期比例类型
            instalmentRatio: "1",
            //分期比例，以逗号分隔
            ratio: [],
            'agingVisible': true,
            //是否点击的编辑
            edit: false,
        });
    }
    getSelectData = () => {
        //支付方式,支付渠道的下拉框数据获取
        let apiArrayCheckBox = [];
        apiArrayCheckBox.push({api: "payMode", target: 'payModeArray'});
        apiArrayCheckBox.push({api: "payChannel", target: 'payChanleArray'});
        for (let i = 0; i < apiArrayCheckBox.length; i++) {
            Util.comFetch(
                {
                    addr: Api.getDropdownList,
                    dictType: apiArrayCheckBox[i].api
                },
                (data) => {
                    console.log("下拉获取数据", data)
                    this.setState({
                            [apiArrayCheckBox[i].target]: Util.getDropDownListUtil(data.data.rows),
                        }
                    )
                }
            );
        }
    };
    //付款方式事件
    payMethod = (value) => {
        console.log("拿到的付款方式下拉", this.state.payModeArray);
        console.log(`selected ${value}`);
        this.setState({
            payMode: value,
        });
    };
    //付款渠道
    payChannel = (value) => {
        console.log(`selected ${value}`);
        this.setState({
            payChannel: value,
        });
    };
    //付款额度单选
    payLimit = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            payLimit: e.target.value,
        });
    };
    //结算类型
    settlementType = (value) => {
        console.log('结算类型', value);
        this.setState({
            settleType: value,
        });
    };
    //月结起始日
    settleBeginDay = (value) => {
        console.log(`Selected: ${value}`);
        this.setState({
            settleBeginDay: value,
        });
    };
    //延迟付款天数
    latestPayDay = (e) => {
        this.setState({latestPayDay: e});
    };
    limitTime = (value) => {
        // let limitV = e.target.value;
        // limitV = limitV.replace(/[^\d]/g, '');
        // // 判断范围
        // limitV = limitV < 2 ? 2 : limitV > 13 ? 13 : limitV;
        console.log("次数", value);
        this.setState({instalmentCnt: value});
    };
    //间隔时间
    instalmentInterval = (value) => {
        console.log('间隔时间', value);
        this.setState({
            instalmentInterval: value,
        });
    };
    //间隔时间类型
    changeIntervalType(event) {
        console.log('间隔时间类型', event);
        this.setState({
            instalmentIntervalType: event.target.value,
            timeNo: [],
        });
    };

    //分期比例
    installmentRatio = (value) => {
        console.log('分期比例', value);
        this.setState({
            instalmentRatio: value,
        }, this.emptyRatio());
    };
    emptyRatio = () => {
        if (this.state.instalmentRatio == "1") {
            this.setState({
                ratio: []
            })
        }
    };
    //起算日期
    Startdate = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };
    //月多选框
    intervalMouth = (checkedValues) => {
        console.log('月checked =', checkedValues);
        this.setState({timeNo: checkedValues});
    };
    //周多选框
    intervalWeek = (checkedValues) => {
        console.log('周checked = ', checkedValues);
        this.setState({timeNo: checkedValues});
    };
    //天多选框
    intervalDay = (checkedValues) => {
        console.log('天checked = ', checkedValues);
        this.setState({timeNo: checkedValues});
    };
    //年多选框
    intervalYear = (checkedValues) => {
        console.log('年checked = ', checkedValues);
        this.setState({timeNo: checkedValues});
    };
    // 提交间隔时间
    ok = () => {
        if (this.state.timeNo.length != this.state.instalmentCnt) {
            message.info("分期次数为:" + (this.state.instalmentCnt) + "次,请选择" + (this.state.instalmentCnt) + "个付款日期")
        } else(
            this.setState({
                timeNo: this.state.timeNo.sort((a, b) => (a - b)),
                timeNoTwo: this.state.timeNo.sort((a, b) => (a - b)),
                intervalSetVisible: false
            })
        );
        console.log('提交checked = ', this.state.timeNo);
    };
    //提交输入比例
    ratio = () => {
        console.log('提交比例 = ', this.state.timeNo);
        this.setState({
            ratioSetVisible: false
        });
    };
    //搜索
    search = (pageSize, pageNumber) => {
        let requestParam = {};
        requestParam.addr = Api.getRuleDefine;
        requestParam.pageSize = pageSize ? pageSize : this.state.pageSize;
        requestParam.pageNumber = pageNumber ? pageNumber : this.state.pageNumber;
        requestParam.name = this.state.ruleName;
        //获取用户信息
        Util.comFetch(requestParam, (data) => {
            console.log("数据", data);
            this.setState({
                dataSource: data.data.rows,
                tableDataTotal: data.data.total
            });
        });
    };
    //判断是否是关联
    postDataIs = (data) => {
        let self = this;
        let requestParam = {};
        requestParam.data = JSON.stringify(data);
        if (this.state.edit) {
            requestParam.addr = Api.updateRuleDefine;
        } else {
            requestParam.addr = Api.addRuleDefine;
        }
        if (this.state.confs != "0") {
            confirm({
                title: '确定同步更新规则配置中的数据?',
                // content: 'Some descriptions',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    console.log("requestParam", requestParam);
                    Util.comFetch(requestParam, (data) => {
                        message.success('提交成功');
                        self.setState({agingVisible: false,}, () => {
                            if (self.state.edit) {
                                self.search()
                            } else {
                                self.setState({
                                    currentPage: 1,
                                })
                                self.search(10, 1)
                            }
                        })
                    });
                },
                onCancel() {
                },
            });
        } else {
            console.log("requestParam", requestParam);
            Util.comFetch(requestParam, (data) => {
                message.success('提交成功');
                this.setState({agingVisible: false,}, () => {
                    if (this.state.edit) {
                        self.search()
                    } else {
                        self.setState({
                            currentPage: 1,
                        })
                        self.search(10, 1)
                    }
                })
            });
        }
    };
    postData = () => {
        // let requestParam = {};
        let data = {};
        if (this.state.edit) {
            data.id = this.state.id;
        }
        //规则名字
        data.name = this.state.name;
        //付款方式
        data.payMode = this.state.payMode;
        //付款渠道
        data.payChannel = this.state.payChannel;
        //付款额度
        data.payLimit = this.state.payLimit;
        //结算类型
        data.settleType = this.state.settleType;
        if (this.state.settleType == "4") {
            //月结起始日
            data.settleBeginDay = this.state.settleBeginDay;
        }
        ;
        //延迟天数
        data.latestPayDay = this.state.latestPayDay;
        if (this.state.payLimit == "2") {
            //分期次数
            data.instalmentCnt = this.state.instalmentCnt;
            //分期间隔
            data.instalmentInterval = this.state.instalmentInterval;
            //分期间隔时间自定义月/周
            data.instalmentIntervalType = this.state.instalmentIntervalType;
            //分期间隔时间自定义月/周 时间
            data.timeNo = this.state.timeNo.toString();
            //比例类型
            data.instalmentRatio = this.state.instalmentRatio;
            //比例
            data.ratio = this.state.ratio.toString();
            console.log("分期看看", this.state.ratio)
        }
        if (data.name !== "") {
            if (data.latestPayDay !== "" && data.latestPayDay||data.latestPayDay=="0") {
                if (this.state.payLimit == "2") {
                    if (data.instalmentCnt !== "" && data.instalmentCnt) {
                        if (data.instalmentInterval == "0") {
                            if (data.instalmentCnt !== this.state.timeNo.length) {
                                message.info("分期次数为:" + (data.instalmentCnt) + "次,请选择" + (data.instalmentCnt) + "个付款日期")
                            } else {
                                if (data.instalmentRatio == "2") {
                                    if (this.state.ratio.length >= 2) {
                                        this.postDataIs(data);
                                    } else {
                                        message.info("请输入分期比例")
                                    }
                                } else {
                                    this.postDataIs(data);
                                }
                            }
                        }
                        else {
                            if (data.instalmentRatio == "2") {
                                if (this.state.ratio.length > 1) {
                                    this.postDataIs(data);
                                } else {
                                    message.info("请输入分期比例")
                                }
                            } else {
                                this.postDataIs(data);
                            }
                        }
                    }
                    else {
                        message.info("请输入分期次数!");
                    }
                } else if (this.state.payLimit == "1") {
                    this.postDataIs(data);
                }
            } else {
                message.info("请输入延期付款天数!")
            }
        } else {
            message.info("请输入规则名字!")
        }
    };
    //详情展示
    showDetails = (row) => {
        console.log('某行详情获取的row:', row);
        let requestParam = {};
        requestParam.addr = Api.getRuleDetailById;
        requestParam.ruleDefineId = row.id;
        Util.comFetch(requestParam, (data) => {
            console.log("某行的详情", data.data)
            let DetailsData = data.data;
            this.setState({
                DetailsData: DetailsData,
            });
            if (DetailsData.payLimit == "2" && DetailsData.instalmentInterval == "自定义") {
                this.setState({
                    DetailsDataTimeNo: data.data.timeNo.split(",")
                })
            }
            ;
            if (DetailsData.payLimit == "2" && DetailsData.instalmentRatio == "自定义") {
                this.setState({
                    DetailsDataRatio: data.data.ratio.split(",")
                })
            }
            ;
        });
        this.setState({
            Details: true,
        })
    };
    //删除规则
    deleteItem = (row) => {
        console.log('删除的row:', row);
        let requestParam = {};
        requestParam.addr = Api.deleteRuleDefine;
        requestParam.ruleDefineId = row.id;
        Util.comFetch(requestParam, (data) => {
            console.log("某行的删除", data.data)
            message.success('删除成功');
            this.search(10, 1);
        });
    };
    //编辑规则
    editItem = (row) => {
        console.log('编辑的row:', row);
        let requestParam = {};
        requestParam.addr = Api.getRuleDefineById;
        requestParam.ruleDefineId = row.id;
        Util.comFetch(requestParam, (data) => {
                console.log("某行的编辑", data.data);
                let editItemData = data.data;
                this.setState({
                    confs: editItemData.confs,
                    id: editItemData.id,
                    name: editItemData.name,
                    payMode: editItemData.payMode,
                    //渠道
                    payChannel: editItemData.payChannel,
                    //额度
                    payLimit: editItemData.payLimit,
                    //结算类型
                    settleType: editItemData.settleType + "",
                    //月结起始日
                    settleBeginDay: editItemData.settleBeginDay == "0" ? "1" : editItemData.settleBeginDay + "",
                    //延迟天数
                    latestPayDay: editItemData.latestPayDay,
                });
                if (editItemData.payLimit == "2") {
                    this.setState({
                        //分期次数
                        instalmentCnt: editItemData.instalmentCnt,
                        //分期间隔
                        instalmentInterval: editItemData.instalmentInterval + "",
                        //分期类型自定义
                        instalmentIntervalType: editItemData.instalmentIntervalType + "",
                        //分期类型自定义时间
                        timeNo: editItemData.timeNo == "" ? [] : editItemData.timeNo.split(','),
                        timeNoTwo: editItemData.timeNo.split(','),
                        //分期比例类型
                        instalmentRatio: editItemData.instalmentRatio + "",
                        //分期比例，以逗号分隔
                        ratio: editItemData.ratio == "" ? [] : editItemData.ratio.split(','),
                    })
                }
            }
        );
        this.setState({
            ruleName: "",
            agingVisible: true,
            edit: true,
        })
    };

    getLabel(periodType, index) {
        if (index == '0') {
            return '起算日';
        }
        switch (periodType) {
            case '1':
                return index + '月后';
            case '2':
                return index + '天后';
            case '3':
                return index + '年后';
            case '4':
                return index + '周后';
            default:
                return '';
        }
    }

    render() {
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
                title: '付款方式',
                dataIndex: 'payMode',
                key: 'payMode',
            },
            {
                title: '付款渠道',
                dataIndex: 'payChannel',
                key: 'payChannel',
            },
            {
                title: '付款额度',
                dataIndex: 'payLimit',
                key: 'payLimit',
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
            <div className="trans-Ledger page-container">
                <p className="title"><span className="light-black">当前位置:</span>规则模板</p>
                <div>
                    <Input placeholder="规则名称" style={{width: "200px"  ,marginTop:'10px'}} value={this.state.ruleName}
                           onChange={(event) => {
                               this.ruleNameV(event, 1)
                           }}
                           className="search-input"/>

                    <Button style={{marginLeft: '10px',marginTop:"5px"}} className="search-item-common" type="primary" shape="circle"
                            onClick={() => this.search()} icon="search"/>

                    <Button style={{width: '32px', float: 'right',marginTop:"10px"}}
                            onClick={() => this.addRule()}
                            type="primary"
                            icon="plus"/>

                    <div>
                        <Table style={{marginTop: '15px',}} className="common-margin15 DefinitionRuleTable"
                               dataSource={this.state.dataSource}
                               columns={columns}
                               pagination={paginationOpt}
                               bordered={true}/>
                    </div>
                    <Modal
                        wrapClassName="modalAging"
                        width={800}
                        okText="确定"
                        footer={null}
                        title={this.state.isEdit ? "编辑" : "新增"}
                        closable={true}
                        visible={this.state.agingVisible}
                        onOk={() => this.postData()}
                        maskClosable={false}
                        onCancel={() => this.setState({'agingVisible': false})}
                    >
                        <div className="modal-row">
                            <span className="row-left">规则名称:</span>
                            <div className="row-right">
                                <Input value={this.state.name} require="require"
                                       onChange={(event) => this.setState({'name': event.target.value})}
                                       className="rule-name" type="text"/>
                            </div>
                        </div>
                        <div className="modal-row">
                            <span className="row-left">付款方式:</span>
                            <div className="row-right">
                                <Select value={this.state.payMode}
                                        style={{width: 120}}
                                        onChange={this.payMethod}>
                                    {this.state.payModeArray.map((v, i) => <Option key={v.key}
                                                                                   value={v.code}>{v.value}</Option>)}
                                </Select>
                                <Select value={this.state.payChannel} style={{width: 120, marginLeft: 10}}
                                        onChange={this.payChannel}>
                                    {this.state.payChanleArray.map((v, i) => <Option key={v.key}
                                                                                     value={v.code}>{v.value}</Option>)}
                                </Select>
                            </div>
                        </div>
                        <div className=" modal-row">
                            <span className="row-left">付款额度:</span>
                            <div className="row-right">
                                <RadioGroup value={this.state.payLimit} onChange={this.payLimit}>
                                    <Radio value="1">全款</Radio>
                                    <Radio value="2">分期</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                        <div className="modal-row">
                            <span className="row-left conf-explain">起算日配置:</span>
                            <div className="row-right">
                                <span className="modal-limit-config-explain"
                                      onClick={() => this.setState({'startExplain': true})}>说明</span>
                            </div>
                        </div>
                        <div className="modal-row">
                            <span className="row-left">结算类型:</span>
                            <div className="row-right">
                                <Select value={this.state.settleType}
                                        onChange={(value) => this.settlementType(value)}
                                        style={{width: 80}}>
                                    <Option value="1">日结</Option>
                                    <Option value="2">旬结</Option>
                                    <Option value="3">半月结</Option>
                                    <Option value="4">月结</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="modal-row" style={{display: this.state.settleType == "4" ? "block" : "none"}}>
                            <span className="row-left">月结起始日:</span>
                            <div className="row-right">
                                <Select
                                    dropdownStyle={{maxHeight: "250px"}}
                                    style={{width: 80}}
                                    value={this.state.settleBeginDay}
                                    onChange={this.settleBeginDay}
                                >
                                    {children}
                                </Select>
                            </div>
                        </div>
                        <div className="modal-row">
                            <span className="row-left">延期付款天数:</span>
                            <div className="row-right">
                                <InputNumber min={this.state.settleType == "1" ? 0 : 1} max={30}
                                             value={this.state.latestPayDay}
                                             onChange={this.latestPayDay}
                                             style={{width: 80}}
                                             placeholder={this.state.settleType == "1" ? "0~30日" : "1~30日"}
                                             type="text"/>
                            </div>
                        </div>
                        <div style={{display: this.state.payLimit == "2" ? "block" : "none"}}
                             className="modal-limit-config">
                            <div className="modal-row">
                                <span className="row-left  conf-explain">分期规则配置:</span>
                                <div className="row-right">
                                    <span className="modal-limit-config-explain"
                                          onClick={() => this.setState({'limitConfigExplain': true})}>说明</span>
                                </div>
                            </div>
                            <div className="modal-row">
                                <span className="row-left">分期次数:</span>
                                <div className="row-right">
                                    <InputNumber precision={0} min={2} max={13}
                                                 value={this.state.instalmentCnt}
                                                 onChange={(value) => this.limitTime(value)}
                                                 style={{
                                                     width: 80,
                                                 }}/>
                                </div>
                            </div>
                            <div className="modal-row">
                                <span className="row-left"> 分期间隔:</span>
                                <div className="row-right">
                                    <Select value={this.state.instalmentInterval}
                                            onChange={(value) => this.instalmentInterval(value)}
                                            style={{width: 80}}>
                                        <Option value="1">一个月</Option>
                                        <Option value="2">二个月</Option>
                                        <Option value="3">三个月</Option>
                                        <Option value="0">自定义</Option>
                                    </Select>
                                    <p className="modal-limit-interval-set"
                                       style={{display: this.state.instalmentInterval == "0" ? "inline-block" : "none"}}>&emsp;
                                        <span className="set"
                                              onClick={() => this.hint(1)}>设置&emsp;</span>
                                        <span style={{display: this.state.timeNo == "" ? "none" : "inline-block"}}
                                              onClick={() => this.setState({'intervalDetailsVisible': true})}
                                              className="details">详情</span>
                                    </p>
                                </div>
                            </div>
                            <div className="modal-row modal-limit-ratio">
                                <span className="row-left"> 分期比例:</span>
                                <div className="row-right">
                                    <Select value={this.state.instalmentRatio }
                                            onChange={(value) => this.installmentRatio(value)}
                                            style={{width: 80}}>
                                        <Option value="1">均分</Option>
                                        <Option value="2">自定义</Option>
                                    </Select>
                                    <p className="modal-limit-ratio-set"
                                       style={{display: this.state.instalmentRatio == "2" ? "inline-block" : "none"}}>&emsp;
                                        <span className="set"
                                              onClick={() => this.hint(2)}>设置&emsp;</span>
                                        <span style={{display: this.state.ratio == "" ? "none" : "inline-block"}}
                                              onClick={() => this.setState({'ratioDetailsVisible': true})}
                                              className="details">详情</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div style={{width: 200, margin: "auto"}}>
                            <Button onClick={() => this.setState({'agingVisible': false})}
                                    style={{marginRight: "30px",backgroundColor:'#ccc'}}>取消</Button>
                            <Button onClick={() => this.postData()} type="primary">确认</Button>
                        </div>
                    </Modal>
                    {/*分期间隔*/}
                    <Modal
                        wrapClassName="intervalSet"
                        style={{top: 300, left: 80}}
                        width={400}
                        footer={null}
                        closable={false}
                        okText="确定"
                        visible={this.state.intervalSetVisible}
                        onOk={() => this.ok()}
                        maskClosable={false}
                        onCancel={() => this.setState({'intervalSetVisible': false})}
                    >
                        <RadioGroup value={this.state.instalmentIntervalType} size="large"
                                    onChange={(event) => this.changeIntervalType(event)}
                        >
                            <RadioButton value="1">月</RadioButton>
                            <RadioButton value="4">周</RadioButton>
                            <RadioButton value="2">天</RadioButton>
                            <RadioButton value="3">年</RadioButton>
                        </RadioGroup>
                        <div>
                            <div style={{display: this.state.instalmentIntervalType == "1" ? "inline-block" : "none"}}>
                                <Checkbox.Group
                                    value={this.state.timeNo}
                                    disable="true"
                                    onChange={this.intervalMouth}>
                                    <Row><Col className="checkboxStyle" span={24}><Checkbox value="0"
                                                                                            onChange={this.Startdate}>起算日</Checkbox></Col></Row>
                                    <Row>
                                        {time.map((v, index) => <Col key={v} className="checkboxStyle"
                                                                     span={8}><Checkbox
                                            value={v}>{v}月后</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                            <div style={{display: this.state.instalmentIntervalType == "4" ? "inline-block" : "none"}}>
                                <Checkbox.Group
                                    value={this.state.timeNo}
                                    onChange={this.intervalWeek}>
                                    <Row><Col className="checkboxStyle" span={24}><Checkbox value="0"
                                                                                            onChange={this.Startdate}>起算日</Checkbox></Col></Row>
                                    <Row>
                                        {time.map((v, index) => <Col key={v} className="checkboxStyle"
                                                                     span={8}><Checkbox
                                            value={v}>{v}周后</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                            <div style={{display: this.state.instalmentIntervalType == "2" ? "inline-block" : "none"}}>
                                <Checkbox.Group
                                    value={this.state.timeNo}
                                    onChange={this.intervalDay}>
                                    <Row><Col className="checkboxStyle" span={24}><Checkbox value="0"
                                                                                            onChange={this.Startdate}>起算日</Checkbox></Col></Row>
                                    <Row>
                                        {time.map((v, index) => <Col key={v} className="checkboxStyle"
                                                                     span={8}><Checkbox
                                            value={v}>{v}日后</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                            <div style={{display: this.state.instalmentIntervalType == "3" ? "inline-block" : "none"}}>
                                <Checkbox.Group
                                    value={this.state.timeNo}
                                    onChange={this.intervalYear}>
                                    <Row><Col className="checkboxStyle" span={24}><Checkbox value="0"
                                                                                            onChange={this.Startdate}>起算日</Checkbox></Col></Row>
                                    <Row>
                                        {time.map((v, index) => <Col key={v} className="checkboxStyle"
                                                                     span={8}><Checkbox
                                            value={v}>{v}年后</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        </div>
                        <div style={{width: "135px", margin: "auto", marginTop: "10px"}}>
                            <Button size="small" onClick={() => this.setState({
                                'intervalSetVisible': false,
                                timeNo: this.state.timeNoTwo
                            })} type="primary" style={{marginRight: "30px"}}>取消</Button>
                            <Button size="small" onClick={() => this.ok()} type="primary">确认</Button>
                        </div>
                    </Modal>
                    {/*比例设置*/}
                    {this.state.ratioSetVisible && <InstallmentRatio
                        // setRatio={(vals) => {this.ratioV(vals)}}
                        setRatio={this.sumRatio}
                        ratio={this.state.ratio}
                        periodType={this.state.instalmentIntervalType}
                        timeNo={this.state.timeNo}
                        //分期次数
                        instalmentCnt={this.state.instalmentCnt}
                        //分期间隔
                        instalmentInterval={this.state.instalmentInterval}
                        close={() => {
                            this.setState({ratioSetVisible: false})
                        }}
                        visible={this.state.ratioSetVisible}/>}
                    {/*说明*/}
                    <Modal
                        wrapClassName="explain"
                        style={{top: 100, left: 80}}
                        width={"500px"}
                        footer={null}
                        cancelText="确定"
                        closable={true}
                        title="说明"
                        visible={this.state.startExplain}
                        maskClosable={false}
                        onCancel={() => this.setState({'startExplain': false})}
                    >
                        <div className="startExplain" style={{fontSize: '12px'}}>
                            <p className="title">日结：</p>
                            <p>当日结算单在当日+延期付款天数日进行结算</p>
                            <p className="title">旬结：</p>
                            <p>每月1日至10日的结算单在10+延期付款天数日进行结算</p>
                            <p>每月11日至20日的结算单在20日+延期付款天数日进行结算</p>
                            <p>每月20日至月末的结算单在次月延期付款天数日进行结算</p>
                            <p className="title">半月结：</p>
                            <p>每月1日至15日为上半月的结算单在15+延期付款天数日进行结算</p>
                            <p>16日至月末的结算单为上半月结算日+15日</p>
                            <p className="title">月结：</p>
                            <p>若月结起始日为1日：表示为当月1日到月末，结算单在次月延期付款天数日进行结算</p>
                            <p>若月结起始日为10日：表示当月10日到下月9日，结算单在次月延期付款天数日进行结算</p>
                            <p className="title">举例如下：</p>
                            <p>1.结算类型=日结，延期付款天数=3日：</p>
                            <p>结算订单生成日期为4日，则在7日付款</p>
                            <p>2.结算类型=旬结，延期付款天数=3日：</p>
                            <p>结算订单生成日期为4日，则在10+3=13日付款</p>
                            <p>结算订单生成日期为14日，则在20+3=23日付款</p>
                            <p>结算订单生成日期为24日，则在次月3日</p>
                            <p>3.结算类型=半月结,延期付款天数=3日：</p>
                            <p>结算订单生成日期为14日，则在15+3日=18日付款</p>
                            <p>结算订单生成日期为19日，则在18日+15日=次月3日</p>
                            <p>4.结算类型=1月结,月结起始日=23日，延期付款天数=3日：</p>
                            <p>结算订单生成日期为23日之前，则在次月4日付款</p>
                            <p>结算订单生成日期为23日之后，则在次次月4日付款</p>
                        </div>
                        <div style={{textAlign: "center"}}>
                            <Button size="small" onClick={() => this.setState({'startExplain': false})} type="primary">确认</Button>
                        </div>
                    </Modal>
                    <Modal
                        wrapClassName="explain"
                        style={{top: 100, left: 80}}
                        width={"500px"}
                        footer={null}
                        closable={true}
                        title="说明"
                        cancelText="确定"
                        visible={this.state.limitConfigExplain}
                        maskClosable={false}
                        onCancel={() => this.setState({'limitConfigExplain': false})}
                    >
                        <div style={{fontSize: '12px'}}>
                            <div className="limitConfigExplain">
                                <p className="title">分期次数：总共分期的次数</p>
                                <p className="title">分期间隔：每一次付款之间的间隔</p>
                                <p>如果选择为1个月：则每次分期之间间隔为1个月</p>
                                <p>如果选择为自定义：则根据选择的付款间隔时间段进行付款</p>
                                <p className="title">分期比例：表示每次付款的比例</p>
                                <p>如果选择为均分：则每次付款金额=总金额/分期次数</p>
                                <p>如果选择为自定义：则每次付款金额=总金额*分期比例</p>
                                <p className="title">举例如下：</p>
                                <p><span>1.分期次数=3次 </span>&emsp;&emsp; <span>分期间隔=1个月</span>&emsp;&emsp;
                                    <span>分期比例=均分</span></p>
                                <p >则付款日和付款金额如下：</p>
                                <div style={{marginLeft: 10}}>
                                    <p> 第一次付款日=第一次付款日规则运算出来的日期，付款金额=总额*33%</p>
                                    <p> 第二次付款日=第一次付款日规则运算出来的日期+1个月，付款金额=总额*33%</p>
                                    <p> 第三次付款日=第一次付款日规则运算出来的日期+2个月，付款金额=总额*34%</p>
                                </div>
                                <p>2.分期次数=3次</p>
                                <p>分期间隔=自定义=起算日，起算日1周后，起算日3周后</p>
                                <p>分期比例=自定义=第一次付款30%，第二次付款40%，第三次付款30%</p>
                                <p>则付款日和付款金额如下：</p>
                                <div style={{marginLeft: 10}}>
                                    <p>第一次付款日=第一次付款日规则运算出来的日期，付款金额=总额*30%</p>
                                    <p>第二次付款日=第一次付款日规则运算出来的日期+7天，付款金额=总额*40%</p>
                                    <p>第三次付款日=第一次付款日规则运算出来的日期+21天，付款金额=总额*30%</p>
                                </div>
                            </div>
                        </div>
                        <div style={{textAlign: "center"}}>
                            <Button size="small" onClick={() => this.setState({'limitConfigExplain': false})}
                                    type="primary">确认</Button>
                        </div>
                    </Modal>
                    {/*详情页面*/}
                    <Modal
                        wrapClassName="details"
                        style={{top: 100, left: 80}}
                        width={"500px"}
                        footer={null}
                        closable={true}
                        title="详情"
                        cancelText="确定"
                        visible={this.state.Details}
                        maskClosable={false}
                        onCancel={() => this.setState({'Details': false})}
                    >
                        <div className="modal-row">
                            <span className="row-left"> 规则名字:</span>
                            <div className="row-right">
                                <span>{this.state.DetailsData.name}</span>
                            </div>
                        </div>
                        <div className="modal-row">
                            <span className="row-left"> 付款方式:</span>
                            <div className="row-right">
                                <span>{this.state.DetailsData.payMode}&emsp;{this.state.DetailsData.payChannel}</span>
                            </div>
                        </div>
                        <div className="modal-row">
                            <span className="row-left"> 付款额度:</span>
                            <div className="row-right">
                                <RadioGroup value={this.state.DetailsData.payLimit}>
                                    <Radio value="1">全款</Radio>
                                    <Radio value="2">分期</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                        <div className="modal-row">
                            <span className="row-left conf-explain"> 起算日配置:</span>
                            <div className="row-right">
                            </div>
                        </div>
                        <div className="modal-row">
                            <span className="row-left"> 结算类型:</span>
                            <div className="row-right">
                                <span>{this.state.DetailsData.settleType}</span>
                            </div>
                        </div>
                        <div className="modal-row"
                             style={{display: this.state.DetailsData.settleType == "月结" ? "block" : "none"}}>
                            <span className="row-left"> 月结起始日:</span>
                            <div className="row-right">
                                <span>{this.state.DetailsData.settleType}</span>
                            </div>
                        </div>
                        <div className="modal-row">
                            <span className="row-left"> 延期付款天数:</span>
                            <div className="row-right">
                                <span>{this.state.DetailsData.latestPayDay}日</span>
                            </div>
                        </div>
                        <div style={{display: this.state.DetailsData.payLimit == "2" ? "block" : "none"}}>
                            <div className="modal-row conf-explain">
                                <span className="row-left conf-explain"> 分期规则配置:</span>
                            </div>
                            <div className="modal-row ">
                                <span className="row-left"> 分期次数:</span>
                                <div className="row-right">
                                    {this.state.DetailsData.instalmentCnt}
                                </div>
                            </div>
                            <div className="modal-row">
                                <span className="row-left"> 分期间隔:</span>
                                <div className="row-right">
                                    {this.state.DetailsData.instalmentInterval}
                                    <p className="modal-limit-interval-set"
                                       style={{display: this.state.DetailsData.instalmentInterval == "自定义" ? "inline-block" : "none"}}>&emsp;
                                        <span onClick={() => this.setState({'TableIntervalDetailsVisible': true})}
                                              className="details">详情</span>
                                    </p>
                                </div>
                            </div>
                            <div className="modal-row">
                                <span className="row-left"> 分期比例:</span>
                                <div className="row-right">
                                    {this.state.DetailsData.instalmentRatio}
                                    <p className="modal-limit-ratio-set"
                                       style={{display: this.state.DetailsData.instalmentRatio == "自定义" ? "inline-block" : "none"}}>&emsp;
                                        <span onClick={() => this.setState({'TableRatioDetailsVisible': true})}
                                              className="details">详情</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div style={{width: "135px", margin: "auto"}}>
                            <Button size="small" onClick={() => this.setState({'Details': false})} type="primary"
                                    style={{marginRight: "30px"}}>取消</Button>
                            <Button size="small" onClick={() => this.setState({'Details': false})}
                                    type="primary">确认</Button>
                        </div>
                    </Modal>

                    {/*分期间隔详情*/}
                    <Modal
                        wrapClassName="intervalDetailsVisible"
                        style={{top: 300, left: 80}}
                        width={400}
                        footer={null}
                        closable={false}
                        visible={this.state.intervalDetailsVisible}
                        maskClosable={false}
                    >
                        <RadioGroup value={ this.state.instalmentIntervalType} size="large">
                            <RadioButton value="1">月</RadioButton>
                            <RadioButton value="4">周</RadioButton>
                            <RadioButton value="2">天</RadioButton>
                            <RadioButton value="3">年</RadioButton>
                        </RadioGroup>
                        <div>
                            <div style={{display: this.state.instalmentIntervalType == "1" ? "inline-block" : "none"}}>
                                <Checkbox.Group
                                    value={this.state.timeNo}
                                    disable="true">
                                    <Row><Col className="checkboxStyle" span={24}><Checkbox
                                        value="0">起算日</Checkbox></Col></Row>
                                    <Row>
                                        {time.map((v, index) => <Col key={v} className="checkboxStyle"
                                                                     span={8}><Checkbox
                                            value={v}>{v}月后</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                            <div style={{display: this.state.instalmentIntervalType == "4" ? "inline-block" : "none"}}>
                                <Checkbox.Group
                                    value={this.state.timeNo}>
                                    <Row><Col className="checkboxStyle" span={24}><Checkbox
                                        value="0">起算日</Checkbox></Col></Row>
                                    <Row>
                                        {time.map((v, index) => <Col key={v} className="checkboxStyle"
                                                                     span={8}><Checkbox
                                            value={v}>{v}周后</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                            <div style={{display: this.state.instalmentIntervalType == "2" ? "inline-block" : "none"}}>
                                <Checkbox.Group
                                    value={this.state.timeNo}>
                                    <Row><Col className="checkboxStyle" span={24}><Checkbox
                                        value="0">起算日</Checkbox></Col></Row>
                                    <Row>
                                        {time.map((v, index) => <Col key={v} className="checkboxStyle"
                                                                     span={8}><Checkbox
                                            value={v}>{v}日后</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                            <div style={{display: this.state.instalmentIntervalType == "3" ? "inline-block" : "none"}}>
                                <Checkbox.Group
                                    value={this.state.timeNo}>
                                    <Row><Col className="checkboxStyle" span={24}><Checkbox
                                        value="0">起算日</Checkbox></Col></Row>
                                    <Row>
                                        {time.map((v, index) => <Col key={v} className="checkboxStyle"
                                                                     span={8}><Checkbox
                                            value={v}>{v}年后</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        </div>
                        <div style={{textAlign: "center", marginTop: "10px"}}>
                            <Button size="small" onClick={() => this.setState({'intervalDetailsVisible': false})}
                                    type="primary">确认</Button>
                        </div>
                    </Modal>
                    {/*table分期间隔详情*/}
                    <Modal
                        wrapClassName="intervalDetailsVisible"
                        style={{top: 300, left: 80}}
                        width={400}
                        footer={null}
                        closable={false}
                        visible={this.state.TableIntervalDetailsVisible}
                        maskClosable={false}
                    >
                        <RadioGroup value={ this.state.DetailsData.instalmentIntervalType + ""} size="large">
                            <RadioButton value="1">月</RadioButton>
                            <RadioButton value="4">周</RadioButton>
                            <RadioButton value="2">天</RadioButton>
                            <RadioButton value="3">年</RadioButton>
                        </RadioGroup>
                        <div>
                            <div
                                style={{display: this.state.DetailsData.instalmentIntervalType == "1" ? "inline-block" : "none"}}>
                                <Checkbox.Group
                                    value={this.state.DetailsDataTimeNo}
                                    disable="true">
                                    <Row><Col className="checkboxStyle" span={24}><Checkbox
                                        value="0">起算日</Checkbox></Col></Row>
                                    <Row>
                                        {time.map((v, index) => <Col key={v} className="checkboxStyle"
                                                                     span={8}><Checkbox
                                            value={v}>{v}月后</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                            <div
                                style={{display: this.state.DetailsData.instalmentIntervalType == "4" ? "inline-block" : "none"}}>
                                <Checkbox.Group
                                    value={this.state.DetailsDataTimeNo}>
                                    <Row><Col className="checkboxStyle" span={24}><Checkbox
                                        value="0">起算日</Checkbox></Col></Row>
                                    <Row>
                                        {time.map((v, index) => <Col key={v} className="checkboxStyle"
                                                                     span={8}><Checkbox
                                            value={v}>{v}周后</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                            <div
                                style={{display: this.state.DetailsData.instalmentIntervalType == "2" ? "inline-block" : "none"}}>
                                <Checkbox.Group
                                    value={this.state.DetailsDataTimeNo}>
                                    <Row><Col className="checkboxStyle" span={24}><Checkbox
                                        value="0">起算日</Checkbox></Col></Row>
                                    <Row>
                                        {time.map((v, index) => <Col key={v} className="checkboxStyle"
                                                                     span={8}><Checkbox
                                            value={v}>{v}日后</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                            <div
                                style={{display: this.state.DetailsData.instalmentIntervalType == "3" ? "inline-block" : "none"}}>
                                <Checkbox.Group
                                    value={this.state.DetailsDataTimeNo}>
                                    <Row><Col className="checkboxStyle" span={24}><Checkbox
                                        value="0">起算日</Checkbox></Col></Row>
                                    <Row>
                                        {time.map((v, index) => <Col key={v} className="checkboxStyle"
                                                                     span={8}><Checkbox
                                            value={v}>{v}年后</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        </div>
                        <div style={{textAlign: "center", marginTop: "10px"}}>
                            <Button size="small" onClick={() => this.setState({'TableIntervalDetailsVisible': false})}
                                    type="primary">确认</Button>
                        </div>
                    </Modal>
                    {/*比例详情*/}
                    <Modal
                        wrapClassName="ratioSet"
                        style={{top: "300px", left: 80}}
                        width={400}
                        footer={null}
                        closable={false}
                        okText="确定"
                        visible={this.state.ratioDetailsVisible}
                        onOk={this.setRatio}
                        maskClosable={false}
                        onCancel={() => this.setState({'ratioDetailsVisible': false})}
                    >
                        <div style={{display: this.state.instalmentInterval == "0" ? 'inline-block' : 'none'}}>
                            {
                                this.state.timeNo.map((v, i) => (
                                    <div className="ratioSet-div" key={i}>
                                        <span>{this.getLabel(this.state.instalmentIntervalType, v) + '付款:'}</span>
                                        <span>{this.state.ratio[i]}</span> %
                                    </div>
                                ))
                            }
                        </div>
                        <div style={{display: this.state.instalmentInterval !== "0" ? 'inline-block' : 'none'}}>
                            {
                                this.state.ratio.map((v, i) => (
                                    <div className="ratioSet-div" key={i}>
                                        <span>{ "第" + (i + 1) + '次付款:'}</span>
                                        <span>{v}</span> %
                                    </div>
                                ))
                            }
                        </div>
                        <div style={{textAlign: "center"}}>
                            <Button size="small" onClick={() => this.setState({'ratioDetailsVisible': false})}
                                    type="primary">确认</Button>
                        </div>
                    </Modal>
                    {/*table比例详情*/}
                    <Modal
                        wrapClassName="ratioSet"
                        style={{top: "300px", left: 80}}
                        width={400}
                        footer={null}
                        closable={false}
                        visible={this.state.TableRatioDetailsVisible}
                        maskClosable={false}
                    >
                        <div
                            style={{display: this.state.DetailsData.instalmentInterval == "自定义" ? 'inline-block' : 'none'}}>
                            {
                                this.state.DetailsDataTimeNo.map((v, i) => (
                                    <div className="ratioSet-div" key={i}>
                                        <span>{this.getLabel(this.state.DetailsData.instalmentIntervalType + "", v) + '付款:'}</span>
                                        <span>{this.state.DetailsDataRatio[i]}</span>%
                                    </div>
                                ))
                            }
                        </div>
                        <div
                            style={{display: this.state.DetailsData.instalmentInterval !== "自定义" ? 'inline-block' : 'none'}}>
                            {
                                this.state.DetailsDataRatio.map((v, i) => (
                                    <div className="ratioSet-div" key={i}>
                                        <span>{ "第" + (i + 1) + '次付款:'}</span>
                                        <span>{v}</span> %
                                    </div>
                                ))
                            }
                        </div>
                        <div style={{textAlign: "center"}}>
                            <Button size="small" onClick={() => this.setState({'TableRatioDetailsVisible': false})}
                                    type="primary">确认</Button>
                        </div>
                    </Modal>
                </div>
            </div>
        )
            ;
    }
};
