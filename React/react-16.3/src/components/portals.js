import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Portal extends Component {
  render () {
    return ReactDOM.createPortal(
      <div>
        <h6>this.props.childern</h6>
      </div>,
      document.getElementById('portal'),
    );
  }
}

export default Portal;