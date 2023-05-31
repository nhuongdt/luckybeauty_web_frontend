import {
    Form,
    Input,
    Modal,
    Tabs,
    Checkbox,
    Select,
    FormInstance,
    Col,
    Row,
    Card,
    Typography
} from 'antd';

import TabPane from 'antd/es/tabs/TabPane';
import React from 'react';
import { GetRoles } from '../../../services/user/dto/getRolesOuput';
import { SuggestNhanSuDto } from '../../../services/suggests/dto/SuggestNhanSuDto';
import rules from './createOrUpdateUser.validation';
import { CloudUploadOutlined, FileImageOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Text, Title } = Typography;
export interface ICreateOrEditUserProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    onOk: () => void;
    formRef: React.RefObject<FormInstance>;
    userId: number;
    roles: GetRoles[];
    suggestNhanSu: SuggestNhanSuDto[];
}
class CreateOrEditUser extends React.Component<ICreateOrEditUserProps> {
    formRef = this.props.formRef;
    state = { confirmDirty: false };
    compareToFirstPassword = (rule: any, value: any, callback: any) => {
        const form = this.formRef.current;

        if (value && value !== form?.getFieldValue('password')) {
            return Promise.reject('Two passwords that you enter is inconsistent!');
        }
        return Promise.resolve();
    };

    validateToNextPassword = (rule: any, value: any, callback: any) => {
        const { validateFields, getFieldValue } = this.formRef.current!;

        this.setConfirmDirty(value);

        if (value && this.state.confirmDirty && getFieldValue('confirm')) {
            validateFields(['confirm']);
        }

        return Promise.resolve();
    };

    setConfirmDirty = (value: boolean) => {
        this.setState({
            confirmDirty: value
        });
    };
    render(): React.ReactNode {
        const { visible, onCancel, modalType, onOk, userId, roles, suggestNhanSu } = this.props;

        const options = roles.map((x: GetRoles) => {
            const test = { label: x.displayName, value: x.normalizedName };
            return test;
        });
        return (
            <Modal
                visible={visible}
                title={<Title level={3}>{modalType}</Title>}
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
                <Form layout="vertical" ref={this.props.formRef}>
                    <Tabs defaultActiveKey={'user'} size={'large'} tabBarGutter={64}>
                        <TabPane tab="User detail" key={'user'}>
                            <Row>
                                <Col span={8}>
                                    <Card
                                        style={{
                                            border: '1px solid #E5D6E1',
                                            padding: 3,
                                            marginLeft: 3,
                                            marginRight: 1,
                                            marginTop: 5,
                                            width: 150,
                                            height: 150
                                        }}
                                        className="text-center">
                                        <div style={{ paddingTop: 5 }}>
                                            <FileImageOutlined
                                                height={32}
                                                width={32}
                                                style={{ color: '#7C3367' }}
                                                className="icon-size text-center"
                                                twoToneColor="#7C3367"
                                            />
                                        </div>
                                        <div
                                            style={{ paddingTop: 10, paddingBottom: 5 }}
                                            className="text-center">
                                            <CloudUploadOutlined
                                                style={{ paddingRight: '5px', color: '#7C3367' }}
                                            />
                                            <span style={{ color: '#7C3367' }}>Tải ảnh lên</span>
                                        </div>
                                        <Text>
                                            File định dạng <Text strong>jpeg, png</Text>
                                        </Text>
                                    </Card>
                                </Col>
                                <Col span={16}>
                                    <Form.Item
                                        name="nhanSuId"
                                        label="Nhân sự đã có"
                                        rules={[{ required: false }]}>
                                        <Select size="large">
                                            {suggestNhanSu.map((item) => {
                                                return (
                                                    <Option value={item.id}>
                                                        {item.tenNhanVien}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label={'Họ'} name={'name'} rules={rules.name}>
                                        <Input
                                            size="large"
                                            required
                                            placeholder="Nhập họ nhân sự"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={'Tên Lót'}
                                        name={'surname'}
                                        rules={rules.surname}>
                                        <Input
                                            size="large"
                                            required
                                            placeholder="Nhập tên lót nhân sự"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                label={'Email'}
                                name={'emailAddress'}
                                rules={rules.emailAddress as []}>
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item label={'Số điện thoại'}>
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item
                                rules={rules.userName}
                                label={'Tên truy cập'}
                                name={'userName'}
                                hidden={userId === 0 ? false : true}>
                                <Input size="large" required />
                            </Form.Item>
                            {userId === 0 ? (
                                <>
                                    <Form.Item
                                        label={'Mật khẩu'}
                                        name={'password'}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your password!'
                                            },
                                            {
                                                validator: this.validateToNextPassword
                                            }
                                        ]}>
                                        <Input size="large" type="password" />
                                    </Form.Item>
                                    <Form.Item
                                        label={'Nhập lại mật khẩu'}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your confirm password!'
                                            },
                                            {
                                                validator: this.compareToFirstPassword
                                            }
                                        ]}>
                                        <Input size="large" type="password" />
                                    </Form.Item>
                                </>
                            ) : null}
                            <Form.Item name={'isActive'} valuePropName={'checked'}>
                                <Checkbox>Kích hoạt</Checkbox>
                            </Form.Item>
                        </TabPane>
                        <TabPane tab="Role" key={'role'}>
                            <Form.Item name={'roleNames'}>
                                <Checkbox.Group options={options} />
                            </Form.Item>
                        </TabPane>
                    </Tabs>
                </Form>
            </Modal>
        );
    }
}

export default CreateOrEditUser;
