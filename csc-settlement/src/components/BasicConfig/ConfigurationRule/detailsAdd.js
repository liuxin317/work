import  React from  "react";
import  {
    Radio,
    Input,
    DatePicker,
    Button,
    message,
    InputNumber,
    Modal,
    Table,
    Select,
    Checkbox,
    Row,
    Col,
    Popconfirm
} from  "antd";
import  "./detailAdd.scss";

const mouth= ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
export  default class detailsAdd  extends React.Component{
    constructor(props){
        super(props);
        this.state={
            TableIntervalDetailsVisible:false,
            TableRatioDetailsVisible:false,

            DetailsDataTimeNo:[],
            DetailsDataRatio:[],
                // this.props.DetailsData.timeNo.split(',')
        }
    };
    getLabel(periodType, index) {
        if (index == '0') {
            return '起算日';
        }
        switch (periodType) {
            case '1':
                return index + '月后';
            case '2':
                return index + '天后';
            case '3':
                return index + '年后';
            case '4':
                return index + '周后';
            default:
                return '';
        }
    }
    setDetails=()=>{
        this.setState({
            'TableRatioDetailsVisible': true,
            DetailsDataTimeNo:this.props.DetailsData.timeNo.split(",").sort((a, b) => (a - b)),
            DetailsDataRatio: this.props.DetailsData.ratio.split(","),
        })
    }

