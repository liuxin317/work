import React, { Component } from 'react';
import $ from 'jquery';
import './style.scss';
import arrow from '../../../imgs/arrow.png';
import expend from '../../../imgs/icon-expend.svg';
import unexpend from '../../../imgs/icon-unexpend.svg';
import checkedActive from '../../../imgs/icon-checked-active.svg';
import unchecked from '../../../imgs/icon-checked-unchecked.svg';

// openRetract 是否默认打开树形菜单true/false;
// treeRadioCheckbox 是否多选或者单选1/2;
// isChooseSubset 为多选是否勾选子集true/false;
// initData 初始化数据;
// activeClick 当前选中的数据;
// activesData 已经选中的的数据
// children 子集字段名称
// displaySub 显示不含下级操作true/false;
// displaySearch 是否显示搜索框;
// isDisplayBox 是否显示选择框;
// clearState 还原初始数据;
class Tree extends Component {
    constructor () {
        super();
        this.state = {
            retract: '', // 是否展开菜单;
            treeData: [], // 数据;
            initData: [], // 初始化数据;
            chooseSubset: '', // 是否勾选子集;
            treeRadioCheck: '', // 单选还是多选;
            oneArray: [], // 一维数据;
            displaySub: '', // 是否显示不含下级操作;
            typeStatus: '', // 类型状态;
        }
    }

    componentDidMount () {
        let treeData;

        if (this.props.openRetract) {
            let initData = this.processingData(JSON.parse(JSON.stringify(this.props.initData)));
            this.defaultStopData(initData);
            
            treeData = initData;
        } else {
            treeData = this.processingData(JSON.parse(JSON.stringify(this.props.initData)));
        }

        this.setState({
            retract: this.props.openRetract,
            typeStatus: this.props.clearState,
            displaySub: this.props.displaySub === undefined ? true : this.props.displaySub,
            treeRadioCheck: this.props.treeRadioCheckbox ? this.props.treeRadioCheckbox : 2,
            chooseSubset: this.props.isChooseSubset === undefined ? true : this.props.isChooseSubset,
            treeData,
            initData: this.processingData(JSON.parse(JSON.stringify(this.props.initData))),
            onArray: this.oneDimensionalArray(this.processingData(JSON.parse(JSON.stringify(this.props.initData))))
        });
        this.props.setReload(this.initTreeData);
    }

    // 默认收起
    defaultStopData = (data) => {
        let _this = this;
        recursion(data);

        function recursion(data) {
            data.forEach(item => {
                item.expend = true;

                if (item[_this.props.children] && item[_this.props.children].length) {
                    recursion(item[_this.props.children]);
                }
            })
        }
    }
    
    initTreeData = () => { // 重置数据;
        this.setState({
            treeData: JSON.parse(JSON.stringify(this.state.initData))
        });
        this.refs.treeSearchInput.value = "";
    }

    processingData = (data) => {
        var _this = this;

        var loop = function (data, idx) { // 递归加层级;
            data.forEach(function(item, index) {
            if (!idx) {
                item.index = index + 1;
                item.selected = false;
                item.expend = _this.state.retract;
                if (item[_this.props.children] && item[_this.props.children].length) {
                loop(item[_this.props.children], item.index);
                }
            } else {
                item.index = idx + '-' + (index + 1);
                item.selected = false;
                item.expend = _this.state.retract;
                if (item[_this.props.children] && item[_this.props.children].length) {
                loop(item[_this.props.children], item.index);
                }
            }
            });
        };
        loop(data);
        return data;
    }

    oneDimensionalArray = (data) => {
        var handleData = [];
        var _this = this;
        var id = 0;

        function recursive(data, iNow) {
            var pid = iNow;
            data.forEach(function (item) {
            item.lid = ++id;

            if (pid) {
                item.pid = pid;
            }

            handleData.push(item);

            if (item[_this.props.children] && item[_this.props.children].length) {
                // 递归调用
                recursive(item[_this.props.children], id);
            }
            });
        };

        recursive(data);
        return handleData;
    }

