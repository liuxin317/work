import React, { Component } from 'react';
import { TreeSelect, Checkbox } from 'antd';

const TreeNode = TreeSelect.TreeNode;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const treeNodeStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  padding: '6px 10px',
  textAlign: 'right',
  background: '#FFF',
  cursor: 'default',
  userSelect: 'none'
}

class OrgTreeSelect extends Component {

  state = {
    treeData: [],
    selectedCode: []
  }

  treeSelected = (value, node, extra) => {
    console.log(value, node, extra);
    this.setState({ selectedCode: value });
  }

  // 是否包含下级
  checkSub = (e) => {
    console.log(`checked = ${e.target.checked}`);
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ treeData: nextProps.treeData });
  }

  render () {
    const { treeData, selectedCode } = this.state;
    // 树形菜单渲染

    // console.log(treeData)
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
      <TreeSelect  style={{ width: 200 }}
        dropdownStyle={{ width: 300, maxHeight: 300, overflow: 'auto' }}
        dropdownMatchSelectWidth={false}
        placeholder="请选择核算单位" 
        notFoundContent="暂无数据"
        treeCheckable={true}
        treeCheckStrictly={true}
        labelInValue={true}
        value={selectedCode}
        showSearch
        treeNodeFilterProp="title"
        onSelect={this.treeSelected}
      >
        <TreeNode key={'213dd'} 
          disableCheckbox={true}
          title={
            <div style={treeNodeStyle}>
              <Checkbox onChange={this.checkSub}>包含下级</Checkbox>
            </div>
          } 
        />
        { loop(treeData) }
      </TreeSelect>
    );
  }
}

export default OrgTreeSelect;