    render(){
        return(
            <div  className="details">
                {/*<div className="modal-name">规则名字:{this.props.DetailsData.name}</div>*/}
                <div className="modal-type">付款方式:&emsp; <span className="bg-font">{this.props.DetailsData.payMode}</span>&emsp;<span className="bg-font">{this.props.DetailsData.payChannel}</span></div>
                <div className="modal-limit">
                    付款额度:
                    <div  style={{display:"inline"}} className="modal-limit-full">
                        <span className="bg-font" >{this.props.DetailsData.payLimit}</span>
                        {/*<RadioGroup value={this.props.DetailsData.payLimit+""}>*/}
                            {/*<Radio className="bg-font" style={{display:this.props.DetailsData.payLimit+""  =="全款"?"inline-block":"none" }} value="全款">全款</Radio>*/}
                            {/*<Radio className="bg-font" style={{display:this.props.DetailsData.payLimit+""  =="分期"?"inline-block":"none" }}  value="分期">分期</Radio>*/}
                        {/*</RadioGroup>*/}
                    </div>
                    <div className="modal-limit-config"  style={{fontWeight:'bold',fontSize:'16px'}}>起算日配置:</div>
                    <div className="modal-limit-date">结算类型:<span className="bg-font">{this.props.DetailsData.settleType}</span> </div>
                    <div className="modal-limit-day"
                         style={{display: this.props.DetailsData.settleType == "月结" ? "inline-block" : "none"}}>
                        月结起始日:<span className="bg-font">{this.props.DetailsData.settleBeginDay}</span> </div>
                    <div className="modal-limit-number">
                        延期付款天数:<span className="bg-font">{this.props.DetailsData.latestPayDay}日</span>
                    </div>
                    <div style={{display: this.props.DetailsData.payLimit+"" == "分期" ? "inline-block" : "none"}}
                         className="modal-limit-config" > <span style={{fontWeight:'bold',fontSize:'16px'}}>分期规则配置:</span>
                        <div className="modal-limit-time">分期次数:<span className="bg-font"> {this.props.DetailsData.instalmentCnt} </span> </div>
                        <div className="modal-limit-interval">分期间隔:<span className="bg-font">{this.props.DetailsData.instalmentInterval}</span>
                    <p className="modal-limit-interval-set"
                               style={{display: this.props.DetailsData.instalmentInterval == "自定义" ? "inline-block" : "none"}}>&emsp;
                                <span onClick={() => this.setState({'TableIntervalDetailsVisible': true})}  className="details">详情</span>
                            </p>
                        </div>
                        <div className="modal-limit-ratio">分期比例:<span className="bg-font">{this.props.DetailsData.instalmentRatio}</span>
                            <p className="modal-limit-ratio-set"
                               style={{display: this.props.DetailsData.instalmentRatio == "自定义" ? "inline-block" : "none"}}>&emsp;
                                <span onClick={()=>this.setDetails()} className="details">详情</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/*table分期间隔详情*/}
                <Modal
                    wrapClassName="intervalDetailsVisible"
                    style={{top: 300, left: 80}}
                    width={400}
                    footer={null}
                    closable={false}
                    visible={this.state.TableIntervalDetailsVisible}
                    maskClosable={false}
                >
                    <RadioGroup value={ this.props.DetailsData.instalmentIntervalType+""} size="large"   >
                        <RadioButton value="1">月</RadioButton>
                        <RadioButton value="4">周</RadioButton>
                        <RadioButton value="2">天</RadioButton>
                        <RadioButton value="3">年</RadioButton>
                    </RadioGroup>
                    <div>
                        <div style={{display: this.props.DetailsData.instalmentIntervalType == "1"? "inline-block" : "none"}}>
                            <Checkbox.Group
                                value={this.props.DetailsData.timeNo}
                                disable="true">
                                <Row><Col className="checkboxStyle" span={24}><Checkbox value="0">起算日</Checkbox></Col></Row>
                                <Row>
                                    {mouth.map((v, index) => <Col className="checkboxStyle" span={8}><Checkbox
                                        value={v}>{v}月后</Checkbox></Col>)}
                                </Row>
                            </Checkbox.Group>
                        </div>
                        <div style={{display: this.props.DetailsData.instalmentIntervalType == "4" ? "inline-block" : "none"}}>
                            <Checkbox.Group
                                value={this.props.DetailsData.timeNo}>
                                <Row><Col className="checkboxStyle" span={24}><Checkbox value="0">起算日</Checkbox></Col></Row>
                                <Row>
                                    {mouth.map((v, index) => <Col className="checkboxStyle" span={8}><Checkbox
                                        value={v}>{v}周后</Checkbox></Col>)}
                                </Row>
                            </Checkbox.Group>
                        </div>
                        <div style={{display: this.props.DetailsData.instalmentIntervalType == "2" ? "inline-block" : "none"}}>
                            <Checkbox.Group
                                value={this.props.DetailsData.timeNo}>
                                <Row><Col className="checkboxStyle" span={24}><Checkbox value="0">起算日</Checkbox></Col></Row>
                                <Row>
                                    {mouth.map((v, index) => <Col className="checkboxStyle" span={8}><Checkbox
                                        value={v}>{v}日后</Checkbox></Col>)}
                                </Row>
                            </Checkbox.Group>
                        </div>
                        <div style={{display: this.props.DetailsData.instalmentIntervalType == "3" ? "inline-block" : "none"}}>
                            <Checkbox.Group
                                value={this.props.DetailsData.timeNo}>
                                <Row><Col className="checkboxStyle" span={24}><Checkbox value="0"  >起算日</Checkbox></Col></Row>
                                <Row>
                                    {mouth.map((v, index) => <Col className="checkboxStyle" span={8}><Checkbox
                                        value={v}>{v}年后</Checkbox></Col>)}
                                </Row>
                            </Checkbox.Group>
                        </div>
                    </div>
                    <div style={{textAlign:"center" ,marginTop:"10px"}}>
                        <Button size="small"  onClick={() => this.setState({'TableIntervalDetailsVisible': false})} type="primary">确认</Button>
                    </div>
                </Modal>
                {/*table比例详情*/}
                <Modal
                    wrapClassName="ratioSet"
                    style={{top: "300px", left: 80}}
                    width={400}
                    footer={null}
                    closable={false}
                    visible={this.state.TableRatioDetailsVisible}
                    maskClosable={false}
                >
                    <div style={{display: this.props.DetailsData.instalmentInterval == "自定义" ? 'inline-block' : 'none'}}>
                        {
                            this.state.DetailsDataTimeNo.map((v, i) => (
                                <div className="ratioSet-div" key={i}>
                                    <span>{this.getLabel(this.props.DetailsData.instalmentIntervalType+"", v) + '付款:'}</span>
                                    <span>{this.state.DetailsDataRatio[i]}</span>%
                                </div>
                            ))
                        }
                    </div>
                    <div style={{display: this.props.DetailsData.instalmentInterval !== "自定义" ? 'inline-block' : 'none'}}>
                        {
                            this.state.DetailsDataRatio.map((v, i) => (
                                <div className="ratioSet-div" key={i}>
                                    <span>{ "第"+(i+1)+ '次付款:'}</span>
                                    <span>{v}</span> %
                                </div>
                            ))
                        }
                    </div>
                    <div style={{textAlign:"center"}}>
                        <Button size="small"  onClick={() => this.setState({'TableRatioDetailsVisible': false})} type="primary">确认</Button>
                    </div>
                </Modal>
            </div>
        )
    }

}