import React, { Component } from 'react';
import { Consumer } from './context';

class Keys extends Component {
  state = {
    switchState: true
  }

  handleSwitch = () => {
    this.setState({
      switchState: !this.state.switchState
    })
  }

  render () {
    const { switchState } = this.state;

    return (
      <div>
        <button onClick={ this.handleSwitch }>切换</button>

        {
          switchState
          ?
          <input key="1" type="text" placeholder="a"/>
          :
          <input key="2" type="text" placeholder="b"/>
        }
        
        <Consumer>
          {
            data => (
              <span>{ data.name }</span>
            )
          }
        </Consumer>
      </div>
    )
  }
}

export default Keys;