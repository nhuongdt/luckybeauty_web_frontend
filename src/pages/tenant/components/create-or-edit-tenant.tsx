import { Checkbox, Col, Form, FormInstance, Input, Modal, Typography } from 'antd';

import rules from './createOrUpdateTenant.validation';
import React, { Component, useState } from 'react';
const { Text, Link } = Typography;

export interface ICreateOrEditTenantProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    tenantId: number;
    onOk: () => void;
    formRef: React.RefObject<FormInstance>;
}
class CreateOrEditTenant extends Component<ICreateOrEditTenantProps> {
    state = {
        isHostDatabase: false
    };
    render(): React.ReactNode {
        const { visible, onCancel, modalType, tenantId, onOk, formRef } = this.props;
        const { isHostDatabase } = this.state;
        return (
            <Modal
                visible={visible}
                title={modalType}
                okText="Lưu"
                cancelButtonProps={{
                    style: {
                        backgroundColor: '#FFFFFF',
                        color: '#965C85',
                        border: '1px solid #965C85',
                        borderRadius: 4
                    }
                }}
                cancelText="Hủy"
                okButtonProps={{
                    style: {
                        backgroundColor: '#B085A4',
                        color: '#FFFAFF',
                        border: '1px solid #965C85',
                        borderRadius: 4
                    }
                }}
                onCancel={onCancel}
                onOk={onOk}
                width={648}>
                <Form layout="vertical" className="mt-5" ref={formRef}>
                    <Form.Item rules={rules.tenancyName} name={'tenancyName'} label={'Tenant Name'}>
                        {/* <Text strong>Tenant Name</Text> */}
                        <Input size="large" placeholder="Nhập tên tenant" required />
                    </Form.Item>
                    <Form.Item rules={rules.name} name={'name'} label={'Name'}>
                        {/* <Text strong>Display Name</Text> */}
                        <Input size="large" placeholder="input placeholder" />
                    </Form.Item>

                    {tenantId !== 0 ? null : (
                        <Form.Item
                            rules={rules.adminEmailAddress as []}
                            label={'Email quản trị'}
                            name={'adminEmailAddress'}>
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
                                        this.setState({ isHostDatabase: !isHostDatabase });
                                    }}>
                                    Dùng chung cơ sở dữ liệu với Host
                                </Checkbox>
                            </Form.Item>
                            <Form.Item
                                hidden={isHostDatabase}
                                label={'Chuỗi kết nối'}
                                name={'connectionString'}>
                                {/* <Text strong>Connection Strings</Text> */}
                                <Input size="large" placeholder="input placeholder" />
                            </Form.Item>
                            <Col className="mt-3 mb-3 text-center">
                                {'Mật khẩu mặc định là : 123qwe'}
                            </Col>
                        </>
                    )}

                    <Form.Item name={'isActive'} valuePropName={'checked'}>
                        <Checkbox name={'isActive'}>IsActive</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}
export default CreateOrEditTenant;
