import { Avatar, Button, Divider, Grid, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { IList } from '../../../services/dto/IList';
import React, { useEffect, useState } from 'react';
import khachHangService from '../../../services/khach-hang/khachHangService';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import { KhachHangItemDto } from '../../../services/khach-hang/dto/KhachHangItemDto';
import TabPanel from '../../../components/TabPanel/TabPanel';
import { borderRadius } from '@mui/system';
const TabThuNgan = {
    KHACH_HANG: 1,
    CUOC_HEN: 2,
    HOA_DON: 3,
    GOI_DICH_VU: 4
};
const lstOption: IList[] = [
    { id: TabThuNgan.KHACH_HANG.toString(), text: 'Khách hàng', icon: <HomeOutlinedIcon /> },
    { id: TabThuNgan.HOA_DON.toString(), text: 'Hóa đơn', icon: <FormatListBulletedOutlinedIcon /> },
    { id: TabThuNgan.GOI_DICH_VU.toString(), text: 'Gói dịch vụ', icon: <CalendarMonthOutlinedIcon /> }
];

export default function MainPageThuNgan() {
    const [tabActive, setTabActive] = useState(TabThuNgan.KHACH_HANG);
    const [lstCustomer, setLstCustomer] = useState<PagedResultDto<KhachHangItemDto>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    });
    const [listCusBooking, setListCusBooking] = useState<PagedResultDto<KhachHangItemDto>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    });

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabActive(newValue);
        console.log('nv ', newValue);
    };

    const GetListCustomer = async () => {
        const data = await khachHangService.getAll({
            keyword: '',
            maxResultCount: 10,
            skipCount: 0,
            loaiDoiTuong: 1,
            sortBy: '',
            sortType: ''
        });
        setLstCustomer(data);
    };

    const PageLoad = () => {
        GetListCustomer();
    };

    useEffect(() => {
        PageLoad();
    }, []);
    return (
        <Stack padding={2} justifyContent={'space-between'} position={'relative'}>
            <Stack direction={'row'} justifyContent={'space-between'} spacing={4}>
                <Stack direction={'row'} alignItems={'center'} spacing={2} flex={1}>
                    <HomeOutlinedIcon />
                    <Tabs value={tabActive} onChange={handleChangeTab} aria-label="nav tabs example">
                        <Tab label="Khách hàng" value={TabThuNgan.KHACH_HANG} />
                        <Tab label="Cuộc hẹn" value={TabThuNgan.CUOC_HEN} />
                    </Tabs>
                </Stack>
                <Stack flex={2}>
                    <TextField size="small" placeholder="Tìm kiếm" InputProps={{ startAdornment: <SearchIcon /> }} />
                </Stack>
                <Stack direction={'row'} spacing={1} flex={1} justifyContent={'end'}>
                    <Button variant="outlined" color="info">
                        Thêm mới khách
                    </Button>
                    <Button variant="outlined" color="info">
                        Thêm lịch hẹn
                    </Button>
                </Stack>
            </Stack>

            <TabPanel value={tabActive} index={1} style={{ marginTop: '20px', minHeight: '86vh' }}>
                <Grid container spacing={2}>
                    {lstCustomer?.items?.map((cusItem, index) => (
                        <Grid item xs={3} key={index}>
                            <Stack
                                padding={1.5}
                                border={'1px solid transparent'}
                                borderRadius={1}
                                sx={{
                                    transition: '.4s',
                                    boxShadow: '0px 2px 5px 0px #c6bdd1',
                                    backgroundColor: '#fff',
                                    '&:hover': {
                                        borderColor: 'var(--color-main)',
                                        cursor: 'pointer'
                                    }
                                }}>
                                <Stack minHeight={100} justifyContent={'space-between'}>
                                    <Stack direction={'row'} padding={1} justifyContent={'space-between'}>
                                        <Stack spacing={2} direction={'row'}>
                                            <Stack>
                                                <Avatar src={cusItem?.avatar} />
                                            </Stack>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {cusItem?.tenKhachHang}
                                                </Typography>
                                                <Typography variant="caption">{cusItem?.soDienThoai}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        direction={'row'}
                                        alignItems={'center'}
                                        spacing={2}
                                        height={30}
                                        justifyContent={'space-between'}>
                                        <Stack
                                            direction={'row'}
                                            spacing={1}
                                            sx={{
                                                '&:hover': {
                                                    color: 'var(--color-main)',
                                                    cursor: 'pointer'
                                                }
                                            }}>
                                            <AddCircleOutlineOutlinedIcon />
                                            <Typography>Hóa đơn</Typography>
                                        </Stack>
                                        <Stack
                                            sx={{
                                                width: '1px',
                                                height: '100%'
                                            }}></Stack>

                                        <Stack
                                            direction={'row'}
                                            spacing={1}
                                            sx={{
                                                '&:hover': {
                                                    color: 'burlywood',
                                                    cursor: 'pointer'
                                                }
                                            }}>
                                            <AddCircleOutlineOutlinedIcon />
                                            <Typography> Gói dịch vụ</Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>

            <Stack direction={'row'} position={'absolute'} bottom={2}>
                {lstOption?.map((item, index) => (
                    <Stack key={index} direction={'row'} padding={'4px 16px'}>
                        {item.icon}
                        <Typography>{item.text}</Typography>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
}
