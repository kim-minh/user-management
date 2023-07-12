import { Form, Input, InputNumber, Popconfirm, Table, Typography, Select } from 'antd';
import { useState } from 'react';
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
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

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
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface EditableTableProps {
  originData: Users[],
  options: any,
  onShow: (data: any) => void,
}

export const EditableTable: React.FC<EditableTableProps> = ({originData, options, onShow}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(-1);

  // const handleStatusChange = (value, key) => {
  //   // Handle the status change here
  //   console.log(`Status changed to ${value} for record with key ${key}`);
  // };

  const isEditing = (record: Users) => record.id === editingKey;

  const edit = (record: Partial<Users> & { id: React.Key }) => {
    form.setFieldsValue({ fullName: '', email: '', phoneNumber: '', gender: '', address: '', avatar: '', job: '', city: '', ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(-1);
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Users;

      const newData = [...originData];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        onShow(newData);
        setEditingKey(-1);
      } else {
        newData.push(row);
        onShow(newData);
        setEditingKey(-1);
      }
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
    render: (avatar: string) => <Image width={100} height={100} src={avatar} alt='avatar'/>
  }, {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    render: (gender: string) => editingKey === -1 ? `${gender}` : (
      <Select
        defaultValue={gender}
        style={{ width: 120 }}
        //onChange={(value) => handleStatusChange(value, record)}
      >
        <Option value="Active">male</Option>
        <Option value="Inactive">female</Option>
        <Option value="Other">other</Option>
      </Select>
    )
  }, {
    title: 'Job',
    dataIndex: 'jobType',
    key: 'jobType',
    render: (jobType: any) => editingKey === -1 ? `${jobType.jobType}` : (
      <Select
        defaultValue={jobType.jobType}
        style={{ width: 120 }}
        //onChange={(value) => handleStatusChange(value, record)}
      >
        {options.jobOptions.map((option: Job) => (
          <Option key={option.id} value={option.jobType}>{option.jobType}</Option>
        ))}
      </Select>
    )
  }, {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    render: (city: any) => editingKey === -1 ? `${city.cityName}` : (
      <Select
        defaultValue={city.cityName}
        style={{ width: 120 }}
        //onChange={(value) => handleStatusChange(value, record)}
      >
        {options.cityOptions.map((option: City) => (
          <Option key={option.id} value={option.cityName}>{option.cityName}</Option>
        ))}
      </Select>
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
          <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
          {/* eslint-disable-next-line */}
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
        inputType: col.dataIndex === 'phoneNumber' ? 'number' : 'text',
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
        bordered
        dataSource={originData}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};