import React, { Component } from 'react';
import { Input, Button, message,Select } from 'antd';
import Table from './component/Table';
import HttpRequest from '../../../request/Fetch';
import './style.scss';
const Option = Select.Option;


const  dataSource=[{'key':0,'value':'交易未完成'},{'key':1,'value':'交易失败'},{'key':2,'value':'交易成功'},{'key':3,'value':'处理中'},{'key':'','value':'全部状态'}]
class personage extends Component {
    state = {
        pageNumber: 1, // 查询页码
        pageSize: 10, // 查询每页的条数
        total: '', // 总页码
        data: [], // 列表数据
        payTypeData:[],//付款方式数据

        exportURL: '', // 导出链接
        clickExportState: true, // 导出是导出所有故而点击分页不必加载导出接口, false, 点击分页，true点击搜索

        payAccountNo:'',//手机号
        payAccountName:'',//名称
        tradeChannel:'',//付款方式
        source:'1',//来源
        sourceData:[{'key':'1','value':'发票云'}],
        typeState:"",//状态
        dataSource:dataSource,//状态数据
    }

    componentDidMount () {
        this.getPersonageDefineApi();
        this.getPayTypeData()
    }

    // 页码回调
    onPageChange = (num) => {
        this.setState({
            pageNumber: num,
            clickExportState: false
        }, () => {
            this.getPersonageDefineApi();
        })
    }
    //付款方式下拉
    getPayTypeData=()=>{
        HttpRequest({
            addr: 'getPersonalDict',
        }, respone => {
            this.setState({
                payTypeData: respone.data,
            })
        })
    }
    // 获取个人查询搜索列表
    getPersonageDefineApi = () => {
        const { pageNumber, pageSize, payAccountNo, payAccountName, tradeChannel,source,typeState,clickExportState } = this.state;

            let formData = {};
            formData.addr='getPersonalOrders';
            formData.payAccountNo=payAccountNo;
            formData.payAccountName=payAccountName;
            formData.source=source;
            formData.state=typeState;
            formData.pageNumber=pageNumber;
            formData.pageSize=pageSize;
            if( tradeChannel !== ""){
                formData.tradeChannel=tradeChannel;
            }
        HttpRequest(formData, respone => {
            this.setState({
                data: respone.data,
                total: respone.data.total
            },
            //     () => {
            //     if (clickExportState) {
            //         this.exportRuleApi();
            //     }
            // }
            )
        })
    }

    // 规则导出
    // exportRuleApi = () => {
    //     const {busTypeName, companyName, tenantName } = this.state;
    //
    //     HttpRequest({
    //         addr: 'exportRuleApi',
    //         busTypeName,
    //         companyName,
    //         tenantName,
    //     }, respone => {
    //         this.setState({
    //             exportURL: respone.url
    //         })
    //     })
    // }

    // 点击导出按钮
    exportButton = () => {
        const { exportURL } = this.state;
        
        if (exportURL) {
            window.open(encodeURI(window.location.protocol + '//' + window.location.host + '/imgservice/download/' + exportURL));
        } else {
            message.warning('正在加载...请稍后再试');
        }
    }

    // 付款方手机号
    payAccountNoChange = (e) => {
        let payAccountNo = e.target.value;
        this.setState({
            payAccountNo
        })
    }

    // 付款方名称
    payAccountNameChange = (e) => {
        let payAccountName = e.target.value;
        this.setState({
            payAccountName
        })
    }
    //类型状态选择
    stateChange=(value)=>{
        this.setState({
            typeState:value,
        })
    }
    //支付方式选择
    tradeChannelChange=(value)=>{
        this.setState({
            tradeChannel:value,
        })
    }

    // 搜索按钮
    onSearchWillTest = () => {
        this.setState({
            pageNumber: 1,
            clickExportState: true
        }, () => {
            this.getPersonageDefineApi();
        })
    }

    render () {
        return (
            <section className="container personage-box">
                <h4 className="column-title">当前位置：个人查询</h4>

                <div className="search-group">
                    <div className="pull-left search-input">
                        <Input className="pull-left" style={{ width: 200, marginRight: 15 }} placeholder="付款方手机号" onChange={ this.payAccountNoChange } />
                        <Input className="pull-left" style={{ width: 200, marginRight: 15 }} placeholder="付款方用户名" onChange={ this.payAccountNameChange } />
                        <Select className="pull-left" style={{width: 200, marginRight: 15}}
                                value={this.state.tradeChannel} onChange={(value) => this.tradeChannelChange(value)} >
                            <Option   key="1" value="" >全部</Option>
                            {this.state.payTypeData.map((value,index)=><Option  key={index}  value={value.dictCode}>{value.dictName}</Option>)}
                        </Select>
                        <Select className="pull-left" style={{width: 200, marginRight: 15}}
                                value={this.state.source} onChange={(value) => this.setState({source:value})} >
                            {this.state.sourceData.map((value,index)=><Option  key={index}  value={value.key}>{value.value}</Option>)}
                        </Select>
                        <Select className="pull-left" style={{ width: 200, marginRight: 15 }}
                                value={this.state.typeState}  onChange={(value)=>this.stateChange(value)}  >
                            {this.state.dataSource.map((value,index)=><Option  key={index}  value={value.key}>{value.value}</Option>)}
                        </Select>
                        <Button className="pull-left search-button" type="primary" shape="circle" icon="search" onClick={ this.onSearchWillTest } />
                        <div className="clear"></div>
                    </div>

                    {/*<div className="pull-right export">*/}
                        {/*<Button onClick={ this.exportButton } type="primary" style={{ width: 72, height: 32, backgroundColor: '#23b8f6', borderColor: '#23b8f6' }}>导出</Button>*/}
                    {/*</div>*/}
                    <div className="clear"></div>
                </div>

                <div className="table-box">
                    <Table
                        pageSize={ this.state.pageSize }
                        total={ this.state.total }
                        current={ this.state.pageNumber }
                        onPageChange={ this.onPageChange }
                        data = { this.state.data }
                        payTypeData={this.state.payTypeData}
                        dataSource={this.state.dataSource}
                    />
                </div>
            </section>
        )
    }
}

export default personage;
