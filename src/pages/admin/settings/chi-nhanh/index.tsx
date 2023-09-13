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
import React, { RefObject } from 'react';
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
import { DataGrid, GridApi } from '@mui/x-data-grid';
import { TextTranslate } from '../../../../components/TableLanguage';
import '../../../customer/customerPage.css';
import CustomTablePagination from '../../../../components/Pagination/CustomTablePagination';
import ActionMenuTable from '../../../../components/Menu/ActionMenuTable';
import cuaHangService from '../../../../services/cua_hang/cuaHangService';
import ConfirmDelete from '../../../../components/AlertDialog/ConfirmDelete';
import ViewChiNhanhModal from './components/view-chi-nhanh-modal';
import abpCustom from '../../../../components/abp-custom';

class ChiNhanhScreen extends Component {
    dataGridRef: RefObject<any> = React.createRef<GridApi>();
    state = {
        idChiNhanh: '',
        anchorEl: null as any,
        isShowModal: false,
        isShowView: false,
        isShowConfirmDelete: false,
        currentPage: 1,
        rowPerPage: 10,
        filter: '',
        sortBy: '',
        sortType: 'desc',
        totalCount: 0,
        totalPage: 0,
        createOrEditChiNhanhDto: {} as CreateOrEditChiNhanhDto,
        listChiNhanh: [] as ChiNhanhDto[],
        hiddenColumns: []
    };
    async componentDidMount() {
        this.InitData();
    }

