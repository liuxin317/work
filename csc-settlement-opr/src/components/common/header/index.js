import React, { Component } from 'react';
import Logo from '../../../imgs/logo.png';
import HttpRequest from '../../../request/Fetch';
import './style.scss';

// 本地菜单配置;
import Menu from '../../../configure/menu';

// 菜单处理
import MenuRecursion from './component/MenuRecursion';

let menuList = Menu;

export default class Header extends Component {
    state = {
        menuList: '', //菜单列表;
    }

    componentDidMount () {
        this.menuPermissions();
    }

    // 筛选菜单权限
    menuPermissions = () => {
        HttpRequest({
            addr: 'accCenterPermission'
        },(respone) => {
            let functionPermissionSet = respone.data.functionPermissionSet;

            recursion(menuList, functionPermissionSet);

            this.setState({
                menuList
            })
        });

        function recursion (menu, permis) {
            menu.forEach(item => {
                let num = 0;

                permis.forEach(d => {
                    if (item.code === Number(d.name)) {
                        item.name = d.display;
                        item.active = true;
                        num++;
                    }
                });

                if (num === 0) {
                    item.active = false;
                }

                if (item.children && item.children.length) {
                    recursion(item.children, permis);
                }
            });
        }
    }
    
    render () {
        return (
            <section className="head-top">
                <div className="container" style={{ backgroundColor: '#555999' }}>
                    <div className="pull-left head-top_log">
                        <img src={ Logo } alt="结算后台" />
                    </div>

                    <div className="pull-left head-top_navbar">
                        <MenuRecursion menu={ this.state.menuList } />
                    </div>

                    <div className="clear"></div>
                </div>
            </section>
        )
    }
}