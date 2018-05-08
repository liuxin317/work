import React from 'react';
import { Icon } from 'antd';
import './style.scss';

/**
 * 操作提示框
 * 可传入属性:
 * show boolean 必须 控制是否显示
 * text string 必须 显示的文字
 * cb function 必须 回调函数，主要用于设置父组件传入的show
 * duration number 可选 显示的持续时间，默认2000ms
 */
class Tip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };

    this.hide = this.hide.bind(this);
    this._timer = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.show && !prevProps.show) {
      let duration = this.props.duration || 2000;
      clearTimeout(this._timer);
      this._timer = setTimeout(this.hide, duration);
    }
  }

  hide() {
    this.props.cb();
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  render() {
    const { show, text } = this.props;
    if (!show) {
      return null;
    }

    let showCls = show ? 'block' : 'none';
    return (
      <div className={"tip tip-cover " + showCls}>
        <div className="tip-container">
          <Icon className="close-btn" type="close" onClick={this.hide} />
          <div className="contents">{text}</div>
        </div>
      </div>
    );
  }
}

export default Tip;