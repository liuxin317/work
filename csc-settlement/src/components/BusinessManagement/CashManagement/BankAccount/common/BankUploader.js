import React, { Component } from 'react';
import Loading from './../../../../common/Loading';
import { Upload, Button, Icon, message, Modal } from 'antd';

const confirm = Modal.confirm;

class BankUploader extends Component {

  state = {
    fileList: [],
    uploading: false
  }

  removeFile = (file) => {
    this.setState(({ fileList }) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  }

  beforeUpload = (file) => {
    this.setState(({ fileList }) => ({
      fileList: [file]
    }));

    return false;
  }

  handleUpload = () => {
    const { templateType } = this.props;
    const { fileList } = this.state;
    const formData = new FormData();
    const params = this.uploadParams();
    
    for (let key in params) {
      formData.append(key, params[key]);
    }

    formData.append('file', fileList[0]);

    switch (templateType) {
      case 27: // 余额初始化
        this._importAccountCheckInitData(formData);
        break;
      case 28: // 银行流水明细
        this._importData(formData);
        break;
    }
  }

  // 上传参数
  uploadParams = () => {
    const { templateType, amountType } = this.props;
    const { accountId, accountNumber } = this.props.data;
    let params = {
      token: userInfo.token,
    };
    
    switch (templateType) {
      case 27: // 余额初始化
        params = Object.assign(params, {
          amountType,
          addr: 'importAccountCheckInitData'
        });
        break;
      case 28: // 银行流水明细
        params = Object.assign(params, {
          tenantId: userInfo.tenantId,
          addr: 'importData',
          accountId, 
          accountNumber,
          fileType: '3',
        })
        break;
    }

    return params;
  }

  componentDidMount () {
    this._getTempletAddress(this.props.templateType);
  }

  // 下载模版链接请求
  _getTempletAddress = (type) => {
    // type模版: 初始化余额27  银行流水28
    Util.comFetch({
      addr: 'getTempletAddress',
      type
    }, res => {
      this.setState({ downloadUrl: res.url });
    })
  }

  // 银行流水明细上传请求
  _importData = (formData) => {
    this.setState({ uploading: true });
    fetch(AppConf.fileApiPath, {
      method: 'POST',
      body: formData
    }).then(res => res.json()).then(res => {
      if (res.rspCode === '000000') {
        console.log(88888888)
        message.success('上传成功');
        this.props.uploadSuccess(true);
      } else {
        // 确认是否二次上传
        if (res.rspCode === '100161') {
          let _this = this;
          confirm({
            title: res.rspDesc,
            onOk() {
              const { accountId, accountNumber } = _this.props.data;

              Util.comFetch({
                addr: 'importData',
                accountId,
                accountNumber,
                fileId: res.id,
                isPass: 'pass'
              }, response => {
                message.success('上传成功');
                _this.props.uploadSuccess(true);
              })
              // formData.append('fileId', res.id);
              // formData.append('isPass', 'pass');
    
              // _this._importData(formData);
            },
            onCancel() {},
          });
        } else {
          message.warning(res.rspDesc);
          this.setState({ fileList: [] })
        }
      }

      this.setState({ uploading: false });
    })
  }
  
  // 余额初始化上传请求
  _importAccountCheckInitData = (formData) => {
    this.setState({ uploading: true });
    fetch(AppConf.fileApiPath, {
      method: 'POST',
      body: formData
    }).then(res => res.json()).then(res => {
      if (res.rspCode === '000000') {
        message.success('上传成功');
        this.props.uploadSuccess(true);
      } else {
        message.warning(res.rspDesc);
        this.setState({ fileList: [] });
      }

      this.setState({ uploading: false });
    });
  }

  render () {
    const { uploading, fileList, downloadUrl } = this.state;

    return (
      <dl className="bank-account-uploader__list">
        <dt>1.请下载批量录入模板，并按照模板将相关数据填写完整</dt>
        <dd>下载链接：<a href={ downloadUrl ? encodeURI(AppConf.downloadPrefix + downloadUrl) : 'javascript:;'}>下载模板</a></dd>
        <dt>2.上传Excel文件</dt>
        <dd>
          <Upload action={AppConf.fileApiPath}
            onRemove={this.removeFile}
            fileList={fileList}
            beforeUpload={this.beforeUpload}
          >
            <Button>选取文件</Button>
          </Upload>
          
          <Button style={{position: 'absolute', top: 0, left: 160}}
          type="primary"
            onClick={this.handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
          >
            {uploading ? '正在上传' : '立即上传' }
          </Button>
         
          <Loading show={uploading}/>
        </dd>
      </dl>
    );
  }
}

export default BankUploader;
