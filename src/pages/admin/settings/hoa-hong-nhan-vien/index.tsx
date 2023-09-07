import { Component, ReactNode } from 'react';
import ChietKhauDichVuScreen from '../hoa-hong-nhan-vien/chiet-khau-dich-vu/index';
import { Box, Button, ButtonGroup, Grid, Typography } from '@mui/material';
import ChietKhauHoaDonScreen from '../hoa-hong-nhan-vien/chiet-khau-hoa-don/index';

class CaiDatHoaHongScreen extends Component {
    state = {
        isChietKhauDichVu: true
    };
    render(): ReactNode {
        return (
            <Box bgcolor="#fff" paddingTop={'16px'}>
                <Box component={'div'}>
                    <Grid container rowSpacing={2}>
                        <Grid item xs={6}>
                            <Typography fontWeight="700" fontFamily={'Roboto'} fontSize="18px">
                                {!this.state.isChietKhauDichVu
                                    ? 'Hoa hồng theo hóa đơn'
                                    : 'Hoa hồng theo dịch vụ'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <ButtonGroup
                                sx={{
                                    height: '40px',
                                    bottom: '24px',
                                    right: '50px',
                                    float: 'right',
                                    '& button': {
                                        padding: '8px 10px!important',
                                        lineHeight: '24px'
                                    }
                                }}>
                                <Button
                                    variant={
                                        this.state.isChietKhauDichVu ? 'outlined' : 'contained'
                                    }
                                    sx={{
                                        fontSize: '16px',
                                        textTransform: 'unset',
                                        borderRadius: '8px 0px 0px 8px',
                                        color: this.state.isChietKhauDichVu ? '#FFF' : '#666466',
                                        backgroundColor: this.state.isChietKhauDichVu
                                            ? 'var(--color-main)!important'
                                            : '#FFFFFF!important',
                                        borderColor: 'transparent!important',
                                        boxShadow: 'none!important',
                                        '&:hover': {
                                            color: this.state.isChietKhauDichVu
                                                ? '#fff'
                                                : 'var(--color-main)'
                                        }
                                    }}
                                    onClick={() => {
                                        this.setState({ isChietKhauDichVu: true });
                                    }}>
                                    Theo dịch vụ
                                </Button>
                                <Button
                                    variant={
                                        this.state.isChietKhauDichVu ? 'contained' : 'outlined'
                                    }
                                    sx={{
                                        fontSize: '16px',
                                        textTransform: 'unset',
                                        borderRadius: '0px 8px 8px 0px',
                                        color: this.state.isChietKhauDichVu ? '#666466' : '#fff',
                                        backgroundColor: this.state.isChietKhauDichVu
                                            ? '#FFFFFF!important'
                                            : 'var(--color-main)!important',
                                        border: 'none!important',
                                        boxShadow: 'none!important',
                                        '&:hover': {
                                            color: this.state.isChietKhauDichVu
                                                ? 'var(--color-main)'
                                                : '#fff'
                                        }
                                    }}
                                    onClick={() => {
                                        this.setState({ isChietKhauDichVu: false });
                                    }}>
                                    Theo hóa đơn
                                </Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item xs={12}>
                            {this.state.isChietKhauDichVu ? (
                                <ChietKhauDichVuScreen />
                            ) : (
                                <ChietKhauHoaDonScreen />
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        );
    }
}
export default CaiDatHoaHongScreen;
