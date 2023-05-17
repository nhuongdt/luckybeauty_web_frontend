import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './register.css';
import { Input, Checkbox, Grid, TextField, FormControlLabel } from '@mui/material';
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
            <div className="align-items-center justify-content-center register-content">
                <div className="register-col">
                    <div className="register-inner">
                        <h1>Đăng ký</h1>
                        <form onSubmit={handleSubmit} name="registration">
                            <Grid container>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="hoVaTen"
                                        label={<span>Họ và tên</span>}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none'
                                                }
                                            }
                                        }}>
                                        <Input placeholder="Nhập họ và tên" required />
                                    </TextField>
                                </Grid>
                            </Grid>
                            <TextField
                                fullWidth
                                name="email"
                                label={<span>Email</span>}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            border: 'none'
                                        }
                                    }
                                }}>
                                <Input type="email" placeholder="Nhập địa chỉ email" required />
                                <Input />
                            </TextField>
                            <div className="row-input">
                                <div>
                                    <TextField
                                        name="storeName"
                                        label={<span className="login-label">Tên cửa hàng</span>}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none'
                                                }
                                            }
                                        }}>
                                        <Input placeholder="Nhập tên cửa hàng" />
                                    </TextField>
                                </div>
                                <div>
                                    <TextField
                                        name="soDienThoai"
                                        label={
                                            <span className="login-label">
                                                Số điện thoại{' '}
                                                <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none'
                                                }
                                            }
                                        }}>
                                        <Input type="tel" placeholder="Nhập số điện thoại" />
                                    </TextField>
                                </div>
                            </div>
                            <div>
                                <ApiVN />
                            </div>

                            <div className="passwords">
                                <div className="w-100">
                                    <TextField
                                        fullWidth
                                        name="password"
                                        label={
                                            <span className="login-label">
                                                Mật khẩu <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none'
                                                }
                                            }
                                        }}>
                                        <Input placeholder="************" />
                                    </TextField>
                                </div>
                                <div className="w-100">
                                    <TextField
                                        name="confirmPassword"
                                        label={
                                            <span className="login-label">
                                                Xác nhận lại mật khẩu{' '}
                                                <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none'
                                                }
                                            }
                                        }}>
                                        <Input placeholder="************" />
                                    </TextField>
                                </div>
                            </div>
                            <div></div>
                            <div>
                                <FormControlLabel
                                    control={<Checkbox defaultChecked />}
                                    label={
                                        <p>
                                            Tôi đồng ý với <Link to="#">Điều khoản</Link> và{' '}
                                            <Link to="#">Bảo mật</Link>
                                        </p>
                                    }
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-register"
                                onClick={handleSubmit}>
                                <span className="text-login">Đăng ký</span>
                            </button>
                        </form>
                        <p className="has-login">
                            Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;
