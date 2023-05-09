import React, { Component, FormEventHandler, useState } from 'react';
import CreateOrEditCustomerDialog from './components/create-or-edit-customer-modal';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import khachHangService from '../../services/khach-hang/khachHangService';
import { Button, Col, FormInstance, Input, Pagination, PaginationProps, Row, Space } from 'antd';
import SuggestService from '../../services/suggests/SuggestService';
import { SuggestNhomKhachDto } from '../../services/suggests/dto/SuggestNhomKhachDto';
import { SuggestNguonKhachDto } from '../../services/suggests/dto/SuggestNguonKhachDto';
import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import '../employee/employee.css';
import '../../custom.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    UploadOutlined
} from '@ant-design/icons';
const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
        return <a>Previous</a>;
    }
    if (type === 'next') {
        return <a>Next</a>;
    }
    return originalElement;
};
class CustomerScreen extends Component {
    formRef = React.createRef<FormInstance>();
    state = {
        IdKhachHang: '',
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        tenantId: 0,
        filter: '',
        listKhachHang: [] as KhachHangItemDto[],
        suggestNhomKhach: [] as SuggestNhomKhachDto[],
        suggestNguonKhach: [] as SuggestNguonKhachDto[],
        createOrEditKhachHang: {} as CreateOrEditKhachHangDto,
        totalCount: 0,
        currentPage: 1,
        totalPage: 1,
        startIndex: 0,
        isShowConfirmDelete: false
    };
    async componentDidMount() {
        this.getData();
    }
    async getData() {
        const nhomKhachs = await SuggestService.SuggestNhomKhach();
        const nguonKhachs = await SuggestService.SuggestNguonKhach();
        this.setState({
            suggestNhomKhach: nhomKhachs,
            suggestNguonKhach: nguonKhachs
        });
        if (this.state.IdKhachHang !== '') {
            const khachHang = await khachHangService.getKhachHang(this.state.IdKhachHang);
            console.log(khachHang);
            this.setState({ createOrEditKhachHang: khachHang });
        }
        this.getListKhachHang();
    }
    async getListKhachHang() {
        const data = await khachHangService.getAll({
            keyword: this.state.filter,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount
        });
        this.setState({
            listKhachHang: data.items,
            totalCount: data.totalCount,
            totalPage: Math.ceil(data.totalCount / this.state.maxResultCount)
        });
    }
    async delete(id: string) {
        await khachHangService.delete(id);
        this.setState({ IdKhachHang: '' });
    }
    handleSearch: FormEventHandler<HTMLInputElement> = (event: any) => {
        const filter = event.target.value;
        this.setState({ filter }, async () => this.getListKhachHang());
    };

    handlePageChange: PaginationProps['onChange'] = (page) => {
        const { maxResultCount } = this.state;
        this.setState({
            currentPage: page,
            skipCount: page,
            startIndex: (page - 1 <= 0 ? 0 : page - 1) * maxResultCount
        });
        this.getData();
    };

    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    async createOrUpdateModalOpen(entityDto: string) {
        if (entityDto === '') {
            this.formRef.current?.resetFields();
            this.setState({
                createOrEditKhachHang: {
                    id: '',
                    maKhachHang: '',
                    tenKhachHang: '',
                    soDienThoai: '',
                    diaChi: '',
                    gioiTinh: true,
                    email: '',
                    moTa: '',
                    trangThai: 0,
                    tongTichDiem: 0,
                    maSoThue: '',
                    avatar: '',
                    ngaySinh: '',
                    kieuNgaySinh: 0,
                    idLoaiKhach: 0,
                    idNhomKhach: '',
                    idNguonKhach: '',
                    idTinhThanh: '',
                    idQuanHuyen: ''
                }
            });
        } else {
            const customer = await khachHangService.getKhachHang(entityDto);
            this.setState({
                createOrEditKhachHang: customer
            });
            setTimeout(() => {
                this.formRef.current?.setFieldsValue({ ...this.state.createOrEditKhachHang });
            }, 100);
        }

        this.setState({ IdKhachHang: entityDto });
        this.Modal();
    }

    onCancelDelete = () => {
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };

