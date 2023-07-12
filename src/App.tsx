import React, { useEffect, useState } from 'react';
import './index.css';
import axios from 'axios';
import { Users, EditableTable } from './data';
import ModalForm from './ModalForm';

import { Layout, theme } from 'antd';
import { Header, Footer } from 'antd/es/layout/layout';

const { Content } = Layout;

const App: React.FC = () => {
  const {token: { colorBgContainer },
  } = theme.useToken();
  const [data, setData] = useState<Users[]>([]);

  
  const fetchData = async() => {
    const response = await axios.get('https://mock-api.dev.apps.xplat.fis.com.vn/users');
    setData(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout hasSider>
      {/* <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        style={{ marginLeft: 200 }}
      </Sider> */}
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }}> <ModalForm data={data} onShow = {setData} /></Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer }}>
            <EditableTable originData={data} onShow={setData}></EditableTable>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
  
}

export default App;