    async InitData() {
        const idChiNhanh = Cookies.get('IdChiNhanh')?.toString() ?? '';
        await cuaHangService.getCongTyEdit(idChiNhanh);
        const lstChiNhanh = await chiNhanhService.GetAll({
            keyword: this.state.filter,
            maxResultCount: this.state.rowPerPage,
            skipCount: this.state.currentPage,
            sortBy: this.state.sortBy,
            sortType: this.state.sortType
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
    handleDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };
    onOkDelete = async () => {
        await chiNhanhService.Delete(this.state.idChiNhanh);
        await this.setState({ idChiNhanh: '' });
        this.handleDelete();
        this.handleCloseMenu();
        this.InitData();
    };
    Modal = () => {
        this.setState({ isShowModal: !this.state.isShowModal });
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, idChiNhanh: rowId });
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
                    trangThai: 1
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
    handleEdit = () => {
        // Handle Edit action
        this.createOrEditShowModal(this.state.idChiNhanh ?? '');
        this.handleCloseMenu();
    };
    handleView = async () => {
        const createOrEdit = await chiNhanhService.GetForEdit(this.state.idChiNhanh ?? '');
        this.setState({
            createOrEditChiNhanhDto: createOrEdit,
            isShowView: true
        });
        alert(JSON.stringify(this.state.createOrEditChiNhanhDto));
        this.handleCloseMenu();
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

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, idChiNhanh: '' });
    };
    onSort = async (sortType: string, sortBy: string) => {
        //const type = sortType === 'desc' ? 'asc' : 'desc';
        await this.setState({
            sortBy: sortBy,
            sortType: sortType
        });
        this.InitData();
    };
    render(): ReactNode {
        const columns = [
            {
                field: 'tenChiNhanh',
                headerName: 'Tên chi nhánh',
                minWidth: 140,
                flex: 0.8,
                renderCell: (params: any) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Avatar
                            src={params.row.avatar}
                            alt="Avatar"
                            style={{ width: 24, height: 24, marginRight: 8 }}
                        /> */}
                        <Typography
                            fontSize="13px"
                            fontWeight="400"
                            fontFamily={'Roboto'}
                            lineHeight="16px"
                            title={params.value}>
                            {params.value}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params: any) => (
                    <Box fontWeight="700">{params.colDef.headerName}</Box>
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
                        fontSize="13px"
                        fontFamily={'Roboto'}
                        fontWeight={400}
                        title={params.value}
                        sx={{
                            textOverflow: 'ellipsis',
                            width: '100%',
                            overflow: 'hidden',
                            textAlign: 'left'
                        }}>
                        {params.value}
                    </Typography>
                ),
                renderHeader: (params: any) => (
                    <Box fontWeight="700">{params.colDef.headerName}</Box>
                )
            },
            {
                field: 'soDienThoai',
                headerName: 'Số điện thoại',
                minWidth: 110,
                flex: 0.8,
                renderCell: (params: any) => (
                    <Typography
                        width="100%"
                        textAlign="left"
                        variant="caption"
                        fontSize="13px"
                        fontFamily={'Roboto'}
                        fontWeight={400}
                        title={params.value}>
                        {params.value}
                    </Typography>
                ),
                renderHeader: (params: any) => (
                    <Box fontWeight="700">{params.colDef.headerName}</Box>
                )
            },
            {
                field: 'ngayApDung',
                headerName: 'Ngày áp dụng',
                minWidth: 130,
                flex: 0.8,
                renderCell: (params: any) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                            width: '100%'
                        }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="13px"
                            fontFamily={'Roboto'}
                            fontWeight="400"
                            lineHeight="16px">
                            {new Date(params.value).toLocaleDateString('en-GB')}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params: any) => <Box>{params.colDef.headerName}</Box>
            },
            {
                field: 'ngayHetHan',
                headerName: 'Ngày hết hạn',
                minWidth: 130,
                flex: 0.8,
                renderCell: (params: any) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                            width: '100%'
                        }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="13px"
                            fontFamily={'Roboto'}
                            fontWeight="400"
                            lineHeight="16px">
                            {new Date(params.value).toLocaleDateString('en-GB')}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params: any) => <Box>{params.colDef.headerName}</Box>
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
                        aria-haspopup="true"
                        onClick={(event) => {
                            this.handleOpenMenu(event, params.row.id);
                        }}>
                        <MoreHorizIcon />
                    </IconButton>
                ),
                renderHeader: (params: any) => (
                    <Box sx={{ display: 'none' }}>{params.colDef.headerName}</Box>
                )
            }
        ];

        return (
            <Box bgcolor="#fff" paddingTop={'16px'} paddingBottom={'16px'}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto" display="flex" alignItems="center" gap="12px">
                        <Typography variant="h1" fontSize="16px" fontWeight="700">
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
                        <Button
                            className="border-color btn-outline-hover"
                            variant="outlined"
                            startIcon={<img src={DownloadIcon} />}
                            sx={{
                                backgroundColor: '#fff!important',
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                height: '40px',
                                padding: '10px 16px',
                                borderRadius: '4px!important'
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
                                height: '40px',
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
                            hidden={!abpCustom.isGrandPermission('Pages.ChiNhanh.Create')}
                            startIcon={<img src={AddIcon} />}
                            sx={{
                                height: '40px',
                                textTransform: 'capitalize',
                                fontWeight: '400'
                            }}>
                            Thêm mới
                        </Button>
                    </Grid>
                </Grid>
                <Box paddingTop="16px">
                    <DataGrid
                        disableRowSelectionOnClick
                        rowHeight={46}
                        columns={columns}
                        rows={this.state.listChiNhanh}
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
                        columnBuffer={0}
                        hideFooter
                        ref={this.dataGridRef}
                        columnVisibilityModel={
                            {
                                // Hide columns status and traderName, the other columns will remain visible
                            }
                        }
                        localeText={TextTranslate}
                    />
                    <ActionMenuTable
                        selectedRowId={this.state.idChiNhanh}
                        anchorEl={this.state.anchorEl}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleEdit}
                        permissionView="Pages.ChiNhanh.View"
                        handleEdit={this.handleEdit}
                        permissionEdit="Pages.ChiNhanh.Edit"
                        handleDelete={this.handleDelete}
                        permissionDelete="Pages.ChiNhanh.Delete"
                    />
                    <CustomTablePagination
                        currentPage={this.state.currentPage}
                        rowPerPage={this.state.rowPerPage}
                        totalRecord={this.state.totalCount}
                        totalPage={this.state.totalPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                    <ConfirmDelete
                        isShow={this.state.isShowConfirmDelete}
                        onOk={this.onOkDelete}
                        onCancel={this.handleDelete}></ConfirmDelete>
                    <CreateOrEditChiNhanhModal
                        title={
                            this.state.idChiNhanh == ''
                                ? 'Thêm mới chi nhánh'
                                : 'Cập nhật chi nhánh'
                        }
                        formRef={this.state.createOrEditChiNhanhDto}
                        isShow={this.state.isShowModal}
                        onCLose={this.onCloseModal}
                        onSave={this.handleSubmit}
                    />
                </Box>
            </Box>
        );
    }
}
export default ChiNhanhScreen;
