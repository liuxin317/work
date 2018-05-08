import React from 'react';
import { message } from 'antd';
import SearchCondition from './SearchCondition';
import AbnormalTable from "./AbnormalTable";
import ListDetails from '../../../common/ListDetails';

class AbnormalOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      info: '异常订单',
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

      // 显示详情弹框
      showDetail: false,
      // 详情数据
      detailData: {},
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
        item.amount = Util.num2Decimal(item.amount);
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

  // 显示详情
  showDetail = (detailData) => {
    if (!detailData.myAccount) {
      detailData.myAccount = {};
    }
    this.setState({
      showDetail: true,
      detailData: detailData
    });
  }

  // 隐藏详情面板
  hideDetail = () => {
    this.setState({showDetail: false});
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
          currencyList={currencyList} />

        <AbnormalTable
          setEdit={this.setEdit}
          setSendBack={this.setSendBack}
          current={page}
          skipPage={this.skipPage}
          showDetail={this.showDetail}
          data={tableData}
          total={tableDataTotal}/>

        {
          this.state.showDetail ?
            <ListDetails
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

export default AbnormalOrder;
