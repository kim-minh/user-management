import React from 'react';
import './index.css';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

interface Users {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  status: number;
  address: string;
  avatar: string;
  gender: string;
  jobTypeId: number;
  jobType: Job;
  cityId: number;
  city: City;
  updatedAt: Date;
  createdAt: Date;
}

interface Job {
  id: number;
  jobType: string;
}

interface City {
  id: number;
  jobType: string;
}

axios.get('https://mock-api.dev.apps.xplat.fis.com.vn/users')
  .then((response) => {
    const data : Users[] = response.data;
    console.log(data);
  });

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}


const App: React.FC = () => {
 
const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  return <Table columns={columns} dataSource={data} />
};
