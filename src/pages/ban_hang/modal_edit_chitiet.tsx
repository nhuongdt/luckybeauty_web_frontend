import * as React from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, TextField, Grid } from '@mui/material';

export default function ModalEditChiTietGioHang() {
    return (
        <>
            <Dialog open>
                <DialogTitle>Chỉnh sửa giỏ hàng</DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={7} sm={7} md={7} lg={7}>
                            Combo cắt nhuộm
                        </Grid>
                        <Grid item xs={5} sm={5} md={5} lg={5}>
                            <TextField>5,000,000</TextField>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}></Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
