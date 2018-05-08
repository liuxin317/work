import React from 'react';

class TableTd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const item = this.props.data;

    return (
      <div>{item.key}: {item.val}</div>
    );
  }
}

export default TableTd;
