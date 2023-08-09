import React, { useContext, useEffect, useState } from 'react';
import OverViewNew from './components/OverView/overViewNew';
import './dashboardNew.css';
import AppoimentsNew from './components/Appointment/AppointmentsNew';
import LineChartNew from './components/Charts/LineChartNew';
import ColumnChartNew from './components/Charts/ColumnChartNew';
import HotServicesNew from './components/Statistical/HotServicesNew';
import Box from '@mui/material/Box';
import OverView from './components/OverView/ovver-view';
import { Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import dashboardStore from '../../stores/dashboardStore';
import AppConsts from '../../lib/appconst';
import Cookies from 'js-cookie';
import { observer } from 'mobx-react';
import { ChiNhanhContext } from '../../services/chi_nhanh/ChiNhanhContext';

const Dashboard: React.FC = () => {
    const [dashboardDateView, setDashboardDateView] = useState('day');
    const chinhanh = useContext(ChiNhanhContext);
    useEffect(() => {
        getData(); // This will be called when chinhanh.id changes
    }, [chinhanh.id]);

    const getData = async () => {
        const storedDateType = Cookies.get('dashBoardDateType') ?? 'day';
        dashboardStore.dashboardDateType = storedDateType;
        setDashboardDateView(storedDateType);
        await dashboardStore.getData({
            ...dashboardStore.filter,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? AppConsts.guidEmpty
        });
    };
    const sumTongTien = dashboardStore.thongKeDoanhThu?.reduce(
        (sum, item) => sum + item.thangNay,
        0
    );
    const handleChangeDateType = async (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value as string;
        setDashboardDateView(newValue);
        await dashboardStore.onChangeDateType(event.target.value as string);
        if (newValue === 'week') {
            Cookies.set('dashBoardDateType', 'week');
        } else if (newValue === 'day') {
            Cookies.set('dashBoardDateType', 'day');
        } else if (newValue === 'month') {
            Cookies.set('dashBoardDateType', 'month');
        } else if (newValue === 'year') {
            Cookies.set('dashBoardDateType', 'year');
        }
    };
    return (
        <div>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ padding: '0 2.2222222222222223vw', paddingTop: '1.6666666666666667vw' }}>
                <div className="page-header_col-1">
                    <div className="breadcrumb">Trang chủ</div>
                </div>
                <Select
                    size="small"
                    onChange={handleChangeDateType}
                    value={dashboardDateView}
                    sx={{
                        bgcolor: '#fff',
                        fontSize: '14px'
                    }}>
                    <MenuItem value="day">Ngày</MenuItem>
                    <MenuItem value="week">Tuần</MenuItem>
                    <MenuItem value="month">Tháng</MenuItem>
                    <MenuItem value="year">Năm</MenuItem>
                </Select>
            </Box>
            <div className="page-body">
                <div
                    style={{
                        marginBottom: '14px'
                    }}>
                    <OverView />
                </div>
                <Grid container spacing={0.5}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Box>
                            <Typography
                                sx={{
                                    color: '#29303D',
                                    fontFamily: 'Roboto',
                                    fontSize: '18px',
                                    fontWeight: '700'
                                }}>
                                Danh sách cuộc hẹn hôm nay
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#29303D',
                                    fontFamily: 'Roboto',
                                    fontSize: '12px',
                                    fontWeight: '400'
                                }}>
                                Cuộc hẹn mới nhất
                            </Typography>
                            <AppoimentsNew />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <div className="page-body_row-2_col-2">
                            <Typography
                                sx={{
                                    color: '#29303D',
                                    fontFamily: 'Roboto',
                                    fontSize: '18px',
                                    fontWeight: '700'
                                }}>
                                Tổng số cuộc hẹn hàng tuần
                            </Typography>
                            <LineChartNew />
                        </div>
                    </Grid>
                </Grid>

                <div
                    style={{
                        marginTop: '14px'
                    }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                            <Grid item>
                                <Typography
                                    sx={{
                                        color: '#29303D',
                                        fontFamily: 'Roboto',
                                        fontSize: '18px',
                                        fontWeight: '700'
                                    }}>
                                    Doanh thu
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#29303D',
                                        fontFamily: 'Roboto',
                                        fontSize: '12px',
                                        fontWeight: '400'
                                    }}>
                                    Doanh thu cửa hàng
                                </Typography>
                            </Grid>
                            <Box display={'flex'} justifyContent={'space-between'}>
                                <Box width={'100%'}>
                                    <Typography
                                        sx={{
                                            color: '#3D475C',
                                            fontFamily: 'Roboto',
                                            fontSize: '24px',
                                            fontWeight: '700'
                                        }}>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(sumTongTien)}
                                    </Typography>
                                </Box>

                                <Box
                                    display={'flex'}
                                    justifyContent={'space-between'}
                                    width={'50%'}>
                                    <Box
                                        display={'flex'}
                                        justifyContent={'space-between'}
                                        alignItems={'center'}>
                                        <Box
                                            sx={{
                                                borderRadius: '50%',
                                                width: '12px',
                                                height: '12px',
                                                bgcolor: 'var(--color-main)'
                                            }}></Box>
                                        <Typography
                                            sx={{
                                                marginLeft: '8px',
                                                color: '#29303D',
                                                fontFamily: 'Roboto',
                                                fontSize: '12px',
                                                fontWeight: '400'
                                            }}>
                                            Tháng này
                                        </Typography>
                                    </Box>

                                    <Box
                                        display={'flex'}
                                        justifyContent={'space-between'}
                                        alignItems={'center'}>
                                        <Box
                                            sx={{
                                                borderRadius: '50%',
                                                width: '12px',
                                                height: '12px',
                                                bgcolor: '#ff9900'
                                            }}></Box>
                                        <Typography
                                            sx={{
                                                marginLeft: '8px',
                                                color: '#29303D',
                                                fontFamily: 'Roboto',
                                                fontSize: '12px',
                                                fontWeight: '400'
                                            }}>
                                            Tháng trước
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Grid item>
                                <ColumnChartNew />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Box width={'100%'}>
                                <Typography
                                    sx={{
                                        color: '#29303D',
                                        fontFamily: 'Roboto',
                                        fontSize: '18px',
                                        fontWeight: '700'
                                    }}>
                                    Top 5 dịch vụ hot
                                </Typography>
                                <HotServicesNew />
                            </Box>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default observer(Dashboard);
