import React, { Component, FormEventHandler } from 'react';
import { GetAllTenantOutput } from '../../services/tenant/dto/getAllTenantOutput';
import CreateTenantInput from '../../services/tenant/dto/createTenantInput';
import { Button, Col, FormInstance, Input, Pagination, PaginationProps, Row, Space } from 'antd';
import AppComponentBase from '../../components/AppComponentBase';
import { EntityDto } from '../../services/dto/entityDto';
import tenantService from '../../services/tenant/tenantService';
import '../../custom.css';
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    UploadOutlined
} from '@ant-design/icons';
import Stores from '../../stores/storeIdentifier';
import CreateOrEditTenant from './components/create-or-edit-tenant';
import TenantModel from '../../models/Tenants/TenantModel';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
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
    createOrEditTenant: TenantModel;
    isShowConfirmDelete: boolean;
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
        startIndex: 1,
        createOrEditTenant: { id: 0, isActive: true, name: '', tenancyName: '' } as TenantModel,
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

    handlePageChange: PaginationProps['onChange'] = (page) => {
        const { maxResultCount } = this.state;
        this.setState({
            currentPage: page,
            skipCount: page,
            startIndex: (page - 1 <= 0 ? 0 : page - 1) * maxResultCount
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
            this.formRef.current?.resetFields();
            this.setState({
                createOrEditTenant: { id: 0, isActive: true, name: '', tenancyName: '' }
            });
        } else {
            const createOrEdit = await tenantService.get(entityDto);
            this.setState({
                createOrEditTenant: {
                    id: entityDto,
                    isActive: createOrEdit.isActive,
                    name: createOrEdit.name,
                    tenancyName: createOrEdit.tenancyName
                }
            });
            setTimeout(() => {
                this.formRef.current?.setFieldsValue({
                    ...createOrEdit
                });
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
        this.getAll();
        this.onShowDelete();
    };
    async delete(input: number) {
        await tenantService.delete(input);
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
                                                Tenant
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page">
                                                Thông tin tenant
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                <div>
                                    <h3>Danh sách tenant</h3>
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
                                        Thêm tenant
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
                                                        this.setState({
                                                            tenantId: item.id
                                                        });
                                                        this.createOrUpdateModalOpen(item.id);
                                                    }}
                                                />
                                                <Button
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => {
                                                        this.setState({
                                                            tenantId: item.id
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
                <CreateOrEditTenant
                    formRef={this.formRef}
                    visible={this.state.modalVisible}
                    modalType={this.state.tenantId === 0 ? 'Thêm mới tenant' : 'Cập nhật tenant'}
                    tenantId={this.state.tenantId}
                    onCancel={() =>
                        this.setState({
                            modalVisible: false
                        })
                    }
                    onOk={this.handleCreate}
                />
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.onShowDelete}></ConfirmDelete>
            </div>
        );
    }
}

export default TenantScreen;
