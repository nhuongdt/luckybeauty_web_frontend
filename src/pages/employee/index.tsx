import React, { Component, FormEventHandler } from 'react';
import './employee.css';
import nhanVienService from '../../services/nhan-vien/nhanVienService';
import { Guid } from 'guid-typescript';
import NhanSuItemDto from '../../services/nhan-vien/dto/nhanSuItemDto';
import { Pagination, Stack } from '@mui/material';
import CreateOrEditNhanVienDialog from './createOrEditNhanVienDialog';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import '../../custom.css';
import { Button, Space, Modal } from 'antd';
import { SuggestChucVuDto } from '../../services/suggests/dto/SuggestChucVuDto';
import { CreateOrUpdateNhanSuDto } from '../../services/nhan-vien/dto/createOrUpdateNhanVienDto';
import SuggestService from '../../services/suggests/SuggestService';
import { json } from 'stream/consumers';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
const { confirm } = Modal;
class EmployeeScreen extends Component {
    state = {
        idNhanSu: '',
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        tenantId: 0,
        filter: '',
        listNhanVien: [] as NhanSuItemDto[],
        suggestChucVu: [] as SuggestChucVuDto[],
        createOrEditNhanSu: {} as CreateOrUpdateNhanSuDto,
        totalNhanVien: 0,
        currentPage: 1,
        totalPage: 1,
        isShowConfirmDelete: false
    };
    async componentDidMount() {
        this.getData();
    }
    resetData() {
        this.setState({
            idNhanSu: '',
            modalVisible: false,
            maxResultCount: 10,
            skipCount: 0,
            filter: '',
            createOrEditNhanSu: {} as CreateOrUpdateNhanSuDto,
            totalNhanVien: 0,
            currentPage: 1,
            totalPage: 1,
            isShowConfirmDelete: false
        });
    }
    async getData() {
        const suggestChucVus = await SuggestService.SuggestChucVu();
        this.setState({
            suggestChucVu: suggestChucVus
        });
        if (this.state.idNhanSu !== '') {
            const nhanSuDto = await nhanVienService.getNhanSu(this.state.idNhanSu);
            this.setState({
                createOrEditNhanSu: nhanSuDto
            });
        }
        this.getListNhanVien();
    }
    async getListNhanVien() {
        const { filter, skipCount, maxResultCount } = this.state;
        const input = { skipCount, maxResultCount };
        const data = await nhanVienService.search(filter, input);
        this.setState({
            listNhanVien: data.items,
            totalNhanVien: data.totalCount,
            totalPage: Math.ceil(data.totalCount / maxResultCount)
        });
    }
    async createOrEdit() {
        nhanVienService.createOrEdit(this.state.createOrEditNhanSu);
    }
    async delete(id: string) {
        await nhanVienService.delete(id);
        this.getListNhanVien();
        this.resetData();
    }
    handleSearch: FormEventHandler<HTMLInputElement> = (event: any) => {
        const filter = event.target.value;
        this.setState({ filter }, async () => this.getListNhanVien());
        this.resetData();
    };

    handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        const { maxResultCount } = this.state;
        this.setState({
            currentPage: value,
            skipCount: value * maxResultCount
        });
    };
    handleSubmit = () => {
        console.log(JSON.stringify(this.state.createOrEditNhanSu));
        nhanVienService.createOrEdit(this.state.createOrEditNhanSu);
        this.onCloseDialog();
        this.resetData();
    };
    handleChange = (event: React.ChangeEvent<any>): void => {
        const { name, value } = event.target;
        this.setState({
            createOrEditNhanSu: {
                ...this.state.createOrEditNhanSu,
                [name]: value
            }
        });
    };

    onOpenDialog = () => {
        this.getData();
        this.setState({
            modalVisible: true
        });
    };
    onCloseDialog = () => {
        this.setState({
            modalVisible: false
        });
        this.getData();
        this.resetData();
    };

    onCancelDelete = () => {
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };

    onOkDelete = () => {
        this.delete(this.state.idNhanSu);
        this.getData();
        this.onCancelDelete();
    };

    public render() {
        return (
            <div className="container-fluid h-100 bg-light">
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
                                            Nhân viên
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Quản lý nhân viên
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                            <div>
                                <h3>Nhân viên</h3>
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
                                        onChange={this.handleSearch}
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
                                        this.resetData();
                                        this.onOpenDialog();
                                    }}>
                                    Thêm nhân viên
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
                                <th className="text-th-table">Tên nhân viên</th>
                                <th className="text-th-table">Số điện thoại</th>
                                <th className="text-th-table">Ngày sinh</th>
                                <th className="text-th-table">Giới tính</th>
                                <th className="text-th-table">Đia chỉ</th>
                                <th className="text-th-table">Vị trí</th>
                                <th className="text-th-table">Ngày tham gia</th>
                                <th className="text-th-table">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.listNhanVien.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="text-center">
                                            <input type="checkbox" />
                                        </td>
                                        <td className="text-td-table">{(index += 1)}</td>
                                        <td className="text-td-table">{item.tenNhanVien}</td>
                                        <td className="text-td-table">{item.soDienThoai}</td>
                                        <td className="text-td-table">
                                            <></>
                                            <CalendarMonthIcon fontSize="small" />{' '}
                                            {new Date(item.ngaySinh).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="text-td-table">
                                            {item.gioiTinh === 0 ? 'Nam' : 'Nữ'}
                                        </td>
                                        <td className="text-td-table">{item.diaChi}</td>
                                        <td className="text-td-table">{item.tenChucVu}</td>
                                        <td className="text-td-table">
                                            <CalendarMonthIcon fontSize="small" />{' '}
                                            {new Date(item.ngayVaoLam).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="text-td-table" style={{ width: '150px' }}>
                                            <Space wrap direction="horizontal">
                                                <Button
                                                    type="primary"
                                                    icon={<EditOutlined />}
                                                    onClick={() => {
                                                        this.setState({
                                                            idNhanSu: item.id
                                                        });
                                                        this.onOpenDialog();
                                                    }}
                                                />
                                                <Button
                                                    danger
                                                    icon={<DeleteOutline />}
                                                    onClick={() => {
                                                        this.setState({
                                                            idNhanSu: item.id
                                                        });
                                                        this.onCancelDelete();
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
                                        {this.state.totalNhanVien} mục
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
                <CreateOrEditNhanVienDialog
                    modalVisible={this.state.modalVisible}
                    onCloseDialog={this.onCloseDialog}
                    handleSubmit={this.handleSubmit}
                    suggestChucVu={this.state.suggestChucVu}
                    handleChange={this.handleChange}
                    idNhanSu={this.state.idNhanSu}
                    createOrEditNhanSu={this.state.createOrEditNhanSu}></CreateOrEditNhanVienDialog>
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.onCancelDelete}></ConfirmDelete>
            </div>
        );
    }
}

export default EmployeeScreen;
