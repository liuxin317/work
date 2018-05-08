import React, { Component } from 'react';
import InitialData from './../common/InitialData';

const menuName = '当前的位置:科目余额初始化';
const amountType = 5;  // 5科目余额 6银行余额,
const initType = 0;    // 0科目余额 1银行余额

class SubjectBalance extends Component {

  render () {
    return (
      <InitialData   menuName={menuName} amountType={amountType} initType={initType} />
    )
  }

}

export default SubjectBalance;
