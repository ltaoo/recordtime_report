import React from 'react';
import { Layout, Drawer } from 'antd';

const { Sider } = Layout;

export default class SiderMenu extends React.Component {
  render() {
    return (
      <Drawer
        visible={false}
      >
        <Sider><p>侧边栏内容</p></Sider>
      </Drawer>
    );
  }
}
