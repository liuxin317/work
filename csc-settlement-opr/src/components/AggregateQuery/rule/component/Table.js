import React, { Component } from 'react';
import { Table, Modal } from 'antd';
import HttpRequest from '../../../../request/Fetch';

class RuleTable extends Component {
    state = {
        visible: false, // 详情弹窗开关
        rowData: '', // 当前列的数据
        rowDetails: '', //当前列的详情
    }

    // 打开详情弹窗
    openDetailModal = (rowData) => {
        this.setState({
            visible: true,
            rowDetails: '',
            rowData
        }, () => {
            this.findOneRuleConf();
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

    // 详情查询接口
    findOneRuleConf = () => {
        const { rowData } = this.state;

        HttpRequest({
            addr: 'findOneRuleConf',
            tenantId: rowData.tenantId,
            companyId: rowData.companyId,
            ruleConfId: rowData.id
        }, response => {
            this.setState({
                rowDetails: response.data
            })
        })
    }

    render () {
        const { total, data, pageSize, current, onPageChange } = this.props;
        const { rowDetails, rowData } = this.state;
        let ruleDefineModel = rowDetails.ruleDefineModel ? rowDetails.ruleDefineModel : {};

        // 表头
        const columns = [{
            title: '租户名称',
            dataIndex: 'tenantName',
            key: 'tenantName',
            width: '12.5%',    
        }, {
            title: '公司名称',
            dataIndex: 'companyName',
            key: 'companyName',
            width: '12.5%',
        }, {
            title: '规则名称',
            dataIndex: 'name',
            key: 'name',
            width: '12.5%',
        }, {
            title: '规则模板',
            dataIndex: 'a',
            key: 'a',
            width: '12.5%',
            render: (text, record) => {
                return <span>{ record.ruleDefine.name }</span>
            }
        }, {
            title: '收支对象名称',
            dataIndex: 'customerName',
            key: 'customerName',
            width: '12.5%',
        }, {
            title: '业务类型',
            dataIndex: 'busTypeName',
            key: 'busTypeName',
            width: '12.5%',
        }, {
            title: '付款方账号',
            dataIndex: 'pAccountNumber',
            key: 'pAccountNumber',
            width: '12.5%',
        }, {
            title: '操作',
            width: '12.5%',
            render: (text, record) => {
                return <a href="javascript: void(0)" onClick={ this.openDetailModal.bind(this, record) }>规则详情</a>
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
                    title="规则详情"
                    visible={this.state.visible}
                    onOk={this.handleDetailOk}
                    onCancel={this.handleDetailCancel}
                    footer={null}
                    className="modal-box modal-details"
                >
                    <section>
                        <article className="pull-left modal-left">
                            <div className="details-group">
                                <div className="row">
                                    <span className="pull-left">规则名称：</span>
                                    <em className="pull-left">{ rowDetails.name }</em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">收支对象名称：</span>
                                    <em className="pull-left">{ rowDetails.customerName }</em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">业务类型：</span>
                                    <em className="pull-left">{ rowDetails.busTypeName }</em>
                                    <div className="clear"></div>
                                </div>
                            </div>

                            <div className="details-group">
                                <h4>付款方信息</h4>

                                <div className="row">
                                    <span className="pull-left">开户行行别：</span>
                                    <em className="pull-left">{ rowData.pBankCategoryName }</em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">银行开户名称：</span>
                                    <em className="pull-left">{ rowDetails.pAccountName }</em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">银行开户账号：</span>
                                    <em className="pull-left">{ rowDetails.pAccountNumber }</em>
                                    <div className="clear"></div>
                                </div>
                            </div>
                        </article>

                        <aside className="pull-left modal-right">
                            <div className="details-group">
                                <div className="row">
                                    <span className="pull-left">规则定义：</span>
                                    <em className="pull-left">{ ruleDefineModel.name }</em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">付款方式：</span>
                                    <em className="pull-left active">
                                        {
                                            ruleDefineModel.payMode
                                            ?
                                            <cite>{ ruleDefineModel.payMode }</cite>
                                            :
                                            ''
                                        }
                                        
                                        {
                                            ruleDefineModel.payChannel
                                            ?
                                            <cite style={{ marginLeft: 10 }}>{ ruleDefineModel.payChannel }</cite>
                                            :
                                            ''
                                        }
                                    </em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">付款额度：</span>
                                    <em className="pull-left active">
                                        {
                                            ruleDefineModel.payLimit
                                            ?
                                            <cite>{ ruleDefineModel.payLimit }</cite>
                                            :
                                            ''
                                        }
                                    </em>
                                    <div className="clear"></div>
                                </div>
                            </div>

                            <div className="details-group">
                                <h4>起算日配置</h4>

                                <div className="row">
                                    <span className="pull-left">结算类型：</span>
                                    <em className="pull-left active">
                                        {
                                            ruleDefineModel.settleType
                                            ?
                                            <cite>{ ruleDefineModel.settleType }</cite>
                                            :
                                            ''
                                        }
                                    </em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">月结起始日：</span>
                                    <em className="pull-left active">
                                        {
                                            ruleDefineModel.settleBeginDay
                                            ?
                                            <cite>{ ruleDefineModel.settleBeginDay }</cite>
                                            :
                                            ''
                                        }
                                    </em>
                                    <div className="clear"></div>
                                </div>

                                <div className="row">
                                    <span className="pull-left">延期付款天数：</span>
                                    <em className="pull-left active">
                                        {
                                            ruleDefineModel.latestPayDay || ruleDefineModel.latestPayDay === 0
                                            ?
                                            <cite>{ ruleDefineModel.latestPayDay }日</cite>
                                            :
                                            ''
                                        }
                                    </em>
                                    <div className="clear"></div>
                                </div>
                            </div>
                        </aside>

                        <div className="clear"></div>
                    </section>
                </Modal>
            </section>
        )
    }
}

export default RuleTable;