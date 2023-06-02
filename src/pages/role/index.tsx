import React, { ChangeEventHandler } from 'react';
import AppComponentBase from '../../components/AppComponentBase';
import { Button, Box, Typography, Grid, TextField, Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import roleService from '../../services/role/roleService';
import AddIcon from '../../images/add.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { GetAllRoleOutput } from '../../services/role/dto/getAllRoleOutput';
import '../../custom.css';
import { GetAllPermissionsOutput } from '../../services/role/dto/getAllPermissionsOutput';
import RoleEditModel from '../../models/Roles/roleEditModel';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { DownloadOutlined, UploadOutlined } from '@mui/icons-material';
import CreateOrEditRoleModal from './components/create-or-edit-role';
import { PermissionTree } from '../../services/role/dto/permissionTree';
import { CreateOrEditRoleDto } from '../../services/role/dto/createOrEditRoleDto';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRoleProps {}

export interface IRoleState {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    roleId: number;
    filter: string;
    listRole: GetAllRoleOutput[];
    totalCount: number;
    permissionTree: PermissionTree[];
    roleEdit: CreateOrEditRoleDto;
    currentPage: number;
    totalPage: number;
    startIndex: number;
    isShowConfirmDelete: boolean;
}
class RoleScreen extends AppComponentBase<IRoleProps, IRoleState> {
    state = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        roleId: 0,
        filter: '',
        listRole: [] as GetAllRoleOutput[],
        totalCount: 0,
        permissionTree: [] as PermissionTree[],
        roleEdit: {
            description: '',
            displayName: '',
            name: '',
            grantedPermissionNames: [],
            id: 0
        } as CreateOrEditRoleDto,
        currentPage: 1,
        totalPage: 0,
        startIndex: 1,
        isShowConfirmDelete: false
    };

    async componentDidMount() {
        await this.getAll();
    }

    async getAll() {
        const roles = await roleService.getAll({
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount,
            keyword: this.state.filter
        });
        const permissionTree = await roleService.getAllPermissionTree();
        this.setState({
            listRole: roles.items,
            totalCount: roles.totalCount,
            permissionTree: permissionTree,
            totalPage: Math.ceil(roles.totalCount / this.state.maxResultCount)
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

    async createOrUpdateModalOpen(id: number) {
        if (id === 0) {
            const allPermission = await roleService.getAllPermissionTree();
            await this.setState({
                permissionTree: allPermission
            });
        } else {
            const roleForEdit = await roleService.getRoleForEdit(id);
            const allPermission = await roleService.getAllPermissionTree();
            await this.setState({
                permissionTree: allPermission,
                roleId: id,
                roleEdit: roleForEdit
            });
        }

        this.setState({ roleId: id });
        this.Modal();
    }

    async delete(id: number) {
        await roleService.delete(id);
        this.getAll();
    }

    handleCreate = () => {
        this.getAll();
        this.setState({ modalVisible: false });
    };
    onShowDelete = () => {
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };
    onOkDelete = () => {
        this.delete(this.state.roleId);
        this.onShowDelete();
    };
    // handleSearch: FormEventHandler<HTMLInputElement> = (event: any) => {
    //     const filter = event.target.value;
    //     this.setState({ filter: filter }, async () => this.getAll());
    // };
    handleSearch: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: any) => {
        const filter = event.target.value;
        this.setState({ filter: filter }, async () => this.getAll());
    };

    render() {
        return (
            <Box paddingLeft="2.2222222222222223vw" paddingRight="2.2222222222222223vw">
                <Box>
                    <Grid container justifyContent="space-between" paddingTop="22px">
                        <Grid item>
                            <div>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="body1" fontSize="14px" color="#999699">
                                        Vai trò
                                    </Typography>
                                    <ArrowForwardIosIcon
                                        fontSize="small"
                                        sx={{
                                            width: '12px',
                                            height: '12px'
                                        }}
                                    />
                                    <Typography variant="body1" fontSize="14px" color="#333233">
                                        Thông tin vai trò
                                    </Typography>
                                </Box>
                                <div>
                                    <Typography
                                        variant="h1"
                                        fontSize="24px"
                                        color="#0C050A"
                                        fontWeight="700"
                                        marginTop="4px">
                                        Danh sách vai trò
                                    </Typography>
                                </div>
                            </div>
                        </Grid>
                        <Grid item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Box>
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
                                            startIcon={<DownloadOutlined />}
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
                                            startIcon={<UploadOutlined />}
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
                                            onClick={() => {
                                                this.createOrUpdateModalOpen(0);
                                            }}
                                            sx={{
                                                height: '40px',
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                fontWeight: '400',
                                                backgroundColor: '#7C3367!important'
                                            }}>
                                            Thêm vai trò
                                        </Button>
                                    </Box>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
                <Box className="page-content" marginTop="24px" bgcolor="#fff" borderRadius="8px">
                    <table className="h-100 w-100 table table-border-0 table">
                        <thead className="bg-table w-100">
                            <tr style={{ height: '48px' }}>
                                <th className="text-center">
                                    <input className="text-th-table text-center" type="checkbox" />
                                </th>
                                <th className="text-th-table fw-bold text-center">STT</th>
                                <th className="text-th-table fw-bold">Tên vai trò</th>
                                <th className="text-th-table fw-bold">Mô tả</th>
                                <th className="text-th-table fw-bold">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.listRole.map((item, index) => {
                                return (
                                    <tr>
                                        <td
                                            className="text-td-table text-center"
                                            style={{ width: '50px' }}>
                                            <input
                                                className="text-th-table text-center"
                                                type="checkbox"
                                            />
                                        </td>
                                        <td
                                            className="text-td-table text-center"
                                            style={{ width: '100px' }}>
                                            {index + 1}
                                        </td>
                                        <td className="text-td-table">{item.name}</td>
                                        <td className="text-td-table">{item.description}</td>
                                        <td className="text-td-table" style={{ width: '150px' }}>
                                            <Box display="flex" justifyContent="start">
                                                <Button
                                                    onClick={() => {
                                                        this.setState({
                                                            roleId: item.id
                                                        });
                                                        this.createOrUpdateModalOpen(item.id);
                                                    }}
                                                    sx={{ minWidth: 'unset' }}>
                                                    <EditIcon />
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        this.setState({
                                                            roleId: item.id
                                                        });
                                                        this.onShowDelete();
                                                    }}
                                                    sx={{ minWidth: 'unset' }}>
                                                    <DeleteForeverIcon sx={{ color: 'red' }} />
                                                </Button>
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
                                            count={this.state.totalPage}
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
                <CreateOrEditRoleModal
                    visible={this.state.modalVisible}
                    onCancel={() =>
                        this.setState({
                            modalVisible: false
                        })
                    }
                    modalType={this.state.roleId === 0 ? 'Thêm mới quyền' : 'Cập nhật quyền'}
                    onOk={this.handleCreate}
                    permissionTree={this.state.permissionTree}
                    formRef={this.state.roleEdit}
                />
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.onShowDelete}></ConfirmDelete>
            </Box>
        );
    }
}

export default RoleScreen;
