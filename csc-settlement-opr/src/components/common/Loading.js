import React, { Component } from 'react';
import LoadImg from '../../imgs/loading.png';

export default class Loading extends Component {
    render () {
        const { loadState } = this.props;

        return (
            <section className={ loadState ? "load-box" : "load-box active" }>
                <img className="move-img" src={ LoadImg } alt=""/>
            </section>
        )
    }
}