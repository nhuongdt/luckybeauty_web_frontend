import React, { FormEventHandler, ChangeEventHandler } from 'react';
import { GetAllTenantOutput } from '../../services/tenant/dto/getAllTenantOutput';
import { Box, Grid, Typography, TextField, Button, Pagination } from '@mui/material';
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
class TenantScreen extends AppComponentBase<ITenantProps, ITenantState> {
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
        isShowConfirmDelete: false
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
        this.delete(this.state.tenantId);
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

    // handleSearch: FormEventHandler<HTMLInputElement> = (event: any) => {
    //     const filter = event.target.value;
    //     this.setState({ filter: filter }, async () => this.getAll());
    // };
    handleSearch: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: any) => {
        const filter = event.target.value;
        this.setState({ filter: filter }, async () => this.getAll());
    };

    render(): React.ReactNode {
        return (
            <Box sx={{ padding: '24px 2.2222222222222223vw' }}>
                <div>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <div>
                                <div>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="body1" fontSize="14px" color="#999699">
                                            Người dùng
                                        </Typography>
                                        <ArrowForwardIosIcon
                                            fontSize="small"
                                            sx={{
                                                width: '12px',
                                                height: '12px'
                                            }}
                                        />
                                        <Typography
                                            variant="body1"
                                            fontSize="14px"
                                            color="#333233"
                                            sx={{ marginTop: '4px' }}>
                                            Thông tin người dùng
                                        </Typography>
                                    </Box>
                                </div>
                                <div>
                                    <Typography
                                        variant="h1"
                                        fontWeight="700"
                                        fontSize="24px"
                                        sx={{ marginTop: '4px' }}>
                                        Danh sách tenant
                                    </Typography>
                                </div>
                            </div>
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Box display="flex" alignItems="center" gap="8px">
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
                    <table className="h-100 w-100 table table-border-0 table">
                        <thead className="bg-table w-100">
                            <tr style={{ height: '48px' }}>
                                <th className="text-center">
                                    <input className="text-th-table text-center" type="checkbox" />
                                </th>
                                <th className="text-th-table">STT</th>
                                <th className="text-th-table">Tenant</th>
                                <th className="text-th-table">Tên tenant</th>
                                <th className="text-th-table">Trạng thái</th>
                                <th className="text-th-table">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.listTenant.map((item, index) => {
                                return (
                                    <tr>
                                        <td className="text-td-table text-center">
                                            <input
                                                className="text-th-table text-center"
                                                type="checkbox"
                                            />
                                        </td>
                                        <td className="text-td-table">{index + 1}</td>
                                        <td className="text-td-table">{item.tenancyName}</td>
                                        <td className="text-td-table">{item.name}</td>
                                        <td className="text-td-table">
                                            {item.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                                        </td>
                                        <td className="text-td-table" style={{ width: '150px' }}>
                                            <Box display="flex" justifyContent="start">
                                                <Button
                                                    sx={{ minWidth: 'unset' }}
                                                    startIcon={<EditIcon />}
                                                    onClick={() => {
                                                        this.setState({
                                                            tenantId: item.id
                                                        });
                                                        this.createOrUpdateModalOpen(item.id);
                                                    }}
                                                />
                                                <Button
                                                    sx={{ minWidth: 'unset' }}
                                                    startIcon={
                                                        <DeleteForeverIcon sx={{ color: 'red' }} />
                                                    }
                                                    onClick={() => {
                                                        this.setState({
                                                            tenantId: item.id
                                                        });
                                                        this.onShowDelete();
                                                    }}
                                                />
                                            </Box>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="row">
                        <div className="col-6" style={{ float: 'left' }}></div>
                        <div className="col-6" style={{ float: 'right' }}>
                            <div className="row align-items-center" style={{ height: '50px' }}>
                                <div className="col-5 align-items-center">
                                    <label
                                        className="pagination-view-record align-items-center"
                                        style={{ float: 'right' }}>
                                        Hiển thị{' '}
                                        {this.state.currentPage * this.state.maxResultCount - 9}-
                                        {this.state.currentPage * this.state.maxResultCount} của{' '}
                                        {this.state.totalCount} mục
                                    </label>
                                </div>
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
