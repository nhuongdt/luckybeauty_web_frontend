// import { Avatar, Badge, Col, Dropdown, Layout, Menu, Row, Space, Typography } from 'antd';

import avatar from '../../images/user.png';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined,
    HomeOutlined,
    DownOutlined,
    BellOutlined,
    MessageOutlined
} from '@ant-design/icons';
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
import { ReactComponent as ToggleIcon } from '../../images/btntoggle.svg';
import * as React from 'react';
import { Link } from 'react-router-dom';
import MessageIcon from '../../images/message-question.svg';
import NotificationIcon from '../../images/notification.svg';

interface HeaderProps {
    collapsed: boolean;
    toggle: () => void;
    onClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, toggle }, props: HeaderProps) => {
    const { onClick } = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Box
            display="flex"
            className="header"
            // style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
        >
            {' '}
            <Grid container className={'header-container'} justifyContent="space-between">
                <Grid item sx={{ textAlign: 'left', display: 'flex' }}>
                    <Button
                        sx={{ minWidth: 'unset!important', marginLeft: '32px' }}
                        onClick={toggle}>
                        <ToggleIcon />
                    </Button>
                </Grid>
                <Grid item sx={{ textAlign: 'right' }}>
                    <Box display="flex" sx={{ marginRight: '30px' }}>
                        <Badge style={{ margin: '0px 8px 0px 8px' }}>
                            <Button
                                sx={{
                                    minWidth: 'unset!important'
                                }}>
                                <img src={MessageIcon} alt="Message" />
                            </Button>
                        </Badge>
                        <Badge style={{ margin: '0px 8px 0px 8px' }} color="error">
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
                        <DownOutlined style={{ color: '#666466' }} />

                        <Menu
                            open={open}
                            id="author"
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'btnAuthor'
                            }}>
                            <MenuItem onClick={handleClose}>
                                <Link to="/logout">
                                    <LogoutOutlined />
                                    <span> Logout </span>
                                </Link>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
export default Header;
