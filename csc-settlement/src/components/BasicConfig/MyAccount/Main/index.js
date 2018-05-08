import React from 'react';
import {Icon, Button, Input, message, Upload, Modal,Checkbox} from 'antd';
import './style.scss';
import Card from "../Card/index";
import  TreeDroplist  from "../../../common/OrgMy/index";

//我方账户
class Myaccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: '我方账户',
            cards: [],
            keyWord: '',
            uploadVisible: false,
            uploadName:'',
            uploadUrl:'',

            getOrgsOfTre:'',
            //组织机构选择的
            treeValue:[],
            bussInitial: [],
        };
    }
    componentWillMount(){
        this.getOrgsOfTre();
    }
    componentDidMount() {
        this.search();
    }
    //获取组织结构下拉数据
    getOrgsOfTre = () => {
        let requestParam = {};
        requestParam.code = userInfo.orgCode;
        requestParam.addr = Api.getOrgsOfTree;
        Util.comFetch(requestParam, (data) => {
            let treeData = Util.getOrgData(data.orgs);
            console.log("获取组织结构下拉数据", treeData);
            this.setState({
                getOrgsOfTre: treeData
            });
        });
    };

    OrgCheckValue = (vals) => {
        console.log("组织机构vals",vals)
        this.setState({
            treeValue:vals,
        })
    };

    // TreeValue=(value,OrgId)=>{
    //     console.log("树",value,OrgId)
    //     debugger;
    //     this.setState({
    //         treeValue: OrgId,
    //         OrgId: OrgId
    //     })
    // };
    //刷新页面
    search = () => {
        let requestParam = {};
        requestParam.addr = Api.getMyAccount;
        requestParam.keyword = this.state.keyWord.trim();
        requestParam.orgCode = this.state.treeValue.toString();
        //获取用户信息
        Util.comFetch(requestParam, (data) => {
            this.setState({
                "cards": data.data
            })
        });
    };
//添加新卡
    addNewCard = () => {
        this.props.history.push(`${this.props.match.path}/add`);
    };
