import React, { Component } from 'react';
import {
  Table,
  DatePicker,
  Input,
  Modal,
  message,
  Button,
} from 'antd';
import moment from 'moment';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import axios from 'axios';

const URL_REGEXP = new RegExp('[a-zA-z]+://[^\s]*');
const columns = [
  {
    title: '开始时间',
    dataIndex: 'starttime',
    render: date => formatDate(Number(date)),
  },
  {
    title: '结束时间',
    dataIndex: 'endtime',
    render: date => formatDate(Number(date)),
  },
  {
    title: '内容',
    dataIndex: 'content',
  },
];

/**
 * @param {string} date - 指定天
 */
function getDayRange(date) {
  const day = new Date(date);
  const top = day.setHours(0, 0, 0);
  const bottom = day.setHours(23, 59, 59);
  return [top.valueOf(), bottom.valueOf()];
}

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function foo(ary) {
  const res = {};
  for (let i = 0, l = ary.length; i < l; i += 1) {
    const item = ary[i];
    res[item.columnName] = item.columnValue;
  }
  return res;
}

function formatResponse(res) {
  const { rows } = res.data;
  return rows.map(row => {
    return {
      id: row.primaryKey[0].value,
      ...foo(row.attributes),
    };
  });
}

/**
 * 获取指定天，每个小时的毫秒区间
 * @param {*} date 
 */
function getHourRange(date) {
  const range = {};
  for (let i = 0; i < 24; i += 1) {
    const start = moment(date).setHours(i, 0, 0);
    const end = moment(date).setHours(i, 59, 59);
    range[i] = [start, end];
  }
}

// 首先要拿到时间区间
// const range = getHourRange(new Date());
// 从数据源计算想要展示的数据格式
function getChartData(dataSource) {
  const res = {};
  let total = 0;
  // 首先按小时计算，先列出 8 到 22 点的 x 轴
  for (let i = 0, l = dataSource.length; i < l; i += 1) {
    // 单条记录
    const record = dataSource[i];
    const startTime = parseInt(record.starttime, 10);
    const endTime = parseInt(record.endtime, 10);
    const spend = endTime - startTime;
    total += spend;
    console.log(startTime, endTime);
    // 看这条记录是否落在单个小时内
    const startHour = moment(startTime).hour();
    const endHour = moment(endTime).hour();
    console.log(startHour, endHour);
    if (startHour === endHour) {
      res[startHour] = (res[startHour] === undefined ? 0 : res[startHour]) + spend;
    } else {
      // 如果不在同一个小时内
      console.log(moment(startTime));
      const point = new Date(startTime).setHours(startHour + 1, 0, 0).valueOf();
      res[startHour] = (res[startHour] === undefined ? 0 : res[startHour]) + (point - startTime);
      res[endHour] = (res[endHour] === undefined ? 0 : res[endHour]) + (endTime - point);
    }
  }
  return {
    detail: res,
    total,
  };
}
// 定义度量
const cols = {
  work: { alias: '工作时长' },
  time: { alias: '时间' }
};

class App extends Component {
  constructor(props) {
    super(props);

    const api = localStorage.getItem('API');
    this.state = {
      dataSource: [],
      addApiModalVisible: !api,
      api,
    };
  }
  componentDidMount() {
    const { api } = this.state;
    const today = moment().format('YYYY-MM-DD');
    const [starttime, endtime] = getDayRange(today);
    if (api) {
      this.fetch({
        starttime,
        endtime,
      });
    }
  }
  fetch = (params) => {
    const { api } = this.state;
    axios.get(api, {
      params,
    })
      .then((res) => {
        const dataSource = formatResponse(res);
        const { detail: data, total } = getChartData(dataSource);
        const chartData = [];
        Object.keys(data).map(hour => {
          chartData.push({
            time: `${hour}:00`,
            work: Math.floor(data[hour] / 1000 / 60),
          });
        });
        this.setState({
          dataSource,
          data: chartData,
          total: Math.floor(total / 1000 / 60),
        });
      });
  }
  handleChangeDate = (value) => {
    const day = value.format('YYYY-MM-DD');
    const [starttime, endtime] = getDayRange(day);
    this.fetch({
      starttime,
      endtime,
    });
  }
  saveApi = (e) => {
    const { value } = e.target;
    this.setState({
      api: value,
    });
  }
  showAddApiModal = () => {
    this.setState({
      addApiModalVisible: true,
    });
  }
  hideAddApiModal = () => {
    const { api } = this.state;
    if (!api) {
      return;
    }
    this.setState({
      addApiModalVisible: false,
    });
  }
  addApi = () => {
    const { api } = this.state;
    console.log(api);
    const res = URL_REGEXP.test(api);
    if (!res) {
      message.error('格式不符合要求');
      return;
    }
    localStorage.setItem('API', api);

    const today = moment().format('YYYY-MM-DD');
    const [starttime, endtime] = getDayRange(today);

    this.fetch({
      starttime,
      endtime,
    });

    this.hideAddApiModal();
  }
  render() {
    const { dataSource, addApiModalVisible, data, total, api } = this.state;
    return (
      <div style={{ padding: 20 }}>
        <DatePicker onChange={this.handleChangeDate} />
        <Button onClick={this.showAddApiModal}>编辑 API 地址</Button>
        <p>总工作时间：{total} min</p>
        <Chart height={400} data={data} scale={cols}>
          <Axis name="time" />
          <Axis name="work" />
          <Tooltip />
          <Geom type="interval" position="time*work" />
        </Chart>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
        <Modal
          visible={addApiModalVisible}
          onOk={this.addApi}
          onCancel={this.hideAddApiModal}
        >
          <p>请填写「支持 GET 请求，并返回指定要求」的 API 地址</p>
          <Input value={api} onChange={this.saveApi} />
        </Modal>
      </div>
    );
  }
}

export default App;
