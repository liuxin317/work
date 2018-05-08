import React from 'react';
import { Row, Col, Tag, Popconfirm, Modal,Tooltip  } from 'antd';
import './style.scss';
import BankImgData from '../../../../constants/bankImgData';
import PropTypes from 'prop-types';
import BIN from 'bankcardinfo';

const confirm = Modal.confirm;

//我的账户

export default class Card extends React.Component {
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
        if (this.props.cardData.accountNumber !== prevProps.cardData.accountNumber) {
            this.getCardPic();
        }
    }

    getCardPic = () => {
        console.log('card组件', 'componentDidmount');
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

    //1 删除,2 设置为默认账户
    showDeleteConfirm = (type, cardData) => {
        let self = this;
        confirm({
            title: '提示',
            content: type === 1 ? "确认删除账户?" : "确认设置为默认账户?",
            onOk() {
                if (type === 1) {
                    self.props.cardCallBack('delete', cardData);
                }
                else {
                    self.props.cardCallBack('setDefault', cardData);
                }
            }
        });
    };
    render() {
        let cardData = this.props.cardData;
        let cls = cardData.defaultFlag ? 'card default-card' : 'card';
        return (
            <div className={cls}
                 style={{ width: this.props.width, height: this.props.height }}>
                <Row>
                    <Col span={10} className="card-logo">
                        <span className={`bank-image ${this.state.bankImageClass}`}></span>
                    </Col>
                    <Col span={8} className="card-tag">
                        <Tag color="#99ccff" className="fr">{cardData.accountTypeName}</Tag>
                    </Col>
                    <Col span={6} className="card-tag">
                        <Tag color="#23b8f6" className="fr">{cardData.currencyName}</Tag>
                    </Col>
                </Row>

                <Row className="common-div-style">
                    <Col span={16}>
                        <span  style={{"wordWrap":"break-word"}}> {cardData.accountName}</span>
                    </Col>
                    <Col span={8} className="tail">
                        <span  title={cardData.accountNumber}>尾号: {cardData.accountNumber.substr(cardData.accountNumber.length - 4)}</span>
                    </Col>
                </Row>

                <Row className="common-div-style">
                    <Col span={24}>
                        <div style={{ height: '30px'}}>
                          {
                            cardData.payChannelJson && cardData.payChannelJson.map((item, index) =>
                              <span className="channel" key={index}>{item.value}</span>
                            )
                          }
                        </div>
                    </Col>
                </Row>

                <Row className="common-div-style">
                    <Col span={6}> </Col>
                    <Col span={18}>
                        <a className="float-right  editItem "
                           onClick={() => this.showDeleteConfirm(2, cardData)}
                           href="javascript:void(0)">设置为默认账户</a>

                        <a href="javascript:void(0)"
                           onClick={() => this.showDeleteConfirm(1, cardData)}
                           className="float-right  editItem">删除</a>

                        <a onClick={() => this.props.cardCallBack('edit', cardData)} href="javascript:void(0)"
                           className="float-right  editItem">修改</a>
                    </Col>
                </Row>
            </div>
        )
    }
}

Card.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    cardData: PropTypes.object.isRequired,
};

Card.defaultProps = {
    height: 180,
    width: 330,
};

