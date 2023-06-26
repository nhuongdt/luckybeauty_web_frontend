// import { Avatar, Badge, Col, Dropdown, Layout, Menu, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import avatar from '../../images/user.png';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
    Grid,
    Box,
    Typography,
    Select,
    MenuItem,
    Menu,
    Button,
    Badge,
    Avatar,
    SelectChangeEvent
} from '@mui/material';
import './header.css';
import { ReactComponent as LogoNew } from '../../images/logoNew.svg';
// import { ReactComponent as ToggleIcon } from '../../images/btntoggle.svg';
import * as React from 'react';
import { Link } from 'react-router-dom';
import MessageIcon from '../../images/message-question.svg';
import NotificationIcon from '../../images/notification.svg';
import http from '../../services/httpService';
import Cookies from 'js-cookie';
import { SuggestChiNhanhDto } from '../../services/suggests/dto/SuggestChiNhanhDto';
import chiNhanhService from '../../services/chi_nhanh/chiNhanhService';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ReactComponent as LocationIcon } from '../../images/location.svg';
import PortraitOutlinedIcon from '@mui/icons-material/PortraitOutlined';
import { ReactComponent as SuportIcon } from '../../images/supportIcon.svg';
interface HeaderProps {
    collapsed: boolean;
    toggle: () => void;
    onClick: () => void;
    isChildHovered: boolean;
    CookieSidebar: boolean;
    handleChangeChiNhanh: (currentChiNhanh: SuggestChiNhanhDto) => void;
}

