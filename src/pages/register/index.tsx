import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './register.css';
import { Col, Form, Input, Row, Checkbox, Progress } from 'antd';
import logo from '../../images/Lucky_beauty.jpg';
import ApiVN from './api_VN';
import { Link } from 'react-router-dom';

const RegisterScreen: React.FC = () => {
    const [confirm, setConfirm] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = (event: any) => {
        event.preventDefault();
        setConfirm(true);

        if (confirm) {
            return (
                <Navigate
                    to={{
                        pathname: '/login'
                    }}
                />
            );
        }
    };
    const [progress, setProgress] = useState(0);

    // const handleValuesChange = (changedValues: any, allValues: any) => {
    //     const completedFields = Object.values(allValues).filter((value) => {
    //         return value !== undefined && value !== null && value !== '';
    //     });
    //     const progressValue = (completedFields.length / Object.keys(allValues).length) * 100;
    //     setProgress(progressValue);
    // };
    const handleValuesChange = (_: any, values: any) => {
        const { hoVaTen, email, storeName, soDienThoai, password, confirmPassword } = values;
        // Kiểm tra định dạng dữ liệu và cập nhật tiến độ progress tùy thuộc vào điều kiện
        //  Tính toán giá trị mới cho progress dựa trên các trường đã nhập đúng định dạng

        // Tính toán giá trị mới cho progress
        let newProgress = 0;

        if (hoVaTen && hoVaTen.match(/^[a-zA-Z\s]*$/)) newProgress += 16.66666666666667;
        if (email && email.match(/^\S+@\S+$/)) newProgress += 16.66666666666667;
        if (soDienThoai && soDienThoai.match(/^\d+$/)) newProgress += 16.66666666666667;
        if (password && password.length >= 1) newProgress += 16.66666666666667;
        if (storeName && storeName.length >= 1) newProgress += 16.66666666666667;
        if (confirmPassword === password) newProgress += 16.66666666666667;

        setProgress(newProgress);
    };
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
                        <Form
                            onFinish={handleSubmit}
                            layout="vertical"
                            onValuesChange={handleValuesChange}
                            name="registration">
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
                                        message: 'Vui lòng nhập họ và tên'
                                    },
                                    {
                                        pattern: /^[a-zA-Z\s]*$/,
                                        message: 'Họ tên chỉ chứa chữ cái và dấu cách!'
                                    }
                                ]}>
                                <Input size="large" placeholder="Nhập họ và tên" required />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label={
                                    <span className="login-label">
                                        Email <span style={{ color: 'red' }}>*</span>
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập email'
                                    },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}>
                                <Input
                                    size="large"
                                    type="email"
                                    placeholder="Nhập địa chỉ email"
                                    required
                                />
                            </Form.Item>
                            <Row className="row-input">
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
                                        label={
                                            <span className="login-label">
                                                Số điện thoại{' '}
                                                <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập số điện thoại'
                                            },
                                            {
                                                pattern: /^\d+$/,
                                                message: 'Số điện thoại chỉ chứa chữ số'
                                            }
                                        ]}>
                                        <Input
                                            size="large"
                                            type="tel"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <ApiVN />
                            </Row>

                            <Row className="passwords">
                                <Col span={12} className="w-100">
                                    <Form.Item
                                        name="password"
                                        label={
                                            <span className="login-label">
                                                Mật khẩu <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập mật khẩu'
                                            }
                                        ]}>
                                        <Input.Password size="large" placeholder="************" />
                                    </Form.Item>
                                </Col>
                                <Col span={12} className="w-100">
                                    <Form.Item
                                        name="confirmPassword"
                                        label={
                                            <span className="login-label">
                                                Xác nhận lại mật khẩu{' '}
                                                <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        dependencies={['password']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng xác nhận mật khẩu!'
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (
                                                        !value ||
                                                        getFieldValue('password') === value
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        'Mật khẩu xác nhận không khớp!'
                                                    );
                                                }
                                            })
                                        ]}>
                                        <Input.Password size="large" placeholder="************" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Progress percent={progress} />
                            </Row>
                            <Row>
                                <Form.Item
                                    className="dieu-khoans"
                                    name="agreement"
                                    valuePropName="checked"
                                    wrapperCol={{ offset: 8, span: 16 }}
                                    rules={[
                                        {
                                            validator: (_, value) =>
                                                value
                                                    ? Promise.resolve()
                                                    : Promise.reject(
                                                          'Bạn cần đồng ý với điều khoản và bảo mật!'
                                                      )
                                        }
                                    ]}>
                                    <Checkbox className="dieu-khoan-bao-mat">
                                        <p>
                                            Tôi đồng ý với
                                            <Link to="#"> điều khoản</Link> và
                                            <Link to="#"> bảo mật</Link>
                                        </p>
                                    </Checkbox>
                                </Form.Item>
                            </Row>
                            <button
                                type="submit"
                                className="btn btn-primary btn-register"
                                onClick={handleSubmit}>
                                <span className="text-login">Đăng ký</span>
                            </button>
                        </Form>
                        <p className="has-login">
                            Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                        </p>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default RegisterScreen;
