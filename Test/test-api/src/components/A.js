import React, { Component } from 'react';
import './styles/a.css';

class A extends Component {
    componentDidMount () {
        console.log(this.props);
    }
    
    render () {
        return  (<div>wo 是 A先生</div>)
    }
}

export default A;