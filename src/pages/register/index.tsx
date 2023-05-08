import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './register.css';
import { Avatar, Col, Form, Input, Row } from 'antd';
import logo from '../../images/Lucky_beauty.jpg';
const RegisterScreen: React.FC = () => {
    const [confirm, setConfirm] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = (event: any) => {
        event.preventDefault();
        setConfirm(true);
    };
    if (confirm) {
        return (
            <Navigate
                to={{
                    pathname: '/login'
                }}
            />
        );
    }
    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <Row className="align-items-center justify-content-centerregister-content">
                <Col>
                    <div
                        className="rounded border shadow "
                        style={{ width: '660px', padding: ' 0px 54px' }}>
                        <Avatar
                            style={{ margin: '24px 244px', width: 64, height: 64 }}
                            src={logo}
                        />
                        <label
                            className="login-label"
                            style={{
                                margin: '12px 128px',
                                height: '42px',
                                width: '295px',
                                fontSize: '32px',
                                lineHeight: '42px',
                                textAlign: 'center',
                                color: '#333233'
                            }}>
                            Đăng ký
                        </label>
                        <Form onFinish={handleSubmit} layout="vertical">
                            <Form.Item
                                name="hoVaTen"
                                label={
                                    <span className="login-label">
                                        Họ và tên <span style={{ color: 'red' }}>*</span>
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập họ và tên'
                                    }
                                ]}>
                                <Input size="large" placeholder="Nhập họ và tên" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label={
                                    <span className="login-label">
                                        Họ và tên <span style={{ color: 'red' }}>*</span>
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập họ và tên'
                                    }
                                ]}>
                                <Input size="large" placeholder="Nhập họ và tên" />
                            </Form.Item>
                            <Row gutter={8}>
                                <Col span={12}>
                                    <Form.Item
                                        name="storeName"
                                        label={<span className="login-label">Tên cửa hàng</span>}>
                                        <Input size="large" placeholder="Nhập tên cửa hàng" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="soDienThoai"
                                        label={<span className="login-label">Số điện thoại</span>}>
                                        <Input size="large" placeholder="Nhập số điện thoại" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="quanHuyen"
                                        label={<span className="login-label">Quận / huyện</span>}>
                                        <Input size="large" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="tinhThanh"
                                        label={<span className="login-label">Tỉnh/Thành phố</span>}>
                                        <Input size="large" placeholder="" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="linhVuc"
                                label={<span className="login-label">Lĩnh vực quan tâm</span>}>
                                <Input size="large" placeholder="Nhập họ và tên" />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="quanHuyen"
                                        label={
                                            <span className="login-label">
                                                Mật khẩu <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }>
                                        <Input size="large" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="tinhThanh"
                                        label={
                                            <span className="login-label">
                                                Nhập lại mật khẩu{' '}
                                                <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }>
                                        <Input size="large" placeholder="" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <button
                                type="submit"
                                className="btn btn-primary btn-register"
                                onClick={handleSubmit}>
                                <span className="text-login">Đăng ký</span>
                            </button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default RegisterScreen;
