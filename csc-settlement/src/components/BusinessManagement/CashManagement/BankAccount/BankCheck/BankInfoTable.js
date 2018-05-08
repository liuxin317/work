import React, { Component } from 'react';
import { Table, Tabs, Button, message } from 'antd';

const TabPane = Tabs.TabPane;

class BankInfoTable extends Component　{

  state = {
    compData: [],
    bankData: [],
    accountData: {},
    startDate: '',
    endDate:'',
    activeKey: '0', // 激活的tab面板， -1为余额调节表，0为未对账，1为已对账
    tableScroll: { x: true, y: 350 }
  }

  tabChange = (key) => {
    const { compData, bankData } = this.state;

    if (key !== '-1') {
      this.setState({ activeKey: key }, () => {
        this._getAccountCheckData({ type: Number(key) });
      })
    }
  }

  // 获取公司表头
  getCompColumns = () => {
    const { activeKey } = this.state;
    const columns = [
      {
        title: '凭证日期',
        dataIndex: 'occerTime',
        width: 120
      }, {
        title: '凭证号',
        dataIndex: 'voucherCode',
        width: 120
      }, {
        title: '已收金额',
        dataIndex: 'debitAmount',
        width: 100
      }, {
        title: '已付金额',
        dataIndex: 'creditAmount',
        width: 100
      }, {
        title: '摘要',
        dataIndex: 'summary'
      }
    ]

    if (activeKey === '1') { // 已对上状态
      columns.push(
        {
          title: '批次',
          dataIndex: 'batch',
          width: 50
        }
      );
    }

    return columns;
  }

  // 获取企业表头
  getBankColumns = () => {
    const { activeKey } = this.state;
    const columns = [
      {
        title: '日期',
        dataIndex: 'occerTime',
        width: 120
      }, {
        title: '交易序号',
        dataIndex: 'transactionNo',
        width: 120
      }, {
        title: '已收金额',
        dataIndex: 'creditAmount',
        width: 100
      }, {
        title: '已付金额',
        dataIndex: 'debitAmount',
        width: 100
      }, {
        title: '摘要',
        dataIndex: 'useScope'
      }
    ]

    if (activeKey === '1') { // 已对上状态
      columns.push(
        {
          title: '批次',
          dataIndex: 'batch',
          width: 50
        }
      );
    }

    return columns;
  }

  // 手工对账数据请求 type类型：0未对账 1已对账
  _getAccountCheckData = (params) => {
    const { checkId, startDate, endDate } = this.props.data;
    const obj = Object.assign({
      recordId: checkId,
      startDate,
      endDate,
    }, params);

    return new Promise((resolve) => {
      Util.comFetch({
        addr: 'getAccountCheckData',
        ...obj
      }, res => {
        const { accountList, voucherList, myAccount, startDate, entDate } = res.data;

        resolve(res);
        this.setState({ 
          compData: voucherList, 
          bankData: accountList, 
          accountData: myAccount,
          startDate,
          endDate: entDate
        });
      });
    });
  }

  render () {
    const { compData, bankData, accountData, tableScroll } = this.state;
    const { accountName, accountNumber } = accountData;

    return (
      <Tabs type="card" onChange={this.tabChange}>
        <TabPane tab="余额调节表" key="-1">{ this.props.children }</TabPane>
        <TabPane tab="未对上" key="0">
          <div className="bank-check-container">
            <div className="bank-check-table">
              <div className="bank-check-table__item">
                <p>　</p>
                <p>　</p>
                <Table rowKey="id" bordered size="middle"
                  columns={this.getCompColumns()}
                  dataSource={compData}
                  pagination={false}
                  scroll={tableScroll}
                >
                </Table>
              </div>
              <div className="bank-check-table__item">
                <p>开户户名：{accountName}</p>
                <p>开户账号：{accountNumber}</p>
                <Table rowKey="id" bordered size="middle"
                  columns={this.getBankColumns()}
                  dataSource={bankData}
                  pagination={false}
                  scroll={tableScroll}
                >
                </Table>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane tab="已对上" key="1">
          <div className="bank-check-container">
            <div className="bank-check-table">
              <div className="bank-check-table__item">
                <p>　</p>
                <p>　</p>
                <Table rowKey="id" bordered size="middle"
                  columns={this.getCompColumns()}
                  dataSource={compData}
                  pagination={false}
                  scroll={tableScroll}
                >
                </Table>
              </div>
              <div className="bank-check-table__item">
                <p>开户户名：{accountName}</p>
                <p>开户账号：{accountNumber}</p>
                <Table rowKey="id" bordered size="middle"
                  columns={this.getBankColumns()}
                  dataSource={bankData}
                  pagination={false}
                  scroll={tableScroll}
                >
                </Table>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    );
  }
}

export default BankInfoTable;