    selectProcessingData = (data) => { // 处理单选还是多选数据 (type => 1 单选；=>2 多选);
        var initDatas = JSON.parse(JSON.stringify(this.state.initData));
        var treeDatas = this.state.treeData;
        var _this = this;
        var type = this.state.treeRadioCheck;

        if (type == 1) {
            replaceRadioData(initDatas, data);
            this.setState({
            treeData: initDatas
            });
        } else if (type == 2) {
            replaceCheckData(treeDatas, data);
            this.setState({
            treeData: treeDatas
            });
        };

        function replaceCheckData (d, targetData) { // 多选替换数据;
            d.forEach(function (item) {
            if (item.index === targetData.index) {
                if (_this.state.chooseSubset) {
                item = targetData;
                }	else {
                item.selected = targetData.selected;
                };
            } else {
                if (item[_this.props.children]) {
                replaceCheckData(item[_this.props.children], targetData);
                }
            }
            });	
        };

        function replaceRadioData (d, targetData) {
            d.forEach(function (item) {
            if (item.index === targetData.index) {
                item.selected = targetData.selected;
            } else {
                if (item[_this.props.children]) {
                replaceRadioData(item[_this.props.children], targetData);
                }
            }
            });
        };
    }

    openRetractData = (data) => { // 替换扩展数据;
        var treeDatas = this.state.treeData;
        var _this = this;
        replaceData(treeDatas, data);

        this.setState({
            treeData: treeDatas
        });

        function replaceData (d, targetData) { // 扩展替换数据;
            d.forEach(function (item) {
            if (item.index === targetData.index) {
                item = targetData
            } else {
                if (item[_this.props.children]) {
                replaceData(item[_this.props.children], targetData);
                }
            }
            });	
        };
    }

    searchInput = (event) => { // 监听搜索内容;
        var val = event.target.value.trim();
        var oneData = JSON.parse(JSON.stringify(this.state.onArray));
        var _this = this;
        var searchData = [];

        if (val) {
            oneData.forEach(function(item){
            if (item.name.indexOf(val) > -1) {
                item.display = 1;
                loop(oneData, item.pid, 1);
            } else {
                item.display = 0;
            }
            });
            this.setState({
            retract: false
            });
            expend(oneData, 1);
        } else {
            this.setState({
            retract: this.state.retract
            });
            expend(oneData, this.state.retract ? 2 : 1);
        }

        this.rotationTree(oneData);

        function loop (data, pid, type) {
            data.forEach(function(item) {
            if (item.lid == pid) {
                item.display = 1;
                loop(data, item.pid);
            }
            });
        };

        function expend (data, type) {
            data.forEach(function(item) {
            item.expend = type == 1 ? false : true;
            });
        };
    }

    rotationTree = (data) => { // 将一维转树形菜单;
        var _this = this;
        var ret = [];
        toTreeData(data, ret);

        this.setState({
            treeData: ret
        });

        function toTreeData(source, arr, pid){
            for (var i=0; i<source.length; i++) {
            var item = source[i];

            if (!pid) {
                if (item.lid == 1) {
                item[_this.props.children] = [];
                arr.push(item);
                toTreeData(source, arr[arr.length - 1][_this.props.children], item.lid);
                }
            } else {
                if (item.pid == pid) {
                if (item[_this.props.children] && item[_this.props.children].length) {
                    item[_this.props.children] = [];
                    arr.push(item);
                    toTreeData(source, arr[arr.length - 1][_this.props.children], item.lid);
                } else {
                    arr.push(item);
                }
                }
            };
            };
        };
    }

    switchChooseSubset = () => { // 切换是否选中子集;
        this.setState({
            chooseSubset: this.state.chooseSubset ? false : true
        });
    }

    returnData = (data) => { // 退出数据
        var arr = [];
        var _this = this;

        if (this.props.activeClick) {
            this.props.activeClick(data);
        };

        if (this.props.activesData) {
            loop(this.state.treeData);
            this.props.activesData(arr);
        };

        function loop (data) { // 筛选选中的数据;
            data.forEach(function (item) {
            if (item.selected) {
                arr.push(item);
                if (item[_this.props.children] && item[_this.props.children].length) {
                loop(item[_this.props.children]);
                }
            } else {
                if (item[_this.props.children] && item[_this.props.children].length) {
                loop(item[_this.props.children]);
                }
            }
            });
        };
    }

