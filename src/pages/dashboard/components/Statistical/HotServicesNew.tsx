import React from 'react';
import './hotServicesNew.css';
import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import dashboardStore from '../../../../stores/dashboardStore';
const HotServicesNew: React.FC = () => {
    const datas = [
        {
            name: 'Dịch vụ 1',
            value: '65,000.000',
            color: '#FFC700',
            bgColor: '#FFF8DD'
        },
        {
            name: 'Dịch vụ 2',
            value: '65,000.000',
            color: '#7C3367',
            bgColor: '#F2EBF0'
        },
        {
            name: 'Dịch vụ 3',
            value: '65,000.000',
            color: '#009EF7',
            bgColor: '#F1FAFF'
        },
        {
            name: 'Dịch vụ 4',
            value: '65,000.000',
            color: '#F1416C',
            bgColor: '#FFF5F8'
        },
        {
            name: 'Dịch vụ 5',
            value: '65,000.000',
            color: '#50CD89',
            bgColor: '#E8FFF3'
        }
    ];
    const ServicesElement = datas.map((data) => (
        <div className="service-item" key={data.name.replace(/\s/g, '')}>
            <div className="service-row-1">
                <div className="service-name">{data.name}</div>
                <div className="service-value" style={{ color: data.color }}>
                    {data.value}
                </div>
            </div>
            <div className="service-progress" style={{ background: data.bgColor }}>
                <div className="service-progressBar" style={{ background: data.color }}></div>
            </div>
        </div>
    ));
    return (
        <Box>
            <Grid container spacing={5}>
                {dashboardStore.danhSachDichVuHot?.map((item, key) => (
                    <Grid item xs={12} key={key}>
                        <Box display={'flex'} justifyContent={'space-between'} width="100%">
                            <Typography
                                sx={{
                                    color: '#3D475C',
                                    fontFamily: 'Roboto',
                                    fontSize: '14px',
                                    fontWeight: '400'
                                }}>
                                {item.tenDichVu}
                            </Typography>
                            <Typography
                                sx={{
                                    color: item.color ?? '#F90',
                                    fontFamily: 'Roboto',
                                    fontSize: '14px',
                                    fontWeight: '400'
                                }}>
                                {item.tongDoanhThu}
                            </Typography>
                        </Box>
                        <LinearProgress
                            sx={{
                                height: '10px',
                                color: item.color ?? 'maroon',
                                borderRadius: '25px'
                            }}
                            value={item.phanTram}
                            variant="determinate"
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
export default HotServicesNew;
