import React from 'react';

import TableTd from './TableTd';

const columnWidth = [
  '20%',
  '20%',
  '20%',
  '20%',
  '20%'
];
const rowData = [
  [
    {
      key: '张钦',
      val: '999'
    },
    {
      key: '张钦',
      val: '999'
    }
  ],
  [
    {
      key: '张钦',
      val: '999'
    },
    {
      key: '张钦',
      val: '999'
    },
    {
      key: '张钦',
      val: '66666666666'
    }
  ],
  [
    {
      key: '张钦',
      val: '999'
    },
    {
      key: '张钦',
      val: '999'
    }
  ],
  [
    {
      key: '张钦',
      val: '999'
    },
    {
      key: '张钦',
      val: '999'
    },
    {
      key: '张钦',
      val: '999'
    },
    {
      key: '张钦',
      val: '999'
    },
    {
      key: '张钦',
      val: '999'
    },
    {
      key: '张钦',
      val: '999'
    }
  ],
  [
    {
      key: '张钦',
      val: '999'
    },
    {
      key: '张钦',
      val: '999'
    }
  ],
];

class TableRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const data = rowData;
    let list = [];
    data.forEach((items, index) => {
      let lines = [];
      items.forEach((item, index2) => {
        lines.push(
          <TableTd key={index2} data={item}/>
        );
      });
      list.push(
        <div className="tab-td" key={index} style={{ display: 'inline-block', width: columnWidth[index] }}>{lines}</div>
      );
    });

    return (
      <div className="tab-row">{list}</div>
    );
  }
}

export default TableRow;
