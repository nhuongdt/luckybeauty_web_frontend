/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { appRouters } from '../routers/index';
import './sider_menu.css';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import http from '../../services/httpService';
import { List, ListItem, ListItemIcon, ListItemText, Typography, Avatar } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Sider from 'antd/es/layout/Sider';
import { Box } from '@mui/material';
import outIcon from '../../images/Logout.svg';

interface Props {
    collapsed: boolean;
    toggle: () => void;
    onHoverChange: (isHovered: boolean) => void;
}
interface MenuItem {
    key: React.Key;
    icon?: React.ReactNode;
    children?: MenuItem[];
    label: React.ReactNode;
    type?: 'group';
}

function convertMenuItemsToMenu(menuItems: any[], listPermission: string[]): MenuItem[] {
    const menu: MenuItem[] = [];
    menuItems.forEach((item) => {
        // Check if item has permission to be added to menu
        if (listPermission.includes(item.permission) || item.permission === '') {
            const menuItem: MenuItem = {
                key: item.path,
                label:
                    item.children.length > 0 ? (
                        item.title
                    ) : (
                        <Link to={item.path} title={item.title} style={{ textDecoration: 'none' }}>
                            {item.title}
                        </Link>
                    ),
                icon: item.icon,
                type: item.isLayout ? 'group' : undefined,
                children:
                    item.children.length > 0
                        ? convertMenuItemsToMenu(item.children, listPermission)
                        : undefined
            };
            menu.push(menuItem);
        }
    });
    return menu;
}
const AppSiderMenu: React.FC<Props> = ({ collapsed, toggle, onHoverChange }) => {
    const defaultPermission: string[] = [];
    const [lstPermission, setListPermission] = useState(defaultPermission);
    const mainAppRoutes = appRouters.mainRoutes[1].routes.filter(
        (item: { showInMenu: boolean }) => item.showInMenu === true
    );
    const navigate = useNavigate();
    const location = useLocation();
    const itemMenus = convertMenuItemsToMenu(mainAppRoutes, lstPermission);
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
    }, []);

    const [open, setOpen] = useState<{ [key: number]: boolean }>({});

    const handleDropdown = (index: number) => {
        setOpen((prevOpen) => ({
            ...prevOpen,
            [index]: !prevOpen[index]
        }));
    };
    const [OpenHover, setOpenHover] = useState(false);

    const handleMouseEnter = () => {
        setOpenHover(true);
        onHoverChange(true);
    };

    const handleMouseLeave = () => {
        setOpenHover(false);
        onHoverChange(false);
    };

    return (
        <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
                overflowY: 'auto',
                overflowX: 'hidden',
                height: '100vh',
                position: 'fixed',
                transition: '.4s',
                left: '0',
                top: 0,
                bottom: 0,
                width: collapsed || OpenHover ? '240px' : '72px',

                '& .MuiList-root': {
                    display: 'flex',
                    whiteSpace: 'nowrap',
                    flexWrap: 'nowrap',
                    flexDirection: 'column'
                }
            }}>
            <Box
                className="side-menu"
                sx={{ overflow: collapsed || OpenHover ? 'auto' : 'hidden' }}>
                <List component="nav" sx={{ minWidth: '208px', marginTop: '80px' }}>
                    {itemMenus.map((itemMenu, index) => (
                        <ListItem
                            key={itemMenu.key}
                            button={true}
                            component={Link as React.ElementType}
                            to={
                                itemMenu.children && itemMenu.children.length > 0
                                    ? undefined
                                    : itemMenu.key
                            }
                            className={
                                location.pathname === itemMenu.key ||
                                itemMenu.children?.some(
                                    (dropdownItem) => location.pathname === dropdownItem.key
                                )
                                    ? 'nav-item active'
                                    : 'nav-item'
                            }
                            selected={location.pathname === itemMenu.key}
                            sx={{
                                maxWidth: collapsed || OpenHover ? '999px' : '59px',
                                flexWrap: collapsed || OpenHover ? 'wrap' : 'nowrap',
                                transition: '.4s',
                                backgroundColor:
                                    location.pathname === itemMenu.key ||
                                    itemMenu.children?.some(
                                        (dropdownItem) => location.pathname === dropdownItem.key
                                    )
                                        ? '#F2EBF0!important'
                                        : 'transparent',
                                borderRadius: '8px'
                            }}>
                            <ListItemIcon
                                onClick={
                                    itemMenu.children ? () => handleDropdown(index) : undefined
                                }
                                sx={{
                                    '& svg': {
                                        filter:
                                            location.pathname === itemMenu.key ||
                                            itemMenu.children?.some(
                                                (dropdownItem) =>
                                                    location.pathname === dropdownItem.key
                                            )
                                                ? ' brightness(0) saturate(100%) invert(27%) sepia(11%) saturate(3212%) hue-rotate(265deg) brightness(92%) contrast(91%)'
                                                : 'brightness(0) saturate(100%) invert(17%) sepia(8%) saturate(100%) hue-rotate(251deg) brightness(97%) contrast(90%)'
                                    },
                                    minWidth: '40px',
                                    marginRight: collapsed || OpenHover ? ' 0px' : '20px',

                                    transition: '.4s'
                                }}>
                                {itemMenu.icon}
                            </ListItemIcon>
                            <ListItemText
                                onClick={
                                    itemMenu.children ? () => handleDropdown(index) : undefined
                                }
                                primary={itemMenu.label}
                                sx={{
                                    '& a': {
                                        fontSize: '14px',
                                        color:
                                            location.pathname === itemMenu.key ||
                                            itemMenu.children?.some(
                                                (dropdownItem) =>
                                                    location.pathname === dropdownItem.key
                                            )
                                                ? '#7C3367'
                                                : '#333233'
                                    },
                                    marginY: 0,
                                    paddingY: '4px',
                                    '& span': {
                                        fontSize: '14px',
                                        color:
                                            location.pathname === itemMenu.key ||
                                            itemMenu.children?.some(
                                                (dropdownItem) =>
                                                    location.pathname === dropdownItem.key
                                            )
                                                ? '#7C3367'
                                                : '#333233'
                                    }
                                }}
                            />
                            {itemMenu.children &&
                                (open[index] ? (
                                    <ExpandLessIcon
                                        onClick={
                                            itemMenu.children
                                                ? () => handleDropdown(index)
                                                : undefined
                                        }
                                        sx={{
                                            color: '#666466!important',
                                            opacity: collapsed === true || OpenHover ? '1' : '0'
                                        }}
                                    />
                                ) : (
                                    <ExpandMoreIcon
                                        onClick={
                                            itemMenu.children
                                                ? () => handleDropdown(index)
                                                : undefined
                                        }
                                        sx={{
                                            color: '#666466!important',
                                            opacity: collapsed === true || OpenHover ? '1' : '0'
                                        }}
                                    />
                                ))}
                            {itemMenu.children && (
                                <Box
                                    sx={{
                                        overflow: 'hidden',
                                        marginLeft: 'auto',
                                        width: '100%',
                                        transition: open[index] ? '3s' : '1s',
                                        maxHeight: open[index] == true ? '1000px' : '0px'
                                    }}>
                                    <List component="div" disablePadding>
                                        {itemMenu.children.map((dropdownItem) => (
                                            <ListItem
                                                key={dropdownItem.key}
                                                button
                                                component={Link as React.ElementType}
                                                to={dropdownItem.key}
                                                selected={
                                                    location.pathname === dropdownItem.key ||
                                                    itemMenu.children?.some(
                                                        (dropdownItem) =>
                                                            location.pathname === dropdownItem.key
                                                    )
                                                }
                                                sx={{ backgroundColor: 'transparent!important' }}>
                                                <ListItemIcon
                                                    sx={{
                                                        '& svg': {
                                                            filter: itemMenu.children?.some(
                                                                (dropdownItem) =>
                                                                    location.pathname ===
                                                                    dropdownItem.key
                                                            )
                                                                ? ' brightness(0) saturate(100%) invert(27%) sepia(11%) saturate(3212%) hue-rotate(265deg) brightness(92%) contrast(91%)'
                                                                : 'brightness(0) saturate(100%) invert(17%) sepia(8%) saturate(100%) hue-rotate(251deg) brightness(97%) contrast(90%)'
                                                        },
                                                        minWidth: '20px'
                                                    }}>
                                                    {dropdownItem.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={dropdownItem.label}
                                                    sx={{
                                                        '& a': {
                                                            fontSize: '14px',
                                                            color:
                                                                location.pathname ===
                                                                dropdownItem.key
                                                                    ? '#7C3367'
                                                                    : '#333233'
                                                        }
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                        </ListItem>
                    ))}
                </List>
            </Box>
            <div className="hr"></div>
            <Box
                className="logout"
                sx={{
                    transition: '.4s',
                    overflow: 'hidden',
                    paddingLeft: collapsed || OpenHover ? '0' : '64px'
                }}>
                <Avatar
                    src={outIcon}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        backgroundColor: '#CBADC2',
                        marginRight: 4,
                        '& img': {
                            width: '15px',
                            height: '15px'
                        }
                    }}
                    onClick={() => {
                        Object.keys(Cookies.get()).forEach((cookieName) => {
                            Cookies.remove(cookieName);
                        });
                        navigate('/login');
                    }}
                />
                <Link
                    onClick={() => {
                        Object.keys(Cookies.get()).forEach((cookieName) => {
                            Cookies.remove(cookieName);
                        });
                        navigate('/login');
                    }}
                    to={'/login'}
                    style={{
                        textDecoration: 'none',
                        color: '#4C4B4C',
                        textAlign: 'center',
                        fontSize: 16,
                        fontFamily: 'roboto'
                    }}>
                    Đăng xuất
                </Link>
            </Box>
        </Box>
    );
};
export default AppSiderMenu;
