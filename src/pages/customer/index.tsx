import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import {
    Button,
    ButtonGroup,
    Breadcrumbs,
    Typography,
    Grid,
    Box,
    TextField,
    IconButton,
    Select,
    MenuItem,
    Menu,
    FormControl
} from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import fileIcon from '../../images/file.svg';
import closeIcon from '../../images/close-square.svg';
import avatar from '../../images/avatar.png';
import './customerPage.css';
import fileSmallIcon from '../../images/fi_upload-cloud.svg';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import AddIcon from '../../images/add.svg';
import SearchIcon from '../../images/search-normal.svg';
import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
const Customer: React.FC = () => {
    const breadcrumbs = [
        <Typography key="1" color="#999699" fontSize="14px">
            Khách hàng
        </Typography>,
        <Typography key="2" color="#333233" fontSize="14px">
            Quản lý khách hàng
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
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 50 },

        {
            field: 'name',
            headerName: 'Tên khách hàng',
            width: 185,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                    <img
                        src={params.row.avatar}
                        alt="Avatar"
                        style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    {params.value}
                </div>
            )
        },
        { field: 'phone', headerName: 'Số điện thoại', width: 114 },
        {
            field: 'group',
            headerName: 'Nhóm khách',

            width: 112
        },
        { field: 'gender', headerName: 'Giới tính', width: 89 },
        {
            field: 'staff',
            headerName: 'Nhân viên phục vụ',

            width: 185
        },
        {
            field: 'total',
            headerName: 'Tổng chi tiêu',

            width: 113
        },
        {
            field: 'recentAppointment',
            headerName: 'Cuộc hẹn gần đây',
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                    <DateIcon style={{ marginRight: 4 }} />
                    {params.value}
                </div>
            ),

            width: 128
        },
        {
            field: 'source',
            headerName: 'Nguồn',

            width: 86,
            renderCell: (params) => (
                <div className={params.field === 'source' ? 'last-column' : ''}>{params.value}</div>
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
            id: 1,
            name: 'Võ Việt Hà',
            phone: '0911290476',
            group: 'Nhóm 1',
            total: 200000,
            source: 'Trực tiếp',
            staff: '12/02/2022',
            recentAppointment: 'Đang làm việc',
            gender: 'Nam',
            avatar: avatar
        },
        {
            id: 1777,
            name: 'Võ Việt Hà',
            phone: 'Jon',
            age: 35,
            staff: 'Hà Nội',
            position: 'Nhân viên',
            recentAppointment: '12/02/2022',
            State: 'Đang làm việc',
            gender: 'Nam',
            avatar: avatar
        },
        {
            id: 10,
            name: 'Võ Việt Hà',
            phone: 'Jon',
            age: 35,
            location: 'Hà Nội',
            position: 'Nhân viên',
            join: '12/02/2022',
            State: 'Đang làm việc',
            gender: 'Nam',
            avatar: avatar
        },
        {
            id: 16,
            name: 'Võ Việt Hà',
            phone: 'Jon',
            age: 35,
            location: 'Hà Nội',
            total: 'Nhân viên',
            join: '12/02/2022',
            State: 'Đang làm việc',
            gender: 'Nam',
            avatar: avatar
        },

        { id: 2, name: 'Lannister', phone: 'Cersei', age: 42, location: 'Hà Nội', avatar: avatar },
        { id: 3, name: 'Lannister', phone: 'Jaime', age: 45, location: 'Hà Nội', avatar: avatar },
        { id: 4, name: 'Stark', phone: 'Arya', age: 16, location: 'Hà Nội', avatar: avatar },
        {
            id: 5,
            name: 'Targaryen',
            phone: 'Daenerys',
            age: null,
            location: 'Hà Nội',
            avatar: avatar
        },
        { id: 6, name: 'Melisandre', phone: null, age: 150, location: 'Hà Nội', avatar: avatar },
        { id: 7, name: 'Clifford', phone: 'Ferrara', age: 44, location: 'Hà Nội', avatar: avatar },
        { id: 8, name: 'Frances', phone: 'Rossini', age: 36, location: 'Hà Nội', avatar: avatar },
        { id: 9, name: 'Roxie', phone: 'Harvey', age: 65, location: 'Hà Nội', avatar: avatar }
    ];
    const [toggle, setToggle] = React.useState(false);
    const handleToggle = () => {
        setToggle(!toggle);
    };

    return (
        <Box
            className="customer-page"
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
                    <ButtonGroup
                        variant="contained"
                        sx={{ gap: '8px' }}
                        className="rounded-4px resize-height">
                        <Button
                            className="border-color"
                            variant="outlined"
                            startIcon={<img src={DownloadIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466'
                            }}>
                            Nhập
                        </Button>
                        <Button
                            className="border-color"
                            variant="outlined"
                            startIcon={<img src={UploadIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                padding: '10px 16px',
                                borderColor: '#E6E1E6'
                            }}>
                            Xuất
                        </Button>
                        <Button
                            className="bg-main"
                            onClick={handleToggle}
                            variant="contained"
                            startIcon={<img src={AddIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                minWidth: '173px'
                            }}>
                            Thêm khách hàng
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
            <div
                className="customer-page_row-2"
                style={{ height: 582, width: '100%', marginTop: '24px' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 }
                        }
                    }}
                    pageSizeOptions={[5, 10]}
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
            </div>
            <div
                className={toggle ? 'show customer-overlay' : 'customer-overlay'}
                onClick={handleToggle}></div>
            <div className={toggle ? 'show poppup-add' : 'poppup-add'}>
                <div className="poppup-title">Thêm khách hàng mới</div>
                <div className="poppup-des">Thông tin chi tiết</div>
                <Box component="form" className="form-add">
                    <Grid container className="form-container" spacing={2}>
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
                                placeholder="Nhập địa chỉ của khách hàng"
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
                    <Grid container sx={{ width: '350px' }} className=" box-1">
                        <Grid item xs={12} className="position-relative">
                            <div className=" inner-box" style={{ textAlign: 'center' }}>
                                <img src={fileIcon} />
                                <TextField
                                    type="file"
                                    id="input-file"
                                    sx={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        width: '100%',
                                        height: '100%'
                                    }}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        marginTop: '34px',
                                        justifyContent: 'center'
                                    }}>
                                    <img src={fileSmallIcon} />
                                    <div>Tải ảnh lên</div>
                                </div>
                                <div style={{ color: '#999699', marginTop: '13px' }}>
                                    File định dạng{' '}
                                    <span style={{ color: '#333233' }}>jpeg, png</span>{' '}
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={6}></Grid>
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
                    onClick={handleToggle}
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
            </div>
        </Box>
    );
};
export default Customer;
