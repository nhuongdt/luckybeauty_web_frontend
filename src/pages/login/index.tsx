import React, { useState, useEffect } from 'react';
import { Col, Row, Container, Image } from 'react-bootstrap';
import { Form, Input, Checkbox } from 'antd';
import './login.css';
import LoginModel from '../../models/Login/loginModel';
import LoginService from '../../services/login/loginService';
import Cookies from 'js-cookie';
import { Navigate, useNavigate } from 'react-router-dom';
import logo from '../../images/Lucky_beauty.jpg';
const LoginScreen: React.FC = () => {
    const loginModel = new LoginModel();
    const [remember, setRemember] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const handleLogin = async (values: {
        tenant: string;
        userNameOrEmail: string;
        password: string;
        rememberMe: boolean;
    }) => {
        try {
            const tenantName = values.tenant;
            const tenantResult = await LoginService.CheckTenant(tenantName);
            console.log(tenantResult);
            if (tenantResult.tenantId !== null) {
                loginModel.tenancyName = values.tenant;
                loginModel.userNameOrEmailAddress = values.userNameOrEmail;
                loginModel.password = values.password;
                loginModel.rememberMe = values.rememberMe;
                const loginResult = await LoginService.Login(loginModel);
                if (loginResult) {
                    navigate('/');
                } else {
                    form.setFields([
                        {
                            name: 'userNameOrEmail',
                            errors: ['Tài khoản hoặc mật khẩu không chính xác!']
                        },
                        { name: 'password', errors: ['Tài khoản hoặc mật khẩu không chính xác!'] }
                    ]);
                }
            } else {
                form.setFields([
                    { name: 'tenant', errors: ['The specified tenant does not exist.'] }
                ]);
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
            form.setFields([
                { name: 'userNameOrEmail', errors: ['Tài khoản hoặc mật khẩu không chính xác!'] },
                { name: 'password', errors: ['Tài khoản hoặc mật khẩu không chính xác!'] }
            ]);
        }
    };
    useEffect(() => {
        Object.keys(Cookies.get()).forEach((cookieName) => {
            Cookies.remove(cookieName);
        });
    }, []);

    return (
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <Row className="align-items-center justify-content-center">
                <Col>
                    <div
                        className="rounded border shadow "
                        style={{ width: '660px', padding: '12px 54px' }}>
                        <Image
                            width={'64px'}
                            height={'64px'}
                            style={{ margin: '24px 244px' }}
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
                            Đăng nhập
                        </label>
                        <Form form={form} onFinish={handleLogin} layout="vertical">
                            <Form.Item
                                name="tenant"
                                label={<p className="login-label">ID cửa hàng</p>}>
                                <Input size="large" placeholder="Nhập tên cửa hàng" />
                            </Form.Item>
                            <Form.Item
                                name="userNameOrEmail"
                                label={
                                    <span className="login-label">
                                        Tên đăng nhập <span style={{ color: 'red' }}>*</span>
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập tài khoản'
                                    }
                                ]}>
                                <Input size="large" placeholder="Nhập email hoặc tài khoản" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label={
                                    <span className="login-label">
                                        Mật khẩu <span style={{ color: 'red' }}>*</span>
                                    </span>
                                }
                                rules={[
                                    { required: true, message: 'Please enter your password.' }
                                ]}>
                                <Input.Password size="large" placeholder="Nhập mật khẩu" />
                            </Form.Item>
                            <Form.Item>
                                <Checkbox
                                    value={remember}
                                    checked={remember}
                                    onChange={() => {
                                        setRemember(!remember);
                                    }}>
                                    Ghi nhớ ?
                                </Checkbox>

                                <a className="login-form-forgot" href="">
                                    Quên mật khẩu
                                </a>
                            </Form.Item>
                            <Row>
                                <button type="submit" className="btn-login">
                                    <span className="text-login">Đăng nhập</span>
                                </button>
                            </Row>
                            <label
                                className="login-label"
                                style={{
                                    margin: '12px 128px',
                                    height: '20px',
                                    width: '295px',
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                    alignContent: 'center',
                                    textAlign: 'center',
                                    alignItems: 'center'
                                }}>
                                Tổng đài hỗ trợ : 0247 303 9333 - 0936 363 069
                            </label>
                            <p
                                className="login-label"
                                style={{
                                    margin: '12px 128px',
                                    height: '20px',
                                    width: '295px',
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                    alignContent: 'center',
                                    textAlign: 'center',
                                    alignItems: 'center'
                                }}>
                                Bạn chưa có tài khoản?{' '}
                                <a className="a" href="">
                                    Đăng ký
                                </a>
                            </p>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginScreen;
