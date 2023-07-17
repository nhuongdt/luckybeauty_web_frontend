import { useState, useEffect, createContext } from 'react';
import { Grid, ButtonGroup, Button, Box } from '@mui/material';
import { ReactComponent as SearchIcon } from '../../images/search-normal.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Guid } from 'guid-typescript';
import '../style.css';

import CheckInNew from '../../check_in/CheckInNew';
import PageBanHang from './PageBanHangNew';
import Cookies from 'js-cookie';
import { PageKhachHangCheckInDto } from '../../../services/check_in/CheckinDto';
import { SuggestNguonKhachDto } from '../../../services/suggests/dto/SuggestNguonKhachDto';
import { SuggestNhomKhachDto } from '../../../services/suggests/dto/SuggestNhomKhachDto';
import SuggestService from '../../../services/suggests/SuggestService';
import { DataCustomerContext } from '../../../services/khach-hang/dto/DataContext';

export default function MainPageBanHang() {
    const [activeTab, setActiveTab] = useState(1);

    const [cusChosing, setCusChosing] = useState<PageKhachHangCheckInDto>(
        new PageKhachHangCheckInDto({ idKhachHang: Guid.EMPTY, tenKhachHang: 'Khách lẻ' })
    );

    const [nguonKhachs, setNguonKhachs] = useState<SuggestNguonKhachDto[]>([]);
    const [nhomKhachs, setNhomKhachs] = useState<SuggestNhomKhachDto[]>([]);

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
    //ẩn thanh cuộn dọc của trình duyệt khi vào trang bán hàng
    useEffect(() => {
        activeTab === 2
            ? (document.documentElement.style.overflowY = 'hidden')
            : (document.documentElement.style.overflowY = 'auto');

        return () => {
            document.documentElement.style.overflowY = 'auto';
        };
    }, [activeTab]);

    useEffect(() => {
        if (Cookies.get('tab') === '1') {
            handleTab(1);
        } else {
            handleTab(2);
        }
        GetDM_NguonKhach();
        GetDM_NhomKhach();
    }, []);

    // Xử lý thay đổi giao diện của tab thanh toán
    const [layout, setLayout] = useState(false);
    const handleLayoutToggle = () => {
        setLayout(!layout);
        if (layout == true) {
            Cookies.set('changed', 'true', { expires: 7 });
        } else {
            Cookies.set('changed', 'false');
        }
        console.log(Cookies.get('changed'));
    };
    useEffect(() => {
        if (Cookies.get('changed') === 'true') {
            setLayout(false);
        } else {
            setLayout(true);
        }
    }, []);
    const [PaymentChild, setPaymentChild] = useState(false);
    const handleShow = (value: boolean) => {
        setPaymentChild(value);
    };
    const [htmlValue, setHtmlValue] = useState<any>();

    const handleHtmlValue = (value: any) => {
        setHtmlValue(value);
    };

    return (
        <>
            <DataCustomerContext.Provider
                value={{ listNguonKhach: nguonKhachs, listNhomkhach: nhomKhachs }}>
                <Grid
                    container
                    padding={2}
                    columnSpacing={2}
                    rowSpacing={2}
                    bgcolor="#f8f8f8"
                    pr={activeTab === 1 ? '16px' : '0'}>
                    {!PaymentChild ? (
                        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                            <Box display="flex" gap="12px">
                                <ButtonGroup
                                    sx={{
                                        '& button': {
                                            fontSize: '16px',
                                            paddingX: '7px'
                                        }
                                    }}>
                                    <Button
                                        sx={{
                                            textTransform: 'unset',

                                            color: activeTab == 1 ? '#fff' : '#999699',
                                            backgroundColor:
                                                activeTab == 1
                                                    ? 'var(--color-main)!important'
                                                    : 'var(--color-bg)',
                                            borderColor: 'transparent!important',
                                            '&:hover': {
                                                borderColor:
                                                    activeTab == 2
                                                        ? 'var(--color-main)!important'
                                                        : 'transparent!important'
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
                                                activeTab == 2
                                                    ? 'var(--color-main)!important'
                                                    : 'var(--color-bg)',
                                            '&:hover': {
                                                borderColor:
                                                    activeTab == 1
                                                        ? 'var(--color-main)!important'
                                                        : 'transparent!important'
                                            }
                                        }}
                                        onClick={() => handleTab(2)}
                                        className={activeTab === 2 ? 'active' : ''}
                                        variant={activeTab === 2 ? 'contained' : 'outlined'}>
                                        Thanh toán
                                    </Button>
                                </ButtonGroup>
                                {activeTab === 2 && (
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            minWidth: 'unset',
                                            padding: '0',
                                            width: '40px',
                                            height: '40px',
                                            bgcolor: '#fff',
                                            '& svg': {
                                                color: '#999699'
                                            }
                                        }}
                                        onClick={handleLayoutToggle}
                                        className="btn-outline-hover">
                                        <MoreHorizIcon />
                                    </Button>
                                )}
                            </Box>
                            {activeTab === 2 ? htmlValue : undefined}
                        </Grid>
                    ) : undefined}
                    {activeTab === 1 && <CheckInNew hanleChoseCustomer={choseCustomer} />}
                    {activeTab === 2 && (
                        <PageBanHang
                            setHtmlElement={handleHtmlValue}
                            customerChosed={cusChosing}
                            CoditionLayout={layout}
                            onPaymentChild={handleShow}
                        />
                    )}
                </Grid>
            </DataCustomerContext.Provider>
        </>
    );
}
