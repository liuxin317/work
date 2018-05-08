import  React from  "react";
import  {
    Input,
    Button,
    message,
    Modal,
    Table,
    Popconfirm,
} from  "antd";
import BIN from 'bankcardinfo'
import  "./index.scss";
import  TreeDroplist  from "../../../common/OrgMy";

export  default class tableDetails  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            pageSize: 10,
            currentPage:1,
            //银行账号
            SpAccountNumber:"",
            SpBankCategoryCode:"",
            ScompanyName:"",
            //日志展示
            log:false,
            logData:[],
            //详情
            detail:false,
            detailData:"",
            bankCardDetail: [],

            getOrgsOfTre:'',
            //组织机构选择的
            treeValue:[],
            bussInitial: [],
            //创建时间数据
            createData:'',
        }
    };
    componentWillMount(){
        this.getOrgsOfTre();
    };
    componentDidMount() {
        this.getTableData(10,1)
    };

    componentDidUpdate(prevProps) {
        console.log(prevProps, this.props);
        if (prevProps.location.pathname !== this.props.location.pathname) {
            if (prevProps.location.pathname === this.props.match.path + '/add') {
                if (this.props.location.search.match(/^[&?]addback/)) {
                    console.log('refresh page ...');
                    this.getTableData();
                }
            }
        }
    }

    //获取组织结构下拉数据
    getOrgsOfTre = () => {
        // debugger;
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

    //搜索
    getTableData = (pageSize, pageNumber) => {
        let requestParam = {};
        requestParam.addr = Api.findAllCustodyInfo;
        requestParam.pageSize = pageSize ? pageSize : this.state.pageSize;
        requestParam.pageNumber = pageNumber ? pageNumber : this.state.pageNumber;
        requestParam.pBankCategoryCode = this.state.SpBankCategoryCode;
        requestParam.orgCode=this.state.treeValue.toString();
        requestParam.pAccountNumber=this.state.SpAccountNumber;
        //获取用户信息
        Util.comFetch(requestParam, (data) => {
            console.log("数据", data);
            data.data.rows.forEach((item, index) => {
              item.key = index;
            });
            this.setState({
                dataSource: data.data.rows,
                tableDataTotal: data.data.total
            });
        });
    };
    //添加信息
    addIformation = () => {
        this.props.history.push(`${this.props.match.path}/add`);
    };
    //修改保管信息
    editItem = (row) => {
        console.log('编辑某行获取的row:', row);
        this.props.history.push(`${this.props.match.path}/add?id=${row.custodyId}`);
    };
    //获取详情数据
    showDetails=(row)=>{
        let requestParam = {};
        requestParam.addr = Api.findCustodyById;
        requestParam.custodyId = row.custodyId;
        Util.comFetch(requestParam, (data) => {
            console.log("详情",data)
            this.setState({
                detail:true,
                detailData: data.data
            })
            this.getCardDetail(data.data.pAccountNumber);
        });
    };
    // 获取银行卡详情
    getCardDetail = (cardNo) => {
      let param = {};
      param.addr = Api.getMyAccountBypAccountNumber;
      param.pAccountNumber = cardNo;
      Util.comFetch(param, (data) => {
        this.setState({
          bankCardDetail: data.data[0].split(",")
        });
      })
    }
    //冻结保管信息
    freezeItem = (row) => {
        console.log('冻结的row:', row);
        let requestParam = {};
        requestParam.addr = Api.freezeCustody;
        requestParam.custodyId = row.custodyId;
        debugger;
        if(row.freeze==0){
            requestParam.freezeFlag ="freeze";
        }
        else {
            requestParam.freezeFlag ="unfreeze";
        }
        Util.comFetch(requestParam, (data) => {
            message.success(row.freeze===0?'冻结成功':'解冻成功');
            this.getTableData();
        });
    };
    //获取日志数据
    getLogData=(row)=>{
        let requestParam = {};
        requestParam.addr = Api.findBycustodyInfoId;
        requestParam.custodyInfoId = row.custodyId;
        Util.comFetch(requestParam, (data) => {
         console.log("日志",data.data[0]);
            let  arry=data.data;
            let  createData=data.data.pop();
            this.setState({
                createData:createData,
                log:true,
                logData:arry
            })
        });
    };
    // 日志
    getLog=()=>{
        const { logData, createData } = this.state;
        const chkArr = [
          {key:'accHolderName',val:'开户人姓名'},
          {key:'accHolderTel',val:'开户人电话'},
          {key:'accHolderCardId',val:'开户人身份证'},
          {key:'legalPersonName',val:'法人姓名'},
          {key:'legalPersonTel',val:'法人电话'},
          {key:'legalPersonCardNo',val:'法人身份证'},
          {key:'legalPersonSeal',val:'法人预留印章'},
          {key:'cashierName',val:'出纳姓名'},
          {key:'cashierTel',val:'出纳电话'},
          {key:'cashierCardNo',val:'出纳身份证'},
          {key:'cashierSeal',val:'出纳预留印章'},
        ];
        let Log = logData.map((v, i) => {
            const pre = i + 1 === logData.length ? createData : logData[i + 1];

            let diffRows = [];
            chkArr.forEach((chk, index) => {
                if (pre[chk.key] !== v[chk.key]) {
                    if (chk.key === 'legalPersonSeal' || chk.key === 'cashierSeal') {
                      diffRows.push(
                        <div className="diff-row" key={index}>
                            <span className="diff-nm dib">{chk.val}</span>
                            <div className="ori-val img-wrapper dib">
                                <img src={pre[chk.key]} className="thumb" alt=""/>
                                <img src={pre[chk.key]} className="big-img" alt=""/>
                            </div>
                            <span className="chg dib">变更为</span>
                            <div className="hl-red img-wrapper dib">
                                <img src={v[chk.key]} className="thumb" alt=""/>
                                <img src={v[chk.key]} className="big-img" alt=""/>
                            </div>
                        </div>
                      );
                    } else {
                        diffRows.push(
                          <div className="diff-row" key={index}>
                            <span className="diff-nm dib">{chk.val}</span>
                            <span className="ori-val dib ellipsis">{pre[chk.key]}</span>
                            <span className="chg dib">变更为</span>
                            <span className="hl-red dib">{v[chk.key]}</span>
                          </div>
                        );
                    }
                }
            });


            return (
                <div  className="keepInformation-log"  key={i} value={i}>
                    <div  className="editor-row">
                        修改时间：<span className="hl-blue" style={{marginRight: '15px'}}>{v.operTime}</span>
                        修改人：<span className="hl-blue">{v.operUser}</span>
                    </div>
                    {diffRows}
                </div>
            )
        });
        return  Log
    };
    //输入银行卡之后的回调
    pAccountNumber = (event) => {
        console.log('输入银行卡之后的回调',event.target.value);
        let  valueBank=event.target.value;
        valueBank = valueBank.replace(/(^\s+)|(\s+$)/g, "").replace (/&|@|#|￥|%/g, "");
        this.setState({
            SpAccountNumber:valueBank
        });
        let self = this;
        // if (valueBank.length < 15)
        //     return;
        BIN.getBankBin(valueBank)
            .then(function (data) {
                console.log("BIN",data);
                debugger;
                // self.setState({
                //     pAccountNumber:valueBank
                // });

                // let bankName = data.bankName;
                // self.state.bankArray.some((item, index) => {
                //     if (item.value === bankName) {
                //         self.props.form.setFieldsValue({ 'bankType': item.key });
                //         return true;
                //     }
                // });
            })
            .catch(function (err) {
                console.log('识别银行卡卡号错误:', err);
            })
    };
    SpBankCategoryCode=(event)=>{
        let  valueBank=event.target.value;
        valueBank = valueBank.replace(/(^\s+)|(\s+$)/g, "").replace (/&|@|#|￥|%/g, "");
        this.setState({
            SpBankCategoryCode:valueBank
        });
    };

    render() {
        const state = this.state;
        const {detailData ,createData, bankCardDetail }=this.state;

        let  Log=this.getLog();
        //table表格
        const self = this;
        const paginationOpt = {
            current: this.state.currentPage,
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
        const columns = [
            {
                title: '组织机构',
                dataIndex: 'orgName',
                key: 'orgName',
                render: (value, row) => (
                    <div>
                        <span className="order-type-icon freeze"  style={{display:row.freeze?'inline-block':'none',}}></span>{row.orgName}
                    </div>
                )
            },
            {
                title: '银行账号',
                dataIndex: 'pAccountNumber',
                key: 'pAccountNumber',
            },
            {
                title: '开户人姓名',
                dataIndex: 'accHolderName',
                key: 'accHolderName',
            },
            // {
            //     title: '法人姓名',
            //     dataIndex: 'legalPersonName',
            //     key: 'legalPersonName',
            // },
            {
                title: '出纳姓名',
                dataIndex: 'cashierName',
                key: 'cashierName',
            },
            {
                title: '企业网银',
                dataIndex: 'ebankOpen',
                key: 'ebankOpen',
                render:(value,row)=>(
                    <span>{row.ebankOpen=="1"?"已开通":"未开通"}</span>
                )
            },
            // {
            //     title: '开通网银时间',
            //     dataIndex: 'ebankOpenTime',
            //     key: 'ebankOpenTime',
            // },


            {
                title: '银企直联',
                dataIndex: 'b2eOpen',
                key: 'b2eOpen',
                render:(value,row)=>(
                    <span>{row.b2eOpen=="1"?"已开通":"未开通"}</span>
                )
            },
            // {
            //     title: '开通银企直联时间',
            //     dataIndex: 'b2eOpenTime',
            //     key: 'b2eOpenTime',
            //     width:20
            // },
            {
                title: 'U盾/数字秘钥保管人',
                dataIndex: 'keyCustodian',
                key: 'keyCustodian',
                width:20
            },
            {
                title: '密码保管人',
                dataIndex: 'passwordCustodian',
                key: 'passwordCustodian',
            },
            // {
            //     title: '创建人',
            //     dataIndex: 'createdUser',
            //     key: 'createdUser',
            // },
            // {
            //     title: '创建时间',
            //     dataIndex: 'createdTime',
            //     key: 'createdTime',
            // },
            //
            // {
            //     title: '修改人',
            //     dataIndex: 'modifedUser',
            //     key: 'modifedUser',
            // },
            // {
            //     title: '修改时间',
            //     dataIndex: 'modifiedTime',
            //     key: 'modifiedTime',
            // },
            {
                title: '操作',
                dataIndex: 'accountId',
                key: 'accountId',
                width:180,
                render: (value, row) => (
                    <div key="accountId">
                        <a className="keepOpreate-style"    style={{display:row.freeze ? "none" : "inline-block"}}
                           onClick={() => this.editItem(row)} href="javascript:void(0)">编辑</a>
                        <a className="keepOpreate-style" href="javascript:void(0)"
                           onClick={() => this.showDetails(row)}>详情</a>
                        <Popconfirm title={row.freeze?'确认解冻？':'确认冻结?'} onConfirm={() => this.freezeItem(row)}>
                            <a className="keepOpreate-style" href="javascript:void(0)">{row.freeze?'解冻':'冻结'}</a>
                        </Popconfirm>
                        <a className="keepOpreate-style" href="javascript:void(0)"
                           onClick={() => this.getLogData(row)}>日志</a>

                    </div>
                )
            }
        ];
        return (
            <div className="page-container keep-info">
                <p className="title"><span className="light-black">当前位置:</span>保管信息</p>
                {/*<div className="keep-information"   style={{fontSize:"large",  marginLeft:'20px' }}>保管信息</div>*/}
                <div className="mt15">
                    <span style={{marginRight:'10px'}}>银行账户:  </span>
                    <Input  placeholder="银行账户" style={{width: "200px"}} value={this.state.SpAccountNumber}
                            onChange={(event) =>{this.pAccountNumber(event)}}
                            // onChange={(e) => this.cardInputChange(e.target.value)}
                           className="search-input"/>
                    <span  style={{marginLeft:"20px",marginRight:'10px'}}>开户行行别:  </span>
                    <Input placeholder="开户行行别" style={{width: "200px"}}
                           value={this.state.SpBankCategoryCode}
                           onChange={(event) =>{this.SpBankCategoryCode(event)}}
                           className="search-input"/>
                    <div  style={{display:'inline-block',verticalAlign: 'top', height: '30px', lineHeight: '28px'}}>
                        <span  style={{marginLeft:"20px"}}>组织机构:  </span>
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
                    <Button style={{marginLeft: "300px"}} className="search-right-btn"
                            onClick={() => this.addIformation()}
                            type="primary" shape="circle"
                            icon="plus-circle-o"/>

                    <Button className="search-item-common" style={{marginLeft: "20px"}} type="primary" shape="circle"
                            onClick={() => this.getTableData()} icon="search"/>
                </div>
                <div className="mt15">
                    <Table style={{margin: "auto"}} className="common-margin15"
                           dataSource={this.state.dataSource}
                           columns={columns}
                           pagination={paginationOpt}/>
                </div>

                {/*日志*/}
                <Modal
                    wrapClassName="log"
                    width={"680px"}
                    footer={null}
                    title={'日志'}
                    visible={this.state.log}
                    maskClosable={false}
                    onCancel={() => this.setState({'log': false})}
                >
                    {Log}
                    <div  className="keepInformation-log"  >
                        <div className="editor-row">
                            创建时间：<span className="hl-blue" style={{marginRight: '15px'}}>{createData.operTime}</span>
                            创建人：<span className="hl-blue">{createData.operUser}</span>
                        </div>
                    </div>
                </Modal>
                {/*详情*/}
                <Modal
                    wrapClassName="detail"
                    width={"600px"}
                    footer={null}
                    closable={false}
                    cancelText="确定"
                    visible={this.state.detail}
                    maskClosable={false}
                    onCancel={() => this.setState({'detail': false})}
                >
                    <div  className="detail">
                        <div className="row">账户信息</div>
                        <div className="row">
                            <span className="desc">组织机构:</span>
                            <div className="detail-item">{detailData.orgName}</div>
                        </div>
                        <div className="row">
                            <span className="desc">开户行名称:</span>
                            <div className="detail-item">{detailData.pBankCategoryCode}</div>
                        </div>
                        <div className="row">
                            <span className="desc">银行账号:</span>
                            <div className="detail-item">{detailData.pAccountNumber}</div>
                        </div>
                        <div className="row">
                            <span className="desc">银行开户名称:</span>
                            <div className="detail-item">{bankCardDetail[0]}</div>
                        </div>
                        <div className="row">
                            <span className="desc">开户行名称:</span>
                            <div className="detail-item">{bankCardDetail[1]}</div>
                        </div>
                        <div className="row">
                            <span className="desc">币种:</span>
                            <div className="detail-item">{bankCardDetail[2]}</div>
                        </div>
                        <div className="row">
                            <span className="desc">账户性质:</span>
                            <div className="detail-item">{bankCardDetail[3]}</div>
                        </div>
                        <div className="row">
                            <span className="desc">网银信息:</span>
                            <div className="detail-item">
                              {detailData.ebankOpen=="1"?"已开通":"未开通"}
                              {detailData.ebankOpen=="1" ? (<span style={{margin: '0 10px 0'}}>开通时间: </span>) :''}
                              {detailData.ebankOpenTime}
                            </div>
                        </div>
                        <div className="row">
                            <span className="desc">银企直联:</span>
                            <div className="detail-item">
                              {detailData.b2eOpen=="1"?"已开通":"未开通"}
                              {detailData.b2eOpen=="1" ? (<span style={{margin: '0 10px 0'}}>开通时间: </span>) :''}
                              {detailData.b2eOpenTime}
                            </div>
                        </div>

                        <div className="row">开户人信息</div>
                        <div className="row">
                            <span className="desc">开户人姓名:</span>
                            <div className="detail-item">{detailData.accHolderName}</div>
                        </div>
                        <div className="row">
                            <span className="desc">开户人电话:</span>
                            <div className="detail-item">{detailData.accHolderTel}</div>
                        </div>
                        <div className="row">
                            <span className="desc">开户人身份证:</span>
                            <div className="detail-item">{detailData.accHolderCardId}</div>
                        </div>
                        <div className="row">法人信息</div>
                        <div className="row">
                            <span className="desc">法人姓名:</span>
                            <div className="detail-item">{detailData.legalPersonName}</div>
                        </div>
                        <div className="row">
                            <span className="desc">法人电话:</span>
                            <div className="detail-item">{detailData.legalPersonTel}</div>
                        </div>
                        <div className="row">
                            <span className="desc">法人身份证:</span>
                            <div className="detail-item">{detailData.legalPersonCardNo}</div>
                        </div>
                        <div className="row">
                            <span className="desc">法人预留印章:</span>
                            <div className="detail-item">
                                <img   style={{width:"80px",height:"80px"}} src={detailData.legalPersonSeal} alt=""/>
                                </div>
                        </div>
                        <div className="row">出纳信息</div>
                        <div className="row">
                            <span className="desc">出纳姓名:</span>
                            <div className="detail-item">{detailData.cashierName}</div>
                        </div>
                        <div className="row">
                            <span className="desc">出纳电话:</span>
                            <div className="detail-item">{detailData.cashierTel}</div>
                        </div>
                        <div className="row">
                            <span className="desc">出纳身份证:</span>
                            <div className="detail-item">{detailData.cashierCardNo}</div>
                        </div>
                        <div className="row">
                            <span className="desc">出纳预留印章:</span>
                            <div className="detail-item">
                                <img   style={{width:"80px",height:"80px"}} src={detailData.cashierSeal} alt=""/>
                            </div>
                        </div>

                        <div className="row">密钥保管</div>
                        <div className="row">
                            <span className="desc">U盾/数字秘钥保管人:</span>
                            <div className="detail-item">{detailData.keyCustodian}</div>
                        </div>
                        <div className="row">
                            <span className="desc">密码保管人:</span>
                            <div className="detail-item">{detailData.passwordCustodian}</div>
                        </div>
                    </div>
                    <div style={{textAlign:"center"}}>
                        <Button size="small" onClick={() => this.setState({'detail': false})}
                                type="primary">确认</Button>
                    </div>
                </Modal>
            </div>


        )
    }
}