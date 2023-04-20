import React, { Component, FormEventHandler } from 'react';
import './employee.css';
import nhanVienService from '../../services/nhan-vien/nhanVienService';
import { Guid } from 'guid-typescript';
import NhanSuItemDto from '../../services/nhan-vien/dto/nhanSuItemDto';
import { Pagination, Stack } from '@mui/material';
import CreateOrEditNhanVienDialog from './createOrEditNhanVienDialog';

class EmployeeScreen extends Component {
    state = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        tenantId: 0,
        filter: '',
        listNhanVien: [] as NhanSuItemDto[],
        totalNhanVien: 0,
        currentPage: 1,
        totalPage: 1
    };
    async componentDidMount() {
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
    async delete(id: Guid) {
        await nhanVienService.delete(id);
        this.getListNhanVien();
    }
    handleSearch: FormEventHandler<HTMLInputElement> = (event: any) => {
        const filter = event.target.value;
        this.setState({ filter }, async () => this.getListNhanVien());
    };

    handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        const { maxResultCount } = this.state;
        this.setState({
            currentPage: value,
            skipCount: value * maxResultCount
        });
    };

    onOpenDialog = () => {
        this.setState({
            modalVisible: true
        });
    };
    onCloseDialog = () => {
        this.setState({
            modalVisible: false
        });
    };

    public render() {
        return (
            <div className="container-fluid h-100 bg-light">
                <div className="page-header">
                    <div className="row">
                        <div className="col-6" style={{ float: 'left' }}>
                            <div className="pt-3">
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
                        <div className="col-6 d-flex align-items-center" style={{ float: 'right' }}>
                            <div className="row">
                                <div className="col-4">
                                    <div className="search w-100">
                                        <i className="fa-thin fa-magnifying-glass"></i>
                                        <input
                                            type="text"
                                            onChange={this.handleSearch}
                                            className="form-control"
                                            placeholder="Have a question? Ask Now"
                                        />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="row">
                                        <div className="col-6">
                                            <button className="btn border">
                                                <i className="fa fa-home"></i> Home
                                            </button>
                                        </div>
                                        <div className="col-6">
                                            <button className="btn border">
                                                <i className="fa fa-home"></i> Home
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <button
                                        className="btn border btn-danger"
                                        onClick={this.onOpenDialog}>
                                        <i className="fas-ho"></i> Thêm mới nhân viên
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-content pt-5">
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
                                    <tr>
                                        <td className="text-center">
                                            <input type="checkbox" />
                                        </td>
                                        <td className="text-td-table">{(index += 1)}</td>
                                        <td className="text-td-table">
                                            {item.tenNhanVien.toString()}
                                        </td>
                                        <td className="text-td-table">{item.soDienThoai}</td>
                                        <td className="text-td-table">{item.ngaySinh}</td>
                                        <td className="text-td-table">
                                            {item.gioiTinh === 0 ? 'Nam' : 'Nữ'}
                                        </td>
                                        <td className="text-td-table">{item.diaChi}</td>
                                        <td className="text-td-table">{item.tenChucVu}</td>
                                        <td className="text-td-table">{item.ngayVaoLam}</td>
                                        <td className="text-td-table">Xóa</td>
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
                    onCloseDialog={this.onCloseDialog}></CreateOrEditNhanVienDialog>
            </div>
        );
    }
}

export default EmployeeScreen;
