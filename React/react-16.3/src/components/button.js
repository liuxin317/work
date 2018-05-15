import React, { Component } from 'react';
import { Consumer } from './context';

class Button extends Component {
  updateName = (store) => {
    store.update({ name: "liuxin" })
  }

  render () {
    return (
      <Consumer>
        {
          data => (
            <button onClick={ this.updateName.bind(this, data) }>{ data.name }</button>
          )
        }
      </Consumer>
    )
  }
}

export default Button;