    render () {
        if (this.state.retract) {
            $('.retract-box').find('.tree').eq(0).show();
        }

        return (
            <section className={ this.state.retract ? 'tree-box retract-box' : 'tree-box' }>
            
            <div className="tree-group">
                {
                    this.props.displaySearch ?
                    <div className="search-input-group">
                        <input onKeyUp={this.searchInput.bind(this)} className="pull-left search-input" type="text" placeholder="输入关键词搜索" ref="treeSearchInput" />
                        {
                            this.state.displaySub ? 
                            this.state.chooseSubset ? 
                                <a className="pull-left choose-subset" href="javascript: " onClick={this.switchChooseSubset}>
                                <img src={ checkedActive } />
                                <span className="subset-name active">包含下级</span>
                                <div className="clear"></div>
                                </a>
                                :
                                <a className="pull-left choose-subset" href="javascript: " onClick={this.switchChooseSubset}>
                                <img src={ unchecked } />
                                <span className="subset-name">包含下级</span>
                                <div className="clear"></div>
                                </a>
                            :
                            ''
                        }
                        <div className="clear"></div>
                    </div>
                    :
                    ''
                }
                <TreeNode data={ this.state.treeData } child={ this.props.children } processing={ this.selectProcessingData } treeRadioCheck={this.state.treeRadioCheck} chooseSubset={this.state.chooseSubset} openRetractData={this.openRetractData} returnData={this.returnData} isDisplayBox={this.props.isDisplayBox} />
            </div>
            </section>
        )
    }
}

// 递归成节点;
class TreeNode extends Component {
    onSelected = (data, event) => { // 选中当前级;
        event.stopPropagation();
        var _this = this;
        var type = this.props.treeRadioCheck;
        var selectState = data.selected ? false : true;
        data.selected = selectState;

        if (type == 2) {
            loop(data[_this.props.child], type, _this.props.chooseSubset);
        };

        this.props.returnData(data)
        this.props.processing(data);

        function loop (d, type, chooseSubset) {
            if (d) {
            d.forEach(function (item) {
                if (chooseSubset) {
                item.selected = selectState;
                if (item[_this.props.child]) {
                    loop(item[_this.props.child], type, chooseSubset);
                }
                }
            });
            };
        };
    }

    onRetract = (data, event) => { // 收扩;
        event.stopPropagation();

        if (data.expend) {
            data.expend = false;
            $(event.target).parent().parent().find('ul:first').stop(true).slideDown(200);
        } else {
            data.expend = true;
            $(event.target).parent().parent().find('ul:first').stop(true).slideUp(200);
        };

        this.props.openRetractData(data);
    }

    render () {
        var d = this.props.data;
        var _this = this;

        return (
            d
            ?
            <ul className="tree">	
            {
                d.map(function(item, index){
                return (
                    item.display != 0 ? 
                    <li key={ index }>
                    <a className="pull-left expanding" href="javascript: " onClick={ _this.onRetract.bind(this, item) }>
                        {
                        item[_this.props.child] && item[_this.props.child].length ?
                        !item.expend ? <img className="expend" src={ expend } /> :
                        <img className="unexpend" src={ unexpend } /> : ''
                        }
                    </a>
                    <a href="javascript: " className="pull-left check" onClick={ _this.onSelected.bind(this, item) } >
                        {
                        item.selected 
                        ? 
                        <div>
                            {
                            _this.props.isDisplayBox ?
                            <div>
                            <img className="pull-left" src={ checkedActive } />
                            <span className="pull-left name active active-marg">{ item.name }</span>
                            </div>
                            : 
                            <div>
                            <img className="pull-left" src={ checkedActive } />
                            <span className="pull-left name active">{ item.name }</span>
                            </div>
                            }
                            
                        </div>
                        :
                        <div>
                        {
                            _this.props.isDisplayBox ?
                            <div>
                            <img className="pull-left" src={ unchecked } />
                            <span className="pull-left name active-marg">{ item.name }</span>
                            </div>
                            : 
                            <div>
                            <img className="pull-left" src={ unchecked } />
                            <span className="pull-left name">{ item.name }</span>
                            </div>
                        }
                        </div>
                        }
                        
                        <div className="clear"></div>
                    </a>
                    <div className="clear"></div>
                    {
                        item[_this.props.child] 
                        ? 
                        <TreeNode data={ item[_this.props.child] } child={ _this.props.child } processing={ _this.props.processing } openRetractData={_this.props.openRetractData} chooseSubset={_this.props.chooseSubset} treeRadioCheck={_this.props.treeRadioCheck} returnData={_this.props.returnData} isDisplayBox={_this.props.isDisplayBox} /> : ''
                    }
                    </li>
                    : ''
                )
                })
            }
            </ul>
            :
            <div style={{ paddingLeft: '10px', fontSize: '14px', color: '#666' }}>无数据</div>
        )
    }
}

