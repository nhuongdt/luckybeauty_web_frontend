import React, { useState, useEffect } from 'react';
import {
    Grid,
    Input,
    Checkbox,
    Avatar,
    Box,
    TextField,
    FormControlLabel,
    IconButton,
    InputAdornment
} from '@mui/material';
import './login.css';
import LoginModel from '../../models/Login/loginModel';
import LoginService from '../../services/login/loginService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/Lucky_beauty.jpg';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
const LoginScreen: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const [valId, setValId] = useState(true);
    const [checkChangeID, setCheckChangeId] = useState(false);
    const [id, setId] = useState('');
    const [valName, setValName] = useState(true);
    const [checkChangeName, setCheckChangeName] = useState(false);
    const [name, setName] = useState('');
    const [valPassword, setValPassword] = useState(true);
    const [checkChangePassword, setCheckChangePassword] = useState(false);
    const [password, setPassword] = useState('');

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (id == '' || name == '' || password == '') {
            alert('Vui lòng nhập đầy đủ thông tin Đăng nhập');
        } else if ((id !== '' && name !== '') || password !== '') {
            console.log('id:', id, 'name:', name, 'Password: ', password);
        }
    };
    const handleChangeId = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setId(value);
        setCheckChangeId(true);
    };
    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setName(value);
        setCheckChangeName(true);
    };
    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPassword(value);
        setCheckChangePassword(true);
    };
    useEffect(() => {
        if (checkChangeID == true) {
            console.log(id);
            id !== '' ? setValId(true) : setValId(false);
        }
        if (checkChangeName == true) {
            name !== '' ? setValName(true) : setValName(false);
        }
        if (checkChangePassword == true) {
            password !== '' ? setValPassword(true) : setValPassword(false);
        }
    }, [id, name, password]);

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
                        <form className="login-form" onSubmit={handleSubmit}>
                            <Grid container>
                                <Grid xs={12} className="form-item">
                                    <TextField
                                        value={id}
                                        onChange={handleChangeId}
                                        variant="outlined"
                                        name="tenant"
                                        label={<span className="login-label">ID đăng nhập</span>}
                                        type="text"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border:
                                                        valId == true
                                                            ? 'none!important'
                                                            : '1px solid red!important'
                                                }
                                            }
                                        }}></TextField>
                                </Grid>
                                <Grid xs={12} className="form-item">
                                    <TextField
                                        value={name}
                                        onChange={handleChangeName}
                                        variant="outlined"
                                        name="userNameOrEmail"
                                        label={<span className="login-label">Tên đăng nhập</span>}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border:
                                                        valName == true
                                                            ? 'none!important'
                                                            : '1px solid red!important'
                                                }
                                            }
                                        }}></TextField>
                                </Grid>
                                <Grid xs={12} className="form-item">
                                    <TextField
                                        value={password}
                                        onChange={handleChangePassword}
                                        className="bg-pw"
                                        name="userNameOrEmail"
                                        variant="outlined"
                                        label={<span className="login-label">Mật khẩu</span>}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border:
                                                        valPassword == true
                                                            ? 'none!important'
                                                            : '1px solid red!important'
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
