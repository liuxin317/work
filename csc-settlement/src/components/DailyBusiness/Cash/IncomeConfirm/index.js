import React from 'react';
import { message, TreeSelect } from 'antd';
import SearchCondition from './SearchCondition';
import IncomeTable from './IncomeTable';
import DetailDialog from './DetailDialog';
import ConfirmDialog from '../common/ConfirmDialog';
import BillScan from '../common/BillScan';
import ExpireConfigDialog from '../common/ExpireConfigDialog';
import BatchRelevance from '../common/BatchRelevance';

// 收款确认
class IncomeConfirm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      info: '收款确认',
      // 收款确认订单类型下拉框选择数据
      orderTypeList: [
        { label: '全部状态', key: '' },
        { label: '待确认', key: '待确认' },
        { label: '草稿', key: '草稿' },
        { label: '流程中', key: '流程中' },
        { label: '记账', key: '记账' },
        { label: '已关联', key: '已关联' },
      ],
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
      // 显示确认弹框
      showConfirm: false,
      // 显示单据扫描
      showBillScan: false,
      // 显示详情弹框
      showDetail: false,
      // 当前处理的行的数据
      curData: null,
      // 已上传的单据
      bills: [],
      // 选择的行
      selRows: [],
      // 批量关联选择的数据行的id
      batchRelIds: [],

      // test
      treeData: [],
      treeValue: '',

      // 是否显示逾期弹框
      showExpireDialog: false,
    };
  }

  componentDidMount() {
    this.getTableData(1);
    // this.getBussType();
  }

  // // 获取业务类型
  // getBussType() {
  //   Util.comFetch({addr: Api.getOrderType}, (re) => {
  //     let treeData = Util.formatBusTypeData(re.list);
  //     console.log('ywlx tree', re, treeData);
  //     this.setState({treeData: treeData});
  //   });
  // }

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
    sendParam.addr = Api.getReceivablesByKeyword;
    const sort = sorterData || state.sorterData;
    // 列排序参数
    if (sort && sort.sortType) {
      sendParam.sortType = sort.sortType;
      sendParam.direction = sort.direction;
    }

    Util.comFetch(sendParam, (re) => {
      let rows = re.data.rows;
      let selRows = [];
      rows.forEach((item, index) => {
        item.key = index;
        // 每页的key都是0-10，翻页后提出之前页选中但是当前页不可选的选项
        if (state.selRows.indexOf(index) > -1) {
          if (item.stateName === '待确认') {
            selRows.push(index);
          }
        }
      });
      console.log('re', re);
      this.setState({
        selRows: selRows,
        tableData: rows,
        tableDataTotal: re.data.total
      });
    });

    // // mock数据
    // import('../../../json/incomeConfirmOrders.json').then((json) => {
    //   console.log('异常订单json data', json);
    //   let rows = json.data.rows;
    //   rows.forEach((item, index) => item.key = index);
    //   this.setState({
    //     tableData: rows,
    //     tableDataTotal: json.data.total
    //   });
    // });
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
    const state = this.state;
    sendParam.pageNumber = state.page;
    sendParam.pageSize = sendParam.pageSize || state.pageSize;
    // sendParam.pageNumber = 1;
    // sendParam.pageSize = 10000;
    sendParam.addr = Api.exportReceivables;
    // sendParam.state = sendParam.state || this.state.tab;
    const sort = this.state.sorterData;
    // 列排序参数
    if (sort && sort.sortType) {
      sendParam.sortType = sort.sortType;
      sendParam.direction = sort.direction;
    }
    Util.comFetch(sendParam, (re) => {
      document.getElementById('download_iframe').src = AppConf.downloadPrefix + re.url;
      // if (re.data.rows.total) {
      //   message.error("导出数据过多")
      // }
    });
  }

  // 设置弹框可见性
  chgDialogVisible = (visible, type) => {
    if (type === 'confirm') {
      this.setState({ showConfirm: visible });
    } else if (type === 'detail') {
      this.setState({ showDetail: visible });
    }
  }

  // 表格某行点击确认按钮
  confirm = (record, index) => {
    this.setState({
      showConfirm: true,
      curData: record,
      bills: [],
    });
  }

  // 显示单据扫描
  showBillScan = () => {
    this.setState({ showBillScan: true });
  }

  // 关闭单据扫描
  closeBillScan = () => {
    this.setState({ showBillScan: false });
  }

  // 单据扫描完成
  scanFinish = (data) => {
    this.setState({
      showBillScan: false,
      bills: this.state.bills.concat(data)
    });
  }

  // 表格某行点击详情按钮
  showDetail = (detailData) => {
    console.log('detail', detailData);
    this.setState({
      showDetail: true,
      curData: detailData
    });
  }

    onTreeChange = (val, label, extra) => {
        console.log(val, label, extra);
        this.setState({treeValue: val});
    }

  // 添加了单据的回调
  addBillCb = (pics) => {
    this.setState({
      bills: this.state.bills.concat(pics)
    });
  }

  // 删除一条单据
  delBill = (index) => {
    const nextBills = this.state.bills.slice();
    nextBills.splice(index, 1);
    this.setState({bills: nextBills});
  }

  // 确认成功
  confirmed = () => {
    message.success('确认成功');
    this.setState({ showConfirm: false });
    this.search(this.state.searchParam);
  };

  // 设置逾期配置弹框显示
  expire = (visible) => {
    this.setState({showExpireDialog: visible});
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

  // 批量关联
  batchRel = () => {
    let chk = this.chkSeld();
    if (!chk.hasSeled) {
      message.warning('请选择需要处理的数据项');
      return;
    }
    let ids = [];
    chk.rowsData.forEach((item) => {
      ids.push(item.id);
    });
    this.setState({
      batchRelIds: ids,
      showBatchRel: true
    })
  }

  batchRelClose = (refresh) => {
    if (refresh) {
      this.getTableData(this.state.page);
    }
    this.setState({showBatchRel: false});
  }

  render() {
    const {
      info,
      orderTypeList,
      page,
      tableData,
      tableDataTotal,
      showConfirm,
      showBillScan,
      curData,
      showDetail,
      bills,
      showExpireDialog,
      selRows,
      batchRelIds,
      showBatchRel,
    } = this.state;

    return (
      <div className="income-confirm page-container">
        <p  className="title"><span className="light-black">当前位置:</span>{info}</p>
        <SearchCondition
          search={this.search}
          exportData={this.exportData}
          expire={this.expire}
          batchRel={this.batchRel}
          orderTypeList={orderTypeList}></SearchCondition>

        <IncomeTable
          selRowsUpdate={this.selRowsUpdate}
          selRows={selRows}
          relevance={(current)=>this.getTableData(current)}
          confirm={this.confirm}
          showDetail={this.showDetail}
          current={page}
          skipPage={this.skipPage}
          data={tableData}
          total={tableDataTotal}/>

        {
          showBatchRel ?
            <BatchRelevance
              ids={batchRelIds}
              close={this.batchRelClose}
            ></BatchRelevance> :
            null
        }
        {
          showConfirm ?
            <ConfirmDialog
              visible={showConfirm}
              bills={bills}
              curData={curData}
              income={true}
              delBill={this.delBill}
              confirmed={this.confirmed}
              showBillScan={this.showBillScan}
              chgVisible={this.chgDialogVisible}></ConfirmDialog> :
            null
        }

        {
          showBillScan ?
            <BillScan
              scanFinish={this.scanFinish}
              close={this.closeBillScan}></BillScan> :
            null
        }

        {
          showDetail ?
            <DetailDialog
              detailData={curData}
              visible={showDetail}
              chgVisible={this.chgDialogVisible}/> :
            null
        }

        {
          showExpireDialog ?
            <ExpireConfigDialog expire={this.expire}></ExpireConfigDialog> :
            null
        }

      </div>
    );
  }
}

export default IncomeConfirm;
