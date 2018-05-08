import React from 'react';
import NavChildItem from './NavChildItem';

// 子菜单
class NavChildren extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // // 当前级菜单展开的子节点的序号
      // curActIndex: -1
    };
  }

  nextLevel = (levelData, ItemIndex) => {
    // this.setState({curActIndex: index});
    this.props.nextLevel(levelData, this.props.index, ItemIndex);
  }

  render() {
    const { data, actIndex, sel } = this.props;
    const { curActIndex } = this.state;

    let itemList = data.map((item, index) => {
      let act = actIndex === index;
      return (
        <NavChildItem
          nextLevel={this.nextLevel}
          data={item}
          act={act}
          sel={sel}
          index={index}
          key={index}></NavChildItem>
      );
    });

    return (
      <div className="children">
        {itemList}
      </div>
    );
  }
}

export default NavChildren;
