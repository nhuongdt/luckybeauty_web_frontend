import React from 'react';
import { Box, Typography, Grid, TextField, IconButton } from '@mui/material';
import SearchIcon from '../../../images/search-normal.svg';
const GiaoDichThanhToan: React.FC = () => {
    return (
        <>
            <Grid container>
                <Grid item md="auto" display="flex" alignItems="center" gap="10px">
                    <Typography color="#333233" variant="h1" fontSize="16px" fontWeight="700">
                        Quản lý thời gian nghỉ
                    </Typography>
                    <Box className="form-search">
                        <TextField
                            size="small"
                            sx={{
                                backgroundColor: '#FFFAFF',
                                borderColor: '#CDC9CD!important'
                            }}
                            className="search-field"
                            variant="outlined"
                            type="search"
                            placeholder="Tìm kiếm"
                            InputProps={{
                                startAdornment: (
                                    <IconButton type="button">
                                        <img src={SearchIcon} />
                                    </IconButton>
                                )
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item md="auto"></Grid>
            </Grid>
        </>
    );
};
export default GiaoDichThanhToan;
