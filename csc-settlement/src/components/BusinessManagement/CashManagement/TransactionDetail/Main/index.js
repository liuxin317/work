import React from 'react';
import { Icon, Button, Input, message,Select, Radio } from 'antd';
import './style.scss'
import TransCard from "../TransCard/index";
import  TreeDroplist  from "../../../../common/OrgMy";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;


// 交易明细
export default class TransactionDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            info: '交易明细',
            keyWord: '',
            tranData: {
                usableTotal: 0,
                paperTotal: 0,
                data: [],
            },
            getOrgsOfTre:'',
            //组织机构选择的
            treeValue:[],
            bussInitial:[],

            value:"",
            LedgerData: [],
            currency:"",
        };
    }
    componentWillMount(){
        this.getOrgsOfTre();
        this.getData();
    }

    // componentDidMount() {
    //     this.getData();
    // }
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

    getData = () => {
        let requestParam = {};
        requestParam.addr = Api.getAllAccount;
        requestParam.keyword = this.state.keyWord.trim();
        requestParam.currency = this.state.currency;
        if(this.state.treeValue!==''){
            requestParam.orgCode = this.state.treeValue;
        }else{
            requestParam.orgCode=""
        }
        //获取交易明细信息
        Util.comFetch(requestParam, (data) => {
            console.log('获取交易明细首页数据:', data);
            if(data.data){
            this.setState({
                'tranData': data,
                LedgerData:data.totalData,

            });
            }else{
                this.setState({
                    tranData: {
                        usableTotal: 0,
                        paperTotal: 0,
                        data: [],
                    },
                })
            }
        });
    }
    handleChange = (value) =>{
        console.log(value);
        this.setState({
            currency:value,
        });
    };

    cardCallBack = (cardData) => {
        //xxx
        this.props.history.push(`${this.props.match.path}/history?id=${cardData.accountNumber}&nm=${cardData.companyName}&cur=${cardData.currencyName}`);
    };

    // 导出
    download = () => {
      let requestParam = {};
      requestParam.addr = Api.exportAllAccount;
      requestParam.keyword = this.state.keyWord;
      requestParam.currency = this.state.currency;
        Util.comFetch(requestParam,
        (data) => {
          if (data.url){
            message.success('导出Excel成功');
            let downloadUrl = window.location.protocol + '//' + window.location.host + '/imgservice/download/' + data.url;
            console.log('交易记录点击了下载,下载地址为:', downloadUrl);
            document.getElementById('download_iframe').src = downloadUrl;
          }
        }
      );
    }
    caseCurrency=(index)=>{
        switch (index){
            case"美元":
                return ' my';
            case"人民币":
                return ' rmb';
            case"日元":
                return ' ry';
        }
    };


    render() {
        const { info } = this.state;
        let data = this.state.tranData;
        console.log('tranData', data);
        return (
            <div className="trans-detail page-container">
                <p className="title"><span className="light-black">当前位置:</span>{info}</p>
                <div className="card-Content">
                    {
                    this.state.LedgerData.map((v,i)=>
                        <div   className={"ledger-Card"+this.caseCurrency(v.currencyName)} >
                            <p className="Currency" >{v.currencyName}汇总<span className="bz">{v.currencyCode}</span></p>
                            <p className="all-Amount">账户账面总额:</p>
                            <p className="use-Amount">{v.paperAmount}</p>
                            <p className="all-Amount">账户可用总额:</p>
                            <p className="use-Amount">{v.usableAmount}</p>
                        </div>
                        )
                     }
                </div>
                <div className="search-div">
                    {/*<Input onChange={(e) => {*/}
                        {/*this.setState({ 'keyWord': e.target.value })*/}
                    {/*}}*/}
                           {/*className="search-input-style" placeholder="请输入银行行别或者银行账号查询"/>*/}


                    <div  style={{display:'inline-block',verticalAlign:'top', height: '30px', lineHeight: '28px',marginTop:'10px'}}>
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
                    <span style={{margin:"0px  10px"}}>币种:</span>
                    <Select defaultValue="" className="Select-Ledger" style={{width: 150}}
                            onChange={(value) => this.handleChange(value)}>
                        <Option value="">全部币种</Option>
                        <Option value="RMB">人民币</Option>
                        <Option value="MY">美元</Option>
                        <Option value="RY">日元</Option>
                    </Select>
                    <Button className="search-btn-style" onClick={this.getData} type="primary" shape="circle"
                            icon="search"/>
                    <Button title="导出" type="primary" shape="circle" icon="upload" onClick={this.download}/>
                </div>
                <div className="margin-top10 mt15">{
                    data.data.map((cardData, index) =>
                        <TransCard key={index} cardCallBack={this.cardCallBack} cardData={cardData}/>
                    )
                }
                </div>
            </div>
        );
    }
}

