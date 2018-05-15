import React, { Component } from 'react';

function connect (props, Components) {
  
  return class extends Component {
    render () {
      return <Components { ...props } />
    }
  }
}

export default connect;