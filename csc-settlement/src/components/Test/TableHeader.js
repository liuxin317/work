import React from 'react';

const headData = [
  {
    name: 'aaa',
    width: '20%',
    code: 'xxx'
  },
  {
    name: 'aaa',
    width: '20%',
    code: 'xxx',
    sort: true,
    asc: false
  },
  {
    name: 'aaa',
    width: '20%',
    code: 'xxx'
  },
  {
    name: 'aaa',
    width: '20%',
    code: 'xxx'
  },
  {
    name: 'aaa',
    width: '20%',
    code: 'xxx'
  }
];

export default class TableHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      headData: headData.slice()
    };

    this.toggleSort = this.toggleSort.bind(this);
  }

  toggleSort(e, item, index) {
    const data = this.state.headData;
    let tmp = Object.assign({}, this.state.headData[index]);
    if (tmp.sort) {
      console.log('change sort');
      tmp.asc = !tmp.asc;
      this.setState({
        headData: [...data.slice(0, index), tmp, ...data.slice(index + 1)]
      });
    }
  }

  render() {
    const data = this.state.headData;

    let list = [];
    data.forEach((item, index) => {
      list.push(
        <div
          key={index}
          onClick={(e) => { this.toggleSort(e, item, index); }}
          style={{ width: item.width, display: "inline-block" }}>
          {item.name}
          <span
            className="sort"
            style={{ display: item.sort ? '' : 'none' }}>{ item.asc ? '↑' : '↓' }</span>
        </div>
      );
    });

    return (
      <div className="tab-header" style={{
        border: 'solid',
        borderWidth: 1,
        borderColor: this.props.color,
        height: this.props.height
      }}>
        {list}
      </div>
    );
  }
}

TableHeader.propTypes = {
  // headerData: React.PropTypes.array.isRequired,
  // height: React.PropTypes.number.isRequired,
  // color: React.PropTypes.string.isRequired,
  // fontSize: React.PropTypes.number.isRequired
};

