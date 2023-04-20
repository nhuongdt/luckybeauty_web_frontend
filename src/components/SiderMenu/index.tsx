import React, { useEffect, useState } from 'react';
import Sider from 'antd/es/layout/Sider';
import { appRouters } from '../routers/index';
import './sider_menu.css';
import { List } from '@mui/icons-material';
import {
    Avatar,
    Divider,
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
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
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
        axios
            .post(
                `https://localhost:44311/api/services/app/Permission/GetAllPermissionByRole?UserId=${userId}`,
                {
                    headers: {
                        accept: 'text/plain',
                        Authorization: 'Bearer ' + token,
                        'X-XSRF-TOKEN': encryptedAccessToken
                    }
                }
            )
            .then((response) => {
                setListPermission(response.data.result['permissions']);
                console.log(response.data.result['permissions']);
            })
            .catch((error) => console.log(error));
    }, defaultPermission);
    return (
        <Sider
            collapsed={collapsed}
            onCollapse={toggle}
            width={256}
            style={{ height: '100vh' }}
            theme="light"
            className="side-menu">
            <Toolbar>
                <Avatar
                    alt="Lucky Beauty"
                    src="../../images/user.png"
                    sx={{ width: 28, height: 28 }}
                />
                <span className="p-2">
                    <Typography variant="h6" noWrap component="span">
                        Lucky Beauty
                    </Typography>
                </span>
            </Toolbar>
            <Divider variant="fullWidth" light={false} />
            {mainAppRoutes.map((menuItem) => {
                if (menuItem.children.length > 0) {
                    return SiderSubMenuItem(menuItem, lstPermission);
                } else {
                    return SiderMenuItem(menuItem, lstPermission);
                }
            })}
            <ListItemButton component={Link} to="/logout" className="active-menu-bg">
                {/* <Link to={menuItem.path}> </Link> */}
                <Stack alignItems="center" direction="row" spacing={1} style={{ width: '100%' }}>
                    <ListItemIcon className="menu-item-icon">
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Đăng xuất" className="menu-item-title"></ListItemText>
                </Stack>
            </ListItemButton>
        </Sider>
    );
};
export default AppSiderMenu;
