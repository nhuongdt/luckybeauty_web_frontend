import {
    Card,
    Col,
    Form,
    FormInstance,
    Grid,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Typography
} from 'antd';
import { SuggestNhomKhachDto } from '../../../services/suggests/dto/SuggestNhomKhachDto';
import { SuggestNguonKhachDto } from '../../../services/suggests/dto/SuggestNguonKhachDto';
import { CloudUploadOutlined, FileImageOutlined } from '@ant-design/icons';
import khachHangRules from './create-or-edit-customer.validate';
import { Component, ReactNode } from 'react';
export interface ICreateOrEditUserProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    onOk: () => void;
    formRef: React.RefObject<FormInstance>;
    suggestNguonKhach: SuggestNguonKhachDto[];
    suggestNhomKhach: SuggestNhomKhachDto[];
}
const { Text, Title } = Typography;
class CreateOrEditCustomerDialog extends Component<ICreateOrEditUserProps> {
    render(): ReactNode {
        const { visible, onCancel, modalType, onOk, formRef, suggestNguonKhach, suggestNhomKhach } =
            this.props;
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
                width={1038}>
                <Form layout="vertical" ref={formRef}>
                    <Row gutter={16}>
                        <Col span={16}>
                            <Title level={4} className="mt-3">
                                Thông tin chi tiết
                            </Title>
                            <Form.Item
                                label="Họ và tên"
                                name={'tenKhachHang'}
                                rules={khachHangRules.tenKhachHang}>
                                <Input size="large" />
                            </Form.Item>
                            <Row gutter={4}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Số điện thoại"
                                        name={'soDienThoai'}
                                        rules={khachHangRules.soDienThoai}>
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Địa chỉ" name={'diaChi'}>
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={4}>
                                <Col span={12}>
                                    <Form.Item label="Ngày sinh" name={'ngaySinh'}>
                                        <Input size="large" type="date" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Giới tính" name={'gioiTinh'}>
                                        <Select size="large" defaultValue={'Chọn giới tính'}>
                                            <Select.Option value={1}>Nam</Select.Option>
                                            <Select.Option value={2}>Nữ</Select.Option>
                                            <Select.Option value={0}>Khác</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={4}>
                                <Col span={12}>
                                    <Form.Item label="Nguồn khách" name={'idNguonKhach'}>
                                        <Select size="large" defaultValue={'Chọn nguồn khách'}>
                                            {suggestNguonKhach.map((item) => {
                                                return (
                                                    <Select.Option value={item.id}>
                                                        {item.tenNguonKhach}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Nhóm khách" name={'idNhomKhach'}>
                                        <Select size="large" defaultValue={'Chọn nhóm khách'}>
                                            {suggestNhomKhach.map((item) => {
                                                return (
                                                    <Select.Option value={item.id}>
                                                        {item.tenNhomKhach}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Ghi chú" name={'moTa'}>
                                <Input.TextArea size="large" rows={4} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Row>
                                <Card
                                    style={{
                                        border: '1px solid #E5D6E1',
                                        padding: 3,
                                        marginLeft: 3,
                                        marginRight: 1,
                                        marginTop: 5,
                                        width: 350,
                                        height: 250
                                    }}
                                    className="text-center">
                                    <div style={{ paddingTop: 45 }}>
                                        <FileImageOutlined
                                            height={46}
                                            width={46}
                                            style={{ color: '#7C3367' }}
                                            className="icon-size text-center"
                                            twoToneColor="#7C3367"
                                        />
                                    </div>
                                    <div
                                        style={{ paddingTop: 40, paddingBottom: 10 }}
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
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}
export default CreateOrEditCustomerDialog;
