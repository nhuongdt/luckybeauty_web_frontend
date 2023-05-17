import React, { useState, useEffect } from 'react';
import { Grid, Input, Checkbox, Avatar, Box, TextField, FormControlLabel } from '@mui/material';
import './login.css';
import LoginModel from '../../models/Login/loginModel';
import LoginService from '../../services/login/loginService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/Lucky_beauty.jpg';
import { Link } from 'react-router-dom';
const LoginScreen: React.FC = () => {
    return (
        <div className=" login-page">
            <div className="logo-login">
                <div className="logo-image">
                    <img src={logo} alt="Lucky Beauty" />
                </div>
                <div className="logo-text">Lucky Beauty</div>
            </div>
            <Grid container className="align-items-center justify-content-center mt-2 h-100">
                <Grid xs={12}>
                    <div className="login-page-inner ">
                        <h1 className="login-label">Đăng nhập</h1>
                        <form className="login-form">
                            <Grid container>
                                <Grid xs={12} className="form-item">
                                    <TextField
                                        name="tenant"
                                        label={
                                            <span className="login-label">ID đăng nhập</span>
                                        }></TextField>
                                </Grid>
                                <Grid xs={12} className="form-item">
                                    <TextField
                                        name="userNameOrEmail"
                                        label={<span className="login-label">Tên đăng nhập</span>}>
                                        <Input placeholder="Nhập email hoặc tài khoản" />
                                    </TextField>
                                </Grid>
                                <Grid xs={12} className="form-item">
                                    <TextField
                                        name="userNameOrEmail"
                                        label={<span className="login-label">Mật khẩu</span>}>
                                        <Input placeholder="Nhập email hoặc tài khoản" />
                                    </TextField>
                                </Grid>
                                <Grid xs={12} className="form-item_checkBox">
                                    <FormControlLabel
                                        control={<Checkbox defaultChecked />}
                                        label="Ghi nhớ"
                                    />
                                    <Link className="login-form-forgot" to="/forgot-password">
                                        Quên mật khẩu ?
                                    </Link>
                                </Grid>

                                <Grid xs={12}>
                                    <button type="submit" className="btn-login">
                                        <span className="text-login">Đăng nhập</span>
                                    </button>
                                </Grid>
                                <Grid xs={12}>
                                    <p className="text-support">
                                        Tổng đài hỗ trợ : <span>0247 303 9333 - 0936 363 069</span>
                                    </p>
                                </Grid>
                                <Grid xs={12}>
                                    <p className="text-register">
                                        Bạn chưa có tài khoản?{' '}
                                        <Link className="a quenMk" to="/register">
                                            Đăng ký
                                        </Link>
                                    </p>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default LoginScreen;
