import React, { Component } from 'react';
import './App.css';
import echarts from 'echarts';

class App extends Component {
  constructor () {
    super();
    this.state = {
      option: {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [500, 2000, 3600, 1000, 1000, 2000]
        }]
      }
    }
  }

  componentDidMount () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.refs.main);

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(this.state.option);

    // 绘制图表。
    echarts.init(this.refs.radius).setOption({
      series: {
          type: 'pie',
          data: [
              {name: 'A', value: 1212},
              {name: 'B', value: 2323},
              {name: 'C', value: 1919}
          ]
      }
    });

    // 基于准备好的dom，初始化 echarts 实例并绘制图表。
    echarts.init(this.refs.lines).setOption({
      title: {text: 'Line Chart'},
      tooltip: {},
      toolbox: {
          feature: {
              dataView: {},
              saveAsImage: {
                  pixelRatio: 2
              },
              restore: {}
          }
      },
      xAxis: {},
      yAxis: {},
      series: [{
          type: 'line',
          smooth: true,
          data: [[12, 5], [24, 20], [36, 36], [48, 10], [60, 10], [72, 20]]
      }]
    });
  }

  render() {
    return (
      <div className="App">
        {/* <!-- 为ECharts准备一个具备大小（宽高）的Dom --> */}
        <div ref="main" style={{ width: '600px', height: '400px' }}></div>
        <div ref="radius" style={{ width: '600px', height: '400px' }}></div>
        <div ref="lines" style={{ width: '600px', height: '400px' }}></div>
      </div>
    );
  }
}

export default App;
