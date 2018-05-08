import React, { Component } from 'react';
import { Modal, Select, Input, InputNumber, message, DatePicker, Radio } from 'antd';
import moment from 'moment';
import './style.scss';

const RadioGroup = Radio.Group;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const date = new Date();
const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();

export default class AddEditList extends Component {
    state = {
        AcAccountName: [], //收款方名称
        MyAccountName: [], //付款方名称
        AcAccountNumber: [], //收款方账户号
        MyAccountNumber: [], //付款方账户号
        addMyAccountNumber: '', //新增付款方账户号
        addAcAccountNumber: '', //新增收款方账户号
        addEditVisible: false, // 弹窗开关
        amount: '', //新增金额
        newAcAccountName: '', //当前选择收款方名称
        newMyAccountName: '', //当前选择付款方名称
        type: '', //1、代表新增；2、代表编辑
        rowData: {}, //当前列的数据,
        prePayTime: '', //预支付日期
        paymentTypeValue: 0, // 0、预支付，1、立即支付
        payId: '', // 付款方ID
        receiveId: '', // 收款方ID
        payChannel: '', // 支付渠道
        payChannelArray: [], // 当前银行下得支付渠道组
    }

    //打开弹窗
    openModal = (type, rowData) => {
        this.setState({
            addEditVisible: true,
            amount: '',
            prePayTime: '',
            payChannel: '',
            payChannelArray: [],
            type
        })

        if (rowData) {
            this.setState({
                rowData,
                addMyAccountNumber: rowData.payAccount,
                addAcAccountNumber: rowData.receiveAccount,
                newAcAccountName: rowData.receiveAccountName,
                newMyAccountName: rowData.payAccountName,
                payId: rowData.payId,
                receiveId: rowData.receiveId,
                amount: rowData.amount,
                prePayTime: rowData.prePayTime.split(' ')[0],
                paymentTypeValue: rowData.immediate,
                payChannel: rowData.payChannel
            })
        }
    }

    // 新增编辑确定
    addOk = () => {
        if (this.state.type === 1) { // 新增
            this.saveFundTransfer();
        } else { // 编辑
            this.updateFundTransfer();
        }
    }

    // 新增取消
    addCancel = () => {
        this.setState({
            addEditVisible: false
        })
    }

    // 获取付款方账户
    getFundTransferMyAccountName = () => {
        Util.comFetch({
            addr: 'getFundTransferMyAccountName',
        }, res => {
            if (this.state.type === 2) { // 编辑
                this.setState({
                    MyAccountName: res.data,
                    AcAccountName: res.data
                })

                this.getFundTransferMyAccountNumber(this.state.rowData.payAccountName, '', 'f');
                this.getFundTransferMyAccountNumber(this.state.rowData.receiveAccountName, '', 's');
            } else {
                this.setState({
                    MyAccountName: res.data,
                    newMyAccountName: res.data[0],
                    AcAccountName: res.data,
                    newAcAccountName: res.data[0],
                })

                this.getFundTransferMyAccountNumber(res.data[0]);
            }
        })
    }

    // 根据开户行姓名查询付款方账号
    getFundTransferMyAccountNumber = (name, type, source) => {
        Util.comFetch({
            addr: 'getFundTransferMyAccountNumber',
            accountName: name
        }, res => {
            if (this.state.type === 2) { // 编辑
                if (type === 2) { // 重新选择银行账户
                    if (source === 'f') {
                        this.setState({
                            MyAccountNumber: res.data,
                            addMyAccountNumber: res.data[0].accountNumber,
                            payId: res.data[0].id,
                            payChannelArray: res.data[0].payChannel,
                            payChannel: res.data[0].payChannel[0]
                        })
                    } else if (source === 's') {
                        this.setState({
                            AcAccountNumber: res.data,
                            addAcAccountNumber: res.data[0].accountNumber,
                            receiveId: res.data[0].id,
                        })
                    }
                } else { // 第一次点开编辑弹窗
                    if (source === 'f') {
                        this.setState({
                            MyAccountNumber: res.data,
                            payChannelArray: res.data[0].payChannel
                        })
                    } else if (source === 's') {
                        this.setState({
                            AcAccountNumber: res.data
                        })
                    }
                }
            } else {
                if (source === 'f') {
                    this.setState({
                        MyAccountNumber: res.data,
                        payId: res.data[0].id,
                        addMyAccountNumber: res.data[0].accountNumber,
                        payChannelArray: res.data[0].payChannel,
                        payChannel: res.data[0].payChannel[0]
                    })
                } else if (source === 's') {
                    this.setState({
                        AcAccountNumber: res.data,
                        receiveId: res.data[0].id,
                        addAcAccountNumber: res.data[0].accountNumber
                    })
                } else {
                    this.setState({
                        MyAccountNumber: res.data,
                        addMyAccountNumber: res.data[0].accountNumber,
                        payId: res.data[0].id,
                        AcAccountNumber: res.data,
                        addAcAccountNumber: res.data[0].accountNumber,
                        receiveId: res.data[0].id,
                        payChannelArray: res.data[0].payChannel,
                        payChannel: res.data[0].payChannel[0]
                    })
                }
            }
        })
    }

