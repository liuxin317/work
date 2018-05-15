import React, { Component } from 'react';
import { Button, Spin } from 'antd';
import loadable from 'react-loadable'; // 代码的拆分和懒加载
import Loading from './components/common/Loading';
import { connect } from 'react-redux'; // 容器组件;
import Type from './action/Type';
import HttpRequest from './requset/Fetch';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';

const loadableA = loadable({
  loader: () => import('./components/A'),
  loading: Loading
})

const loadableB = loadable({
  loader: () => import('./components/B'),
  loading: Loading
})

class App extends Component {
  componentDidMount () {
    HttpRequest("/code/query", "GET", {
      phone: "18200110585"
    })
  }

  render() {
    const { loading, hideLoadClick } = this.props;

    return (
      <Router>
        <Spin spinning={loading} tip="Loading..." size="large">
        <section className="box load-style">
            <Route exact path="/" component={ loadableA } />
            <Route path="/a" component={ loadableA } />
            <Route path="/b" component={ loadableB } />

            <Link to={{pathname: "/a", state: "我是A"}}><Button>到A</Button></Link>
            <Link to={{pathname: "/b", state: "我是B"}} style={{ margin: "0 10px" }}><Button>到B</Button></Link>
            <Button onClick={hideLoadClick}>蒙板消失</Button>
        </section>
        </Spin>
      </Router>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    loading: store.common.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hideLoadClick: () => { dispatch({ type: Type.LOAD_STATE, payload: { loading: false } }) }
  }
}

const ConnectApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default ConnectApp;
