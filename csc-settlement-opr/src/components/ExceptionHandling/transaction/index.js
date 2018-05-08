import React, { Component } from 'react';
import { Input, Button, message,Select } from 'antd';
import Table from './component/Table';
import HttpRequest from '../../../request/Fetch';
import './style.scss';
// 组织机构组件
import TreeOrg from '../../common/tree/TreeOrg';
const Option = Select.Option;


class transaction extends Component {
    state = {
        pageNumber: 1, //查询页码
        pageSize: 10, //查询每页的条数
        total: '', //总页码
        data: [], // 列表数据
        bussInitial: [], // 初始化组织机构
        orgCode: '', // 选择组织机构code
        TreeData: '', // 组织机构树,
        accountName: '', // 搜索银行开户名称
        exportURL: '', // 导出链接
        clickExportState: true, // 导出是导出所有故而点击分页不必加载导出接口, false, 点击分页，true点击搜索
    }

    componentDidMount () {
        this.getOrgsOfTree();
    }

    // 页码回调
    onPageChange = (num) => {
        this.setState({
            pageNumber: num,
            clickExportState: false,
        }, () => {
            this.getAllAccountApi();
        })
    }

    // 组织机构选中数据;
    setSearchPostionData = (data) => { // 选中查询数据替换;
        var str = '';
        data.forEach(function(item) {
            str += item.code +','
        });

        this.setState({
            orgCode: str.substr(0, str.length-1)
        });
    }

    clearSearchPostionData = () => { // 清空选择;
        this.setState({
            searchPostionData: ''
        });
    }

    // 获取组织机构数据;
    getOrgsOfTree = () => {
        HttpRequest({
            addr: 'getOrgsOfTree'
        }, respone => {
            this.setState({
                TreeData: respone.orgs
            }, () => {
                this.getAllAccountApi();
            })
        })
    }

    // 搜索前数据初始化
    searchWillInitData = () => {
        this.setState({
            pageNumber: 1,
            // clickExportState: true,
        }, () => {
            this.getAllAccountApi()
        });
    }

    // 获取交易处理列表
    getAllAccountApi = () => {
        const { pageNumber, pageSize, accountName, orgCode, clickExportState } = this.state;

        HttpRequest({
            addr: 'findAllMyAccount',
            pageNumber,
            pageSize,
            accountName,
            orgCode
        }, respone => {
            this.setState({
                total: respone.data.total,
                data: respone.data.rows,
            },
                console.log("表格数据",respone.data.rows)
            //     () => {
            //     if (clickExportState) {
            //         // this.exportAllAccountApi()
            //     }
            // }

            )
        })
    }

    // 监听银行开户名称
    accountNameChange = (e) => {
        let accountName = e.target.value;

        this.setState({
            accountName
        });
    }

    render () {
        return (
            <section className="container transaction-box account-box">
                <h4 className="column-title">当前位置：交易处理</h4>

                <div className="search-group">
                    <div className="pull-left search-input">
                        <div className="pull-left">
                            <TreeOrg name="组织机构：" isDisplayBox={true} displaySearch={true} checkbox={true} postionData={this.setSearchPostionData} orgsOfTree={this.state.TreeData} clearSearchPostionData={this.clearSearchPostionData} oneTreeData={false} openRetract={ true } />
                        </div>

                        <Input className="pull-left" style={{ width: 200, margin: "0 15px" }} placeholder="银行开户名称" onChange={ this.accountNameChange } />

                        <Button className="pull-left search-button" type="primary" shape="circle" icon="search" onClick={ this.searchWillInitData } />
                        <div className="clear"></div>
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

export default transaction;
