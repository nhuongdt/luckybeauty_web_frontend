/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { appRouters } from '../routers/index';
import './sider_menu.css';
import { Avatar, Menu, Typography } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import http from '../../services/httpService';
import Sider from 'antd/es/layout/Sider';
import { LogoutOutlined } from '@ant-design/icons';
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
    return (
        <Sider
            collapsed={collapsed}
            onCollapse={toggle}
            width={240}
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0
            }}
            theme="light">
            <div className="side-menu">
                <div className="toolbar">
                    <Avatar size={28} alt="Lucky Beauty" src={logo} />
                    <span className="p-2">
                        <Typography className="toolbar-title">Lucky Beauty</Typography>
                    </span>
                </div>
                <Menu
                    items={itemMenus}
                    defaultSelectedKeys={[location.pathname]}
                    mode="inline"></Menu>
            </div>
            <div className="hr"></div>
            <div className="logout">
                <Avatar
                    icon={<LogoutOutlined />}
                    size={'large'}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        backgroundColor: '#CBADC2',
                        marginRight: 6
                    }}
                    onClick={() => {
                        <Link to="/login"></Link>;
                    }}
                />
                <a
                    onClick={() => {
                        Object.keys(Cookies.get()).forEach((cookieName) => {
                            Cookies.remove(cookieName);
                        });
                        navigate('/');
                    }}
                    style={{
                        textDecoration: 'none',
                        color: '#4C4B4C',
                        textAlign: 'center',
                        fontSize: 16,
                        fontFamily: 'roboto'
                    }}>
                    Đăng xuất
                </a>
            </div>
        </Sider>
    );
};
export default AppSiderMenu;
{
    /* <Drawer
            variant="permanent"
            sx={{
                width: 256,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 256,
                    boxSizing: 'border-box',
                    borderRight: '0px',
                    backgroundColor: '#FFFFFF',
                    color: '#FFFFFF'
                }
            }}>
            <div style={{ minHeight: 0, height: 'calc(100% - 120px)', overflowY: 'auto' }}>
                {' '}
                <Grid
                    container
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ height: 'calc(100% - 120px)', justifyContent: 'flex-start' }}>
                    <Grid item>
                        <Toolbar
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: 15,
                                marginBottom: 10
                            }}>
                            <img src="../../images/Lucky_beauty.jpg" />
                            {collapsed ? null : (
                                <span className="p-2">
                                    <Typography
                                        variant="h6"
                                        noWrap
                                        component="div"
                                        style={{
                                            color: '#1F0D1A',
                                            fontSize: 18,
                                            fontWeight: 700,
                                            fontFamily: 'Roboto',
                                            height: 28
                                        }}>
                                        Lucky Beauty
                                    </Typography>
                                </span>
                            )}
                        </Toolbar>
                        <Divider />
                        {mainAppRoutes.map((menuItem) => {
                            if (menuItem.children.length > 0) {
                                return SiderSubMenuItem(menuItem, lstPermission, collapsed);
                            } else {
                                return SiderMenuItem(menuItem, lstPermission, collapsed);
                            }
                        })}
                    </Grid>
                </Grid>
            </div>

            <hr />
            <Box mt="auto">
                <ListItemButton
                    key={'logout'}
                    component={Link}
                    to="/login"
                    className="active-menu-bg">
                    <Stack
                        alignItems="center"
                        className={collapsed ? 'menu-item' : ''}
                        direction="row"
                        spacing={1}
                        style={{ width: '100%' }}>
                        <ListItemIcon className="menu-item-icon">
                            <LogoutIcon />
                        </ListItemIcon>
                        {collapsed ? null : (
                            <ListItemText
                                primary="Đăng xuất"
                                className="menu-item-title"></ListItemText>
                        )}
                    </Stack>
                </ListItemButton>
            </Box>
        </Drawer> */
}
