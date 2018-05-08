import React, { Component } from 'react';
import { Table, Modal } from 'antd';
import HttpRequest from '../../../../request/Fetch';
const   confirm=Modal.confirm;
class personageTable extends Component {
    state = {
        data:''
    }

    // 状态核对弹窗
    openDetailModal = (rowData) => {

        HttpRequest({
            addr:'getPersonalOrderResult',
            transactionId:rowData.transactionId
        }, respone => {
            this.setState({
                    data: respone.data,
                });
            if(respone.data){
                if (this.state.data.status==rowData.state){
                    this.warning()
                }
                else{
                    this.showConfirm(rowData)
                }
            }
        });


            // if (this.state.data.status==rowData.state){
            //     this.warning()
            // }
            // else{
            //     this.showConfirm(rowData)
            // }

    };
    warning=()=>{
        Modal.warning({
            title: "状态一致无需重置",
        });
    };

    showConfirm=(rowData)=>{
        let  self=this;
        confirm({
            title: '状态不一致,是否需要重置?',
            content:(<div>{
                this.props.dataSource.map((v)=>{
                    if(v.key === rowData.state ){
                        return <div>结算平台状态:{v.value}</div>
                    }
                    // else if(v.key == this.state.data.status){
                    //     return  <div>统一账户平台状态:{v.value}</div>
                    // }
                })
            }

                {this.props.dataSource.map((v)=>{
                    if(v.key  == this.state.data.status){
                        return  <div>统一账户平台状态:{v.value}</div>
                    }
                })}
                     </div>),
            onOk() {
               self.updateOrderByResult(rowData)
            },
            onCancel() {
            },
        });
    }
    //状态不一致返回数据
    updateOrderByResult=(rowData)=>{
        let postData = {};
        postData.addr = 'updateOrderByResult';
        postData.transactionId = rowData.transactionId;
        postData.data = JSON.stringify(this.state.data);
        HttpRequest(postData
        , respone => {
            this.setState({
                },
            )
        });
    }

    render () {
        const { total, data, pageSize, current, onPageChange,payTypeData,dataSource } = this.props;
        console.log(this.props);

        // 表头
        const columns = [{
            title: '结算单号',
            dataIndex: 'code',
            key: 'code',
            width: '10%',
        }, {
            title: '订单来源',
            dataIndex: 'source',
            key: 'source',
            width: '10%',
            render:(text,record)=>{
                return record.source=='1'? <span>发票云</span> : <span>其他</span>
            }
        }, {
            title: '付款方手机号',
            dataIndex: 'payAccountNo',
            key: 'payAccountNo',
            width: '10%',
        }, {
            title: '付款方用户名',
            dataIndex: 'payAccountName',
            key: 'payAccountName',
            width: '10%',
        }, {
            title: '收款方公司名称',
            dataIndex: 'rcvCompanyName',
            key: 'rcvCompanyName',
            width: '10%',
        }, {
            title: '付款方式',
            dataIndex: 'tradeChannel',
            key: 'tradeChannel',
            width: '10%',
            render:(text,record)=>{
                let mm;
                payTypeData.map((v)=>{
                        if(v.dictCode == record.tradeChannel){
                            mm=v.dictName
                        }
                    }
                );
                return mm
            }
        }, {
            title: '交易流水号',
            dataIndex: 'transactionId',
            key: 'transactionId',
            width: '10%',
        }, {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            width: '10%',
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            width: '10%',
            render:(text,record)=>{
                let  nn;
                dataSource.map((v)=>{
                    if(v.key === record.state ){
                        nn=v.value
                    }
                });
                return  nn
            }
        }, {
            title: '操作',
            width: '10%',
            render: (text, record) => {
                return <a href="javascript: void(0)" onClick={ this.openDetailModal.bind(this, record) }>状态核对</a>
            }
        }];

        return (
            <section>
                <Table 
                    pagination={{showQuickJumper: true, total, pageSize, current, onChange: onPageChange, showTotal: total => `共 ${total} 条`}} 
                    rowKey={(record, index) => index} 
                    columns={ columns } 
                    dataSource={ data.rows }
                />
            </section>
        )
    }
}

export default personageTable;