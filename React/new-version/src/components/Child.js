import React, { Component } from 'react';

class Child extends Component {
    render () {
        const numbers = [1,2,3,4,5];
        return (
            <div className="Child">
                {this.props.children}
                {numbers}
            </div>
        )
    }
}

export default Child;