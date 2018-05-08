import React from 'react';
import { Modal } from 'antd';

// 单据扫描弹窗，收款、付款页面共用
class BillScan extends React.Component {
  constructor(props) {
    super(props);

    let origin = '';
    let src = '';
    if (window.location.href.indexOf('localhost') > -1) {
      origin = 'http://csza.chfcloud.com';
      src = 'http://csza.chfcloud.com/imgservice/uploader.html';
    } else {
      origin = window.location.protocol + '//' + window.location.host;
      src = origin + '/imgservice/uploader.html';
    }
    this.state = {
      origin: origin,
      src: src,
    };
  }

  componentDidMount() {
    const state = this.state;
    let uploader = document.getElementById('imgservie_iframe');
    this._uploader = uploader;

    uploader.onload = function () {
      console.log('iframe loaded...');
      uploader.contentWindow.postMessage('readyUploader', state.src);
    }
    window.addEventListener ('message', this.receiver);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.receiver);
    console.log('will unmount');
  }

  closeScan() {
    console.log('xxx');
    this.props.close();
  }

  receiver = (e) => {
    if (e.origin == this.state.origin) {
      console.log('e', e);
      // debugger;
      let data = e.data;
      // ie9收到的消息只能是字符串
      if (typeof data === 'string' && data.indexOf ('json_str_') === 0) {
        data = JSON.parse (data.substring (9));
      }
      if (data instanceof Array) {
        let imgs = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i]) {
            let imgData = {
              fileType: 1,
              fileId: data[i].picUrl,
              fileName: data[i].picName.replace (/[&@#￥%]/g, '')
            };
            imgs.push(imgData);
          }
        }
        Util.comFetch({
          addr: Api.uploadFiles,
          data: JSON.stringify(imgs)
        }, (re) => {
          console.log('save pics', re);
          re.data.forEach((item, index) => {
            item.fileId = item.picId;
            item.originalUrl = item.picUrl;
          });
          this.props.scanFinish(re.data);
        });
      } else if (data === 'close') {
        this.closeScan();
      }


      // if (data instanceof Array && firstTime) {
      //   for (var i = 0; j = data[i]; i++) {
      //     let imgData = {
      //       fileType: 1,
      //       fileId: j.picUrl,
      //       fileName: j.picName.replace (/&|@|#|￥|%/g, '')
      //     };
      //     $.ajaxpost ('uploadFile', imgData, function (data) {
      //       imgs.push (data);
      //     });
      //   }
      //   firstTime = false;
      //   $ ('#uploader_pop').css ('visibility', 'hidden');
      // }
      // if (data == 'close') {
      //   firstTime = false;
      //   $ ('#uploader_pop').css ('visibility', 'hidden');
      // }
    }

  }

  render() {
    return (
      <div className="bill-scan-mask">
        <div className="bill-scan-wrapper">
          <iframe id="imgservie_iframe" src={this.state.src} ></iframe>
        </div>
      </div>
    );
  }
}

export default BillScan;
