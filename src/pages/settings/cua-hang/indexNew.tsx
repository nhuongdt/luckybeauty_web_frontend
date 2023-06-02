import React from 'react';
import { Box, Typography, Grid, TextField, Button } from '@mui/material';

import AddLogoIcon from '../../../images/add-logo.svg';
const StoreDetailNew: React.FC = () => {
    return (
        <Box bgcolor="#fff" padding="24px" borderRadius="8px">
            <Typography variant="h2" fontSize="24px" fontWeight="700" color="#0C050A" mb="32px">
                Chi tiết cửa hàng
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Box padding="20px" border="1px solid #E6E1E6" borderRadius="8px">
                        <Typography
                            variant="body1"
                            fontSize="14px"
                            color="#3A3C40"
                            fontWeight="500">
                            Logo cửa hàng
                        </Typography>
                        <Box position="relative" sx={{ textAlign: 'center', mt: '20px' }}>
                            <img
                                style={{
                                    width: '6.944444444444445vw',
                                    height: '6.944444444444445vw'
                                }}
                                src={AddLogoIcon}
                            />
                            <input
                                type="file"
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    opacity: '0',
                                    cursor: 'pointer'
                                }}
                            />
                        </Box>
                        <Typography
                            variant="h6"
                            fontWeight="400"
                            fontSize="12px"
                            color="#999699"
                            textAlign="center"
                            mt="24px"
                            maxWidth="152px"
                            marginX="auto">
                            Kích thước tối thiểu 3.1 mb
                        </Typography>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={8}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        '& label': {
                            fontWeight: '500',
                            color: '#4C4B4C',
                            fontSize: '14px',
                            mb: '8px'
                        },
                        '& input': {
                            fontSize: '14px'
                        }
                    }}>
                    <Typography variant="h3" fontWeight="700" fontSize="16px" color="#4C4B4C">
                        Thông tin cửa hàng
                    </Typography>
                    <Grid container spacing={1} mt="5px" rowSpacing={2}>
                        <Grid item xs={12} md={6}>
                            <label htmlFor="name">Tên cửa hàng</label>
                            <TextField
                                size="small"
                                fullWidth
                                id="name"
                                type="text"
                                placeholder="nhập tên"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <label htmlFor="location">Địa chỉ</label>
                            <TextField
                                size="small"
                                fullWidth
                                id="location"
                                type="text"
                                placeholder="nhập địa chỉ"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <label htmlFor="phone">Số điện thoại</label>
                            <TextField
                                size="small"
                                fullWidth
                                id="phone"
                                type="text"
                                placeholder="nhập số điện thoại"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <label htmlFor="code">Mã số thuế</label>
                            <TextField
                                size="small"
                                fullWidth
                                id="code"
                                type="text"
                                placeholder="nhập mã số thuế"
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sx={{ borderTop: '1px solid #E3E6EB', paddingTop: '24px', mt: '24px' }}>
                            <Typography
                                variant="h3"
                                fontWeight="700"
                                fontSize="16px"
                                color="#4C4B4C">
                                Liên kết trực tuyến
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <label htmlFor="code">Mã số thuế</label>
                            <TextField
                                size="small"
                                fullWidth
                                id="code"
                                type="text"
                                placeholder="nhập mã số thuế"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <label htmlFor="code">Mã số thuế</label>
                            <TextField
                                size="small"
                                fullWidth
                                id="code"
                                type="text"
                                placeholder="nhập mã số thuế"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <label htmlFor="code">Mã số thuế</label>
                            <TextField
                                size="small"
                                fullWidth
                                id="code"
                                type="text"
                                placeholder="nhập mã số thuế"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <label htmlFor="code">Mã số thuế</label>
                            <TextField
                                size="small"
                                fullWidth
                                id="code"
                                type="text"
                                placeholder="nhập mã số thuế"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        sx={{
                            width: 'fit-content',
                            minWidth: 'unset',
                            textTransform: 'unset',
                            fontSize: '14px',
                            fontWeight: '400',
                            ml: 'auto',
                            backgroundColor: '#7C3367!important',
                            mt: '16px'
                        }}>
                        Cập nhật
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
export default StoreDetailNew;
