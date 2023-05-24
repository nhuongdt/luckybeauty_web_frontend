import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
    Grid,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    Menu,
    Stack,
    Button,
    Container,
    Link,
    Avatar,
    IconButton,
    TextareaAutosize,
    ButtonGroup,
    Breadcrumbs,
    Dialog
} from '@mui/material';
import AddIcon from '../../../images/add.svg';
import SearchIcon from '../../../images/search-normal.svg';
import fileSmallIcon from '../../../images/fi_upload-cloud.svg';
import DownloadIcon from '../../../images/download.svg';
import UploadIcon from '../../../images/upload.svg';
const EmployeeHoliday: React.FC = () => {
    const breadcrumbs = [
        <Typography key="1" color="#999699" fontSize="14px">
            Dịch vụ
        </Typography>,
        <Typography key="2" color="#333233" fontSize="14px">
            Danh mục dịch vụ
        </Typography>
    ];
    return (
        <>
            <Box padding="22px 32px">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto">
                        <Breadcrumbs separator="›" aria-label="breadcrumb">
                            {breadcrumbs}
                        </Breadcrumbs>
                        <Typography
                            color="#0C050A"
                            variant="h1"
                            fontSize="24px"
                            fontWeight="700"
                            lineHeight="32px"
                            marginTop="4px">
                            Quản lý thời gian nghỉ
                        </Typography>
                    </Grid>
                    <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                        <Box component="form" className="form-search">
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
                                        <IconButton type="submit">
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>

                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<img src={DownloadIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                height: '40px',
                                borderColor: '#E6E1E6!important'
                            }}>
                            Nhập
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<img src={UploadIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                padding: '10px 16px',
                                borderColor: '#E6E1E6!important',
                                height: '40px'
                            }}>
                            Xuất
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<img src={AddIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                minWidth: '173px',
                                height: '40px',
                                backgroundColor: '#7C3367!important'
                            }}>
                            Thêm khách hàng
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
export default EmployeeHoliday;
