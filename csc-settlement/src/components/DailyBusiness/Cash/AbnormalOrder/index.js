import React from 'react';
import { message } from 'antd';
import SearchCondition from './SearchCondition';
import AbnormalTable from "./AbnormalTable";
import EditObjDialog from './EditObjDialog';
import SendBackDialog from '../common/SendBackDialog';
import EditRuleDialog from './EditRuleDialog';

class AbnormalOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      info: '异常申请',
      // 币种下拉选框数据
      currencyList: [],
      // 表格数据
      tableData: [],
      // 表格数据总条数
      tableDataTotal: 0,
      // 当前页码
      page: 1,
      // 每页条数
      pageSize: 10,
      // 表格排序数据
      sorterData: {},
      // 查询参数，包含查询条件筛选栏的参数，不包括页码和订单类型
      searchParam: {},
      // 显示编辑往来对象弹框
      showEditObj: false,
      // 当前编辑，处理的订单数据
      curOrder: {},
      // 显示退回弹窗
      showSendBack: false,
      // 显示编辑规则弹框
      showEditRule: false,


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
    // 异常订单，state固定为5
    sendParam.state = 5;
    const sort = sorterData || state.sorterData;
    // 列排序参数
    if (sort && sort.sortType) {
      sendParam.sortType = sort.sortType;
      sendParam.direction = sort.direction;
    }

    Util.comFetch(sendParam, (re)=>{
      let rows = re.data.rows;
      rows.forEach((item, index) => {
        item.key = index;
        item.acAccount = item.acAccount || {};
      });
      this.setState({
        tableData: rows,
        tableDataTotal: re.data.total
      });
    });

    // // mock数据
    // Util.comFetch(sendParam, (re)=>{
    //   let rows = re.data.rows;
    //   rows.forEach((item, index) => {
    //     item.key = index;
    //     item.acAccount = item.acAccount || {};
    //   });
    //   this.setState({
    //     tableData: rows,
    //     tableDataTotal: re.data.total
    //   });
    // }, null, {method: 'get'}, 'http://localhost:5000/orders_abnormal');

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
      rows.unshift({ label: '全部币种', key: '' });
      this.setState({
        currencyList: rows
      });
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
   * 点击搜索按钮，保存最新条件参数作为跳页时搜索条件，重新加载第一页数据
   * @param searchParam 搜索条件
   */
  search = (searchParam) => {
    this.setState({ searchParam: searchParam, page: 1 });
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
    sendParam.state = 5;
    const sort = this.state.sorterData;
    // 列排序参数
    if (sort && sort.sortType) {
      sendParam.sortType = sort.sortType;
      sendParam.direction = sort.direction;
    }
    Util.comFetch(sendParam, (re) => {
      document.getElementById('download_iframe').src = AppConf.downloadPrefix + re.data;
      // if (re.data.rows.total) {
      //   message.error("导出数据过多")
      // }
    });
  }

  // 设置编辑，根据异常类型，打开编辑往来对象或规则的对话框
  setEdit = (record, index) => {
    let exceptionCode = parseInt(record.exceptionCode);
    if (exceptionCode >= 200) {
      this.setState({
        showEditRule: true,
        curOrder: record
      });
    } else {
      this.setState({
        showEditObj: true,
        curOrder: record
      });
    }
  }

  // 编辑成功
  editConfirmed = () => {
    message.success('编辑成功');
    this.setState({ showEditRule: false, showEditObj: false });
    this.search();
  }

  // 设置弹框隐藏
  chgDialogVisible = (visible, type) => {
    if (type === 'obj') {
      this.setState({ showEditObj: visible });
    } else if (type === 'rule') {
      this.setState({ showEditRule: visible });
    } else if (type === 'back') {
      this.setState({ showSendBack: visible });
    }
  }

  /**
   * 设置退回弹框
   * @param data 点击支付按钮的订单行数据
   */
  setSendBack = (data) => {
    this.setState({
      curOrder: data,
      showSendBack: true
    });
  }

  /**
   * 退回弹框点击确定，调用退回接口
   * @param reason 退回原因
   */
  doSendBack = (reason,SendBackPerson) => {
    let sendParam = {};
    sendParam.addr = Api.cancel;
    sendParam.code = this.state.curOrder.code;
    sendParam.remark = reason;
    sendParam.cancelType=SendBackPerson;

    Util.comFetch(sendParam, (re)=>{
      this.chgDialogVisible(false, 'back');
      this.skipPage(this.state.page);
      message.success('退回成功');
    });
  }

  render() {
    const {
      info,
      currencyList,
      page,
      tableData,
      tableDataTotal,
      showEditObj,
      showEditRule,
      curOrder,
      showSendBack,
    } = this.state;

    return (
      <div className="abnormal-order page-container">
        <p className="title"><span className="light-black">当前位置:</span>{info}</p>
        <SearchCondition
          search={this.search}
          exportData={this.exportData}
          currencyList={currencyList}></SearchCondition>

        <AbnormalTable
          setEdit={this.setEdit}
          setSendBack={this.setSendBack}
          current={page}
          skipPage={this.skipPage}
          data={tableData}
          total={tableDataTotal}/>

        {
          showSendBack ?
            <SendBackDialog
              ok={this.doSendBack}
              chgVisible={this.chgDialogVisible}
              visible={this.state.showSendBack}/> :
            null
        }

        {
          showEditObj ?
            <EditObjDialog
              visible={showEditObj}
              curOrder={curOrder}
              confirmed={this.editConfirmed}
              chgVisible={this.chgDialogVisible}
            ></EditObjDialog> :
            null
        }

        {
          showEditRule ?
            <EditRuleDialog
              visible={showEditRule}
              curOrder={curOrder}
              confirmed={this.editConfirmed}
              chgVisible={this.chgDialogVisible}
            ></EditRuleDialog> :
            null
        }

      </div>
    );
  }
}

export default AbnormalOrder;
