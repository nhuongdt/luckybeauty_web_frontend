import { Box, Menu, MenuItem, Grid, IconButton, Badge } from '@mui/material';
import './header.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { AccountCircle, LogoutOutlined } from '@mui/icons-material';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
const userDropdownMenu = (
    <Menu open>
        <MenuItem key="2">
            <Link to="/logout">
                <LogoutOutlined />
                <span> Logout </span>
            </Link>
        </MenuItem>
    </Menu>
);
interface HeaderProps {
    collapsed: boolean;
    toggle: () => void;
}
const Header: React.FC<HeaderProps> = ({ collapsed, toggle }) => {
    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        console.log('OK');
    };

    return (
        <Box className="header">
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                <Grid item></Grid>
                <Grid item>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit">
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit">
                            <AccountCircle />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-haspopup="true"
                            //onClick={handleMobileMenuOpen}
                            color="inherit">
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
export default Header;
