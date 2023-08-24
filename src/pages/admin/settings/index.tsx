import {
    Box,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from '@mui/material';
import { Component, ReactNode } from 'react';
import { ReactComponent as StoreIcon } from '../../../images/icons/setting_page/shop_active_blue.svg';
import { ReactComponent as PeopleIcon } from '../../../images/icons/setting_page/people_active_blue.svg';
import { ReactComponent as CartIcon } from '../../../images/icons/setting_page/shopping_cart_active_blue.svg';
import { ReactComponent as UserIcon } from '../../../images/icons/setting_page/user_active_blue.svg';
import { ReactComponent as ArrowRightIcon } from '../../../images/icons/setting_page/arrow_right.svg';
import { Link } from 'react-router-dom';
class SettingPages extends Component {
    render(): ReactNode {
        return (
            <Box>
                <Box padding={'16px 32px'}>
                    <Typography
                        fontWeight="700"
                        fontFamily={'Roboto'}
                        fontSize="18px"
                        sx={{ color: 'black' }}>
                        Cài đặt
                    </Typography>
                </Box>
                <Box padding={'16px 32px'}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                            <Box
                                padding={'16px 32px'}
                                borderRadius={4}
                                border={'1px solid #E0E4EB'}
                                display={'flex'}
                                justifyContent={'space-between'}
                                flexDirection={'column'}>
                                <Box
                                    display={'flex'}
                                    justifyContent={'start'}
                                    alignItems={'center'}>
                                    <StoreIcon />
                                    <Typography
                                        marginLeft={'8px'}
                                        fontSize={18}
                                        fontWeight={700}
                                        fontFamily={'Roboto'}>
                                        Cài đặt cửa hàng
                                    </Typography>
                                </Box>
                                <List>
                                    <ListItem
                                        component={Link as React.ElementType}
                                        to={'/settings/cua-hang'}
                                        secondaryAction={
                                            <IconButton>
                                                <ArrowRightIcon />
                                            </IconButton>
                                        }>
                                        <ListItemText
                                            sx={{
                                                color: 'black',
                                                fontSize: '14px',
                                                fontWeight: '400',
                                                fontFamily: 'Roboto'
                                            }}>
                                            Chi tiết cửa hàng
                                        </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <ListItem
                                        component={Link as React.ElementType}
                                        to={'/settings/chi-nhanhs'}
                                        secondaryAction={
                                            <IconButton>
                                                <ArrowRightIcon />
                                            </IconButton>
                                        }>
                                        <ListItemText
                                            sx={{
                                                color: 'black',
                                                fontSize: '14px',
                                                fontWeight: '400',
                                                fontFamily: 'Roboto'
                                            }}>
                                            Quản lý chi nhánh
                                        </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <ListItem
                                        component={Link as React.ElementType}
                                        to={'/settings/dat-lich'}
                                        secondaryAction={
                                            <IconButton>
                                                <ArrowRightIcon />
                                            </IconButton>
                                        }>
                                        <ListItemText
                                            sx={{
                                                color: 'black',
                                                fontSize: '14px',
                                                fontWeight: '400',
                                                fontFamily: 'Roboto'
                                            }}>
                                            Cài đặt booking
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                            <Box
                                padding={'16px 32px'}
                                borderRadius={4}
                                border={'1px solid #E0E4EB'}
                                display={'flex'}
                                justifyContent={'space-between'}
                                flexDirection={'column'}>
                                <Box
                                    display={'flex'}
                                    justifyContent={'start'}
                                    alignItems={'center'}>
                                    <PeopleIcon />
                                    <Typography
                                        marginLeft={'8px'}
                                        fontSize={18}
                                        fontWeight={700}
                                        fontFamily={'Roboto'}>
                                        Cài đặt nhân viên
                                    </Typography>
                                </Box>
                                <List>
                                    <ListItem
                                        component={Link as React.ElementType}
                                        to={'/settings/hoa-hong'}
                                        secondaryAction={
                                            <IconButton>
                                                <ArrowRightIcon />
                                            </IconButton>
                                        }>
                                        <ListItemText
                                            sx={{
                                                color: 'black',
                                                fontSize: '14px',
                                                fontWeight: '400',
                                                fontFamily: 'Roboto'
                                            }}>
                                            Hoa hồng
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                            <Box
                                padding={'16px 32px'}
                                borderRadius={4}
                                border={'1px solid #E0E4EB'}
                                display={'flex'}
                                justifyContent={'space-between'}
                                flexDirection={'column'}>
                                <Box
                                    display={'flex'}
                                    justifyContent={'start'}
                                    alignItems={'center'}>
                                    <CartIcon />
                                    <Typography
                                        marginLeft={'8px'}
                                        fontSize={18}
                                        fontWeight={700}
                                        fontFamily={'Roboto'}>
                                        Bán hàng
                                    </Typography>
                                </Box>
                                <List>
                                    <ListItem
                                        component={Link as React.ElementType}
                                        to={'/settings/mau-in'}
                                        secondaryAction={
                                            <IconButton>
                                                <ArrowRightIcon />
                                            </IconButton>
                                        }>
                                        <ListItemText
                                            sx={{
                                                color: 'black',
                                                fontSize: '14px',
                                                fontWeight: '400',
                                                fontFamily: 'Roboto'
                                            }}>
                                            Mẫu in
                                        </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <ListItem
                                        secondaryAction={
                                            <IconButton>
                                                <ArrowRightIcon />
                                            </IconButton>
                                        }>
                                        <ListItemText
                                            sx={{
                                                color: 'black',
                                                fontSize: '14px',
                                                fontWeight: '400',
                                                fontFamily: 'Roboto'
                                            }}>
                                            Voucher
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                            <Box
                                padding={'16px 32px'}
                                borderRadius={4}
                                border={'1px solid #E0E4EB'}
                                display={'flex'}
                                justifyContent={'space-between'}
                                flexDirection={'column'}>
                                <Box
                                    display={'flex'}
                                    justifyContent={'start'}
                                    alignItems={'center'}>
                                    <UserIcon />
                                    <Typography
                                        marginLeft={'8px'}
                                        fontSize={18}
                                        fontWeight={700}
                                        fontFamily={'Roboto'}>
                                        Cài đặt khách hàng
                                    </Typography>
                                </Box>
                                <List>
                                    <ListItem
                                        secondaryAction={
                                            <IconButton>
                                                <ArrowRightIcon />
                                            </IconButton>
                                        }>
                                        <ListItemText
                                            sx={{
                                                color: 'black',
                                                fontSize: '14px',
                                                fontWeight: '400',
                                                fontFamily: 'Roboto'
                                            }}>
                                            Đánh giá của khách hàng
                                        </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <ListItem
                                        secondaryAction={
                                            <IconButton>
                                                <ArrowRightIcon />
                                            </IconButton>
                                        }>
                                        <ListItemText
                                            sx={{
                                                color: 'black',
                                                fontSize: '14px',
                                                fontWeight: '400',
                                                fontFamily: 'Roboto'
                                            }}>
                                            Tin nhắn tự động
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        );
    }
}
export default SettingPages;
