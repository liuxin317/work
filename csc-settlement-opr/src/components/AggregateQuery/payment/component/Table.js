import React, { Component } from 'react';
import { Table } from 'antd';
import ListDetails from '../../../common/ListDetails';

class PaymentTable extends Component {
    state = {
        openDetailVisible: false, // 付款申请列表详情弹窗开关
        orderRowInfo: '', //列表详情;
    }

    // 关闭付款申请列表详情弹窗;
    closeListDetailsModal = () => {
        this.setState({
            openDetailVisible: false,
        });
    }

    // 打开列表详情列表弹窗;
    openListDetailsModal = (rowData) => {
        this.refs.paymentListDetails.initModalNavBar(); // 初始化默认选项

        this.setState({
            orderRowInfo: rowData,
            openDetailVisible: true,
        });
    }

    render () {
        const { total, data, pageSize, current, onPageChange } = this.props;
        
        // 表头
        const columns = [{
            title: '组织机构',
            dataIndex: 'orgName',
            key: 'orgName',
            width: '10%',    
        }, {
            title: '结算单号',
            dataIndex: 'code',
            key: 'code',
            width: '10%',
        }, {
            title: '付款方账号',
            width: '10%',
            render: (text, record) => {
                return <span className={record.accountNumberFlag=="0"?"":"color-red"}>{ record.myAccount ? record.myAccount.accountNumber : '' }</span>
            }
        }, {
            title: '收支对象名称',
            dataIndex: 'customerName',
            key: 'customerName',
            width: '10%',
        }, {
            title: '收款方账户名称',
            width: '10%',
            render: (text, record) => {
                return <span className={record.acAccountNumberFlag=="0"?"":"color-red"}>{ record.myAccount ? record.currentCustomerBank.accountName ? record.currentCustomerBank.accountName : record.customerName : record.customerName }</span>
            }
        }, {
            title: '金额',
            width: '10%',
            render: (text, record) => {
                return <span className={record.amountFlag=="0"?"":"color-red"}>{`${record.amount}`}</span>
            }
        }, {
            title: '预支付日期',
            width: '10%',
			render: (text, record) => {
				return <span className={record.prePayTimeFlag=="0"?"":"color-red"}>{ record.prePayTime }</span>
			}
        }, {
            title: '实支付日期',
            dataIndex: 'realPayTime',
            key: 'realPayTime',
            width: '10%',
        }, {
            title: '状态',
            width: '10%',
            render: (text, record) => {
                let state = '';

                switch (Number(record.stateStr)) {
                    case 0:
                        state = '待支付';
                        break;
                    case 1:
                        state = '处理中';
                        break;
                    case 2:
                        state = '支付成功';
                        break;
                    case 3:
                        state = '支付失败';
                        break;
                    case 4:
                        state = '已退回';
                        break;
                    case 5:
                        state = '异常';
                        break;
                    case 6:
                        state = '已结清';
                        break;
                    case 7:
                        state = '已作废';
                        break;
                    case 8:
                        state = '待审核';
                        break;
                    case 9:
                        state = '审核中';
                        break;
                    default:
                        break;
                };

                return <span>{ state }</span>
            }
        }, {
            title: '详情',
            width: '10%',
            render: (text, record) => {
                return <a href="javascript: " onClick={ this.openListDetailsModal.bind(this, record) }>详情</a>
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

                <ListDetails
                    ref="paymentListDetails"
                    detailVisible={ this.state.openDetailVisible } 
                    closeListDetailsModal={ this.closeListDetailsModal } 
                    detailData={ this.state.orderRowInfo }
                    source={ true }
                />
            </section>
        )
    }
}

export default PaymentTable;