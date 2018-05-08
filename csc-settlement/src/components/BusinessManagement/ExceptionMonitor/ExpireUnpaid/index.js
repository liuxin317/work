import React from 'react';
import SearchCondition from './SearchCondition';
import ExpireTable from './ExpireTable';

// 到期未支付
class ExpireUnpaid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      info: '到期未支付',
      // 订单类型下拉框选择数据
      orderTypeList: [
        { label: '全部状态', key: '' },
        { label: '待支付', key: '0' },
        { label: '处理中', key: '1' },
        { label: '支付成功', key: '2' },
        { label: '支付失败', key: '3' },
        { label: '已退回', key: '4' },
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
    };
  };

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
    // sendParam.addr = Api.getExpireTradeConfirmByKeyword;
    sendParam.addr = Api.getExpiredOrders;
    if (!sendParam.orderType) {
      sendParam.orderType = '0,1,2,3,4,5,6,7,8,9';
    }
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
    this.setState({searchParam: searchParam, page: 1});
    this.getTableData(1, searchParam);
  }

  exportData = () => {

  }

  render() {
    const {
      info,
      orderTypeList,
      page,
      tableData,
      tableDataTotal,
    } = this.state;

    return (
      <div className="expire-unpaid page-container">
        <p  className="title"><span className="light-black">当前位置:</span>{info}</p>

        <SearchCondition
          search={this.search}
          exportData={this.exportData}
          orderTypeList={orderTypeList}></SearchCondition>

        <ExpireTable
          current={page}
          skipPage={this.skipPage}
          showDetail={this.showDetail}
          data={tableData}
          total={tableDataTotal}
        />

      </div>
    );
  }
}

export default ExpireUnpaid;
