<<<<<<< .mine
import {
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  Modal,
  Typography,
} from "antd";

import rules from "./createOrUpdateTenant.validation";
import React, { useState } from "react";
=======
import { Checkbox, Form, Input, Modal, Typography } from 'antd';
import React, { useState } from 'react';










>>>>>>> .theirs
const { Text, Link } = Typography;

export interface ICreateOrEditTenantProps {
<<<<<<< .mine
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  tenantId: number;
  onOk: () => void;
=======
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    onOk: () => void;

>>>>>>> .theirs
  formRef: React.RefObject<FormInstance>;
}
<<<<<<< .mine
const CreateOrEditTenant = ({
  visible,
  onCancel,
  modalType,
  tenantId,
  onOk,
  formRef,
}: ICreateOrEditTenantProps) => {
  const [isHostDatabase, setIsHostDataBase] = useState(false);
  //const [isPasswordStand, setIsPasswordStand] = useState(true);
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
      <Form layout="vertical" className="mt-5" ref={formRef}>
        <Form.Item
          rules={rules.tenancyName}
          name={"tenancyName"}
          label={"Tenant Name"}
        >
          {/* <Text strong>Tenant Name</Text> */}
          <Input size="large" placeholder="Nhập tên tenant" required />
        </Form.Item>
        <Form.Item rules={rules.name} name={"name"} label={"Name"}>
          {/* <Text strong>Display Name</Text> */}
          <Input size="large" placeholder="input placeholder" />
        </Form.Item>

        {tenantId !== 0 ? null : (
          <Form.Item
            rules={rules.adminEmailAddress as []}
            label={"Email quản trị"}
            name={"adminEmailAddress"}
          >
            {/* <Text strong>Email quản trị</Text> */}
            <Input size="large" placeholder="Nhập email quản trị" required />
          </Form.Item>
        )}
        {tenantId !== 0 ? null : (
          <>
            <Form.Item>
              <Checkbox
                value={isHostDatabase}
                checked={isHostDatabase}
                onChange={() => {
                  setIsHostDataBase(!isHostDatabase);
                }}
              >
                Dùng chung cơ sở dữ liệu với Host
              </Checkbox>
            </Form.Item>
            <Form.Item
              hidden={isHostDatabase}
              label={"Chuỗi kết nối"}
              name={"connectionString"}
            >
              {/* <Text strong>Connection Strings</Text> */}
              <Input size="large" placeholder="input placeholder" />
            </Form.Item>
          </>
        )}
        <Col className="mt-3 mb-3 text-center">{"Mật khẩu mặc định là : 123qwe"}</Col>
      </Form>
    </Modal>
  );
};
=======
const CreateOrEditTenant = ({ visible, onCancel, modalType, onOk }: ICreateOrEditTenantProps) => {
    const [isHostDatabase, setIsHostDataBase] = useState(false);
    const [isPasswordStand, setIsPasswordStand] = useState(true);
    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            title={modalType}
            okText="Ok"
            cancelText="Đóng"
            width={648}
            onOk={onOk}>
            <Form layout="vertical" className="mt-5">
                <Form.Item>
                    <Text strong>Tenant Name</Text>
                    <Input size="large" placeholder="Nhập tên tenant" required />
                </Form.Item>
                <Form.Item>
                    <Text strong>Display Name</Text>
                    <Input size="large" placeholder="input placeholder" required />
                </Form.Item>
                <Form.Item>
                    <Text strong>Email quản trị</Text>
                    <Input size="large" placeholder="Nhập email quản trị" required />
                </Form.Item>
                <Form.Item>
                    <Checkbox
                        value={isHostDatabase}
                        checked={isHostDatabase}
                        onChange={() => {
                            setIsHostDataBase(!isHostDatabase);
                        }}>
                        Dùng chung cơ sở dữ liệu với Host
                    </Checkbox>
                </Form.Item>
                <Form.Item hidden={isHostDatabase}>
                    <Text strong>Connection Strings</Text>
                    <Input size="large" placeholder="input placeholder" />
                </Form.Item>
                <Form.Item>
                    <Checkbox
                        value={isPasswordStand}
                        checked={isPasswordStand}
                        onChange={() => {
                            setIsPasswordStand(!isPasswordStand);
                        }}>
                        Mật khẩu mặc định
                    </Checkbox>
                </Form.Item>
                <Form.Item hidden={isPasswordStand}>
                    <Text strong>Mật khẩu quản trị</Text>
                    <Input size="large" placeholder="input placeholder" />
                </Form.Item>
                <Form.Item hidden={isPasswordStand}>
                    <Text strong>Nhập lại mật khẩu quản tri</Text>
                    <Input size="large" placeholder="input placeholder" />
                </Form.Item>
            </Form>
        </Modal>
    );
};











>>>>>>> .theirs

export default CreateOrEditTenant;


//  <Form.Item>
//               <Checkbox
//                 value={isPasswordStand}
//                 checked={isPasswordStand}
//                 onChange={() => {
//                   setIsPasswordStand(!isPasswordStand);
//                 }}
//               >
//                 Mật khẩu mặc định
//               </Checkbox>
//             </Form.Item>
//             {isPasswordStand===true ? <Col className="mt-3 mb-3">{"Mật khẩu mặc định là : 123qwe"}</Col> : null}
            
//             {isPasswordStand === true ? null : (
//               <>
//                 <Form.Item rules={rules.password} label={'Mật khẩu quản trị'}>
//                   {/* <Text strong>Mật khẩu quản trị</Text> */}
//               //     <Input size="large" placeholder="input placeholder" />
//               //   </Form.Item>
//               //   <Form.Item rules={rules.confirmPassword} label={'Nhập lại mật khẩu quản trị'}>
//               //     {/* <Text strong>Nhập lại mật khẩu quản tri</Text> */}
//               //     <Input size="large" placeholder="input placeholder" />
//               //   </Form.Item>
//               // </>
//             //)} 