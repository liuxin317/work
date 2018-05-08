import  React from  "react";
import  {
    Button,
    Modal,
    Radio,
    Row,
    Col,
} from  "antd";
//规则冲突
import  "./ruleConflict.scss";
const RadioGroup = Radio.Group;

// 规则冲突弹框组件
export default class RuleConflict extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choiceConflict: false,
            ConflictDetail: false,
            choiceConfig: "0",
            // 每个冲突规则的处理方式,0 跳过 1 采用我的
            choices: [],
        }
    };

    //选择规则
    choiceConfig = (e, index) => {
        let choices = this.state.choices.slice();
        choices[index] = e.target.value;
        this.setState({choices});
    };

    //替换所有冲突规则配置,将原冲突配置的id放到新的配置里面
    replaceRuleAll = () => {
        const {postData, conflictData} = this.props;
        let conf = postData.conf.slice();

        conf.forEach((item, index) => {
            conflictData.some((itemC, indexC) => {
                if (
                    item.customerName === itemC.old.customerName &&
                    item.busTypeName === itemC.old.busTypeName
                ) {
                    let confItem = Object.assign({}, conf[index]);
                    confItem.id = itemC.old.id;
                    conf.splice(index, 1, confItem);
                    return true;
                }
            });
        });
        this.props.RuleConflictClose();
        this.props.conflictSolved(conf);

    };
    // 跳过所有冲突的规则配置
    jumpAll = () => {
        const {postData, conflictData} = this.props;
        let conf = postData.conf.slice();
        let noConfictConf = [];

        conf.forEach((item, index) => {
            let isConflict = false;
            isConflict = conflictData.some((itemC, indexC) => {
                if (
                    item.customerName === itemC.old.customerName &&
                    item.busTypeName === itemC.old.busTypeName
                ) {
                    return true;
                }
            });
            if (!isConflict) {
                noConfictConf.push(item);
            }
        });
        this.props.RuleConflictClose();
        this.props.conflictSolved(noConfictConf);
    };

    userSelConfirm = () => {

        const {postData, conflictData} = this.props;
        const {choices} = this.state;
        let conf = postData.conf.slice();
        let noConfictConf = [];

        conf.forEach((item, index) => {
            let isConflict = false;

            isConflict = conflictData.some((itemC, indexC) => {
                if (
                    item.customerName === itemC.old.customerName &&
                    item.busTypeName === itemC.old.busTypeName
                ) {
                    if (choices[indexC] === '1') {
                        let confItem = Object.assign({}, item);
                        confItem.id = itemC.old.id;
                        noConfictConf.push(confItem);
                    }
                    return true;
                }
            });
            if (!isConflict) {
                noConfictConf.push(item)
            }
        });
        this.setState({
            choiceConflict: false
        })
        this.props.RuleConflictClose();
        this.props.conflictSolved(noConfictConf);
    }

    getConflictItem() {
        const radioStyle = {
            display: 'block',
            height: 'auto',
            lineHeight: '30px',
        };
        let Conflict = this.props.conflictData.map((v, i) => {
            return (
                <div key={i} value={i}>
                    <RadioGroup defaultValue={this.state.choiceConfig} onChange={(e) => {
                        this.choiceConfig(e, i)
                    }}>
                        <Radio style={radioStyle} value="0">原规则配置:
                            <div>
                                <span className="radio-span">冲突主体:&emsp;{v.old.customerName}</span><span
                                className="radio-span">{v.old.busTypeName}</span><div
                                className="radio-span">使用规则:&emsp;{v.old.ruleDefine.name}</div>
                            </div>
                        </Radio>
                        <Radio style={radioStyle} value="1">现规则配置:
                            <div>
                                <span className="radio-span">冲突主体:&emsp;{v.now.customerName}</span><span
                                className="radio-span">{v.now.busTypeName}</span><div
                                className="radio-span">使用规则:&emsp;{this.props.postDataRuleDefine}</div>
                            </div>
                        </Radio>
                    </RadioGroup>
                </div>
            );
        });
        return Conflict;
    }

    // 设置让用户自己选择弹窗显示
    setUserSel = () => {
        let choices = this.props.conflictData.map((item, index) => {
            return '0'
        });
        this.setState({
            choiceConflict: true,
            choices: choices
        });
    }
    render() {
        let {conflictData, psotData, postDataRuleDefine, postData} = this.props;

        let Conflict = this.getConflictItem();
        const radioStyle = {
            display: 'block',
            height: 'auto',
            lineHeight: '30px',
        };
        return (
            <div>
                <Modal
                    wrapClassName="RuleConflict"
                    width={400}
                    footer={null}
                    closable={true}
                    onCancel={this.props.RuleConflictClose}
                    visible={this.props.visible}
                    maskClosable={false}
                >
                    <div>
                        <div className="ConflictNum">规则配置出现冲突(共计{this.props.conflictData.length}条冲突)
                            <span style={{marginLeft:'10px',color:"#0066FF",cursor:"pointer",display:"inline-block",fontSize:"small"}} onClick={()=>this.setState({ConflictDetail:true})}>详情</span>
                        </div>
                        <Button onClick={this.replaceRuleAll} className="Conflict-input" type="primary">替换原规则配置</Button>
                        <Button onClick={this.jumpAll} className="Conflict-input" type="primary">跳过规则配置</Button>
                        <Button onClick={this.setUserSel} className="Conflict-input"
                                type="primary">让我决定每个规则配置</Button>
                    </div>
                </Modal>{
                this.state.choiceConflict &&
                <Modal
                    wrapClassName="choiceConflict"
                    width={500}
                    footer={null}
                    closable={false}
                    visible={this.state.choiceConflict}
                    maskClosable={false}
                >
                    <div>
                        {Conflict}
                    </div>
                    <Button size="small" onClick={() => this.setState({choiceConflict: false,choiceConfig:"0"})}
                            type="primary" style={{marginLeft: "140px"}}>取消</Button>
                    <Button size="small" style={{marginLeft: "80px"}} onClick={this.userSelConfirm}
                            type="primary">确认</Button>
                </Modal>  }
                <Modal

                    width={500}
                    footer={null}
                    closable={false}
                    visible={this.state.ConflictDetail}
                    maskClosable={false}
                >
                    <div>{
                        this.props.conflictData.map((v, i) =>
                            <div key={i} value={i}>
                                <RadioGroup value="0">
                                    <Radio style={radioStyle} value="0">原规则配置:
                                        <div>
                                            <span className="radio-span">冲突主体:&emsp;{v.old.customerName}</span><span
                                            className="radio-span">{v.old.busTypeName}</span><div
                                            className="radio-span">使用规则:&emsp;{v.old.ruleDefine.name}</div>
                                        </div>
                                    </Radio>
                                    <Radio style={radioStyle} value="1">现规则配置:
                                        <div>
                                            <span className="radio-span">冲突主体:&emsp;{v.now.customerName}</span><span
                                            className="radio-span">{v.now.busTypeName}</span><div
                                            className="radio-span">使用规则:&emsp;{this.props.postDataRuleDefine}</div>
                                        </div>
                                    </Radio>
                                </RadioGroup>
                            </div>
                        )}
                    </div>
                    <Button size="small" onClick={() => this.setState({ConflictDetail: false})}
                            type="primary" style={{marginLeft: "200px"}}>确定</Button>
                </Modal>
            </div>
        )
    }
}
