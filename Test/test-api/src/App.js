import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import A from './components/A';
import B from './components/B';
import axios from 'axios';

class App extends Component {
  componentDidMount () {
    axios({
      method: 'POST',
      url: 'http://csza.chfcloud.com/ServiceServlet',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',

      },
      transformRequest: [function(data){
        let str = '';

        for (let k in data) {
          str += k + '=' + data[k] + '&';
        }

        return str.substr(0, str.length - 1);
      }],
      withCredentials: true,
      data: {
        operType: 'register-login',
        addr: 'getUserOperUrl',
        companyId: 2000
      }
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Hello World</h1>

        <Router>
          <Switch>
            <Route path='/index' exact component={ A } />
            <Route path="/about" component={ B } />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
