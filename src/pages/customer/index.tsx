import * as React from 'react';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { TextTranslate } from '../../components/TableLanguage';
import {
    Button,
    ButtonGroup,
    Typography,
    Grid,
    Box,
    TextField,
    IconButton,
    Avatar,
    SelectChangeEvent
} from '@mui/material';
import './customerPage.css';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import AddIcon from '../../images/add.svg';
import SearchIcon from '../../images/search-normal.svg';
import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import khachHangService from '../../services/khach-hang/khachHangService';
import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import fileDowloadService from '../../services/file-dowload.service';
import CreateOrEditCustomerDialog from './components/create-or-edit-customer-modal';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import { ReactComponent as IconSorting } from '../../images/column-sorting.svg';
import ActionMenuTable from '../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../components/Pagination/CustomTablePagination';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import AppConsts from '../../lib/appconst';
import { observer } from 'mobx-react';
import khachHangStore from '../../stores/khachHangStore';
import { enqueueSnackbar } from 'notistack';
import Cookies from 'js-cookie';

interface CustomerScreenState {
    rowTable: KhachHangItemDto[];
    toggle: boolean;
    idkhachHang: string;
    rowPerPage: number;
    pageSkipCount: number;
    skipCount: number;
    currentPage: number;
    keyword: string;
    totalItems: number;
    totalPage: number;
    isShowConfirmDelete: boolean;
    moreOpen: boolean;
    anchorEl: any;
    selectedRowId: any;
    createOrEditKhachHang: CreateOrEditKhachHangDto;
    visibilityColumn: any;
}
class CustomerScreen extends React.Component<any, CustomerScreenState> {
    constructor(props: any) {
        super(props);

        this.state = {
            rowTable: [],
            toggle: false,
            idkhachHang: '',
            rowPerPage: 10,
            pageSkipCount: 0,
            skipCount: 0,
            currentPage: 1,
            keyword: '',
            totalItems: 0,
            totalPage: 0,
            isShowConfirmDelete: false,
            moreOpen: false,
            anchorEl: null,
            selectedRowId: null,
            createOrEditKhachHang: {} as CreateOrEditKhachHangDto,
            visibilityColumn: {}
        };
    }

    componentDidMount(): void {
        this.getData();
        const visibilityColumn = localStorage.getItem('visibilityColumn') ?? {};
        this.setState({ visibilityColumn: visibilityColumn });
    }

    async getData() {
        const khachHangs = await khachHangService.getAll({
            keyword: this.state.keyword,
            maxResultCount: this.state.rowPerPage,
            skipCount: this.state.currentPage,
            loaiDoiTuong: 0,
            sortBy: '',
            sortType: 'desc',
            idChiNhanh: Cookies.get('IdChiNhanh') ?? undefined
        });
        await this.setState({
            rowTable: khachHangs.items,
            totalItems: khachHangs.totalCount,
            totalPage: Math.ceil(khachHangs.totalCount / this.state.rowPerPage)
        });
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
    handleSubmit = () => {
        this.getData();
        this.handleToggle();
    };
    async createOrUpdateModalOpen(id: string) {
        if (id === '') {
            await khachHangStore.createKhachHangDto();
            this.updateModal();
        } else {
            await khachHangStore.getForEdit(id ?? '');
            this.updateModal();
        }
        this.setState({ idkhachHang: id ?? '' }, () => {
            this.handleToggle();
        });
    }
    updateModal = () => {
        this.setState({ createOrEditKhachHang: khachHangStore.createEditKhachHangDto });
    };
    async delete(id: string) {
        const deleteReult = await khachHangService.delete(id);
        deleteReult != null
            ? enqueueSnackbar('Xóa bản ghi thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
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
            loaiDoiTuong: 0,
            sortBy: '',
            sortType: 'desc'
        });
        fileDowloadService.downloadTempFile(result);
    };
    handlePageChange = async (event: any, newPage: number) => {
        const skip = newPage + 1;
        await this.setState({ skipCount: skip, currentPage: newPage });
        await this.getData();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            rowPerPage: parseInt(event.target.value.toString(), 10),
            currentPage: 1,
            skipCount: 1
        });
        this.getData();
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
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };
    toggleColumnVisibility = (column: GridColumnVisibilityModel) => {
        localStorage.setItem('visibilityColumn', JSON.stringify(column));
        this.setState({ visibilityColumn: column });
    };
    render(): React.ReactNode {
        const columns: GridColDef[] = [
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

                            width: '100%'
                        }}
                        title={params.value}>
                        <Avatar
                            src={params.row.avatar}
                            alt="Avatar"
                            style={{ width: 24, height: 24, marginRight: 8 }}
                        />
                        <Typography
                            sx={{
                                fontSize: '12px',
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
                ),
                renderCell: (params) => (
                    <Box title={params.value}>
                        {new Intl.NumberFormat('vi-VN').format(params.value)}
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
        const { createOrEditKhachHang } = this.state;
        return (
            <Box
                className="customer-page"
                paddingLeft="2.2222222222222223vw"
                paddingRight="2.2222222222222223vw"
                paddingTop="1.5277777777777777vw">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto" display="flex" alignItems="center" gap="12px">
                        <Typography color="#333233" variant="h1" fontSize="16px" fontWeight="700">
                            Danh sách khách hàng
                        </Typography>
                        <Box className="form-search">
                            <TextField
                                sx={{
                                    backgroundColor: '#FFFAFF',
                                    borderColor: '#CDC9CD'
                                }}
                                className="search-field"
                                variant="outlined"
                                type="search"
                                onChange={async (e) => {
                                    await this.setState({ keyword: e.target.value });
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
                                                this.setState({ skipCount: 1 });
                                                this.getData();
                                            }}>
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
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
                                    color: '#666466',
                                    bgcolor: '#fff'
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
                                    borderColor: '#E6E1E6',
                                    bgcolor: '#fff'
                                }}>
                                Xuất
                            </Button>
                            <Button
                                className="bg-main"
                                onClick={() => {
                                    this.createOrUpdateModalOpen('');
                                }}
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
                        hideFooter
                        onColumnVisibilityModelChange={this.toggleColumnVisibility}
                        columnVisibilityModel={this.state.visibilityColumn}
                        checkboxSelection
                        sx={{
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
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
                        rowPerPage={this.state.rowPerPage}
                        totalRecord={this.state.totalItems}
                        totalPage={this.state.totalPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                    <CreateOrEditCustomerDialog
                        visible={this.state.toggle}
                        onCancel={this.handleToggle}
                        onOk={this.handleSubmit}
                        handleChange={this.handleChange}
                        title={
                            this.state.idkhachHang == ''
                                ? 'Thêm mới khách hàng'
                                : 'Cập nhật thông tin khách hàng'
                        }
                        formRef={createOrEditKhachHang}
                    />
                </div>
                <div
                    className={this.state.toggle ? 'show customer-overlay' : 'customer-overlay'}
                    onClick={this.handleToggle}></div>

                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.showConfirmDelete}></ConfirmDelete>
            </Box>
        );
    }
}
export default observer(CustomerScreen);