    // 监听新增付款方银行名称选择
    MyBankNameChange = (value) => {
        this.setState({
            newMyAccountName: value
        })
        this.getFundTransferMyAccountNumber(value, 2, 'f') // 2代表在编辑状态修改监听change, f 付款方查询
    }

    // 监听新增收款方银行名称选择
    AcBankNameChange = (value) => {
        this.setState({
            newAcAccountName: value
        })

        this.getFundTransferMyAccountNumber(value, 2, 's') // 2代表在编辑状态修改监听change，s 收款方查询
    }

    // 监听收款方账户号
    AcBankNumberChange = (value) => {
        value = JSON.parse(value);
        this.setState({
            addAcAccountNumber: value.accountNumber,
            receiveId: value.id
        })
    }

    // 监听付款方账户号
    MyBankNumberChange = (value) => {
        value = JSON.parse(value);

        this.setState({
            addMyAccountNumber: value.accountNumber,
            payId: value.id
        })
    }

    // 监听新增金额
    addMount = (e) => {
        let amount = e.target.value;

        this.setState({
            amount
        });
    }

    // 添加调拨订单
    saveFundTransfer = () => {
        const { amount, addMyAccountNumber, receiveId, payId, addAcAccountNumber, prePayTime, paymentTypeValue, payChannel } = this.state;
        
        let fundTransferInfo = Object.assign({}, {amount, payAccount: addMyAccountNumber, receiveAccount: addAcAccountNumber, prePayTime: prePayTime ? `${ prePayTime } 00:00:00` : '', immediate: paymentTypeValue, payId, receiveId, payChannel});

        if (!amount) {
            message.warning('金额不能为空');
            return false;
        };
        
        if (!/(^[1-9]([0-9]{1,12})?(\.[0-9]{1,2})?$)|(^[0](\.[0-9]{1,2})$)/.test(amount)) {
            message.warning('输入金额只能为数字且不能为零，长度不能超过13位且最多保留两位小数');
            return false;
        };
        
        if (!paymentTypeValue) {
            if (!prePayTime) {
                message.warning('预支付日期不能为空');
                return false;
            };
        };
        
        if (addMyAccountNumber === addAcAccountNumber) {
            message.warning('收付账号不能相同');
            return false;
        };

        Util.comFetch({
            addr: 'saveFundTransfer',
            fundTransferInfo: JSON.stringify(fundTransferInfo)
        }, res => {
            message.success('添加成功');
            this.props.sreachOrders()
            this.setState({
                addEditVisible: false
            })
        })
    }

    // 编辑保存
    updateFundTransfer = () => {
        const { amount, addMyAccountNumber, receiveId, payId, addAcAccountNumber, prePayTime, paymentTypeValue, payChannel } = this.state;
        let fundTransferInfo = Object.assign({}, {amount, payAccount: addMyAccountNumber, receiveAccount: addAcAccountNumber, id: this.state.rowData.id, prePayTime: prePayTime ? `${ prePayTime } 00:00:00` : '', immediate: paymentTypeValue, receiveId, payId, payChannel});
        
        if (!amount) {
            message.warning('金额不能为空');
            return false;
        };

        if (!/(^[1-9]([0-9]{1,12})?(\.[0-9]{1,2})?$)|(^[0](\.[0-9]{1,2})$)/.test(amount)) {
            message.warning('输入金额只能为数字且不能为零，长度不能超过13位且最多保留两位小数');
            return false;
        };

        if (!paymentTypeValue) {
            if (!prePayTime) {
                message.warning('预支付日期不能为空');
                return false;
            }

            if (Number(this.get_unix_time(this.state.prePayTime)) < Number(this.get_unix_time(`${year}-${month}-${day}`))) {
                message.warning('预支付日期不能小于当前日期');
                return false;
            }
        }
        
        if (addMyAccountNumber === addAcAccountNumber) {
            message.warning('收付账号不能相同');
            return false;
        }

        Util.comFetch({
            addr: 'updateFundTransfer',
            companyId: userInfo.companyRowId,
            fundTransferInfo: JSON.stringify(fundTransferInfo)
        }, res => {
            message.success('编辑成功');
            this.props.sreachOrders()
            this.setState({
                addEditVisible: false
            })
        })
    }

    // 将日期转成时间戳
	get_unix_time = (dateStr) => {
        var newstr = dateStr.replace(/-/g,'/'); 
        var date =  new Date(newstr); 
        var time_str = date.getTime().toString();
        return time_str.substr(0, 10);
    }

    // 无法选择今天和今天之前的日子
	disabledDate = (current) => {
        return current && current.valueOf() < Date.now() - (24*60*60*1000);
    }

