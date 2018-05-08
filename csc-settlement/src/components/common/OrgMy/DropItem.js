import React from 'react';

class DropItem extends React.Component {
    constructor(props) {
        super(props);
    }

    sel = () => {
        if (this.props.edit) {
            return
        } else {
            this.props.sel(this.props.data);
        }
    }


    render() {
        const {data, selList, multi, edit} = this.props;
        let cls = '';
        if (multi) {
            selList.some((item, index) => {
                if (item.value === data.value) {
                    cls = 'multi-seled';
                    return true;
                }
            });
        }

        return (
            <div
                className="pointer  no-child" 
                onClick={this.sel}
                //  className={"drop-i drop-label" + cls}
                title={data.label}>
                {/*<img src={"http://test.changhong.com/csc/icon/icon-checked-"+( cls == 'multi-seled' ? 'active':'unchecked')+".svg"} alt=""  />*/}
                <img src={require("../../../imgs/icon-checked-"+( cls == 'multi-seled' ? 'active':'unchecked')+".svg")} alt=""  />
                <span  className="no-child-text">{data.label}</span>
            </div>
        );
    }
}

export default DropItem;
