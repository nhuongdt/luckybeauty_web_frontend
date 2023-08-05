import React from 'react';
import OverViewNew from './components/OverView/overViewNew';
import './dashboardNew.css';
import AppoimentsNew from './components/Appointment/AppointmentsNew';
import LineChartNew from './components/Charts/LineChartNew';
import ColumnChartNew from './components/Charts/ColumnChartNew';
import HotServicesNew from './components/Statistical/HotServicesNew';
import Box from '@mui/material/Box';
import OverView from './components/OverView/ovver-view';
import { Grid } from '@mui/material';

const Dashboard: React.FC = () => {
    const [month, setMonth] = React.useState('Tháng này');
    const handleChange = (event: any) => {
        setMonth(event.target.value);
    };
    return (
        <div>
            <Box
                display="flex"
                alignItems="center"
                sx={{ padding: '0 2.2222222222222223vw', paddingTop: '1.6666666666666667vw' }}>
                <div className="page-header_col-1">
                    <div className="breadcrumb">Trang chủ</div>
                </div>
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
                        <div className="page-body_row-2_col-1">
                            <h3>Danh sách cuộc hẹn hôm nay</h3>
                            <p>Cuộc hẹn mới nhất</p>
                            <AppoimentsNew />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <div className="page-body_row-2_col-2">
                            <h3>Tổng số cuộc hẹn hàng tuần</h3>
                            <LineChartNew />
                        </div>
                    </Grid>
                </Grid>

                <div
                    style={{
                        marginTop: '14px'
                    }}>
                    <Grid container spacing={0.5}>
                        <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                            <div>
                                <div>
                                    <div>
                                        <h3>Doanh thu</h3>
                                        <p>Doanh thu cửa hàng</p>
                                    </div>
                                </div>
                                <div className="page-body_row-3_col-1_row-2">
                                    <div>
                                        <div className="danh-thu">36,2531.00</div>
                                        <div className="doanh-thu-rario">(+1.37%)</div>
                                    </div>
                                    <div>
                                        <div className="bar-tootilp">
                                            <div className="tootilp-item">
                                                <div className="tooltilp-dot"></div>
                                                <div className="tooltilp-text">Tuần này</div>
                                            </div>
                                            <div className="tootilp-item">
                                                <div className="tooltilp-dot"></div>
                                                <div className="tooltilp-text">Tuần trước</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <ColumnChartNew />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <div>
                                <h3>Top 5 dịch vụ hot</h3>
                                <HotServicesNew />
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
