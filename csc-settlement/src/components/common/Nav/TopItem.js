import React from 'react';
import NavChildren from "./NavChildren";

// 水平导航菜单中的按钮
class NavTopItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 多级子菜单数据
      menuLevels: [],
      // 多级子菜单展开项序号
      menuActs: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.clearTrigger !== this.props.clearTrigger) {
      this.setState({
        menuLevels: [],
        menuActs: []
      });
    }
  }

  // 选择link
  sel = () => {
    const { data } = this.props;
    this.props.sel(data.url);
  }

  // 鼠标移入顶层导航项，设置子级菜单展开第一层
  handleLinkOver = () => {
    const { data } = this.props;
    const { menuLevels } = this.state;

    if (data.children && data.children.length) {
      if (menuLevels.length !== 1 || menuLevels[0] !== data.children) {
        this.setState({
          menuLevels: [data.children],
          menuActs: [-1]
        });
      }
    }
  }

  // 展示下一层的子菜单
  nextLevel = (levelData, ChildrenIndex, ItemIndex) => {
    const { menuLevels, menuActs } = this.state;
    let nextLevels = menuLevels.slice(0, ChildrenIndex + 1);
    let nextActs = menuActs.slice(0, ChildrenIndex);
    if (levelData && levelData.length) {
      nextLevels.push(levelData);
      nextActs.push(ItemIndex);
    }
    this.setState({ menuLevels: nextLevels, menuActs: nextActs });
  }

  render() {
    const props = this.props;
    const { menuLevels, menuActs } = this.state;
    let children = menuLevels.map((data, index) => {
      let actIndex = menuActs[index];
      return (
        <NavChildren
          data={data}
          nextLevel={this.nextLevel}
          actIndex={actIndex}
          index={index}
          sel={props.sel}
          key={index}></NavChildren>
      );
    });

    return (
      <div className={"h-top-item" + (props.isCur ? ' cur' : '')}>
        <div className="link"
             onMouseOver={this.handleLinkOver}
             onClick={this.sel}>{props.data.name}</div>
        <div className="children-wrapper">{children}</div>
      </div>
    );
  }
}

export default NavTopItem;
