import React from 'react';
import {Input,Button,Avatar, Table, Select, Popconfirm, message, Upload, Icon, Modal} from 'antd';
import 'moment/locale/zh-cn';
import './style.scss';

import  AddIncomName  from '../AddIncomName/index';
import  AddBankName  from '../AddBankName/index';
const Option = Select.Option;
const confirm = Modal.confirm;

// 往来账户
export default class TradeAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userTypeArray: [],
            userType: '',
            userName: '',
            bankName: '',

            dataSource: [],
            tableDataTotal: 0,
            dataSourceBank:[],
            tableDataTotalBank: 0,

            pageNumber: 1,
            pageSize: 10,
            currentPage: 1,


            pageNumberBank: 1,
            pageSizeBank: 10,
            currentPageBank: 1,


            uploadVisible: false,
            uploadName:'',
            uploadUrl:'',

            AddIncomName:false,
            AddIncomNameEdit:false,
            curRowDataIncom:"",

            AddBankName:false,
            // AddBankNameEdit:false,
            curRowDataBank:"",
            parentId:"",
            parentData:"",
        };
    }

    editItem = (row) => {
        console.log('编辑某行获取的row:', row);
        this.setState({
            AddBankName:true,
            AddBankNameEdit:true,
            curRowDataBank:row,
        });
        // this.props.history.push(`${this.props.match.path}/add?id=${row.accountId}`);
    };

    editItemIncom = (row) => {
        console.log('编辑某行获取的row:', row);
        this.setState({
            AddIncomName:true,
            AddIncomNameEdit:true,
            curRowDataIncom:row,
        });
    };
    deleteItem = (row) => {
        console.log('删除某行获取的row:', row.id);
        let  self=this;
        let requestParam = {};
        requestParam.addr = Api.deleteCurrentCustomer;
        requestParam.currentCustomerId = row.id;
        confirm({
            title: "删除后，该收支对象所有的银行账户都会被删除！",
            // content: 'Some descriptions',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                Util.comFetch(requestParam, (data) => {
                    message.success('删除成功');
                    self.getTableData();
                });
            },
            onCancel() {
            },
        });
        // Util.comFetch(requestParam, (data) => {
        //     message.success('删除成功');
        //     this.getTableData();
        // });
    };
    deleteItemBank = (row) => {
        console.log('删除某行获取的row:', row.id);
        let  self=this;
        let requestParam = {};
        requestParam.addr = Api.deleteCurrentCustomerBank;
        requestParam.currentCustomerBankId = row.id;
        confirm({
            title: "确认删除该账户?",
            // content: 'Some descriptions',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                Util.comFetch(requestParam, (data) => {
                    message.success('删除成功');
                    self.getTableBankData();
                });
            },
            onCancel() {
            },
        });
        // Util.comFetch(requestParam, (data) => {
        //     message.success('删除成功');
        //     this.getTableData();
        // });
    };
    //冻结银行账号
    freezeItem = (row,type) => {
        let  self=this;
        console.log('冻结某行获取的row:', row.id,type);
        let requestParam = {};
        if (type==1){
            requestParam.currentCustomerId= row.id;
            requestParam.addr = Api.freezeCurrentCustomer;
        }else if (type==2){
            if(this.state.parentData.freeze){
                Modal.warning({
                    title: '收支对象被冻结,不能解冻账号',
                });
                return false;
            }
            requestParam.currentCustomerBankId= row.id;
            requestParam.addr = Api.freezeCurrentCustomerBank;
        }
        if(row.freeze==0){
            requestParam.freeze =1;
        }
        else {
            requestParam.freeze =0;
        }
        confirm({
            title: (type==1? ( row.freeze==0 ? '冻结后，该收支对象所有银行账户以及对应账户的所有关联订单都会被冻结！':'解冻后，该收支对象所有银行账户以及对应账户的所有关联订单都会被解冻!'):( row.freeze==0 ? '是否冻结！':'是否解冻!')),
            // content: 'Some descriptions',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                Util.comFetch(requestParam, (data) => {
                    message.success(row.freeze===0?'冻结成功':'解冻成功');
                    if (type==1){
                        self.getTableData();
                    }else if (type==2){
                        self.getTableBankData();
                    }

                });
            },
            onCancel() {
            },
        });
        // Util.comFetch(requestParam, (data) => {
        //     message.success(row.freeze===0?'冻结成功':'解冻成功');
        //     this.getTableData();
        // });
    };
    //设置默认账户
    showSetConfirm = (row) => {
        console.log('设置账户某行获取的row:', row.accountId);
        let requestParam = {};
        requestParam.addr = Api.setDefaultAccount;
        requestParam.currentCustomerBankId = row.id;
        // requestParam.data = JSON.stringify(row);
        Util.comFetch(requestParam, (data) => {
            message.success('设置成功');
            // this.getTableData();
            this.getTableBankData();
        });
    };

    getUserTypeSelectData = () => {
        //获取对象类型
        let apiArrayDrop = [];
        apiArrayDrop.push({api: "objectType", target: 'userTypeArray', valKey: 'userType'});

        for (let i = 0; i < apiArrayDrop.length; i++) {
            Util.comFetch({
                addr: Api.getDropdownList,
                dictType: apiArrayDrop[i].api
            }, (data) => {
                let resultList = Util.getDropDownListUtil(data.data.rows);
                this.setState({
                    [apiArrayDrop[i].target]: resultList,
                    //form 表单交给ANTD 处理之后,赋默认值Select key 不能给 value
                    // [apiArrayDrop[i].valKey]: resultList.length > 0 ? resultList[0].key : ''
                })
            });
        }
    };

