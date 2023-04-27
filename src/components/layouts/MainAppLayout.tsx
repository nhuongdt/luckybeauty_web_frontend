import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import AppSiderMenu from '../SiderMenu';
import Cookies from 'js-cookie';
import LoginAlertDialog from '../AlertDialog/LoginAlert';
import { Box, Toolbar } from '@mui/material';
import jwt_decode from 'jwt-decode';
const isAuthenticated = (): boolean => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
        try {
            return true;
        } catch (error) {
            console.log(error);
        }
    }
    return false;
};
const MainAppLayout: React.FC = () => {
    const [collapsed, onCollapse] = useState(false);
    const toggle = () => {
        onCollapse(!collapsed);
    };
    const [open, setOpen] = React.useState(isAuthenticated);
    const navigate = useNavigate();
    useEffect(() => {
        setOpen(isAuthenticated);
        console.log(open);
    }, [true]);

    const confirm = () => {
        setOpen(false);
        navigate('/login');
    };
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Box
                    component="nav"
                    sx={{
                        flexShrink: 0
                    }}>
                    <AppSiderMenu collapsed={collapsed} toggle={toggle} />
                </Box>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: `calc(100% - 256px )`,
                        minHeight: '100%',
                        backgroundColor: '#FFFFFF'
                    }}>
                    <Header collapsed={collapsed} toggle={toggle} />
                    <LoginAlertDialog open={open} confirmLogin={confirm} />
                    <Outlet />
                </Box>
            </Box>
            {/* <Layout style={{ minHeight: '100vh' }}>
                <AppSiderMenu collapsed={collapsed} toggle={toggle} />
                <Layout>
                    <Header collapsed={collapsed} toggle={toggle} />
                    <Content>
                        <Outlet />
                        <LoginAlertDialog open={open} confirmLogin={confirm} />
                    </Content>
                </Layout>
            </Layout> */}
        </>
    );
};

export default MainAppLayout;
