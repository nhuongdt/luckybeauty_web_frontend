/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { appRouters } from '../routers/index';
import './sider_menu.css';

import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import http from '../../services/httpService';
import { List, ListItem, ListItemIcon, ListItemText, Typography, Avatar } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Sider from 'antd/es/layout/Sider';
import { Box } from '@mui/material';
import outIcon from '../../images/Logout.svg';
import logo from '../../images/Lucky_beauty.jpg';
interface Props {
    collapsed: boolean;
    toggle: () => void;
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
const AppSiderMenu: React.FC<Props> = ({ collapsed, toggle }) => {
    const defaultPermission: string[] = [];
    const [lstPermission, setListPermission] = useState(defaultPermission);
    const mainAppRoutes = appRouters.mainRoutes[1].routes.filter(
        (item: { showInMenu: boolean }) => item.showInMenu === true
    );
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

    return (
        <Box
            sx={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                transition: '.4s',
                left: collapsed ? '-240px' : '0',
                top: 0,
                bottom: 0,
                width: '240px'
            }}>
            <div className="side-menu">
                <div className="toolbar">
                    <Avatar alt="Lucky Beauty" src={logo} />
                    <span className="p-2">
                        <Typography className="toolbar-title">Lucky Beauty</Typography>
                    </span>
                </div>
                <List component="nav">
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
                            sx={{ flexWrap: 'wrap' }}>
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
                                    }
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
                                    />
                                ) : (
                                    <ExpandMoreIcon
                                        onClick={
                                            itemMenu.children
                                                ? () => handleDropdown(index)
                                                : undefined
                                        }
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
                                                }>
                                                <ListItemIcon
                                                    sx={{
                                                        '& svg': {
                                                            filter:
                                                                location.pathname ===
                                                                    itemMenu.key ||
                                                                itemMenu.children?.some(
                                                                    (dropdownItem) =>
                                                                        location.pathname ===
                                                                        dropdownItem.key
                                                                )
                                                                    ? ' brightness(0) saturate(100%) invert(27%) sepia(11%) saturate(3212%) hue-rotate(265deg) brightness(92%) contrast(91%)'
                                                                    : 'brightness(0) saturate(100%) invert(17%) sepia(8%) saturate(100%) hue-rotate(251deg) brightness(97%) contrast(90%)'
                                                        }
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
                {/* <Menu
                    items={itemMenus}
                    defaultSelectedKeys={[location.pathname]}
                    mode="inline"></Menu> */}
            </div>
            <div className="hr"></div>
            <Link
                to={'/login'}
                className="logout"
                onClick={() => {
                    Object.keys(Cookies.get()).forEach((cookieName) => {
                        Cookies.remove(cookieName);
                    });
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
                />
                <Link
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
            </Link>
        </Box>
    );
};
export default AppSiderMenu;
