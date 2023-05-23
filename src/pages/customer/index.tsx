import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import {
    Button,
    ButtonGroup,
    Breadcrumbs,
    Typography,
    Grid,
    Box,
    TextField,
    IconButton,
    Select,
    MenuItem,
    FormControl
} from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import fileIcon from '../../images/file.svg';
import closeIcon from '../../images/close-square.svg';
import avatar from '../../images/avatar.png';
import './customerPage.css';
import fileSmallIcon from '../../images/fi_upload-cloud.svg';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import AddIcon from '../../images/add.svg';
import SearchIcon from '../../images/search-normal.svg';
import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import khachHangService from '../../services/khach-hang/khachHangService';
import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
class Customer extends React.Component {
    state = {
        rowTable: [],
        toggle: false,
        idkhachHang: '',
        rowPerPage: 10,
        pageSkipCount: 0,
        skipCount: 0,
        keyword: '',
        createOrEditKhachHang: {} as CreateOrEditKhachHangDto
    };
    componentDidMount(): void {
        this.getData();
    }
    async getData() {
        const khachHangs = await khachHangService.getAll({
            keyword: this.state.keyword,
            maxResultCount: this.state.rowPerPage,
            skipCount: this.state.skipCount,
            loaiDoiTuong: 0
        });
        this.setState({
            rowTable: khachHangs.items
        });
    }
    async handleSubmit() {
        await khachHangService.createOrEdit(this.state.createOrEditKhachHang);
        this.setState({
            idkhachHang: '',
            rowPerPage: 10,
            pageSkipCount: 0,
            skipCount: 0,
            keyword: '',
            createOrEditKhachHang: {} as CreateOrEditKhachHangDto
        });
        this.getData();
        this.handleToggle();
    }
    handleChange = (event: any) => {
        const { name, value } = event.target;
        this.setState({
            createOrEditKhachHang: {
                ...this.state.createOrEditKhachHang,
                [name]: value
            }
        });
    };
    async createOrUpdateModalOpen(id: string) {
        if (id === '') {
            this.setState({
                idKhachHang: '',
                createOrEditKhachHang: {}
            });
        } else {
            const createOrEdit = await khachHangService.getKhachHang(id);
            this.setState({
                idKhachHang: id,
                createOrEditKhachHang: createOrEdit
            });
        }

        console.log(id);
        this.handleToggle();
    }
    async delete(id: string) {
        await khachHangService.delete(id);
    }
    handleToggle = () => {
        this.setState({
            toggle: !this.state.toggle
        });
    };
    handlePageSizeChange = (pageSize: any) => {
        this.setState({ rowPerPage: pageSize, skipCount: 0 });
        this.getData();
    };
    handlePageChange = (page: any) => {
        const { rowPerPage } = this.state;
        const skipCount = page;
        this.setState({ skipCount });
        // Fetch new data based on the updated page
        // You may need to make an API call here to retrieve the updated data
        this.getData();
    };
    breadcrumbs = [
        <Typography key="1" color="#999699" fontSize="14px">
            Khách hàng
        </Typography>,
        <Typography key="2" color="#333233" fontSize="14px">
            Quản lý khách hàng
        </Typography>
    ];
    columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 50, hideable: false },
        {
            field: 'tenKhachHang',
            headerName: 'Tên khách hàng',
            width: 185,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                    <img
                        src={params.row.avatar}
                        alt="Avatar"
                        style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    {params.value}
                </div>
            )
        },
        { field: 'soDienThoai', headerName: 'Số điện thoại', width: 114 },
        {
            field: 'tenNhomKhach',
            headerName: 'Nhóm khách',
            width: 112
        },
        { field: 'gioiTinh', headerName: 'Giới tính', width: 89 },
        {
            field: 'nhanVienPhuTrach',
            headerName: 'Nhân viên phục vụ',
            width: 185
        },
        {
            field: 'tongChiTieu',
            headerName: 'Tổng chi tiêu',
            width: 113
        },
        {
            field: 'cuocHenGanNhat',
            headerName: 'Cuộc hẹn gần đây',
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                    <DateIcon style={{ marginRight: 4 }} />
                    {new Date(params.value).toLocaleDateString('en-GB')}
                </div>
            ),
            width: 128
        },
        {
            field: 'tenNguonKhach',
            headerName: 'Nguồn',
            width: 86,
            renderCell: (params) => (
                <div className={params.field === 'tenNguonKhach' ? 'last-column' : ''}>
                    {params.value}
                </div>
            )
        }
    ];

    render(): React.ReactNode {
        return (
            <Box
                className="customer-page"
                paddingLeft="2.2222222222222223vw"
                paddingRight="2.2222222222222223vw"
                paddingTop="1.5277777777777777vw">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto">
                        <Breadcrumbs separator="›" aria-label="breadcrumb">
                            {this.breadcrumbs}
                        </Breadcrumbs>
                        <Typography
                            color="#0C050A"
                            variant="h1"
                            fontSize="24px"
                            fontWeight="700"
                            lineHeight="32px"
                            marginTop="4px">
                            Danh sách khách hàng
                        </Typography>
                    </Grid>
                    <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                        <Box component="form" className="form-search">
                            <TextField
                                sx={{
                                    backgroundColor: '#FFFAFF',
                                    borderColor: '#CDC9CD'
                                }}
                                className="search-field"
                                variant="outlined"
                                type="search"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton type="submit">
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>
                        <ButtonGroup
                            variant="contained"
                            sx={{ gap: '8px' }}
                            className="rounded-4px resize-height">
                            <Button
                                className="border-color"
                                variant="outlined"
                                startIcon={<img src={DownloadIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    color: '#666466'
                                }}>
                                Nhập
                            </Button>
                            <Button
                                className="border-color"
                                variant="outlined"
                                startIcon={<img src={UploadIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    color: '#666466',
                                    padding: '10px 16px',
                                    borderColor: '#E6E1E6'
                                }}>
                                Xuất
                            </Button>
                            <Button
                                className="bg-main"
                                onClick={() => {
                                    this.createOrUpdateModalOpen('');
                                }}
                                variant="contained"
                                startIcon={<img src={AddIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    minWidth: '173px'
                                }}>
                                Thêm khách hàng
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
                <div
                    className="customer-page_row-2"
                    style={{ height: 582, width: '100%', marginTop: '24px' }}>
                    <DataGrid
                        rows={this.state.rowTable}
                        columns={this.columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    page: this.state.skipCount,
                                    pageSize: this.state.rowPerPage
                                }
                            }
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                    />
                </div>
                <div
                    className={this.state.toggle ? 'show customer-overlay' : 'customer-overlay'}
                    onClick={this.handleToggle}></div>
                <div className={this.state.toggle ? 'show poppup-add' : 'poppup-add'}>
                    <div className="poppup-title">Thêm khách hàng mới</div>
                    <div className="poppup-des">Thông tin chi tiết</div>
                    <Box component="form" className="form-add">
                        <Grid container className="form-container" spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    size="small"
                                    name="id"
                                    value={this.state.createOrEditKhachHang.id}
                                    fullWidth
                                    hidden></TextField>
                                <Typography color="#4C4B4C" variant="subtitle2">
                                    Họ và tên
                                </Typography>
                                <TextField
                                    size="small"
                                    placeholder="Họ và tên"
                                    name="tenKhachHang"
                                    value={this.state.createOrEditKhachHang.tenKhachHang}
                                    onChange={this.handleChange}
                                    fullWidth
                                    sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="#4C4B4C" variant="subtitle2">
                                    Số điện thoại
                                </Typography>
                                <TextField
                                    type="tel"
                                    size="small"
                                    name="soDienThoai"
                                    value={this.state.createOrEditKhachHang.soDienThoai}
                                    onChange={this.handleChange}
                                    placeholder="Số điện thoại"
                                    fullWidth
                                    sx={{ fontSize: '16px' }}></TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="#4C4B4C" variant="subtitle2">
                                    Địa chỉ
                                </Typography>
                                <TextField
                                    type="text"
                                    size="small"
                                    placeholder="Nhập địa chỉ của khách hàng"
                                    name="diaChi"
                                    value={this.state.createOrEditKhachHang.diaChi}
                                    onChange={this.handleChange}
                                    fullWidth
                                    sx={{ fontSize: '16px' }}></TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="#4C4B4C" variant="subtitle2">
                                    Ngày sinh
                                </Typography>
                                <TextField
                                    type="date"
                                    fullWidth
                                    placeholder="21/04/2004"
                                    name="ngaySinh"
                                    value={this.state.createOrEditKhachHang.ngaySinh || ''}
                                    onChange={this.handleChange}
                                    sx={{ fontSize: '16px' }}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="#4C4B4C" variant="subtitle2">
                                    Giới tính
                                </Typography>
                                <Select
                                    id="gender"
                                    fullWidth
                                    value={this.state.createOrEditKhachHang.gioiTinh || ''}
                                    name="gioiTinh"
                                    onChange={this.handleChange}
                                    sx={{
                                        height: '42px',
                                        backgroundColor: '#fff',
                                        padding: '0',
                                        fontSize: '16px',
                                        borderRadius: '8px',
                                        borderColor: '#E6E1E6'
                                    }}>
                                    <MenuItem value="">Lựa chọn</MenuItem>
                                    <MenuItem value="false">Nữ</MenuItem>
                                    <MenuItem value="true">Nam</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography color="#4C4B4C" variant="subtitle2">
                                    Ghi chú
                                </Typography>
                                <TextareaAutosize
                                    placeholder="Điền"
                                    name="moTa"
                                    value={this.state.createOrEditKhachHang.moTa}
                                    maxRows={4}
                                    minRows={4}
                                    style={{
                                        width: '100%',
                                        borderColor: '#E6E1E6',
                                        borderRadius: '8px',
                                        padding: '16px'
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container sx={{ width: '350px' }} className=" box-1">
                            <Grid item xs={12} className="position-relative">
                                <div className=" inner-box" style={{ textAlign: 'center' }}>
                                    <img src={fileIcon} />
                                    <TextField
                                        type="file"
                                        name="avatar"
                                        value={this.state.createOrEditKhachHang.avatar}
                                        id="input-file"
                                        sx={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    />
                                    <div
                                        style={{
                                            display: 'flex',
                                            marginTop: '34px',
                                            justifyContent: 'center'
                                        }}>
                                        <img src={fileSmallIcon} />
                                        <div>Tải ảnh lên</div>
                                    </div>
                                    <div style={{ color: '#999699', marginTop: '13px' }}>
                                        File định dạng{' '}
                                        <span style={{ color: '#333233' }}>jpeg, png</span>{' '}
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={6}></Grid>
                            <Grid item xs={6}></Grid>
                            <ButtonGroup
                                sx={{
                                    height: '32px',
                                    position: 'absolute',
                                    bottom: '24px',
                                    right: '50px'
                                }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        fontSize: '14px',
                                        textTransform: 'unset',
                                        color: '#fff',
                                        backgroundColor: '#B085A4',
                                        border: 'none'
                                    }}
                                    onClick={() => {
                                        this.handleSubmit();
                                    }}>
                                    Lưu
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        fontSize: '14px',
                                        textTransform: 'unset',
                                        color: '#965C85',
                                        borderColor: '#965C85'
                                    }}>
                                    Hủy
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Box>
                    <Button
                        onClick={this.handleToggle}
                        sx={{
                            position: 'absolute',
                            top: '32px',
                            right: '28px',
                            padding: '0',
                            maxWidth: '24px',
                            minWidth: '0'
                        }}>
                        <img src={closeIcon} />
                    </Button>
                </div>
            </Box>
        );
    }
}
export default Customer;
