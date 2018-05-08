import  React from  "react";
import  {
    Button,
    Select,
    InputNumber,
    message,
} from  "antd";
const Option = Select.Option;

export  default class CashPay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            pageNumber: 1,
            pageSize: 10,
            //银行数据
            getAccountData:[],
            accData: {},
            // 银行, 开户行名, 卡号
            bank: '',
            banks: [],
            subBank: '',
            subBanks: [],
            bankAcc: '',
            bankAccs: [],
            //付款天数
            latestPayDay:'0',

            CashId:'',

            dataSource:'',
        }
    };
    componentWillMount() {
        this.getAccount();
    }
    search = (pageSize, pageNumber) => {
        let requestParam = {};
        requestParam.addr = Api.getRuleConf;
        requestParam.pageSize = pageSize ? pageSize : this.state.pageSize;
        requestParam.pageNumber = pageNumber ? pageNumber : this.state.pageNumber;
        requestParam.handAccount = false;
        //获取用户信息
        Util.comFetch(requestParam, (data) => {
            console.log("table数据", data.id);
            //有长度就是编辑  没长度就是新增
            if (data.data.rows.length) {
                // this.state.getAccountData.map((v,i)=>{
                //     let  code=v.split(",")
                //     console.log("银行",code)
                //     if(data.data.rows[0].pBankCategoryCode==code[4]){
                //         this.setState({
                //             bank:code[0]
                //         })
                //     };
                // });
                this.setState({
                    CashId: data.data.rows[0].id,
                    dataSource: data.data.rows,
                    latestPayDay: data.data.rows[0].latestPayDay,
                    bank: data.data.rows[0].pBankCategoryName,
                    subBank: data.data.rows[0].pAccountName,
                    bankAcc:data.data.rows[0].pAccountNumber,
                });
            }else{
                //请求银行数据是否有默认账号
                Util.comFetch({
                    addr: Api.getPayerAccount
                },(re) => {
                    let reData = re.data;
                    reData.some((v,i)=>{
                        if(v.split(",")[5]=='1'){
                            let re=v.split(",")
                            this.setState({
                                bank: re[0],
                                subBank: re[3],
                                bankAcc:re[2],
                                isDefault:true,
                            })
                        }
                    });
                    if(!this.state.isDefault){
                        this.setState({
                            bank: '',
                            subBank: '',
                            bankAcc:'',
                        })
                    }
                });
            }
        });
    };
    // 获取付款方账户
    getAccount() {
        Util.comFetch({
            addr: Api.getPayerAccount
        }, (re) => {
            this.search();
            //转成银行-账户名-卡号的数据结构
            let reData = re.data;
            this.setState({
                getAccountData: re.data
            });
            let reDATA = [];
            reData.map((v, i) => {
                let reR = v.split(",");
                let reName = reR[3];
                reR[3] = reR[1];
                reR[1] = reName;
                reR = reR.toString();
                reDATA.push(reR);
            });
            // 后台返回的银行-支行-卡号数据是逗号分隔的字符串，用trans3LvlBankData转换为带层级的对象
            let accData = Util.trans3LvlBankData(reDATA);
            this.calcAccSelect(accData);
            this.setState({accData});
        });
    }

    // 付款方账户，银行-支行-卡号，根据选择的前一级，确定后级的数据
    calcAccSelect(data, bankSpec, subBankSpec) {
        const state = this.state;
        let bank = bankSpec || state.bank, subBank = subBankSpec || state.subBank, bankAcc = '', bankAccName = '';
        let banks = state.banks, subBanks = state.subBanks, bankAccs = state.bankAccs;

        if (!bankSpec) {
            banks = data;
            bank = banks[0].name;
            subBanks = banks[0].children;
            subBank = subBanks[0].name;
            bankAccs = subBanks[0].children;
            bankAcc = bankAccs[0].name;
            bankAccName = bankAccs[0].accName;
        } else if (!subBankSpec) {
            data.some((item) => {
                if (item.name === bankSpec) {
                    subBanks = item.children;
                    return true;
                }
            });
            subBank = subBanks[0].name;
            bankAccs = subBanks[0].children;
            bankAcc = bankAccs[0].name;
            bankAccName = bankAccs[0].accName;
        } else {
            subBanks.forEach((item) => {
                if (item.name === subBankSpec) {
                    bankAccs = item.children;
                    return true;
                }
            });
            bankAcc = bankAccs[0].name;
            bankAccName = bankAccs[0].accName;
        }
        this.setState({banks, bank, subBanks, subBank, bankAccs, bankAcc, bankAccName});
    };

    // 付款方选择银行， 需要重新设置支行和卡号
    bankChange = (value) => {
        this.setState({bank: value});
        this.calcAccSelect(this.state.accData, value);
    };
    // 付款方选择支行， 需要重新设置卡号
    subBankChange = (value) => {
        this.setState({subBank: value});
        this.calcAccSelect(this.state.accData, this.state.bank, value);
    };
    // 付款方选择卡号
    bankAccChange = (value) => {
        this.setState({bankAcc: value});
    };
    //延迟付款天数
    latestPayDay = (e) => {
        console.log("天数",e)
        this.setState({latestPayDay: e});
    };
    chkTime=()=>{
        if(this.state.latestPayDay=='0'){
            return true
        }
        else  if(this.state.latestPayDay !=='' && this.state.latestPayDay){
            return  true
        }else{
            message.error("请输入付款天数!")
            return  false
        }
    }
    //保存数据
    CashPayPost=()=>{
        let chkpass = this.chkTime();
        if (!chkpass) {
            return ;
        };
        let requestParam = {};
        let data = {};
        let  backCode="";
        this.state.getAccountData.map((v,i)=>{
            let  code=v.split(",")
            console.log("银行",code)
            if(this.state.bank==code[0]){
                backCode=code[4]
            };
        });

        if(this.state.dataSource.length){
            let Cash = {};
            let confs = [];
            Cash.id = this.state.CashId;
            confs.push(Cash);
            data.conf = confs;
        }
        else{
            data.handAccount = "false";
        }
        requestParam.addr = Api.saveRuleConf;
        data.pBankCategoryCode = backCode;
        data.pAccountName = this.state.subBank;
        data.pAccountNumber = this.state.bankAcc;
        data.latestPayDay = this.state.latestPayDay;
        requestParam.data = JSON.stringify(data);
        Util.comFetch(requestParam, (data) => {
               message.success("保存成功")
            }
        )
    };
    render() {
        const state = this.state;
        const props = this.props;
        const {bank, banks, subBank, subBanks, bankAcc, bankAccs} = this.state;
        return (
            <div className='CashPay' style={{width: '500px', height: '500px', margin: 'auto'}}>
                <div  style={{width: '500px', height: '300px'}}>
                    <div className="CashPayCommon">付款日期</div>
                    <div className="CashPayDate"><span style={{marginRight: '10px'}}>付款日期:</span>T+
                        <InputNumber min={0} max={99}
                                     value={this.state.latestPayDay}
                                     onChange={this.latestPayDay}
                        />日
                    </div>

                    <div className="CashPayCommon">付款方信息</div>
                    <div className="common-left">开户行行别:
                        <Select className="common-left-input" value={bank} style={{width: 200}}
                                onChange={this.bankChange}>
                            {banks.map((item, index) => {
                                return (<Option key={index} value={item.name}>{item.name}</Option>)
                            })}
                        </Select>
                    </div>
                    <div className="common-left">银行开户名称:
                        <Select className="common-left-input" value={subBank} style={{width: 200}}
                                onChange={this.subBankChange}>
                            {subBanks.map((item, index) => {
                                return (<Option key={index} value={item.name}>{item.name}</Option>)
                            })}
                        </Select>
                    </div>
                    <div className="common-left">银行开户账号:
                        <Select className="common-left-input" value={bankAcc} style={{width: 200}}
                                onChange={this.bankAccChange}>
                            {bankAccs.map((item, index) => {
                                return (<Option key={index} value={item.name}>{item.name}</Option>)
                            })}
                        </Select>
                    </div>
                </div>
                <div style={{display: 'block', textAlign: 'center'}}>
                    <Button onClick={this.CashPayPost} type="primary">保存</Button>
                </div>
            </div>
        )
    }
}
