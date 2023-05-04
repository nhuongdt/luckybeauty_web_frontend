import * as React from 'react';

import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import '../../App.css';

const shortNameCus = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minWidth: 'unset',
                    borderRadius: '35px',
                    width: '37px',
                    height: '35px',
                    borderColor: 'red',
                    borderWidth: '1px',
                    backgroundColor: 'yellow'
                }
            }
        }
    }
});

export default function CustomersChecking() {
    return (
        <>
            <Grid container padding={2}>
                <Grid item xs={6} sm={4} md={4} lg={4}>
                    <Stack direction="row" spacing={1}>
                        <MenuIcon className="btnIcon" />
                        <CalendarMonthIcon className="btnIcon" />
                    </Stack>
                </Grid>
                <Grid item xs={6} sm={8} md={8} lg={8} display="flex" justifyContent="flex-end">
                    <Stack direction="row" spacing={1}>
                        <MenuIcon className="btnIcon" />
                        <CalendarMonthIcon className="btnIcon" />
                        <Button
                            variant="contained"
                            className="btnIconText"
                            startIcon={<AddIcon />}
                            sx={{ bgcolor: '#7c3367' }}>
                            Thêm khách
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={4} sm={3} md={2} lg={2}>
                    <Grid border={1} borderColor="red" container className="infor-cus">
                        <Grid item xs={12} sm={12} md={9} lg={9}>
                            <Stack direction="column" sx={{ padding: '10px' }}>
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
                                <Stack direction="row" spacing={1} paddingTop={1}>
                                    <Typography className="cuspoint">Điểm tích lũy:</Typography>
                                    <Typography className="cusname">250</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} paddingTop={1}>
                                    <Typography className="cuspoint">04/05/2023</Typography>
                                    <Typography className="cusname">9h00</Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3}>
                            <Stack sx={{ paddingTop: '10px' }}>
                                <MoreHorizIcon />
                                <Typography className="cusstatus" sx={{ color: '#a1a103' }}>
                                    Đang chờ
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
