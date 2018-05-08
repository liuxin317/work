import React from 'react';
import { Radio, Input, DatePicker, Button, message, InputNumber, Table, Select } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './index.scss';
import utils from "../../../utils/index";
import Page from "../../common/Page/index";


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const Option = Select.Option;



// 总账记录
export default class TranscationLedger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value:"",
            cards: [],
            currency:"",
        };
    }
    componentDidMount(){
        this.search();
    }
    handleChange = (value) =>{
        console.log(value);
        this.setState({
            currency:value,
        });
    };
    //搜索
    search = () => {
        let requestParam = {};
        requestParam.addr = Api.getAllAccountTotal;
        requestParam.currency=this.state.currency;
        //获取用户信息
        Util.comFetch(requestParam, (data) => {
            console.log("数据",data);
            this.setState({
                "cards": data.data,
            });
        });
        this.state.cards;
    };
    //导出
    download = () => {
        let requestParam = {};
        requestParam.addr = Api.exportAccountTotal;
        requestParam.currency=this.state.currency;
        Util.comFetch(requestParam,
            (data) => {
                if (data.url){
                    message.success('导出Excel成功');
                    let downloadUrl = window.location.protocol + '//' + window.location.host + '/imgservice/download/' + data.url;
                    console.log('交易记录点击了下载,下载地址为:', downloadUrl);
                    document.getElementById('download_iframe').src = downloadUrl;
                }
            }
        )};

    render() {
        // let self = this;

        const cards = this.state.cards;
        // const card = cards.length ? cards[0] : {};
        let cardData = cards.map((v,i)=>{
            return <div className="ledger-Card">
                        <p className="Currency"><span className="bz">{v.currencyCode}</span>
                            {v.currencyName}</p>
                        <p className="all-Amount">账户账面总额:{v.paperAmount}</p>
                        <p className="use-Amount">账户可用总额:{v.usableAmount}</p>
                    </div>
        });
            return (
                <div className="trans-Ledger page-container">
                    <div className="common-margin15 radio-border">
                        <Select defaultValue="" className="Select-Ledger" style={{width: 300}}
                                onChange={(value) => this.handleChange(value)}>
                            <Option value="">全部币种</Option>
                            <Option value="CNY">人民币</Option>
                            <Option value="USD">美元</Option>
                            <Option value="JPY">日元</Option>
                        </Select>
                        <Button className="search-item-common" type="primary" shape="circle"
                                onClick={this.search} icon="search"/>
                        <Button title="导出" type="primary" shape="circle" icon="upload" onClick={()=>this.download()}/>

                        <div className="card-Content">
                            {cardData}
                        </div>
                    </div>

                </div>
            );


    }
}



