import React, { Component } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { routeRootPath } from '../../../common/method';

class AccountTable extends Component {
    render () {
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
            dataIndex: 'accountNumber',
            key: 'accountNumber',
            width: '12.5%',
        }, {
            title: '开户行行别',
            dataIndex: 'bankCategoryName',
            key: 'bankCategoryName',
            width: '12.5%',
        }, {
            title: '账面余额',
            dataIndex: 'paperAmount',
            key: 'paperAmount',
            width: '12.5%',
        }, {
            title: '可用余额',
            dataIndex: 'usableAmount',
            key: 'usableAmount',
            width: '12.5%',
        }, {
            title: '详情',
            width: '12.5%',
            render: (text, record) => {
                return <Link to={{ pathname: routeRootPath + 'aggregate-query/trade-details', state: record }}>交易明细</Link>
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
            </section>
        )
    }
}

export default AccountTable;