const Header: React.FC<HeaderProps> = (
    { collapsed, toggle, isChildHovered, CookieSidebar, handleChangeChiNhanh },
    props: HeaderProps
) => {
    const { onClick } = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const defaultPermission: string[] = [];
    const [lstPermission, setListPermission] = useState(defaultPermission);
    const [chiNhanhs, setListChiNhanh] = useState([] as SuggestChiNhanhDto[]);
    const [currentChiNhanh, setCurrentChiNhanh] = useState('');
    useEffect(() => {
        // Call API to get list of permissions here
        // Example:
        const userId = Cookies.get('userId');
        const token = Cookies.get('accessToken');
        const encryptedAccessToken = Cookies.get('encryptedAccessToken');
        http.post(`api/services/app/Permission/GetAllPermissionByRole?UserId=${userId}`, {
            headers: {
                accept: 'text/plain',
                Authorization: 'Bearer ' + token,
                'X-XSRF-TOKEN': encryptedAccessToken
            }
        })
            .then((response) => {
                setListPermission(response.data.result['permissions']);
            })
            .catch((error) => console.log(error));
        const getChiNhanhs = async () => {
            const listChiNhanh = await chiNhanhService.GetChiNhanhByUser();
            if (listChiNhanh != null && listChiNhanh.length > 0) {
                setListChiNhanh(listChiNhanh);

                if (Cookies.get('IdChiNhanh') === undefined || Cookies.get('IdChiNhanh') === '') {
                    const idChiNhanh = listChiNhanh[0].id;
                    const tenChiNhanh = listChiNhanh[0].tenChiNhanh;

                    setCurrentChiNhanh(idChiNhanh);
                    const remember = Cookies.get('remember');
                    Cookies.set('IdChiNhanh', idChiNhanh, {
                        expires: remember === 'true' ? 1 : undefined
                    });
                    handleChangeChiNhanh({ id: idChiNhanh, tenChiNhanh: tenChiNhanh });
                } else {
                    const idChiNhanh = Cookies.get('IdChiNhanh') ?? '';
                    setCurrentChiNhanh(idChiNhanh);
                    // todo tenChiNhanh
                    handleChangeChiNhanh({ id: idChiNhanh, tenChiNhanh: '' });
                }
            }
        };
        getChiNhanhs();
    }, []);

    const changeChiNhanh = (e: any, item: any) => {
        const idChiNhanh = item.props.value;
        const tenChiNhanh = item.props.children;
        setCurrentChiNhanh(idChiNhanh);
        const remember = Cookies.get('remember');
        Cookies.set('IdChiNhanh', idChiNhanh, {
            expires: remember === 'true' ? 1 : undefined
        });
        // window.location.reload();
        handleChangeChiNhanh({ id: idChiNhanh, tenChiNhanh: tenChiNhanh });
    };

    return (
        <Box
            display="flex"
            className="header"
            sx={{ position: 'fixed', right: '0', top: '0', zIndex: 20 }}>
            {' '}
            <Grid container className={'header-container'} justifyContent="space-between">
                <Grid item sx={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                    <Box display="flex" gap="8px" marginLeft="16px">
                        <LogoNew />
                        <Typography
                            fontFamily="vinhan"
                            color="#7C3367"
                            fontSize="18px"
                            sx={{
                                opacity: collapsed && !isChildHovered ? '0' : '1',
                                transition: '.2s'
                            }}>
                            Lucky Beauty
                        </Typography>
                    </Box>
                    <Button
                        sx={{
                            minWidth: 'unset!important',
                            marginLeft: collapsed && !isChildHovered ? '-116px' : '0',
                            backgroundColor: 'unset!important',
                            transition: '.4s',
                            ':hover': {
                                backgroundColor: 'unset!important'
                            },
                            ':hover svg:nth-child(1)': {
                                color: '#c95ea9!important'
                            },
                            ':hover svg:nth-child(2)': {
                                color: '#c95ea9d9'
                            },
                            '& .MuiTouchRipple-root': {
                                display: 'none'
                            },
                            transform:
                                collapsed && !isChildHovered ? 'rotate(-180deg)' : 'rotate(0deg)'
                        }}
                        onClick={toggle}>
                        <ArrowBackIosIcon
                            sx={{ color: 'rgba(203, 173, 194, 0.7)', fontSize: '16px' }}
                        />
                        <ArrowBackIosIcon
                            sx={{
                                color: 'rgba(203, 173, 194, 0.4)',
                                fontSize: '16px',
                                marginLeft: '-8px'
                            }}
                        />
                    </Button>
                </Grid>
                <Grid item sx={{ textAlign: 'right' }}>
                    <Box display="flex" sx={{ marginRight: '30px', alignItems: 'center' }}>
                        <Box display="flex">
                            <LocationIcon />
                            <Select
                                sx={{
                                    ml: '10px',
                                    border: 'none!important',
                                    '& *': {
                                        border: '0!important'
                                    },
                                    '& .MuiSelect-select': {
                                        padding: '0',
                                        fontSize: '14px'
                                    },
                                    '&:hover': {
                                        color: '#7C3367'
                                    }
                                }}
                                size="small"
                                value={currentChiNhanh}
                                onChange={(e, item) => changeChiNhanh(e, item)}>
                                {chiNhanhs.map((item) => {
                                    return (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.tenChiNhanh}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </Box>
                        <Badge>
                            <Button
                                sx={{
                                    minWidth: 'unset!important'
                                }}>
                                <img src={MessageIcon} alt="Message" />
                            </Button>
                        </Badge>
                        <Badge color="error">
                            <Button sx={{ minWidth: 'unset!important' }}>
                                <img src={NotificationIcon} alt="notification" />
                            </Button>
                        </Badge>
                        <div style={{ marginLeft: '32px', marginRight: 8 }}>
                            <div className="store-name">Nail Spa</div>
                            <div className="branch-name">Hà nội</div>
                        </div>
                        <Button
                            id="btnAuthor"
                            aria-controls={open ? 'author' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{ pr: '25px', mr: '-20px' }}>
                            <Avatar src={avatar} sx={{ height: 36, width: 36 }} alt={'profile'} />
                        </Button>

                        <Menu
                            open={open}
                            id="author"
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'btnAuthor'
                            }}>
                            <MenuItem onClick={handleClose}>
                                <Link
                                    to="/login"
                                    style={{ textDecoration: 'none', listStyle: 'none' }}
                                    onClick={() => {
                                        Object.keys(Cookies.get()).forEach((cookieName) => {
                                            Cookies.remove(cookieName);
                                        });
                                    }}>
                                    <LogoutIcon />
                                    <span> Logout </span>
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Link
                                    to="/account/profile"
                                    style={{ textDecoration: 'none', listStyle: 'none' }}>
                                    <PortraitOutlinedIcon />
                                    <span> Profile </span>
                                </Link>
                            </MenuItem>
                        </Menu>
                        {!open && <ExpandMoreIcon />}
                        {open && <ExpandLessIcon />}
                    </Box>
                </Grid>
            </Grid>
            {/* <Button
                variant="contained"
                sx={{
                    position: 'fixed',
                    right: '24px',
                    bottom: '40px',
                    width: '60px',
                    height: '60px',
                    minWidth: 'unset',
                    borderRadius: '50%',
                    bgcolor: '#7C3367!important'
                }}>
                <SuportIcon />
            </Button> */}
        </Box>
    );
};
export default Header;
