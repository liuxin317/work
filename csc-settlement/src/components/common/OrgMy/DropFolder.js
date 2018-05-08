import React from 'react';
import DropItem from './DropItem';

class DropFolder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expand: props.forceExpand
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.forceExpand && !this.props.forceExpand) {
            this.setState({expand: true});
        }
    }
    getChildren() {
        const {data, selList, multi, forceExpand,lower} = this.props;
        return data.children.map((item, index) => {
            if (item.children && item.children.length) {
                return (<DropFolder
                    key={index}
                    forceExpand={forceExpand}
                    data={item}
                    multi={multi}
                    selList={selList}
                    sel={this.props.sel}></DropFolder>);
            } else {
                return (<DropItem
                    key={index}
                    data={item}
                    multi={multi}
                    selList={selList}
                    sel={this.props.sel}></DropItem>);
            }
        });
    }

    toggleExpand = () => {
        if (this.props.edit) {
            this.setState({expand: false});
        } else {
            this.setState({expand: !this.state.expand});
        }
    }
    sel = () => {
        if (this.props.edit) {
            return
        } else {
            this.props.sel(this.props.data);
        }
        //选择父级 子级同时选中
        if(this.props.lower){

        }
    };

    render() {
        // const { data } = this.props;
        const {data, selList, multi, edit,lower} = this.props;
        // console.log("看编辑", this.props.selList,this.props.data)
        const {expand} = this.state;
        const children = expand ? this.getChildren() : null;

        let cls = '';
        if (multi) {
            selList.some((item, index) => {
                // debugger;
                if (item.value === data.value) {
                    cls = 'multi-seled';
                    return true;
                }
            });
        }
        return (
            <div className="drop-f">
                <span   className="expand-check">
                    {/*<img className="pointer"  style={{marginRight:'10px'}} src={"http://test.changhong.com/csc/icon/icon-"  +(expand ? 'expend' : 'unexpend')+".svg"}     alt=""  onClick={this.toggleExpand}/>*/}
                    {/*<img className="pointer" src={"http://test.changhong.com/csc/icon/icon-checked-"+( cls == 'multi-seled' ? 'active':'unchecked')+".svg"} alt=""  onClick={this.sel}/>*/}
                    <img className="pointer"  style={{marginRight:'10px'}} src={require("../../../imgs/icon-"  +(expand ? 'expend' : 'unexpend')+".svg")}     alt=""  onClick={this.toggleExpand}/>
                    <img className="pointer" src={require("../../../imgs/icon-checked-"+( cls == 'multi-seled' ? 'active':'unchecked')+".svg")} alt=""  onClick={this.sel}/>
                </span>
                <div onClick={this.sel} className="drop-i drop-label  pointer" title={data.label}>{data.label}</div>
                <div className={"dp-children" + (expand ? ' expand' : '')}>
                    {children}
                </div>
            </div>
        );
    }
}
export default DropFolder;
