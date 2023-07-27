'use client'

import  { useEffect, useState } from 'react';
import EditableTable from './Table';
import ModalForm from './ModalForm';
import { Layout, theme } from 'antd';
import { Header, Footer } from 'antd/es/layout/layout';
import { DataContext, LoadingContext, OptionContext } from './ItemContex'; 

const { Content } = Layout;

const App: React.FC = () => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(false);
 
  const {token: { colorBgContainer },} = theme.useToken();

  const getData = async(param: string) => {
    const baseUrl = 'https://mock-api.dev.apps.xplat.fis.com.vn';
    const res = await fetch(baseUrl + param)
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
}

useEffect(() => { 
  const fetchData = async() => {
    setLoading(true);
    const userData = await getData('/users');
    const cityData = await getData('/cities');
    const jobData = await getData('/jobTypes');
    setData(userData);
    setOptions({cityData, jobData});
  }
  fetchData().then(() => setLoading(false));
}, [])


  return (
    <DataContext.Provider value={[data, setData]}>
      <OptionContext.Provider value={options}>
        <LoadingContext.Provider value={loading}>
        <Layout className="site-layout">
          <Header style={{ padding: 0, background: colorBgContainer }}> 
            <ModalForm />
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer }}>
              <EditableTable/>
            </div>
          </Content>
          {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
        </Layout>
        </LoadingContext.Provider>
      </OptionContext.Provider>
    </DataContext.Provider>
  );
  
}

export default App;