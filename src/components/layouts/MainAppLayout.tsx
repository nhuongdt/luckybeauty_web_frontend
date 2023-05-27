import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header';
import AppSiderMenu from '../SiderMenu/indexNew';
import Cookies from 'js-cookie';
import LoginAlertDialog from '../AlertDialog/LoginAlert';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
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
    const [collapsed, onCollapse] = useState(true);
    const toggle = () => {
        onCollapse(!collapsed);
        console.log('hihi');
    };
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
    return (
        <>
            <Container maxWidth={false} disableGutters={true}>
                <AppSiderMenu collapsed={!collapsed} toggle={toggle} />
                <Box
                    style={{
                        marginLeft: collapsed ? 240 : 0,
                        position: 'relative',
                        transition: '.4s'
                    }}>
                    <Header collapsed={collapsed} toggle={toggle} onClick={toggle} />
                    <Box style={{ border: 'solid 0.1rem #e6e1e6', backgroundColor: '#EEECEC' }}>
                        <Outlet />
                        <LoginAlertDialog open={open} confirmLogin={confirm} />
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default MainAppLayout;
