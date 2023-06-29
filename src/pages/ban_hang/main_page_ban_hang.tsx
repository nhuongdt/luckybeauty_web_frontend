import { useState, useEffect } from 'react';
import { Grid, ButtonGroup, Button, Box } from '@mui/material';
import CheckInNew from './CheckInNew';
import PageBanHang from './PageBanHangNew';
import Cookies from 'js-cookie';
import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import './style.css';
import { Guid } from 'guid-typescript';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ReactComponent as SearchIcon } from '../../images/search-normal.svg';
export default function MainPageBanHang() {
    const [activeTab, setActiveTab] = useState(1);

    const [cusChosing, setCusChosing] = useState<PageKhachHangCheckInDto>(
        new PageKhachHangCheckInDto({ idKhachHang: Guid.EMPTY })
    );

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
    return (
        <>
            <Grid
                container
                padding={2}
                columnSpacing={2}
                rowSpacing={2}
                bgcolor="#f8f8f8"
                pr={activeTab === 1 ? '16px' : '0'}>
                {!PaymentChild ? (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
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
                                            activeTab == 1 ? '#7C3367!important' : '#F2EBF0',
                                        borderColor: 'transparent!important',
                                        '&:hover': {
                                            borderColor:
                                                activeTab == 2
                                                    ? '#7C3367!important'
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
                                            activeTab == 2 ? '#7C3367!important' : '#F2EBF0',
                                        '&:hover': {
                                            borderColor:
                                                activeTab == 1
                                                    ? '#7C3367!important'
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
                    </Grid>
                ) : undefined}
                {activeTab === 1 && <CheckInNew hanleChoseCustomer={choseCustomer} />}
                {activeTab === 2 && (
                    <PageBanHang
                        customerChosed={cusChosing}
                        CoditionLayout={layout}
                        onPaymentChild={handleShow}
                    />
                )}
            </Grid>
        </>
    );
}
