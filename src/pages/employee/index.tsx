import React, { Component, FormEventHandler } from 'react';
import './employee.css';
import nhanVienService from '../../services/nhan-vien/nhanVienService';
import NhanSuItemDto from '../../services/nhan-vien/dto/nhanSuItemDto';
import CreateOrEditNhanVienDialog from './components/createOrEditNhanVienDialog';
import '../../custom.css';
import {
    Button,
    Space,
    Modal,
    Input,
    Pagination,
    PaginationProps,
    Row,
    Col,
    FormInstance
} from 'antd';
import { SuggestChucVuDto } from '../../services/suggests/dto/SuggestChucVuDto';
import { CreateOrUpdateNhanSuDto } from '../../services/nhan-vien/dto/createOrUpdateNhanVienDto';
import SuggestService from '../../services/suggests/SuggestService';
import { json } from 'stream/consumers';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import {
    CalendarOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    UploadOutlined
} from '@ant-design/icons';
const { confirm } = Modal;
class EmployeeScreen extends Component {
    formRef = React.createRef<FormInstance>();
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
        this.setState({ filter: filter });
    };

    handlePageChange: PaginationProps['onChange'] = (page) => {
        const { maxResultCount } = this.state;
        this.setState({
            currentPage: page,
            skipCount: page * maxResultCount
        });
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
                createOrEditNhanSu: {
                    id: '',
                    maNhanVien: '',
                    ho: '',
                    tenLot: '',
                    tenNhanVien: '',
                    diaChi: '',
                    soDienThoai: '',
                    cccd: '',
                    ngaySinh: '',
                    kieuNgaySinh: 0,
                    gioiTinh: 0,
                    ngayCap: '',
                    noiCap: '',
                    avatar: '',
                    idChucVu: '',
                    ghiChu: ''
                }
            });
        } else {
            const employee = await nhanVienService.getNhanSu(entityDto);
            this.setState({
                createOrEditNhanSu: employee
            });
            setTimeout(() => {
                this.formRef.current?.setFieldsValue({ ...this.state.createOrEditNhanSu });
            }, 100);
        }

        this.setState({ IdKhachHang: entityDto });
        this.Modal();
    }
    handleSubmit = async () => {
        this.formRef.current?.validateFields().then(async (values: any) => {
            if (this.state.idNhanSu === '') {
                await nhanVienService.createOrEdit(values);
            } else {
                await nhanVienService.createOrEdit({
                    id: this.state.idNhanSu,
                    ...values
                });
            }

            await this.getData();
            this.setState({ modalVisible: false });
            this.formRef.current?.resetFields();
        });
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
            isShowConfirmDelete: !this.state.isShowConfirmDelete,
            idNhanSu: ''
        });
    };

    onOkDelete = () => {
        this.delete(this.state.idNhanSu);
        this.onCancelDelete();
    };
    handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            this.getListNhanVien();
        }
    };
    public render() {
        return (
            <div className="container-fluid h-100 bg-white">
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
                                                Quản lý nhân viên
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                <div>
                                    <h3>Danh sách nhân viên</h3>
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
                                        Thêm nhân viên
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
                                            <CalendarOutlined />
                                            {new Date(item.ngaySinh).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="text-td-table">
                                            {item.gioiTinh === 0
                                                ? 'Khác'
                                                : item.gioiTinh === 1
                                                ? 'Nam'
                                                : 'Nữ'}
                                        </td>
                                        <td className="text-td-table">{item.diaChi}</td>
                                        <td className="text-td-table">{item.tenChucVu}</td>
                                        <td className="text-td-table">
                                            <CalendarOutlined />
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
                                                        this.createOrUpdateModalOpen(item.id);
                                                    }}
                                                />
                                                <Button
                                                    danger
                                                    icon={<DeleteOutlined />}
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
                            <div className="row align-items-center" style={{ height: '50px' }}>
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
                                    <Space size={'middle'} className="align-items-center">
                                        <Pagination
                                            total={this.state.totalNhanVien}
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
                <CreateOrEditNhanVienDialog
                    visible={this.state.modalVisible}
                    onCancel={this.onCloseDialog}
                    onOk={this.handleSubmit}
                    modalType={
                        this.state.idNhanSu === ''
                            ? 'Thêm mới nhân viên'
                            : 'Cập nhật thông tin nhân viên'
                    }
                    suggestChucVu={this.state.suggestChucVu}
                    formRef={this.formRef}></CreateOrEditNhanVienDialog>
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.onCancelDelete}></ConfirmDelete>
            </div>
        );
    }
}

export default EmployeeScreen;
