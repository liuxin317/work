import React from 'react';
import {
    Modal,
    Input,
    InputNumber,
    Button
} from 'antd';
// import InputNumber from "antd/es/input-number/index.d";
class InstallmentRatio extends React.Component {
    constructor(props) {
        super(props);
        let valueList = [];
        if (this.props.ratio.length > 0&&this.props.ratio[0]!=="") {
            valueList = this.props.ratio;
        } else {
            for(let i=0;  i < this.props.instalmentCnt;  i++){
                valueList.push("")
            }
        }
        this.state = {
            valueList: valueList
        };
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.visible && !this.props.visible) {
    //         let valueList = [];
    //         nextProps.timeNo.forEach((item) => valueList.push(''));
    //         this.setState({valueList});
    //     }
    // }
    close = () => {
        this.props.close();
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

    // instalmentInterval

    /**
     * 比例输入框值改变事件处理
     * @param e
     * @param index
     */
    ratioV(value, index) {
        const valueList = this.state.valueList;
        this.setState({
            valueList: [...valueList.slice(0, index), value, ...valueList.slice(index + 1)]
        });
    }

    setRatio = () => {
        this.props.setRatio(this.state.valueList);
    };

    render() {
        const {timeNo, periodType, instalmentInterval} = this.props;
        const state = this.state;
        let children = this.state.valueList.map((v,i) => {
            return <div className="ratioSet-div" key={i}>
                        <span>{"第" + (i + 1) + '次付款:'}</span>
                        <InputNumber  max={100}  min={0} precision={0}
                                      style={{width: "80px"}}
                                      value={v}
                                      onChange={(value) => this.ratioV(value, i)}
                                      className="ratioSet-input"
                        />
                        %
                    </div>
        })
        return (
            <Modal
                wrapClassName="ratioSet"
                style={{top: "300px", left: 80}}
                width={400}
                footer={null}
                closable={false}
                visible={this.props.visible}
                maskClosable={false}
            >
                <div style={{display: instalmentInterval == "0" ? 'inline-block' : 'none'}}>
                    {
                        timeNo.map((v, i) => (
                            <div className="ratioSet-div" key={i}>
                                <span>{this.getLabel(periodType, v) + '付款:'}</span>
                                <InputNumber max={100} min={0} precision={0}
                                             style={{width: "80px"}}
                                             value={state.valueList[i]}
                                             onChange={(value) => this.ratioV(value, i)}
                                             className="ratioSet-input"
                                />
                                %
                            </div>
                        ))
                    }
                </div>
                <div style={{display: instalmentInterval !== "0" ? 'inline-block' : 'none'}}>{}
                    {
                       children
                    }
                </div>
                <div style={{width: 135, margin: "auto"}}>
                    <Button size="small" onClick={this.close} type="primary" style={{marginRight: "30px"}}>取消</Button>
                    <Button size="small" onClick={this.setRatio} type="primary">确认</Button>
                </div>
            </Modal>
        );
    }
}
export default InstallmentRatio;
