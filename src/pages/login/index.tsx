import React, { useState, useEffect } from 'react';
import { Form, Col, Row, Container, Image } from 'react-bootstrap';
import './login.css';
import { Navigate } from 'react-router-dom';
import LoginModel from '../../models/Login/loginModel';
import { FormInstance } from 'antd';
import LoginService from '../../services/login/loginService';
import Cookies from 'js-cookie';

const LoginScreen: React.FC = () => {
    const formRef = React.createRef<FormInstance>();
    const loginModel = new LoginModel();
    const [isLogin, setIsLogin] = useState(false);
    const [tenant, setTenant] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const changeTenant = async (tenantName: string) => {
        await LoginService.CheckTenant(tenantName);
    };

    const handleSubmit = async (event: any) => {
        loginModel.tenancyName = tenant;
        loginModel.userNameOrEmailAddress = userName;
        loginModel.password = password;
        loginModel.rememberMe = remember;
        console.log(loginModel.tenancyName);
        await changeTenant(loginModel.tenancyName);
        const login = await LoginService.Login(loginModel);
        sessionStorage.setItem('rememberMe', loginModel.rememberMe ? '1' : '0');
        setIsLogin(login);
    };
    useEffect(() => {
        Object.keys(Cookies.get()).forEach((cookieName) => {
            Cookies.remove(cookieName);
        });
    }, []);
    if (isLogin) {
        return <Navigate to="/" />;
    } else {
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
                                src="../../images/Lucky_beauty.jpg"
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
                            <Form onSubmit={handleSubmit} noValidate>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label className="login-label">Id cửa hàng</Form.Label>
                                    <Form.Control
                                        className="login-input"
                                        type="email"
                                        placeholder="Enter email"
                                        onChange={(value) => {
                                            setTenant(value.target.value);
                                        }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label className="login-label">Tên đăng nhập</Form.Label>
                                    <Form.Control
                                        className="login-input"
                                        type="email"
                                        placeholder="Enter email"
                                        onChange={(value) => {
                                            setUserName(value.target.value);
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label className="login-label">Mật khẩu</Form.Label>
                                    <Form.Control
                                        className="login-input"
                                        type="password"
                                        value={loginModel.password}
                                        onChange={(value) => {
                                            setPassword(value.target.value);
                                        }}
                                        required
                                        placeholder="Password"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Row>
                                        <Col className="float-left">
                                            <Form.Check
                                                className="input-check"
                                                checked={remember}
                                                type={'checkbox'}
                                                label={`Ghi nhớ`}
                                                onClick={() => {
                                                    setRemember(!remember);
                                                }}
                                            />
                                        </Col>
                                        <Col className="float-right">
                                            <Form.Text className="form-text-float-right">
                                                <a href="#" className="a">
                                                    Quên mật khẩu
                                                </a>
                                            </Form.Text>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group>
                                    <button
                                        type="button"
                                        className="btn-login"
                                        onClick={handleSubmit}>
                                        <span className="text-login">Đăng nhập</span>
                                    </button>
                                </Form.Group>
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
                                    Bạn chưa có tài khoản? <a className="a">Đăng ký</a>
                                </p>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default LoginScreen;
