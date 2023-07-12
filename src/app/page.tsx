'use client'

import React, { useEffect, useState } from 'react';
import { EditableTable } from './Table';
import ModalForm from './ModalForm';
import { Layout, theme } from 'antd';
import { Header, Footer } from 'antd/es/layout/layout';
import { Users } from './DataInterface';

const { Content } = Layout;

const App: React.FC = () => {
  const [userData, setUserData] = useState<Users[]>([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const optionData = {cityOptions, jobOptions};
  const {token: { colorBgContainer },} = theme.useToken();

  const getData = async(link: string) => {
    const res = await fetch(link)
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

  useEffect(() => {
    const fetchData = async () => {
      const cityResponse = await getData('https://mock-api.dev.apps.xplat.fis.com.vn/cities');
      const jobResponse = await getData ('https://mock-api.dev.apps.xplat.fis.com.vn/jobTypes');
      const userResponse = await getData('https://mock-api.dev.apps.xplat.fis.com.vn/users');
      setUserData(userResponse);
      setCityOptions(cityResponse);
      setJobOptions(jobResponse);
    }
    fetchData();
  }, []);

  return (
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }}> <ModalForm data={userData} options={optionData} onShow = {setUserData} /></Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer }}>
            <EditableTable originData={userData} options={optionData} onShow={setUserData}></EditableTable>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>

  );
  
}

export default App;