import React, { Component } from 'react';
import { Table, Icon, Button, message } from "antd";
const { Column, ColumnGroup } = Table;

const ERROR_OK = '000000';

class BankBalanceTable extends Component {

  state = {
    url: '',
    columns: [],    // 表格列
    listData: [],   // 列表表格数据
    totalData: [],  // 汇总表格数据
    accomplished: false
  }

  // 导出逻辑
  exportUri = (type) => {
    const { url } = this.state;
    console.log(url)
    // type: 1为导出EXCEL，2为打印PDF
    switch (type) {
      case 1:
        window.open(encodeURI(`${AppConf.downloadPrefix + url}?downloadConfirm=1&constomFilename=资金对账汇总表`))
        break;
      case 2:
        window.open(encodeURI(`${AppConf.downloadPrefix + url}`));
        break;
    }
  }

  // 保存逻辑
  save = () => {
    this._saveAccountCheckTotal().then(res => {
      // 获取导出打印链接
      this._exportAccountCheckTotal();
      // 刷新父组件列表
      this.props.refresh();
    })
  }

  componentDidMount () {
    const { compName } = this.props;
    this._getList();
    this._getTotal();
    
    if (compName && compName === 'info') {
      this._exportAccountCheckTotal();
    }
  }

  // 表头
  _getColumns = () => {
    const { accountBankName, accountNumber, currencyName, currencyCode } = this.props.data.bankAccount;
    // len: 列表长度 未超过这个长度就是列表渲染，超过就是汇总表渲染
    const { listData } = this.state;
    const len = listData.length;
    const columns = [
      {
        title: `开户银行名称：${accountBankName}`,
        children: [
          {
            title: '日期',
            dataIndex: 'date',
            render: (value, row, index) => {
              const obj = { children: '', props: {}};
  
              if (index < len) {
                obj.children = value;
              } else {
                if (index === len) {
                  obj.children = '本期合计';
                  obj.props.rowSpan = 3; // 合计表格总行数
                } else {
                  obj.props.rowSpan = 0;
                }
              }
              
              return obj;
            }
          }, {
            title: '凭证号',
            dataIndex: 'voucherCode',
            render: (value, row, index) => {
              const obj = { children: '', props: {}};

              if (index < len) {
                obj.children = value;
              } else {
                obj.props.colSpan = 2;
                
                switch (index) {
                  case len:
                    obj.children = '未达账余额';
                    break;
                  case len + 1:
                    obj.children = '科目余额';
                    break;
                  case len + 2:
                    obj.children = '银行余额';
                    break;
                }
              }

              return obj;
            }
          }, {
            title: '交易序号',
            dataIndex: 'transactionNo',
            render: (value, row, index) => {
              const obj = { children: '', props: {}};

              if (index < len) {
                obj.children = value;
              } else {
                obj.props.colSpan = 0;
              }

              return obj;
            }
          }, {
            title: '银收账未收',
            dataIndex: 'bankCreditAmount',
            render: (value, row, index) => {
              const obj = { children: '', props: {}};

              if (index < len) {
                obj.children = value;
              } else {
                // 科目余额、银行余额列合并
                if (index > len) {
                  obj.props.colSpan = 2;
                }
                // 渲染字段
                switch (index) {
                  case len:
                    obj.children = row['bankCreditAmountSum'];
                    break;
                  case len + 1:
                    obj.children = row['r3SubjectBalance'];
                    break;
                  case len + 2:
                    obj.children = row['bankAccountBalance'];
                    break;
                }
              }

              return obj
            }
          }, {
            title: '银付账未付',
            dataIndex: 'bankDebitAmount',
            render: (value, row, index) => {
              const obj = { children: '', props: {}};

              if (index < len) {
                obj.children = value;
              } else {
                if (index > len) {
                  obj.props.colSpan = 0;
                }
                // 渲染字段
                if (index === len) {
                  obj.children = row['bankDebitAmountSum'];
                }
              }

              return obj
            }
          }
        ]
      }, {
        title: `开户账号：${accountNumber}`,
        children: [
          {
            title: '账收银未收',
            dataIndex: 'voucherDebitAmount',
            render: (value, row, index) => {
              const obj = { children: '', props: {}};

              if (index < len) {
                obj.children = value;
              } else {
                // 合并列
                if (index > len) {
                  obj.props.colSpan = 2;

                  switch (index) {
                    case len + 1:
                      obj.children = '调整后科目余额';
                      break;
                    case len + 2:
                      obj.children = '调整后银行余额';
                      break;
                  }
                }
                // 渲染字段
                if (index === len) {
                  obj.children = row['voucherDebitAmountSum'];
                }
              }

              return obj
            }
          }, {
            title: '账付银未付',
            dataIndex: 'voucherCreditAmount',
            render: (value, row, index) => {
              const obj = { children: '', props: {}};

              if (index < len) {
                obj.children = value;
              } else {
                // 合并列
                if (index > len) {
                  obj.props.colSpan = 0;
                }
                // 渲染字段
                if (index === len) {
                  obj.children = row['voucherCreditAmountSum'];
                }
              }

              return obj
            }
          }
        ]
      }, {
        title: `币种：${currencyName ? currencyName : currencyCode}`,
        children: [
          {
            title: '摘要',
            dataIndex: 'summary',
            render: (value, row, index) => {
              const obj = { children: '', props: {}};

              if (index < len) {
                obj.children = value;
              } else {
                // 合并列
                if (index > len) {
                  obj.props.colSpan = 2;
                }

                // 渲染字段
                switch (index) {
                  case len + 1:
                    obj.children = row['adjustSubjectBalance'];
                    break;
                
                  case len + 2:
                    obj.children = row['adjustBankAccountBalance'];
                    break;
                }
              }

              return obj;
            }
          }, {
            title: '附言',
            dataIndex: 'message',
            render: (value, row, index) => {
              const obj = { children: '', props: {}};

              if (index < len) {
                obj.children = value;
              } else {
                // 合并列
                if (index > len) {
                  obj.props.colSpan = 0;
                }
              }

              return obj;
            }
          }
        ]
      }, {
        title: `总账科目：银行科目`,
        children: [
          {
            title: '用途',
            dataIndex: 'usage',
            render: (value, row, index) => {
              const obj = { children: '', props: {}};
              
              if (index < len) {
                obj.children = value;
              } else {
                // 合并行
                if (index === len + 1) {
                  obj.children = '对账差额';
                  obj.props.rowSpan = 2;
                } else if (index === len + 2) {
                  obj.props.rowSpan = 0;
                }
              }

              return obj;
            }
          }, {
            title: '客户代码',
            dataIndex: 'khCode',
            render: (value, row, index) => {
              const obj = { children: '', props: {}};
              
              if (index < len) {
                obj.children = value;
              } else {
                // 合并行和列
                if (index === len + 1) {
                  obj.props.rowSpan = 2;
                  obj.props.colSpan = 2;
                  // 渲染字段
                  obj.children = row['reconciliationBalance'];
                } else if (index === len + 2) {
                  obj.props.rowSpan = 0;
                  obj.props.colSpan = 0;
                }
              }

              return obj;
            }
          }, {
            title: '分公司代码',
            dataIndex: 'compCode',
            render: (value, row, index) => {
              const obj = { children: '', props: {}};
              
              if (index < len) {
                obj.children = value;
              } else {
                if (index > len) {
                  obj.props.colSpan = 0;
                }
              }
              
              return obj;
            }
          }
        ]
      }
    ];

    return columns;
  }

