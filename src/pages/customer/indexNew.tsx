/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef, useGridApiRef, GridLocaleText } from '@mui/x-data-grid';
import { TextTranslate } from '../../components/TableLanguage';
import { format, isValid } from 'date-fns';
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
    FormControl,
    TablePagination,
    Avatar
} from '@mui/material';
import './customerPage.css';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import AddIcon from '../../images/add.svg';
import SearchIcon from '../../images/search-normal.svg';
import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import khachHangService from '../../services/khach-hang/khachHangService';
import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import fileDowloadService from '../../services/file-dowload.service';
import CreateOrEditCustomerDialog from './components/create-or-edit-customer-modal';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import abpCustom from '../../components/abp-custom';
import { ReactComponent as IconSorting } from '../../images/column-sorting.svg';

class CustomerScreen extends React.Component {
    state = {
        rowTable: [],
        toggle: false,
        idkhachHang: '',
        rowPerPage: 10,
        pageSkipCount: 0,
        skipCount: 0,
        curentPage: 0,
        keyword: '',
        totalItems: 0,
        isShowConfirmDelete: false,
        moreOpen: false,
        anchorEl: null,
        selectedRowId: null,
        createOrEditKhachHang: {} as CreateOrEditKhachHangDto
    };
    componentDidMount(): void {
        this.getData();
    }

    async getData() {
        const khachHangs = await khachHangService.getAll({
            keyword: this.state.keyword,
            maxResultCount: this.state.rowPerPage,
            skipCount: this.state.skipCount,
            loaiDoiTuong: 0
        });

        this.setState({
            rowTable: khachHangs.items,
            totalItems: khachHangs.totalCount
        });
    }
    async handleSubmit() {
        await khachHangService.createOrEdit(this.state.createOrEditKhachHang);
        this.setState({
            idkhachHang: '',
            rowPerPage: 10,
            pageSkipCount: 0,
            skipCount: 0,
            curentPage: 0,
            keyword: '',
            createOrEditKhachHang: {} as CreateOrEditKhachHangDto
        });
        this.getData();
        this.handleToggle();
    }
    handleChange = (event: any) => {
        const { name, value } = event.target;
        this.setState({
            createOrEditKhachHang: {
                ...this.state.createOrEditKhachHang,
                [name]: value
            }
        });
    };
    async createOrUpdateModalOpen(id: string) {
        if (id === '') {
            this.setState({
                idKhachHang: '',
                createOrEditKhachHang: {}
            });
        } else {
            const createOrEdit = await khachHangService.getKhachHang(id);
            this.setState({
                idKhachHang: id,
                createOrEditKhachHang: createOrEdit
            });
        }
        this.handleToggle();
    }
    async delete(id: string) {
        await khachHangService.delete(id);
    }
    handleToggle = () => {
        this.setState({
            toggle: !this.state.toggle
        });
    };
    exportToExcel = async () => {
        const result = await khachHangService.exportDanhSach({
            keyword: this.state.keyword,
            maxResultCount: this.state.rowPerPage,
            skipCount: this.state.skipCount,
            loaiDoiTuong: 0
        });
        fileDowloadService.downloadTempFile(result);
    };
    handlePageChange = async (event: any, newPage: number) => {
        const skip = newPage + 1;
        await this.setState({ skipCount: skip, curentPage: newPage });
        await this.getData();
    };

