import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import './register.css';
import { Avatar, Col, Form, Input, Row, Select } from 'antd';
import logo from '../../images/Lucky_beauty.jpg';
import ApiVN from './api_VN';

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
        <div className="register-page">
            <div className="logo-register">
                <div className="logo-image">
                    <img src={logo} alt="Lucky Beauty" />
                </div>
                <div className="logo-text">Lucky Beauty</div>
            </div>
            <Row className="align-items-center justify-content-center register-content">
                <Col className="register-col">
                    <div className="register-inner">
                        <h1>Đăng ký</h1>
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
                                <Input size="large" placeholder="Nhập họ và tên" required />
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
                                        message: 'Email'
                                    }
                                ]}>
                                <Input size="large" placeholder="Nhập địa chỉ email" required />
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
                                <ApiVN />
                            </Row>
                            <Form.Item
                                style={{ display: 'none' }}
                                name="linhVuc"
                                label={<span className="login-label">Lĩnh vực quan tâm</span>}>
                                <Input size="large" placeholder="Nhập họ và tên" />
                            </Form.Item>
                            <Row gutter={16} className="passwords">
                                <Col span={12} className="w-100">
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
                                <Col span={12} className="w-100">
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
