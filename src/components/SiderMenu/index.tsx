import React, { useEffect, useState } from 'react';
import { appRouters } from '../routers/index';
import './sider_menu.css';
import {
    Avatar,
    Box,
    Divider,
    Drawer,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    Stack,
    Toolbar,
    Typography
} from '@mui/material';
import { Link } from 'react-router-dom';
import SiderMenuItem from './SiderMenuItem';
import SiderSubMenuItem from './SiderSubMenuItem';
import Cookies from 'js-cookie';
import LogoutIcon from '@mui/icons-material/Logout';
import http from '../../services/httpService';
import { Grid } from '@mui/material';
interface Props {
    collapsed: boolean;
    toggle: () => void;
}

const AppSiderMenu: React.FC<Props> = ({ collapsed, toggle }) => {
    const defaultPermission: string[] = [
        'Pages',
        'Pages.KhachHang',
        'Pages.NhanSu',
        'Pages.KhachHang',
        'Pages.Booking',
        'Pages.Administration'
    ];
    const [lstPermission, setListPermission] = useState(defaultPermission);
    const mainAppRoutes = appRouters.mainRoutes[1].routes.filter(
        (item: { showInMenu: boolean }) => item.showInMenu === true
    );
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
        <Drawer
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
        </Drawer>
    );
};
export default AppSiderMenu;