    // 监听预支付日期
    onChangeDate = (value, date) => {
        this.setState({
            prePayTime: date
        })
    }

    // 选择的支付类型value
    onChangePaymentValue = (e) => {
        this.setState({
            paymentTypeValue: e.target.value
        });
    }

    // 监听支付渠道
    payChannelChange = (value) => {
        this.setState({
            payChannel: value
        })
    }

    render () {
        const { AcAccountName, MyAccountName, MyAccountNumber, AcAccountNumber, newMyAccountName, newAcAccountName, addMyAccountNumber, addAcAccountNumber, payChannelArray, payChannel, amount } = this.state;

        return (
            <section>
                {/* 新增编辑弹窗 */}
                <Modal
                    title={ this.state.type === 2 ? '编辑' : '新增' }
                    visible={this.state.addEditVisible}
                    onOk={this.addOk}
                    onCancel={this.addCancel}
                    maskClosable={ false }
                    className="frozen-box01 add-modal-box01"
                >
                    <div className="add-group">
                        <h6 className="name">付款方信息：</h6>
                        <div className="add-row-group">
                            <label className="pull-left">银行开户名称：</label>
                            <div className="pull-left">
                                <Select value={ newMyAccountName } style={{ width: 385, height: 35 }} onChange={this.MyBankNameChange}>
                                    {
                                        MyAccountName.map((item, index) => {
                                            return <Option key={ index } value={ item }>{ item }</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="clear"></div>
                        </div>

                        <div className="add-row-group">
                            <label className="pull-left">银行账号：</label>
                            <div className="pull-left">
                                <Select value={ addMyAccountNumber } style={{ width: 385, height: 35 }} onChange={this.MyBankNumberChange}>
                                    {
                                        MyAccountNumber.map((item, index) => {
                                            return <Option key={ index } value={ JSON.stringify(item) }>{ item.accountNumber }</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="clear"></div>
                        </div>

                        <div className="add-row-group">
                            <label className="pull-left">金额：</label>
                            <div className="pull-left">
                                <Input value={ amount } onChange={ this.addMount.bind(this) } style={{ width: 385, height: 35 }} placeholder="请输入金额" />
                            </div>
                            <div className="clear"></div>
                        </div>

                        <div className="add-row-group">
                            <label className="pull-left">支付渠道：</label>
                            <div className="pull-left">
                                <Select value={ payChannel } style={{ width: 385, height: 35 }} onChange={this.payChannelChange}>
                                    {
                                        payChannelArray.map((item, index) => {
                                            return <Option key={ index } value={ item }>{ item }</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="clear"></div>
                        </div>

                        <div className="add-row-group" style={{ display: 'none' }}>
                            <label className="pull-left" style={{ height: 35 }}></label>
                            <RadioGroup 
                                onChange={this.onChangePaymentValue} 
                                value={this.state.paymentTypeValue}
                            >
                                <Radio value={0}>预支付</Radio>
                                <Radio value={1}>立即支付</Radio>
                            </RadioGroup>
                        </div>
                        
                        {
                            this.state.paymentTypeValue 
                            ?
                            ''
                            :
                            <div className="add-row-group">
                                <label className="pull-left">预支付日期：</label>
                                <div className="pull-left">
                                    {
                                        this.state.prePayTime 
                                        ?
                                        <DatePicker value={ moment(this.state.prePayTime, dateFormat) } className="pull-left" allowClear={ false } onChange={this.onChangeDate} disabledDate={this.disabledDate} style={{ width: 385, height: 35 }} />
                                        :
                                        <DatePicker value={ null } className="pull-left" allowClear={ false } onChange={this.onChangeDate} disabledDate={this.disabledDate} style={{ width: 385, height: 35 }} />
                                    }
                                </div>
                                <div className="clear"></div>
                            </div>
                        }
                    </div>

                    <div className="add-group">
                        <h6 className="name">收款方信息：</h6>
                        <div className="add-row-group">
                            <label className="pull-left">银行开户名称：</label>
                            <div className="pull-left">
                                <Select value={ newAcAccountName } style={{ width: 385, height: 35 }} onChange={this.AcBankNameChange}>
                                    {
                                        AcAccountName.map((item, index) => {
                                            return <Option key={ index } value={ item }>{ item }</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="clear"></div>
                        </div>

                        <div className="add-row-group">
                            <label className="pull-left" style={{ height: 35 }}>银行账号：</label>
                            <div className="pull-left">
                                {
                                    <Select value={ addAcAccountNumber } style={{ width: 385, height: 35 }} onChange={this.AcBankNumberChange}>
                                        {
                                            AcAccountNumber.map((item, index) => {
                                                return <Option key={ index } value={ JSON.stringify(item) }>{ item.accountNumber }</Option>
                                            })
                                        }
                                    </Select>
                                }
                            </div>
                            <div className="clear"></div>
                        </div>
                    </div>
                </Modal>
            </section>
        )
    }
}
