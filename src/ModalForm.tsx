import {Button, Select, Form, Input, Modal, Row, Col, Space } from 'antd';
import { useState } from 'react';
import { Users } from './data';
import FormItem from 'antd/es/form/FormItem';

const {Option} = Select;

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: Users) => void;
    onCancel: () => void;
  }
  
const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
    open,
    onCreate,
    onCancel,
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
            <Input type="phone" />
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
            <Input type="link" />
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
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="city" 
            label="City">
            <Input type="text" />
          </Form.Item>
          </Col>
          </Space>
          </Row>
        </Form>
      </Modal>
    );
};

interface ModalFormProp {
  data: any;
  onShow: (data: any) => void;
}

const ModalForm: React.FC<ModalFormProp> = ({data, onShow}) => {
    const [open, setOpen] = useState(false);

    const normalizeValue =  (values: any) => {
      const currentDate = new Date().toISOString().substring(0, 10);
      values.id = data.length + 1;
      values.updatedAt = currentDate;
      values.createdAt = currentDate;

      const jobType = values.jobType;
      const cityName = values.city;

      values.jobType = {
        id: 1,
        jobType: jobType,
      }
      values.city = {
        id: 1,
        cityName: cityName,
      }
      for(const key in values) {
        return 'Not provided' ? values[key] === undefined : values[key];
      }
    }

    const onCreate = (values: any) => {
        normalizeValue(values);
        console.log(values);
      
        onShow([values, ...data]);
        console.log("Received: ", data);
        setOpen(false);
    };

    return (
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
                onCreate={onCreate}
                onCancel={() => {
                setOpen(false);
                }}
            />
        </div>
    )
};

export default ModalForm;