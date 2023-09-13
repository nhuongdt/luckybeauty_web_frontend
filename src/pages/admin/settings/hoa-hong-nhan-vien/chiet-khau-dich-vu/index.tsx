import {
    Button,
    IconButton,
    Grid,
    Box,
    TextField,
    Typography,
    SelectChangeEvent,
    Autocomplete,
    InputAdornment
} from '@mui/material';
import { TextTranslate } from '../../../../../components/TableLanguage';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DownloadIcon from '../../../../../images/download.svg';
import UploadIcon from '../../../../../images/upload.svg';
import AddIcon from '../../../../../images/add.svg';
import SearchIcon from '../../../../../images/search-normal.svg';
import { ReactComponent as SearchIconInput } from '../../../../../images/search-normal.svg';
import { Component, ReactNode } from 'react';
import chietKhauDichVuStore from '../../../../../stores/chietKhauDichVuStore';
import SuggestService from '../../../../../services/suggests/SuggestService';
import { SuggestNhanSuDto } from '../../../../../services/suggests/dto/SuggestNhanSuDto';
import { observer } from 'mobx-react';
import AppConsts from '../../../../../lib/appconst';
import CreateOrEditChietKhauDichVuModal from './components/create-or-edit-hoa-hong';
import { CreateOrEditChietKhauDichVuDto } from '../../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/CreateOrEditChietKhauDichVuDto';
import { SuggestDonViQuiDoiDto } from '../../../../../services/suggests/dto/SuggestDonViQuiDoi';
import Cookies from 'js-cookie';
import CustomTablePagination from '../../../../../components/Pagination/CustomTablePagination';
import suggestStore from '../../../../../stores/suggestStore';
import ActionMenuTable from '../../../../../components/Menu/ActionMenuTable';
import ConfirmDelete from '../../../../../components/AlertDialog/ConfirmDelete';
import dichVuNhanVienService from '../../../../../services/dichvu_nhanvien/dichVuNhanVienService';
import chietKhauDichVuService from '../../../../../services/hoa_hong/chiet_khau_dich_vu/chietKhauDichVuService';
import { enqueueSnackbar } from 'notistack';
import abpCustom from '../../../../../components/abp-custom';

