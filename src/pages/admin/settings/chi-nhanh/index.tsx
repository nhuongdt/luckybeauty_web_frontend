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
import DownloadIcon from '../../../../images/download.svg';
import UploadIcon from '../../../../images/upload.svg';
import AddIcon from '../../../../images/add.svg';
import SearchIcon from '../../../../images/search-normal.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ReactComponent as IconSorting } from '../../../../images/column-sorting.svg';
import { ReactComponent as DateIcon } from '../../../../images/calendar-5.svg';
import { Component, ReactNode } from 'react';
import { ChiNhanhDto } from '../../../../services/chi_nhanh/Dto/chiNhanhDto';
import chiNhanhService from '../../../../services/chi_nhanh/chiNhanhService';
import CreateOrEditChiNhanhModal from './components/create-or-edit-chi-nhanh';
import { CreateOrEditChiNhanhDto } from '../../../../services/chi_nhanh/Dto/createOrEditChiNhanhDto';
import Cookies from 'js-cookie';
import AppConsts from '../../../../lib/appconst';
import { DataGrid, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { TextTranslate } from '../../../../components/TableLanguage';
import '../../../customer/customerPage.css';
import CustomTablePagination from '../../../../components/Pagination/CustomTablePagination';

class ChiNhanhScreen extends Component {
    state = {
        idChiNhanh: '',
        isShowModal: false,
        currentPage: 1,
        rowPerPage: 10,
        filter: '',
        totalCount: 0,
        totalPage: 0,
        createOrEditChiNhanhDto: {} as CreateOrEditChiNhanhDto,
        listChiNhanh: [] as ChiNhanhDto[]
    };
    async componentDidMount() {
        this.InitData();
    }
    async InitData() {
        const lstChiNhanh = await chiNhanhService.GetAll({
            keyword: this.state.filter,
            maxResultCount: this.state.rowPerPage,
            skipCount: this.state.currentPage
        });
        this.setState({
            listChiNhanh: lstChiNhanh.items,
            totalCount: lstChiNhanh.items.length,
            totalPage: Math.ceil(lstChiNhanh.items.length / this.state.rowPerPage)
        });
    }
    handleSubmit = async () => {
        await this.InitData();
        this.Modal();
    };
    Modal = () => {
        this.setState({ isShowModal: !this.state.isShowModal });
    };
    createOrEditShowModal = async (idChiNhanh: string) => {
        if (idChiNhanh === '') {
            const idCuaHang = Cookies.get('IdCuaHang')?.toString() ?? '';
            this.setState({
                idChiNhanh: '',
                createOrEditChiNhanhDto: {
                    id: AppConsts.guidEmpty,
                    idCongTy: idCuaHang,
                    maChiNhanh: '',
                    tenChiNhanh: '',
                    soDienThoai: '',
                    diaChi: '',
                    maSoThue: '',
                    logo: '',
                    ghiChu: '',
                    ngayHetHan: new Date(),
                    ngayApDung: new Date(),
                    trangThai: 0
                }
            });
        } else {
            const createOrEdit = await chiNhanhService.GetForEdit(idChiNhanh);
            this.setState({
                idChiNhanh: idChiNhanh,
                createOrEditChiNhanhDto: createOrEdit
            });
        }
        this.Modal();
    };
    onCloseModal = () => {
        this.setState({ isShowModal: false });
    };
    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            currentPage: value
        });
        this.InitData();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            rowPerPage: parseInt(event.target.value.toString(), 10),
            currentPage: 1
        });
        this.InitData();
    };

    handleColumnVisibilityChange = () => {
        this.setState({ hiddenColumns: true });
    };

    render(): ReactNode {
        const columns = [
            {
                field: 'id',
                headerName: 'ID',
                minWidth: 50,
                flex: 0.6,

                renderHeader: (params: any) => (
                    <Box>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'tenChiNhanh',
                headerName: 'Tên chi nhánh',
                minWidth: 140,
                flex: 0.8,
                renderCell: (params: any) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            src={params.row.avatar}
                            alt="Avatar"
                            style={{ width: 24, height: 24, marginRight: 8 }}
                        />
                        <Typography
                            fontSize="14px"
                            fontWeight="400"
                            variant="h6"
                            color="#333233"
                            lineHeight="16px"
                            title={params.value}>
                            {params.value}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params: any) => (
                    <Box>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'diaChi',
                headerName: 'Địa chỉ',
                minWidth: 180,
                flex: 1.2,
                renderCell: (params: any) => (
                    <Typography
                        variant="caption"
                        fontSize="14px"
                        title={params.value}
                        sx={{
                            textOverflow: 'ellipsis',
                            width: '100%',
                            overflow: 'hidden'
                        }}>
                        {params.value}
                    </Typography>
                ),
                renderHeader: (params: any) => (
                    <Box>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'soDienThoai',
                headerName: 'Số điện thoại',
                minWidth: 110,
                flex: 0.8,
                renderCell: (params: any) => (
                    <Typography variant="caption" fontSize="14px" title={params.value}>
                        {params.value}
                    </Typography>
                ),
                renderHeader: (params: any) => (
                    <Box>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'ngayApDung',
                headerName: 'Ngày áp dụng',
                minWidth: 130,
                flex: 0.8,
                renderCell: (params: any) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="14px"
                            variant="h6"
                            fontWeight="400"
                            color="#333233"
                            lineHeight="16px">
                            {new Date(params.value).toLocaleDateString('vi-VN')}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params: any) => (
                    <Box>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'ngayHetHan',
                headerName: 'Ngày hết hạn',
                minWidth: 130,
                flex: 0.8,
                renderCell: (params: any) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="14px"
                            variant="h6"
                            fontWeight="400"
                            color="#333233"
                            lineHeight="16px">
                            {new Date(params.value).toLocaleDateString('vi-VN')}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params: any) => (
                    <Box>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'actions',
                headerName: 'Hành động',
                minwidth: 48,
                flex: 0.3,
                disableColumnMenu: true,
                renderCell: (params: any) => (
                    <IconButton
                        aria-label="Actions"
                        aria-controls={`actions-menu-${params.row.id}`}
                        aria-haspopup="true">
                        <MoreHorizIcon />
                    </IconButton>
                ),
                renderHeader: (params: any) => (
                    <Box sx={{ display: 'none' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            }
        ];
        return (
            <Box
                className="customer-page"
                paddingLeft="2.2222222222222223vw"
                paddingRight="2.2222222222222223vw"
                paddingTop="1.5277777777777777vw">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto" display="flex" alignItems="center" gap="12px">
                        <Typography color="#333233" variant="h1" fontSize="16px" fontWeight="700">
                            Quản lý chi nhánh
                        </Typography>
                        <Box className="form-search">
                            <TextField
                                sx={{
                                    backgroundColor: '#FFF',
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
                                        this.InitData();
                                    }
                                }}
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton
                                            type="button"
                                            onClick={() => {
                                                this.InitData();
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
                                className="border-color btn-outline-hover"
                                variant="outlined"
                                startIcon={<img src={DownloadIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    color: '#666466',
                                    bgcolor: '#fff!important'
                                }}>
                                Nhập
                            </Button>
                            <Button
                                className="border-color btn-outline-hover"
                                variant="outlined"
                                startIcon={<img src={UploadIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    color: '#666466',
                                    padding: '10px 16px',
                                    borderColor: '#E6E1E6',
                                    bgcolor: '#fff!important'
                                }}>
                                Xuất
                            </Button>
                            <Button
                                className="bg-main btn-container-hover"
                                onClick={() => {
                                    this.createOrEditShowModal('');
                                }}
                                variant="contained"
                                startIcon={<img src={AddIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    minWidth: '173px'
                                }}>
                                Thêm mới
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
                <div className="mt-2">
                    <DataGrid
                        disableRowSelectionOnClick
                        autoHeight
                        columns={columns}
                        rows={this.state.listChiNhanh}
                        checkboxSelection
                        sx={{
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#F2EBF0'
                            },
                            '& p': {
                                mb: 0
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                bgcolor: '#fff'
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
                        onColumnVisibilityModelChange={this.handleColumnVisibilityChange}
                        columnBuffer={0}
                        hideFooter
                        localeText={TextTranslate}
                    />
                    <CustomTablePagination
                        currentPage={this.state.currentPage}
                        rowPerPage={this.state.rowPerPage}
                        totalRecord={this.state.totalCount}
                        totalPage={this.state.totalPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                    <CreateOrEditChiNhanhModal
                        title={this.state.idChiNhanh == '' ? 'Thêm mới' : 'Cập nhật'}
                        formRef={this.state.createOrEditChiNhanhDto}
                        isShow={this.state.isShowModal}
                        onCLose={this.onCloseModal}
                        onSave={this.handleSubmit}
                    />
                </div>
            </Box>
        );
    }
}
export default ChiNhanhScreen;
