import React, { Component } from 'react';

class Fragments extends Component {
  render () {
    return (
      <table>
        <tbody>
          <tr>
            <Child data={[1, 2]} />
          </tr>
        </tbody>
      </table>
    )
  }
}

class Child extends Component {
  render () {
    return (
      <React.Fragment key={ this.props.data[0] }>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    )
  }
}

export default Fragments;