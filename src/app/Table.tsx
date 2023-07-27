import { Form, Input, Popconfirm, Table, Typography, Select } from 'antd';
import { useState, useContext } from 'react';
import { DataContext, LoadingContext, OptionContext } from './ItemContex';
import { Users, Job, City } from './DataInterface';
import Image from 'next/image';

const { Option } = Select;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Users;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <Input.TextArea style={{width: 120}} autoSize/>
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useContext(DataContext);
  const options = useContext(OptionContext);
  const loading = useContext(LoadingContext);

  const [editingKey, setEditingKey] = useState(-1);

  const isEditing = (record: Users) => record.id === editingKey;

  const edit = (record: Partial<Users> & { id: React.Key }) => {
    form.setFieldsValue({ fullName: '', email: '', phoneNumber: '', gender: '', address: '', avatar: '', job: '', city: '', ...record });
    setEditingKey(record.id);
  };

  const deleteUser = async(id: number) => {
    const res = await fetch(`https://mock-api.dev.apps.xplat.fis.com.vn/users/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

  const deleteRow = async(key: React.Key) => {
    const index = data.findIndex((item: any) => key === item.id);
    const newData = data.filter((item: any) => item.id !== key);
    setData(newData);
    //await deleteUser(index)
    setEditingKey(-1);
  }

  const cancel = () => {
    setEditingKey(-1);
  };

  const updateUser = async(id: number, data: any) => {
    const res = await fetch(`https://mock-api.dev.apps.xplat.fis.com.vn/users/${id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as any;
      const newData = [...data];
      const index = data.findIndex((item: any) => key === item.id);

      if (index > -1) {
        if (row.cityId.value !== undefined) {
          row.city = {
            id: row.cityId.value,
            cityName: row.cityId.label
          };
          row.cityId = row.cityId.value;
        }
        
        if (row.jobTypeId.value !== undefined) {
          row.jobType = {
            id: row.jobTypeId.value,
            jobType: row.jobTypeId.label
          }
          row.jobTypeId = row.jobTypeId.value;
        }

        if (row.gender.value !== undefined) {
          row.gender = row.gender.value;
        }

        row.updatedAt = new Date().toISOString().substring(0, 10);

        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);

        //await updateUser(originData[index].id, row);
      } else {
        
      }

      setEditingKey(-1);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [{
    title: 'Name',
    dataIndex: 'fullName',
    key: 'fullName',
    editable: true,
  }, {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    editable: true,
  }, {
    title: 'Phone',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    editable: true,
  }, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    editable: true,
  }, {
    title: 'Avatar',
    dataIndex: 'avatar',
    key: 'avatar',
    editable: true,
    render: (avatar: string) => <Image width={100} height={100} src={avatar} alt='avatar' />
  }, {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    render: (gender: string, _: any, index: number) => editingKey !== index+1 ? `${gender}` : (
      <Form.Item name='gender' initialValue={gender} noStyle>
        <Select
          style={{ width: 100 }}
        >
          <Option value="male">male</Option>
          <Option value="female">female</Option>
          <Option value="other">other</Option>
        </Select>
      </Form.Item>
    )
  }, {
    title: 'Job',
    dataIndex: 'jobType',
    key: 'jobType',
    render: (jobType: any, _: any, index: number) => editingKey !== index+1 ? `${jobType.jobType}` : (
      <Form.Item name="jobTypeId" initialValue={jobType.id} noStyle>
        <Select
          labelInValue
          style={{ width: 120 }}
        >
          {options.jobData?.map((option: Job) => (
            <Option key={option.id} value={option.id}>{option.jobType}</Option>
          ))}
        </Select>
      </Form.Item>
    )
  }, {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    render: (city: any, _: any, index: number) => editingKey !== index+1 ? `${city.cityName}` : (
      <Form.Item name="cityId" initialValue={city.cityId} noStyle>
        <Select
          labelInValue
          style={{ width: 120 }}
        >
          {options.cityData?.map((option: City) => (
            <Option key={option.id} value={option.id}>{option.cityName}</Option>
          ))}
        </Select>
      </Form.Item>

    ),
  }, {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  }, {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
  }, {
    title: 'Edit',
    dataIndex: 'edit',
    render: (_: any, record: Users) => {
      const editable = isEditing(record);
      return editable ? (
        <span>
          <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
            Save
          </Typography.Link>
          <Popconfirm title="Sure to delete?" onConfirm={() => deleteRow(record.id)}>
            <a>Delete</a>
          </Popconfirm>
          <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
            <a>Cancel</a>
          </Popconfirm>
        </span>
      ) : (
        <Typography.Link disabled={editingKey !== -1} onClick={() => edit(record)}>
          Edit
        </Typography.Link>
      );
    },
},];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Users) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        rowKey={(record) => record.id}
        loading={loading}
        bordered
        dataSource={data}
        columns={mergedColumns}
        scroll={{ x: 1300 }}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default EditableTable;