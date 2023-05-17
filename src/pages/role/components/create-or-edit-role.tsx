import { Checkbox, Form, FormInstance, Input, Modal, Tabs } from 'antd';
import { Component, ReactNode, useState } from 'react';
import { GetAllPermissionsOutput } from '../../../services/role/dto/getAllPermissionsOutput';
import TabPane from 'antd/es/tabs/TabPane';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import rules from './createOrUpdateRole.validation';

export interface ICreateOrEditRoleProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    onOk: () => void;
    permissions: GetAllPermissionsOutput[];
    formRef: React.RefObject<FormInstance>;
}
interface ICreateOrEditRoleState {
    filteredPermissions: GetAllPermissionsOutput[];
    checkedAll: boolean;
}
class CreateOrEditRole extends Component<ICreateOrEditRoleProps, ICreateOrEditRoleState> {
    constructor(props: ICreateOrEditRoleProps) {
        super(props);

        this.state = {
            filteredPermissions: props.permissions,
            checkedAll: false
        };
    }
    handleSearch = (value: string) => {
        const { permissions } = this.props;
        const filtered = permissions.filter((x: GetAllPermissionsOutput) =>
            x.displayName.toLowerCase().includes(value.toLowerCase())
        );
        this.setState({ filteredPermissions: filtered });
    };

    handleCheckAll = (e: CheckboxChangeEvent) => {
        const { permissions, formRef } = this.props;
        const { checked } = e.target;
        this.setState({ checkedAll: checked });

        const value = checked ? permissions.map((x) => x.name) : [];
        formRef.current?.setFieldsValue({
            grantedPermissions: value
        });
    };
    render(): ReactNode {
        const { visible, onCancel, modalType, onOk, permissions, formRef } = this.props;
        const { filteredPermissions, checkedAll } = this.state;

        const options = permissions.map((x: GetAllPermissionsOutput) => {
            return { label: x.displayName, value: x.name };
        });

        const checkboxStyle = {
            display: 'flex',
            flexWrap: 'wrap'
        };
        return (
            <Modal
                visible={visible}
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
                okText="Lưu"
                onCancel={onCancel}
                onOk={onOk}
                title={modalType}
                destroyOnClose={true}
                width={648}>
                <Form layout="vertical" ref={formRef}>
                    <Tabs defaultActiveKey={'role'} size={'small'} tabBarGutter={64}>
                        <TabPane tab="RoleDetails" key={'role'}>
                            <Form.Item label="RoleName" name={'name'} rules={rules.name}>
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item
                                label="DisplayName"
                                name={'displayName'}
                                rules={rules.displayName}>
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item label="Description" name={'description'}>
                                <Input size="large" />
                            </Form.Item>
                        </TabPane>
                        <TabPane tab={'RolePermission'} key={'permission'} forceRender={true}>
                            <div style={{ marginBottom: '12px' }}>
                                <Input.Search
                                    placeholder={'Search Permissions'}
                                    onSearch={this.handleSearch}
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <Checkbox checked={checkedAll} onChange={this.handleCheckAll}>
                                    {'Check All'}
                                </Checkbox>
                            </div>
                            <Form.Item
                                name={'grantedPermissions'}
                                valuePropName={'value'}
                                style={{ maxHeight: 400, overflowY: 'auto' }}>
                                <Checkbox.Group
                                    options={options}
                                    style={{ display: 'flex', flexDirection: 'column' }}>
                                    {options.map((option) => (
                                        <Checkbox key={option.value}>{option.label}</Checkbox>
                                    ))}
                                </Checkbox.Group>
                            </Form.Item>
                        </TabPane>
                    </Tabs>
                </Form>
            </Modal>
        );
    }
}

export default CreateOrEditRole;
