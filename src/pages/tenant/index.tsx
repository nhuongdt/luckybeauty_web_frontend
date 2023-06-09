import React, { ChangeEventHandler } from 'react';
import { GetAllTenantOutput } from '../../services/tenant/dto/getAllTenantOutput';
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    Pagination,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { DataGrid } from '@mui/x-data-grid';
import AppComponentBase from '../../components/AppComponentBase';
import tenantService from '../../services/tenant/tenantService';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import '../../custom.css';
import AddIcon from '../../images/add.svg';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CreateOrEditTenant from './components/create-or-edit-tenant';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import CreateTenantInput from '../../services/tenant/dto/createTenantInput';
import { ReactComponent as IconSorting } from '../../images/column-sorting.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { TextTranslate } from '../../components/TableLanguage';
import { AnyAaaaRecord } from 'dns';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITenantProps {}

export interface ITenantState {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    tenantId: number;
    filter: string;
    listTenant: GetAllTenantOutput[];
    totalCount: number;
    currentPage: number;
    totalPage: number;
    startIndex: number;
    createOrEditTenant: CreateTenantInput;
    isShowConfirmDelete: boolean;
}
class TenantScreen extends AppComponentBase<ITenantProps> {
    state = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        tenantId: 0,
        filter: '',
        listTenant: [] as GetAllTenantOutput[],
        totalCount: 0,
        currentPage: 1,
        totalPage: 0,
        startIndex: 1,
        createOrEditTenant: {
            isActive: true,
            name: '',
            adminEmailAddress: '',
            connectionString: '',
            tenancyName: ''
        } as CreateTenantInput,
        isShowConfirmDelete: false,
        anchorEl: null,
        selectedRowId: 0
    };

    async componentDidMount() {
        await this.getAll();
    }

    async getAll() {
        const tenants = await tenantService.getAll({
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount,
            keyword: this.state.filter
        });
        this.setState({
            listTenant: tenants.items,
            totalCount: tenants.totalCount,
            totalPage: Math.ceil(tenants.totalCount / this.state.maxResultCount)
        });
    }

    handlePageChange = (event: any, value: any) => {
        const { maxResultCount } = this.state;
        this.setState({
            currentPage: value,
            skipCount: value,
            startIndex: (value - 1 <= 0 ? 0 : value - 1) * maxResultCount
        });
        this.getAll();
    };
    handleSearch: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: any) => {
        const filter = event.target.value;
        this.setState({ filter: filter }, async () => this.getAll());
    };
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    createOrUpdateModalOpen = async (entityDto: number) => {
        if (entityDto === 0) {
            await this.setState({
                createOrEditTenant: {
                    isActive: true,
                    name: '',
                    adminEmailAddress: '',
                    connectionString: '',
                    tenancyName: ''
                }
            });
        } else {
            const createOrEdit = await tenantService.get(entityDto);
            await this.setState({
                createOrEditTenant: {
                    isActive: createOrEdit.isActive,
                    name: createOrEdit.name,
                    tenancyName: createOrEdit.tenancyName,
                    adminEmailAddress: '',
                    connectionString: ''
                }
            });
        }

        this.setState({ tenantId: entityDto });
        this.Modal();
    };
    onShowDelete = () => {
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };
    onOkDelete = () => {
        this.delete(this.state.selectedRowId);
        this.onShowDelete();
    };
    async delete(input: number) {
        await tenantService.delete(input);
        this.getAll();
    }

    handleCreate = () => {
        this.getAll();
        this.Modal();
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: 0 });
        await this.getAll();
    };
    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? 0);
        this.handleCloseMenu();
    };
    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };
    render(): React.ReactNode {
        const columns = [
            {
                field: 'name',
                headerName: 'Tên cửa hàng',
                minWidth: 125,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }} title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'tenancyName',
                headerName: 'Tenant Id',
                minWidth: 125,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }} title={params.colDef.headerName}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'isActive',
                headerName: 'Trạng thái',
                minWidth: 100,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }} title={params.colDef.headerName}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        sx={{
                            padding: '4px 8px',
                            borderRadius: '100px',
                            color: 'rgb(0, 158, 247)',
                            bgcolor: 'rgb(241, 250, 255)'
                        }}>
                        {params.value == true ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </Box>
                )
            },
            {
                field: 'action',
                headerName: 'Hành động',
                maxWidth: 60,
                flex: 1,
                disableColumnMenu: true,
                renderCell: (params: any) => (
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
                renderHeader: (params: any) => (
                    <Box sx={{ display: 'none' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            }
        ];
        return (
            <Box sx={{ padding: '24px 2.2222222222222223vw' }}>
                <div>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <div>
                                <Box display="flex" gap="8px" alignItems="center">
                                    <Typography
                                        variant="h1"
                                        fontWeight="700"
                                        fontSize="24px"
                                        sx={{ marginTop: '4px' }}>
                                        Danh sách tenant
                                    </Typography>
                                    <TextField
                                        onChange={this.handleSearch}
                                        size="small"
                                        sx={{
                                            borderColor: '#E6E1E6!important',
                                            bgcolor: '#fff'
                                        }}
                                        placeholder="Tìm kiếm..."
                                        InputProps={{
                                            startAdornment: (
                                                <SearchIcon
                                                    style={{
                                                        marginRight: '8px',
                                                        color: 'gray'
                                                    }}
                                                />
                                            )
                                        }}
                                    />
                                </Box>
                            </div>
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Box display="flex" alignItems="center" gap="8px">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<img src={DownloadIcon} />}
                                        sx={{
                                            height: '40px',
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            fontWeight: '400',
                                            borderColor: '#E6E1E6!important',
                                            color: '#666466',
                                            backgroundColor: '#fff!important'
                                        }}>
                                        Nhập
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<img src={UploadIcon} />}
                                        sx={{
                                            height: '40px',
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            fontWeight: '400',
                                            borderColor: '#E6E1E6!important',
                                            color: '#666466',
                                            backgroundColor: '#fff!important'
                                        }}>
                                        Xuất
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<img src={AddIcon} />}
                                        size="small"
                                        sx={{
                                            height: '40px',
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            fontWeight: '400',
                                            backgroundColor: '#7C3367!important'
                                        }}
                                        onClick={() => {
                                            this.createOrUpdateModalOpen(0);
                                        }}>
                                        Thêm tenant
                                    </Button>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                <Box
                    marginTop="24px"
                    className="page-content "
                    sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                    <DataGrid
                        autoHeight
                        columns={columns}
                        rows={this.state.listTenant}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 }
                            }
                        }}
                        pageSizeOptions={[10, 20]}
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
                            }
                        }}
                        localeText={TextTranslate}
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
                        <MenuItem onClick={this.onShowDelete}>
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
                    <div className="row" style={{ display: 'none' }}>
                        <div className="col-6" style={{ float: 'left' }}></div>
                        <div className="col-6" style={{ float: 'right' }}>
                            <div className="row align-items-center" style={{ height: '50px' }}>
                                <div style={{ float: 'right' }} className="col-7">
                                    <Box className="align-items-center">
                                        <Pagination
                                            count={Math.ceil(
                                                this.state.totalCount / this.state.maxResultCount
                                            )}
                                            page={this.state.currentPage}
                                            onChange={this.handlePageChange}
                                            sx={{
                                                '& button': {
                                                    borderRadius: '4px',
                                                    lineHeight: '1'
                                                },
                                                '& .Mui-selected': {
                                                    backgroundColor: '#7C3367!important',
                                                    color: '#fff'
                                                }
                                            }}
                                        />
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
                <CreateOrEditTenant
                    formRef={this.state.createOrEditTenant}
                    visible={this.state.modalVisible}
                    modalType={this.state.tenantId === 0 ? 'Thêm mới tenant' : 'Cập nhật tenant'}
                    tenantId={this.state.tenantId}
                    onCancel={async () => {
                        this.setState({
                            modalVisible: false
                        });
                        await this.getAll();
                    }}
                    onOk={this.handleCreate}
                />
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.onShowDelete}></ConfirmDelete>
            </Box>
        );
    }
}

export default TenantScreen;
