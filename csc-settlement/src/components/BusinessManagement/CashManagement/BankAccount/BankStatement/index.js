
import React, { Component } from 'react';
import InitialData from './../common/InitialData';

const menuName = '当前位置:银行余额初始化';
const amountType = 6;  // 5科目余额 6银行余额,
const initType = 1;    // 0科目余额 1银行余额

class BankStatement extends Component {

  render () {
    return (
      <InitialData menuName={menuName} amountType={amountType} initType={initType} />
    )
  }
  
}

export default BankStatement;
