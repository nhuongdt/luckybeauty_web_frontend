import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import './sider_menu.css';
import abpClient from '../abp-custom';
import { ListItemIcon, Stack } from '@mui/material';
const SiderMenuItem = (menuItem: any, lstPermission: string[], isCollapse: boolean) => {
    const location = useLocation();
    if (abpClient.isGrandPermission(menuItem.permission, lstPermission)) {
        return (
            <ListItemButton
                key={menuItem.path}
                component={Link}
                to={menuItem.path}
                className="active-menu-bg">
                {/* <Link to={menuItem.path}> </Link> */}
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                    className={
                        location.pathname === menuItem.path ? 'active-menu-item' : 'menu-item'
                    }
                    style={{ width: '100%' }}>
                    <ListItemIcon
                        className={
                            location.pathname === menuItem.path
                                ? 'active-menu-item-icon'
                                : 'menu-item-icon'
                        }>
                        {menuItem.icon}
                    </ListItemIcon>
                    {isCollapse ? null : (
                        <ListItemText
                            primary={menuItem.title}
                            className={
                                location.pathname === menuItem.path
                                    ? 'active-menu-item-title'
                                    : 'menu-item-title'
                            }></ListItemText>
                    )}
                </Stack>
            </ListItemButton>
        );
    }
    return null;
};

export default SiderMenuItem;
