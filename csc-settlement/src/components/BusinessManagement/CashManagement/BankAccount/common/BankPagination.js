import React, { Component } from 'react';
import { Pagination, Button } from 'antd';

class BankPagination extends Component {

  state = {
    pageNumber: 1,
    pageSize: 10
  }

  changePage = (pageNumber, pageSize) => {
    this.props.onChangePage(pageNumber, pageSize);
    this.setState({ pageNumber, pageSize });
  }

  goPageNumber = () => {
    const  { pageNumber, pageSize } = this.state;

    this.changePage(pageNumber, pageSize);
  }

  render () {
    const { total } = this.props;

    return (
      <div>
        {
          total
          ? (
              <div className="bank-pagination">
                <Pagination showQuickJumper
                  total={total}
                  showTotal={total => `共 ${total} 条`} 
                  showQuickJumper
                  defaultPageSize={10}
                  onChange={this.changePage}
                />
                {/* <Button onClick={this.goPageNumber}>跳转</Button> */}
              </div>
            )
          : ''
        }
      </div>
    );
  }
}

export default BankPagination;
