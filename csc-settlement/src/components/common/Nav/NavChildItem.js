import React from 'react';

// 子菜单的节点
class NavChildItem extends React.Component {
  constructor(props) {
    super(props);
  }

  // 鼠标移入节点，更新下级菜单展开数据
  handleItemOver = () => {
    const { data, index } = this.props;
    this.props.nextLevel(data.children || [], index);
  }

  // 选择link
  sel = () => {
    this.props.sel(this.props.data.url);
  }

  render() {
    const { data, act } = this.props;
    let cls = act ? 'link act' : 'link';

    return (
      <div
        className={cls}
        onClick={this.sel}
        onMouseOver={this.handleItemOver}>{data.name}</div>
    );
  }
}

export default NavChildItem;
