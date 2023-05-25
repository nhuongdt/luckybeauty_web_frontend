import { Component, ReactNode } from 'react';
import { useFormik } from 'formik';
import { format } from 'date-fns';
import '../../employee/employee.css';
import React from 'react';
import { NgayNghiLeDto } from '../../../services/ngay_nghi_le/dto/NgayNghiLeDto';
import ngayNghiLeService from '../../../services/ngay_nghi_le/ngayNghiLeService';
import { CreateOrEditNgayNghiLeDto } from '../../../services/ngay_nghi_le/dto/createOrEditNgayNghiLe';
import {
    Box,
    Breadcrumbs,
    Button,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Typography
} from '@mui/material';
import CreateOrEditThoiGianNghi from './create-or-edit-thoi-gian-nghi';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
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
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
class EmployeeHoliday extends Component {
    state = {
        IdHoliday: '',
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        filter: '',
        moreOpen: false,
        anchorEl: null,
        selectedRowId: null,
        listHoliday: [] as NgayNghiLeDto[],
        createOrEditNgayNghiLe: {
            id: '',
            tenNgayLe: '',
            tuNgay: new Date(),
            denNgay: new Date()
        } as CreateOrEditNgayNghiLeDto,
        totalCount: 0,
        currentPage: 1,
        totalPage: 1,
        startIndex: 0,
        isShowConfirmDelete: false,
        sortColumn: null,
        sortDirection: 'asc'
    };
    async componentDidMount() {
        this.getData();
        this.getListHoliday();
    }
    async getData() {
        if (this.state.IdHoliday !== '') {
            const holiday = await ngayNghiLeService.getForEdit(this.state.IdHoliday);
            this.setState({ createOrEditNgayNghiLe: holiday });
        }
        //this.getListHoliday();
    }
    async getListHoliday() {
        const data = await ngayNghiLeService.getAll({
            keyword: this.state.filter,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount
        });
        await this.setState({
            listHoliday: data.items,
            totalCount: data.totalCount,
            totalPage: Math.ceil(data.totalCount / this.state.maxResultCount)
        });
    }
    handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        const { maxResultCount } = this.state;
        this.setState({
            currentPage: value,
            skipCount: value
        });
    };
    handleSubmit = () => {
        console.log('submit');
    };
    handleClick = () => {
        console.log('ok');
    };
    handleSearch = () => {
        console.log('ok');
    };
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            IdHoliday: ''
        });
        this.getData();
        this.getListHoliday();
    };
    createOrUpdateModalOpen = async (id: string) => {
        this.setState({
            IdHoliday: id
        });
        if (id !== '') {
            const holiday = await ngayNghiLeService.getForEdit(id);
            this.setState({ createOrEditNgayNghiLe: holiday });
        } else {
            this.setState({
                createOrEditNgayNghiLe: {
                    id: '',
                    tenNgayLe: '',
                    tuNgay: new Date(),
                    denNgay: new Date()
                }
            });
        }
        this.Modal();
    };
    handleSort = (property: keyof NgayNghiLeDto) => {
        const { listHoliday, sortColumn, sortDirection } = this.state;

        let newSortDirection = 'asc';
        if (sortColumn === property && sortDirection === 'asc') {
            newSortDirection = 'desc';
        }

        const sortedList = [...listHoliday].sort((a, b) => {
            const valueA = a[property];
            const valueB = b[property];

            if (valueA < valueB) {
                return newSortDirection === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return newSortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        this.setState({
            listHoliday: sortedList,
            sortColumn: property,
            sortDirection: newSortDirection
        });
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: null });
        await this.getListHoliday();
    };

    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };
    delete = async (id: string) => {
        await ngayNghiLeService.delete(id);
    };
    onOkDelete = async () => {
        await this.delete(this.state.selectedRowId ?? '');
        this.showConfirmDelete();
        await this.handleCloseMenu();
    };
    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? '');
        this.handleCloseMenu();
    };

    showConfirmDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete,
            IdHoliday: ''
        });
    };
    render() {
        const breadcrumbs = [
            <Typography key="1" color="#999699" fontSize="14px">
                Dịch vụ
            </Typography>,
            <Typography key="2" color="#333233" fontSize="14px">
                Danh mục dịch vụ
            </Typography>
        ];
        const columns: GridColDef[] = [
            {
                field: 'tenNgayLe',
                headerName: 'Tên ngày lễ',
                width: 200
            },
            {
                field: 'tuNgay',
                headerName: 'Ngày bắt đầu',
                width: 200,
                renderCell: (params) => (
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="14px"
                            fontWeight="400"
                            variant="h6"
                            color="#333233"
                            lineHeight="16px">
                            {new Date(params.value).toLocaleDateString('en-GB')}
                        </Typography>
                    </Box>
                )
            },
            {
                field: 'denNgay',
                headerName: 'Ngày kết thúc',
                width: 200,
                renderCell: (params) => (
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="14px"
                            fontWeight="400"
                            variant="h6"
                            color="#333233"
                            lineHeight="16px">
                            {new Date(params.value).toLocaleDateString('en-GB')}
                        </Typography>
                    </Box>
                )
            },
            {
                field: 'tongSoNgay',
                headerName: 'Tổng số ngày',
                width: 150,
                renderCell: (params) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            alignContent: 'center',
                            textAlign: 'center'
                        }}>
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
                field: 'actions',
                headerName: '',
                width: 48,
                disableColumnMenu: true,

                renderCell: (params) => (
                    <IconButton
                        aria-label="Actions"
                        aria-controls={`actions-menu-${params.row.id}`}
                        aria-haspopup="true"
                        onClick={(event) => this.handleOpenMenu(event, params.row.id)}>
                        <MoreHorizIcon />
                    </IconButton>
                )
            }
        ];
        return (
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
                            onClick={() => {
                                this.createOrUpdateModalOpen('');
                            }}
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
                <Box height="60vh" marginTop="24px">
                    <DataGrid
                        rows={this.state.listHoliday}
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
                </Box>
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.showConfirmDelete}></ConfirmDelete>
                <CreateOrEditThoiGianNghi
                    visible={this.state.modalVisible}
                    title="Thêm mới"
                    onOk={this.handleSubmit}
                    onCancel={() => {
                        this.Modal();
                    }}
                    createOrEditDto={this.state.createOrEditNgayNghiLe}></CreateOrEditThoiGianNghi>
            </Box>
        );
    }
}
export default EmployeeHoliday;
