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
        console.log('collapsed: ' + collapsed);
        console.log('ischildhoverred: ' + isChildHovered);
    };
    const [collapsed, onCollapse] = useState(true);

    const toggle = () => {
        onCollapse(!collapsed);
        handleChildHoverChange(!isChildHovered);
    };

    return (
        <>
            <Container maxWidth={false} disableGutters={true}>
                <AppSiderMenu
                    collapsed={!collapsed}
                    toggle={toggle}
                    onHoverChange={handleChildHoverChange}
                />
                <Box
                    sx={{
                        marginLeft: collapsed && !isChildHovered ? '72px' : '240px',
                        transition: '.4s'
                    }}>
                    <Header
                        collapsed={collapsed}
                        toggle={toggle}
                        onClick={toggle}
                        isChildHovered={isChildHovered}
                    />
                    <Box
                        sx={{
                            border: 'solid 0.1rem #e6e1e6',
                            marginTop: '70px'
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
