import {Button, Select, Form, Input, Modal, Row, Col, Space } from 'antd';
import { useContext, useState } from 'react';
import { Users, City, Job } from './DataInterface';
import FormItem from 'antd/es/form/FormItem';
import { DataContext, LoadingContext, OptionContext } from './ItemContex';

const {Option} = Select;

interface CollectionCreateFormProps {
    open: boolean;
    options: any;
    onCreate: (values: Users) => void;
    onCancel: () => void;
  }
  
const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
    open,
    onCreate,
    onCancel,
    options
  }) => {
    const [form] = Form.useForm();

    return (
      <Modal
        open={open}
        title="Create a new user"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
        >
        <Row> 
          <Space size='large'>
          <Col>
          <Form.Item
            name="fullName"
            label="Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="email" 
            label="Email"
            rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item 
          name="phoneNumber" 
          label="Phone"
          rules={[{ required: true, message: 'Please input your phone number!' }]}>
            <Input type="tel" />
          </Form.Item>
          <Form.Item
            name="address" 
            label="Address">
            <Input type="textarea" />
          </Form.Item>
          </Col>
          <Col>
          <FormItem
           name="avatar"
           label="Avatar" >
            <Input type="url" />
          </FormItem>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
          <Select
            placeholder="Select an option"
            allowClear
          >
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>
        <Form.Item
            name="jobType" 
            label="Job">
            <Select
              placeholder="Select an option"
              labelInValue
              allowClear
            >
              {options.jobData?.map((option: Job) => (
                <Option key={option.id} value={option.jobType}>{option.jobType}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="city" 
            label="City">
            <Select
              placeholder="Select an option"
              labelInValue
              allowClear
            >
              {options.cityData?.map((option: City) => (
                <Option key={option.id} value={option.cityName}>{option.cityName}</Option>
              ))}
            </Select>
          </Form.Item>
          </Col>
          </Space>
          </Row>
        </Form>
      </Modal>
    );
};

const createUser = async(data: Users) => {
  const res = await fetch(`https://mock-api.dev.apps.xplat.fis.com.vn/users/`, {
    method: 'POSt',
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

const ModalForm: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useContext(DataContext);
    const options = useContext(OptionContext);
    const loading = useContext(LoadingContext);

    const normalizeValue =  (values: any) => {
      const currentDate = new Date().toISOString().substring(0, 10);
      values.id = data.length + 1;
      values.createdAt = currentDate;
      values.updatedAt = currentDate;

      values.cityId = values.city.key;
      values.city = {
        id: values.city.key,
        cityName: values.city.value,
      }

      values.jobTypeId = values.jobType.key;
      values.jobType = {
        id: values.jobType.key,
        jobType: values.jobType.value,
      }

      for(const key in values) {
        return 'Not provided' ? values[key] === undefined : values[key];
      }
    }

    const onCreate = async (values: any) => {
      normalizeValue(values);
      setData([...data, values]);
      //await createUser(values); 
      setOpen(false);
    };

    return (
        !loading &&
        <div>
            <Button
                type="primary"
                onClick={() => {
                setOpen(true);
                }}
            >
                New User
            </Button>
            <CollectionCreateForm
                open={open}
                options={options}
                onCreate={onCreate}
                onCancel={() => {
                setOpen(false);
                }}
            />
        </div>
    )
};

export default ModalForm;