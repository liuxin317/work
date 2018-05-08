import React from 'react';

class DropItem extends React.Component {
  constructor(props) {
    super(props);
  }

  sel = () => {
    if(this.props.edit){
      return
    }else {
        this.props.sel(this.props.data);
    }
  }


  render() {
    const { data, selList, multi ,edit} = this.props;
      console.log("看单编辑",this.props)
    let cls = '';
    if (multi) {
      selList.some((item, index) => {
        if (item.value === data.value) {
          cls = ' multi-seled';
          return true;
        }
      });
    }

    return (
      <div
        onClick={this.sel}
        className={"drop-i drop-label" + cls}
        title={data.label}>{data.label}</div>
    );
  }
}

export default DropItem;
