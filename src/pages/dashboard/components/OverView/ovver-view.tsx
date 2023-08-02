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
                        <Box></Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Box padding={'32px 24px'} display={'flex'} flexDirection={'row'}>
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
                                <img src={grids[1].icon} />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    marginLeft: '12px',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                <Typography>Tổng số khách hàng</Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                    <Typography>100</Typography>
                                    <Typography>1000</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Box></Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Box></Box>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default OverView;
