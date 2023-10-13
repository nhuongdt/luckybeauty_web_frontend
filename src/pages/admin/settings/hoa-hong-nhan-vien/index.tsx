import { Component, ReactNode } from 'react';
import ChietKhauDichVuScreen from '../hoa-hong-nhan-vien/chiet-khau-dich-vu/index';
import { Box, Grid } from '@mui/material';
import ChietKhauHoaDonScreen from '../hoa-hong-nhan-vien/chiet-khau-hoa-don/index';
import chietKhauDichVuStore from '../../../../stores/chietKhauDichVuStore';
import { observer } from 'mobx-react';

class CaiDatHoaHongScreen extends Component {
    render(): ReactNode {
        return (
            <Box paddingTop={'16px'}>
                <Box component={'div'}>
                    <Grid container rowSpacing={2}>
                        <Grid item xs={12}>
                            {chietKhauDichVuStore.isChietKhauDichVu === true ? <ChietKhauDichVuScreen /> : <ChietKhauHoaDonScreen />}
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        );
    }
}
export default observer(CaiDatHoaHongScreen);
