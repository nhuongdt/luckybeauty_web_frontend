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
import { set } from 'lodash';
const LoginScreen: React.FC = () => {
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const navigate = useNavigate();
    const loginModel = new LoginModel();
    const [isLogin, setIsLogin] = useState(false);
    const [tenant, setTenant] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errorUser, setErrorUser] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorTenant, setErrorTenant] = useState(false);
    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        setIsLogin(!!accessToken);
        if (isLogin) {
            navigate('/home');
        }
    }, [isLogin, navigate]);
    const handleLogin = async () => {
        loginModel.tenancyName = tenant;
        loginModel.userNameOrEmailAddress = userName;
        loginModel.password = password;
        loginModel.rememberMe = remember;
        const checkTenant = await LoginService.CheckTenant(loginModel.tenancyName);
        if (checkTenant.state !== 1) {
            setErrorTenant(true);
            setErrorUser('');
            setErrorPassword('');
        } else {
            setErrorTenant(false);
            if (userName != null && userName != '' && password != '' && password != null) {
                const login = await LoginService.Login(loginModel);
                setErrorUser(login ? '' : 'Tài khoản hoặc mật khẩu không đúng');
                setErrorPassword(login ? '' : 'Tài khoản hoặc mật khẩu không đúng');
                setIsLogin(login);
            } else {
                if (userName == null || userName == '') {
                    setErrorUser('Tài khoản không được để trống');
                    setErrorPassword('');
                }
                if (password == null || password == '') {
                    setErrorPassword('Mật khẩu không được để trống');
                    setErrorUser('');
                }
            }
        }
    };
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
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
                                <span className="login-label">ID đăng nhập</span>
                                <Grid xs={12} className="form-item">
                                    <TextField
                                        onChange={(value) => {
                                            setTenant(value.target.value);
                                        }}
                                        error={errorTenant}
                                        helperText={
                                            errorTenant
                                                ? 'Id cửa hàng không tồn tại hoặc hết hạn.'
                                                : ''
                                        }
                                        onKeyDown={handleKeyDown}
                                        variant="outlined"
                                        name="tenant"
                                        placeholder="ID đăng nhập"
                                        type="text"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none!important'
                                                }
                                            }
                                        }}></TextField>
                                </Grid>
                                <span className="login-label">Tên đăng nhập</span>
                                <Grid xs={12} className="form-item">
                                    <TextField
                                        onChange={(value) => {
                                            setUserName(value.target.value);
                                        }}
                                        onKeyDown={handleKeyDown}
                                        // label={<span className="login-label">Tên đăng nhập</span>}
                                        error={errorUser == '' ? false : true}
                                        helperText={errorUser}
                                        variant="outlined"
                                        name="userNameOrEmail"
                                        placeholder="Nhập email hoặc tên tài khoản"
                                        type="text"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border:
                                                        errorUser == ''
                                                            ? 'none!important'
                                                            : '1px solid red!important'
                                                }
                                            }
                                        }}></TextField>
                                </Grid>
                                <span className="login-label">Mật khẩu</span>
                                <Grid xs={12} className="form-item">
                                    <TextField
                                        onChange={(value) => {
                                            setPassword(value.target.value);
                                        }}
                                        onKeyDown={handleKeyDown}
                                        // label={<span className="login-label">Mật khẩu</span>}
                                        error={errorPassword == '' ? false : true}
                                        helperText={errorPassword}
                                        name="password"
                                        variant="outlined"
                                        placeholder="Nhập mật khẩu"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border:
                                                        errorPassword == ''
                                                            ? 'none!important'
                                                            : '1px solid red!important'
                                                }
                                            },
                                            '& .MuiInputBase-root ': {
                                                background: '#f2f6fa'
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
                                        control={
                                            <Checkbox
                                                defaultChecked={remember}
                                                onClick={() => {
                                                    setRemember(!remember);
                                                }}
                                            />
                                        }
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
