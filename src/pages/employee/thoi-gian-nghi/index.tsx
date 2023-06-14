import { Component, ReactNode } from 'react';
import '../../employee/employee.css';
import React from 'react';
import { NgayNghiLeDto } from '../../../services/ngay_nghi_le/dto/NgayNghiLeDto';
import ngayNghiLeService from '../../../services/ngay_nghi_le/ngayNghiLeService';
import { CreateOrEditNgayNghiLeDto } from '../../../services/ngay_nghi_le/dto/createOrEditNgayNghiLe';
import {
    Box,
    Button,
    Grid,
    IconButton,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import CreateOrEditThoiGianNghi from './create-or-edit-thoi-gian-nghi';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '../../../images/add.svg';
import SearchIcon from '../../../images/search-normal.svg';
import DownloadIcon from '../../../images/download.svg';
import UploadIcon from '../../../images/upload.svg';
import { ReactComponent as DateIcon } from '../../../images/calendar-5.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import AppConsts from '../../../lib/appconst';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import ActionMenuTable from '../../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
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
            id: AppConsts.guidEmpty,
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
            skipCount: this.state.currentPage
        });
        await this.setState({
            listHoliday: data.items,
            totalCount: data.totalCount,
            totalPage: Math.ceil(data.totalCount / this.state.maxResultCount)
        });
    }
    handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
        await this.setState({
            currentPage: value,
            skipCount: value
        });
        this.getListHoliday();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            currentPage: 1,
            skipCount: 1
        });
        this.getListHoliday();
    };
    handleChange = (event: any): void => {
        const { name, value } = event.target;
        this.setState({
            createOrEditNhanSu: {
                ...this.state.createOrEditNgayNghiLe,
                [name]: value
            }
        });
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
                    id: AppConsts.guidEmpty,
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
        const columns: GridColDef[] = [
            {
                field: 'tenNgayLe',
                headerName: 'Tên ngày lễ',
                flex: 1,
                renderHeader: (params) => (
                    <Box
                        sx={{
                            fontWeight: '700',
                            overflow: 'hidden',
                            width: '100%',
                            textOverflow: 'ellipsis'
                        }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'tuNgay',
                headerName: 'Ngày bắt đầu',
                // width: 200,
                flex: 1,
                renderCell: (params) => (
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="12px"
                            fontWeight="400"
                            variant="h6"
                            color="#333233"
                            lineHeight="16px">
                            {new Date(params.value).toLocaleDateString('en-GB')}
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
                field: 'denNgay',
                headerName: 'Ngày kết thúc',
                // width: 200,
                flex: 1,
                renderCell: (params) => (
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="12px"
                            fontWeight="400"
                            variant="h6"
                            color="#333233"
                            lineHeight="16px">
                            {new Date(params.value).toLocaleDateString('en-GB')}
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
                field: 'tongSoNgay',
                headerName: 'Tổng số ngày',
                // width: 150,
                flex: 1,
                renderCell: (params) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            alignContent: 'center',
                            textAlign: 'center'
                        }}>
                        <Typography
                            fontSize="12px"
                            fontWeight="400"
                            variant="h6"
                            color="#333233"
                            lineHeight="16px">
                            {params.value} ngày
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
                field: 'actions',
                headerName: 'Hành động',
                // width: 48,
                flex: 0.3,
                disableColumnMenu: true,

                renderCell: (params) => (
                    <IconButton
                        aria-label="Actions"
                        aria-controls={`actions-menu-${params.row.id}`}
                        aria-haspopup="true"
                        onClick={(event) => this.handleOpenMenu(event, params.row.id)}>
                        <MoreHorizIcon />
                    </IconButton>
                ),
                renderHeader: (params) => (
                    <Box sx={{ display: 'none' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            }
        ];
        return (
            <Box padding="22px 32px" className="thoi-gian-nghi-page">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto" display="flex" gap="10px" alignItems="center">
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
                                onChange={(e) => {
                                    this.setState({ filter: e.target.value });
                                }}
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        this.getListHoliday();
                                    }
                                }}
                                className="search-field"
                                variant="outlined"
                                type="search"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton
                                            type="button"
                                            onClick={() => {
                                                this.getListHoliday();
                                            }}>
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<img src={DownloadIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                height: '40px',
                                backgroundColor: '#fff',
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
                                backgroundColor: '#fff',
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
                                fontSize: '14px',
                                backgroundColor: '#7C3367!important'
                            }}>
                            Thêm ngày nghỉ
                        </Button>
                    </Grid>
                </Grid>
                <Box marginTop="24px" bgcolor="#fff">
                    <DataGrid
                        autoHeight
                        rows={this.state.listHoliday}
                        columns={columns}
                        checkboxSelection
                        sx={{
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
                            },
                            '& .MuiDataGrid-columnHeadersInner': {
                                backgroundColor: '#F2EBF0'
                            },
                            '& .MuiDataGrid-cellContent': {
                                fontSize: '12px'
                            },
                            '& .MuiDataGrid-columnHeaderCheckbox:focus': {
                                outline: 'none!important'
                            },
                            '&  .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
                                outline: 'none '
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainer:hover': {
                                color: '#7C3367'
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainer svg path:hover': {
                                fill: '#7C3367'
                            },
                            '& [aria-sort="ascending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-child(2)':
                                {
                                    fill: '#000'
                                },
                            '& [aria-sort="descending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-child(1)':
                                {
                                    fill: '#000'
                                },
                            '& .Mui-checked, &.MuiCheckbox-indeterminate': {
                                color: '#7C3367!important'
                            },
                            '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within':
                                {
                                    outline: 'none'
                                },
                            '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover,.MuiDataGrid-row.Mui-selected.Mui-hovered':
                                {
                                    bgcolor: '#f2ebf0'
                                }
                        }}
                        hideFooter
                        localeText={TextTranslate}
                    />
                    <ActionMenuTable
                        selectedRowId={this.state.selectedRowId}
                        anchorEl={this.state.anchorEl}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleView}
                        handleEdit={this.handleEdit}
                        handleDelete={this.showConfirmDelete}
                    />
                    <CustomTablePagination
                        currentPage={this.state.currentPage}
                        rowPerPage={this.state.maxResultCount}
                        totalRecord={this.state.totalCount}
                        totalPage={this.state.totalPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                </Box>
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.showConfirmDelete}></ConfirmDelete>
                <CreateOrEditThoiGianNghi
                    visible={this.state.modalVisible}
                    title={this.state.IdHoliday == '' ? 'Thêm mới' : 'Cập nhật'}
                    onCancel={() => {
                        this.Modal();
                    }}
                    createOrEditDto={this.state.createOrEditNgayNghiLe}></CreateOrEditThoiGianNghi>
            </Box>
        );
    }
}
export default EmployeeHoliday;
