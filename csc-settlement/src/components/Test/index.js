import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import Tip from '../common/Tip';

import './style.scss';

const FormItem = Form.Item;
const Option = Select.Option;

class Test extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      info: 'test',
      name: '',
      type: '',
      typeData: ['aaa', 'bbb', 'ccc'],
      showTip: true
    };
  }

  componentDidMount() {
    // var self = this;
    // setInterval(()=>{
    //   self.setState({
    //     showTip: !self.state.showTip
    //   })
    // }, 3000);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      } else {
        console.log('fail');
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    let options = this.state.typeData.map((item, index) => (
      <Option key={index} value={item}>{item}</Option>
    ));

    return (
      <div className="test">
        <Tip show={this.state.showTip} text="123123" cb={()=>{
          this.setState({showTip: false});
        }}/>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {
              getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input your username!' }]
              })(
                <Input />
              )
            }
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('type', {
                rules: [{ required: true, message: 'Please input your username!' }]
              })(
                <Select>
                  {options}
                </Select>
              )
            }
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">Submit</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Test);
