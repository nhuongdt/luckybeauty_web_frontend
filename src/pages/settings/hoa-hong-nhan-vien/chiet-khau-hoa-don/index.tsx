import { observer } from 'mobx-react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Component, ReactNode } from 'react';
import { CreateOrEditChietKhauHoaDonDto } from '../../../../services/hoa_hong/chiet_khau_hoa_don/Dto/CreateOrEditChietKhauHoaDonDto';
import chietKhauHoaDonStore from '../../../../stores/chietKhauHoaDonStore';
import AppConsts from '../../../../lib/appconst';
import SearchIcon from '../../../../images/search-normal.svg';
import { TextTranslate } from '../../../../components/TableLanguage';
import { ReactComponent as IconSorting } from '.././../../../images/column-sorting.svg';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, IconButton, TextField, Grid } from '@mui/material';
import { BsThreeDotsVertical } from 'react-icons/bs';
import CreateOrEditChietKhauHoaDonModal from './components/create-or-edit-chiet-khau-hd';
import Cookies from 'js-cookie';
import { minWidth } from '@mui/system';
import CustomTablePagination from '../../../../components/Pagination/CustomTablePagination';
class ChietKhauHoaDonScreen extends Component {
    state = {
        idChietKhauHD: AppConsts.guidEmpty,
        visited: false,
        isShowConfirmDelete: false,
        keyword: '',
        skipCount: 1,
        maxResultCount: 10,
        totalCount: 0,
        totalPage: 0,
        createOrEditModel: {
            id: AppConsts.guidEmpty,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? AppConsts.guidEmpty,
            chungTuApDung: [],
            giaTriChietKhau: 0,
            loaiChietKhau: 0
        } as CreateOrEditChietKhauHoaDonDto
    };
    componentDidMount(): void {
        this.getAll();
    }
    getAll = async () => {
        await chietKhauHoaDonStore.getAll({
            keyword: this.state.keyword,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount
        });
    };
    Modal = () => {
        this.setState({ visited: !this.state.visited });
    };
    createOrEditShowModal = (id: string) => {
        if (id === '') {
            const newModel = chietKhauHoaDonStore.createModel();
            this.setState({ createOrEditModel: newModel });
        } else {
            const model = chietKhauHoaDonStore.getForEdit(id);
            this.setState({ createOrEditModel: model });
        }
        this.setState({ idChietKhauHD: id });
        this.Modal();
    };
    handleCreate = async () => {
        await this.getAll();
        this.Modal();
    };
    delete = async (id: string) => {
        await chietKhauHoaDonStore.delete(id);
    };
    onShowDeleteConfirm = () => {
        this.setState({ isShowConfirmDelete: !this.state.isShowConfirmDelete });
    };
    onOkDelete = async () => {
        this.delete(this.state.idChietKhauHD);
        await this.getAll();
        this.onShowDeleteConfirm();
    };
    onCancelDelete = () => {
        this.setState({ isShowConfirmDelete: false });
    };
    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            skipCount: value
        });
        console.log(value);
        this.getAll();
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
                    <Box>
                        {params.colDef.headerName}
                        <IconSorting />
                    </Box>
                )
            },
            {
                field: 'chungTuApDung',
                headerName: 'Chứng từ áp dụng',
                minWidth: 120,
                flex: 1,
                renderHeader: (params) => (
                    <Box>
                        {params.colDef.headerName}
                        <IconSorting />
                    </Box>
                )
            },
            {
                field: 'ghiChu',
                headerName: 'Ghi chú',
                minWidth: 150,
                flex: 1,
                renderHeader: (params) => (
                    <Box>
                        {params.colDef.headerName}
                        <IconSorting />
                    </Box>
                )
            }
        ];
        return (
            <Box>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ background: '#ede4ea', padding: '8px' }}>
                    <Grid item>
                        <Box className="form-search">
                            <TextField
                                sx={{
                                    backgroundColor: '#FFFAFF',
                                    borderColor: '#CDC9CD',
                                    '& .MuiInputBase-root': {
                                        height: '32px'
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
                            onClick={() => {
                                this.setState({ visited: true });
                            }}
                            sx={{ background: '#7C3367', height: 32, color: '#FFFAFF' }}
                            startIcon={<AddOutlinedIcon sx={{ color: '#FFFAFF' }} />}>
                            Thêm mới
                        </Button>
                    </Grid>
                </Grid>
                <Box>
                    <DataGrid
                        autoHeight
                        columns={columns}
                        rows={chietKhauHoaDons === undefined ? [] : chietKhauHoaDons.items}
                        localeText={TextTranslate}
                        pageSizeOptions={[10, 20]}
                        checkboxSelection={false}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 5, pageSize: 10 }
                            }
                        }}
                        sx={{
                            '& .uiDataGrid-cellContent': {
                                fontSize: '12px'
                            },
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
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
                    />
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
                        handlePageChange={this.handlePageChange}
                    />
                    <CreateOrEditChietKhauHoaDonModal
                        formRef={this.state.createOrEditModel}
                        onClose={this.Modal}
                        onSave={this.handleCreate}
                        visited={this.state.visited}
                        title={this.state.idChietKhauHD === '' ? 'Thêm mới' : 'Cập nhật'}
                    />
                </Box>
            </Box>
        );
    }
}
export default observer(ChietKhauHoaDonScreen);
