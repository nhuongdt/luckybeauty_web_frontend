import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import AppSiderMenu from '../SiderMenu';
import Cookies from 'js-cookie';
import LoginAlertDialog from '../AlertDialog/LoginAlert';
import jwt_decode from 'jwt-decode';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
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
    const [open, setOpen] = React.useState(!isAuthenticated);
    const navigate = useNavigate();
    useEffect(() => {
        setOpen(!isAuthenticated);
        console.log(open);
    }, [true]);

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
