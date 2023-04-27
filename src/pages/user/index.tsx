import React, { FormEventHandler } from 'react';
import AppComponentBase from '../../components/AppComponentBase';
import { Button, Col, FormInstance, Input, Pagination, PaginationProps, Row, Space } from 'antd';
import userService from '../../services/user/userService';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { GetUserOutput } from '../../services/user/dto/getUserOutput';
import {
    DownloadOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    UploadOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import '../../custom.css';
import { GetAllUserOutput } from '../../services/user/dto/getAllUserOutput';
import { AnyNaptrRecord, AnyNsRecord } from 'dns';
import CreateOrEditUser from './components/create-or-edit-user';
import { CreateOrUpdateUserInput } from '../../services/user/dto/createOrUpdateUserInput';
import SuggestService from '../../services/suggests/SuggestService';
import { GetRoles } from '../../services/user/dto/getRolesOuput';
import { SuggestNhanSuDto } from '../../services/suggests/dto/SuggestNhanSuDto';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserProps {}

export interface IUserState {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    userId: number;
    filter: string;
    listUser: GetAllUserOutput[];
    totalCount: number;
    currentPage: number;
    totalPage: number;
    startIndex: number;
    userEdit: CreateOrUpdateUserInput;
    isShowConfirmDelete: boolean;
    roles: GetRoles[];
    suggestNhanSu: SuggestNhanSuDto[];
}
class UserScreen extends AppComponentBase<IUserProps, IUserState> {
    formRef = React.createRef<FormInstance>();

    state = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        userId: 0,
        filter: '',
        listUser: [] as GetAllUserOutput[],
        totalCount: 0,
        currentPage: 1,
        totalPage: 0,
        startIndex: 1,
        userEdit: {
            userName: '',
            name: '',
            surname: '',
            emailAddress: '',
            isActive: false,
            roleNames: [],
            password: '',
            id: 0
        } as CreateOrUpdateUserInput,
        isShowConfirmDelete: false,
        roles: [] as GetRoles[],
        suggestNhanSu: [] as SuggestNhanSuDto[]
    };

    async componentDidMount() {
        await this.getAll();
    }

    async getAll() {
        const users = await userService.getAll({
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount,
            keyword: this.state.filter
        });

        this.setState({
            listUser: users.items,
            totalCount: users.totalCount,
            totalPage: Math.ceil(users.totalCount / this.state.maxResultCount)
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

    async createOrUpdateModalOpen(entityDto: number) {
        if (entityDto === 0) {
            this.formRef.current?.resetFields();
            const suggestNhanSu = await SuggestService.SuggestNhanSu();
            const roles = await userService.getRoles();
            this.setState({
                roles: roles,
                suggestNhanSu: suggestNhanSu,
                userEdit: {
                    userName: '',
                    name: '',
                    surname: '',
                    emailAddress: '',
                    isActive: false,
                    roleNames: [],
                    password: '',
                    id: 0
                }
            });
        } else {
            const user = await userService.get(entityDto);
            const roles = await userService.getRoles();
            this.setState({
                userEdit: user,
                roles: roles
            });
            setTimeout(() => {
                this.formRef.current?.setFieldsValue({ ...this.state.userEdit });
            }, 100);
        }

        this.setState({ userId: entityDto });
        this.Modal();
    }

    delete(input: number) {
        userService.delete(input);
    }

    handleCreate = () => {
        const form = this.formRef.current;

        form!.validateFields().then(async (values: any) => {
            if (this.state.userId === 0) {
                await userService.create(values);
            } else {
                await userService.update({
                    ...values,
                    id: this.state.userId,
                    fullName: values.name + ' ' + values.surname,
                    lastLoginTime: new Date()
                });
            }

            await this.getAll();
            this.setState({ modalVisible: false });
            form!.resetFields();
        });
    };
    onShowDelete = () => {
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };
    onOkDelete = () => {
        this.delete(this.state.userId);
        this.getAll();
        this.onShowDelete();
    };
    handleSearch: FormEventHandler<HTMLInputElement> = (event: any) => {
        const filter = event.target.value;
        this.setState({ filter: filter }, async () => this.getAll());
    };
    render(): React.ReactNode {
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
                                                Người dùng
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page">
                                                Thông tin người dùng
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                <div>
                                    <h3>Danh sách người dùng</h3>
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
                                <th className="text-th-table">STT</th>
                                <th className="text-th-table">Tên truy cập</th>
                                <th className="text-th-table">Họ và tên</th>
                                <th className="text-th-table">Vai trò</th>
                                <th className="text-th-table">Địa chỉ email</th>
                                <th className="text-th-table">Thời gian tạo</th>
                                <th className="text-th-table">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.listUser.map((item, index) => {
                                return (
                                    <tr>
                                        <td className="text-td-table text-center">
                                            <input
                                                className="text-th-table text-center"
                                                type="checkbox"
                                            />
                                        </td>
                                        <td className="text-td-table">{index + 1}</td>
                                        <td className="text-td-table">{item['userName']}</td>
                                        <td className="text-td-table">{item.fullName}</td>
                                        <td className="text-td-table">
                                            {item.roleNames.length > 1
                                                ? item.roleNames.map((role: any) => {
                                                      return <span>{role};</span>;
                                                  })
                                                : item.roleNames.map((role: any) => {
                                                      return <span>{role} </span>;
                                                  })}
                                        </td>
                                        <td className="text-td-table">{item.emailAddress}</td>
                                        <td className="text-td-table">
                                            {item.creationTime.toString()}
                                        </td>
                                        <td className="text-td-table" style={{ width: '150px' }}>
                                            <Space wrap direction="horizontal">
                                                <Button
                                                    type="primary"
                                                    icon={<EditOutlined />}
                                                    onClick={() => {
                                                        this.setState({
                                                            userId: item.id
                                                        });
                                                        this.createOrUpdateModalOpen(item.id);
                                                    }}
                                                />
                                                <Button
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => {
                                                        this.setState({
                                                            userId: item.id
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
                    <CreateOrEditUser
                        visible={this.state.modalVisible}
                        modalType={
                            this.state.userId === 0 ? 'Thêm mới tài khoản' : 'Cập nhật tài khoản'
                        }
                        formRef={this.formRef}
                        onCancel={() =>
                            this.setState({
                                modalVisible: false
                            })
                        }
                        roles={this.state.roles}
                        suggestNhanSu={this.state.suggestNhanSu}
                        userId={this.state.userId}
                        onOk={this.handleCreate}
                    />
                </div>
            </div>
        );
    }
}

export default UserScreen;
