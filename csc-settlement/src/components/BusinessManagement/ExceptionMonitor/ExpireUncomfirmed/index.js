import React from 'react';
import SearchCondition from './SearchCondition';
import ExpireTable from './ExpireTable';
import DetailDialog from './DetailDialog';

// 逾期未确认
class ExpireUncomfirmed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      info: '逾期未确认',
      // 订单类型下拉框选择数据
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
      // 显示详情弹框
      showDetail: false,
      // 当前处理的行的数据
      curData: null,
    };
  }

  componentDidMount() {
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
    sendParam.addr = Api.getExpireTradeConfirmByKeyword;
    const sort = sorterData || state.sorterData;
    // 列排序参数
    if (sort && sort.sortType) {
      sendParam.sortType = sort.sortType;
      sendParam.direction = sort.direction;
    }

    Util.comFetch(sendParam, (re) => {
      let rows = re.data.rows;
      rows.forEach((item, index) => item.key = index);
      console.log('re', re);
      this.setState({
        tableData: rows,
        tableDataTotal: re.data.total
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
    const state = this.state;
    sendParam.pageNumber = state.page;
    sendParam.pageSize = sendParam.pageSize || state.pageSize;
    sendParam.addr = Api.exportReceivables;
    const sort = this.state.sorterData;
    // 列排序参数
    if (sort && sort.sortType) {
      sendParam.sortType = sort.sortType;
      sendParam.direction = sort.direction;
    }
    Util.comFetch(sendParam, (re) => {
      document.getElementById('download_iframe').src = AppConf.downloadPrefix + re.url;
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

  // 设置弹框可见性
  chgDialogVisible = (visible, type) => {
    if (type === 'confirm') {
      this.setState({ showConfirm: visible });
    } else if (type === 'detail') {
      this.setState({ showDetail: visible });
    }
  }

  render() {
    const {
      info,
      orderTypeList,
      page,
      tableData,
      tableDataTotal,
      showDetail,
      curData,
    } = this.state;

    return (
      <div className="expire-unconfirmed page-container">
        <p  className="title"><span className="light-black">当前位置:</span>{info}</p>

        <SearchCondition
          search={this.search}
          exportData={this.exportData}
          orderTypeList={orderTypeList}></SearchCondition>

        <ExpireTable
          relevance={(current)=>this.getTableData(current)}
          confirm={this.confirm}
          showDetail={this.showDetail}
          current={page}
          skipPage={this.skipPage}
          data={tableData}
          total={tableDataTotal}/>

        {
          showDetail ?
            <DetailDialog
              detailData={curData}
              visible={showDetail}
              chgVisible={this.chgDialogVisible}/> :
            null
        }
      </div>
    );
  }
}

export default ExpireUncomfirmed;
