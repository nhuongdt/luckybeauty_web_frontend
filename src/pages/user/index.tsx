import React from 'react';
import AppComponentBase from '../../components/AppComponentBase';
import { Button, FormInstance, Space } from 'antd';
import { EntityDto } from '../../services/dto/entityDto';
import userService from '../../services/user/userService';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { GetUserOutput } from '../../services/user/dto/getUserOutput';
import { EditOutlined } from '@ant-design/icons';
import { DeleteOutline } from '@mui/icons-material';
import { Pagination, Stack } from '@mui/material';
import '../../custom.css';
import { GetAllUserOutput } from '../../services/user/dto/getAllUserOutput';
import { AnyNaptrRecord, AnyNsRecord } from 'dns';
import CreateOrEditUser from './create-or-edit-user';
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
        startIndex: 1
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

    handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
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
        // if (entityDto.id === 0) {
        //   await this.props.userStore.createUser()
        //   await this.props.userStore.getRoles()
        // } else {
        //   await this.props.userStore.get(entityDto)
        //   await this.props.userStore.getRoles()
        // }

        this.setState({ userId: entityDto });
        this.Modal();

        setTimeout(() => {
            // this.formRef.current?.setFieldsValue({ ...this.props.userStore.editUser })
        }, 100);
    }

    delete(input: EntityDto) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
    }

    handleCreate = () => {
        const form = this.formRef.current;

        form!.validateFields().then(async (values: any) => {
            // if (this.state.userId === 0) {
            //   await this.props.userStore.create(values)
            // } else {
            //   await this.props.userStore.update({ ...values, id: this.state.userId })
            // }

            await this.getAll();
            this.setState({ modalVisible: false });
            form!.resetFields();
        });
    };

    handleSearch = (value: string) => {
        this.setState({ filter: value }, async () => this.getAll());
    };
    render(): React.ReactNode {
        return (
            <div className="container">
                <div className="page-header">
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}>
                        <div>
                            <div className="pt-2">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Tài khoản
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Quản lý người dùng
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                            <div>
                                <h3>Tài khoản</h3>
                            </div>
                        </div>
                        <div>
                            <Stack
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                                spacing={1}>
                                <div className="search w-100">
                                    <i className="fa-thin fa-magnifying-glass"></i>
                                    <input
                                        type="text"
                                        //onChange={()=>{this.handleSearch()}}
                                        className="input-search"
                                        placeholder="Tìm kiếm ..."
                                    />
                                </div>
                                <Stack
                                    direction="row"
                                    justifyContent="flex-endspace-between"
                                    alignItems="center"
                                    spacing={1}>
                                    <Button className="btn-import">
                                        <i className="fa fa-home"></i> Nhập
                                    </Button>
                                    <Button className="btn-export">
                                        <i className="fa fa-home"></i> Xuất
                                    </Button>
                                </Stack>
                                <Button
                                    className="btn btn-add-item"
                                    onClick={() => {
                                        this.createOrUpdateModalOpen(0);
                                    }}>
                                    Thêm người dùng
                                </Button>
                            </Stack>
                        </div>
                    </Stack>
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
                                            {item.roleNames.map((role: any) => {
                                                return <span>{role}</span>;
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
                                                        // this.setState({
                                                        //   idNhanSu: item.id,
                                                        // });
                                                        // this.onOpenDialog();
                                                    }}
                                                />
                                                <Button
                                                    danger
                                                    icon={<DeleteOutline />}
                                                    onClick={() => {
                                                        // this.setState({
                                                        //   idNhanSu: item.id,
                                                        // });
                                                        // this.onCancelDelete()
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
                                    <Stack spacing={1.5} className="align-items-center">
                                        <Pagination
                                            count={this.state.totalPage}
                                            defaultPage={this.state.currentPage}
                                            onChange={this.handlePageChange}
                                            color="secondary"
                                            shape="rounded"
                                        />
                                    </Stack>
                                </div>
                            </div>
                        </div>
                    </div>
                    <CreateOrEditUser
                        visible={this.state.modalVisible}
                        modalType={
                            this.state.userId === 0 ? 'Thêm mới tài khoản' : 'Cập nhật tài khoản'
                        }
                        onCancel={() =>
                            this.setState({
                                modalVisible: false
                            })
                        }
                        onOk={this.handleCreate}
                    />
                </div>
            </div>
        );
    }
}

export default UserScreen;
