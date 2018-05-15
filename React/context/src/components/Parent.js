import React, { Component } from 'react';
import Child from './Child';
import PropType from 'prop-types';

class Parent extends Component {
    render () {
        return (
            <div>
                <h1>我是{ this.props.name }</h1>
                <Child />
            </div>
        )
    }
}

Parent.propType = {
    name: PropType.string
}

export default Parent;