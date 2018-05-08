import React, { Component } from 'react';
import { Input, Button, message } from 'antd';
import Table from './component/Table';
import HttpRequest from '../../../request/Fetch';
import './style.scss';

class Rule extends Component {
    state = {
        pageNumber: 1, // 查询页码
        pageSize: 10, // 查询每页的条数
        total: '', // 总页码
        data: [], // 列表数据
        busTypeName: '', // 业务类型
        companyName: '', // 公司类型
        tenantName: '', // 租户类型
        exportURL: '', // 导出链接
        clickExportState: true, // 导出是导出所有故而点击分页不必加载导出接口, false, 点击分页，true点击搜索
    }

    componentDidMount () {
        this.getRuleDefineApi();
    }

    // 页码回调
    onPageChange = (num) => {
        this.setState({
            pageNumber: num,
            clickExportState: false
        }, () => {
            this.getRuleDefineApi();
        })
    }

    // 获取规则搜索列表
    getRuleDefineApi = () => {
        const { pageNumber, pageSize, busTypeName, companyName, tenantName, clickExportState } = this.state;

        HttpRequest({
            addr: 'getRuleDefineApi',
            busTypeName,
            companyName,
            tenantName,
            pageNumber,
            pageSize
        }, respone => {
            this.setState({
                data: respone.data,
                total: respone.total
            }, () => {
                if (clickExportState) {
                    this.exportRuleApi();
                }
            })
        })
    }

    // 规则导出
    exportRuleApi = () => {
        const {busTypeName, companyName, tenantName } = this.state;

        HttpRequest({
            addr: 'exportRuleApi',
            busTypeName,
            companyName,
            tenantName,
        }, respone => {
            this.setState({
                exportURL: respone.url
            })
        })
    }

    // 点击导出按钮
    exportButton = () => {
        const { exportURL } = this.state;
        
        if (exportURL) {
            window.open(encodeURI(window.location.protocol + '//' + window.location.host + '/imgservice/download/' + exportURL));
        } else {
            message.warning('正在加载...请稍后再试');
        }
    }

    // 监听租户名称
    onTenantNameChange = (e) => {
        let tenantName = e.target.value;

        this.setState({
            tenantName
        })
    }

    // 监听公司名称
    onCompanyNameChange = (e) => {
        let companyName = e.target.value;

        this.setState({
            companyName
        })
    }

    // 监听租户名称
    onBusTypeChange = (e) => {
        let busTypeName = e.target.value;

        this.setState({
            busTypeName
        })
    }

    // 搜索按钮
    onSearchWillTest = () => {
        this.setState({
            pageNumber: 1,
            clickExportState: true
        }, () => {
            this.getRuleDefineApi();
        })
    }

    render () {
        return (
            <section className="container rule-box">
                <h4 className="column-title">当前位置：规则查询</h4>

                <div className="search-group">
                    <div className="pull-left search-input">
                        <Input className="pull-left" style={{ width: 200, marginRight: 15 }} placeholder="租户名称" onChange={ this.onTenantNameChange } />
                        <Input className="pull-left" style={{ width: 200, marginRight: 15 }} placeholder="公司名称" onChange={ this.onCompanyNameChange } />
                        <Input className="pull-left" style={{ width: 200, marginRight: 15 }} placeholder="业务类型" onChange={ this.onBusTypeChange } />
                        <Button className="pull-left search-button" type="primary" shape="circle" icon="search" onClick={ this.onSearchWillTest } />
                        <div className="clear"></div>
                    </div>

                    <div className="pull-right export">
                        <Button onClick={ this.exportButton } type="primary" style={{ width: 72, height: 32, backgroundColor: '#23b8f6', borderColor: '#23b8f6' }}>导出</Button>
                    </div>
                    <div className="clear"></div>
                </div>

                <div className="table-box">
                    <Table
                        pageSize={ this.state.pageSize }
                        total={ this.state.total }
                        current={ this.state.pageNumber }
                        onPageChange={ this.onPageChange }
                        data = { this.state.data }
                    />
                </div>
            </section>
        )
    }
}

export default Rule;
