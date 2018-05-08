import React from 'react';
import { Radio, Input, DatePicker, Button, message, InputNumber, Table, Select,Modal ,Row, Col} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './index.scss';
// import utils from "../../../utils/index";
// import Page from "../../common/Page/index";


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';
const moneyTypeArray = ['>', '<', '=', '区间'];



// 历史交易查询
export default class TranscationHistory extends React.Component {
    constructor(props) {
        super(props);
        // let id = location.search.split('&')[0].split('=')[1];
        // let name = location.search.split('&')[1].split('=')[1];
        //接受地址传参
        let searchParam = Util.getSearchParam();
        console.log('searchParam', searchParam);
        let id = searchParam.id || '';
        let name = searchParam.nm || '';
        let cur = searchParam.cur || '';
        //解决传来的名字乱码问题
        name = decodeURIComponent(name);

        this.state = {
            info: '历史交易记录',
            infos: ['交易明细', '历史交易记录'],
            id: id,
            name: name,
            cur:cur,

            type:"",
            tp:"",

            pageNumber: 1,
            pageSize: 10,
            currentPage: 1,
            dataSource: [],
            tableDataTotal: 0,
            prSign: "",
            opposite: "",
            paymentCode:"",
            busCode:"",
            amount: "",
            amountEnd: '',
            compareSign: ">",
            accountingStartDate: "",
            accountingEndDate: "",
            inAccountStartDate: "",
            inAccountEndDate: "",
            showMoneyEnd: false,
            rzsj: [],
            jzsj:[],


            RowDetail:false,
            rowData:'',

        }
        ;
        moment.locale('zh-cn');

        Date.prototype.Format = function (fmt) { //author: meizz
            let o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (let k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1,
                    (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };
    }

    componentDidMount() {
        this.search();
    }

    getSearchParam = (pageSize, pageNumber, addr) => {
        console.log('getSearchParam')
        return {
            addr: addr,
            opposite: this.state.opposite,
            paymentCode:this.state.paymentCode,
            busCode :this.state.busCode ,
            amount: this.state.amount,
            amountEnd: this.state.amountEnd,
            compareSign: this.state.compareSign === '区间' ? 'between' : this.state.compareSign,
            accountingStartDate: this.state.accountingStartDate,
            accountingEndDate: this.state.accountingEndDate,
            inAccountStartDate: this.state.inAccountStartDate,
            inAccountEndDate: this.state.inAccountEndDate,
            prSign: this.state.prSign,
            pageNumber: pageNumber ? pageNumber : this.state.pageNumber,
            pageSize: pageSize ? pageSize : this.state.pageSize,
            accountNumber: Util.getQueryString('id')
        }
    };

    rangePickerChange = (moment, timeArray, type) => {
        console.log('rangePicker回调', timeArray,moment)
        if (type === 1) {
            this.setState({
                'accountingStartDate': timeArray[0], 'accountingEndDate': timeArray[1],
                jzsj: moment,
                });
        }
        else {
            // this.setState({ 'inAccountStartDate': timeArray[0], 'inAccountEndDate': timeArray[1],
            //     });
            this.setState({
                rzsj: moment,
                inAccountStartDate: timeArray[0],
                inAccountEndDate: timeArray[1],
            });
        }
    };
    //没有金额提示的搜索
    allSearch = (pageSize, pageNumber) => {
        Util.comFetch(this.getSearchParam(pageSize, pageNumber, Api.getTransactionDetail),
            (data) => {
                data.data.rows.forEach((item) => {
                    item.key = item.id;
                });
                console.log(data);
                this.setState({
                    dataSource: data.data.rows,
                    tableDataTotal: data.data.total
                });
            }
        )
    };

     search= (pageSize, pageNumber) => {
        //搜索之前,要判断区间是否填写完整
        if (this.state.compareSign === '区间') {
            if (!this.state.amount || !this.state.amountEnd) {
                message.info('请完整填写金额区间');
                return;
            }
        }
        Util.comFetch(this.getSearchParam(pageSize, pageNumber, Api.getTransactionDetail),
            (data) => {
                data.data.rows.forEach((item) => {
                    item.key = item.id;
                });
                console.log(data);
                this.setState({
                    dataSource: data.data.rows,
                    tableDataTotal: data.data.total
                });
            }
        )
    };
    download = () => {
        Util.comFetch(this.getSearchParam(null, null, Api.exportTransactionDetail),
            (data) => {
                if (data.url) {
                    message.success('导出Excel成功');
                    let downloadUrl = window.location.protocol + '//' + window.location.host + '/imgservice/download/' + data.url;
                    console.log('交易记录点击了下载,下载地址为:', downloadUrl);
                    document.getElementById('download_iframe').src = downloadUrl;
                }
            }
        )
    };

// 改变type 时的回调
    changeType(event) {
        console.log('changeType', event);
        this.setState({
                'amount':"",
                'amountEnd':"",
                'inAccountStartDate': "",
                'inAccountEndDate': "",
                 rzsj: [],
                 jzsj: [],
                 opposite:"",
                 busCode:"",
                 paymentCode:"",
                 type:"",
                 compareSign:">",
                 showMoneyEnd:false,
                'prSign': event.target.value,
                'accountingStartDate': '',
                'accountingEndDate': '',

            },
            () =>
                this.allSearch(10, 1, Api.getTransactionDetail));
                this.setState({ currentPage: 1 });
    }

//点击金额下拉的操作
    setCompareSign(value) {
        console.log("金额下拉",   value)
        this.setState({ 'compareSign': value || '' })
        this.setState({ 'showMoneyEnd': value === '区间' });
        if(value !=='区间'){
            this.setState({'amountEnd':"",})
        }
    };

//最近一个月的点击
    monthClick = (type) => {
        let date = new Date();
        let lastDay = date.Format('yyyy-MM-dd');
        let firstDate;
        if (type === 1) {
            date.setDate(1);
        }
        else {
            date.setMonth(date.getMonth() - 3);
        }
        firstDate = date.Format('yyyy-MM-dd');
        this.setState({
            type:type,
            inAccountStartDate: firstDate,
            inAccountEndDate: lastDay,
            rzsj: [],

        }, () => {
            this.allSearch(10, 1)
        });


    };
 //点击全部明细时候清空参数
    allClick=(type)=>{
        this.setState({
                type:type,
                amount:"",
                amountEnd:"",
                rzsj: [],
                jzsj: [],
                opposite:"",
                paymentCode:"",
                busCode:"",
                compareSign:">",
                showMoneyEnd:false,
                'accountingStartDate': '',
                'accountingEndDate': '',
                'inAccountStartDate': "",
                'inAccountEndDate': "",
            },
            () => this.allSearch(10, 1, Api.getTransactionDetail));
        this.setState({ currentPage: 1 });
    };
// 验证输入框的值改变
    changeValue=(e,type)=>{

        let val = e.target.value;
        console.log(val);

        //修复第一个字符是小数点 的情况.
        if(val !=''&& val.substr(0,1) == '.'){
            val="";
        }
        val = val.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
        val = val.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
        val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
        val = val.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
        if(val.indexOf(".")< 0 && val !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            if(val.substr(0,1) == '0' && val.length == 2){
                val= val.substr(1,val.length);
            }
        } if  (type==1){
            this.setState({
                amountEnd:val
            })
        }else if (type==2){
            this.setState({
                amount:val
            })

        }


    }
    //为金额结束加0
    addZ=()=>{
        let val = this.state.amountEnd;
        console.log(val)
        if(val.match(/^\d+$/)) //为整数字符串在末尾添加.00
        {val += '.00';}
        if(/^(\d+\.\d{1,1}|\d+)$/.test(val)) //为0.1字符串在末尾添加.10
        {val += '0';}
        this.setState({
            amountEnd:val
        })
    }
    //为金额开始加0
    addStartZ=()=>{
        let val = this.state.amount;
        console.log(val)
        if(val.match(/^\d+$/)) //为整数字符串在末尾添加.00
        { val += '.00';}
        if(/^(\d+\.\d{1,1}|\d+)$/.test(val)) //为0.1字符串在末尾添加.10
        {val += '0';}
        this.setState({
            amount:val
        })
    };
    RowDetail=(row)=>{
        console.log("详情row",row)
        this.setState({
            RowDetail:true,
            rowData:row,
        })
    };

    getCrumb() {
      const { infos } = this.state;
      if (infos.length > 1) {
        return (
          [
            <span key={0} className="crumb-pre">{infos.slice(0, infos.length - 1).join('>') + '>'}</span>,
            <span key={1} className="crumb-cur">{infos[infos.length - 1]}</span>
          ]
        );
      } else {
        return (
          <span className="crumb-cur">{infos.join('>')}</span>
        );
      }
    }

    render() {
        let self = this;
        const { rowData, infos }=this.state;
        const paginationOpt = {
            current: this.state.currentPage,
            showTotal: (total, range) => `共 ${total} 条`,
            total: this.state.tableDataTotal,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                self.setState({ 'pageSize': pageSize, 'pageNumber': 1, currentPage: 1 });
                self.search(pageSize, 1);
            },
            onChange: (page, size) => {
                self.setState({ 'pageNumber': page, currentPage: page });
                self.search(null, page);
            }
        };
        const columns = [
            {
                title: '交易流水号',
                dataIndex: 'bankSerialNo',
                key: 'bankSerialNo',
            },
            {
                title: '对方信息',
                dataIndex: 'name',
                key: 'name',
                render: (value, row) => (
                    <div>
                        <div>{row.rcvAccountName}</div>
                    </div>
                ),
            },
            {
                title: '发生金额',
                dataIndex: 'amount',
                key: 'amount',
                render: (value, row) => {
                    if (this.state.id !== row.payAccountNo) {
                        return (<span style={{color:'red'}}>+{value}</span>);
                    } else {
                        if(value.indexOf("-")!== -1){
                            return (<span style={{color:'green'}}>{value}</span>);
                        }else{
                            return (<span style={{color:'green'}}>-{value}</span>);
                        }
                    }
                }
            },
            // {
            //     title: '订单信息',
            //     dataIndex: 'address',
            //     key: 'address',
            //     render: (value, row) => (
            //         <div>
            //             <div>会计服务订单号:</div>
            //             <div>{row.busCode}</div>
            //             <div>会计凭证号:{row.voucherCode}</div>
            //             <div>业务类型:{row.businessType}</div>
            //             <div>记账日期:{row.accountTime}</div>
            //             <div>结算订单号:{row.postscript }</div>
            //         </div>
            //     )
            // },
            // {
            //     title: '币种',
            //     dataIndex: 'currency',
            //     key: 'currency',
            // },
            // {
            //     title: '借贷标志',
            //     dataIndex: 'dcFlag',
            //     key: 'dcFlag',
            // },
            {
                title: '银行余额',
                dataIndex: 'balance',
                key: 'balance',
            },
            {
                title: '银行入账时间',
                dataIndex: 'tradeTime',
                key: 'tradeTime',
            },
            // {
            //     title: '其他',
            //     dataIndex: 'key',
            //     key: 'key',
            //     render: (value, row) => (
            //         <div>
            //             <div>摘要:{row.postscript}</div>
            //             <div>附言:{row.postscript}</div>
            //             <div>用途:{row.purpose}</div>
            //         </div>
            //     )
            // },
            {
              title: '摘要',
              dataIndex: 'key',
              key: 'key',
              render: (value, row) => (
                <div>
                  <div>{row.summary}</div>
                </div>
              )
            },
            {
                title: '操作',
                dataIndex: 'id',
                key: 'id',
                render: (value, row) => (
                    <div>
                        <a onClick={()=>this.RowDetail(row)}>详情</a>
                    </div>
                )
            },

        ];
        return (
            <div className="trans-histroy page-container">
                <div className="title">
                  <span className="back" onClick={() => this.props.history.goBack()}>&lt;返回</span>
                  {this.getCrumb()}
                </div>

                <p style={{marginTop: '15px'}}><span>银行开户名称:&emsp;{this.state.name}</span><span className="bank-Id">银行账号:&emsp;{this.state.id}</span><span className="bank-Id">币种:&emsp;{this.state.cur}</span></p>
                <div className="common-margin15 radio-border tabs">
                    <RadioGroup value={this.state.prSign} size="large" defaultValue=""
                                onChange={(event) => this.changeType(event)}
                    >
                        <RadioButton  value={''}>{'全部'}</RadioButton>
                        <RadioButton value={'贷'}>{'收款'}</RadioButton>
                        <RadioButton value={"借"}>{'付款'}</RadioButton>
                    </RadioGroup>
                </div>
                <div className="search_div">
                    <Input placeholder="请输入对方开户名称" value={this.state.opposite}
                           onChange={(event) => this.setState({ 'opposite': event.target.value })}
                           className="search-input"/>
                    <Input placeholder="请输入结算订单号" value={this.state.paymentCode  }
                           onChange={(event) => this.setState({ 'paymentCode': event.target.value })}
                           className="search-input"/>
                    <Input placeholder="请输入会计服务订单号" value={this.state.busCode }
                           onChange={(event) => this.setState({ 'busCode': event.target.value })}
                           className="search-input"/>

                    金额 :
                    <Select  value={this.state.compareSign} className="search-select"
                            onChange={(value) => this.setCompareSign(value)}
                    >{
                        moneyTypeArray.map((item, index) =>
                            <Option key={index} value={item}>{item}</Option>
                        )
                    }
                    </Select>
                    <Input
                        maxLength="21"
                        value={this.state.amount}
                        onBlur={this.addStartZ}
                        onChange={(e)=>this.changeValue(e,2)}
                        className="search-item-common inputNumber"
                        defaultValue={1000}
                        min={0}
                    />
                    <div className="show-money-end"
                         style={{ display: this.state.showMoneyEnd ? 'inline-block' : 'none' }}>
                        ~
                        <Input
                            maxLength="21"
                            value={this.state.amountEnd}
                            onBlur={this.addZ}
                            onChange={(e)=>this.changeValue(e,1)}
                            className="search-item-common inputNumber"
                            defaultValue={1000}
                            min={0}
                        />
                    </div>
                    <div className="history-two">
                        记账时间
                        :
                        <RangePicker className="search-time-range"
                                     format={dateFormat}
                                     onChange={(moment, timeString) => this.rangePickerChange(moment, timeString, 1)}
                                     value = {this.state.jzsj}
                        />
                        银行入账时间 :
                        <RangePicker className="search-time-range"
                                     format={dateFormat}
                                     onChange={(moment, timeString) => this.rangePickerChange(moment, timeString, 2)}
                                     value = {this.state.rzsj}

                        />
                        <Button className="search-item-common" type="primary" shape="circle" onClick={() => {
                            this.setState({currentPage: 1},()=>{this.search(10, 1)});}} icon="search"/>

                        <p style={{marginLeft:100}} className={this.state.type==1? "click-history":"history-near"} onClick={() => this.monthClick(1)}>最近一个月 <span
                            className="history-bank-enter">(银行入账)</span></p>
                        <p className={this.state.type==2? "click-history":"history-near"} onClick={() => this.monthClick(2)}>最近三个月 <span
                            className="history-bank-enter">(银行入账)</span></p>
                        {/*<p className={this.state.type==3? "click-history":"history-near"} onClick={() => this.allClick(3)}>全部明细</p>*/}
                        <Button size="small" onClick={() => this.props.history.goBack()} className="back-btn" type="primary">返回</Button>
                        <Button size="small" title="导出" type="primary" shape="circle" icon="upload" onClick={this.download}/>
                    </div>
                </div>
                <div >
                    <Table className="common-margin15"
                           dataSource={this.state.dataSource}
                           columns={columns}
                           pagination={paginationOpt}/>
                </div>
                <Modal
                    wrapClassName="RowDetail"
                    width={600}
                    footer={null}
                    visible={this.state.RowDetail}
                    maskClosable={false}
                    onCancel={()=>this.setState({RowDetail:false})}
                >
                    <div  className="RowDetail">
                        <div className="title">交易详情</div>
                            <Row  className='content'>
                                <Col  span={12}>对方银行账户名称:{rowData.dcFlag=='借'?rowData.rcvBankName:rowData.payAccountName}</Col>
                                <Col  span={12}>对方银行账号:{rowData.dcFlag=='借'?rowData.rcvAccountNo:rowData.payAccountNo}</Col>
                                <Col  span={12}>借贷标识:{rowData.dcFlag}</Col>
                                <Col  span={12}>币种:{rowData.currency}</Col>
                                <Col  span={12}>附言:{rowData.postscript}</Col>
                                <Col  span={12}>摘要:{rowData.summary}</Col>
                                <Col  span={12}>用途:{rowData.purpose}</Col>
                            </Row>
                        <div className="title">记账详情</div>
                        <Row className='content'>
                            <Col span={12} ><span>结算订单号:{rowData.postscript}</span></Col>
                            <Col span={12} ><span>会计服务订单号:{rowData.busCode}</span></Col>
                            <Col span={12} ><span>会计凭证号:{rowData.voucherCode}</span></Col>
                            <Col span={12} ><span>业务类型:{rowData.businessType}</span></Col>
                            <Col span={12} ><span>记账日期:{rowData.accountTime}</span></Col>
                        </Row>
                        <div style={{textAlign:"center"}}>
                            <Button onClick={()=>this.setState({RowDetail:false})} type="primary">确认</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}


