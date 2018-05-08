import React from 'react';
import TopItem from './TopItem';

// test
import navData from "../../../constants/navData";

// 水平导航菜单
class HorizontalNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clearTrigger: false,

      // level: 1,
      // actChain: [],
    };
  }

  // 选择选项
  sel = (link) => {
    // this.setState({actChain});
    this.props.sel(link);
    this.setState({clearTrigger: !this.state.clearTrigger});
    // console.log('link', link);
  }

  // 获取第一层菜单项
  getItems() {
    const { data, curPath } = this.props;
    const { clearTrigger } = this.state;
    // return navData.map((item, index) => {
    return data.map((item, index) => {
      let isCur = this.chkInclude(curPath, item);
      return (
        <TopItem
          data={item}
          isCur={isCur}
          clearTrigger={clearTrigger}
          sel={this.sel}
          key={index}></TopItem>
      );
    });
  }

  // 检查第一层的菜单时候包含当前路径
  chkInclude(curPath, data) {
    var self = this;
    if (data.url) {
      if(curPath.indexOf(data.url) > -1) {
        return true;
      }
    }
    if (data.children && data.children.length) {
      return data.children.some(function (child) {
        return self.chkInclude(curPath, child);
      });
    }
    return false;
  }

  render() {
    let items = this.getItems();
    return (
      <div className="h-nav">{items}</div>
    );
  }
}

export default HorizontalNav;
