import React from 'react';
import './style.scss';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 总共页数
      page: 20,

      pageArr: [],
      // 当前页数
      pageNow: 1,
      // 跳转的页数
      jump: 1,
    };


  }

  componentDidMount() {
    this.pageNumber();
  }
  // 点击页数事件
  onclickpage(i) {
    this.setState({
      pageNow: i
    });
    this.pageNumber(i);
  }
  // 跳转核心
  pageNumber(data = 1) {
    let index = this.state.page;
    let arr = [];
    // 开始
    if (data < 5) {

      for (let i = 1; i <= index; i++) {
        if (i < 6) {
          arr.push(
            <li className={data === i ? 'active' : ''} onClick={this.onclickpage.bind(this, i)} key={i}>
              <a href="javascript:void(0)">{i}</a>
            </li>);
        } else {
          arr.push(<li className="page-number" key={i}><a href="javascript:void(0)">...</a></li>);
          this.setState({
            pageArr: arr
          });
          return;
        }
      }
    }
    // 最后
    if (data > index - 3) {
      arr = [];
      for (let i = index - 3; i <= index; i++) {
        arr.push(
          <li className={data === i ? 'active' : ''} onClick={this.onclickpage.bind(this, i)} key={i}>
            <a href="javascript:void(0)">{i}</a>
          </li>
        );
      }

      arr.unshift(<li key={-1} className="page-number"><a href="javascript:void(0)">...</a></li>);
      this.setState({
        pageArr: arr
      });

      return;
    }

    // 中间
    if (data > 4) {
      arr = [];
      for (let i = data - 1; i <= index; i++) {
        if (i <= data + 1) {
          arr.push(
            <li className={data === i ? 'active' : ''} onClick={this.onclickpage.bind(this, i)} key={i}>
              <a href="javascript:void(0)">{i}</a>
            </li>
          );
        } else {
          arr.push(<li className="page-number" key={i}><a href="javascript:void(0)">...</a></li>);
          arr.unshift(<li className="page-number" key={-1}><a href="javascript:void(0)">...</a></li>);
          this.setState({
            pageArr: arr
          });
          return;
        }
      }
    }
  }
  // 首页
  shouClick() {
    this.pageNumber(1);
    this.setState({
      pageNow: 1
    });
  }
  // 尾页
  tailClick() {
    this.pageNumber(this.state.page);
    this.setState({
      pageNow: this.state.page
    });
  }
  // 上一页
  previous() {
    if (this.state.pageNow>1&&this.state.pageNow<=this.state.page) {
      this.pageNumber(this.state.pageNow-1);
      this.setState({
        pageNow: this.state.pageNow-1
      });
    }
  }
  // 下一页
  clickNext() {
    if (this.state.pageNow>=1&&this.state.pageNow< this.state.page) {
      this.pageNumber(this.state.pageNow+1);
      this.setState({
        pageNow: this.state.pageNow+1
      });
    }
  }
  // 跳转页数
  jumpChange(e) {
    if (e.target.value > this.state.page) {
      this.setState({
        jump: this.state.page
      });
    } else if (e.target.value < 1) {
      this.setState({
        jump: 1
      });
    } else {
      this.setState({
        jump: parseInt(e.target.value)
      });
    }
  }
  // 跳转页数提交
  subJump() {
    this.pageNumber(this.state.jump);
    this.setState({
      pageNow: this.state.jump
    });
  }
  render() {
    return (
      <div className="page">
        <div className="fixed-table-pagination">
          <div className="pull-left pagination">
            <ul className="pagination">
              <li className="page-first"><a href="javascript:void(0)" onClick={this.shouClick.bind(this)}>首页 </a></li>
              <li className="page-pre disabled"><a href="javascript:void(0)" onClick={this.previous.bind(this)}>上一页</a></li>
              {this.state.pageArr}
              <li className="page-next"><a href="javascript:void(0)" onClick={this.clickNext.bind(this)}>下一页</a></li>
              <li className="page-last"><a href="javascript:void(0)" onClick={this.tailClick.bind(this)}>尾页</a></li>
            </ul>
          </div>
          <div className="pull-center  pagination  ">跳转到
            <input
              type="number"
              step="1"
              min="1"
              max={this.state.page}
              value={this.state.jump}
              onChange={this.jumpChange.bind(this)}
              onKeyDown={this.subJump.bind(this)}
            />页
            <button type="button" onClick={this.subJump.bind(this)}>跳转</button>
          </div>
          <div className="pull-right pagination-detail">
            <span className="page-list">每页显示<span className="btn-group dropup">
              <select>
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>
            </span>条记录</span>
            <span className="pagination-info">&nbsp;&nbsp;&nbsp;总共 xx 条记录</span>
            <span>&nbsp;&nbsp;&nbsp;当前{this.state.pageNow}/{this.state.page}</span>页
          </div>
        </div>
      </div>
    );
  }
}

export default Page;

