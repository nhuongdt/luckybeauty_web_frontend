import { observer } from 'mobx-react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Component, ReactNode } from 'react';
import { CreateOrEditChietKhauHoaDonDto } from '../../../../../services/hoa_hong/chiet_khau_hoa_don/Dto/CreateOrEditChietKhauHoaDonDto';
import chietKhauHoaDonStore from '../../../../../stores/chietKhauHoaDonStore';
import AppConsts from '../../../../../lib/appconst';
import SearchIcon from '../../../../../images/search-normal.svg';
import { TextTranslate } from '../../../../../components/TableLanguage';
import { ReactComponent as IconSorting } from '../.././../../../images/column-sorting.svg';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, IconButton, TextField, Grid, SelectChangeEvent } from '@mui/material';
import CreateOrEditChietKhauHoaDonModal from './components/create-or-edit-chiet-khau-hd';
import Cookies from 'js-cookie';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CustomTablePagination from '../../../../../components/Pagination/CustomTablePagination';
import suggestStore from '../../../../../stores/suggestStore';
import ActionMenuTable from '../../../../../components/Menu/ActionMenuTable';
import ConfirmDelete from '../../../../../components/AlertDialog/ConfirmDelete';
import abpCustom from '../../../../../components/abp-custom';
class ChietKhauHoaDonScreen extends Component {
    state = {
        idChietKhauHD: AppConsts.guidEmpty,
        visited: false,
        isShowConfirmDelete: false,
        keyword: '',
        sortBy: '',
        sortType: 'desc',
        skipCount: 1,
        maxResultCount: 10,
        anchorEl: null,
        totalCount: 0,
        totalPage: 0,
        createOrEditModel: {
            id: AppConsts.guidEmpty,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? AppConsts.guidEmpty,
            chungTuApDung: '',
            giaTriChietKhau: 0,
            loaiChietKhau: 0,
            idNhanViens: []
        } as CreateOrEditChietKhauHoaDonDto
    };
    componentDidMount(): void {
        this.getAll();
    }
    getAll = async () => {
        await chietKhauHoaDonStore.getAll({
            keyword: this.state.keyword,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount,
            sortBy: this.state.sortBy,
            sortType: this.state.sortType
        });
        await suggestStore.getSuggestChucVu();
        await suggestStore.getSuggestNhanVien();
        await chietKhauHoaDonStore.createModel();
    };
    Modal = () => {
        this.setState({ visited: !this.state.visited, idChietKhauHD: '' });
    };
    createOrEditShowModal = async (id: string) => {
        if (id === '') {
            const newModel = await chietKhauHoaDonStore.createModel();
            this.setState({ createOrEditModel: newModel });
        } else {
            const model = await chietKhauHoaDonStore.getForEdit(id);
            this.setState({ createOrEditModel: model });
        }
        this.setState({ idChietKhauHD: id });
        this.Modal();
    };
    handleCreate = async () => {
        await this.getAll();
        await chietKhauHoaDonStore.createModel();
        this.Modal();
    };
    delete = async (id: string) => {
        await chietKhauHoaDonStore.delete(id);
        this.setState({ idChietKhauHD: '' });

        this.getAll();
    };
    onShowDeleteConfirm = () => {
        this.setState({ isShowConfirmDelete: !this.state.isShowConfirmDelete });
    };
    onOkDelete = async () => {
        this.delete(this.state.idChietKhauHD);
        this.onShowDeleteConfirm();
    };
    onCancelDelete = () => {
        this.setState({ isShowConfirmDelete: false });
    };
    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            skipCount: value
        });
        this.getAll();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            currentPage: 1,
            skipCount: 1
        });
        this.getAll();
    };
    onSort = async (sortType: string, sortBy: string) => {
        const type = sortType === 'desc' ? 'asc' : 'desc';
        await this.setState({
            sortType: type,
            sortBy: sortBy
        });
        this.getAll();
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, idChietKhauHD: rowId });
    };
    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, idChietKhauHD: '' });
        //await this.getData();
    };
    handleEdit = () => {
        // Handle Edit action
        this.createOrEditShowModal(this.state.idChietKhauHD ?? '');
        this.handleCloseMenu();
    };
    handleDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete,
            anchorEl: null
        });
    };
    render(): ReactNode {
        const { chietKhauHoaDons } = chietKhauHoaDonStore;
        const columns: GridColDef[] = [
            {
                field: 'giaTriChietKhau',
                headerName: 'Hoa hồng',
                minWidth: 112,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
                )
            },
            {
                field: 'chungTuApDung',
                headerName: 'Chứng từ áp dụng',
                minWidth: 120,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
                )
            },
            {
                field: 'ghiChu',
                headerName: 'Ghi chú',
                minWidth: 150,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
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
                            onClick={(event: any) => {
                                this.handleOpenMenu(event, params.row.id);
                            }}>
                            <MoreHorizIcon />
                        </IconButton>
                    </Box>
                ),
                renderHeader: (params) => (
                    <Box sx={{ display: 'none' }}>{params.colDef.headerName}</Box>
                )
            }
        ];
        return (
            <Box>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ background: '#EEF0F4', padding: '8px' }}>
                    <Grid item>
                        <Box className="form-search">
                            <TextField
                                sx={{
                                    backgroundColor: '#FFFAFF',
                                    borderColor: '#CDC9CD',
                                    '& .MuiInputBase-root': {
                                        height: '32px',
                                        fontSize: '14px'
                                    }
                                }}
                                onChange={(e) => {
                                    this.setState({ keyword: e.target.value });
                                }}
                                size="small"
                                className="search-field"
                                variant="outlined"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton type="button" onClick={this.getAll}>
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={() => {
                                this.createOrEditShowModal('');
                            }}
                            sx={{ height: 32, color: '#FFFAFF' }}
                            startIcon={<AddOutlinedIcon sx={{ color: '#FFFAFF' }} />}
                            hidden={!abpCustom.isGrandPermission('Pages.ChietKhauHoaDon.Create')}
                            className="btn-container-hover">
                            Thêm mới
                        </Button>
                    </Grid>
                </Grid>
                <Box paddingTop={'8px'}>
                    <DataGrid
                        disableRowSelectionOnClick
                        rowHeight={46}
                        columns={columns}
                        rows={chietKhauHoaDons === undefined ? [] : chietKhauHoaDons.items}
                        localeText={TextTranslate}
                        checkboxSelection={false}
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
                                background: '#FFF'
                            }
                        }}
                        hideFooter
                    />
                    <ActionMenuTable
                        selectedRowId={this.state.idChietKhauHD}
                        anchorEl={this.state.anchorEl}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleEdit}
                        permissionView=""
                        handleEdit={this.handleEdit}
                        permissionEdit="Pages.ChietKhauHoaDon.Edit"
                        handleDelete={this.handleDelete}
                        permissionDelete="PPages.ChietKhauHoaDon.Delete"
                    />
                    <ConfirmDelete
                        isShow={this.state.isShowConfirmDelete}
                        onOk={this.onOkDelete}
                        onCancel={this.onShowDeleteConfirm}></ConfirmDelete>
                    <CustomTablePagination
                        currentPage={this.state.skipCount}
                        rowPerPage={this.state.maxResultCount}
                        totalRecord={
                            chietKhauHoaDons === undefined ? 0 : chietKhauHoaDons.totalCount
                        }
                        totalPage={
                            chietKhauHoaDons === undefined
                                ? 0
                                : Math.ceil(chietKhauHoaDons.totalCount / this.state.maxResultCount)
                        }
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                    <CreateOrEditChietKhauHoaDonModal
                        formRef={this.state.createOrEditModel}
                        onClose={this.Modal}
                        onSave={this.handleCreate}
                        visited={this.state.visited}
                        title={
                            this.state.idChietKhauHD === '' ||
                            this.state.idChietKhauHD === AppConsts.guidEmpty
                                ? 'Thêm mới hoa hồng theo hóa đơn'
                                : 'Cập nhật hoa hồng theo hóa đơn'
                        }
                    />
                </Box>
            </Box>
        );
    }
}
export default observer(ChietKhauHoaDonScreen);
