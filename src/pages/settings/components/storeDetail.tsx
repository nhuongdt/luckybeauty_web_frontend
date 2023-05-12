import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, Input, Row, Space, Typography, Upload } from 'antd';
import { Component, ReactNode } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
const { Title } = Typography;
const { Dragger } = Upload;
class StoreDetail extends Component {
    render(): ReactNode {
        return (
            <div className="container-fluid bg-white">
                <div style={{ height: '70px' }}>
                    <Row align={'middle'} justify={'space-between'}>
                        <Col span={12}>
                            <div>
                                <div className="pt-2">
                                    <div>
                                        <h4>Chi tiết cửa hàng</h4>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Space align="center" size="middle">
                                    <Button
                                        size="large"
                                        className="btn btn-add-item"
                                        onClick={() => {
                                            console.log('ok');
                                        }}>
                                        Cập nhật
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="page-content pt-2">
                    <Form layout="vertical">
                        <Row gutter={16}>
                            <Col span={7}>
                                <Dragger height={233}>
                                    <Title level={5}>Logo cửa hàng</Title>
                                    <p className="ant-upload-drag-icon">
                                        <Avatar
                                            icon={<AiOutlineCamera size={50} />}
                                            style={{ width: '100px', height: '100px' }}></Avatar>
                                    </p>
                                    <p className="ant-upload-hint">
                                        Định dạng *.jpeg, *.jpg, *.png
                                    </p>
                                    <p className="ant-upload-hint">Kích thước tối thiểu 3M</p>
                                </Dragger>
                            </Col>
                            <Col span={17}>
                                <Title level={5}>Thông tin cửa hàng</Title>
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <Form.Item label="Tên cửa hàng" name={'storeName'}>
                                            <Input size={'large'} placeholder="Nhập tên" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Địa chỉ" name={'address'}>
                                            <Input size={'large'} placeholder="Nhập địa chỉ" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <Form.Item label="Số điện thoại" name={'phoneNumber'}>
                                            <Input
                                                size={'large'}
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Mã số thuế" name={'maSoThue'}>
                                            <Input size={'large'} placeholder="Nhập mã số thuế" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <hr></hr>
                                <Title level={5}>Liên kết trực tuyến</Title>
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <Form.Item label="Website" name={'website'}>
                                            <Input size={'large'} placeholder="Nhập " />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Facebook" name={'facebook'}>
                                            <Input
                                                size={'large'}
                                                placeholder="Nhập Facebooking link"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <Form.Item label="Instagram" name={'instagram'}>
                                            <Input
                                                size={'large'}
                                                placeholder="Nhập Instatgram Url"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Twitter" name={'twitter'}>
                                            <Input size={'large'} placeholder="Nhập Twitter Url" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
}
export default StoreDetail;
