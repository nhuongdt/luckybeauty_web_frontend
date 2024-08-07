import { Avatar, Button, Divider, Grid, IconButton, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import { IList } from '../../../services/dto/IList';
import React, { useEffect, useState } from 'react';
import khachHangService from '../../../services/khach-hang/khachHangService';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import { KhachHangItemDto } from '../../../services/khach-hang/dto/KhachHangItemDto';
import TabPanel from '../../../components/TabPanel/TabPanel';
import '../style.css';
import PageThuNgan from './page_thu_ngan';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { borderColor } from '@mui/system';

const TabThuNgan = {
    HOA_DON: 1,
    GOI_DICH_VU: 2
};
const ThuNgan_TabMain = {
    KHACH_HANG: 1,
    HOA_DON: 2
};
const TabKhachHang = {
    KHACH_HANG: 1,
    CUOC_HEN: 2
};

export default function MainPageThuNgan() {
    const [khachhang_tabActive, setKhachhang_TabActive] = useState(TabKhachHang.KHACH_HANG);
    const [tabMainActive, setTabMainActive] = useState(ThuNgan_TabMain.KHACH_HANG);
    const [thungan_tabActive, setThungan_tabActive] = useState(TabThuNgan.HOA_DON);
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
        setKhachhang_TabActive(newValue);
        setThungan_tabActive(newValue);
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

    const changeActiveTabMain = (tabNew: number) => {
        console.log('tabnew ', tabNew);
        setTabMainActive(tabNew);
        setKhachhang_TabActive(TabKhachHang.KHACH_HANG);
        setThungan_tabActive(TabThuNgan.HOA_DON);
    };
    return (
        <Stack className="main_page_thu_ngan" padding={2} justifyContent={'space-between'} position={'relative'}>
            <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }}
                justifyContent={'space-between'}
                spacing={{ xs: 2, sm: 2, lg: 4 }}>
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    spacing={2}
                    flex={tabMainActive == ThuNgan_TabMain.KHACH_HANG ? 2 : 2.5}>
                    <HomeOutlinedIcon />
                    {tabMainActive == ThuNgan_TabMain.KHACH_HANG && (
                        <Stack direction={'row'} spacing={2} alignItems={'center'}>
                            <Tabs value={khachhang_tabActive} onChange={handleChangeTab} aria-label="nav tabs example">
                                <Tab label="Khách hàng" value={TabKhachHang.KHACH_HANG} />
                                <Tab label="Cuộc hẹn" value={TabKhachHang.CUOC_HEN} />
                            </Tabs>
                            <KeyboardDoubleArrowRightIcon
                                sx={{ width: '32px', height: '32px' }}
                                onClick={() => changeActiveTabMain(ThuNgan_TabMain.HOA_DON)}
                            />
                        </Stack>
                    )}
                    {tabMainActive == ThuNgan_TabMain.HOA_DON && (
                        <Stack direction={'row'} spacing={2} alignItems={'center'}>
                            <Tabs value={thungan_tabActive} onChange={handleChangeTab} aria-label="nav tabs example">
                                <Tab label="Hóa đơn" value={TabThuNgan.HOA_DON} />
                                <Tab label="Gói dịch vụ" value={TabThuNgan.GOI_DICH_VU} />
                            </Tabs>
                            <KeyboardDoubleArrowLeftIcon
                                sx={{ width: '32px', height: '32px' }}
                                onClick={() => changeActiveTabMain(ThuNgan_TabMain.KHACH_HANG)}
                            />
                        </Stack>
                    )}
                </Stack>
                {tabMainActive == ThuNgan_TabMain.KHACH_HANG && (
                    <Stack flex={{ sm: 2, lg: 2, xs: 2, md: 1 }}>
                        <TextField
                            size="small"
                            placeholder="Tìm kiếm khách hàng"
                            InputProps={{ startAdornment: <SearchIcon /> }}
                        />
                    </Stack>
                )}
                {tabMainActive == ThuNgan_TabMain.HOA_DON && (
                    <Stack flex={{ sm: 2, lg: 3.5, xs: 2, md: 1 }}>
                        <TextField
                            size="small"
                            placeholder="Tìm kiếm dịch vụ"
                            InputProps={{ startAdornment: <SearchIcon /> }}
                        />
                    </Stack>
                )}
                {tabMainActive == ThuNgan_TabMain.HOA_DON && (
                    <Stack flex={{ sm: 2, lg: 6, xs: 2, md: 1 }} className="tab-hoadon">
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <Stack direction={'row'}>
                                <Typography padding={'8px 16px'} className="active">
                                    HD01
                                </Typography>
                                <Typography padding={'8px 16px'} className="not-active">
                                    HD02
                                </Typography>
                            </Stack>
                            <AddCircleOutlineOutlinedIcon />
                        </Stack>
                    </Stack>
                )}
                {tabMainActive == ThuNgan_TabMain.KHACH_HANG && (
                    <Stack direction={'row'} spacing={1} flex={2} justifyContent={'end'}>
                        <Button variant="outlined" color="info">
                            Thêm mới khách
                        </Button>
                        <Button variant="outlined" color="info">
                            Thêm lịch hẹn
                        </Button>
                    </Stack>
                )}
            </Stack>

            {tabMainActive == ThuNgan_TabMain.KHACH_HANG && (
                <>
                    <TabPanel
                        value={khachhang_tabActive}
                        index={TabKhachHang.KHACH_HANG}
                        style={{ marginTop: '20px', minHeight: '86vh' }}>
                        <Grid container spacing={2}>
                            {lstCustomer?.items?.map((cusItem, index) => (
                                <Grid item key={index} xs={12} sm={4} md={4} lg={3}>
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
                                                        <Typography variant="caption">
                                                            {cusItem?.soDienThoai}
                                                        </Typography>
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
                                                        color: '#b7b42d',
                                                        '&:hover': {
                                                            color: '#3c9977',
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
                                                        color: 'var(--color-second)',
                                                        '&:hover': {
                                                            color: '#c32b2b',
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
                    <TabPanel
                        value={khachhang_tabActive}
                        index={TabKhachHang.CUOC_HEN}
                        style={{ marginTop: '20px', minHeight: '86vh' }}>
                        <Grid container spacing={2}>
                            {lstCustomer?.items?.map((cusItem, index) => (
                                <Grid item key={index} xs={12} sm={4} md={4} lg={3}>
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
                                                        <Typography variant="caption">
                                                            {cusItem?.soDienThoai}
                                                        </Typography>
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
                </>
            )}

            {tabMainActive == ThuNgan_TabMain.HOA_DON && (
                <>
                    <TabPanel value={thungan_tabActive} index={TabThuNgan.HOA_DON}>
                        <PageThuNgan />
                    </TabPanel>
                    <TabPanel value={thungan_tabActive} index={TabThuNgan.GOI_DICH_VU}>
                        <PageThuNgan />
                    </TabPanel>
                </>
            )}

            {/* <Stack
                direction={'row'}
                position={'absolute'}
                bottom={2}
                className="tab-bottom"
                width={thungan_tabActive == TabThuNgan.KHACH_HANG ? '100%' : '48%'}
                sx={{ backgroundColor: 'var(--color-bg-main)', color: 'white' }}>
                {lstOption?.map((item, index) => (
                    <Stack
                        onClick={() => changeActiveTabThuNgan(item.id)}
                        key={index}
                        direction={'row'}
                        padding={'8px 16px'}
                        spacing={1}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#005e94',
                                cursor: 'pointer',
                                transition: '.4s',
                                color: 'white'
                            }
                        }}
                        className={thungan_tabActive == parseFloat(item.id) ? 'active' : 'not-active'}>
                        {item.icon}
                        <Typography>{item.text}</Typography>
                    </Stack>
                ))}
            </Stack> */}
        </Stack>
    );
}
