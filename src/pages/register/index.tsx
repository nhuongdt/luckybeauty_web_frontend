import React, { useState } from 'react';
import { Form, Col, Row, Container, Image, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import './register.css';
const RegisterScreen: React.FC = () => {
    const [tenant, setTenant] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const handleSubmit = (event: any) => {
        event.preventDefault();
        setConfirm(true);
    };

    const handleForgotPassword = () => {
        // Implement forgot password functionality here
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
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <Row className="align-items-center justify-content-centerregister-content">
                <Col>
                    <div
                        className="rounded border shadow "
                        style={{ width: '660px', padding: ' 0px 54px' }}>
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
                            Đăng ký
                        </label>
                        <Form onSubmit={handleSubmit} noValidate>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label className="login-label">Họ và tên</Form.Label>
                                <Form.Control
                                    className="login-input"
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label className="login-label">Email</Form.Label>
                                <Form.Control
                                    className="login-input"
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label className="login-label">
                                            Tên cửa hàng
                                        </Form.Label>
                                        <Form.Control
                                            className="login-input"
                                            type="password"
                                            required
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Label className="login-label">
                                            Số điện thoại
                                        </Form.Label>
                                        <Form.Control
                                            className="login-input"
                                            type="password"
                                            required
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label className="login-label">
                                            Quận / Huyện
                                        </Form.Label>
                                        <Form.Control
                                            className="login-input"
                                            type="password"
                                            required
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Label className="login-label">
                                            Tỉnh/Thành phố
                                        </Form.Label>
                                        <Form.Control
                                            className="login-input"
                                            type="password"
                                            required
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label className="login-label">Lĩnh vực quan tâm</Form.Label>
                                <Form.Control
                                    className="login-input"
                                    type="password"
                                    required
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label className="login-label">Mật khẩu</Form.Label>
                                        <Form.Control
                                            className="login-input"
                                            type="password"
                                            required
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Label className="login-label">
                                            Xác nhận lại mật khẩu
                                        </Form.Label>
                                        <Form.Control
                                            className="login-input"
                                            type="password"
                                            required
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-register"
                                    onClick={handleSubmit}>
                                    <span className="text-login">Đăng ký</span>
                                </button>
                            </Form.Group>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterScreen;
