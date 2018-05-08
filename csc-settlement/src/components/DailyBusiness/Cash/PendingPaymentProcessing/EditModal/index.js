import React from 'react';
import { Table,Icon, Button, Modal, Radio, Input, DatePicker, Select, message ,Popconfirm } from 'antd';
import moment from 'moment';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const date = new Date();
const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();


const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
    Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
    Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};

// 待支付表格
class EditModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownMove: true, //付款方信息下拉图标显示

            dropdownMovePayee: true, //收款方信息下拉图标显示
            // 默认展示联动数据
            cities: cityData[provinceData[0]],
            secondCity: cityData[provinceData[0]][0],

            paymentTypeValue: 1, // 编辑支付方式(1、预支付，2、立即支付)
            immediate: false, // 编辑支付字段(false、预支付，true、立即支付)
            accountInfo: [], // 银行账户信息
            linkageAccountName: [], //联动银行名称
            linkageAccountBranch: [], //联动银行支行名称
            linkageCardNumber: [], //联动卡号
            activeAccountName: '', // 当前选择的银行名称下拉
            activeAccountBranch: '', // 当前选择的银行支行名称下拉
            activeCardNumber: '', // 当前选择的联动卡号下拉
            paymentAccountName: '', //联动账户名
            payMode: '', // 支付方式英文
            payModeName: '', // 支付方式中文
            payChannel: [], // 支付渠道
            settChannel: '', //支付渠道英文名称
            settChannelName: '', //支付渠道中文名称
            editPrePayTime: '', // 编辑修改的预支付日期;
            isPrePayTime: '', //在提交审核的另一种状态中是否修改了预支付日期;
            submissionAuditData: [], // 未支付/预支付款项;
            isInitPayChannel: true, //是否是初始化支付渠道



            // 收款方账户全部数据
            accData: {},
            // 收款方账户-银行
            bank: '',
            banks: [],
            // 收款方账户-银行支行
            subBank: '',
            subBanks: [],
            // 收款方账户-银行卡号
            bankAcc: '',
            bankAccs: [],
            // 收款方账户名称
            bankAccName: '',
        };
        this.columns = null;
    }
    componentDidMount() {
        this.openEditModal(this.props.payRowData);
    }

    // 打开编辑弹窗    付款申请模块的编辑
    openEditModal = (rowData) => {
        if (rowData.freeze) {
            message.success('冻结状态不能编辑');
        } else {
            this.setState({
                activeAccountName: '',
                activeAccountBranch: '',
                activeCardNumber: '',
            }, () => {
                this.setState({
                    editEnterLoading: false,
                    rowData,
                    paymentTypeValue: rowData.immediate ? 2 : 1,
                    immediate: rowData.immediate,
                    editPrePayTime: rowData.prePayTime ? rowData.prePayTime.split(' ')[0] : '',
                    activeAccountName: rowData.myAccount.bankCategoryName,
                    activeAccountBranch: rowData.myAccount.accountBankName,
                    activeCardNumber: rowData.myAccount.accountNumber,
                    paymentAccountName: rowData.myAccount.accountName,
                    payModeName: rowData.payModeName ? rowData.payModeName : '',
                    payMode: rowData.payMode ? rowData.payMode : '',
                    settChannelName: rowData.payChannelName ? rowData.payChannelName : '',
                    isInitPayChannel: true,
                    settChannel: rowData.payChannel ? rowData.payChannel : ''
                }, () => {
                    this.getPayerAccount();
                    this.getPayeeAccount();
                })
            })
        }
    };
    // 获取收款方信息
    getPayeeAccount() {
        Util.comFetch({
            companyId: userInfo.companyId,
            tenantId: userInfo.tenantId,
            // customerName: this.state.rowData.customerName,
            code: this.state.rowData.code,
            // addr: Api.getPayeeAccount
            addr: Api.getPayeeAccountByCustomerName
        }, (re) => {
            // 后台返回的银行-支行-卡号数据是逗号分隔的字符串，用trans3LvlBankData转换为带层级的对象
            let accData = Util.trans3LvlBankData(re.data);
            // 表格中订单的收款方信息
            let specAcc = this.state.rowData.acAccount;
            // 是否使用订单中的账号标志
            let useOrderAcc = false;

            // 单条订单支付时，优先使用表格中的订单的付款方账号。
            // 遍历返回的账号列表，如果有和表格中账号相同的，就使用表格中的账号，否则使用第一个默认账号。
            if (specAcc && !this.props.multiFlag) {
                let accStr = [
                    specAcc.bankCategoryName,
                    specAcc.accountBankName,
                    specAcc.accountNumber,
                    specAcc.accountName
                ].join(',');
                re.data.some((item) => {
                    if (item.indexOf(accStr) === 0) {
                        useOrderAcc = true;
                        return true;
                    }
                });
            }

            // 设置付款方账户银行，支行，卡号三级选框数据
            if (useOrderAcc) {
                let bank = specAcc.bankCategoryName;
                let subBank = specAcc.accountBankName;
                let bankAcc = specAcc.accountNumber;
                let bankAccName = specAcc.accountName;
                let banks = accData;
                let subBanks = [];
                let bankAccs = [];
                banks.some((item) => {
                    if (item.name === bank) {
                        subBanks = item.children;
                        return true;
                    }
                });
                subBanks.some((item) => {
                    if (item.name === subBank) {
                        bankAccs = item.children;
                        return true;
                    }
                });
                this.setState({ banks, bank, subBanks, subBank, bankAccs, bankAcc, bankAccName});
            } else {
                this.calcAccSelect(accData);
            }
            this.setState({accData});
        });
    }

    // 收款款方账户，银行-支行-卡号，根据选择的前一级，确定后级的数据
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
                if(item.name === bankSpec) {
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
        this.setState({ banks, bank, subBanks, subBank, bankAccs, bankAcc, bankAccName});
    }

    // 收款方选择银行， 需要重新设置支行和卡号
    bankChange = (value) => {
        this.setState({bank: value});
        this.calcAccSelect(this.state.accData, value);
    }

    // 收款方选择支行， 需要重新设置卡号
    subBankChange = (value) => {
        this.setState({subBank: value});
        this.calcAccSelect(this.state.accData, this.state.bank, value);
    }

    // 收款方选择卡号
    bankAccChange = (bankAcc) => {
        const { bankAccs } = this.state;
        let accName = '';
        bankAccs.some((item) => {
            if (item.name === bankAcc) {
                accName = item.accName;
                return true;
            }
        })
        this.setState({bankAcc, accName});
    }

    // 确认处理弹窗
    editOk = (e) => {
        if (!this.state.immediate) {
            if (this.state.editPrePayTime === '') {
                message.warning('预支付日期不能为空')
                return false;
            }

            if (Number(this.get_unix_time(this.state.editPrePayTime)) < Number(this.get_unix_time(`${year}-${month}-${day}`))) {
                message.warning('预支付日期不能小于当前日期');
                return false;
            }
        }

        this.updateOrder();
    };

    // 关闭处理弹窗;
    editCancel = () => {
        this.props.cancel()
    }

    // 付款方信息下拉
    dropdownFun = () => {
        let bool;

        if (this.state.dropdownMove) {
            bool = false;
        } else {
            bool = true;
        }

        this.setState({
            dropdownMove: bool
        })
    }
    // 收款方信息下拉
    dropdownFunPayee = () => {
        this.setState({
            dropdownMovePayee: !this.state.dropdownMovePayee
        });
    }

    // 选择的编辑支付类型value
    onChangePaymentValue = (e) => {
        this.setState({
            paymentTypeValue: e.target.value,
            immediate: e.target.value == 2 ? true : false,
            editPrePayTime: this.state.editPrePayTime
        });
    }

    // 联动银行名称change事件
    handleAccountName = (value) => {
        this.setState({
            activeAccountName: value,
            activeAccountBranch: '',
            activeCardNumber: '',
            paymentAccountName: '',
            isInitPayChannel: false
        }, () => {
            this.filterAccountBranch(value)
        });
    }
    // 获取付款方账户信息;
    getPayerAccount = () => {
        Util.comFetch({
            addr: 'getPayerAccount'
        }, res => {
            let linkageAccountName = [];
            let setLinkageAccountName = new Set();

            // 处理去重银行名称;
            res.data.forEach(item => {
                linkageAccountName.push(item.split(',')[0])
            });

            linkageAccountName.forEach(item => {
                setLinkageAccountName.add(item)
            });

            linkageAccountName = [];

            for (let i of setLinkageAccountName) {
                linkageAccountName.push(i)
            }

            this.setState({
                accountInfo: res.data,
                linkageAccountName,
                activeAccountName: this.state.activeAccountName === '' ? linkageAccountName[0] : this.state.activeAccountName
            }, () => {
                this.filterAccountBranch(this.state.activeAccountName)
            })
        })
    }

    // 筛选银行支行
    filterAccountBranch = (name) => {
        let linkageAccountBranch = [];
        let setLinkageAccountBranch = new Set();

        this.state.accountInfo.forEach(item => {
            item = item.split(',');

            if (item[0] === name) {
                linkageAccountBranch.push(item[1])
            }
        })

        linkageAccountBranch.forEach(item => {
            setLinkageAccountBranch.add(item)
        });

        linkageAccountBranch = [];

        for (let i of setLinkageAccountBranch) {
            linkageAccountBranch.push(i)
        }

        this.setState({
            linkageAccountBranch,
            activeAccountBranch: this.state.activeAccountBranch === '' ? linkageAccountBranch[0] : this.state.activeAccountBranch
        }, () => {
            this.filterCardNumber(this.state.activeAccountBranch)
        })
    }

    // 筛选联动卡号
    filterCardNumber = (name) => {
        let linkageCardNumber = [];

        this.state.accountInfo.forEach(item => {
            item = item.split(',');

            if (this.state.activeAccountName === item[0] && item[1] === name) {
                linkageCardNumber.push(item[2])
            }
        })

        this.setState({
            linkageCardNumber,
            activeCardNumber: this.state.activeCardNumber === '' ? linkageCardNumber[0] : this.state.activeCardNumber
        }, () => {
            this.filterPaymentAccountName(this.state.activeCardNumber);
            this.getMyAccountByAccountNumber();
        })
    }

    // 筛选联动账户名
    filterPaymentAccountName = (name) => {
        let paymentAccountName = '';

        this.state.accountInfo.forEach(item => {
            item = item.split(',');

            if (this.state.activeAccountName === item[0] && this.state.activeAccountBranch === item[1] && name === item[2]) {
                paymentAccountName = item[3]
            }
        })

        this.setState({
            paymentAccountName
        })
    }

    // 获取选择的银行支行change
    handleAccountBranch = (value) => {
        this.setState({
            activeAccountBranch: value,
            activeCardNumber: '',
            paymentAccountName: '',
            isInitPayChannel: false
        }, () => {
            this.filterCardNumber(value)
        })
    }

    // 获取联动卡号change
    handleCardNumber = (value) => {
        this.setState({
            activeCardNumber: value,
            paymentAccountName: ''
        }, () => {
            this.filterPaymentAccountName(value)
        })
    }

    // 支付渠道
    getMyAccountByAccountNumber = () => {
        Util.comFetch({
            addr: 'getMyAccountByAccountNumber',
            accountNumber: this.state.activeCardNumber
        }, res => {
            const { isInitPayChannel } = this.state;
            let settChannelName, settChannel;

            if (isInitPayChannel) {
                if (this.state.settChannelName) {
                    settChannelName = this.state.settChannelName;
                    settChannel = this.state.settChannel;
                } else {
                    settChannelName = '';
                    settChannel = '';
                }
            } else {
                if (res.data.length) {
                    settChannelName = res.data.length ? res.data[0].value : '';
                    settChannel = res.data.length ? res.data[0].key : '';
                } else {
                    settChannelName = '';
                    settChannel = '';
                }
            }

            this.setState({
                payChannel: res.data,
                settChannelName,
                settChannel
            })
        })
    }

    // 监听支付渠道选择
    handleSettChannelName = (e) => {
        let settChannel;
        this.state.payChannel.forEach(item => {
            if (e.target.value == item.value) {
                settChannel = item.key
            }
        });

        this.setState({
            settChannelName: e.target.value,
            settChannel
        })
    }
    // 保存编辑
    updateOrder = () => {
        let { activeCardNumber, editPrePayTime, settChannelName, settChannel, payMode, payModeName, rowData, immediate,bankAcc } = this.state;
        Util.comFetch({
            addr: 'updateOrder',
            orderId: rowData.id,
            orderCode: rowData.code,
            acAccountNumber: bankAcc,
            accountNumber: activeCardNumber,
            prePayTime: immediate ? '' : editPrePayTime + ' 00:00:00',
            settChannel,
            settChannelName,
            payModeName,
            immediate,
            payMode
        }, res => {
            message.success('保存成功')
            const {page}=this.props;

            console.log("页面",page);
            this.props.skipPage(page);
            // if (this.state.submissionAuditVisible) { // 如果提交审核的弹窗已打开那么就要存储修改预支付日期
            //     this.setState({
            //         isPrePayTime: immediate ? '' : editPrePayTime + ' 00:00:00'
            //     })
            //     // this.props.sreachOrders(this.state.rowData);
            //
            // } else {
            //     // this.props.sreachOrders();
            // }
            this.props.cancel()

        })
    }

    // 支付方式监听
    handlePayModeChange = (value) => {
        let payModeName = value, payMode;

        if (payModeName == '现汇') {
            payMode = 'payMode_cash';
        } else if (payModeName == '票据') {
            payMode = 'payMode_bill';
        } else if (payModeName == '通信证') {
            payMode = 'payMode_LC';
        }

        this.setState({
            payModeName,
            payMode
        })
    };

    // 监听预支付日期
    onChangeDate = (value, date) => {
        this.setState({
            editPrePayTime: date
        })
    }
    // 将日期转成时间戳
    get_unix_time = (dateStr) => {
        var newstr = dateStr.replace(/-/g,'/');
        var date =  new Date(newstr);
        var time_str = date.getTime().toString();
        return time_str.substr(0, 10);
    }


    render() {
        const {
            bank,
            banks,
            subBank,
            subBanks,
            bankAcc,
            bankAccs,
            bankAccName,
        } = this.state
        const { data, total, current, selRows } = this.props;
        return (
            <div>
                {/* 编辑弹窗 */}
                <Modal
                    title="编辑"
                    visible={true}
                    zIndex="1010"
                    onOk={this.editOk}
                    onCancel={this.editCancel}
                    maskClosable={ false }
                    confirmLoading={ this.state.editEnterLoading }
                    className="modal-box edit-modal-box"
                >
                    <article className="edit-content">
                        <RadioGroup
                            onChange={this.onChangePaymentValue}
                            value={this.state.paymentTypeValue}
                        >
                            <Radio value={1}>预支付</Radio>
                            <Radio value={2}>立即支付</Radio>
                        </RadioGroup>
                        {
                            this.state.paymentTypeValue == 2
                                ?
                                ''
                                :
                                <div className="edit-row payment-date">
                                    <span className="pull-left">预支付日期：</span>
                                    {
                                        this.state.editPrePayTime
                                            ?
                                            <DatePicker value={moment(this.state.editPrePayTime, dateFormat)} className="pull-left" allowClear={ false } onChange={this.onChangeDate} disabledDate={this.disabledDate} />
                                            :
                                            <DatePicker className="pull-left" allowClear={ false } onChange={this.onChangeDate} disabledDate={this.disabledDate} />
                                    }
                                    <div className="clear"></div>
                                </div>
                        }
                        <div className="edit-row payment-info" onClick={this.dropdownFun}>
                            <a className="pull-left" href="javascript: ">付款方信息 </a>
                            <Icon className={ `pull-left ${ this.state.dropdownMove ? "transform-rotate" : "" }` } type="caret-up" />
                            <div className="clear"></div>
                        </div>

                        <div className={ `payment-drop ${ this.state.dropdownMove ? "payment-drop-active" : "" }` }>
                            <div className="payment-drop__row">
                                <span className="pull-left name">付款方账户：</span>
                                <div className="pull-left">
                                    <Select size="large" value={this.state.activeAccountName} style={{ width: 120 }} onChange={this.handleAccountName}>
                                        {
                                            this.state.linkageAccountName.length ?
                                                this.state.linkageAccountName.map((item, index) => {
                                                    return <Option key={item}>{item}</Option>
                                                })
                                                :
                                                ''
                                        }
                                    </Select>
                                    <Select size="large" value={this.state.activeAccountBranch} style={{ width: 230, marginLeft: 10 }} onChange={this.handleAccountBranch}>
                                        {
                                            this.state.linkageAccountBranch.length ?
                                                this.state.linkageAccountBranch.map((item, index) => {
                                                    return <Option key={item}>{item}</Option>
                                                })
                                                :
                                                ''
                                        }
                                    </Select>
                                </div>
                                <div className="clear"></div>
                            </div>

                            <div className="payment-drop__row">
                                <span className="pull-left name"></span>
                                <div className="pull-left">
                                    <Select size="large" value={this.state.activeCardNumber} style={{ width: 360 }} onChange={this.handleCardNumber}>
                                        {
                                            this.state.linkageCardNumber.length ?
                                                this.state.linkageCardNumber.map((item, index) => {
                                                    return <Option key={item}>{item}</Option>
                                                })
                                                :
                                                ''
                                        }
                                    </Select>
                                </div>
                                <div className="clear"></div>
                            </div>

                            <div className="payment-drop__row">
                                <span className="pull-left name">付款方账户名：</span>
                                <div className="pull-left">
                                    <em className="user-name">{this.state.paymentAccountName}</em>
                                </div>
                                <div className="clear"></div>
                            </div>

                            <div className="payment-drop__row">
                                <span className="pull-left name">支付方式：</span>
                                <div className="pull-left">
                                    <Select size="large" value={this.state.payModeName} style={{ width: 95 }} onChange={this.handlePayModeChange}>
                                        <Option key="现汇">现汇</Option>
                                        <Option key="票据">票据</Option>
                                        <Option key="通信证">通信证</Option>
                                    </Select>
                                </div>
                                <div className="clear"></div>
                            </div>

                            <div className="payment-drop__row">
                                <span className="pull-left name">支付渠道：</span>
                                <div className="pull-left">
                                    {
                                        this.state.payChannel.length ?
                                            <RadioGroup
                                                onChange={this.handleSettChannelName}
                                                value={ this.state.settChannelName }
                                            >
                                                {
                                                    this.state.payChannel.map((item, index) => {
                                                        return (
                                                            <Radio key={ index } style={{ display: 'block', lineHeight: '32px' }}  value={item.value}>{ item.value }</Radio>
                                                        )
                                                    })
                                                }
                                            </RadioGroup>
                                            :
                                            ''
                                    }

                                </div>
                                <div className="clear"></div>
                            </div>
                        </div>
                        {/*收款方信息*/}
                        <div className="edit-row payment-info" onClick={this.dropdownFunPayee}>
                            <a className="pull-left" href="javascript: ">收款方信息 </a>
                            <Icon className={ `pull-left ${ this.state.dropdownMovePayee ? "transform-rotate" : "" }` } type="caret-up" />
                            <div className="clear"></div>
                        </div>

                        <div className={ `payment-drop ${ this.state.dropdownMovePayee ? "payment-drop-active" : "" }` }>
                            <div className="payment-drop__row">
                                <span className="pull-left name">收款方账户：</span>
                                <div className="pull-left">
                                    <Select size="large" value={bank} style={{ width: 120 }} onChange={this.bankChange}>
                                        {banks.map((item, index) => {
                                            return (<Option key={index} value={item.name}>{item.name}</Option>)
                                        })}
                                    </Select>
                                    <Select size="large" value={subBank} style={{ width: 230, marginLeft: 10 }} onChange={this.subBankChange}>
                                        {subBanks.map((item, index) => {
                                            return (<Option key={index} value={item.name}>{item.name}</Option>)
                                        })}
                                    </Select>
                                </div>
                                <div className="clear"></div>
                            </div>

                            <div className="payment-drop__row">
                                <span className="pull-left name"></span>
                                <div className="pull-left">
                                    <Select size="large" value={bankAcc}  style={{ width: 360 }} onChange={this.bankAccChange}>
                                        {bankAccs.map((item, index) => {
                                            return (<Option key={index} value={item.name}>{item.name}</Option>)
                                        })}
                                    </Select>
                                </div>
                                <div className="clear"></div>
                            </div>

                            <div className="payment-drop__row">
                                <span className="pull-left name">收款方账户名：</span>
                                <div className="pull-left">
                                    <em className="user-name">{bankAccName}</em>
                                </div>
                                <div className="clear"></div>
                            </div>
                        </div>
                    </article>
                </Modal>

            </div>

        );
    }
}

export default EditModal;
