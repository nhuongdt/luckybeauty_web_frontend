import React, { useState, useEffect } from 'react';
import { Form, Input, Checkbox, Avatar, Row, Col } from 'antd';
import './login.css';
import LoginModel from '../../models/Login/loginModel';
import LoginService from '../../services/login/loginService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
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
                form.setFields([{ name: 'tenant', errors: ['ID không chính xác'] }]);
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
        <div className=" login-page">
            <div className="logo-login">
                <div className="logo-image">
                    <img src={logo} alt="Lucky Beauty" />
                </div>
                <div className="logo-text">Lucky Beauty</div>
            </div>
            <Row className="align-items-center justify-content-center mt-2 h-100">
                <Col>
                    <div className="login-page-inner ">
                        <h1 className="login-label">Đăng nhập</h1>
                        <Form
                            form={form}
                            onFinish={handleLogin}
                            layout="vertical"
                            className="login-form">
                            <Form.Item
                                name="tenant"
                                label={<span className="login-label">ID cửa hàng</span>}>
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
                                        message: 'Vui lòng nhập tài khoản'
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
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                                <Input.Password size="large" placeholder="Nhập mật khẩu" />
                            </Form.Item>
                            <Form.Item>
                                <Checkbox
                                    className="remember"
                                    value={remember}
                                    checked={remember}
                                    onChange={() => {
                                        setRemember(!remember);
                                    }}>
                                    Ghi nhớ
                                </Checkbox>

                                <a className="login-form-forgot" href="">
                                    Quên mật khẩu ?
                                </a>
                            </Form.Item>
                            <Row>
                                <button type="submit" className="btn-login">
                                    <span className="text-login">Đăng nhập</span>
                                </button>
                            </Row>
                            <p className="text-support">
                                Tổng đài hỗ trợ : <span>0247 303 9333 - 0936 363 069</span>
                            </p>
                            <p className="text-register">
                                Bạn chưa có tài khoản?{' '}
                                <a className="a quenMk" href="#">
                                    Đăng ký
                                </a>
                            </p>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default LoginScreen;
