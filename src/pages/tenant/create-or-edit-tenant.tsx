import { Checkbox, Form, Input, Modal,Typography  } from 'antd'
import React, { useState } from 'react'
const { Text, Link } = Typography;
export interface ICreateOrEditTenantProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: () => void;
}
const CreateOrEditTenant = ({ visible, onCancel,modalType, onOk }: ICreateOrEditTenantProps) => {
  const [isHostDatabase,setIsHostDataBase] = useState(false)
  const [isPasswordStand,setIsPasswordStand] = useState(true)
  return (
    <Modal
    visible={visible}
    onCancel={onCancel}
    title={modalType}
    okText="Ok"
    cancelText="Đóng"
    width={648}
    onOk={onOk}
    >
      <Form layout="vertical" className='mt-5'>
        <Form.Item>
          <Text strong>Tenant Name</Text>
          <Input size="large"  placeholder="Nhập tên tenant" required/>
        </Form.Item>
        <Form.Item >
          <Text strong>Display Name</Text>
          <Input size="large"  placeholder="input placeholder" required/>
        </Form.Item>
        <Form.Item >
          <Text strong>Email quản trị</Text>
          <Input size="large"  placeholder="Nhập email quản trị" required/>
        </Form.Item>
        <Form.Item >
        <Checkbox value={isHostDatabase} checked={isHostDatabase} onChange={()=>{setIsHostDataBase(!isHostDatabase)}}>Dùng chung cơ sở dữ liệu với Host</Checkbox>
        </Form.Item>
        <Form.Item hidden={isHostDatabase}>
          <Text strong>Connection Strings</Text>
          <Input size="large"  placeholder="input placeholder" />
        </Form.Item>
        <Form.Item >
        <Checkbox value={isPasswordStand} checked={isPasswordStand} onChange={(()=>{setIsPasswordStand(!isPasswordStand)})}>Mật khẩu mặc định</Checkbox>
        </Form.Item>
        <Form.Item hidden={isPasswordStand}>
          <Text strong>Mật khẩu quản trị</Text>
          <Input size="large"  placeholder="input placeholder" />
        </Form.Item>
        <Form.Item hidden={isPasswordStand}>
          <Text strong>Nhập lại mật khẩu quản tri</Text>
          <Input size="large"  placeholder="input placeholder" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateOrEditTenant