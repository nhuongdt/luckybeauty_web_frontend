import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import { ReactComponent as InIcon } from '../../../images/printer.svg';
import Avatar from '../../../images/xinh.png';
const HoaDon: React.FC = () => {
    const Infomation = [
        { title: 'Mã hóa đơn', value: 'HD4545675' },
        {
            value: '30/06/2023  08:30',
            title: 'Ngày lập'
        },
        {
            title: 'Chi nhánh',
            value: 'Chi nhánh 1'
        },
        {
            title: 'Người tạo',
            value: 'Đinh Tuấn Tài'
        },
        {
            title: 'Nguời bán',
            value: 'Tài Đinh Tuấn'
        }
    ];
    return (
        <>
            <Box padding="16px 2.2222222222222223vw ">
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item xs="auto">
                        <Typography variant="h1" fontSize="16px" fontWeight="700" color="#333233">
                            Hóa đơn
                        </Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <Box display="flex" gap="8px">
                            <Button
                                startIcon={<InIcon />}
                                variant="outlined"
                                sx={{
                                    bgcolor: '#fff!important',
                                    color: '#666466',
                                    borderColor: '#E6E1E6!important'
                                }}>
                                In
                            </Button>
                            <Button
                                startIcon={<UploadIcon />}
                                variant="outlined"
                                sx={{
                                    bgcolor: '#fff!important',
                                    color: '#666466',
                                    borderColor: '#E6E1E6!important'
                                }}>
                                Xuất
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ bgcolor: '#7C3367!important', color: '#fff' }}>
                                Sao chép
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={3}>
                        <Box>
                            <img src={Avatar} alt="avatar" />
                        </Box>
                    </Grid>
                    <Grid item xs={9}>
                        <Box display="flex" gap="23px">
                            <Typography
                                variant="h4"
                                color="#3B4758"
                                fontWeight="700"
                                fontSize="24px">
                                Đinh Tuấn Tài
                            </Typography>
                            <Box
                                sx={{
                                    padding: '2px 3px',
                                    borderRadius: '100px',
                                    color: '#0DA678',
                                    bgcolor: '#CAFBEC',
                                    width: 'fit-content',
                                    fontSize: '12px'
                                }}>
                                Hoàn thành
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
export default HoaDon;
