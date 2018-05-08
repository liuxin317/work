import React from 'react';
import DropItem from './DropItem';

class DropFolder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: props.forceExpand
    };
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.forceExpand && !this.props.forceExpand) {
      this.setState({expand: true});
    }
  }

  getChildren() {
    const { data, selList, multi, forceExpand } = this.props;
    return data.children.map((item, index) => {
      if (item.children && item.children.length) {
        return (<DropFolder
          key={index}
          forceExpand={forceExpand}
          data={item}
          multi={multi}
          selList={selList}
          sel={this.props.sel}></DropFolder>);
      } else {
        return (<DropItem
          key={index}
          data={item}
          multi={multi}
          selList={selList}
          sel={this.props.sel}></DropItem>);
      }
    });
  }

  toggleExpand = () => {
    if (this.props.edit){
        this.setState({expand: false});
    }else{
        this.setState({expand: !this.state.expand});
    }
  }

  render() {
    const { data } = this.props;
    console.log("看编辑",this.props.edit)
    const { expand } = this.state;
    const children = expand ? this.getChildren() : null;

    return (
      <div className="drop-f">
        <span className={"expand-btn" + (expand ? ' expand' : '')} onClick={this.toggleExpand}>></span>
        <div className="drop-label" title={data.label} onClick={this.toggleExpand}>{data.label}</div>
        <div className={"dp-children" + (expand ? ' expand' : '')}>
          {children}
        </div>
      </div>
    );
  }
}

export default DropFolder;
