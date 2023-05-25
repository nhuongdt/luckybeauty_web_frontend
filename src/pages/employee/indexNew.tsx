import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MessageAlert from '../../components/AlertDialog/MessageAlert';
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
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';

import './employee.css';
import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import fileSmallIcon from '../../images/fi_upload-cloud.svg';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import AddIcon from '../../images/add.svg';
import SearchIcon from '../../images/search-normal.svg';
import closeIcon from '../../images/close-square.svg';
import avatar from '../../images/avatar.png';
import fileIcon from '../../images/file.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Employee: React.FC = () => {
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
            field: 'id',
            headerName: 'ID',
            width: 74
        },
        {
            field: 'name',
            headerName: 'Tên nhân viên',
            width: 171,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        src={params.row.avatar}
                        alt="Avatar"
                        style={{ width: 24, height: 24, marginRight: 8 }}
                    />
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
            field: 'phone',
            headerName: 'Số điện thoại',
            width: 114
        },
        {
            field: 'age',
            headerName: 'Ngày sinh',
            width: 112,
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
            field: 'gender',
            headerName: 'Giới tính',
            width: 89
        },
        {
            field: 'location',
            headerName: 'Địa chỉ',
            width: 171
        },
        {
            field: 'position',
            headerName: 'Vị trí',
            width: 113
        },
        {
            field: 'participationDate',
            headerName: 'Ngày tham gia',
            width: 128,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <DateIcon style={{ marginRight: 4 }} />
                    <Typography
                        fontSize="14px"
                        variant="h6"
                        fontWeight="400"
                        color="#333233"
                        lineHeight="16px">
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'state',
            headerName: 'Trạng thái',
            width: 116,
            renderCell: (params) => (
                <Typography
                    fontSize="14px"
                    variant="h6"
                    lineHeight="16px"
                    padding="4px 8px"
                    borderRadius="12px"
                    fontWeight="400"
                    color="#009EF7"
                    sx={{ backgroundColor: '#F1FAFF' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: '',
            width: 48,
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
            id: 21,
            name: 'Tài Đinh',
            phone: '0911290476',
            age: '21/01/2004',
            gender: 'Nam',
            location: 'Thanh Xuân ,Hà Nội',
            position: 'Kỹ thuật',
            participationDate: '10/5/2023',
            state: 'Đang làm việc',
            avatar: avatar
        },
        {
            id: 1,
            name: 'Tài Đinhh',
            phone: '0911290476',
            age: '21/01/2004',
            gender: 'Nam',
            location: 'Thanh Xuân ,Hà Nội',
            position: 'Kỹ thuật',
            participationDate: '10/5/2023',
            state: 'Đang làm việc'
        },
        {
            id: 7,
            name: 'Tài Đinhhhh',
            phone: '0911290476',
            age: '21/01/2004',
            gender: 'Nam',
            location: 'Thanh Xuân ,Hà Nội',
            position: 'Kỹ thuật',
            participationDate: '10/5/2023',
            state: 'Đang làm việc'
        },
        {
            id: 70,
            name: 'Tài Đinhhhh',
            phone: '0911290476',
            age: '21/01/2004',
            gender: 'Nam',
            location: 'Thanh Xuân ,Hà Nội',
            position: 'Kỹ thuật',
            participationDate: '10/5/2023',
            state: 'Đang làm việc'
        },
        {
            id: 79,
            name: 'Tài Đinhhhh',
            phone: '0911290476',
            age: '21/01/2004',
            gender: 'Nam',
            location: 'Thanh Xuân ,Hà Nội',
            position: 'Kỹ thuật',
            participationDate: '10/5/2023',
            state: 'Đang làm việc'
        },
        {
            id: 77,
            name: 'Tài Đinhhhh',
            phone: '0911290476',
            age: '21/01/2004',
            gender: 'Nam',
            location: 'Thanh Xuân ,Hà Nội',
            position: 'Kỹ thuật',
            participationDate: '10/5/2023',
            state: 'Đang làm việc'
        }
    ];
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                className="poppup-them-nhan-vien"
                sx={{
                    borderRadius: '12px',

                    width: '100%',
                    padding: '28px 24px'
                }}>
                <Typography
                    variant="h3"
                    fontSize="24px"
                    color="#333233"
                    fontWeight="700"
                    paddingLeft="24px"
                    marginTop="28px">
                    Thêm nhân viên
                </Typography>

                <Typography
                    color="#999699"
                    fontSize="16px"
                    fontWeight="700"
                    variant="h3"
                    paddingLeft="24px"
                    marginTop="28px">
                    Thông tin chi tiết
                </Typography>
                <Box
                    component="form"
                    display="flex"
                    justifyContent="space-between"
                    paddingRight="24px">
                    <Grid
                        container
                        className="form-container"
                        spacing={3}
                        width="70%"
                        paddingRight="12px"
                        paddingBottom="5vw"
                        marginTop="0"
                        marginLeft="0">
                        <Grid item xs={12}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Họ và tên
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="Họ và tên"
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Số điện thoại
                            </Typography>
                            <TextField
                                type="tel"
                                size="small"
                                placeholder="Số điện thoại"
                                fullWidth
                                sx={{ fontSize: '16px' }}></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Địa chỉ
                            </Typography>
                            <TextField
                                type="text"
                                size="small"
                                placeholder="Nhập địa chỉ của nhân viên"
                                fullWidth
                                sx={{ fontSize: '16px' }}></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Ngày sinh
                            </Typography>
                            <TextField
                                type="date"
                                fullWidth
                                placeholder="21/04/2004"
                                sx={{ fontSize: '16px' }}
                                size="small"></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Giới tính
                            </Typography>
                            <Select
                                id="gender"
                                fullWidth
                                defaultValue={0}
                                sx={{
                                    height: '42px',
                                    backgroundColor: '#fff',
                                    padding: '0',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    borderColor: '#E6E1E6'
                                }}>
                                <MenuItem value={0}>Lựa chọn</MenuItem>
                                <MenuItem value={1}>Nữ</MenuItem>
                                <MenuItem value={2}>Nam</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Ghi chú
                            </Typography>
                            <TextareaAutosize
                                placeholder="Điền"
                                maxRows={4}
                                minRows={4}
                                style={{
                                    width: '100%',
                                    borderColor: '#E6E1E6',
                                    borderRadius: '8px',
                                    padding: '16px'
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container width="30%" paddingLeft="12px">
                        <Grid item xs={12}>
                            <Box
                                height="250px"
                                position="relative"
                                paddingTop="5.0403vh"
                                style={{ textAlign: 'center', borderColor: '#FFFAFF' }}>
                                <img src={fileIcon} />
                                <TextField
                                    type="file"
                                    id="input-file"
                                    sx={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        width: '100%',
                                        border: 'none!important',
                                        height: '100%'
                                    }}
                                    InputProps={{
                                        style: {
                                            position: 'absolute',
                                            height: '100%',
                                            width: '100%',
                                            top: '0',
                                            left: '0'
                                        }
                                    }}
                                />
                                <Box
                                    style={{
                                        display: 'flex',
                                        marginTop: '34px',
                                        justifyContent: 'center'
                                    }}>
                                    <img src={fileSmallIcon} />
                                    <Typography>Tải ảnh lên</Typography>
                                </Box>
                                <Box style={{ color: '#999699', marginTop: '13px' }}>
                                    File định dạng{' '}
                                    <Typography style={{ color: '#333233' }}>jpeg, png</Typography>{' '}
                                </Box>
                            </Box>
                        </Grid>

                        <ButtonGroup
                            sx={{
                                height: '32px',
                                position: 'absolute',
                                bottom: '24px',
                                right: '50px'
                            }}>
                            <Button
                                variant="contained"
                                sx={{
                                    fontSize: '14px',
                                    textTransform: 'unset',
                                    color: '#fff',
                                    backgroundColor: '#B085A4',
                                    border: 'none'
                                }}>
                                Lưu
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    fontSize: '14px',
                                    textTransform: 'unset',
                                    color: '#965C85',
                                    borderColor: '#965C85'
                                }}>
                                Hủy
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Box>
                <Button
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: '32px',
                        right: '28px',
                        padding: '0',
                        maxWidth: '24px',
                        minWidth: '0'
                    }}>
                    <img src={closeIcon} />
                </Button>
            </Dialog>
            <Box
                className="list-nhan-vien"
                paddingLeft="2.2222222222222223vw"
                paddingRight="2.2222222222222223vw"
                paddingTop="1.5277777777777777vw">
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
                            Danh sách nhân viên
                        </Typography>
                    </Grid>

                    <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                        <Box component="form" className="form-search">
                            <TextField
                                sx={{
                                    backgroundColor: '#FFFAFF',
                                    borderColor: '#CDC9CD'
                                }}
                                size="small"
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
                                borderColor: '#E6E1E6!important',
                                backgroundColor: '#fff!important',
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                padding: '10px 16px',

                                height: '40px',
                                borderRadius: '4px!important'
                            }}>
                            Nhập
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<img src={UploadIcon} />}
                            sx={{
                                borderColor: '#E6E1E6!important',
                                backgroundColor: '#fff!important',
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                padding: '10px 16px',
                                height: '40px',
                                borderRadius: '4px!important'
                            }}>
                            Xuất
                        </Button>
                        <ButtonGroup
                            variant="contained"
                            sx={{ gap: '8px', height: '40px', boxShadow: 'unset!important' }}>
                            <Button
                                size="small"
                                onClick={handleOpen}
                                variant="contained"
                                startIcon={<img src={AddIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    minWidth: '173px',
                                    fontSize: '14px',
                                    borderRadius: '4px!important',
                                    backgroundColor: '#7C3367!important'
                                }}>
                                Thêm nhân viên
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>

                <Box sx={{ height: '576px' }} marginTop="24px">
                    <DataGrid
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
        </>
    );
};
export default Employee;
