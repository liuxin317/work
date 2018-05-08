import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Types from '../../../../actions/ActionType';
import { routeRootPath } from '../../method';

// 第一级处理
class OneLevel extends Component {
    render () {
        const { menu } = this.props;
        
        return (
            <ul className="navbar-box">
                {
                    menu && menu.length 
                    ? 
                    menu.map((item, index) => {
                        return item.active 
                                ? 
                                (
                                    <li className={ this.props.state === item.state ? "one-level active" : "one-level" } key={ index }>
                                        <figure className="li-group">
                                            {
                                                item.url 
                                                ?
                                                <Link to={item.url}>
                                                    <img src={ item.icon } alt=""/>
                                                    <figcaption>{ item.name }</figcaption>
                                                </Link>
                                                :
                                                <a href="javascript: ">
                                                    <img src={ item.icon } alt=""/>
                                                    <figcaption>{ item.name }</figcaption>
                                                </a>
                                            }
                                            
                                        </figure>
                                        {
                                            item.children && item.children.length
                                            ?
                                            <TwoLevel data={ item.children } menuState={ this.props.menuState }  />
                                            :
                                            ''
                                        }
                                    </li>
                                )
                                :
                                ''
                    })
                    :
                    ''
                }
                <div className="clear"></div>
            </ul>
        )
    }
}

// 二级处理;
class TwoLevel extends Component {
    upMenuState = (url) => {
        let newColumn = routeRootPath === '/' ? url.split('/')[1] : url.split('/')[2];

        this.props.menuState(newColumn);
    }

    render () {
        const { data } = this.props;
        return (
            <div className="dropdown-box">
                <ul className="frist-drop-down">
                    {
                        data.map((item, index) => {
                            return item.active
                                    ?
                                    <li key={ index } onClick={ this.upMenuState.bind(this, item.url) }>
                                        <Link to={ item.url }>
                                            { item.name }
                                        </Link>
                                        {
                                            item.children && item.children.length
                                            ?
                                            <OnRecursion menuState={ this.props.menuState } data={ item.children } />
                                            :
                                            ''
                                        }
                                    </li>
                                    :
                                    ''
                        })
                    }
                </ul>
            </div>
        )
    }
}

// 递归后级
class OnRecursion extends Component {
    upMenuState = (url) => {
        this.props.menuState(url.split('/')[1]);
    }

    render () {
        const { data } = this.props;

        return (
            <ul className="after-group">
                {
                    data.map((item, index) => {
                        return item.active
                                ?
                                <li key={ index } onClick={ this.upMenuState.bind(this, item.url) }>
                                    <Link to={ item.url }>
                                        { item.name }
                                    </Link>
                                    {
                                        item.children && item.children.length
                                        ?
                                        <OnRecursion menuState={ this.props.menuState } data={ item.children } />
                                        :
                                        ''
                                    }
                                </li>
                                :
                                ''
                    })
                }
            </ul>
        )
    }
}

class MenuRecursion extends Component {
    componentWillReceiveProps (nextProps) {
        if (nextProps.menu) {
            this.props.filterMenuList(nextProps.menu);
        }
    }

    render () {
        const { menuState, upMenuState, menu } = this.props;

        return (
            <OneLevel menu={ menu } state={ menuState } menuState={ upMenuState } />
        )
    }
}

// 获取当前所在菜单
const mapStateToProps = (state) => {
    return {
        menuState: state.common.menuState
    }
}

// 更新当前所在菜单
const mapDispatchToProps = (dispatch) => {
    return {
        upMenuState: (state) => { dispatch({ type: Types.MENU_STATE, payload: { menuState: state } })},
        filterMenuList: (menu) => { dispatch({ type: Types.MENU_LIST, payload: { filterMenu: menu } })  }
    }
}

// 更新当前所在菜单状态;
const ConnectMenuRecursion = connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuRecursion);

export default ConnectMenuRecursion;