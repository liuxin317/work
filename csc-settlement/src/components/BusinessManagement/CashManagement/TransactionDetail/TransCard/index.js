import React from 'react';
import { Row, Col, Tag,Tooltip } from 'antd';
import './style.scss';
import BankImgData from '../../../../../constants/bankImgData';
import PropTypes from 'prop-types';
import BIN from 'bankcardinfo';
//我的账户

export default class TransCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'bankImageClass': '',
    };
  }

  componentDidMount() {
      this.getCardPic();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.cardData.bankCategoryName !== this.props.cardData.bankCategoryName) {
      this.getCardPic();
    }
  }

  getCardPic=()=>{
      let cardData = this.props.cardData;
      let self = this;
      //从配置文件里面去取出银行图片的class,class 对应了图片的position
      let bankImageClass = BankImgData[cardData.bankCategoryName];
      //如果配置文件没有配置
      if (!bankImageClass) {
          BIN.getBankBin(cardData.accountNumber)
              .then(function (data) {
                  //data 取到的CIB 大小 标示,要弄成这种bank-cib
                  let style = 'bank-' + data.bankCode.toLowerCase();
                  self.setState({ 'bankImageClass': style });
              })
              .catch(function (err) {
                  console.log('识别银行卡卡号错误:', err);
              })
      } else {
          this.setState({ 'bankImageClass': bankImageClass });
      }
  };

  render() {
    let cardData = this.props.cardData;
    return (
      <div className="card"
           style={{ width: this.props.width, height: this.props.height }}>
        <Row>
          <Col span={10}>
            <span className={`bank-image ${this.state.bankImageClass}`}></span>
          </Col>
          <Col span={8} className="card-tag">
            <Tag color="#23b8f6" className="float-right">{cardData.accountTypeName}</Tag>
          </Col>
          <Col span={6} className="card-tag">
            <Tag color="#fa5f5f" className="float-right">{cardData.currencyName}</Tag>
          </Col>
        </Row>
        <Row className="common-div-style">
          <Col span={16}>
            <span>{cardData.companyName}</span>
          </Col>
          <Col span={8}>
            <span title={cardData.accountNumber} >尾号: {cardData.accountNumber.substr(cardData.accountNumber.length - 4)}</span>
          </Col>
        </Row>
        <Row className="common-div-style">
          <Col span={24}>
            <span>账面余额:{cardData.paperAmount}</span>
          </Col>
        </Row>
        <Row className="common-div-style">
          <Col span={24}>
            <span>可用余额:{cardData.usableAmount}</span>
          </Col>
        </Row>
        <Row className="common-div-style" style={{position: 'absolute',right:'14px', bottom: '14px'}}>
          <Col span={24}>
            <a onClick={() => this.props.cardCallBack(cardData)} href="javascript:void(0)"
               className="trans-more-a">交易明细</a>
          </Col>
        </Row>
      </div>
    )
  }
}

TransCard.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  cardData: PropTypes.object.isRequired,
  cardCallBack: PropTypes.func.isRequired
};

TransCard.defaultProps = {
  height: 180,
  width: 330,
};

