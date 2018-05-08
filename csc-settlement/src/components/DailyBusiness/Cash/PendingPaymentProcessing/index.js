import React from 'react';
import { Button, Radio, Input, DatePicker, Select, Table, message, Modal } from 'antd';
import SearchConditon from './SearchCondition';
import PayDialog from './PayDialog';
// import SendBackDialog from '../common/SendBackDialog';
import ReturnDialog from './ReturnDialog';
import ListDetails from '../../../common/ListDetails';
import TopayTable from './TopayTable';
import FundAllocationTable from './FundAllocationTable';
import BatchFreezeDialog from '../common/BatchFreezeDialog';
import BatchEditDialog from '../common/BatchEditDialog';

// 注：每个标签类型的table单独写一个组件，是因为一开始每种table显示的行和操作都不一样。
// 但是随着后来的调整逐渐趋于相同。


import './style.scss';

const { RangePicker } = DatePicker;

const downloadPrefix = window.location.host.indexOf('localhost') > -1 ?
  'http://test.changhong.com/download/' :
  window.location.protocol + '//' + window.location.host + '/download/';

// 待支付页面
class PendingPaymentProcessing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      info: '待支付处理',
      // 顶部选中的标签
      tab: '0',
      // 表格数据
      tableData: [],
      // 表格数据总条数
      tableDataTotal: 0,
      // 币种下拉选框数据
      currencyList: [],
      // 当前页码
      page: 1,
      // 每页条数
      pageSize: 10,
      // 表格排序数据
      sorterData: {},
      // 查询参数，包含查询条件筛选栏的参数，不包括页码和订单类型
      searchParam: {},
      // 显示支付弹框
      showPay: false,
      // 点击表格支付按钮，待支付的订单数据
      payOrderData: {},
      // 点击表格退回按钮，待退回的订单数据
      sbOrderData: {},
      // 显示退回弹窗
      showSendBack: false,
      // 表格中选中行的序号
      selRows: [],
      // 批量支付标志
      multiFlag: false,
      // 显示详情弹框
      showDetail: false,
      // 详情数据
      detailData: {},
      //变更记录
      changeDetail:'',
      //变更日志
      ChangeLog:[],
      // 当前处理的一条数据的来源，''普通订单, 'fund'资金调拨
      source: '',
      batchFreezeVisible: false, //批量冻结弹框
      batchFreezeData: [], //批量冻结处理的数据
      batchEditVisible: false, //批量编辑弹框
      batchEditData: [], //批量编辑处理的数据
    };
  }

  componentDidMount() {
    this.getCurrency();
    this.getTableData(1);
  }

  /**
   * 获取表格数据
   * @param page 页码，可以在参数中指定，未指定时使用state中的页码
   * @param param 搜索参数
   */
  getTableData(page, param, sorterData) {
    let sendParam = Object.assign({}, param);
    const state = this.state;
    sendParam.pageNumber = page || state.page;
    sendParam.pageSize = sendParam.pageSize || state.pageSize;
    sendParam.addr = Api.orders;
    sendParam.state = sendParam.state || state.tab;
    // 99表示全部，全部用逗号分开，如果全部时订单类型下拉框选择了类型，使用该类型
    if (sendParam.state == 99) {
      if (sendParam.orderState) {
        sendParam.state = sendParam.orderState;
      } else {
        sendParam.state = '0,1,2,3,4,5,6,7,8,9';
      }
    }
    const sort = sorterData || state.sorterData;
    // 列排序参数
    if (sort && sort.sortType) {
      sendParam.sortType = sort.sortType;
      sendParam.direction = sort.direction;
    }

    // 资金调拨调用另一个接口
    if (sendParam.state === '1') {
      let tmp = {};
      tmp.addr = 'getFundTransferList';
      tmp.state = 2;
      tmp.pageNumber = sendParam.pageNumber;
      tmp.pageSize = sendParam.pageSize;
      tmp.startTime = sendParam.startCreatedTime || '';
      tmp.endTime = sendParam.endCreatedTime || '';
      tmp.receiveAccount = sendParam.keyword || '';

      // 金额，币种，预支付时间
      tmp.restriction = sendParam.restriction;
      tmp.startAmount = sendParam.startAmount;
      tmp.endAmount = sendParam.endAmount;
      tmp.currencyCode = sendParam.currencyCode;
      tmp.startPrePayTime = sendParam.startPrePayTime;
      tmp.endPrePayTime = sendParam.endPrePayTime;
      sendParam = tmp;
    }

    Util.comFetch(sendParam, (re)=>{
      let rows = sendParam.addr === 'getFundTransferList' ? re.rows : re.data.rows;

      // // test
      // if (rows.length === 0) {
      //   // 待支付
      //   // re.data.total = 1;
      //   // rows = [{"acAccountNumberFlag":0,"accountNumberFlag":0,"amount":0.51,"amountFlag":0,"busCode":"yysh-504","busTypeId":0,"clearingCode":"yysh-504","code":"JYJ00618011800003","companyCode":"YJ00","companyId":128,"createdTime":"2018-01-18","customerName":"支付宝","delFlag":false,"exceptionCode":"101","expiredPrePayTime":0,"freeze":false,"handAccount":false,"id":8433,"immediate":true,"initAmount":0.51,"initState":"WAITCHECK","modifiedTime":"2018-01-18","orgCode":"010040003","prePayTimeFlag":0,"purpose":"娱乐消费","remark":"往来对象未在往来账户维护","sourceCode":"6","sourceName":"云游系统","state":"ABNORMAL","tenantId":5,"version":0}];
      //   // 资金调拨
      //   re.total = 1;
      //   rows = [{
      //     "amount": 2020,
      //     "amoutStr": "2020.0",
      //     "delFlag": 0,
      //     "freeze": 0,
      //     "id": 51,
      //     "immediate": 1,
      //     "orderCode": "JGF00618011000003",
      //     "payAccount": "28340120000000119",
      //     "payAccountName": "拉开距离客家话可交换空间",
      //     "payId": 1035,
      //     "prePayTime": "2018-01-10 17:14:12.0",
      //     "realPayTime": "2018-01-10 17:14:12.0",
      //     "receiveAccount": "66666666666666",
      //     "receiveAccountName": "6666666666666",
      //     "receiveId": 1021,
      //     "state": 2
      //   }];
      // }

      rows.forEach((item, index) => {
        item.key = index;
        item.acAccount = item.acAccount || {};
      });
      this.setState({
        tableData: rows,
        tableDataTotal: sendParam.addr === 'getFundTransferList' ? re.total : re.data.total
      });
    });

    // mock数据
    // Util.comFetch(sendParam, (re)=>{
    //   let rows = re.data.rows;
    //   rows.forEach((item, index) => item.key = index);
    //   this.setState({
    //     tableData: rows,
    //     tableDataTotal: re.data.total
    //   });
    // }, null, {method: 'get'}, '/json/orders.json');

  }

  // 获取币种下拉框数据
  getCurrency() {
    Util.comFetch({
      addr: Api.getDropdownList,
      dictType: 'sett_currency '
    }, re => {
      let rows = re.data.rows;
      rows.forEach((item) => {
        item.label = item.dictName;
        item.key = item.dictId + '';
      });
      rows.unshift({label: '全部币种', key: ''});
      this.setState({
        currencyList: rows
      });
    });
  }

  /**
   * 点击搜索按钮，保存最新条件参数作为跳页时搜索条件，重新加载第一页数据
   * @param searchParam 搜索条件
   */
  search = (searchParam) => {
    this.setState({searchParam: searchParam, page: 1});
    this.getTableData(1, searchParam);
  }

  /**
   * 点击导出按钮，使用最新条件参数(不保存)，导出数据
   * @param searchParam
   */
  exportData = (searchParam) => {
    let sendParam = Object.assign({}, searchParam);
    sendParam.pageNumber = 1;
    sendParam.pageSize = 10000;
    sendParam.addr = Api.export;
    sendParam.state = sendParam.state || this.state.tab;
    // 99表示全部，全部用逗号分开，如果全部时订单类型下拉框选择了类型，使用该类型
    if (sendParam.state == 99) {
      if (sendParam.orderState) {
        sendParam.state = sendParam.orderState;
      } else {
        sendParam.state = '0,1,2,3,4,5,6,7,8,9';
      }
    }
    const sort = this.state.sorterData;
    // 列排序参数
    if (sort && sort.sortType) {
      sendParam.sortType = sort.sortType;
      sendParam.direction = sort.direction;
    }
    Util.comFetch(sendParam, (re) => {
      document.getElementById('download_iframe').src = downloadPrefix + re.data;
      // if(re.data.rows.total){ message.error("导出数据过多")}
    });
  }

  /**
   * 跳转表格页码
   * @param page 页码，必须
   * @param size 每页条数，可选，在切换每页显示多少条之后跳转页面时传入
   */
  skipPage = (page, size, sorter) => {
    const { searchParam, pageSize, sorterData } = this.state;
    // 跳页时，查询参数可能带上sort信息
    let sData = {};
    if (sorter && sorter.columnKey) {
      sData = {
        sortType: sorter.columnKey,
        direction: sorter.order === 'ascend' ? 'ASC' : 'DESC'
      };
    } else {
      sData = sorterData;
    }
    this.setState({
      tableData: [],
      tableDataTotal: 0,
      page: page,
      pageSize: size || pageSize,
      sorterData: sData
    });
    this.getTableData(page, searchParam, sData);
  }

  /**
   * 根据顶部tab标签的值，获取显示的table表格
   * @returns {*}
   */
  getTableView() {
    const { tab, tableData, tableDataTotal, page, selRows } = this.state;
    switch (tab) {
      case '0':
        return (<TopayTable
          page={this.state.page}
          selRowsUpdate={this.selRowsUpdate}
          selRows={selRows}
          setPay={this.setPay}
          setSendBack={this.setSendBack}
          current={page}
          skipPage={this.skipPage}
          toggleFreeze={this.toggleFreeze}
          showDetail={this.showDetail}
          data={tableData}
          total={tableDataTotal} />);
      case '1':
        return (
          <FundAllocationTable
            page={this.state.page}
            selRowsUpdate={this.selRowsUpdate}
            selRows={selRows}
            setPay={this.setPay}
            setSendBack={this.setSendBack}
            current={page}
            skipPage={this.skipPage}
            toggleFreeze={this.toggleFreezeFund}
            showDetail={this.showDetail}
            data={tableData}
            total={tableDataTotal} />
        );
      default:
        return null;
    }
  }

  /**
   * 处理顶部标签切换
   * @param e
   */
  handleTabChange = (e) => {
    let state = e.target.value;
    this.setState({
      tab: state,
      tableData: [],
      tableDataTotal: 0,
      searchParam: {},
      selRows: [],
      sorterData: {}
    });
    this.getTableData(1, {state: state});
  };

  /**
   * 设置支付弹框
   * @param data 点击支付按钮的订单行数据
   */
  setPay = (data) => {
    if (data.freeze) {
      Modal.warning({
        title: '提示',
        content: '已冻结订单不能支付'
      });
      return ;
    }
    this.setState({
      payOrderData: data,
      showPay: true
    });
  }

  /**
   * 设置支付弹框显示/隐藏
   * @param isVisible 显示 true或隐藏 false
   */
  chgPayVisible = (isVisible) => {
    let obj = {showPay: isVisible};
    // 关闭支付框时，取消可能设置了的multiFlag
    if (!isVisible) {
      obj['multiFlag'] = false;
    }
    this.setState(obj);
  }

  /**
   * 设置退回弹框
   * @param data 点击支付按钮的订单行数据
   */
  setSendBack = (data, source) => {
    this.setState({
      sbOrderData: data,
      showSendBack: true,
      source: source || '',
    });
  }

  /**
   * 设置退回弹框显示/隐藏
   * @param isVisible 显示 true或隐藏 false
   */
  chgSbVisible = (isVisible, refreshPage) => {
    this.setState({
      showSendBack: isVisible
    });
    if (refreshPage) {
      this.skipPage(this.state.page);
    }
  }

  /**
   * 退回弹框点击确定，调用退回接口
   * @param reason 退回原因
   */
  doSendBack = (reason,SendBackPerson) => {
    let sendParam = {};
    sendParam.addr = Api.cancel;
    sendParam.code = this.state.sbOrderData.code;
    sendParam.remark = reason;
    sendParam.cancelType=SendBackPerson;
    debugger;
    Util.comFetch(sendParam, (re)=>{
      this.chgSbVisible(false);
      this.skipPage(this.state.page);
      message.success('退回成功');
    });
  }

  /**
   * 支付弹框点击确定，调用支付接口
   * @param param
   */
  doPay = (param) => {
    const state = this.state;
    let codes = [];
    // 可能选中了多条
    if (state.selRows.length && state.multiFlag) {
      state.selRows.forEach((item) => {
        if (item < state.tableData.length) {
          codes.push(state.tableData[item].code);
        }
      });
      codes = codes.join(',');
    } else {
      codes = state.payOrderData.code;
    }
    param['codes'] = codes;
    param['addr'] = Api.pay;
    console.log('pay data', param);
    Util.comFetch(param, (re) => {
      // 请求成功，关闭支付弹框，重新加载当前页
      this.setState({showPay: false, multiFlag: false});
      this.skipPage(state.page);
      message.success(re.rspDesc);
    });
  }

  // 更新表格选中行的序号
  selRowsUpdate = (rows) => {
    this.setState({selRows: rows});
  }

  // 点击批量支付按钮
  multiPay = () => {
    const selRows = this.state.selRows;
    const tableData = this.state.tableData;
    let hasFreeze = selRows.some((rowIndex) => {
      if (tableData[rowIndex].freeze) {
        return true;
      }
    });
    if (hasFreeze) {
      Modal.warning({
        title: '提示',
        content: '订单中有已冻结订单，请先筛选掉'
      });
      return ;
    }
    if (this.state.selRows.length) {
      this.setState({ showPay: true, multiFlag: true });
    }
  }

  // // 显示详情
  // showDetail = (detailData) => {
  //   console.log('detail', detailData);
  //   this.setState({
  //     showDetail: true,
  //     detailData: detailData
  //   });
  // }
  // 显示详情
  showDetail = (detailData) => {
      // console.log('detail', detailData);
      // let  changeDetail=detailData.code;
      this.setState({
          // changeDetail:detailData.code,
          showDetail: true,
          detailData: detailData
      });
      // },(changeDetail)=>this.getChangeDetail(changeDetail));
  };
  // getChangeDetail=(changeDetail)=>{
  //     let ChangeParam = {};
  //     ChangeParam.addr = Api.OrderLog;
  //     ChangeParam.code = this.state.changeDetail;
  //     Util.comFetch(ChangeParam, (re)=>{
  //         console.log("日志",re)
  //         if (re.data){
  //             this.setState({
  //                 ChangeLog:re.data
  //             })
  //         }else{
  //           this.setStste({
  //               ChangeLog:[]
  //           })
  //         }
  //     });
  // };

  // 隐藏详情面板
  hideDetail = () => {
    this.setState({showDetail: false});
  }

  // 冻结，解冻订单
  toggleFreeze = (record, index) => {
    let addr = record.freeze ? Api.unfreeze : Api.freeze;
    let succTxt = record.freeze ? '解冻成功' : '冻结成功';
    let sendParam = {
      addr: addr,
      code: record.code
    };
    Util.comFetch(sendParam, (re) => {
      // 冻结、解冻成功后，刷新当前页面
      this.skipPage(this.state.page);
      message.success(succTxt);
    });
  }

  // 冻结，解冻资金调拨订单
  toggleFreezeFund = (record, index) => {
    let addr = 'updateFreezeState';
    let succTxt = record.freeze ? '解冻成功' : '冻结成功';
    let sendParam = {
      addr: addr,
      freezeState: record.freeze ? 0 : 1,
      fundtransferId: record.id,
    };
    Util.comFetch(sendParam, (re) => {
      // 冻结、解冻成功后，刷新当前页面
      this.skipPage(this.state.page);
      message.success(succTxt);
    });
  }

  // 更新表格选中行的序号
  selRowsUpdate = (rows) => {
    this.setState({selRows: rows});
  }

  // 检查当前页是否有选中项
  chkSeld() {
    const { selRows, tableData } = this.state;
    let hasSeled = false;
    let rowsData = [];
    let ascRows = selRows.slice().sort((a, b) => { return a < b ? -1 : 1; });
    ascRows.forEach((num) => {
      if (tableData[num]) {
        hasSeled = true;
        rowsData.push(tableData[num]);
      }
    });
    return {
      hasSeled,
      rowsData
    };
  }

  // 点击批量冻结/解冻按钮
  batchFreeze = () => {
    let chk = this.chkSeld();
    if (!chk.hasSeled) {
      message.warning('请选择需要处理的数据项');
      return;
    }

    this.setState({
      batchFreezeVisible: true,
      batchFreezeData: chk.rowsData
    });
  }

  // 批量冻结/解冻弹框关闭
  batchFreezeClose = (refresh) => {
    this.setState({
      batchFreezeVisible: false
    });
    if (refresh) {
      this.sreachOrders();
    }
  }

  // 点击批量编辑按钮
  batchEdit = () => {
    let chk = this.chkSeld();
    if (!chk.hasSeled) {
      message.warning('请选择需要处理的数据项');
      return;
    }
    let hasFreeze = chk.rowsData.some(item => item.freeze);
    let hasAbnormal = chk.rowsData.some(item => item.state === 'ABNORMAL');
    if (hasFreeze) {
      message.warning('请选择未冻结的数据项');
      return;
    }
    if (hasAbnormal) {
      message.warning('请选择非异常的数据项');
      return;
    }

    this.setState({
      batchEditVisible: true,
      batchEditData: chk.rowsData
    });
  }

  // 批量编辑弹框关闭
  batchEditClose = (refresh) => {
    this.setState({
      batchEditVisible: false
    });
    if (refresh) {
      this.sreachOrders();
    }
  }

  render() {
    const { info, tab, tableData, tableDataTotal, payOrderData, sbOrderData, multiFlag, currencyList } = this.state;
    const { batchFreezeVisible, batchFreezeData, batchEditVisible, batchEditData } = this.state;

    let batchDataType = tab === 1 ? 'fund' : 'sett';

    return (
      <div className="spot-order page-container">
        <p  className="title"><span className="light-black">当前位置:</span>{info}</p>
        <div className="tabs">
          <Radio.Group value={this.state.tab} onChange={this.handleTabChange}>
            <Radio.Button value="0">待支付</Radio.Button>
            <Radio.Button value="1">资金调拨</Radio.Button>
          </Radio.Group>
        </div>

        <SearchConditon
          currencyList={currencyList}
          search={this.search}
          exportData={this.exportData}
          multiPay={this.multiPay}
          batchFreeze={this.batchFreeze}
          batchEdit={this.batchEdit}
          tab={tab} />

        {this.getTableView()}

        {
          batchFreezeVisible ?
            <BatchFreezeDialog
              dataType={batchDataType}
              data={batchFreezeData}
              visible={batchFreezeVisible}
              close={this.batchFreezeClose} />
            :
            null
        }

        {
          batchEditVisible ?
            <BatchEditDialog
              dataType={batchDataType}
              data={batchEditData}
              visible={batchEditVisible}
              close={this.batchEditClose} />
            :
            null
        }

        <PayDialog
          multiFlag={multiFlag}
          orderData={payOrderData}
          ok={this.doPay}
          chgVisible={this.chgPayVisible}
          visible={this.state.showPay} />
        {
          this.state.showSendBack ?
            <ReturnDialog
              orderData={sbOrderData}
              return={this.chgSbVisible}
              source={this.state.source}
              visible={this.state.showSendBack} />
            :
            null
        }
        {
          this.state.showDetail ?
            <ListDetails
              ref="listDetails"
              detailData={this.state.detailData}
              detailVisible={this.state.showDetail}
              closeListDetailsModal={this.hideDetail}
            />
            :
            null
        }
      </div>
    );
  }
}

export default PendingPaymentProcessing;
