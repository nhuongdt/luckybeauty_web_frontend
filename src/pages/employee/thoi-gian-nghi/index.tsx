import { Component, ReactNode } from 'react';
import { useFormik } from 'formik';
import { Button, Col, FormInstance, Input, Row, Space } from 'antd';
import { format } from 'date-fns';
import { DownloadOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import '../../../custom.css';
import React from 'react';
import { NgayNghiLeDto } from '../../../services/ngay_nghi_le/dto/NgayNghiLeDto';
import ngayNghiLeService from '../../../services/ngay_nghi_le/ngayNghiLeService';
import { CreateOrEditNgayNghiLeDto } from '../../../services/ngay_nghi_le/dto/createOrEditNgayNghiLe';
import {
    Checkbox,
    IconButton,
    Menu,
    MenuItem,
    Pagination,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import CreateOrEditThoiGianNghi from './create-or-edit-thoi-gian-nghi';
import { BsThreeDotsVertical } from 'react-icons/bs';
class EmployeeHoliday extends Component {
    state = {
        IdHoliday: '',
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        filter: '',
        listHoliday: [] as NgayNghiLeDto[],
        createOrEditNgayNghiLe: {
            id: '',
            tenNgayLe: '',
            tuNgay: new Date(),
            denNgay: new Date()
        } as CreateOrEditNgayNghiLeDto,
        totalCount: 0,
        currentPage: 1,
        totalPage: 1,
        startIndex: 0,
        isShowConfirmDelete: false,
        sortColumn: null,
        sortDirection: 'asc',
        anchorEl: null
    };
    async componentDidMount() {
        this.getData();
        this.getListHoliday();
    }
    async getData() {
        if (this.state.IdHoliday !== '') {
            const holiday = await ngayNghiLeService.getForEdit(this.state.IdHoliday);
            this.setState({ createOrEditNgayNghiLe: holiday });
        }
        //this.getListHoliday();
    }
    async getListHoliday() {
        const data = await ngayNghiLeService.getAll({
            keyword: this.state.filter,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount
        });
        this.setState({
            listHoliday: data.items,
            totalCount: data.totalCount,
            totalPage: Math.ceil(data.totalCount / this.state.maxResultCount)
        });
    }
    handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        const { maxResultCount } = this.state;
        this.setState({
            currentPage: value,
            skipCount: value
        });
    };
    handleSubmit = () => {
        console.log('submit');
    };
    handleClick = () => {
        console.log('ok');
    };
    handleSearch = () => {
        console.log('ok');
    };
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            IdHoliday: ''
        });
        this.getData();
        this.getListHoliday();
    };
    createOrUpdateModalOpen = async (id: string) => {
        this.setState({
            IdHoliday: id
        });
        if (id !== '') {
            const holiday = await ngayNghiLeService.getForEdit(id);
            this.setState({ createOrEditNgayNghiLe: holiday });
        } else {
            this.setState({
                createOrEditNgayNghiLe: {
                    id: '',
                    tenNgayLe: '',
                    tuNgay: new Date(),
                    denNgay: new Date()
                }
            });
        }
        this.Modal();
    };
    handleSort = (property: keyof NgayNghiLeDto) => {
        const { listHoliday, sortColumn, sortDirection } = this.state;

        let newSortDirection = 'asc';
        if (sortColumn === property && sortDirection === 'asc') {
            newSortDirection = 'desc';
        }

        const sortedList = [...listHoliday].sort((a, b) => {
            const valueA = a[property];
            const valueB = b[property];

            if (valueA < valueB) {
                return newSortDirection === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return newSortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        this.setState({
            listHoliday: sortedList,
            sortColumn: property,
            sortDirection: newSortDirection
        });
    };
    handleMenuOpen = (event: any) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: null, IdHoliday: '' });
    };
    render() {
        return (
            <div className="container-fluid h-100 bg-white" style={{ height: '100%' }}>
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
                                                Nhân viên
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page">
                                                Thời gian nghỉ
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                <div>
                                    <h3>Quản lý thời gian nghỉ</h3>
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
                                        Thêm ngày lễ mới
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="page-content pt-2">
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table" size="small">
                            <TableHead className="bg-table">
                                <TableRow style={{ height: '48px' }}>
                                    <TableCell
                                        padding="checkbox"
                                        align="center"
                                        className="text-td-table">
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell className="text-td-table" align="center">
                                        STT
                                    </TableCell>
                                    <TableCell
                                        className="text-td-table"
                                        onClick={() => this.handleSort('tenNgayLe')}>
                                        Tên ngày lễ
                                        {this.state.sortColumn === 'tenNgayLe' && (
                                            <span style={{ marginLeft: 3 }}>
                                                {this.state.sortDirection === 'asc' ? ' ▲' : ' ▼'}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell
                                        className="text-td-table"
                                        align="left"
                                        onClick={() => this.handleSort('tuNgay')}>
                                        Ngày bắt đầu
                                        {this.state.sortColumn === 'tuNgay' && (
                                            <span style={{ marginLeft: 3 }}>
                                                {this.state.sortDirection === 'asc' ? ' ▲' : ' ▼'}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell
                                        className="text-td-table"
                                        align="left"
                                        onClick={() => this.handleSort('denNgay')}>
                                        Ngày kết thúc
                                    </TableCell>
                                    <TableCell
                                        className="text-td-table"
                                        align="center"
                                        onClick={() => this.handleSort('tongSoNgay')}>
                                        Tổng số ngày
                                        {this.state.sortColumn === 'tongSoNgay' && (
                                            <span style={{ marginLeft: 3 }}>
                                                {this.state.sortDirection === 'asc' ? ' ▲' : ' ▼'}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell style={{ width: '50px' }} align="center">
                                        #
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.listHoliday.map((item, length) => {
                                    return (
                                        <TableRow
                                            key={item.tenNgayLe}
                                            sx={{
                                                '&:last-child td, &:last-child th': {
                                                    border: 0,
                                                    height: '48px'
                                                }
                                            }}>
                                            <TableCell
                                                style={{ height: '48px' }}
                                                align="center"
                                                padding="checkbox"
                                                className="text-th-table">
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell
                                                style={{ height: '48px' }}
                                                component="th"
                                                scope="row"
                                                align="center"
                                                className="text-th-table">
                                                {length + 1}
                                            </TableCell>
                                            <TableCell
                                                style={{ height: '48px' }}
                                                className="text-th-table">
                                                {item.tenNgayLe}
                                            </TableCell>
                                            <TableCell
                                                style={{ height: '48px' }}
                                                align="left"
                                                className="text-th-table">
                                                {new Date(
                                                    item.tuNgay.toString()
                                                ).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell
                                                style={{ height: '48px' }}
                                                align="left"
                                                className="text-th-table">
                                                {new Date(
                                                    item.denNgay.toString()
                                                ).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell
                                                style={{ height: '48px' }}
                                                align="center"
                                                className="text-th-table">
                                                {item.tongSoNgay} ngày
                                            </TableCell>
                                            <TableCell
                                                style={{ height: '48px', width: '50px' }}
                                                align="right">
                                                <IconButton onClick={this.handleMenuOpen}>
                                                    <BsThreeDotsVertical />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={this.state.anchorEl}
                                                    open={Boolean(this.state.anchorEl)}
                                                    onClose={this.handleMenuClose}>
                                                    <MenuItem
                                                        onClick={() => {
                                                            this.createOrUpdateModalOpen(item.id);
                                                        }}>
                                                        Edit
                                                    </MenuItem>
                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                <CreateOrEditThoiGianNghi
                    visible={this.state.modalVisible}
                    title="Thêm mới"
                    onOk={() => {
                        console.log('ok');
                        this.getListHoliday();
                    }}
                    onCancel={() => {
                        this.Modal();
                    }}
                    createOrEditDto={this.state.createOrEditNgayNghiLe}></CreateOrEditThoiGianNghi>
            </div>
        );
    }
}
export default EmployeeHoliday;
