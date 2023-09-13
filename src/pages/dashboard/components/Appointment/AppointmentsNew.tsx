import React from 'react';
import clockIcon from '../../../../images/clock.svg';
import './appointmentsNew.css';
import dashboardStore from '../../../../stores/dashboardStore';
import { observer } from 'mobx-react';
import { format } from 'date-fns';
import { Avatar, Box, Typography } from '@mui/material';
const AppoimentsNew: React.FC = () => {
    const datas = dashboardStore.danhSachLichHen ?? [];

    return (
        <Box>
            {datas.length > 0 ? (
                datas.map((data, key) => {
                    return (
                        <Box
                            key={key}
                            display={'flex'}
                            justifyContent={'space-between'}
                            borderBottom={'1px solid #EEF0F4'}>
                            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                <Avatar src={data.avatar} />
                                <Box
                                    sx={{ marginLeft: '24px' }}
                                    display={'flex'}
                                    justifyContent={'space-between'}
                                    flexDirection={'column'}>
                                    <Typography
                                        sx={{
                                            // color: '#525F7A',
                                            fontFamily: 'Roboto',
                                            fontSize: '14px',
                                            fontWeight: '400'
                                        }}>
                                        {data.tenKhachHang}
                                    </Typography>
                                    <Box
                                        display={'flex'}
                                        justifyContent={'start'}
                                        alignItems={'center'}>
                                        <img src={clockIcon} alt="clock" />
                                        <Typography
                                            sx={{
                                                //color: '#525F7A',
                                                fontFamily: 'Roboto',
                                                fontSize: '14px',
                                                fontWeight: '400',
                                                marginLeft: '4px'
                                            }}>
                                            {data.startTime != undefined
                                                ? format(new Date(data.startTime), 'HH:mm')
                                                : ''}
                                            {' - '}
                                            {data.endTime != undefined
                                                ? format(new Date(data.endTime), 'HH:mm')
                                                : ''}
                                        </Typography>
                                    </Box>

                                    <Typography
                                        sx={{
                                            //color: '#3D475C',
                                            fontFamily: 'Roboto',
                                            fontSize: '16px',
                                            fontWeight: '700'
                                        }}>
                                        {data.dichVu}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                display={'flex'}
                                justifyContent={'end'}
                                flexDirection={'column'}
                                alignItems={'end'}>
                                <Typography
                                    sx={{
                                        color: '#009EF7',
                                        fontFamily: 'Roboto',
                                        fontSize: '12px',
                                        fontWeight: '400'
                                    }}>
                                    {data.trangThai}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#3D475C',
                                        fontFamily: 'Roboto',
                                        fontSize: '16px',
                                        fontWeight: '700'
                                    }}>
                                    {new Intl.NumberFormat('vi-VN').format(data.tongTien ?? 0)}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })
            ) : (
                <>Không có dữ liệu</>
            )}
            {}
        </Box>
    );
};

export default observer(AppoimentsNew);