class ChietKhauDichVuScreen extends Component {
    state = {
        visited: false,
        idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
        idNhanVien: AppConsts.guidEmpty,
        keyword: '',
        sortBy: '',
        sortType: 'desc',
        skipCount: 1,
        isShowConfirmDelete: false,
        maxResultCount: 10,
        totalPage: 0,
        totalCount: 0,
        selectedRowId: null,
        anchorEl: null,
        createOrEditDto: { laPhanTram: false } as CreateOrEditChietKhauDichVuDto,
        activeButton: '',
        focusField: '',
        showButton: false
    };
    componentDidMount(): void {
        this.InitData();
    }
    async InitData() {
        await suggestStore.getSuggestNhanVien();
        await suggestStore.getSuggestDichVu();
        suggestStore.suggestNhanVien?.length > 0
            ? await this.getDataAccordingByNhanVien(suggestStore.suggestNhanVien[0].id)
            : await this.getDataAccordingByNhanVien(this.state.idNhanVien);
    }
    getDataAccordingByNhanVien = async (idNhanVien: any) => {
        await chietKhauDichVuStore.getAccordingByNhanVien(
            {
                keyword: this.state.keyword,
                maxResultCount: this.state.maxResultCount,
                skipCount: this.state.skipCount,
                sortBy: this.state.sortBy,
                sortType: this.state.sortType
            },
            idNhanVien ?? AppConsts.guidEmpty
        );
    };
    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            skipCount: value
        });
        this.InitData();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            skipCount: 1
        });
        this.InitData();
    };
    handleSubmit = async () => {
        await this.getDataAccordingByNhanVien(this.state.idNhanVien);
        this.onModal();
    };
    async createOrUpdateModalOpen(id: string) {
        if (id === '') {
            await chietKhauDichVuStore.createModel();
        } else {
            await chietKhauDichVuStore.getForEdit(id);
        }
        this.setState({ idNhanSu: id });
        this.onModal();
    }
    onModal = () => {
        this.setState({ visited: !this.state.visited });
    };

    onSort = async (sortType: string, sortBy: string) => {
        //const type = sortType === 'desc' ? 'asc' : 'desc';
        await this.setState({
            sortType: sortType,
            sortBy: sortBy
        });
        this.getDataAccordingByNhanVien(this.state.idNhanVien);
    };
    handleButtonClick = (rowId: number, buttonType: string) => {
        this.setState((prevState) => ({
            ...prevState,
            activeButton: {
                ...prevState,
                [rowId]: buttonType
            }
        }));
    };
    onFocus = (RowId: number) => {
        this.setState({
            focusField: RowId
        });
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };
    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: null });
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
            anchorEl: null
        });
    };
    onShowDeleteConfirm = () => {
        this.setState({ isShowConfirmDelete: !this.state.isShowConfirmDelete });
    };
    onOkDelete = async () => {
        const result = await chietKhauDichVuService.Delete(this.state.selectedRowId ?? '');
        enqueueSnackbar(result.message, {
            variant: result.status,
            autoHideDuration: 3000
        });
        this.setState({ selectedRowId: '' });
        await this.getDataAccordingByNhanVien(this.state.idNhanVien);
        await this.onShowDeleteConfirm();
    };
    render(): ReactNode {
        const { listChietKhauDichVu } = chietKhauDichVuStore;

        const columns: GridColDef[] = [
            {
                field: 'tenDichVu',
                headerName: 'Tên dịch vụ ',
                minWidth: 140,
                flex: 1,
                renderCell: (params: any) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '13px',
                            width: '100%'
                        }}
                        title={params.value}>
                        <Typography
                            fontSize="13px"
                            fontFamily={'Roboto'}
                            fontWeight={400}
                            textAlign={'left'}
                            sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                width: '100%'
                            }}>
                            {params.value}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
                )
            },
            {
                field: 'tenNhomDichVu',
                headerName: 'Nhóm dịch vụ',
                minWidth: 114,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        title={params.value}
                        sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: '100%',
                            fontSize: '13px',
                            fontWeight: 400,
                            fontFamily: 'Roboto',
                            textAlign: 'left'
                        }}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'hoaHongThucHien',
                headerName: 'Hoa hồng thực hiện',
                minWidth: 150,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
                ),
                renderCell: (params: any) => (
                    <TextField
                        type="text"
                        defaultValue="0"
                        value={
                            params.value === 0
                                ? '0'
                                : params.row.laPhanTram === true
                                ? new Intl.NumberFormat('vi-VN').format(params.value) + ' %'
                                : new Intl.NumberFormat('vi-VN').format(params.value) + ' VNĐ'
                        }
                        sx={{
                            height: '85%',
                            '&>div': {
                                height: '100%'
                            },
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                                {
                                    appearance: 'none'
                                },
                            '& .MuiOutlinedInput-root': {
                                paddingRight: '8px'
                            },
                            fontSize: '13px',
                            fontWeight: '400',
                            fontFamily: 'Roboto'
                        }}
                    />
                )
            },
            {
                field: 'hoaHongYeuCauThucHien',
                headerName: 'Hoa hồng theo yêu cầu',
                minWidth: 170,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
                ),
                renderCell: (params: any) => (
                    <TextField
                        type="text"
                        defaultValue="0"
                        value={
                            params.value === 0
                                ? '0'
                                : params.row.laPhanTram === true
                                ? new Intl.NumberFormat('vi-VN').format(params.value) + ' %'
                                : new Intl.NumberFormat('vi-VN').format(params.value) + ' VNĐ'
                        }
                        sx={{
                            height: '85%',
                            fontSize: '13px',
                            fontWeight: '400',
                            fontFamily: 'Roboto',
                            '&>div': {
                                height: '100%'
                            },
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                                {
                                    appearance: 'none'
                                },
                            '& .MuiOutlinedInput-root': {
                                paddingRight: '8px'
                            }
                        }}
                    />
                )
            },
            {
                field: 'hoaHongTuVan',
                sortable: false,
                headerName: 'Hoa hồng tư vấn',
                minWidth: 130,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
                ),
                renderCell: (params: any) => (
                    <TextField
                        type="text"
                        defaultValue="0"
                        value={
                            params.value === 0
                                ? '0'
                                : params.row.laPhanTram === true
                                ? new Intl.NumberFormat('vi-VN').format(params.value) + ' %'
                                : new Intl.NumberFormat('vi-VN').format(params.value) + ' VNĐ'
                        }
                        sx={{
                            fontSize: '13px',
                            fontWeight: '400',
                            fontFamily: 'Roboto',
                            height: '85%',
                            '&>div': {
                                height: '100%'
                            },
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                                {
                                    appearance: 'none'
                                },
                            '& .MuiOutlinedInput-root': {
                                paddingRight: '8px'
                            }
                        }}
                    />
                )
            },
            {
                field: 'giaDichVu',
                headerName: 'Giá bán',
                minWidth: 85,
                flex: 0.6,
                renderHeader: (params: any) => (
                    <Box
                        sx={{
                            fontWeight: '700',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: '100%'
                        }}>
                        {params.colDef.headerName}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        title={params.value}
                        sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: '100%',
                            fontSize: '13px',
                            fontWeight: '400',
                            fontFamily: 'Roboto'
                        }}>
                        {new Intl.NumberFormat('vi-VN').format(params.value)}
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
            <div>
                <Grid
                    container
                    sx={{
                        height: '48px',
                        background: '#EEF0F4',
                        alignItems: 'center',
                        paddingX: '8px'
                    }}>
                    <Grid item xs={3}>
                        <Autocomplete
                            options={suggestStore.suggestNhanVien}
                            getOptionLabel={(option) => `${option.tenNhanVien}`}
                            value={
                                suggestStore.suggestNhanVien?.find(
                                    (x) => x.id === this.state.idNhanVien
                                ) ||
                                (suggestStore.suggestNhanVien?.length > 0
                                    ? suggestStore.suggestNhanVien[0]
                                    : null)
                            }
                            size="small"
                            sx={{ width: '75%' }}
                            fullWidth
                            disablePortal
                            onChange={async (event, value) => {
                                await this.setState({ idNhanVien: value?.id });
                                await this.getDataAccordingByNhanVien(value?.id);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    sx={{ bgcolor: '#fff' }}
                                    {...params}
                                    placeholder="Tìm tên"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                {params.InputProps.startAdornment}
                                                <InputAdornment position="start">
                                                    <SearchIconInput />
                                                </InputAdornment>
                                            </>
                                        )
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={9}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            justifyContent: 'end'
                        }}>
                        <Box>
                            <TextField
                                type="text"
                                size="small"
                                sx={{
                                    '& input': { bgcolor: '#fff' },
                                    '& .MuiInputBase-root': { pl: '0', bgcolor: '#fff' }
                                }}
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton type="button" sx={{ bgcolor: '#fff' }}>
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>
                        <Box
                            display="flex"
                            gap="8px"
                            justifyContent="end"
                            sx={{
                                '& button:not(.btn-container-hover)': {
                                    color: '#666466!important',
                                    bgcolor: '#fff!important',
                                    boxShadow: 'none!important',
                                    borderColor: '#ede4ea',
                                    textTransform: 'unset!important',
                                    fontWeight: '400'
                                }
                            }}>
                            <Button
                                startIcon={<img src={AddIcon} />}
                                variant="contained"
                                sx={{ bgcolor: '#7C3367' }}
                                onClick={() => {
                                    this.createOrUpdateModalOpen('');
                                }}
                                hidden={
                                    !abpCustom.isGrandPermission('Pages.ChietKhauDichVu.Create')
                                }
                                className="btn-container-hover">
                                Thêm mới
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Box marginTop="8px">
                    <DataGrid
                        disableRowSelectionOnClick
                        rowHeight={46}
                        columns={columns}
                        rows={listChietKhauDichVu === undefined ? [] : listChietKhauDichVu.items}
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
                        localeText={TextTranslate}
                        hideFooter
                    />
                    <CustomTablePagination
                        currentPage={this.state.skipCount}
                        rowPerPage={this.state.maxResultCount}
                        totalRecord={
                            listChietKhauDichVu === undefined ? 0 : listChietKhauDichVu.totalCount
                        }
                        totalPage={
                            listChietKhauDichVu === undefined
                                ? 0
                                : Math.ceil(
                                      listChietKhauDichVu.totalCount / this.state.maxResultCount
                                  )
                        }
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                    <ActionMenuTable
                        selectedRowId={this.state.selectedRowId}
                        anchorEl={this.state.anchorEl}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleEdit}
                        permissionView="Pages.ChietKhauDichVu.Edit"
                        handleEdit={this.handleEdit}
                        permissionEdit="Pages.ChietKhauDichVu.Edit"
                        handleDelete={this.handleDelete}
                        permissionDelete="Pages.ChietKhauDichVu.Delete"
                    />
                    <ConfirmDelete
                        isShow={this.state.isShowConfirmDelete}
                        onOk={this.onOkDelete}
                        onCancel={this.onShowDeleteConfirm}></ConfirmDelete>
                </Box>
                <CreateOrEditChietKhauDichVuModal
                    formRef={this.state.createOrEditDto}
                    onClose={this.onModal}
                    onSave={this.handleSubmit}
                    idNhanVien={this.state.idNhanVien}
                    visited={this.state.visited}
                    title={
                        this.state.selectedRowId === '' || this.state.selectedRowId == null
                            ? 'Thêm mới chiết khấu dịch vụ'
                            : 'Cập nhật chiết khấu dịch vụ'
                    }
                />
            </div>
        );
    }
}
export default observer(ChietKhauDichVuScreen);
