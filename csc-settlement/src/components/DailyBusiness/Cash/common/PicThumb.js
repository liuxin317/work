import React from 'react';

class PicThumb extends React.Component {

  del = () => {
    const { delBill, index } = this.props;
    delBill(index);
  }

  render() {
    const { picUrl } = this.props;

    return (
      <div
        style={{ backgroundImage: `url(${picUrl})` }}
        className="pic-thumb">
        <span className="del-bill" onClick={this.del}>X</span>
        <div
          style={{ backgroundImage: `url(${picUrl})`}}
          className="big-pic"></div>
      </div>
    );
  }
}

export default PicThumb;
