import React, { FormEventHandler } from 'react';
import AppComponentBase from '../../components/AppComponentBase';
import { Button, Col, FormInstance, Input, Pagination, PaginationProps, Row, Space } from 'antd';
import roleService from '../../services/role/roleService';
import {
    DownloadOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { DeleteOutline } from '@mui/icons-material';
import { GetAllRoleOutput } from '../../services/role/dto/getAllRoleOutput';
import '../../custom.css';
import CreateOrEditRole from './components/create-or-edit-role';
import { GetAllPermissionsOutput } from '../../services/role/dto/getAllPermissionsOutput';
import RoleEditModel from '../../models/Roles/roleEditModel';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
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
    allPermissions: GetAllPermissionsOutput[];
    roleEdit: RoleEditModel;
    currentPage: number;
    totalPage: number;
    startIndex: number;
    isShowConfirmDelete: boolean;
}
class RoleScreen extends AppComponentBase<IRoleProps, IRoleState> {
    formRef = React.createRef<FormInstance>();

    state = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        roleId: 0,
        filter: '',
        listRole: [] as GetAllRoleOutput[],
        totalCount: 0,
        allPermissions: [] as GetAllPermissionsOutput[],
        roleEdit: {
            grantedPermissionNames: [],
            role: {
                name: '',
                displayName: '',
                description: '',
                id: 0
            },
            permissions: [{ name: '', displayName: '', description: '' }]
        } as RoleEditModel,
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
        const permissions = await roleService.getAllPermissions();
        this.setState({
            listRole: roles.items,
            totalCount: roles.totalCount,
            allPermissions: permissions,
            totalPage: Math.ceil(roles.totalCount / this.state.maxResultCount)
        });
    }

    handlePageChange: PaginationProps['onChange'] = (value) => {
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
            this.formRef.current?.resetFields();
            const allPermission = await roleService.getAllPermissions();
            this.setState({
                allPermissions: allPermission
            });
        } else {
            const roleForEdit = await roleService.getRoleForEdit(id);
            const allPermission = await roleService.getAllPermissions();
            this.setState({
                allPermissions: allPermission,
                roleId: id,
                roleEdit: roleForEdit
            });
            setTimeout(() => {
                this.formRef.current?.setFieldsValue({
                    ...roleForEdit.role,
                    grantedPermissions: roleForEdit.grantedPermissionNames
                });
            }, 100);
        }

        this.setState({ roleId: id });
        this.Modal();
    }

    async delete(id: number) {
        await roleService.delete(id);
    }

    handleCreate = () => {
        this.formRef.current?.validateFields().then(async (values: any) => {
            if (this.state.roleId === 0) {
                await roleService.create(values);
            } else {
                await roleService.update({
                    id: this.state.roleId,
                    ...values
                });
            }

            await this.getAll();
            this.setState({ modalVisible: false });
            this.formRef.current?.resetFields();
        });
    };
    onShowDelete = () => {
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };
    onOkDelete = () => {
        this.delete(this.state.roleId);
        this.getAll();
        this.onShowDelete();
    };
    handleSearch: FormEventHandler<HTMLInputElement> = (event: any) => {
        const filter = event.target.value;
        this.setState({ filter: filter }, async () => this.getAll());
    };
    render() {
        return (
            <div className="container-fluid bg-white">
                <div className="page-header">
                    <Row align={'middle'} justify={'space-between'}>
                        <Col span={12}>
                            <div>
                                <div className="pt-2">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page">
                                                Vai trò
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page">
                                                Thông tin vai trò
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                <div>
                                    <h3>Danh sách vai trò</h3>
                                </div>
                            </div>
                        </Col>
                        <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Space align="center" size="middle">
                                    <div className="search w-100">
                                        <Input
                                            allowClear
                                            onChange={this.handleSearch}
                                            size="large"
                                            prefix={<SearchOutlined />}
                                            placeholder="Tìm kiếm..."
                                        />
                                    </div>
                                    <Space align="center" size="middle">
                                        <Button
                                            className="btn-import"
                                            size="large"
                                            icon={<DownloadOutlined />}>
                                            Nhập
                                        </Button>
                                        <Button
                                            className="btn-export"
                                            size="large"
                                            icon={<UploadOutlined />}>
                                            Xuất
                                        </Button>
                                    </Space>
                                    <Button
                                        icon={<PlusOutlined />}
                                        size="large"
                                        className="btn btn-add-item"
                                        onClick={() => {
                                            this.createOrUpdateModalOpen(0);
                                        }}>
                                        Thêm vai trò
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="page-content pt-2">
                    <table className="h-100 w-100 table table-border-0 table">
                        <thead className="bg-table w-100">
                            <tr style={{ height: '48px' }}>
                                <th className="text-center">
                                    <input className="text-th-table text-center" type="checkbox" />
                                </th>
                                <th className="text-th-table text-center">STT</th>
                                <th className="text-th-table">Tên vai trò</th>
                                <th className="text-th-table">Mô tả</th>
                                <th className="text-th-table">Hành động</th>
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
                                            <Space wrap direction="horizontal">
                                                <Button
                                                    type="primary"
                                                    icon={<EditOutlined />}
                                                    onClick={() => {
                                                        this.setState({
                                                            roleId: item.id
                                                        });
                                                        this.createOrUpdateModalOpen(item.id);
                                                    }}
                                                />
                                                <Button
                                                    danger
                                                    icon={<DeleteOutline />}
                                                    onClick={() => {
                                                        this.setState({
                                                            roleId: item.id
                                                        });
                                                        this.onShowDelete();
                                                    }}
                                                />
                                            </Space>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="row">
                        <div className="col-6" style={{ float: 'left' }}></div>
                        <div className="col-6" style={{ float: 'right' }}>
                            <div className="row">
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
                                    <Space
                                        size="middle"
                                        align="center"
                                        className="align-items-center">
                                        <Pagination
                                            total={this.state.totalCount}
                                            pageSize={this.state.maxResultCount}
                                            defaultCurrent={this.state.currentPage}
                                            current={this.state.currentPage}
                                            onChange={this.handlePageChange}
                                        />
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CreateOrEditRole
                    visible={this.state.modalVisible}
                    onCancel={() =>
                        this.setState({
                            modalVisible: false
                        })
                    }
                    modalType={this.state.roleId === 0 ? 'Thêm mới quyền' : 'Cập nhật quyền'}
                    onOk={this.handleCreate}
                    permissions={this.state.allPermissions}
                    formRef={this.formRef}
                />
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.onShowDelete}></ConfirmDelete>
            </div>
        );
    }
}

export default RoleScreen;
