import React, { Component } from 'react';
import OrgTreeSelect from './OrgTreeSelect';
import TreeDroplist from './../../../../common/OrgMy';
import { Input, Select, TreeSelect, DatePicker } from 'antd';
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const { RangePicker } = DatePicker;

class SearchConditions extends Component {

  state = {
    orgTreeData: [],
    searchConditions: {
      orgCode: [],
      accountNumber: '',
      initType: '0', // 0全部 1已录入 2未录入
    }
  }

  // 公用组织机构tree组件回调
  onChg = (codes) => {
    this._updateSearchConditions('orgCode', codes);
  }

  _updateSearchConditions = (key, value, callback) => {
    const { searchConditions } = this.state;
    const { searchData } = this.props;

    searchConditions[key] = value;
    searchData(searchConditions);
    this.setState({ searchConditions });
  }
  
  treeSelected = (code) => {
    this._updateSearchConditions('orgCode', code);
  }

  bankAccountBlur = (e) => {
    this._updateSearchConditions('accountNumber', e.target.value);
  }

  rangeDatePicker = (date, dateString) => {
    const [ startDate, endDate ] = dateString;
    const { showDatePicker } = this.props;

    if (showDatePicker) {
      this._updateSearchConditions('startDate', startDate);
      this._updateSearchConditions('endDate', endDate);
    }
  }

  initTypeSelected = (type) => {
    this._updateSearchConditions('initType', type);
  }

  componentDidMount () {
    this._getOrgsOfTree();
  }

  // 组织机构树形菜单请求
  _getOrgsOfTree = () => {
    Util.comFetch({
      addr: 'getOrgsOfTree',
      code: userInfo.orgCode
    }, res => {
      this.setState({ orgTreeData: res.orgs })
    })
  }

  render () {
    const { orgTreeData, searchConditions, datePiker } = this.state;
    const { showDatePicker = false, showInitType = true } = this.props;

    // 树形菜单渲染
    const loop = data => data.map(item => {
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.code} title={item.name} value={item.code}>
            { loop(item.children) }
          </TreeNode>
        )
      } else {
        return <TreeNode key={item.code} title={item.name} value={item.code}/>
      }
    });
    
    return (
      <div className="search-conditions">
        <div className="search-conditions-item">
          <span>组织机构: </span>
          {/* <OrgTreeSelect treeData={orgTreeData} onChange={this.treeSelected}/> */}
          {/* <TreeSelect  style={{ width: 200 }}
            dropdownStyle={{ width: 300, maxHeight: 300, overflow: 'auto' }}
            dropdownMatchSelectWidth={false}
            placeholder="请选组织机构" 
            notFoundContent="暂无数据"
            showSearch
            treeNodeFilterProp="title"
            onChange={this.treeSelected}
          >
            { loop(orgTreeData) }
          </TreeSelect> */}
          <TreeDroplist data={Util.getOrgData(orgTreeData)} multi={true} onChg={this.onChg} />
        </div>
        <div className="search-conditions-item">
          <Input placeholder="请输入开户银行账号" 
            onBlur={this.bankAccountBlur}
          />
        </div>
        {
          showInitType
          ? (
            <div className="search-conditions-item">
              <Select defaultValue={searchConditions.initType} style={{ width: 120 }}
                onChange={this.initTypeSelected}
              >
                <Option value="0">全部</Option>
                <Option value="1">已录入</Option>
                <Option value="2">未录入</Option>
              </Select>
            </div>
          )
          : ''
        }
        {
          showDatePicker
          ? (
              <div className="search-conditions-item" >
                <RangePicker style={{width: '260px'}}
                  allowClear={false}
                  onChange={this.rangeDatePicker}
                />
              </div>
            )
          : ''
        }
        
      </div>
    );
  }
}

export default SearchConditions;
