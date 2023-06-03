import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import './thoiGianNghi.css';
import MuiPagination from '@mui/material/Pagination';
import { TablePaginationProps } from '@mui/material/TablePagination';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '../../../images/add.svg';
import SearchIcon from '../../../images/search-normal.svg';
import fileSmallIcon from '../../../images/fi_upload-cloud.svg';
import DownloadIcon from '../../../images/download.svg';
import UploadIcon from '../../../images/upload.svg';
import { ReactComponent as DateIcon } from '../../../images/calendar-5.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
const EmployeeHoliday: React.FC = () => {
    const breadcrumbs = [
        <Typography key="1" color="#999699" fontSize="14px">
            Dịch vụ
        </Typography>,
        <Typography key="2" color="#333233" fontSize="14px">
            Danh mục dịch vụ
        </Typography>
    ];
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRowId, setSelectedRowId] = useState(null);

    const handleOpenMenu = (event: any, rowId: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedRowId(rowId);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedRowId(null);
    };

    const handleView = () => {
        // Handle View action
        handleCloseMenu();
    };

    const handleEdit = () => {
        // Handle Edit action
        handleCloseMenu();
    };

    const handleDelete = () => {
        // Handle Delete action
        handleCloseMenu();
    };
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Tên ngày lễ',
            // width: 200
            flex: 1
        },
        {
            field: 'startDate',
            headerName: 'Ngày bắt đầu',
            // width: 200,
            flex: 1,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <DateIcon style={{ marginRight: 4 }} />
                    <Typography
                        fontSize="14px"
                        fontWeight="400"
                        variant="h6"
                        color="#333233"
                        lineHeight="16px">
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'endDate',
            headerName: 'Ngày kết thúc',
            // width: 200,
            flex: 1,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <DateIcon style={{ marginRight: 4 }} />
                    <Typography
                        fontSize="14px"
                        fontWeight="400"
                        variant="h6"
                        color="#333233"
                        lineHeight="16px">
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'dateTotal',
            headerName: 'Tổng số ngày',
            // width: 150
            flex: 1
        },
        {
            field: 'actions',
            headerName: '',
            // width: 48,
            flex: 0.2,
            disableColumnMenu: true,

            renderCell: (params) => (
                <IconButton
                    aria-label="Actions"
                    aria-controls={`actions-menu-${params.row.id}`}
                    aria-haspopup="true"
                    onClick={(event) => handleOpenMenu(event, params.row.id)}>
                    <MoreHorizIcon />
                </IconButton>
            )
        }
    ];

    const rows = [
        {
            id: 1,
            name: 'Tết dương lịch',
            startDate: '01/01/2023',
            endDate: '02/01/2023',
            dateTotal: '1 ngày'
        },
        {
            id: 2,
            name: 'Giỗ tổ Hùng Vương',
            startDate: '30/04/2023',
            endDate: '02/05/2023',
            dateTotal: '3 ngày'
        },
        {
            id: 3,
            name: 'Quốc tế lao động',
            startDate: '01/01/2023',
            endDate: '02/01/2023',
            dateTotal: '5 ngày'
        },
        {
            id: 4,
            name: 'Tết dương lịch',
            startDate: '01/05/2023',
            endDate: '02/01/2023',
            dateTotal: '8 ngày'
        },
        {
            id: 5,
            name: 'Tết âm lịch',
            startDate: '01/01/2023',
            endDate: '02/01/2023',
            dateTotal: '2 ngày'
        }
    ];
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Box padding="22px 32px" className="thoi-gian-nghi-page">
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
                                backgroundColor: '#fff',
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
                                backgroundColor: '#fff',
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
                            onClick={handleOpen}
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
                            Thêm ngày nghỉ
                        </Button>
                    </Grid>
                </Grid>
                <Box marginTop="24px">
                    <DataGrid
                        autoHeight
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 }
                            }
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                    />
                    <Menu
                        id={`actions-menu-${selectedRowId}`}
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        sx={{ minWidth: '120px' }}>
                        <MenuItem onClick={handleView}>
                            <Typography
                                color="#009EF7"
                                fontSize="12px"
                                variant="button"
                                textTransform="unset"
                                width="64px"
                                fontWeight="400"
                                marginRight="8px">
                                View
                            </Typography>
                            <InfoIcon sx={{ color: '#009EF7' }} />
                        </MenuItem>
                        <MenuItem onClick={handleEdit}>
                            <Typography
                                color="#009EF7"
                                fontSize="12px"
                                variant="button"
                                textTransform="unset"
                                width="64px"
                                fontWeight="400"
                                marginRight="8px">
                                Edit
                            </Typography>
                            <EditIcon sx={{ color: '#009EF7' }} />
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>
                            <Typography
                                color="#F1416C"
                                fontSize="12px"
                                variant="button"
                                textTransform="unset"
                                width="64px"
                                fontWeight="400"
                                marginRight="8px">
                                Delete
                            </Typography>
                            <DeleteForeverIcon sx={{ color: '#F1416C' }} />
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
            <Dialog
                className="poppup-them-ngay-nghi"
                open={open}
                onClose={handleClose}
                sx={{
                    borderRadius: '12px',
                    maxWidth: 'unset!important',
                    margin: 'unset!important'
                }}>
                <Box padding="28px 24px" position="relative" width="100vw" maxWidth="648px">
                    <Typography
                        variant="h3"
                        fontSize="24px"
                        lineHeight="32px"
                        color="#4C4B4C"
                        fontWeight="700">
                        Ngày nghỉ mới
                    </Typography>
                    <Button
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: '30px',
                            right: '30px',
                            minWidth: 'unset!important'
                        }}>
                        <CloseIcon />
                    </Button>
                    <Box component="form">
                        <Grid container spacing={2} mt={3}>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h5"
                                    fontSize="14px"
                                    fontWeight="500"
                                    color="#4C4B4C">
                                    Tên ngày nghỉ
                                </Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    type="text"
                                    sx={{ borderColor: '#E6E1E6!important', mt: '8px' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontSize="14px"
                                        fontWeight="500"
                                        color="#4C4B4C">
                                        Ngày bắt đầu
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        InputProps={{
                                            endAdornment: null,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarMonthIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{
                                            '& input::-webkit-calendar-picker-indicator': {
                                                display: 'none'
                                            },
                                            borderColor: '#E6E1E6!important',
                                            mt: '8px'
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontSize="14px"
                                        fontWeight="500"
                                        color="#4C4B4C">
                                        Ngày kết thúc
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        InputProps={{
                                            endAdornment: null,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarMonthIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{
                                            '& input::-webkit-calendar-picker-indicator': {
                                                display: 'none'
                                            },
                                            borderColor: '#E6E1E6!important',
                                            mt: '8px'
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box display="flex" mt={3} justifyContent="end" gap="8px">
                            <Button
                                variant="contained"
                                sx={{
                                    textTransform: 'unset!important',
                                    backgroundColor: '#7C3367!important',
                                    fontWeight: '400'
                                }}>
                                Lưu
                            </Button>
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                sx={{
                                    textTransform: 'unset!important',

                                    borderColor: '#965C85!important',
                                    color: '#965C85!important',
                                    fontWeight: '400'
                                }}>
                                Huỷ
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};
export default EmployeeHoliday;
