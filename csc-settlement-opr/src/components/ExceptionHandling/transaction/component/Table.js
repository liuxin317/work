import React, { Component } from 'react';
import { Table,Modal,Button,DatePicker,message } from 'antd';
import HttpRequest from '../../../../request/Fetch';
import { Link } from 'react-router-dom';
import { routeRootPath } from '../../../common/method';
import 'moment/locale/zh-cn';
import moment from 'moment';
const   confirm=Modal.confirm;
const dateFormat = 'YYYY-MM-DD';
class AccountTable extends Component {
    state={
        visible:false,
        startDate:'',
        endDate:'',
        accountNo:'',

        startD:'',
        endD:'',
        record:'',
    };


    // 获取详情弹窗
    openDetailModal = (record) => {
        console.log(record);
        let  dataAccount={};
        dataAccount.accountName=record.accountName;
        dataAccount.accountNumber=record.accountNo;
       this.setState({
           record:dataAccount,
           accountNo:record.accountNo,
           visible:true,
           startD:'',
           endD:'',
           startDate:'',
           endDate:'',
       })
    };


    handleOk = () => {
        this.getTranscationData();
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    //开始时间
    startDateChg=(dates)=>{
        this.setState({
            startD:dates
        })
        let d = new Date(dates);
        let startDate = d.getFullYear() + (d.getMonth() >= 9 ? '-' :  '-0' ) + (d.getMonth() + 1) + (d.getDate() > 9 ? '-' :  '-0' ) + d.getDate();
        this.setState({
            startDate:startDate,
        })
    };
    //结束时间
    endDateChg=(dates)=>{
        this.setState({
            endD:dates
        })
        let d = new Date(dates);
        let endDate = d.getFullYear() + (d.getMonth() >= 9 ? '-' :  '-0' ) + (d.getMonth() + 1) + (d.getDate() > 9 ? '-' :  '-0' ) + d.getDate();
        this.setState({
            endDate:endDate,
        })
    };
    //设置结束日期选择范围
    disabledDateStart=(current)=>{
        // return  current > moment().endOf('day');
        if (this.state.endD){
            if(this.state.endD < moment().startOf('day')){
                return current && current > moment().startOf('day');
            }else{
                return  current > moment().endOf('day');
            }
        }else{
            return  current > moment().endOf('day');
        }
    };

    //设置结束日期选择范围
    disabledDate=(current)=>{
        // return current && current.valueOf() < Date.now();
        if (this.state.startD){
            if(this.state.startD < moment().startOf('day')){
                return current && current > moment().startOf('day');
            }else{
                return  current > moment().endOf('day');
            }
        }else{
            return  current > moment().endOf('day');
        }
    };
    //查询详情
    getTranscationData = () => {
        const { startDate, endDate ,accountNo} = this.state;
        let curDate = new Date();
        let now = curDate.getFullYear() + (curDate.getMonth() >= 9 ? '-' :  '-0' ) + (curDate.getMonth() + 1) + (curDate.getDate() > 9 ? '-' :  '-0' ) + curDate.getDate();

         let nowDate = new Date(Date.parse(now))
        //把字符串格式转换为日期类
        let startTime = new Date(Date.parse(startDate));
        let endTime = new Date(Date.parse(endDate));

        console.log("当前时间",nowDate,startTime,endTime);
        if(this.state.startD  === "" || !this.state.startD){
            message.warning("请输入开始时间!");
            return false;
        } else if(this.state.endD  === ''|| !this.state.endD){
            message.warning("请输入结束时间!");
            return false;
        }
        if(startTime<nowDate &&  endTime>=nowDate ){
            message.warning("结束时间必须是今天之前!");
            return false;
        }  else if(startTime>endTime){
            message.warning("结束时间必须大于开始时间!");
            return false;
        }
            this.setState({
                visible: false,
            });
        HttpRequest({
            addr: 'synchroTradeDetailByDate',
            startDate,
            endDate,
            accountNo,
        }, respone => {
            this.setState({
                    data: respone.data
            });
            this.showConfirm()
        })
    };


    showConfirm=()=>{
        Modal.info({
            title: '恭喜你获取数据成功!',
            content: (
                <div>
                    <Link to={{ pathname: routeRootPath + 'aggregate-query/trade-details', state: this.state.record }}>请在企业汇总-账户查询-交易明细中查看数据</Link>
                    {/*<p   onClick={this.props.jumpTransaction}  style={{'color':'#22b2e7'}}>请在企业汇总-账户查询-交易明细中查看数据</p>*/}
                </div>
            ),
            onOk() {},
        });
    }
    render () {
        console.log(this.props)
        const { total, pageSize, data, current, onPageChange } = this.props;
        // 表头
        const columns = [{
            title: '组织机构',
            dataIndex: 'orgName',
            key: 'orgName',
            width: '12.5%',
        }, {
            title: '银行开户名称',
            dataIndex: 'accountName',
            key: 'accountName',
            width: '12.5%',
        }, {
            title: '银行开户账号',
            dataIndex: 'accountNo',
            key: 'accountNo',
            width: '12.5%',
        }, {
            title: '开户行行别',
            dataIndex: 'bankCatagery',
            key: 'bankCatagery',
            width: '12.5%',
        }, {
            title: '详情',
            width: '12.5%',
            render: (text, record) => {
                return <a href="javascript: void(0)" onClick={ ()=>this.openDetailModal(record) }>获取交易明细</a>
            }
        }];

        return (
            <section>
                <Table
                    pagination={{showQuickJumper: true, total, pageSize, current, onChange: onPageChange, showTotal: total => `共 ${total} 条`}}
                    rowKey={(record, index) => index}
                    columns={ columns }
                    dataSource={ data }
                />

                <Modal
                    closable={false}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={"400px"}
                    maskClosable={false}
                >
                    <div className="transactionModal">
                        <div  className="transactionModal-row">
                            <span>开始时间:</span>
                            <DatePicker format={dateFormat}
                                        onChange={this.startDateChg}
                                        disabledDate={this.disabledDateStart}
                                        value={this.state.startD}
                            />
                        </div>
                        <div className="transactionModal-row">
                            <span>结束时间:</span>
                            <DatePicker format={dateFormat}
                                        onChange={this.endDateChg}
                                        disabledDate={this.disabledDate}
                                        value={this.state.endD}
                            />
                            {/*<p onClick={this.props.jumpTransaction}>点击跳转</p>*/}

                            {/*<Link to={{ pathname: routeRootPath + 'aggregate-query/trade-details', state: this.state.record }}>交易明细</Link>*/}
                        </div>
                    </div>
                </Modal>
            </section>
        )
    }
}

export default AccountTable;