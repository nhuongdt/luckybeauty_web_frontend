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
import { ReactComponent as ClockIcon } from '../../images/clock.svg';
import useWindowWidth from '../../components/StateWidth';
const TabCuocHen: React.FC = () => {
    const [tabFilter, setTabFilter] = React.useState(0);
    const handleChangeFilter = (value: number) => {
        setTabFilter(value);
    };
    const titleTab = ['Tất cả', 'Chưa xác nhận', 'Đã xác nhận'];

    const data = [
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            sevice: 'Cắt tóc',
            price: '400.000đ',
            startTime: '2h00',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            sevice: 'Cắt tóc',
            price: '400.000đ',
            startTime: '2h00',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            sevice: 'Cắt tóc',
            price: '400.000đ',
            startTime: '2h00',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            sevice: 'Cắt tóc',
            price: '400.000đ',
            startTime: '2h00',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            sevice: 'Cắt tóc',
            price: '400.000đ',
            startTime: '2h00',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            sevice: 'Cắt tóc',
            price: '400.000đ',
            startTime: '2h00',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            sevice: 'Cắt tóc',
            price: '400.000đ',
            startTime: '2h00',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài flex đến chết',
            phone: '0911290476',
            avatar: avatar,
            sevice: 'Cắt tóc uốn ép các kiểu con đà điểu ',
            price: '400.000đ',
            startTime: '2h00',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            sevice: 'Cắt tóc',
            price: '400.000đ',
            startTime: '2h00',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            sevice: 'Cắt tóc,tỉa tốt các thứ thứ các thứ hihihi hahahahah hoho hoho hoho ',
            price: '40.000.000đ',
            startTime: '2h00',
            endTime: '8h30',
            state: 'Đã xác nhận'
        },
        {
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            avatar: avatar,
            sevice: 'Cắt tóc',
            price: '400.000đ',
            startTime: '2h00',
            endTime: '8h30',
            state: 'Đã xác nhận'
        }
    ];
    const windowWidth = useWindowWidth();
    return (
        <Box>
            <Grid container rowSpacing={2}>
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
                            bgcolor: 'var(--color-main)',
                            marginLeft: windowWidth > 600 ? 'auto' : '0',
                            height: 'fit-content'
                        }}
                        startIcon={<AddIcon />}
                        className="btn-container-hover">
                        Thêm cuộc hẹn mới
                    </Button>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: '24px', marginY: '16px' }}>
                {titleTab.map((item, index) => (
                    <Button
                        onClick={() => handleChangeFilter(index)}
                        key={index}
                        variant="outlined"
                        sx={{
                            padding: '4px 8px',
                            borderRadius: '100px',
                            transition: '.4s',
                            minWidth: 'unset',
                            color: '#666466',
                            fontSize: '12px',
                            border: `1px solid ${
                                tabFilter === index ? 'transparent' : '#E6E1E6'
                            }!important`,
                            bgcolor:
                                tabFilter === index ? 'var(--color-bg)!important' : '#fff!important'
                        }}>
                        {item}
                    </Button>
                ))}
            </Box>
            <Grid container spacing={2}>
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
                                    borderColor: 'var(--color-main)'
                                },
                                '& p': {
                                    mb: '0'
                                }
                            }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box
                                    sx={{ display: 'flex', gap: '8px', width: '90%' }}
                                    title={item.name}>
                                    <Avatar
                                        sx={{ width: 40, height: 40 }}
                                        src={item.avatar}
                                        alt={item.name}
                                    />
                                    <Box sx={{ width: '100%' }}>
                                        <Typography
                                            variant="body1"
                                            fontSize="16px"
                                            color="#333233"
                                            sx={{
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden',
                                                maxWidth: '80%'
                                            }}>
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
                                    height: '42px',
                                    justifyContent: 'space-between',
                                    mt: '4px',
                                    '& p': {
                                        fontSize: '14px',

                                        color: '#4C4B4C'
                                    }
                                }}>
                                <Box
                                    title={item.sevice}
                                    component="p"
                                    sx={{
                                        fontWeight: '500',
                                        overflow: 'hidden',
                                        WebkitBoxOrient: 'vertical',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '2'
                                    }}>
                                    {item.sevice}
                                </Box>
                                <Box component="p" sx={{ fontWeight: '700' }}>
                                    {item.price}
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        color: '#666466'
                                    }}>
                                    <Box marginRight="4px">
                                        <ClockIcon />
                                    </Box>
                                    <Box mr="3px">{item.startTime}</Box> -{' '}
                                    <Box ml="3px">{item.endTime}</Box>
                                </Box>
                                <Box
                                    sx={{
                                        fontSize: '12px',
                                        padding: '4px 12px',
                                        borderRadius: '8px',
                                        color: 'var(--color-main)',
                                        bgcolor: 'var(--color-bg)'
                                    }}>
                                    {item.state}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
export default TabCuocHen;