    // Handler for rows per page changes
    handleRowsPerPageChange = async (event: any) => {
        await this.setState({ rowPerPage: parseInt(event.target.value, 10) });
        await this.setState({ curentPage: 0, skipCount: 1 }); // Reset page to the first one when changing rows per page
        await this.getData();
    };

    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: null });
        await this.getData();
    };

    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };

    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? '');
        this.handleCloseMenu();
    };
    onOkDelete = () => {
        this.delete(this.state.selectedRowId ?? '');
        this.showConfirmDelete();
        this.handleCloseMenu();
    };
    showConfirmDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete,
            idNhanSu: ''
        });
    };
    render(): React.ReactNode {
        const columns: GridColDef[] = [
            { field: 'id', headerName: 'ID', minWidth: 70, flex: 1 },

            {
                field: 'tenKhachHang',
                headerName: 'Tên khách hàng',
                minWidth: 185,
                flex: 1,
                renderCell: (params) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '14px',
                            width: '100%'
                        }}
                        title={params.value}>
                        <Avatar
                            src={params.row.avatar}
                            alt="Avatar"
                            style={{ width: 24, height: 24, marginRight: 8 }}
                        />
                        <Typography
                            fontSize="14px"
                            sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                width: '100%'
                            }}>
                            {params.value}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'soDienThoai',
                headerName: 'Số điện thoại',
                minWidth: 114,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'tenNhomKhach',
                headerName: 'Nhóm khách',
                minWidth: 112,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'gioiTinh',
                headerName: 'Giới tính',
                width: 89,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'nhanVienPhuTrach',
                headerName: 'Nhân viên phục vụ',
                minWidth: 185,
                flex: 1,
                renderHeader: (params) => (
                    <Box
                        sx={{
                            fontWeight: '700',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: '100%'
                        }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'tongChiTieu',
                headerName: 'Tổng chi tiêu',
                minWidth: 113,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'cuocHenGanNhat',
                headerName: 'Cuộc hẹn gần đây',
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        {new Date(params.value).toLocaleDateString('en-GB')}
                    </Box>
                ),
                minWidth: 128,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'tenNguonKhach',
                headerName: 'Nguồn',
                minWidth: 86,
                flex: 1,
                renderCell: (params) => (
                    <div className={params.field === 'tenNguonKhach' ? 'last-column' : ''}>
                        {params.value}
                    </div>
                ),
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'actions',
                headerName: 'Hành động',
                maxWidth: 48,
                flex: 1,
                disableColumnMenu: true,

                renderCell: (params) => (
                    <Box>
                        <IconButton
                            aria-label="Actions"
                            aria-controls={`actions-menu-${params.row.id}`}
                            aria-haspopup="true"
                            onClick={(event) => {
                                this.handleOpenMenu(event, params.row.id);
                            }}>
                            <MoreHorizIcon />
                        </IconButton>
                    </Box>
                ),
                renderHeader: (params) => (
                    <Box sx={{ display: 'none' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            }
        ];

        const breadcrumbs = [
            <Typography key="1" color="#999699" fontSize="14px">
                Khách hàng
            </Typography>,
            <Typography key="2" color="#333233" fontSize="14px">
                Quản lý khách hàng
            </Typography>
        ];
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
                            Danh sách khách hàng
                        </Typography>
                    </Grid>
                    <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                        <Box className="form-search">
                            <TextField
                                sx={{
                                    backgroundColor: '#FFFAFF',
                                    borderColor: '#CDC9CD'
                                }}
                                className="search-field"
                                variant="outlined"
                                type="search"
                                onChange={(e) => {
                                    this.setState({ keyword: e.target.value });
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        this.getData();
                                    }
                                }}
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton
                                            type="button"
                                            onClick={() => {
                                                this.getData();
                                            }}>
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
                                onClick={() => {
                                    this.exportToExcel();
                                }}
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
                                onClick={this.handleToggle}
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
                    style={{
                        width: '100%',
                        marginTop: '24px',
                        backgroundColor: '#fff'
                    }}>
                    <DataGrid
                        autoHeight
                        rows={this.state.rowTable}
                        columns={columns}
                        hideFooterPagination
                        hideFooter
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    page: this.state.curentPage,
                                    pageSize: this.state.rowPerPage
                                }
                            }
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
                            }
                        }}
                        localeText={TextTranslate}
                    />
                    <Menu
                        id={`actions-menu-${this.state.selectedRowId}`}
                        anchorEl={this.state.anchorEl}
                        keepMounted
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleCloseMenu}
                        sx={{ minWidth: '120px' }}>
                        <MenuItem onClick={this.handleView}>
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
                        <MenuItem onClick={this.handleEdit}>
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
                        <MenuItem onClick={this.showConfirmDelete}>
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
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={this.state.totalItems}
                        rowsPerPage={this.state.rowPerPage}
                        page={this.state.curentPage}
                        onPageChange={this.handlePageChange}
                        onRowsPerPageChange={this.handleRowsPerPageChange}
                    />
                </div>
                <div
                    className={this.state.toggle ? 'show customer-overlay' : 'customer-overlay'}
                    onClick={this.handleToggle}></div>
                <CreateOrEditCustomerDialog
                    formRef={this.state.createOrEditKhachHang}
                    onCancel={this.handleToggle}
                    onOk={() => {
                        this.handleSubmit();
                    }}
                    title={
                        this.state.idkhachHang == ''
                            ? 'Thêm mới khách hàng'
                            : 'Cập nhật thông tin khách hàng'
                    }
                    onChange={this.handleChange}
                    visible={this.state.toggle}
                />
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.showConfirmDelete}></ConfirmDelete>
            </Box>
        );
    }
}
export default CustomerScreen;
