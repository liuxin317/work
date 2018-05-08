import React from 'react';
import { Input } from 'antd';
import DropFolder from './DropFolder';
import DropItem from './DropItem';
import './style.scss';

// 树形选择框
// 传入数据结构
// [{
//   label: 'xxx',
//   value: 'xxx',
//   children: []
// },{
//   label: 'xxx',
//   value: 'xxx',
//   children: []
// }]
// 传入属性
// data tree数据
// multi 是否多选
// onChg 选择时的回调
class TreeDroplist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDropdown: false,
      // 选中的节点，单选模式
      selList: [],
      // 搜索关键字
      keyword: '',
      // 使用过滤后的treeData
      useFilteredData: false,
      // 过滤后的数据
      filteredData: [],
      curSel: null,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.multi && !nextProps.multi) {
      this.setState({selList: this.state.selList.slice(0,1)});
    }
    if (!this.props.visible && nextProps.visible) {
      if (nextProps.initialSels) {
        this.setState({selList: nextProps.initialSels});
      }
    }
    if (!this.props.data.length && nextProps.data.length) {
      if (nextProps.initialSels) {
        this.setState({
          selList: nextProps.initialSels
        });
      }
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.fold);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.fold);
  }


  // 获取子节点
  getChildren() {
    const { data, multi ,edit} = this.props;
    const { selList, useFilteredData, filteredData } = this.state;

    let showData = useFilteredData ? filteredData : data;

    return showData.map((item, index) => {
      if (item.children && item.children.length) {
        return (<DropFolder
          edit={edit}
          key={index}
          forceExpand={useFilteredData}
          data={item}
          multi={multi}
          selList={selList}
          sel={this.sel}></DropFolder>);
      } else {
        return (<DropItem
          edit={edit}
          key={index}
          data={item}
          multi={multi}
          selList={selList}
          sel={this.sel}></DropItem>);
      }
    });
  }

  // 选择
  sel = (item) => {
    const { onChg } = this.props;
    const { selList } = this.state;
    let list = selList.slice();
    if (this.props.multi) {
      let preSelIndex = -1;
      list.some((data, index) => {
        if (data.value === item.value) {
          preSelIndex = index;
          return true;
        }
      });
      if (preSelIndex > -1) {
        list.splice(preSelIndex, 1);
      } else {
        list.push(item);
      }
      this.setState({
        selList: list,
      });
    } else {
      list = [item];
      this.setState({
        selList: list,
        showDropdown: false,
      });
    }
    if (onChg) {
      onChg(list);
    }
  }

  // 切换展开收起
  toggleDropdown = () => {
    this.setState({showDropdown: !this.state.showDropdown});
  }

  // 收起
  fold = () => {
    console.log('out clk, fold');
    this.setState({showDropdown: false});
  }

  // 阻止事件传播
  prevent(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // 搜索关键字
  keywordChg = (e) => {
    console.log('chg', e.target.value);
    this.setState({
      keyword: e.target.value
    });
  }

  // 复合输入开始
  compStart = () => {
    this._compositing = true;
  }
  // 复合输入结束
  compEnd = () => {
    this._compositing = false;
  }

  // 过滤
  filterList = (e) => {
    const state = this.state;
    if (this._compositing) {
      console.log('中文输入中');
      return ;
    }
    let keyword = e.target.value.trim();

    if (keyword !== '') {
      let re = [];
      this.filterData(re, this.props.data, keyword);
      console.log('filter re', re);
      this.setState({
        useFilteredData: true,
        filteredData: re,
        keyword: keyword
      });
    } else {
      this.setState({
        useFilteredData: false,
        keyword: keyword
      });
    }
  }

  // 过滤数据
  filterData(re, treeData, keyword) {
    let lvlMatch = false;
    treeData.forEach((item, index) => {
      let match = false;
      if (item.children && item.children.length) {
        let children = [];
        match = this.filterData(children, item.children, keyword);
        if (match) {
          re.push(Object.assign({}, item, {children: children}));
        }
      } else {
        match = item.label.indexOf(keyword) > -1;
        if (match) {
          re.push(item);
        }
      }
      lvlMatch = lvlMatch || match;
    });
    return lvlMatch;
  }

  isShowDropdown=()=>{
    if(this.state.showDropdown){
      if(typeof this.props.edit === 'undefined' || !this.props.edit){
        return true;
      }
    }
    return false;
  };

  render() {
    console.log("编辑传",this.props.edit)
    const {showDropdown,selList, keyword } = this.state;
    const children = showDropdown ? this.getChildren() : null;
    let selLabels = [];
    selList.map((item, index) => {
      selLabels.push(item.label);
    });
    selLabels = selLabels.join(',');

    // let isShow = this.isShowDropdown();


    return (
      <div className="h-droplist tree-droplist" onClick={this.prevent}>
        <div className="cur-sel" onClick={this.toggleDropdown}>
          <div className="cur-sel-text" title={selLabels}>{selLabels}</div>
          <span className={"toggle-btn" + (this.isShowDropdown() ? ' expand' : '')}>∨</span>
        </div>
        {
          this.isShowDropdown() ?
            <div className={"dp-children expand"}>
              <div className="dp-filter">
                <Input
                  value={keyword}
                  onCompositionStart={this.compStart}
                  onCompositionEnd={this.compEnd}
                  onChange={this.keywordChg}
                  onKeyUp={this.filterList}
                  type="text"
                  placeholder="输入关键字搜索"/>
              </div>
              {children}
            </div> :
            null
        }

      </div>
    );
  }
}

export default TreeDroplist;
