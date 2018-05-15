import React, { Component } from 'react'

class A extends Component {
  render () {
    return [
      // 不要忘记 key :)
      <li key="A">First item</li>,
      <li key="B">Second item</li>,
      <li key="C">Third item</li>,
    ]
  }
}

export default A;