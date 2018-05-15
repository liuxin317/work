import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/b.css';

class B extends Component {
    componentDidMount () {
        // console.log(this.props);
    }
    
    render () {
        return (<div> wo 是 B先生 <Link to={ {pathname: '/index', state: '1'}  }>go to</Link></div>)
    }
}

export default B;