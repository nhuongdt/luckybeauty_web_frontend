import { Component, ReactNode } from 'react';
import React from 'react';
import sinhnhat from '../../../../images/sn.svg';
import userIcon from '../../../../images/user1.svg';
import calendarIcon from '../../../../images/calendar-add.svg';
import walletIcon from '../../../../images/wallet.svg';
import incrementIcon from '../../../../images/tang.svg';
import decrementIcon from '../../../../images/giam.svg';
import { Box, Grid, Typography } from '@mui/material';
import './overViewNew.css';
class OverView extends Component {
    render(): ReactNode {
        const grids = [
            {
                icon: sinhnhat,
                title: 'Khách hàng sinh nhật',
                number: '5'
            },
            {
                icon: userIcon,
                title: 'Tổng số khách hàng ',
                number: '100',
                ratioText: '+11.01%',
                ratioIcon: incrementIcon
            },
            {
                icon: calendarIcon,
                title: 'Tổng cuộc hẹn',
                number: '150',
                ratioText: '-5.01%',
                ratioIcon: decrementIcon
            },
            {
                icon: walletIcon,
                title: 'Tổng doanh thu ',
                number: '10,000',
                ratioText: '+11.01%',
                ratioIcon: incrementIcon
            }
        ];
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Box
                            padding={'19px 14px 14px 15px'}
                            display={'flex'}
                            width={'100%'}
                            flexDirection={'row'}
                            sx={{ borderRadius: '8px' }}>
                            <Box
                                width={86}
                                height={86}
                                sx={{
                                    color: '#FFF',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <img src={sinhnhat} />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    marginLeft: '12px',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                <Typography
                                    sx={{
                                        color: '#7DC1FF',
                                        fontFamily: 'Roboto',
                                        fontSize: '32px',
                                        fontWeight: '700'
                                    }}>
                                    100
                                </Typography>
                                <Grid container alignItems={'center'}>
                                    <Grid
                                        item
                                        xs={12}
                                        sx={{
                                            color: '#3D475C',
                                            fontFamily: 'Roboto',
                                            fontSize: '24px',
                                            fontWeight: '700',
                                            textAlign: 'center'
                                        }}>
                                        <Typography
                                            sx={{
                                                color: '#525F7A',
                                                fontFamily: 'Roboto',
                                                fontSize: '14px',
                                                fontWeight: '400'
                                            }}>
                                            Khách hàng sinh nhật
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Box
                            padding={'32px 24px'}
                            display={'flex'}
                            flexDirection={'row'}
                            sx={{ borderRadius: '8px' }}>
                            <Box
                                width={56}
                                height={56}
                                borderRadius={'18px'}
                                sx={{
                                    background: '#009EF7',
                                    color: '#FFF',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <img src={userIcon} />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    marginLeft: '12px',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                <Typography
                                    sx={{
                                        color: '#525F7A',
                                        fontFamily: 'Roboto',
                                        fontSize: '14px',
                                        fontWeight: '400'
                                    }}>
                                    Tổng số khách hàng
                                </Typography>

                                <Grid container>
                                    <Grid
                                        item
                                        xs={12}
                                        display={'flex'}
                                        alignItems={'center'}
                                        sx={{
                                            color: '#50CD89',
                                            fontFamily: 'Roboto',
                                            fontSize: '12px',
                                            fontWeight: '400'
                                        }}>
                                        <Typography
                                            sx={{
                                                color: '#3D475C',
                                                fontFamily: 'Roboto',
                                                fontSize: '24px',
                                                fontWeight: '700'
                                            }}>
                                            100
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Box
                            padding={'32px 24px'}
                            display={'flex'}
                            flexDirection={'row'}
                            sx={{ borderRadius: '8px' }}>
                            <Box
                                width={56}
                                height={56}
                                borderRadius={'18px'}
                                sx={{
                                    background: '#F90',
                                    color: '#FFF',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <img src={calendarIcon} />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    marginLeft: '12px',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                <Typography
                                    sx={{
                                        color: '#525F7A',
                                        fontFamily: 'Roboto',
                                        fontSize: '14px',
                                        fontWeight: '400'
                                    }}>
                                    Tổng cuộc hẹn
                                </Typography>
                                <Grid container>
                                    <Grid
                                        item
                                        xs={12}
                                        display={'flex'}
                                        alignItems={'center'}
                                        sx={{
                                            color: '#50CD89',
                                            fontFamily: 'Roboto',
                                            fontSize: '12px',
                                            fontWeight: '400'
                                        }}>
                                        <Typography
                                            sx={{
                                                color: '#3D475C',
                                                fontFamily: 'Roboto',
                                                fontSize: '24px',
                                                fontWeight: '700'
                                            }}>
                                            100
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Box
                            padding={'32px 24px'}
                            display={'flex'}
                            flexDirection={'row'}
                            sx={{ borderRadius: '8px' }}>
                            <Box
                                width={56}
                                height={56}
                                borderRadius={'18px'}
                                sx={{
                                    background: '#50CD89',
                                    color: '#FFF',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <img src={grids[3].icon} />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    marginLeft: '12px',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                <Typography
                                    sx={{
                                        color: '#525F7A',
                                        fontFamily: 'Roboto',
                                        fontSize: '14px',
                                        fontWeight: '400'
                                    }}>
                                    Tổng doanh thu
                                </Typography>
                                <Grid container>
                                    <Grid
                                        item
                                        xs={12}
                                        sx={{
                                            color: '#50CD89',
                                            fontFamily: 'Roboto',
                                            fontSize: '12px',
                                            fontWeight: '400'
                                        }}>
                                        <Typography
                                            sx={{
                                                color: '#3D475C',
                                                fontFamily: 'Roboto',
                                                fontSize: '24px',
                                                fontWeight: '700'
                                            }}>
                                            100,000
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default OverView;
