import React from 'react';
import { Box, Dialog, TextField, Button, Grid, Typography } from '@mui/material';

const ThemLich: React.FC = () => {
    return (
        <Box>
            <Box>
                <Typography variant="h3" fontSize="24px" color="#333233" fontWeight="700">
                    Đặt ca làm việc thường xuyên
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={8}></Grid>
                </Grid>
            </Box>
        </Box>
    );
};
export default ThemLich;
