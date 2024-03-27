import { useState, useEffect, createContext } from 'react';
import { Grid, ButtonGroup, Button, Box, Stack, Typography } from '@mui/material';
import { ReactComponent as SearchIcon } from '../../images/search-normal.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Guid } from 'guid-typescript';
import '../style.css';
import TableChartIcon from '@mui/icons-material/TableChart';

import CheckInNew from '../../check_in/CheckInNew';
import PageBanHang from './PageBanHangNew';
import Cookies from 'js-cookie';
import { PageKhachHangCheckInDto } from '../../../services/check_in/CheckinDto';
import { SuggestNguonKhachDto } from '../../../services/suggests/dto/SuggestNguonKhachDto';
import { SuggestNhomKhachDto } from '../../../services/suggests/dto/SuggestNhomKhachDto';
import SuggestService from '../../../services/suggests/SuggestService';
import { DataCustomerContext } from '../../../services/khach-hang/dto/DataContext';
import SettingsBackupRestoreOutlinedIcon from '@mui/icons-material/SettingsBackupRestoreOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { IList } from '../../../services/dto/IList';
import { handleClickOutside } from '../../../utils/customReactHook';

export default function MainPageBanHang() {
    const [activeTab, setActiveTab] = useState(1);
    const [expandAction, setExpandAction] = useState(false);
    const ref = handleClickOutside(() => setExpandAction(false));

    const lstOption: IList[] = [
        { id: '1', text: 'Trang chủ', icon: <HomeOutlinedIcon /> },
        { id: '2', text: 'Danh sách hóa đơn', icon: <FormatListBulletedOutlinedIcon /> },
        { id: '3', text: 'Lịch hẹn', icon: <CalendarMonthOutlinedIcon /> }
    ];

    const [cusChosing, setCusChosing] = useState<PageKhachHangCheckInDto>(
        new PageKhachHangCheckInDto({ idKhachHang: Guid.EMPTY, tenKhachHang: 'Khách lẻ' })
    );

    const [nguonKhachs, setNguonKhachs] = useState<SuggestNguonKhachDto[]>([]);
    const [nhomKhachs, setNhomKhachs] = useState<SuggestNhomKhachDto[]>([]);

    const clickAction = (item: IList) => {
        setExpandAction(false);

        switch (item.id) {
            case '1':
                window.open('/home');
                break;
            case '2':
                window.open('/giao-dich-thanh-toan');
                break;
            case '3':
                window.open('/lich-hens');
                break;
        }
    };

    const GetDM_NguonKhach = async () => {
        const data = await SuggestService.SuggestNguonKhach();
        setNguonKhachs(data);
    };
    const GetDM_NhomKhach = async () => {
        const data = await SuggestService.SuggestNhomKhach();
        setNhomKhachs(data);
    };

    const handleTab = (tabIndex: number) => {
        setActiveTab(tabIndex);
        setExpandAction(false);

        if (tabIndex === 1) {
            Cookies.set('tab', '1', { expires: 7 });
        } else {
            Cookies.set('tab', '2');
        }
    };

    const choseCustomer = (cus: any) => {
        setCusChosing((old: any) => {
            return {
                ...old,
                idCheckIn: cus.idCheckIn,
                idKhachHang: cus.idKhachHang,
                maKhachHang: cus.maKhachHang,
                tenKhachHang: cus.tenKhachHang,
                soDienThoai: cus.soDienThoai,
                tongTichDiem: cus.tongTichDiem
            };
        });
        setActiveTab(2);
    };

    useEffect(() => {
        if (Cookies.get('tab') === '1') {
            handleTab(1);
        } else {
            handleTab(2);
        }
        GetDM_NguonKhach();
        GetDM_NhomKhach();
    }, []);

    // Xử lý thay đổi giao diện của tab thanh toán (giao diện ngang/dọc)
    const [horizontalLayout, setHorizontalLayout] = useState(true);
    useEffect(() => {
        if (Cookies.get('horizontalLayout') === 'false') {
            setHorizontalLayout(false);
        } else {
            setHorizontalLayout(true);
        }
    }, []);

    const onChangeLayoutPageBanHang = (horizontalLayout: boolean) => {
        setHorizontalLayout(true);
        Cookies.set('horizontalLayout', horizontalLayout.toString(), { expires: 7 });
    };

    return (
        <>
            <DataCustomerContext.Provider value={{ listNguonKhach: nguonKhachs, listNhomkhach: nhomKhachs }}>
                <Grid
                    container
                    //padding={2}
                    columnSpacing={2}
                    rowSpacing={2}
                    bgcolor="#f8f8f8"
                    // pr={activeTab === 1 ? '16px' : '0'}
                >
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <Box display="flex" gap="12px" padding={2}>
                            <ButtonGroup
                                sx={{
                                    '& button': {
                                        // fontSize: '16px',
                                        // paddingX: '7px'
                                    }
                                }}>
                                <Button
                                    sx={{
                                        textTransform: 'unset',

                                        color: activeTab == 1 ? '#fff' : '#999699',
                                        backgroundColor:
                                            activeTab == 1 ? 'var(--color-main)!important' : 'var(--color-bg)',
                                        borderColor: 'transparent!important',
                                        '&:hover': {
                                            borderColor:
                                                activeTab == 2 ? 'var(--color-main)!important' : 'transparent!important'
                                        }
                                    }}
                                    onClick={() => handleTab(1)}
                                    className={activeTab === 1 ? 'active' : ''}
                                    variant={activeTab === 1 ? 'contained' : 'outlined'}>
                                    Checkin
                                </Button>
                                <Button
                                    sx={{
                                        textTransform: 'unset',

                                        color: activeTab == 2 ? '#fff' : '#999699',
                                        borderColor: 'transparent!important',
                                        backgroundColor:
                                            activeTab == 2 ? 'var(--color-main)!important' : 'var(--color-bg)',
                                        '&:hover': {
                                            borderColor:
                                                activeTab == 1 ? 'var(--color-main)!important' : 'transparent!important'
                                        }
                                    }}
                                    onClick={() => {
                                        handleTab(2);
                                        setCusChosing(
                                            new PageKhachHangCheckInDto({
                                                idKhachHang: Guid.EMPTY,
                                                tenKhachHang: 'Khách lẻ'
                                            })
                                        );
                                    }}
                                    className={activeTab === 2 ? 'active' : ''}
                                    variant={activeTab === 2 ? 'contained' : 'outlined'}>
                                    Thanh toán
                                </Button>
                            </ButtonGroup>

                            <div ref={ref}>
                                <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Button
                                            variant="contained"
                                            endIcon={<SettingsBackupRestoreOutlinedIcon />}
                                            onClick={() => setExpandAction(!expandAction)}>
                                            Quay lại
                                        </Button>

                                        <Box
                                            sx={{
                                                display: expandAction ? '' : 'none',
                                                zIndex: 1,
                                                position: 'absolute',
                                                borderRadius: '4px',
                                                border: '1px solid #cccc',
                                                minWidth: 200,
                                                backgroundColor: 'rgba(248,248,248,1)',
                                                '& .MuiStack-root .MuiStack-root:hover': {
                                                    backgroundColor: '#cccc'
                                                }
                                            }}>
                                            <Stack>
                                                {lstOption?.map((item: IList, index: number) => (
                                                    <Stack
                                                        direction={'row'}
                                                        key={index}
                                                        spacing={1}
                                                        padding={'6px'}
                                                        alignItems={'center'}
                                                        sx={{ cursor: 'pointer' }}
                                                        onClick={() => clickAction(item)}>
                                                        {item.icon}
                                                        <Typography variant="subtitle2" marginLeft={1}>
                                                            {item.text}
                                                        </Typography>
                                                    </Stack>
                                                ))}
                                            </Stack>
                                        </Box>
                                    </Box>
                                </Stack>
                            </div>
                        </Box>
                    </Grid>

                    {activeTab === 1 && <CheckInNew hanleChoseCustomer={choseCustomer} />}
                    {activeTab === 2 && <PageBanHang customerChosed={cusChosing} horizontalLayout={horizontalLayout} />}
                </Grid>
            </DataCustomerContext.Provider>
        </>
    );
}
