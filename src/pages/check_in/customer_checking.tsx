import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';

import {
    Add,
    Menu,
    CalendarMonth,
    MoreHoriz,
    QueryBuilder,
    SkipNext,
    SkipPrevious
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ModalAddCustomerCheckIn from './modal_add_cus_checkin';
import { PropModal } from '../../utils/PropParentToChild';
import { KHCheckInDto, PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import HoaDonContext from '../ban_hang/HoaDonContext';

import '../../App.css';
import '../ban_hang/style.css';
import { Guid } from 'guid-typescript';
import Utils from '../../utils/utils';

const shortNameCus = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minWidth: 'unset',
                    borderRadius: '35px',
                    width: '37px',
                    height: '35px',
                    border: 'none',
                    backgroundColor: '#e4cdde',
                    color: '#7C3367'
                }
            }
        }
    }
});

export default function CustomersChecking() {
    const history = useNavigate();
    const customerChecking = useContext(HoaDonContext);
    // const [customer, setCustomer] = useContext(HoaDonContext);

    const [activeTabProduct, setActiveTabProduc] = useState(false);
    const [cusChecking, setCusChecking] = useState<PageKhachHangCheckInDto>(
        new PageKhachHangCheckInDto({ idKhachHang: null })
    );
    const [listCusChecking, setListCusChecking] = useState<PageKhachHangCheckInDto[]>([]);

    const [triggerAddCheckIn, setTriggerAddCheckIn] = useState<PropModal>(
        new PropModal({ isShow: false })
    );
    const saveCheckInOK = (cusNew: KhachHangItemDto, idCheckin?: Guid) => {
        const cusChecking: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
            // idKhachHang: cusNew.id!,
            idCheckIn: idCheckin,
            maKhachHang: cusNew.maKhachHang,
            tenKhachHang: cusNew.tenKhachHang,
            soDienThoai: cusNew.soDienThoai,
            tongTichDiem: cusNew.tongTichDiem
        });
        setListCusChecking((arrOld: any) => {
            return { ...arrOld, ...cusChecking };
        });

        // save cache checkin
        const lcCheckIn = localStorage.getItem('lcCusCheckIn');
        let arr = [];
        if (!Utils.checkNull(lcCheckIn)) {
            arr = JSON.parse(lcCheckIn ?? '');
        }
        // remove & add again
        arr = arr.filter((x: any) => x.idCheckIn !== idCheckin);
        arr.push(cusChecking);
        localStorage.setItem('lcCusCheckIn', JSON.stringify(arr));
    };
    const gotoPage = (type: number) => {
        switch (type) {
            case 1:
                setActiveTabProduc(true);
                history('/page-ban-hang');
                break;
        }
    };
    const handleClickCustomer = (item: any) => {
        setCusChecking((old: any) => {
            return {
                ...old,
                idKhachHang: item.id,
                maKhachHang: item.maKhachHang,
                tenKhachHang: item.tenKhachHang,
                soDienThoai: item.soDienThoai,
                tongTichDiem: item.tongTichDiem
            };
        });
    };
    return (
        <>
            <ModalAddCustomerCheckIn trigger={triggerAddCheckIn} handleSave={saveCheckInOK} />
            <Grid container padding={2}>
                <Grid item xs={6} sm={4} md={4} lg={4}>
                    <Stack direction="row">
                        <SkipPrevious className="btnToggleLeft" />
                        <SkipNext className="btnToggleRight" onClick={(e) => gotoPage(1)} />
                    </Stack>
                </Grid>
                <Grid item xs={6} sm={8} md={8} lg={8} display="flex" justifyContent="flex-end">
                    <Stack direction="row" spacing={1}>
                        <Menu className="btnIcon" />
                        <CalendarMonth className="btnIcon" />
                        <Button
                            variant="contained"
                            className="btnIconText"
                            startIcon={<Add />}
                            sx={{ bgcolor: '#7c3367' }}
                            onClick={() => {
                                setTriggerAddCheckIn({ ...triggerAddCheckIn, isShow: true });
                            }}>
                            Thêm khách
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container columnSpacing={2} sx={{ padding: '0px 16px' }}>
                {/* start */}
                <Grid item xs={4} sm={3} md={2} lg={2}>
                    <Grid container border={1} borderColor="red" className="infor-cus" padding={2}>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={10} lg={11}>
                                <Stack direction="row" spacing={1}>
                                    <ThemeProvider theme={shortNameCus}>
                                        <Button variant="outlined">TM</Button>
                                    </ThemeProvider>
                                    <Stack>
                                        <Typography className="cusname">
                                            Nguyễn Nguyên Quang
                                        </Typography>
                                        <Typography className="cusphone" sx={{ color: '#acaca5' }}>
                                            0978555698
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={2} lg={1}>
                                <MoreHoriz />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Stack direction="row" spacing={1} paddingTop={1}>
                                    <Typography className="cuspoint">Điểm tích lũy:</Typography>
                                    <Typography className="cusname">250</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={9} lg={9}>
                                <Stack direction="row" spacing={1} paddingTop={1}>
                                    <Typography className="cuspoint">04/05/2023</Typography>
                                    <Box>
                                        <QueryBuilder
                                            style={{ fontSize: '14px', marginTop: '-5px' }}
                                        />
                                    </Box>
                                    <Typography className="cusname">9h00</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} style={{ textAlign: 'right' }}>
                                <Typography className="cusstatus" sx={{ color: '#a1a103' }}>
                                    Đang chờ
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {/* end */}

                {/* start */}
                <Grid item xs={4} sm={3} md={2} lg={2}>
                    <Grid container border={1} borderColor="red" className="infor-cus" padding={2}>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={10} lg={11}>
                                <Stack direction="row" spacing={1}>
                                    <ThemeProvider theme={shortNameCus}>
                                        <Button variant="outlined">TM</Button>
                                    </ThemeProvider>
                                    <Stack>
                                        <Typography className="cusname">
                                            Nguyễn Nguyên Quang
                                        </Typography>
                                        <Typography className="cusphone" sx={{ color: '#acaca5' }}>
                                            0978555698
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={2} lg={1}>
                                <MoreHoriz />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Stack direction="row" spacing={1} paddingTop={1}>
                                    <Typography className="cuspoint">Điểm tích lũy:</Typography>
                                    <Typography className="cusname">250</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={9} lg={9}>
                                <Stack direction="row" spacing={1} paddingTop={1}>
                                    <Typography className="cuspoint">04/05/2023</Typography>
                                    <Box>
                                        <QueryBuilder
                                            style={{ fontSize: '14px', marginTop: '-5px' }}
                                        />
                                    </Box>
                                    <Typography className="cusname">9h00</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} style={{ textAlign: 'right' }}>
                                <Typography className="cusstatus" sx={{ color: '#a1a103' }}>
                                    Đang chờ
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {/* end */}
            </Grid>
        </>
    );
}
