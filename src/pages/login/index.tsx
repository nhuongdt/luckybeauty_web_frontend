import React, { useState, useEffect } from 'react';
import {
    Grid,
    Input,
    Checkbox,
    Avatar,
    Box,
    TextField,
    FormControlLabel,
    InputAdornment,
    IconButton
} from '@mui/material';
import './login.css';
import LoginModel from '../../models/Login/loginModel';
import LoginService from '../../services/login/loginService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/Lucky_beauty.jpg';
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const loginModel = new LoginModel();
    const [isLogin, setIsLogin] = useState(false);
    const [tenant, setTenant] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const changeTenant = async (tenantName: string) => {
        await LoginService.CheckTenant(tenantName);
    };
    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        setIsLogin(!!accessToken);
        if (isLogin) {
            navigate('/home');
        }
    }, [isLogin, navigate]);
    const handleLogin = async (event: React.FormEvent) => {
        loginModel.tenancyName = tenant;
        loginModel.userNameOrEmailAddress = userName;
        loginModel.password = password;
        loginModel.rememberMe = remember;
        await changeTenant(loginModel.tenancyName);
        const login = await LoginService.Login(loginModel);
        setIsLogin(login);
    };
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
                                    <span className="login-label">ID đăng nhập</span>
                                    <TextField
                                        onChange={(value) => {
                                            setTenant(value.target.value);
                                        }}
                                        variant="outlined"
                                        name="tenant"
                                        // label={<span className="login-label">ID đăng nhập</span>}
                                        type="text"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: '1px'
                                                }
                                            }
                                        }}></TextField>
                                </Grid>
                                <Grid xs={12} className="form-item">
                                    <div>
                                        <span className="login-label">Tên đăng nhập</span>
                                        <TextField
                                            onChange={(value) => {
                                                setUserName(value.target.value);
                                            }}
                                            variant="outlined"
                                            name="userNameOrEmail"
                                            type="text"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        border: '1px'
                                                    }
                                                }
                                            }}>
                                            <Input placeholder="Nhập email hoặc tài khoản" />
                                        </TextField>
                                    </div>
                                </Grid>
                                <Grid xs={12} className="form-item">
                                    <span className="login-label">Mật khẩu</span>
                                    <TextField
                                        onChange={(value) => {
                                            setPassword(value.target.value);
                                        }}
                                        name="password"
                                        variant="outlined"
                                        // label={<span className="login-label">Mật khẩu</span>}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: '1px'
                                                }
                                            }
                                        }}
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleShowPassword}>
                                                        {showPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}></TextField>
                                </Grid>
                                <Grid xs={12} className="form-item_checkBox">
                                    <FormControlLabel
                                        onClick={() => {
                                            setRemember(!remember);
                                        }}
                                        control={<Checkbox defaultChecked />}
                                        label="Ghi nhớ"
                                    />
                                    <Link className="login-form-forgot" to="/forgot-password">
                                        Quên mật khẩu ?
                                    </Link>
                                </Grid>

                                <Grid xs={12}>
                                    <button
                                        type="button"
                                        className="btn-login"
                                        onClick={handleLogin}>
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
