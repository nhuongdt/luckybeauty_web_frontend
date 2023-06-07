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
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    Menu,
    Stack,
    Button,
    Badge,
    Container,
    Avatar,
    IconButton,
    TextareaAutosize,
    ButtonGroup,
    Breadcrumbs,
    Dialog
} from '@mui/material';
import './header.css';
import { ReactComponent as LogoNew } from '../../images/logoNew.svg';
// import { ReactComponent as ToggleIcon } from '../../images/btntoggle.svg';
import * as React from 'react';
import { Link } from 'react-router-dom';
import MessageIcon from '../../images/message-question.svg';
import NotificationIcon from '../../images/notification.svg';
import { ReactComponent as ToggleIcon } from '../../images/toggleIcon.svg';
import http from '../../services/httpService';
import Cookies from 'js-cookie';
import { SuggestChiNhanhDto } from '../../services/suggests/dto/SuggestChiNhanhDto';
import chiNhanhService from '../../services/chi_nhanh/chiNhanhService';
import { ReactComponent as ToggleIconNew } from '../../images/arrow-circle-left.svg';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ReactComponent as LocationIcon } from '../../images/location.svg';
interface HeaderProps {
    collapsed: boolean;
    toggle: () => void;
    onClick: () => void;
    isChildHovered: boolean;
}

const Header: React.FC<HeaderProps> = (
    { collapsed, toggle, isChildHovered },
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
            setListChiNhanh(listChiNhanh);
            setCurrentChiNhanh(listChiNhanh[0].id);
            const remember = Cookies.get('remember');
            Cookies.set('IdChiNhanh', listChiNhanh[0].id, {
                expires: remember === 'true' ? 1 : undefined
            });
        };
        getChiNhanhs();
    }, []);
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
                                    }
                                }}
                                size="small"
                                value={currentChiNhanh}
                                onChange={(e) => {
                                    setCurrentChiNhanh(e.target.value as string);
                                    const remember = Cookies.get('remember');
                                    Cookies.set('IdChiNhanh', e.target.value, {
                                        expires: remember === 'true' ? 1 : undefined
                                    });
                                }}>
                                {chiNhanhs.map((item) => {
                                    return <MenuItem value={item.id}>{item.tenChiNhanh}</MenuItem>;
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
                            onClick={handleClick}>
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
                                    onClick={() => {
                                        Object.keys(Cookies.get()).forEach((cookieName) => {
                                            Cookies.remove(cookieName);
                                        });
                                    }}>
                                    <LogoutIcon />
                                    <span> Logout </span>
                                </Link>
                            </MenuItem>
                        </Menu>
                        {!open && <ExpandMoreIcon />}
                        {open && <ExpandLessIcon />}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
export default Header;
