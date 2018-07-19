import React, { Component } from 'react';
import {
  Table,
} from 'antd';
import moment from 'moment';
import axios from 'axios';

import './App.css';

// const api = 'https://1851343155697899.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/record_time/get';
const api = 'https://1851343155697899.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/record_time/test/';
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

class App extends Component {
  state = {
    dataSource: [],
  }
  componentDidMount() {
    const today = moment().format('YYYY-MM-DD');
    const [starttime, endtime] = getDayRange(today);
    axios.get(api, {
      params: {
        starttime,
        endtime,
      },
    })
      .then((res) => {
        this.setState({
          dataSource: formatResponse(res),
        });
      })
  }
  render() {
    const { dataSource } = this.state;
    return (
      <div className="App">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </div>
    );
  }
}

export default App;
