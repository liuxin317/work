import React, { Component } from 'react';
import A from 'component/a';
import From from 'component/from';
import Keys from './components/key';
import { Provider } from './components/context';
import Button from './components/button';
import Fragments from './components/fragments';
import connect from './components/highOrder';
import './App.css';

const mapStateToProps = (state) => {
  return {
    name: 1
  }
}

const ConnectKeys = connect(
  mapStateToProps,
  Keys
);

class App extends Component {
  state = {
    context: {
      update: (payload) => {
        const { context } = this.state;
        this.setState({
          context: Object.assign({}, context, payload)
        })
      },
      name: "drak"
    }
  }

  render() {
    return (
      <Provider value={ this.state.context }>
        <div className="App">
          <h2>React 组件也可以通过数组的形式返回多个元素</h2>
          <A />
          <hr/>

          <h2>from表单提交提取数据</h2>
          <From />
          <hr/>

          <h2>keys</h2>
          <ConnectKeys />
          <hr/>

          <h2>context</h2>
          <Button />
          <hr/>

          <h2>fragments</h2>
          <Fragments />
          <hr/>

          <div id="portal"></div>
        </div>
      </Provider>
    )
  }
}

export default App;
