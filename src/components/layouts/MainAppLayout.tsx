import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header';
import AppSiderMenu from '../SiderMenu';
import Cookies from 'js-cookie';
import LoginAlertDialog from '../AlertDialog/LoginAlert';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
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
    const [collapsed, onCollapse] = useState(false);
    const toggle = () => {
        onCollapse(!collapsed);
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
            <Layout>
                <AppSiderMenu collapsed={collapsed} toggle={toggle} />
                <Layout style={{ marginLeft: 240 }}>
                    <Header collapsed={collapsed} toggle={toggle} />
                    <Content style={{ border: 'solid 0.1rem #e6e1e6' }}>
                        <Outlet />
                        <LoginAlertDialog open={open} confirmLogin={confirm} />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default MainAppLayout;
