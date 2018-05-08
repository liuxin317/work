import React from 'react';
import { Table } from 'antd';

// 已作废表格
class CancellationTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    getColumns() {
        const columns = [
            {
                title: '订单号',
                key: 'code',
                sorter: true,
                render: (text, record, index) => {
                    return (
                        <div className="type-icons-wrapper">
                            <div className="type-icons">
                                <span className="order-type-icon freeze" style={{display: record.freeze ? '': 'none'}}>冻</span>
                            </div>
                            <div>{record.code}</div>
                        </div>
                    );
                }
            },
            {
                title: "收支对象名称",
                key: "customerName",
                dataIndex: "customerName",
            },
            {
                title: '收款方账户名称',
                key: 'payee',
                render: (text, record, index) => {
                    return (
                        <div>
                            <div>{ record.currentCustomerBank ? record.currentCustomerBank.accountName : null}</div>
                        </div>
                    );
                }
            },
            {
                title: "金额",
                key: "amount",
                dataIndex: "amount",
                sorter: true,
            },
            {
                title: '付款方账号',
                key: 'payer',
                dataIndex: 'payer',
                render: (text, record, index) => {
                    if (record.myAccount) {
                        return (
                            <div>
                                <div>{record.myAccount.accountNumber}</div>
                            </div>
                        );
                    } else {
                        return '';
                    }
                }
            },
            {
                title: '预支付日期',
                key: 'prePayTime',
                dataIndex: 'prePayTime',
                sorter: true,
            },
            {
                title: '作废日期',
                key: 'modifiedTime',
                dataIndex: 'modifiedTime',
                sorter: true,
            },
            {
              title: '理由',
              key: 'reason',
              dataIndex: 'reason',
            },
            {
                title: '操作',
                key: 'op',
                dataIndex: 'op',
                render: (text, record, index) => {
                    return (
                        <span>
              <a href="javascript:void(0);" onClick={()=>{this.handleDetail(record, index)}}>详情</a>
            </span>
                    );
                }
            },
        ];
        return columns;
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.props.selRowsUpdate(selectedRowKeys);
    }

    // 处理表格分页，排序变化
    handleTableChange = (pagination, filters, sorter) => {
        // console.log(pagination, filters, sorter);
        this.props.skipPage(pagination.current, pagination.pageSize, sorter);
    }

    // 查看详情
    handleDetail = (record, index) => {
        this.props.showDetail(record, index);
    }

    render() {
        const { data, total, current, selRows } = this.props;
        const rowSelection = {
            onChange: this.onSelectChange,
            selectedRowKeys: selRows
        };

        if (!this.columns) {
            this.columns = this.getColumns();
        }

        const paginationOpt = {
            showTotal: (total, range)=>`共 ${total} 条`,
            current: current,
            total: total,
            showQuickJumper: true,
            // onChange: (page, size) => {
            //   this.props.skipPage(page, size);
            // },
        };

        return (
            <Table
                pagination={paginationOpt}
                dataSource={data}
                onChange={this.handleTableChange}
                columns={this.columns} />
        );

    }
}

export default CancellationTable;
