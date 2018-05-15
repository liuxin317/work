import React, { Component } from 'react';
import { Consumer } from './Context';

class Child extends Component {
    changBg = (c) => {
        if (c.payload.background === 'blue') {
            c.payload.background = 'yellow'
        } else {
            c.payload.background = 'blue'
        }
        setTimeout(() => {
            c.update(c.payload)
        }, 1000);
    }

    render () {
        return (
            <Consumer>
                {
                    c => {
                        return <h2 style={{ background: c.payload.background }} onClick={ this.changBg.bind(this, c) }>我是child</h2>
                    }
                }
            </Consumer>
        )
    }
}

export default Child;