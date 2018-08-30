import React, { Component } from 'react';
import {
  Table,
  DatePicker,
  Input,
  Modal,
  message,
  Button,
  Layout,
  Card,
} from 'antd';
import moment from 'moment';
import axios from 'axios';

import SiderMenu from './components/SiderMenu';
import { 
  ChartCard, 
  Bar,
} from './components/Charts';
import { getChartData, getTimeText } from './utils';

import MOCK_DATASOURCE from './mock/data';

const { Header, Content } = Layout;

const URL_REGEXP = new RegExp('[a-zA-z]+://[^]*');
const columns = [
  {
    title: '开始时间',
    dataIndex: 'starttime',
    render: date => format(Number(date)),
  },
  {
    title: '结束时间',
    dataIndex: 'endtime',
    render: date => format(Number(date)),
  },
  {
    title: '描述',
    dataIndex: 'content',
  },
  {
    title: '时长',
    dataIndex: 'length',
  },
];

/**
 * 获取指定天的时间戳范围
 * @param {string} date - 指定天
 */
function getDayRange(date) {
  const start = moment(date).startOf();
  const end = moment(date).endOf();
  return [start.valueOf(), end.valueOf()];
}

function format(date, formatter='YYYY-MM-DD HH:mm:ss') {
  return moment(date).format(formatter);
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
  }).map(item => {
    console.log(item.endtime, item.starttime);
    return {
      ...item,
      length: `${getTimeText(parseInt(item.endtime, 10) - parseInt(item.starttime, 10))}`,
    };
  });
}

export default class App extends Component {
  constructor(props) {
    super(props);

    const api = localStorage.getItem('API');

    this.state = {
      loading: true,
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
  async fetch (params) {
    const { api } = this.state;
    try {
      const res = await axios.get(api, {
        params,
      });
      // const dataSource = formatResponse({ data: MOCK_DATASOURCE });
      const dataSource = formatResponse(res);
      const { detail: data, total, timerTotal } = getChartData(dataSource);
      console.log(dataSource, data, total);
      // 横轴是确定的，24 小时
      const chartData = [];
      Object.keys(data).forEach(hour => {
        chartData.push({
          x: `${hour}:00`,
          y: Math.floor(data[hour] / 1000 / 60),
        });
      });
      this.setState({
        dataSource,
        data: chartData,
        total,
        timerTotal,
        loading: false,
      });
    } catch(err) {
      console.error(err);
    }
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
    const { loading, dataSource, data, total, timerTotal, addApiModalVisible, api } = this.state;

    const title = `总时长：${getTimeText(total)}   番茄钟数：${timerTotal}`;
    return (
      <Layout>
        <SiderMenu />
        <Layout>
          <Header>
            <Button icon="setting" onClick={this.showAddApiModal}>编辑 API 地址</Button>
          </Header>
          <Content style={{ padding: 20 }}>
            <ChartCard
              head={<span style={{ lineHeight: '32px' }}>每小时工作时长趋势</span>}
              loading={loading}
              style={{ marginBottom: 20 }}
              title={title}
              extra={(
                <DatePicker onChange={this.handleChangeDate} />
              )}
            >
              <Bar height={292} data={data} />
            </ChartCard>
            <Card>
              <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
              />
            </Card>
          </Content>
          <Modal
            visible={addApiModalVisible}
            onOk={this.addApi}
            onCancel={this.hideAddApiModal}
          >
            <p>请填写「支持 GET 请求，并返回指定要求」的 API 地址</p>
            <Input value={api} onChange={this.saveApi} />
          </Modal>
        </Layout>
      </Layout>
    );
  }
}