  // 合计表格
  _getTotal = () => {
    const { 
      voucherCreditAmountSum,       // 未达账余额 - 账收银未付
      voucherDebitAmountSum,        // 未达账余额 - 账收银未收
      bankCreditAmountSum,          // 未达账余额 - 银收账未收
      bankDebitAmountSum,           // 未达账余额 - 银付账未付
      adjustBankAccountBalance,     // 调整后银行余额
      adjustSubjectBalance,         // 调整后科目余额
      bankAccountBalance,           // 银行余额
      r3SubjectBalance,             // 科目余额
      reconciliationBalance         // 对账差额
     } = this.props.data.sumInfo;

    /**
     * 构建汇总表格，为了与列表和表头的整体性，需要将两个表格合并成一个表格
     * 汇总表格总共三行，每一行数据对应一个列表中的object
     * 取得数据后需要对应写入
     */
    const totalData = [
      {
        key: 'totalData_row1',
        bankCreditAmountSum,
        bankDebitAmountSum,
        voucherDebitAmountSum,
        voucherCreditAmountSum
      }, {
        key: 'totalData_row2',
        r3SubjectBalance,
        adjustSubjectBalance,
        reconciliationBalance
      }, {
        key: 'totalData_row3',
        bankAccountBalance,
        adjustBankAccountBalance
      }
    ]

    this.setState({ totalData });
  }

  // 列表表格
  _getList = () => {
    const { infoList } = this.props.data;
    const listData = infoList.map((item, index) => {
      return {
        key: index, // 构建react需要的rowKey
        ...item
      }
    });

    this.setState({ listData });
  }

  // 完成按钮请求
  _saveAccountCheckTotal = () => {
    const { startDate, endDate, sumInfo } = this.props.data;
    const { accountId } = this.props.data.bankAccount;

    return new Promise((resolve) => {
      Util.comFetch({
        addr: 'saveAccountCheckTotal',
        accountId,
        startDate,
        endDate,
        data: JSON.stringify(sumInfo)
      }, res => {
        if (res.rspCode === ERROR_OK) {
          this.setState({ accomplished: true });
          message.success('保存成功');
          resolve();
        } else {
          message.warning(res.rspDesc);
        }
      })
    });
  }

  // 获取导出、打印链接请求
  _exportAccountCheckTotal = () => {
    const { startDate, endDate } = this.props.data;
    const { accountId } = this.props.data.bankAccount;

    Util.comFetch({
      addr: 'exportAccountCheckTotal',
      accountId,
      startDate,
      endDate
    }, res => {
      if (res.rspCode === ERROR_OK) {
        this.setState({ url: res.data.url });
      } else {
        message.warning(res.rspCode);
      }
    })
  }


  render () {
    const { listData, totalData, url, accomplished } = this.state;
    const dataSource = listData.concat(totalData);
    const columns = this._getColumns();

    return (
      <div className="table-bank-balance">
        <Table style={{tableLayout: 'fixed'}} 
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        >
        </Table>
        {
          this.props.showBtn
          ? (
            <div className="table-bank-balance__btns">
              {
                // 对账记录不显示完成按钮
                this.props.compName === 'info'
                ? ''
                : (
                    <Button type="primary" size="large"
                      disabled={accomplished}
                      onClick={this.save}
                    >
                      完成
                    </Button>
                  )
              }
              <Button type="primary" size="large" 
                onClick={this.exportUri.bind(this, 1)}
                disabled={!url}
              >
                导出
              </Button>
              <Button type="primary" size="large" 
                onClick={this.exportUri.bind(this, 2)}
                disabled={!url}
              >
                打印
              </Button>
            </div>
          )
          : ''
        }
      </div>
      
    )
  }
}

export default BankBalanceTable;
