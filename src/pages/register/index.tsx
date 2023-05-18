import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './register.css';
import passwordIcon from '../../images/showpassword.svg';
import {
    Input,
    Checkbox,
    Grid,
    TextField,
    FormControlLabel,
    LinearProgress,
    IconButton,
    InputAdornment
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import logo from '../../images/Lucky_beauty.jpg';
import ApiVN from './api_VN';
import { Link } from 'react-router-dom';

const RegisterScreen: React.FC = () => {
    const [confirm, setConfirm] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const [showPassword2, setShowPassword2] = useState(false);
    const handleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };
    const handleSubmit = (event: any) => {
        event.preventDefault();
        setConfirm(true);

        if (confirm == true) {
            return (
                <Navigate
                    to={{
                        pathname: '/login'
                    }}
                />
            );
        }
    };
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // const [passwordMatch, setPasswordMatch] = useState(true);

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };

    const passwordMatch = password === confirmPassword;

    const [progress, setProgress] = React.useState(0);
    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
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
                            <Grid container sx={{ gap: '24px' }}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="hoVaTen"
                                        label={
                                            <span>
                                                Họ và tên
                                                <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none'
                                                }
                                            }
                                        }}
                                        type="text">
                                        <Input placeholder="Nhập họ và tên" required />
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        label={
                                            <span>
                                                Email
                                                <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none'
                                                }
                                            }
                                        }}
                                        type="email">
                                        <Input
                                            type="email"
                                            placeholder="Nhập địa chỉ email"
                                            required
                                        />
                                        <Input />
                                    </TextField>
                                </Grid>
                                <Grid item xs={6} className="w-5-0">
                                    <TextField
                                        name="storeName w-100"
                                        label={<span className="login-label">Tên cửa hàng</span>}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none'
                                                }
                                            }
                                        }}
                                        type="text">
                                        <Input placeholder="Nhập tên cửa hàng" />
                                    </TextField>
                                </Grid>
                                <Grid item xs={6} className="w-5-0">
                                    <TextField
                                        name="soDienThoai"
                                        className="w-100"
                                        label={
                                            <span className="login-label">
                                                Số điện thoại{' '}
                                                <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        type="tel"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none'
                                                }
                                            }
                                        }}>
                                        <Input type="tel" placeholder="Nhập số điện thoại" />
                                    </TextField>
                                </Grid>

                                <Grid item xs={12}>
                                    <ApiVN />
                                </Grid>

                                <Grid item xs={12} className="passwords">
                                    <TextField
                                        className="bg-pw"
                                        onChange={handlePasswordChange}
                                        value={password}
                                        fullWidth
                                        name="password"
                                        label={
                                            <span className="login-label">
                                                Mật khẩu <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        type={showPassword ? 'text' : 'password'}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none'
                                                }
                                            }
                                        }}
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
                                        }}>
                                        <Input placeholder="************" />
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        className="bg-pw"
                                        onChange={handleConfirmPasswordChange}
                                        value={confirmPassword}
                                        error={!passwordMatch}
                                        helperText={
                                            !passwordMatch && (
                                                <p className="error-password">
                                                    Mật khẩu không khớp
                                                </p>
                                            )
                                        }
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
                                        }}
                                        type={showPassword2 ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleShowPassword2}>
                                                        {showPassword2 ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}>
                                        <Input placeholder="************" />
                                    </TextField>
                                </Grid>
                            </Grid>

                            <div>
                                <FormControlLabel
                                    control={<Checkbox defaultChecked />}
                                    label={
                                        <p>
                                            Tôi đồng ý với <Link to="#">Điều khoản</Link> và{' '}
                                            <Link to="#">Bảo mật</Link>
                                        </p>
                                    }
                                    sx={{ marginTop: '36px' }}
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
