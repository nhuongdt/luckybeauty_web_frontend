import { Avatar, Button, Grid, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { IList } from '../../../services/dto/IList';
import React, { useEffect, useState } from 'react';
import khachHangService from '../../../services/khach-hang/khachHangService';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import { KhachHangItemDto } from '../../../services/khach-hang/dto/KhachHangItemDto';
import TabPanel from '../../../components/TabPanel/TabPanel';
import '../style.css';
import '../../../App.css';

import PageThuNgan from './page_thu_ngan';
import TabKhachHangNoBooking from '../../check_in/tab_khach_hang_nobooking';
import { PagedKhachHangResultRequestDto } from '../../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import TabKhachHangBooking from '../../check_in/tab_khach_hang_booking';
import TrangThaiFilter from '../../../enum/TrangThaiFilter';
import { TextTranslate } from '../../../components/TableLanguage';
import { useNavigate } from 'react-router-dom';

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
    const navigation = useNavigate();
    const [txtSearch, setTextSearch] = useState('');
    const [tabMainActive, setTabMainActive] = useState(ThuNgan_TabMain.KHACH_HANG);
    const [khachhang_tabActive, setKhachhang_TabActive] = useState(TabKhachHang.KHACH_HANG);
    const [thungan_tabActive, setThungan_tabActive] = useState(TabThuNgan.HOA_DON);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setKhachhang_TabActive(newValue);
        setThungan_tabActive(newValue);
    };

    const PageLoad = () => {
        //GetListCustomer();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    const changeActiveTabMain = (tabNew: number) => {
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
                    <HomeOutlinedIcon
                        onClick={() => navigation('/home')}
                        sx={{ color: 'var(--color-main)', '&:hover': { cursor: 'pointer' } }}
                    />
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
                            onChange={(e) => setTextSearch(e.target.value)}
                            InputProps={{ startAdornment: <SearchIcon /> }}
                        />
                    </Stack>
                )}
                {tabMainActive == ThuNgan_TabMain.HOA_DON && (
                    <Stack flex={{ sm: 2, lg: 3.5, xs: 2, md: 1 }}>
                        <TextField
                            size="small"
                            placeholder="Tìm kiếm dịch vụ"
                            onChange={(e) => setTextSearch(e.target.value)}
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
                        <Button variant="outlined" color="secondary">
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
                        style={{ minHeight: '86vh', position: 'relative' }}>
                        <TabKhachHangNoBooking txtSearch={txtSearch} />
                    </TabPanel>
                    <TabPanel
                        value={khachhang_tabActive}
                        index={TabKhachHang.CUOC_HEN}
                        style={{ minHeight: '86vh', position: 'relative' }}>
                        <TabKhachHangBooking txtSearch={txtSearch} />
                    </TabPanel>
                </>
            )}

            {tabMainActive == ThuNgan_TabMain.HOA_DON && (
                <>
                    <TabPanel value={tabMainActive} index={ThuNgan_TabMain.HOA_DON}>
                        <PageThuNgan txtSearch={txtSearch} />
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
