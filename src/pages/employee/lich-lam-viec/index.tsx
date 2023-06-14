import { Box, Typography, Grid, Button } from '@mui/material';
import React, { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThemLich from './them_lich_lam_viec';
import Delete from './deleteAlert';
import Calendar from './FullCalendar';
import Edit from './editNhanVien';
const LichLamViec: React.FC = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const [openCustom, setOpenCustom] = useState(false);
    return (
        <Box>
            <ThemLich open={openDialog} onClose={handleCloseDialog} />
            {/* <Edit open={openDialog} onClose={handleCloseDialog} />
            <Delete open={openDialog} onClose={handleCloseDialog} /> */}
            <Box sx={{ padding: '16px 2.2222222222222223vw' }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs="auto">
                        <Typography variant="h1" color="#0C050A" fontSize="18px" fontWeight="700">
                            Lịch làm việc
                        </Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <Box sx={{ display: 'flex', gap: '8px' }}>
                            <Button>
                                <MoreHorizIcon sx={{ color: '#231F20' }} />
                            </Button>
                            <Button
                                onClick={handleOpenDialog}
                                variant="contained"
                                sx={{ bgcolor: '#7C3367!important' }}>
                                Thêm ca
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ borderTop: '1px solid #E6E1E6', mt: '18px', pt: '16px' }}>
                    <Calendar />
                </Box>
            </Box>
        </Box>
    );
};

export default LichLamViec;