// 组织机构下拉;
class Dropdown extends Component {
    constructor () {
        super();
        this.state = {
            dorpdownState: false, // 下拉框的状态;
            selectName: '' // 选中的name;
        }
    }
    
    closeDorpdown = () => {
        if (!this.state.dorpdownState) {
            // if (this.props.checkbox) {
            //   this.props.clearSearchPostionData();
            // };
            this.clickOtherClose();
        } else {
            $('body').off('click');
        };

        this.setState({
            dorpdownState: this.state.dorpdownState ? false : true
        });
    }

    clickOtherClose = () => { // 点击其他关闭下拉;
        var _this = this;

        $('body').on('click', function (event) {
            if ($(event.target).parents().hasClass('dorpdown-content') || $(event.target).hasClass('dorpdown-content')) {
            
            } else if ($(event.target).parents().hasClass('closeDorpdown') || $(event.target).hasClass('closeDorpdown')) {

            } else {
            _this.setState({
                dorpdownState: false
            });
            
            $(this).off('click');
            };
        });
    }

    newTreeData = (data) => { // 选中的数据;
        if (this.props.oneTreeData) {
            
        } else {
            if (!this.props.checkbox) { // 单选;
            this.setState({
                // dorpdownState: false,
                selectName: data[0].name
            });
            } else {
            var names = '';
            data.forEach(function (item) {
                names += item.name + ', ';
            });
            names = names.substr(0, names.length - 2);
        
            this.setState({
                selectName: names
            });
            };
        
            this.props.postionData(data);
        }
    }

    radioActive = (data) => { // 抛出选中数据;
        this.setState({
            selectName: data.name
        });

        if (this.props.radioActive) {
            this.props.radioActive(data, this.props.saveState);
        }
    }

    clearName = () => { // 编辑时清空name;
        this.setState({
            selectName: ''
        });
    }

    setReload = (fun) => { // 重置Tree数据;
        if (this.props.setReloaData) {
            this.props.setReloaData(fun);
        }
    }

    render () {
        return (
            <div className="pull-left dropdown-box">
            <div className="pull-left organization">
                <label className="pull-left">{ this.props.name }</label>
                <div className="pull-left organization-input">
                <section onClick={ this.closeDorpdown } className="closeDorpdown">
                    <input className="first-child" type="text" disabled="disabled" value= {
                    this.state.selectName === '' 
                    ? this.props.replaceOrgName 
                        ? this.props.replaceOrgName
                        : this.props.replaceOrgName == null ? '' :
                        this.props.checkbox 
                        ? ''
                        : this.props.orgsOfTree && this.props.orgsOfTree.length 
                            ? this.props.orgsOfTree[0].name
                            : ''
                    : this.state.selectName
                    } placeholder="" />
                    <a className="btm" href="javascript: " onClick={this.test}><img src={ arrow } /></a>
                    <div className="clear"></div>
                </section>
                {
                    <div className={ this.state.dorpdownState  ? "dorpdown-content" : "dorpdown-content active"}>
                    {/* <JobTree checkbox={this.props.checkbox} orgs={ this.props.orgsOfTree } newTreeDatas={ this.newTreeData }/> */}
                    { this.props.orgsOfTree && this.props.orgsOfTree.length ?
                        <Tree setReload={this.setReload} initData={ this.props.orgsOfTree } clearState={ this.props.saveState } treeRadioCheckbox={ this.props.checkbox ? '2' : '1' } openRetract={ this.props.openRetract } children="children" isChooseSubset={false} displaySub={this.props.checkbox} displaySearch={this.props.displaySearch} isDisplayBox={this.props.isDisplayBox} activesData={this.newTreeData} activeClick={this.radioActive} />
                        :
                        ''
                    }
                    
                    </div>
                }
                </div>
                <div className="clear"></div>
            </div>
            </div>
        )
    }
}

export default Dropdown;