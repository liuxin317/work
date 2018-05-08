import React, { Component } from 'react';
import { Table, Modal } from 'antd';

class TradeTable extends Component {
    state = {
        visible: false, // 详情弹窗开关
        rowData: "", // 当前列的数据
    }

    // 打开详情弹窗
    openDetailModal = (rowData) => {
        this.setState({
            visible: true,
            rowData
        })
    }

    // 弹窗确定
    handleDetailOk = () => {

    }

    // 弹窗取消
    handleDetailCancel = () => {
        this.setState({
            visible: false
        })
    }

    render () {
        const { total, pageSize, current, onPageChange, data } = this.props;
        const { rowData } = this.state;

        // 表头
        const columns = [{
            title: '交易流水号',
            dataIndex: 'bankSerialNo',
            key: 'bankSerialNo',
            width: '12.5%', 
        }, {
            title: '对方开户名称',
            width: '12.5%',
            render: (text, record) => {
                return <span>{ record.dcFlag === '借' ? record.rcvAccountName : record.payAccountName }</span>
            }
        }, {
            title: '发生金额',
            width: '12.5%',
            // render: (text, record) => {
            //     return <span className={ record.dcFlag === '借' ? 'color-green' : 'color-red' }>{record.dcFlag === '借' ? `-${Math.abs(record.amount)}` : `+${Math.abs(record.amount)}`}</span>
            // }


            render: (text, record) => {
                if (this.props.curId !== record.payAccountNo) {
                    return (<span style={{color:'red'}}>+{record.amount}</span>);
                } else {
                    if(record.amount.indexOf("-")!== -1){
                        return (<span style={{color:'green'}}>{record.amount}</span>);
                    }else{
                        return (<span style={{color:'green'}}>-{record.amount}</span>);
                    }
                }
            }
        }, {
            title: '银行余额',
            dataIndex: 'balance',
            key: 'balance',
            width: '12.5%',
        }, {
            title: '银行入账时间',
            dataIndex: 'tradeTime',
            key: 'tradeTime',
            width: '12.5%',
        }, {
            title: '摘要',
            dataIndex: 'summary',
            key: 'summary',
            width: '12.5%',
        }, {
            title: '操作',
            width: '12.5%',
            render: (text, record) => {
                return <a href="javascript: void(0)" onClick={ this.openDetailModal.bind(this, record) }>详情</a>
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
                
                {/* 详情弹窗 */}
                <Modal
                    title="会计单详情"
                    visible={this.state.visible}
                    onOk={this.handleDetailOk}
                    onCancel={this.handleDetailCancel}
                    footer={null}
                    className="modal-box modal-details modal-trade-details"
                >
                    <div className="package">
                        <article className="pull-left modal-left">
                            <div className="details-group">
                                <h4>交易详情</h4>

                                <div className="row">
                                    <span className="pull-left">对方银行账户名称：</span>
                                    <em className="pull-left">{ rowData.dcFlag === '借' ? rowData.rcvAccountName : rowData.payAccountName }</em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">借贷标识：</span>
                                    <em className="pull-left">{ rowData.dcFlag }</em>
                                    <div className="clear"></div>
                                </div>
                                
                                <div className="row">
                                    <span className="pull-left">附言：</span>
                                    <em className="pull-left">{ rowData.postscript }</em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">用途：</span>
                                    <em className="pull-left">{ rowData.purpose }</em>
                                    <div className="clear"></div>
                                </div>
                            </div>
                        </article>

                        <aside className="pull-left modal-right">
                            <div className="details-group">
                                <h4 style={{ height: 24 }}> </h4>

                                <div className="row">
                                    <span className="pull-left">对方银行账号：</span>
                                    <em className="pull-left">{ rowData.dcFlag === '借' ? rowData.rcvAccountNo : rowData.payAccountNo }</em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">币种：</span>
                                    <em className="pull-left active">{ rowData.currency }</em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">摘要：</span>
                                    <em className="pull-left active">{ rowData.summary }</em>
                                    <div className="clear"></div>
                                </div>
                            </div>
                        </aside>

                        <div className="clear"></div>
                    </div>

                    <div className="package">
                        <article className="pull-left modal-left">
                            <div className="details-group">
                                <h4>记账详情</h4>

                                <div className="row">
                                    <span className="pull-left">结算订单号：</span>
                                    <em className="pull-left">{ rowData.postscript  }</em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">会计凭证号：</span>
                                    <em className="pull-left">{ rowData.voucherCode }</em>
                                    <div className="clear"></div>
                                </div>
                                
                                <div className="row">
                                    <span className="pull-left">记账日期：</span>
                                    <em className="pull-left">{ rowData.accountTime }</em>
                                    <div className="clear"></div>
                                </div>
                            </div>
                        </article>

                        <aside className="pull-left modal-right">
                            <div className="details-group">
                                <h4 style={{ height: 24 }}> </h4>
                                
                                <div className="row">
                                    <span className="pull-left">会计服务订单号：</span>
                                    <em className="pull-left">{ rowData.busCode }</em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">业务类型：</span>
                                    <em className="pull-left active">{ rowData.businessType }</em>
                                    <div className="clear"></div>
                                </div>
                            </div>
                        </aside>

                        <div className="clear"></div>
                    </div>
                </Modal>
            </section>
        )
    }
}

export default TradeTable;