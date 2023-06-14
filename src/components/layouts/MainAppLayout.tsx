import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header';
import AppSiderMenu from '../SiderMenu/index';
import Cookies from 'js-cookie';
import LoginAlertDialog from '../AlertDialog/LoginAlert';

import { Container } from '@mui/system';
import Box from '@mui/material/Box';

const isAuthenticated = (): boolean => {
    const accessToken = Cookies.get('accessToken');
    console.log(accessToken);
    if (accessToken && !accessToken.includes('error')) {
        try {
            return true;
        } catch (error) {
            console.log(error);
        }
    }
    return false;
};
const MainAppLayout: React.FC = () => {
    const [open, setOpen] = React.useState(!isAuthenticated);
    const navigate = useNavigate();
    useEffect(() => {
        setOpen(!isAuthenticated);
        console.log(open);
    }, []);

    const confirm = () => {
        setOpen(false);
        navigate('/login');
    };
    const [isChildHovered, setChildHovered] = useState(false);

    const handleChildHoverChange = (isHovered: boolean) => {
        setChildHovered(isHovered);
    };
    const [collapsed, onCollapse] = useState(true);

    const toggle = () => {
        onCollapse(!collapsed);
        handleChildHoverChange(!isChildHovered);
        if (collapsed !== true) {
            Cookies.set('sidebar', 'true', { expires: 7 });
        } else {
            Cookies.set('sidebar', 'false');
        }
    };
    const CookieSidebar = Cookies.get('sidebar') === 'true';
    useEffect(() => {
        if (CookieSidebar) {
            onCollapse(!collapsed);
        } else {
            onCollapse(false);
        }
    }, []);
    return (
        <>
            <Container maxWidth={false} disableGutters={true}>
                <AppSiderMenu
                    collapsed={!collapsed}
                    toggle={toggle}
                    onHoverChange={handleChildHoverChange}
                    CookieSidebar={CookieSidebar}
                />
                <Box
                    sx={{
                        marginLeft: collapsed ? '72px' : '240px',
                        transition: '.4s'
                    }}>
                    <Header
                        collapsed={collapsed}
                        toggle={toggle}
                        onClick={toggle}
                        isChildHovered={isChildHovered}
                        CookieSidebar={CookieSidebar}
                    />
                    <Box
                        sx={{
                            border: 'solid 0.1rem #e6e1e6',
                            marginTop: '70px',
                            minHeight: 'calc(100vh - 70px)',
                            bgcolor: 'rgba(248,248,248,1)'
                        }}>
                        <Outlet />
                        <LoginAlertDialog open={open} confirmLogin={confirm} />
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default MainAppLayout;
