import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import AddIcon from '../../images/add.svg';
import SearchIcon from '../../images/search-normal.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React from 'react';
import { SuggestChucVuDto } from '../../services/suggests/dto/SuggestChucVuDto';
import { CreateOrUpdateNhanSuDto } from '../../services/nhan-vien/dto/createOrUpdateNhanVienDto';
import Cookies from 'js-cookie';
import SuggestService from '../../services/suggests/SuggestService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Grid,
    IconButton,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import CreateOrEditNhanVienDialog from './components/createOrEditNhanVienDialog';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import { observer } from 'mobx-react';
import NhanVienStore from '../../stores/nhanVienStore';
import { TextTranslate } from '../../components/TableLanguage';
import ActionMenuTable from '../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../components/Pagination/CustomTablePagination';
import './employee.css';
import { enqueueSnackbar } from 'notistack';
import nhanVienStore from '../../stores/nhanVienStore';
import { FileUpload } from '../../services/dto/FileUpload';
import fileDowloadService from '../../services/file-dowload.service';
import uploadFileService from '../../services/uploadFileService';
import nhanVienService from '../../services/nhan-vien/nhanVienService';
import ImportExcel from '../../components/ImportComponent/ImportExcel';
import abpCustom from '../../components/abp-custom';
import { AppContext, IAppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import { SuggestChiNhanhDto } from '../../services/suggests/dto/SuggestChiNhanhDto';
import suggestStore from '../../stores/suggestStore';
import AppConsts from '../../lib/appconst';
class EmployeeScreen extends React.Component {
    static contextType = AppContext;
    state = {
        idNhanSu: '',
        avatarFile: '',
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        filter: '',
        sortBy: 'createTime',
        sortType: 'desc',
        moreOpen: false,
        importShow: false,
        anchorEl: null,
        selectedRowId: null,
        suggestChucVu: [] as SuggestChucVuDto[],
        createOrEditNhanSu: {} as CreateOrUpdateNhanSuDto,
        currentPage: 1,
        totalPage: 1,
        totalCount: 0,
        isShowConfirmDelete: false,
        idChiNhanh: Cookies.get('IdChiNhanh')
    };
    async componentDidMount() {
        await this.getData();
    }
    componentDidUpdate(prevProps: any, prevState: any, snapshot?: any): void {
        const appContext = this.context as IAppContext;
        const chiNhanhContext = appContext.chinhanhCurrent;

        if (this.state.idChiNhanh !== chiNhanhContext.id) {
            // ChiNhanhContext has changed, update the component
            this.setState({
                idChiNhanh: chiNhanhContext.id
            });
            this.getData();
        }
    }
    resetData() {
        this.setState({
            idNhanSu: '',
            modalVisible: false,
            maxResultCount: 10,
            skipCount: 0,
            filter: '',
            createOrEditNhanSu: {} as CreateOrUpdateNhanSuDto,
            totalNhanVien: 0,
            currentPage: 1,
            totalPage: 1,
            isShowConfirmDelete: false
        });
    }
    async getData() {
        const appContext = this.context as IAppContext;
        const chiNhanhContext = appContext.chinhanhCurrent as SuggestChiNhanhDto;
        const suggestChucVus = await SuggestService.SuggestChucVu();
        await suggestStore.getSuggestChucVu();
        this.setState({
            suggestChucVu: suggestChucVus,
            idChiNhanh: chiNhanhContext.id
        });
        await this.getListNhanVien();
    }
    async getListNhanVien() {
        const { filter, maxResultCount, currentPage, sortBy, sortType } = this.state;
        const appContext = this.context as IAppContext;
        const chiNhanhContext = appContext.chinhanhCurrent;
        await NhanVienStore.getAll({
            maxResultCount: maxResultCount,
            skipCount: currentPage,
            filter: filter,
            sortBy: sortBy,
            sortType: sortType,
            idChiNhanh: chiNhanhContext.id
        });
        this.setState({
            totalPage: Math.ceil(NhanVienStore.listNhanVien.totalCount / maxResultCount),
            totalCount: NhanVienStore.listNhanVien.totalCount
        });
    }
    async delete(id: string) {
        const deleteResult = NhanVienStore.delete(id);
        deleteResult != null
            ? enqueueSnackbar('Xóa bản ghi thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        this.getListNhanVien();
        this.resetData();
    }
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    async createOrUpdateModalOpen(id: string) {
        if (id === '') {
            await NhanVienStore.createNhanVien();
            await this.setState({
                createOrEditNhanSu: NhanVienStore.createEditNhanVien
            });
        } else {
            await NhanVienStore.getForEdit(id);
            await this.setState({
                createOrEditNhanSu: NhanVienStore.createEditNhanVien
            });
        }
        this.setState({ idNhanSu: id });
        this.Modal();
    }
    handleSubmit = async () => {
        await this.getData();
        this.setState({ modalVisible: false });
    };
    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            currentPage: value,
            skipCount: value
        });
        this.getListNhanVien();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            currentPage: 1,
            skipCount: 1
        });
        this.getData();
    };
    onOkDelete = () => {
        this.delete(this.state.selectedRowId ?? '');
        this.handleDelete;
        this.handleCloseMenu();
    };
    handleKeyDown = async (event: any) => {
        if (event.key === 'Enter') {
            await this.setState({
                currentPage: 1,
                skipCount: 1
            });
            this.getListNhanVien();
        }
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: null });
        //await this.getData();
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

    handleDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete,
            idNhanSu: ''
        });
    };
    exportToExcel = async () => {
        const { filter, maxResultCount, currentPage, sortBy, sortType } = this.state;
        const result = await nhanVienService.exportDanhSachNhanVien({
            maxResultCount: maxResultCount,
            skipCount: currentPage,
            filter: filter,
            sortBy: sortBy,
            sortType: sortType,
            idChiNhanh: Cookies.get('IdChiNhanh')
        });
        fileDowloadService.downloadExportFile(result);
    };
    onImportShow = () => {
        this.setState({
            importShow: !this.state.importShow
        });
        this.getData();
    };
    handleImportData = async (input: FileUpload) => {
        const result = await nhanVienService.inportNhanVien(input);
        enqueueSnackbar(result.message, {
            variant: result.status == 'success' ? 'success' : result.status,
            autoHideDuration: 3000
        });
    };
    downloadImportTemplate = async () => {
        const result = await uploadFileService.downloadImportTemplate(
            'NhanVien_ImportTemplate.xlsx'
        );
        fileDowloadService.downloadExportFile(result);
    };
    onSort = async (sortType: string, sortBy: string) => {
        await this.setState((prev: any) => {
            return {
                ...prev,
                sortBy: sortBy,
                sortType: sortType
            };
        });
        this.getData();
    };
    columns: GridColDef[] = [
        {
            field: 'tenNhanVien',
            headerName: 'Tên nhân viên',
            minWidth: 171,
            flex: 1.5,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center' }} width="100%">
                    <Avatar
                        src={params.row.avatar}
                        alt="Avatar"
                        style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    <Typography
                        variant="body2"
                        title={params.value}
                        fontSize="13px"
                        sx={{ textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
                        {params.value}
                    </Typography>
                </Box>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
            )
        },
        {
            field: 'soDienThoai',
            headerName: 'Số điện thoại',
            minWidth: 120,
            flex: 0.8,
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
            ),

            renderCell: (params) => (
                <Box width="100%" textAlign="left" fontSize="13px">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'ngaySinh',
            headerName: 'Ngày sinh',
            headerAlign: 'center',
            align: 'center',
            minWidth: 112,
            flex: 0.8,
            renderCell: (params) => (
                <Box
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                    {params.value != null ? (
                        <>
                            <DateIcon style={{ marginRight: 4 }} />
                            <Typography variant="body2" fontSize="13px">
                                {new Date(params.value).toLocaleDateString('en-GB')}
                            </Typography>
                        </>
                    ) : null}
                </Box>
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        },
        {
            field: 'gioiTinh',
            headerName: 'Giới tính',
            headerAlign: 'center',
            minWidth: 60,
            flex: 0.7,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                    <Typography fontSize="13px" fontWeight="400" lineHeight="16px">
                        {params.value == 0 ? '' : params.value == 1 ? 'Nam' : 'Nữ'}
                    </Typography>
                </Box>
            ),
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '500',
                        fontSize: '13px',
                        fontFamily: 'Roboto'
                    }}>
                    {params.colDef.headerName}
                </Box>
            )
        },
        {
            field: 'diaChi',
            headerName: 'Địa chỉ',
            minWidth: 130,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '500',
                        fontSize: '13px',
                        fontFamily: 'Roboto'
                    }}>
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    fontSize="13px"
                    sx={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        fontWeight: '400',
                        fontFamily: 'Roboto',
                        textAlign: 'left'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'tenChucVu',
            headerName: 'Vị trí',
            minWidth: 113,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    fontSize="13px"
                    fontWeight="400"
                    fontFamily={'Roboto'}
                    lineHeight="16px"
                    sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {params.value}
                </Typography>
            ),
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '500',
                        color: '#525F7A',
                        fontSize: '13px',
                        fontFamily: 'Roboto'
                    }}>
                    {params.colDef.headerName}
                </Box>
            )
        },

        {
            field: 'ngayVaoLam',
            headerName: 'Ngày tham gia',
            minWidth: 120,
            flex: 1,
            renderCell: (params) => (
                <Box
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'start',
                        width: '100%'
                    }}>
                    <DateIcon style={{ marginRight: 4 }} />
                    <Typography
                        fontSize="13px"
                        fontWeight="400"
                        fontFamily={'Roboto'}
                        color="#3D475C"
                        lineHeight="16px">
                        {new Date(params.value).toLocaleDateString('en-GB')}
                    </Typography>
                </Box>
            ),
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '500',
                        color: '#525F7A',
                        fontSize: '13px',
                        fontFamily: 'Roboto'
                    }}>
                    {params.colDef.headerName}
                </Box>
            )
        },
        {
            field: 'trangThai',
            headerName: 'Trạng thái',
            headerAlign: 'center',
            minWidth: 116,
            flex: 0.8,
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    alignItems={'center'}
                    borderRadius="12px"
                    sx={{
                        margin: 'auto',
                        backgroundColor:
                            params.row.trangThai === 'Hoạt động'
                                ? '#E8FFF3'
                                : params.row.trangThai === 'Ngừng hoạt động'
                                ? '#FFF8DD'
                                : '#FFF5F8',
                        color:
                            params.row.trangThai === 'Hoạt động'
                                ? '#50CD89'
                                : params.row.trangThai === 'Ngừng hoạt động'
                                ? '#FF9900'
                                : '#F1416C'
                    }}
                    fontSize="13px"
                    fontWeight="400"
                    textAlign={'left'}
                    color="#009EF7">
                    {params.value}
                </Typography>
            ),
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontSize: '12px'
                    }}>
                    {params.colDef.headerName}
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: '#',
            headerAlign: 'center',
            sortable: false,
            width: 48,
            flex: 0.4,
            disableColumnMenu: true,
            renderCell: (params) => (
                <IconButton
                    aria-label="Actions"
                    aria-controls={`actions-menu-${params.row.id}`}
                    aria-haspopup="true"
                    onClick={(event: any) => {
                        params.row.trangThai == 'Hoạt động'
                            ? this.handleOpenMenu(event, params.row.id)
                            : null;
                    }}>
                    <MoreHorizIcon />
                </IconButton>
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        }
    ];
    public render() {
        const { listNhanVien } = NhanVienStore;
        return (
            <Box className="list-nhan-vien" paddingTop={2}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto" display="flex" alignItems="center" gap="10px">
                        <Typography variant="h1" fontSize="16px" fontWeight="700" color="#333233">
                            Quản lý nhân viên
                        </Typography>
                        <Box className="form-search">
                            <TextField
                                sx={{
                                    backgroundColor: '#fff',
                                    borderColor: '#CDC9CD',
                                    height: '40px',
                                    '& .MuiInputBase-root': {
                                        pl: '0'
                                    }
                                }}
                                onChange={(e: any) => {
                                    this.setState({ filter: e.target.value });
                                }}
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        this.getListNhanVien();
                                    }
                                }}
                                size="small"
                                className="search-field"
                                variant="outlined"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton
                                            type="button"
                                            onClick={() => {
                                                this.getListNhanVien();
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
                            variant="outlined"
                            size="small"
                            hidden={!abpCustom.isGrandPermission('Pages.NhanSu.Import')}
                            startIcon={<img src={DownloadIcon} />}
                            sx={{
                                backgroundColor: '#fff!important',
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                height: '40px',
                                padding: '10px 16px',
                                borderRadius: '4px!important'
                            }}
                            onClick={this.onImportShow}
                            className="btn-outline-hover">
                            Nhập
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            hidden={!abpCustom.isGrandPermission('Pages.NhanSu.Export')}
                            startIcon={<img src={UploadIcon} />}
                            sx={{
                                backgroundColor: '#fff!important',
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                padding: '10px 16px',
                                height: '40px',
                                borderRadius: '4px!important'
                            }}
                            onClick={this.exportToExcel}
                            className="btn-outline-hover">
                            Xuất
                        </Button>
                        <ButtonGroup
                            variant="contained"
                            sx={{ gap: '8px', height: '40px', boxShadow: 'unset!important' }}>
                            <Button
                                size="small"
                                hidden={!abpCustom.isGrandPermission('Pages.NhanSu.Create')}
                                onClick={() => {
                                    this.createOrUpdateModalOpen('');
                                }}
                                variant="contained"
                                startIcon={<img src={AddIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    minWidth: '173px',
                                    fontSize: '14px',
                                    borderRadius: '4px!important',
                                    backgroundColor: 'var(--color-main)!important'
                                }}
                                className="btn-container-hover">
                                Thêm nhân viên
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>

                <Box paddingTop="16px" bgcolor="#fff">
                    <DataGrid
                        className="data-grid-row"
                        disableRowSelectionOnClick
                        rowHeight={46}
                        rows={listNhanVien === undefined ? [] : listNhanVien.items}
                        columns={this.columns}
                        checkboxSelection
                        hideFooter
                        sx={{
                            '& .MuiDataGrid-columnHeader': {
                                background: '#EEF0F4'
                            }
                        }}
                        localeText={TextTranslate}
                        sortingOrder={['desc', 'asc']}
                        sortModel={[
                            {
                                field: this.state.sortBy,
                                sort: this.state.sortType == 'desc' ? 'desc' : 'asc'
                            }
                        ]}
                        onSortModelChange={(newSortModel) => {
                            if (newSortModel.length > 0) {
                                this.onSort(
                                    newSortModel[0].sort?.toString() ?? 'creationTime',
                                    newSortModel[0].field ?? 'desc'
                                );
                            }
                        }}
                    />
                    <ActionMenuTable
                        selectedRowId={this.state.selectedRowId}
                        anchorEl={this.state.anchorEl}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleView}
                        permissionView=""
                        handleEdit={this.handleEdit}
                        permissionEdit="Pages.NhanSu.Edit"
                        handleDelete={this.handleDelete}
                        permissionDelete="Pages.NhanSu.Delete"
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
                    onCancel={this.handleDelete}></ConfirmDelete>
                <ImportExcel
                    tieude={'Nhập file nhân viên'}
                    isOpen={this.state.importShow}
                    onClose={this.onImportShow}
                    downloadImportTemplate={this.downloadImportTemplate}
                    importFile={this.handleImportData}
                />
                <CreateOrEditNhanVienDialog
                    visible={this.state.modalVisible}
                    onCancel={() => {
                        this.setState({ modalVisible: false });
                    }}
                    onOk={this.handleSubmit}
                    title={
                        this.state.idNhanSu === '' ||
                        this.state.idNhanSu == undefined ||
                        this.state.idNhanSu === AppConsts.guidEmpty
                            ? 'Thêm mới nhân viên'
                            : 'Cập nhật thông tin nhân viên'
                    }
                    formRef={nhanVienStore.createEditNhanVien}></CreateOrEditNhanVienDialog>
            </Box>
        );
    }
}

export default observer(EmployeeScreen);
