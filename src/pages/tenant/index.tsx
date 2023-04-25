import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { GetAllTenantOutput } from '../../services/tenant/dto/getAllTenantOutput';
import CreateTenantInput from '../../services/tenant/dto/createTenantInput';
import { Button, FormInstance, Space } from 'antd';
import AppComponentBase from '../../components/AppComponentBase';
import { EntityDto } from '../../services/dto/entityDto';
import tenantService from '../../services/tenant/tenantService';
import { Pagination, Stack } from '@mui/material';
import '../../custom.css';
import { EditOutlined } from '@ant-design/icons';
import { DeleteOutline } from '@mui/icons-material';
import Stores from '../../stores/storeIdentifier';
import CreateOrEditTenant from './create-or-edit-tenant';
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
}
class TenantScreen extends AppComponentBase<ITenantProps, ITenantState> {
    formRef = React.createRef<FormInstance>();
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
        startIndex: 1
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

    createOrUpdateModalOpen = async (entityDto: number) => {
        if (entityDto === 0) {
            //tenantService.create();
        } else {
            await tenantService.get(entityDto);
        }

        this.setState({ tenantId: entityDto });
        this.Modal();

        // setTimeout(() => {
        //   if (entityDto.id !== 0) {
        //     this.formRef.current?.setFieldsValue({
        //       ...this.props.tenantStore.tenantModel,
        //     });
        //   } else {
        //     this.formRef.current?.resetFields();
        //   }
        // }, 100);
    };

    delete(input: EntityDto) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
    }

    handleCreate = async () => {
        this.formRef.current?.validateFields().then(async (values: any) => {
            if (this.state.tenantId === 0) {
                await tenantService.create(values);
            } else {
                await tenantService.update({
                    id: this.state.tenantId,
                    ...values
                });
            }

            await this.getAll();
            this.setState({ modalVisible: false });
            this.formRef.current?.resetFields();
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
                                            Tenant
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Quản lý tenant
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                            <div>
                                <h3>Tenant</h3>
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
                                    Thêm tenant
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
                </div>
                <CreateOrEditTenant
                    visible={this.state.modalVisible}
                    modalType={this.state.tenantId === 0 ? 'Thêm mới tenant' : 'Cập nhật tenant'}
                    onCancel={() =>
                        this.setState({
                            modalVisible: false
                        })
                    }
                    onOk={this.handleCreate}
                />
            </div>
        );
    }
}

export default TenantScreen;
