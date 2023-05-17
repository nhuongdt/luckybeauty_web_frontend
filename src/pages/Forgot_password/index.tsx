import React from 'react';
import logo from '../../images/Lucky_beauty.jpg';
import { Form, Input, Button, message } from 'antd';
import './forgotPassword.css';
import { Link } from 'react-router-dom';
const ForgotPassword: React.FC = () => {
    const onFinish = (values: any) => {
        console.log('Form values:', values);
        message.success('Đã gửi yêu cầu lấy lại mật khẩu!');
    };

    return (
        <div className="forgot-password-page">
            <div className="logo-forgot">
                <div className="logo-image">
                    <img src={logo} alt="Lucky Beauty" />
                </div>
                <div className="logo-text">Lucky Beauty</div>
            </div>
            <div className="forgot-password-page-box">
                <h1>Quên mật khẩu</h1>
                <p>
                    Nhập địa chỉ email bạn đã sử dụng khi tạo tài khoản và chúng tôi sẽ gửi cho bạn
                    mã để đặt lại mật khẩu
                </p>
                <Form name="forgotPassword" onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập địa chỉ Email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}>
                        <Input placeholder="Địa chỉ email" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Gửi yêu cầu
                        </Button>
                    </Form.Item>
                    <Link to="/login" className="back_login">
                        Trở lại đăng nhập
                    </Link>
                </Form>
            </div>
        </div>
    );
};
export default ForgotPassword;
