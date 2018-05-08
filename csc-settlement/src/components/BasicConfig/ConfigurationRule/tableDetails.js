import  React from  "react";
import  {
    Button,
    Modal,
    Row,
    Col,
} from  "antd";
//添加规则的详情

import  "./tableDetails.scss";
import  DetailAdd  from  "./detailsAdd.js";

export  default class tableDetails  extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    };
    render(){
        return(
         <div>
             <Modal
                 wrapClassName="addConfig"
                 title="详情"
                 width={800}
                 footer={null}

                 closable={true}
                 onCancel={this.props.close}
                 visible={this.props.visible}
                 maskClosable={false}
             >
                 <Row  className="tableDetail">
                     <Col span={11}>
                         <div className="common-left">规则名字: <span>{this.props.tableDetail.name}</span></div>
                         <div className="common-left">收支对象:<span>{this.props.tableDetail.customerName}</span></div>
                         <div className="common-left">业务类型:<span>{this.props.tableDetail.busTypeName} </span></div>
                         {/*<div className="common-left">挂往来:<span>{this.props.tableDetail.handAccount==true?"是":"否"} </span></div>*/}
                         <div  style={{fontWeight:'500',fontSize:'16px' ,marginLeft:'5px'}}>付款方信息:</div>
                         <div className="common-left">开户行别:<span>{this.props.tableDetailBackCode}</span></div>
                         <div className="common-left">银行开户名称:<span>{this.props.tableDetail.pAccountName}</span></div>
                         <div className="common-left">银行开户账号:<span>{this.props.tableDetail.pAccountNumber} </span></div>
                     </Col>
                     <Col span={13}>
                         <div style={{marginLeft:"100px"}} className="common-right">规则定义:<span>{this.props.tableDetail.ruleDefineModel.name}</span></div>
                         <DetailAdd
                             DetailsData={this.props.tableDetail.ruleDefineModel}
                         />
                     </Col>
                 </Row>
                 {/*<div style={{width: 90, margin: "auto"}}>*/}
                     {/*<Button size="small"  onClick={this.props.close} type="primary">确认</Button>*/}
                 {/*</div>*/}
             </Modal>
         </div>
        )
    }
}
