import {
    Box,
    Button,
    Grid,
    IconButton,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import { observer } from 'mobx-react';
import { Component, ReactNode } from 'react';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import caLamViecStore from '../../../stores/caLamViecStore';
import { TextTranslate } from '../../../components/TableLanguage';
import AddIcon from '../../../images/add.svg';
import SearchIcon from '../../../images/search-normal.svg';
import DownloadIcon from '../../../images/download.svg';
import UploadIcon from '../../../images/upload.svg';
import { ReactComponent as DateIcon } from '../../../images/calendar-5.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import CreateOrEditCaLamViecDialog from './components/create-or-edit-ca-lam-viec-modal';
import AppConsts from '../../../lib/appconst';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import ActionMenuTable from '../../../components/Menu/ActionMenuTable';
import { enqueueSnackbar } from 'notistack';
import caLamViecService from '../../../services/nhan-vien/ca_lam_viec/caLamViecService';
import { FileUpload } from '../../../services/dto/FileUpload';
import fileDowloadService from '../../../services/file-dowload.service';
import uploadFileService from '../../../services/uploadFileService';
import ImportExcel from '../../../components/ImportComponent';
import abpCustom from '../../../components/abp-custom';
import { format, compareAsc } from 'date-fns';
class CaLamViecScreen extends Component {
    state = {
        filter: '',
        skipCount: 1,
        maxResultCount: 10,
        sortBy: '',
        sortType: 'desc',
        isShowModal: false,
        importShow: false,
        anchorEl: null,
        selectedRowId: null,
        totalCount: 0,
        isShowConfirmDelete: false,
        totalPage: 0
    };
    componentDidMount(): void {
        this.getData();
    }
    getData = async () => {
        await caLamViecStore.getAll({
            keyword: this.state.filter,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount,
            sortBy: this.state.sortBy,
            sortType: this.state.sortType
        });
        this.setState({
            totalPage: Math.ceil(caLamViecStore.caLamViecs.totalCount / this.state.maxResultCount),
            totalCount: caLamViecStore.caLamViecs.totalCount
        });
    };
    Modal = () => {
        this.setState({
            isShowModal: !this.state.isShowModal
        });
        // this.getData();
        // this.getListHoliday();
    };
    createOrUpdateModalOpen = async (id: string) => {
        if (id === '') {
            await caLamViecStore.createCaLamViecDto();
        } else {
            await caLamViecStore.getForEdit(id);
        }
        this.Modal();
    };
    handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
        await this.setState({
            skipCount: value
        });
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            skipCount: 1
        });
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: null });
        this.getData();
    };

    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };
    delete = async (id: string) => {
        const deleteResult = await caLamViecService.delete(id);
        deleteResult != null
            ? enqueueSnackbar('Xóa bản ghi thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
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
    onSort = async (sortType: string, sortBy: string) => {
        //const type = sortType === 'desc' ? 'asc' : 'desc';
        await this.setState({
            sortBy: sortBy,
            sortType: sortType
        });
        this.getData();
    };
    exportToExcel = async () => {
        const result = await caLamViecService.exportToExcel({
            keyword: this.state.filter,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount,
            sortBy: this.state.sortBy,
            sortType: this.state.sortType
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
        const result = await caLamViecService.importExcel(input);
        enqueueSnackbar(result.message, {
            variant: result.status == 'success' ? 'success' : result.status,
            autoHideDuration: 3000
        });
    };
    downloadImportTemplate = async () => {
        const result = await uploadFileService.downloadImportTemplate(
            'CaLamViec_ImportTemplate.xlsx'
        );
        fileDowloadService.downloadExportFile(result);
    };
    render(): ReactNode {
        const columns: GridColDef[] = [
            {
                field: 'maCa',
                headerName: 'Mã ca',
                flex: 1,
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
                ),
                renderCell: (params) => (
                    <Box
                        sx={{
                            overflow: 'hidden',
                            width: '100%',
                            textOverflow: 'ellipsis',
                            fontSize: '13px',
                            fontWeight: '400',
                            fontFamily: 'Roboto',
                            color: '#3D475C',
                            textAlign: 'left'
                        }}
                        title={params.value}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'tenCa',
                headerName: 'Tên ca',
                // width: 200,
                flex: 1,
                renderCell: (params) => (
                    <Box style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography
                            fontSize="13px"
                            fontWeight="400"
                            fontFamily={'Roboto'}
                            color="#3D475C"
                            lineHeight="16px"
                            textAlign="left"
                            width="100%"
                            title={params.value}>
                            {params.value}
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
                field: 'gioVao',
                headerName: 'Giờ bắt đầu ca',
                // width: 200,
                flex: 1,
                renderCell: (params) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'start'
                        }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="13px"
                            fontWeight="400"
                            fontFamily={'Roboto'}
                            color="#3D475C"
                            lineHeight="16px"
                            title={params.value}>
                            {format(new Date(params.value), 'HH:mm')}
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
                field: 'gioRa',
                headerName: 'Giờ hết ca',
                // width: 150,
                flex: 1,
                renderCell: (params) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            alignContent: 'center',
                            justifyContent: 'start',
                            width: '100%'
                        }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="13px"
                            fontWeight="400"
                            fontFamily={'Roboto'}
                            color="#3D475C"
                            lineHeight="16px"
                            title={params.value}>
                            {format(new Date(params.value), 'HH:mm')}
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
                field: 'tongGioCong',
                headerName: 'Tổng thời gian',
                // width: 150,
                flex: 1,
                renderCell: (params) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                            width: '100%'
                        }}>
                        <Typography
                            fontSize="13px"
                            fontWeight="400"
                            fontFamily={'Roboto'}
                            color="#3D475C"
                            lineHeight="16px">
                            {params.value} giờ
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
                    <Box sx={{ display: 'none' }}>{params.colDef.headerName}</Box>
                )
            }
        ];
        return (
            <Box paddingTop="16px" className="thoi-gian-nghi-page">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto" display="flex" gap="10px" alignItems="center">
                        <Typography color="#333233" variant="h1" fontSize="16px" fontWeight="700">
                            Ca làm việc
                        </Typography>
                        <Box className="form-search">
                            <TextField
                                size="small"
                                sx={{
                                    backgroundColor: '#fff',
                                    borderColor: '#CDC9CD!important'
                                }}
                                onChange={(e) => {
                                    this.setState({ filter: e.target.value });
                                }}
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        this.getData();
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
                        <Button
                            hidden={!abpCustom.isGrandPermission('Pages.NhanSu_CaLamViec.Import')}
                            size="small"
                            onClick={this.onImportShow}
                            variant="outlined"
                            startIcon={<img src={DownloadIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                height: '40px',
                                backgroundColor: '#fff!important',
                                borderColor: '#E6E1E6!important'
                            }}
                            className="btn-outline-hover">
                            Nhập
                        </Button>
                        <Button
                            hidden={!abpCustom.isGrandPermission('Pages.NhanSu_CaLamViec.Export')}
                            size="small"
                            onClick={this.exportToExcel}
                            variant="outlined"
                            startIcon={<img src={UploadIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                backgroundColor: '#fff!important',
                                padding: '10px 16px',
                                borderColor: '#E6E1E6!important',
                                height: '40px'
                            }}
                            className="btn-outline-hover">
                            Xuất
                        </Button>
                        <Button
                            hidden={!abpCustom.isGrandPermission('Pages.NhanSu_CaLamViec.Create')}
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
                                fontSize: '14px'
                            }}
                            className="btn-container-hover">
                            Thêm ca làm việc
                        </Button>
                    </Grid>
                </Grid>
                <Box paddingTop="16px" bgcolor="#fff">
                    <DataGrid
                        disableRowSelectionOnClick
                        autoHeight
                        rows={
                            caLamViecStore.caLamViecs === undefined
                                ? []
                                : caLamViecStore.caLamViecs.items
                        }
                        columns={columns}
                        checkboxSelection
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
                        sx={{
                            '& .MuiDataGrid-columnHeader': {
                                background: '#EEF0F4'
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
                        permissionView=""
                        handleEdit={this.handleEdit}
                        permissionEdit="Pages.NhanSu_CaLamViec.Edit"
                        handleDelete={this.showConfirmDelete}
                        permissionDelete="Pages.NhanSu_CaLamViec.Edit"
                    />
                    <CustomTablePagination
                        currentPage={this.state.skipCount}
                        rowPerPage={this.state.maxResultCount}
                        totalRecord={this.state.totalCount}
                        totalPage={this.state.totalPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                </Box>
                <ImportExcel
                    isOpen={this.state.importShow}
                    onClose={this.onImportShow}
                    downloadImportTemplate={this.downloadImportTemplate}
                    importFile={this.handleImportData}
                />
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.showConfirmDelete}></ConfirmDelete>
                <CreateOrEditCaLamViecDialog
                    visible={this.state.isShowModal}
                    title={
                        caLamViecStore.createOrEditDto.id == AppConsts.guidEmpty ||
                        caLamViecStore.createOrEditDto.id == ''
                            ? 'Thêm mới'
                            : 'Cập nhật'
                    }
                    onCancel={() => {
                        this.Modal();
                    }}
                    createOrEditDto={caLamViecStore.createOrEditDto}></CreateOrEditCaLamViecDialog>
            </Box>
        );
    }
}
export default observer(CaLamViecScreen);