//导出Excel
    exportExcel = () => {
        let postData = {};
        postData.addr = Api.exportACAccount;
        postData.bankCategoryName = this.state.bankName;
        postData.typeCode = this.state.userType || '';
        postData.customerName = this.state.userName;
        postData.pageNumber = this.state.pageNumber;
        postData.pageSize = this.state.pageSize;
        Util.comFetch(postData, (data) => {
            if (data.url) {
                message.success('导出Excel成功');
                let downloadUrl = window.location.protocol + '//' + window.location.host + '/imgservice/download/' + data.url;
                document.getElementById('download_iframe').src = downloadUrl;
            }
        });
    };

    addNewTradeAccount = () => {
        this.setState({
            AddIncomNameEdit:false,
            AddIncomName:true,
            curRowDataIncom:"",
        })

        // this.props.history.push(`${this.props.match.path}/add`);
    };
    AddNewBank=(row)=>{
        this.setState({
            parentId:row.id,
            AddBankNameEdit:false,
            AddBankName:true,
            curRowDataBank:"",
        })
    }
    // getTableData = (pageSize, pageNumber) => {
    //     let postData = {};
    //     postData.addr = Api.getACAccount;
    //     postData.bankCategoryName = this.state.bankName.trim();
    //     postData.typeCode = this.state.userType || '';
    //     postData.customerName = this.state.userName.trim();
    //     postData.pageNumber = pageNumber ? pageNumber : this.state.pageNumber;
    //     postData.pageSize = pageSize ? pageSize : this.state.pageSize;
    //     Util.comFetch(postData, (data) => {
    //         data.data.rows.forEach((item) => {
    //             item.key = item.accountId;
    //         });
    //         console.log("table数据",data);
    //         this.setState({
    //             dataSource: data.data.rows,
    //             tableDataTotal: data.data.total
    //         });
    //     }, (error) => {
    //         this.setState({
    //             dataSource: [],
    //             tableDataTotal: 0
    //         });
    //     });
    //
    // };

    //获取收支对象列表数据
    getTableData = (pageSize, pageNumber) => {
        let postData = {};
        postData.addr = Api.findCurrentCustomerByCondition;
        // postData.bankCategoryName = this.state.bankName.trim();
        postData.typeCode = this.state.userType || '';
        postData.customerName = this.state.userName.trim();
        postData.pageNumber = pageNumber ? pageNumber : this.state.pageNumber;
        postData.pageSize = pageSize ? pageSize : this.state.pageSize;
        Util.comFetch(postData, (data) => {
            data.data.rows.forEach((item) => {
                item.key = item.accountId;
            });
            console.log("table数据",data);
            this.setState({
                dataSource: data.data.rows,
                tableDataTotal: data.data.total,
            });
            if(data.data.rows.length){
                this.setState({
                    parentId:data.data.rows[0].id,
                    parentData:data.data.rows[0],
                });
            }else{
                this.setState({
                    parentId:'',
                    parentData:[],
                });
            }
                this.getTableBankData()
        }, (error) => {
            this.setState({
                dataSource: [],
                tableDataTotal: 0
            });
        });

    };


    //   获取银行数据
    getTableBankData = (pageSize, pageNumber,CustomerId) => {
        let postData = {};
        postData.addr = Api.findCurrentCustomerBankByCondition;
        postData.bankCategoryName = this.state.bankName.trim();
        // postData.currentCustomerId = "1";
        postData.currentCustomerId = CustomerId ? CustomerId : this.state.parentId;
        postData.pageNumber = pageNumber ? pageNumber : this.state.pageNumberBank;
        postData.pageSize = pageSize ? pageSize : this.state.pageSizeBank;
        Util.comFetch(postData, (data) => {
            data.data.rows.forEach((item) => {
                item.key = item.accountId;
            });
            console.log("table数据",data);
            this.setState({
                dataSourceBank: data.data.rows,
                tableDataTotalBank: data.data.total
            });
        }, (error) => {
            this.setState({
                dataSourceBank: [],
                tableDataTotalBank: 0
            });
        });

    };

    TableBankData=(record,index)=>{
        console.log("ROW",record,index)
        this.setState({
            parentId:record.id,
            parentData:record,
        });
        this.getTableBankData(10,1,record.id)
    };



    //初始化界面,请求下拉界面,请求网格数据
    componentDidMount() {
        this.getUserTypeSelectData();
        this.getTableData();
        // this.getTableBankData();
    }

    //对象类型下拉改变之后的回调

    onObjectSelectChange = (value) => {
        console.log('对象类型下拉改变之后的回调,value' + value);
        this.setState({userType: value},
            () => this.getTableData()
        );
        this.setState({'currentPage': 1});
    };
    //上传文件后保存的地址
    uploadFileAddr = () => {
            let postData = {};
            postData.addr = Api.importACAccount;
            postData.url =  AppConf.uploadFilePathIp + '/imgservice/download/' + this.state.uploadUrl;
            postData.name = this.state.uploadName;
        if(this.state.uploadName){
            Util.comFetch(postData, (data) => {
                console.log(data);
                message.success("导入成功");
                this.setState({'uploadVisible': false});
                this.getTableData(10,1);
            }, (error) => {
                console.log(error);
                message.error(error);
            });
        }
        else{
            message.error("请上传文件");
        }
    };

    showUploadModal=()=>{
        Util.comFetch({
            addr: Api.getTempletAddress,
            type: 'excelTemplet_acAccount'
        }, (re) => {
            // debugger;
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

    // // 保存上传后的文件地址到后台
    // saveFileAddr(url, name) {
    //
    // }


    render() {
        const self = this;
        const paginationOpt = {
            showTotal: (total, range) => `共 ${total} 条`,
            total: this.state.tableDataTotal,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                this.setState({'pageSize': pageSize, 'pageNumber': 1, 'currentPage': 1});
                this.getTableData(pageSize, 1);
            },
            onChange: (page, size) => {
                this.setState({'pageNumber': page, 'currentPage': page});
                this.getTableData(null, page);
            },
        };
        const paginationOptBank = {
            showTotal: (total, range) => `共 ${total} 条`,
            total: this.state.tableDataTotalBank,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                this.setState({'pageSizeBank': pageSize, 'pageNumberBank': 1, 'currentPageBank': 1});
                this.getTableBankData(pageSize, 1);
            },
            onChange: (page, size) => {
                this.setState({'pageNumberBankBank': page, 'currentPageBankBank': page});
                this.getTableBankData(null, page);
            },
        };
        const incomTable = [
            {
                title: '收支对象类型',
                dataIndex: 'accountType ',
                key: 'accountType',
                render: (value, row) => (
                    <div>
                        <span className="order-type-icon freeze"  style={{display:row.freeze?'inline-block':'none',} }></span>{row.accountType=="1"?"个人":"企业"}
                    </div>
                )
            },
            {
                title: '收支对象名称',
                dataIndex: 'customerName',
                key: 'customerName',
            },
            {
                title: '手机号/营业执照',
                dataIndex: 'customerCardNo',
                key: 'customerCardNo'
            },
            {
                title: '往来对象类型',
                dataIndex: 'typeName',
                key: 'typeName',
            },
            {
                title: '操作',
                dataIndex: 'accountId',
                key: 'accountId',
                width:'220px',
                render: (value, row) => (
                    <div key="accountId">
                        <a  style={{display:row.freeze ? 'none':'inline-block'}} className="opreate-style" onClick={() => this.editItemIncom(row)} href="javascript:void(0)">编辑</a>
                        <a  style={{display:row.freeze ? 'none':'inline-block'}} onClick={() => this.deleteItem(row)} className="opreate-style" href="javascript:void(0)">删除</a>
                        <a  className="opreate-style" href="javascript:void(0)" onClick={() => this.freezeItem(row,1)}  >{row.freeze?'解冻':'冻结'}</a>
                        <a  style={{display:row.freeze ? 'none':'inline-block'}} className="opreate-style" onClick={() => this.AddNewBank(row)} href="javascript:void(0)">新增账户</a>
                        {/*<a style={{display:row.defaultFlag?"none":"inline-block"}} className="opreate-style" href="javascript:void(0)" onClick={()=>this.showSetConfirm(row)}>设置为默认账户</a>*/}
                    </div>
                )
            }];
        const bankTable = [
            {
                title: '银行开户名称',
                dataIndex: 'accountName',
                key: 'accountName',
                render: (value, row) => (
                    <div>
                        <span className="order-type-icon freeze"  style={{display:row.freeze?'inline-block':'none',} }></span>{row.accountName}
                    </div>
                )
            },
            {
                title: '银行账号',
                dataIndex: 'accountNumber',
                key: 'accountNumber'
            },
            {
                title: '默认账户',
                dataIndex: '',
                key: '',
                render: (value, row) => (
                    <div>
                        <span>{row.defaultFlag==1 ? '是':'否'}</span>
                    </div>
                )
            },

            {
                title: '开户行行别',
                dataIndex: 'bankCategoryName',
                key: 'bankCategoryName'
            },
            {
                title: '开户行名称',
                dataIndex: 'accountBankName',
                key: 'accountBankName'
            },
            {
                title: '操作',
                dataIndex: 'accountId',
                key: 'accountId',
                render: (value, row) => (
                    <div key="accountId">
                        <a style={{display:row.freeze ? 'none':'inline-block'}} className="opreate-style" onClick={() => this.editItem(row)} href="javascript:void(0)">编辑</a>
                        <a style={{display:row.freeze ? 'none':'inline-block'}} onClick={() => this.deleteItemBank(row)} className="opreate-style" href="javascript:void(0)">删除</a>
                        <a className="opreate-style" href="javascript:void(0)" onClick={() => this.freezeItem(row,2)}>{row.freeze?'解冻':'冻结'}</a>
                        <a style={{display:row.defaultFlag?"none":"inline-block"}} className="opreate-style" href="javascript:void(0)" onClick={()=>this.showSetConfirm(row)}>设置为默认账户</a>
                    </div>
                )
            }];
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
            <div className="trade page-container">
                <p className="title"><span className="light-black">当前位置:</span>往来账户</p>
                <div className="search-div-style">
                    往来对象类型:
                    <Select defaultValue=""  allowClear={true} value={this.state.userType} className="search-select-style"
                            onChange={(value) => this.onObjectSelectChange(value)}
                    >
                        <Option  value="">全部</Option>
                        {
                        this.state.userTypeArray.map((object, index) =>
                            <Option key={index} value={object.code}>{object.value}</Option>
                        )
                        }
                    </Select>
                    收支对象名称 :
                    <Input
                        value={this.state.userName}
                        onChange={(e) => this.setState({'userName': e.target.value.replace (/&|@|#|￥|%/g, "")})}
                        className="search-input-style"
                        placeholder="请输入名称查询"
                    />
                    <Button onClick={() => {
                        this.getTableData(10, 1);
                        this.setState({'currentPage': 1});
                    }} type="primary" shape="circle" icon="search"/>

                    <Button style={{marginLeft:'10px',marginRight:'210px'}} onClick={this.addNewTradeAccount} type="primary" shape="circle"
                            icon="plus-circle-o"/>
                    开户行行别 :
                    <Input
                        value={this.state.bankName}
                        onChange={(e) => this.setState({'bankName': e.target.value.replace (/&|@|#|￥|%/g, "")})}
                        className="search-input-style"
                        placeholder="请输入开户行行别查询"
                    />
                    <Button onClick={() => {
                        this.getTableBankData(10, 1);
                        this.setState({'currentPage': 1});
                    }} type="primary" shape="circle" icon="search"/>

                    {/*<Button className="search-right-btn" onClick={() => this.showUploadModal()}  title="导入" type="primary" shape="circle"*/}
                            {/*icon="download"/>*/}
                    {/*<Button className="search-right-btn" type="primary" shape="circle"*/}
                    {/*icon="upload"/>*/}


                    {/*<Button type="primary" onClick={this.exportExcel} className="search-right-btn" shape="circle" title="导出">*/}
                        {/*<Icon type="upload"/>*/}
                    {/*</Button>*/}


                    {/*<Upload*/}
                    {/*className="avatar-uploader"*/}
                    {/*name="avatar"*/}
                    {/*showUploadList={false}*/}
                    {/*action="//jsonplaceholder.typicode.com/posts/"*/}
                    {/*beforeUpload={beforeUpload}*/}
                    {/*onChange={this.handleChange}*/}
                    {/*>*/}
                    {/*{*/}
                    {/*imageUrl ?*/}
                    {/*<img src={imageUrl} alt="" className="avatar" /> :*/}
                    {/*<Icon type="plus" className="avatar-uploader-trigger" />*/}
                    {/*}*/}
                    {/*</Upload>*/}

                </div>
                {/*<div className="">*/}
                    {/*<Table className="common-margin15"*/}
                           {/*dataSource={this.state.dataSource}*/}
                           {/*columns={columns}*/}
                           {/*pagination={paginationOpt}*/}
                           {/*bordered={true}/>*/}
                {/*</div>*/}
                <div className="incomeTable">
                    <Table className="common-margin15"
                           style={{width:"48.5%",float:"left"}}
                           dataSource={this.state.dataSource}
                           columns={incomTable}
                           pagination={paginationOpt}
                           onRowClick={(record,index)=>{this.TableBankData(record,index)}}
                           rowClassName={(record,index)=>record.id==this.state.parentId ? 'clickRow' : ""}
                           bordered={true}/>
                </div>
                <div className="">
                    <Table className="common-margin15"
                           style={{width:"48.5%",float:"left",marginLeft:"38px"}}
                           dataSource={this.state.dataSourceBank}
                           columns={bankTable}
                           pagination={paginationOptBank}
                           bordered={true}/>
                </div>

                {this.state.AddIncomName?
                    <AddIncomName   getTableData={this.getTableData}
                                    isEdit={this.state.AddIncomNameEdit}
                                    curRowData={this.state.curRowDataIncom}
                                    cancel={()=>this.setState({AddIncomName:false})}/>:null}
                {this.state.AddBankName?
                    <AddBankName parentId={this.state.parentId}
                                 parentData={this.state.parentData}
                                 getTableBankData={this.getTableBankData}
                                 isEdit={this.state.AddBankNameEdit}
                                 curRowData={this.state.curRowDataBank}
                                 cancel={()=>this.setState({AddBankName:false})}/>:null}


                <Modal
                    title="导入往来账户"
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
                        </Upload></div>
                    <div> 下载模板:<a href={this.state.excelUrl}>往来账户导入模板</a></div>
                </Modal>
            </div>
        );
    }
}


