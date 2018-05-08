import React from 'react';
import HorizontalNav from './HorizontalNav';
import './style.scss';

// 顶部导航栏
class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  // 选择link
  sel = (path) => {
    if (path) {
      this.props.history.push(AppConf.routeRootPath + path);
    }
  }

  render() {
    const { navData, location } = this.props;

    return (
      <div className="navs">
        <span className="logo"></span>
        <div className="menu-wrapper">
          {<HorizontalNav curPath={location.pathname} data={navData} sel={this.sel}></HorizontalNav>}
        </div>
      </div>
    );
  }
}

export default Nav;