//卡片回调
    cardCallBack = (type, data) => {
        if (type === 'edit') {
            this.props.history.push(`${this.props.match.path}/add?id=${data.accountId}`);
        }
        else if (type === 'setDefault') {
            this.setDefaultAccount(data);
        }
        else if (type === 'delete') {
            this.deleteCard(data.accountId);
        }
    };

    setDefaultAccount(card) {
        let requestParam = {};
        requestParam.addr = Api.updateMyAccount;
        requestParam.accountId = card.accountId;
        card.defaultFlag = 1;
        requestParam.data = JSON.stringify(card);
        Util.comFetch(requestParam, (data) => {
            message.success('设置成功');
            this.search();
        });
    }

    deleteCard(id) {
        let requestParam = {};
        requestParam.addr = Api.deleteMyAccount;
        requestParam.accountId = id;
        Util.comFetch(requestParam, (data) => {
            message.success('删除成功');
            this.search();
        });
    }
    //上传文件后保存的地址
    uploadFileAddr = () => {
        let postData = {};
        postData.addr = Api.importMyAccount;
        postData.url =  AppConf.uploadFilePathIp + '/imgservice/download/' + this.state.uploadUrl;
        postData.name = this.state.uploadName;
        if(this.state.uploadName){
            Util.comFetch(postData, (data) => {
            console.log(data);
            message.success("导入成功");
            this.setState({'uploadVisible': false});
            this.search();
            }, (error) => {
                console.log(error);
                message.error(error);
            });
        }
        else{
            message.error("请上传文件");
        }
    };
    //点击上传请求模板地址
    showUploadModal=()=>{
        Util.comFetch({
            addr: Api.getTempletAddress,
            type: 'excelTemplet_myAccount'
        }, (re) => {
            console.log('showUploadModal',re);
            let  data= re.url;
            let urlArray=data.split('?');
            let excelUrl= urlArray[0];
            let excelName=urlArray[1].split('=')[1];
            let downloadUrl = window.location.protocol + '//' + window.location.host + '/imgservice/download/' + excelUrl + '?constomFilename='+excelName+'.xlsx';
            this.setState({'excelUrl': downloadUrl});
        });
        this.setState({'uploadVisible': true,'uploadUrl':'',
            'uploadName':''})
    };
    //搜索框过滤特殊字符
    searchV=(e)=>{
        let   v=e.target.value;
        let   keyWord=v.replace (/&|@|#|￥|%/g, "")
        this.setState({'keyWord': keyWord})
    };
    render() {
        //上传配置
        const self = this;
        const uploadProps = {
            name: 'file',
            action: window.AppConf.imageApiPath,
            headers: {},
            data: {
                token: window.userInfo.token,
                addr: 'uploadFile',
                fileType: 1
            },
            showUploadList: false,
            accept: '.xls,.xlsx',
            beforeUpload: (file, fileList) => {
                //上传文件格式限制
                if (file.name.indexOf('.xls')===-1||file.name.indexOf('.xlsx')===-1) {
                    message.error('请选择excel文件');
                    return false;
                }
            },
            onChange(info) {
                if (info.file.status === 'uploading') {
                }
                else if (info.file.status === 'done') {
                    console.log("信息" ,info.file, info.fileList);
                    let  val=info.file.response.rspCode;
                    if ( val !== '000000') {
                        console.log("信息2" , val);
                        self.setState({"uploadName":""});
                        message.error('上传文件失败,请重新选择文件');
                    } else {
                        self.setState({'uploadUrl':info.file.response.url,
                            'uploadName':info.file.name});
                    }
                }
                else if (info.file.status === 'error') {
                    message.error('上传失败,请重试');
                }
            },
        };
        return (
            <div className="my-account page-container">
                <p className="title"><span className="light-black">当前位置：</span>{this.state.info}</p>

                <div className="search-div">
                    <div  style={{display:'inline-block',verticalAlign:'top', height: '30px', lineHeight: '28px', marginRight: '15px'}}>
                        <span className="light-black">组织机构:  </span>
                        {this.state.getOrgsOfTre!==''&&<TreeDroplist
                            data={this.state.getOrgsOfTre}
                            multi={true}
                            edit={false}
                            initialSels={this.state.bussInitial}
                            onChg={(vals) => {
                                this.OrgCheckValue(vals)
                            }}
                        />}
                    </div>
                    <Input value={this.state.keyWord}   onChange={(e) => {this.searchV(e)}}
                           className="search-input-style" placeholder="请输入开户行行别/银行账号"/>

                    <Button className="search-btn-style" onClick={this.search} type="primary" shape="circle"
                            icon="search"/>

                    {/*<Button type="primary" className="search-btn-style" shape="circle" title="导入"*/}
                            {/*onClick={() => this.showUploadModal()}>*/}
                        {/*<Icon type="download"/>*/}
                    {/*</Button>*/}
                </div>
                <div className="mt15 clear-float">{
                    this.state.cards.map((cardData, index) =>
                        <Card key={index} cardCallBack={this.cardCallBack} cardData={cardData}/>
                    )
                }
                    <div className="add-card-style">
                        <div className="add-card-tip" onClick={this.addNewCard}>
                            <Icon type="plus-square-o" style={{fontSize: 40, color: '#23b8f6', textAlign: 'center'}}/>
                            <p style={{color: '#23b8f6'}}>添加账户</p>
                        </div>
                    </div>
                </div>
                <Modal
                    title="导入我的账户"
                    okText="提交"
                    visible={this.state.uploadVisible}
                    onOk={()=> this.uploadFileAddr()}
                    maskClosable={false}
                    onCancel={() => this.setState({'uploadVisible': false})}
                >
                    <div className="modal-tip"> 请选择Excel文件:
                        <Input className="modal-upload-input" value={this.state.uploadName} disabled={true}/>
                        <Upload   {...uploadProps}>
                            <Button>点击上传</Button>
                        </Upload>
                    </div>
                    <div> 下载模板:<a href={this.state.excelUrl}>我的账户导入模板</a></div>
                </Modal>
            </div>
        );



    }
}

export default Myaccount;
