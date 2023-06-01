import { Component, ReactNode } from 'react';
import ChietKhauDichVuScreen from '../hoa-hong-nhan-vien/chiet-khau-dich-vu/index';
import { Box, Button, ButtonGroup, Grid } from '@mui/material';
import { stubTrue } from 'lodash';
import ChietKhauHoaDonScreen from './chiet-khau-hoa-don/components';
class CaiDatHoaHongScreen extends Component {
    state = {
        isChietKhauHoaDon: true
    };
    render(): ReactNode {
        return (
            <>
                <div>
                    <Box component={'div'}>
                        <Grid container rowSpacing={2}>
                            <Grid item xs={12}>
                                <ButtonGroup
                                    sx={{
                                        height: '32px',
                                        bottom: '24px',
                                        right: '50px',
                                        float: 'right'
                                    }}>
                                    <Button
                                        variant={
                                            this.state.isChietKhauHoaDon ? 'outlined' : 'contained'
                                        }
                                        sx={{
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            borderRadius: '8px 0px 0px 8px',
                                            color: this.state.isChietKhauHoaDon
                                                ? '#FFF'
                                                : '#666466',
                                            backgroundColor: this.state.isChietKhauHoaDon
                                                ? '#B085A4'
                                                : '#FFFFFF',
                                            border: 'none'
                                        }}
                                        onClick={() => {
                                            this.setState({ isChietKhauHoaDon: true });
                                        }}>
                                        Theo dịch vụ
                                    </Button>
                                    <Button
                                        variant={
                                            this.state.isChietKhauHoaDon ? 'contained' : 'outlined'
                                        }
                                        sx={{
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            borderRadius: '0px 8px 8px 0px',
                                            color: this.state.isChietKhauHoaDon
                                                ? '#666466'
                                                : '#fff',
                                            backgroundColor: this.state.isChietKhauHoaDon
                                                ? '#FFFFFF'
                                                : '#B085A4',
                                            border: 'none'
                                        }}
                                        onClick={() => {
                                            this.setState({ isChietKhauHoaDon: false });
                                        }}>
                                        Theo hóa đơn
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item xs={12}>
                                {this.state.isChietKhauHoaDon ? (
                                    <ChietKhauDichVuScreen></ChietKhauDichVuScreen>
                                ) : (
                                    <ChietKhauHoaDonScreen></ChietKhauHoaDonScreen>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </>
        );
    }
}
export default CaiDatHoaHongScreen;
