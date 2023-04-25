import React, { Component, FormEventHandler, useState } from "react";
import nhanVienService from "../../services/nhan-vien/nhanVienService";
import { Guid } from "guid-typescript";
import { Pagination, Stack } from "@mui/material";
import CreateOrEditCustomerDialog from "./create-or-edit-customer-modal";
import { KhachHangItemDto } from "../../services/khach-hang/dto/KhachHangItemDto";
import khachHangService from "../../services/khach-hang/khachHangService";
import { DeleteSharp, SyncOutlined } from "@mui/icons-material";
import { Button, Space } from "antd";
import SuggestService from "../../services/suggests/SuggestService";
import { SuggestNhomKhachDto } from "../../services/suggests/dto/SuggestNhomKhachDto";
import { SuggestNguonKhachDto } from "../../services/suggests/dto/SuggestNguonKhachDto";
import { CreateOrEditKhachHangDto } from "../../services/khach-hang/dto/CreateOrEditKhachHangDto";
import "../employee/employee.css";
import '../../custom.css'
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from '@mui/icons-material/Add';
import ConfirmDelete from "../../components/AlertDialog/ConfirmDelete";
class CustomerScreen extends Component {
  state = {
    IdKhachHang: "",
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    tenantId: 0,
    filter: "",
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
      suggestNguonKhach: nguonKhachs,
    });
    if (this.state.IdKhachHang !== "") {
      const khachHang = await khachHangService.getKhachHang(
        this.state.IdKhachHang
      );
      console.log(khachHang);
      this.setState({ createOrEditKhachHang: khachHang });
    }
    this.getListKhachHang();
  }
  async getListKhachHang() {
    const data = await khachHangService.getAll({
      keyword: this.state.filter,
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
    });
    this.setState({
      listKhachHang: data.items,
      totalCount: data.totalCount,
      totalPage: Math.ceil(data.totalCount / this.state.maxResultCount),
    });
  }
  async delete(id: string) {
    await khachHangService.delete(id);
    this.getData();
  }
  handleSearch: FormEventHandler<HTMLInputElement> = (event: any) => {
    const filter = event.target.value;
    this.setState({ filter }, async () => this.getListKhachHang());
  };

  handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const { maxResultCount } = this.state;
    this.setState({
      currentPage: value,
      skipCount: value,
      startIndex: (value - 1 <= 0 ? 0 : value - 1) * maxResultCount,
    });
    this.getData();
  };

  onOpenDialog = () => {
    this.getData();
    this.setState({
      modalVisible: true,
    });
  };
  onCloseDialog = () => {
    this.setState({
      modalVisible: false,
    });
    this.getData();
  };
  onCancelDelete= ()=>{
    this.setState({
      isShowConfirmDelete: !this.state.isShowConfirmDelete
    })
  }

  onOkDelete =()=>{
    this.delete(this.state.IdKhachHang)
    this.getData()
    this.onCancelDelete()
  }
  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    this.setState({
      createOrEditKhachHang: {
        ...this.state.createOrEditKhachHang,
        [name]: value,
      },
    });
  };

  handelSubmit = () => {
    console.log(this.state.createOrEditKhachHang);
    if (this.state.IdKhachHang === "") {
      khachHangService.create(this.state.createOrEditKhachHang);
    } else {
      khachHangService.update(this.state.createOrEditKhachHang);
    }
    this.onCloseDialog();
  };

  
  public render() {
    return (
      <div className="container bg-white">
        <div className="page-header">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <div>
              <div className="pt-2">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item active" aria-current="page">
                      Khách hàng
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Quản lý khách hàng
                    </li>
                  </ol>
                </nav>
              </div>
              <div>
                <h3>Danh sách khách hàng</h3>
              </div>
            </div>
            <div>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={1}
              >
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
                  spacing={1}
                >
                  <Button className="btn-import">
                    <i className="fa fa-home"></i> Nhập
                  </Button>
                  <Button className="btn-export">
                    <i className="fa fa-home"></i> Xuất
                  </Button>
                </Stack>
                <Button className="btn btn-add-item" onClick={this.onOpenDialog}>Thêm khách hàng</Button>
              </Stack>
            </div>
          </Stack>
        </div>
        <div className="page-content pt-2">
          <table className="h-100 w-100 table table-border-0 table">
            <thead className="bg-table w-100">
              <tr style={{ height: "48px" }}>
                <th className="text-center">
                  <input
                    className="text-th-table text-center"
                    type="checkbox"
                  />
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
                    <td className="text-td-table">
                      {item.tenKhachHang.toString()}
                    </td>
                    <td className="text-td-table">{item.soDienThoai}</td>
                    <td className="text-td-table">{item.tenNhomKhach}</td>
                    <td className="text-td-table">{item.nhanVienPhuTrach}</td>
                    <td className="text-td-table">{item.tongChiTieu}</td>
                    <td className="text-td-table">
                      <CalendarMonthIcon fontSize="small" />{" "}
                      {new Date(
                        item.cuocHenGanNhat.toString()
                      ).toLocaleDateString("en-GB")}
                    </td>
                    <td className="text-secondary">{item.tenNguonKhach}</td>
                    <td className="text-td-table" style={{width: '150px'}}>
                      <Space wrap direction="horizontal">
                        <Button
                          type="primary"
                          icon={<SyncOutlined />}
                          onClick={() => {
                            this.setState({
                              IdKhachHang: item.id.toString(),
                            });
                            this.onOpenDialog();
                          }}
                        />
                        <Button
                          danger
                          icon={<DeleteSharp />}
                          onClick={() => {
                            this.setState({
                              IdKhachHang: item.id.toString(),
                            });
                            this.onCancelDelete()
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
            <div className="col-6" style={{ float: "left" }}></div>
            <div className="col-6" style={{ float: "right" }}>
              <div className="row">
                <div className="col-5 align-items-center">
                  <label
                    className="pagination-view-record align-items-center"
                    style={{ float: "right" }}
                  >
                    Hiển thị{" "}
                    {this.state.currentPage * this.state.maxResultCount - 9}-
                    {this.state.currentPage * this.state.maxResultCount} của{" "}
                    {this.state.totalCount} mục
                  </label>
                </div>
                <div style={{ float: "right" }} className="col-7">
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
        <CreateOrEditCustomerDialog
          modalVisible={this.state.modalVisible}
          onCloseDialog={this.onCloseDialog}
          id={this.state.IdKhachHang}
          createOrEditKhachHang={this.state.createOrEditKhachHang}
          suggestNguonKhach={this.state.suggestNguonKhach}
          suggestNhomKhach={this.state.suggestNhomKhach}
          handleChange={this.handleChange}
          handleSubmit={this.handelSubmit}
        ></CreateOrEditCustomerDialog>
        <ConfirmDelete isShow={this.state.isShowConfirmDelete} onOk={this.onOkDelete} onCancel={this.onCancelDelete}>

        </ConfirmDelete>
      </div>
    );
  }
}

export default CustomerScreen;
