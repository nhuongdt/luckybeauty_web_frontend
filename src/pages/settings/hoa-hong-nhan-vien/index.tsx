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
                <Box>
                    <Box component={'div'}>
                        <Grid container rowSpacing={2} sx={{ marginTop: '-72px' }}>
                            <Grid item xs={12}>
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
                                            this.state.isChietKhauHoaDon ? 'outlined' : 'contained'
                                        }
                                        sx={{
                                            fontSize: '16px',
                                            textTransform: 'unset',
                                            borderRadius: '8px 0px 0px 8px',
                                            color: this.state.isChietKhauHoaDon
                                                ? '#FFF'
                                                : '#666466',
                                            backgroundColor: this.state.isChietKhauHoaDon
                                                ? 'rgb(124, 51, 103)!important'
                                                : '#FFFFFF!important',
                                            border: 'none!important',
                                            boxShadow: 'none!important'
                                        }}
                                        onClick={() => {
                                            this.setState({ isChietKhauHoaDon: true });
                                        }}>
                                        Theo hóa đơn
                                    </Button>
                                    <Button
                                        variant={
                                            this.state.isChietKhauHoaDon ? 'contained' : 'outlined'
                                        }
                                        sx={{
                                            fontSize: '16px',
                                            textTransform: 'unset',
                                            borderRadius: '0px 8px 8px 0px',
                                            color: this.state.isChietKhauHoaDon
                                                ? '#666466'
                                                : '#fff',
                                            backgroundColor: this.state.isChietKhauHoaDon
                                                ? '#FFFFFF!important'
                                                : 'rgb(124, 51, 103)!important',
                                            border: 'none!important',
                                            boxShadow: 'none!important'
                                        }}
                                        onClick={() => {
                                            this.setState({ isChietKhauHoaDon: false });
                                        }}>
                                        Theo dịch vụ
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
                </Box>
            </>
        );
    }
}
export default CaiDatHoaHongScreen;
