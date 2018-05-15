import React, { Component } from 'react';
import Parent from './components/Parent';
import { Provider } from './components/Context';

class App extends Component {
  state = {
    payload: { background: 'yellow', color: 'white' }
  }

  update = (state) => {
    this.setState({
      payload: state
    })
  }

  render() {
    return (
      <Provider value={{ payload: this.state.payload, update: this.update }}>
        <div className="App">
          <Parent name="Parent" />
        </div>
      </Provider>
    );
  }
}

export default App;
