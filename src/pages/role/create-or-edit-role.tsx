import { Checkbox, Form, FormInstance, Input, Modal, Tabs } from 'antd';
import { Component, ReactNode, useState } from 'react';
import { GetAllPermissionsOutput } from '../../services/role/dto/getAllPermissionsOutput';
import TabPane from 'antd/es/tabs/TabPane';

export interface ICreateOrEditRoleProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    onOk: () => void;
    permissions: GetAllPermissionsOutput[];
}

const CreateOrEditRole = ({
    visible,
    onCancel,
    modalType,
    onOk,
    permissions
}: ICreateOrEditRoleProps) => {
    const [grantedPermissions, setGrantedPermissions] = useState([] as string[]);
    const [searchValue, setSearchValue] = useState('');
    const [checkAll, setCheckAll] = useState(false);

    const options = permissions.map((x: GetAllPermissionsOutput) => {
        return { label: x.displayName, value: x.name };
    });

    const handleCheckboxChange = (checkedValues: any) => {
        setGrantedPermissions(checkedValues);
        setCheckAll(false);
    };

    const handleSearchChange = (e: any) => {
        setSearchValue(e.target.value);
    };

    const handleCheckAllChange = (e: any) => {
        if (e.target.checked) {
            const allValues = options.map((option) => option.value);
            setGrantedPermissions(allValues);
            setCheckAll(true);
        } else {
            setGrantedPermissions([]);
            setCheckAll(false);
        }
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <Modal
            visible={visible}
            cancelText="Cancel"
            okText="OK"
            onCancel={onCancel}
            title={modalType}
            onOk={onOk}
            destroyOnClose={true}
            width={648}>
            <Form layout="vertical">
                <Tabs defaultActiveKey={'role'} size={'small'} tabBarGutter={64}>
                    <TabPane tab="RoleDetails" key={'role'}>
                        <Form.Item label="RoleName" name={'name'}>
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item label="DisplayName" name={'displayName'}>
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item label="Description" name={'description'}>
                            <Input size="large" />
                        </Form.Item>
                    </TabPane>
                    <TabPane tab="RolePermission" key={'permission'} forceRender={true}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}></div>
                        <div style={{ marginBottom: 16 }}>
                            <Input
                                placeholder="Search"
                                size="large"
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                            <Checkbox checked={checkAll} onChange={handleCheckAllChange}>
                                Check All
                            </Checkbox>
                            {filteredOptions.map((option) => (
                                <div>
                                    <Checkbox
                                        key={option.value}
                                        value={option.value}
                                        onChange={(e) => handleCheckboxChange(e.target.value)}
                                        checked={grantedPermissions.includes(option.value)}>
                                        {option.label}
                                    </Checkbox>
                                </div>
                            ))}
                        </div>
                    </TabPane>
                </Tabs>
            </Form>
        </Modal>
    );
};
export default CreateOrEditRole;
