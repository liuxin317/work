import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Child from './components/Child';

class App extends Component {
  handleFiles = (e) => { // 上传文件
    var fileObj = e.target.files;

    // FormData 对象
    var formData = new FormData();
    formData.append('fileType', 'jpg');
    formData.append('name', 'dasd');
    formData.append('token', 'ec3a90d5f35713c44ba72b60ab55b3f0');
    formData.append('addr', 'uploadFile');

    for (let i = 0; i < fileObj.length; i++) {
      formData.append('file', fileObj[i]); // 文件对象
    }

    console.log(fileObj)
    
    fetch('/ImgUploadServlet', {
      method: "POST",
      body: formData
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <hr/>
        <Child>
          我是父组件中输入的内容
        </Child>

        <hr/>
        <input type="file" multiple onChange={ this.handleFiles }/>
      </div>
    );
  }
}

export default App;
