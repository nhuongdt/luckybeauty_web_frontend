import React from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    InputAdornment,
    Avatar,
    IconButton
} from '@mui/material';
import { ReactComponent as SearchIcon } from '../../images/search-normal.svg';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import avatar from '../../images/avatar.png';

import useWindowWidth from '../../components/StateWidth';
const TabKhachHang: React.FC = () => {
    const data = [
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            checkin: '1800 lần',
            price: '400.000đ',
            ganNhat: '06/07/2023 13h30',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            checkin: '1800 lần',
            price: '400.000đ',
            ganNhat: '06/07/2023 13h30',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            checkin: '1800 lần',
            price: '400.000đ',
            ganNhat: '06/07/2023 13h30',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            checkin: '1800 lần',
            price: '400.000đ',
            ganNhat: '06/07/2023 13h30',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            checkin: '1800 lần',
            price: '400.000đ',
            ganNhat: '06/07/2023 13h30',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            checkin: '1800 lần',
            price: '400.000đ',
            ganNhat: '06/07/2023 13h30',
            endTime: '8h30',
            state: 'Đã xác nhận'
        }
    ];
    const windowWidth = useWindowWidth();
    return (
        <Box>
            <Grid container rowGap={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        size="small"
                        fullWidth
                        sx={{ maxWidth: '375px' }}
                        placeholder="Tìm kiếm"
                        InputProps={{
                            startAdornment: (
                                <>
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                </>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#7C3367',
                            marginLeft: windowWidth > 600 ? 'auto' : '0',
                            height: 'fit-content'
                        }}
                        startIcon={<AddIcon />}
                        className="btn-container-hover">
                        Thêm cuộc hẹn mới
                    </Button>
                </Grid>
            </Grid>

            <Grid container spacing={2} mt="0">
                {data.map((item, index) => (
                    <Grid item key={index} sm={6} md={4} xs={12}>
                        <Box
                            sx={{
                                padding: '18px',
                                border: '1px solid #E6E1E6',
                                borderRadius: '8px',
                                boxShadow: '0px 7px 20px 0px #28293D14',
                                transition: '.4s',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: '#7C3367'
                                }
                            }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', gap: '8px' }}>
                                    <Avatar
                                        sx={{ width: 40, height: 40 }}
                                        src={item.avatar}
                                        alt={item.name}
                                    />
                                    <Box>
                                        <Typography variant="body1" fontSize="16px" color="#333233">
                                            {item.name}
                                        </Typography>
                                        <Typography fontSize="12px" variant="body1" color="#999699">
                                            {item.phone}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <IconButton sx={{ padding: '0' }}>
                                        <MoreHorizIcon sx={{ color: '#231F20', width: '15px' }} />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '16px',
                                    '& p': {
                                        fontSize: '14px',

                                        color: '#4C4B4C'
                                    }
                                }}>
                                <Box component="p" sx={{ fontWeight: '500' }}>
                                    Checkin:
                                </Box>
                                <Box component="p" sx={{ fontWeight: '700' }}>
                                    {item.checkin}
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        gap: '12px',
                                        color: '#4C4B4C'
                                    }}>
                                    <Box mr="3px">Gần nhất :</Box>
                                    <Box ml="3px">{item.ganNhat}</Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
export default TabKhachHang;
