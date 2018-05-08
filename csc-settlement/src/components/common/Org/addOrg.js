/**
 * Created by Summer on 2017/11/27.
 */
import  React from  "react";
import  { TreeSelect, Tree,}  from  "antd";
import  './style.scss'

const TreeNode = Tree.TreeNode;
export  default class Organization  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //组织机构选择的
            treeValue:undefined,
            orgCode: "",
            OrgId: [],
        }
    };
    componentWillReceiveProps(nextProps){
        if(this.props.ValueEdit!==nextProps.ValueEdit){
            this.setState({
                treeValue:nextProps.ValueEdit
            })
        }
        // debugger;
    }


    //根据组织结构获取账号
    onChanges = (value) =>{
        // debugger;
        console.log("v", value, arguments)
        this.setState({
            treeValue: value,
        },()=>this.props.TreeValue(value,this.state.OrgId));
    };
    // SearchTree=(value)=>{
    //     console.log("SearchTree",value);
    // };
    renderTreeNodes = (data) => {
        console.log("组件data", data);
        return data.map((item) => {
            if (item.children) {
                if (item.children.length > 0) {
                    return (
                        <TreeNode title={item.name} value={item.code} key={item.code}>
                            {this.renderTreeNodes(item.children)}
                        </TreeNode>
                    );
                }
            }
            else {
                return <TreeNode title={item.name} value={item.code} key={item.code} isLeaf={true}/>;
            }
        });
    };

    render() {
        console.log(this.props);
        return (
            <div>
                <div className="org">
                    {/*<span className="desc">组织结构:</span>*/}
                    <TreeSelect className="org-item"
                                // showSearch
                                style={{width: 200, marginBottom: 20, overflow: 'hidden',textOverflow:"ellipsis",whiteSpace:"nowrap"}}
                                value={this.state.treeValue}
                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                placeholder="请选择组织机构"
                                allowClear
                                multiple={false}
                                size="large"
                                treeDefaultExpandAll
                                onChange={this.onChanges}
                                // onSearch={this.SearchTree}
                    >
                        {this.renderTreeNodes(this.props.OrgData)}
                    </TreeSelect>&emsp;
                </div>
            </div>
        )
    }
}

