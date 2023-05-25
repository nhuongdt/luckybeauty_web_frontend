import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {
    Button,
    Checkbox,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { Component, ReactNode } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ChiNhanhDto } from '../../../services/chi_nhanh/Dto/chiNhanhDto';
import chiNhanhService from '../../../services/chi_nhanh/chiNhanhService';
import CreateOrEditChiNhanhModal from './components/create-or-edit-chi-nhanh';
import { CreateOrEditChiNhanhDto } from '../../../services/chi_nhanh/Dto/createOrEditChiNhanhDto';
import Cookies from 'js-cookie';
import AppConsts from '../../../lib/appconst';

class ChiNhanhScreen extends Component {
    state = {
        idChiNhanh: '',
        isShowModal: false,
        createOrEditChiNhanhDto: {} as CreateOrEditChiNhanhDto,
        listChiNhanh: [] as ChiNhanhDto[]
    };
    async componentDidMount() {
        this.InitData();
    }
    async InitData() {
        const lstChiNhanh = await chiNhanhService.GetAll({
            keyword: '',
            maxResultCount: 10,
            skipCount: 0
        });
        this.setState({
            listChiNhanh: lstChiNhanh.items
        });
    }
    handleSubmit = async () => {
        await chiNhanhService.CreateOrEdit(this.state.createOrEditChiNhanhDto);
    };
    Modal = () => {
        this.setState({ isShowModal: !this.state.isShowModal });
    };
    createOrEditShowModal = async (idChiNhanh: string) => {
        if (idChiNhanh === '') {
            const idCuaHang = Cookies.get('IdCuaHang')?.toString() ?? '';
            this.setState({
                idChiNhanh: '',
                createOrEditChiNhanhDto: {
                    id: AppConsts.guidEmpty,
                    idCongTy: idCuaHang,
                    maChiNhanh: '',
                    tenChiNhanh: '',
                    soDienThoai: '',
                    diaChi: '',
                    maSoThue: '',
                    logo: '',
                    ghiChu: '',
                    ngayHetHan: new Date(),
                    ngayApDung: new Date(),
                    trangThai: 0
                }
            });
        } else {
            const createOrEdit = await chiNhanhService.GetForEdit(idChiNhanh);
            this.setState({
                idChiNhanh: idChiNhanh,
                createOrEditChiNhanhDto: createOrEdit
            });
        }
        this.Modal();
    };
    onCloseModal = () => {
        this.setState({ isShowModal: false });
    };
    handleChange = (event: any) => {
        const { name, value } = event.target;
        this.setState({
            createOrEditChiNhanhDto: {
                ...this.state.createOrEditChiNhanhDto,
                [name]: value
            }
        });
    };
    render(): ReactNode {
        return (
            <div>
                <div className="row mt-2 mb-4">
                    <div className="col offset-6">
                        <Button
                            onClick={() => {
                                this.createOrEditShowModal('');
                            }}
                            style={{ float: 'right', background: '#7C3367', height: '40px' }}
                            startIcon={<AddOutlinedIcon />}>
                            <span style={{ color: '#FFFAFF', fontSize: 14 }}>Thêm mới</span>
                        </Button>
                    </div>
                </div>
                <div style={{ height: '48px', background: '#F2EBF0' }} className="row">
                    <div className="col pl-2 align-items-center"></div>
                    <div className="col pr-2"></div>
                </div>
                <div>
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
                                    <TableCell className="text-td-table">Tên chi nhánh</TableCell>
                                    <TableCell
                                        className="text-td-table"
                                        align="left"
                                        style={{ width: '300px' }}>
                                        Địa chỉ
                                    </TableCell>
                                    <TableCell
                                        className="text-td-table"
                                        align="left"
                                        style={{ width: '150px' }}>
                                        Số điện thoại
                                    </TableCell>
                                    <TableCell
                                        className="text-td-table"
                                        align="center"
                                        style={{ width: '150px' }}>
                                        Ngày áp dụng
                                    </TableCell>
                                    <TableCell
                                        className="text-td-table"
                                        style={{ width: '150px' }}
                                        align="center">
                                        Ngày hết hạn
                                    </TableCell>
                                    <TableCell style={{ width: '50px' }} align="center">
                                        #
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.listChiNhanh.map((item, length) => {
                                    return (
                                        <TableRow style={{ height: '48px' }}>
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
                                                {item.tenChiNhanh}
                                            </TableCell>
                                            <TableCell
                                                style={{ height: '48px' }}
                                                align="left"
                                                className="text-th-table">
                                                {item.diaChi}
                                            </TableCell>
                                            <TableCell
                                                style={{ height: '48px' }}
                                                align="left"
                                                className="text-th-table">
                                                {item.soDienThoai}
                                            </TableCell>
                                            <TableCell
                                                style={{ height: '48px' }}
                                                align="center"
                                                className="text-th-table">
                                                {new Date(
                                                    item.ngayApDung.toString()
                                                ).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell
                                                style={{ height: '48px' }}
                                                align="center"
                                                className="text-th-table">
                                                {new Date(
                                                    item.ngayHetHan.toString()
                                                ).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell
                                                style={{ height: '48px', width: '50px' }}
                                                align="right">
                                                <IconButton>
                                                    <BsThreeDotsVertical />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <CreateOrEditChiNhanhModal
                    title={this.state.idChiNhanh == '' ? 'Thêm mới' : 'Cập nhật'}
                    formRef={this.state.createOrEditChiNhanhDto}
                    isShow={this.state.isShowModal}
                    onCLose={this.onCloseModal}
                    onSave={this.handleSubmit}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}
export default ChiNhanhScreen;
