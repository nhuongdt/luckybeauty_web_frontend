import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { getDataGridUtilityClass } from '@mui/x-data-grid';
import { Avatar, Col, Form, Input, Row, Space, Typography, Upload } from 'antd';
import { ChangeEvent, Component, ReactNode } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import { EditCuaHangDto } from '../../../services/cua_hang/Dto/EditCuaHangDto';
import { Button, Grid, TextField } from '@mui/material';
import cuaHangService from '../../../services/cua_hang/cuaHangService';
import Cookies from 'js-cookie';
const { Title } = Typography;
const { Dragger } = Upload;
class StoreDetail extends Component {
    state = {
        editCuaHang: {
            id: '',
            diaChi: '',
            facebook: '',
            ghiChu: '',
            instagram: '',
            logo: '',
            maSoThue: '',
            soDienThoai: '',
            tenCongTy: '',
            twitter: '',
            website: ''
        } as EditCuaHangDto
    };
    async getData() {
        const idChiNhanh = Cookies.get('IdChiNhanh')?.toString() ?? '';
        const cuaHang = await cuaHangService.getCongTyEdit(idChiNhanh);
        console.log(cuaHang);
        this.setState({
            editCuaHang: cuaHang
        });
    }
    async componentDidMount() {
        await this.getData();
        console.log(this.state.editCuaHang);
    }
    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({
            editCuaHang: {
                ...this.state.editCuaHang,
                [name]: value
            }
        });
    };
    handSubmit = async () => {
        await cuaHangService.Update(this.state.editCuaHang);
    };
    render(): ReactNode {
        const { editCuaHang } = this.state;
        return (
            <div className="container-fluid bg-white">
                <form>
                    <div style={{ height: '70px' }}>
                        <Grid container>
                            <Grid item xs={6}>
                                <div>
                                    <div className="pt-2">
                                        <div>
                                            <h4>Chi tiết cửa hàng</h4>
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{ float: 'right' }}>
                                    <Space align="center" size="middle">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{ color: '#FFFAFF', background: '#7C3367' }}
                                            onClick={this.handSubmit}>
                                            Cập nhật
                                        </Button>
                                    </Space>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="page-content pt-2">
                        <form>
                            <Grid container spacing={4}>
                                <Grid item xs={4}>
                                    <Dragger height={233}>
                                        <Title level={5}>Logo cửa hàng</Title>
                                        <p className="ant-upload-drag-icon">
                                            <Avatar
                                                icon={<AiOutlineCamera size={50} />}
                                                style={{
                                                    width: '100px',
                                                    height: '100px'
                                                }}></Avatar>
                                        </p>
                                        <p className="ant-upload-hint">
                                            Định dạng *.jpeg, *.jpg, *.png
                                        </p>
                                        <p className="ant-upload-hint">Kích thước tối thiểu 3M</p>
                                    </Dragger>
                                </Grid>
                                <Grid item xs={8}>
                                    <Title level={5}>Thông tin cửa hàng</Title>
                                    <Grid container spacing={1} className="mt-2">
                                        <Grid item xs={6}>
                                            <label>Tên công ty</label>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                name="tenCongTy"
                                                placeholder="Nhập tên"
                                                onChange={this.handleChange}
                                                value={editCuaHang.tenCongTy}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <label>Địa chỉ</label>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                name="diaChi"
                                                placeholder="Nhập địa chỉ"
                                                onChange={this.handleChange}
                                                value={editCuaHang.diaChi}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} className="mt-2">
                                        <Grid item xs={6}>
                                            <label>Số điện thoại</label>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                name="soDienThoai"
                                                placeholder="Nhập số điện thoại"
                                                onChange={this.handleChange}
                                                value={editCuaHang.soDienThoai}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <label>Mã số thuế</label>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                name="maSoThue"
                                                placeholder="Nhập mã số thuế"
                                                onChange={this.handleChange}
                                                value={editCuaHang.maSoThue}
                                            />
                                        </Grid>
                                    </Grid>
                                    <hr></hr>
                                    <Title level={5}>Liên kết trực tuyến</Title>
                                    <Grid container spacing={1} className="mt-2">
                                        <Grid item xs={6}>
                                            <label>Website</label>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                name="website"
                                                placeholder="Website"
                                                onChange={this.handleChange}
                                                value={editCuaHang.website}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <label>Facebook</label>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                name="facebook"
                                                placeholder="Facebook"
                                                onChange={this.handleChange}
                                                value={editCuaHang.facebook}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} className="mt-2">
                                        <Grid item xs={6}>
                                            <label>Instagram</label>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                name="instagram"
                                                placeholder="Instagram"
                                                onChange={this.handleChange}
                                                value={editCuaHang.instagram}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <label>Twitter</label>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                name="twitter"
                                                placeholder="twitter"
                                                onChange={this.handleChange}
                                                value={editCuaHang.twitter}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </form>
            </div>
        );
    }
}
export default StoreDetail;
