import { Box, Typography, Grid, Button } from '@mui/material';
import React from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThemLich from './them_lich_lam_viec';
const LichLamViec: React.FC = () => {
    return (
        <Box>
            <ThemLich />
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
                            <Button variant="contained" sx={{ bgcolor: '#7C3367!important' }}>
                                Thêm ca
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default LichLamViec;