    onOkDelete = () => {
        this.delete(this.state.IdKhachHang);
        this.getData();
        this.onCancelDelete();
    };
    handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        this.setState({
            createOrEditKhachHang: {
                ...this.state.createOrEditKhachHang,
                [name]: value
            }
        });
    };

    handleSubmit = async () => {
        this.formRef.current?.validateFields().then(async (values: any) => {
            if (this.state.IdKhachHang === '') {
                await khachHangService.create(values);
            } else {
                await khachHangService.update({
                    id: this.state.IdKhachHang,
                    ...values
                });
            }

            await this.getData();
            this.setState({ modalVisible: false });
            this.formRef.current?.resetFields();
        });
    };

    public render() {
        return (
            <div className="container-fluid bg-white h-100">
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
                                                Khách hàng
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page">
                                                Quản lý khách hàng
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                <div>
                                    <h3>Danh sách khách hàng</h3>
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
                                            this.createOrUpdateModalOpen('');
                                        }}>
                                        Thêm khách hàng
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
                                <th className="text-th-table">Tên khách hàng</th>
                                <th className="text-th-table">Số điện thoại</th>
                                <th className="text-th-table">Nhóm khách</th>
                                <th className="text-th-table">Nhân viên phục vụ</th>
                                <th className="text-th-table">Tổng chi tiêu</th>
                                <th className="text-th-table">Cuộc hẹn gần đây</th>
                                <th className="text-th-table">Nguồn</th>
                                <th className="text-th-table">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.listKhachHang.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="text-center">
                                            <input type="checkbox" />
                                        </td>
                                        <td className="text-td-table">
                                            {this.state.startIndex + (index + 1)}
                                        </td>
                                        <td className="text-td-table">{item.tenKhachHang}</td>
                                        <td className="text-td-table">{item.soDienThoai}</td>
                                        <td className="text-td-table">{item.tenNhomKhach}</td>
                                        <td className="text-td-table">{item.nhanVienPhuTrach}</td>
                                        <td className="text-td-table">{item.tongChiTieu}</td>
                                        <td className="text-td-table">
                                            <CalendarMonthIcon fontSize="small" />{' '}
                                            {new Date(
                                                item.cuocHenGanNhat.toString()
                                            ).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="text-secondary">{item.tenNguonKhach}</td>
                                        <td className="text-td-table" style={{ width: '150px' }}>
                                            <Space wrap direction="horizontal">
                                                <Button
                                                    type="primary"
                                                    icon={<EditOutlined />}
                                                    onClick={() => {
                                                        this.setState({
                                                            IdKhachHang: item.id.toString()
                                                        });
                                                        this.createOrUpdateModalOpen(
                                                            item.id.toString()
                                                        );
                                                    }}
                                                />
                                                <Button
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => {
                                                        this.setState({
                                                            IdKhachHang: item.id.toString()
                                                        });
                                                        this.onCancelDelete();
                                                        // this.delete(item.id.toString());
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
                                <div className="col-5 text-center">
                                    <label
                                        className="pagination-view-record text-center"
                                        style={{ float: 'right' }}>
                                        Hiển thị{' '}
                                        {this.state.currentPage * this.state.maxResultCount - 9}-
                                        {this.state.currentPage * this.state.maxResultCount} của{' '}
                                        {this.state.totalCount} mục
                                    </label>
                                </div>
                                <div style={{ float: 'right' }} className="col-7 text-center">
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
                <CreateOrEditCustomerDialog
                    visible={this.state.modalVisible}
                    formRef={this.formRef}
                    onCancel={() => {
                        this.setState({
                            modalVisible: false
                        });
                    }}
                    suggestNguonKhach={this.state.suggestNguonKhach}
                    suggestNhomKhach={this.state.suggestNhomKhach}
                    onOk={this.handleSubmit}
                    modalType={
                        this.state.IdKhachHang === ''
                            ? 'Thêm mới khách hàng'
                            : 'Cập nhật thông tin khách hàng'
                    }></CreateOrEditCustomerDialog>
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.onCancelDelete}></ConfirmDelete>
            </div>
        );
    }
}

export default CustomerScreen;
