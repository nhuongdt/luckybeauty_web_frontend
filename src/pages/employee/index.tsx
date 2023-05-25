import FilterAltIcon from '@mui/icons-material/FilterAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';
import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import AddIcon from '../../images/add.svg';
import SearchIcon from '../../images/search-normal.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import avatar from '../../images/avatar.png';
import { Component } from 'react';
import NhanSuItemDto from '../../services/nhan-vien/dto/nhanSuItemDto';
import { SuggestChucVuDto } from '../../services/suggests/dto/SuggestChucVuDto';
import { CreateOrUpdateNhanSuDto } from '../../services/nhan-vien/dto/createOrUpdateNhanVienDto';
import Cookies from 'js-cookie';
import nhanVienService from '../../services/nhan-vien/nhanVienService';
import SuggestService from '../../services/suggests/SuggestService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
    Avatar,
    Box,
    Breadcrumbs,
    Button,
    ButtonGroup,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Typography
} from '@mui/material';
import CreateOrEditNhanVienDialog from './components/createOrEditNhanVienDialog';
import AppConsts from '../../lib/appconst';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
class EmployeeScreen extends Component {
    state = {
        idNhanSu: '',
        idChiNhanh: '',
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        tenantId: 0,
        filter: '',
        moreOpen: false,
        anchorEl: null,
        selectedRowId: null,
        listNhanVien: [] as NhanSuItemDto[],
        suggestChucVu: [] as SuggestChucVuDto[],
        createOrEditNhanSu: {} as CreateOrUpdateNhanSuDto,
        totalNhanVien: 0,
        currentPage: 1,
        totalPage: 1,
        isShowConfirmDelete: false
    };
    async componentDidMount() {
        const idChiNhanh = Cookies.get('IdChiNhanh');
        await this.setState({ idChiNhanh: idChiNhanh });
        await this.getData();
        console.log(this.state.listNhanVien);
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
        await this.getListNhanVien();
    }
    async getListNhanVien() {
        const { filter, skipCount, maxResultCount } = this.state;
        const input = { skipCount, maxResultCount };
        const data = await nhanVienService.search(filter, input);
        await this.setState({
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
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    async createOrUpdateModalOpen(entityDto: string) {
        console.log(this.state.idChiNhanh);
        if (entityDto === '') {
            this.setState({
                createOrEditNhanSu: {
                    id: AppConsts.guidEmpty,
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
                    idChiNhanh: this.state.idChiNhanh,
                    ghiChu: ''
                }
            });
        } else {
            const employee = await nhanVienService.getNhanSu(entityDto);
            this.setState({
                createOrEditNhanSu: employee
            });
        }
        this.setState({ IdKhachHang: entityDto });
        this.Modal();
    }
    handleSubmit = async () => {
        await nhanVienService.createOrEdit(this.state.createOrEditNhanSu);
        await this.getData();
        this.setState({ modalVisible: false });
    };
    handleChange = (event: any): void => {
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
    onOkDelete = () => {
        this.delete(this.state.selectedRowId ?? '');
        this.handleDelete;
        this.handleCloseMenu();
    };
    handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            this.getListNhanVien();
        }
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: null });
        await this.getData();
    };

    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };

    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? '');
        this.handleCloseMenu();
    };

    handleDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete,
            idNhanSu: ''
        });
    };
    columns: GridColDef[] = [
        {
            field: 'tenNhanVien',
            headerName: 'Tên nhân viên',
            width: 171,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        src={params.row.avatar}
                        alt="Avatar"
                        style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    <Typography
                        fontSize="14px"
                        fontWeight="400"
                        variant="h6"
                        color="#333233"
                        lineHeight="16px">
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        { field: 'soDienThoai', headerName: 'Số điện thoại', width: 114 },
        {
            field: 'ngaySinh',
            headerName: 'Ngày sinh',
            width: 112,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <DateIcon style={{ marginRight: 4 }} />
                    <Typography
                        fontSize="14px"
                        fontWeight="400"
                        variant="h6"
                        color="#333233"
                        lineHeight="16px">
                        {new Date(params.value).toLocaleDateString('en-GB')}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'gioiTinh',
            headerName: 'Giới tính',
            width: 89,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                        fontSize="14px"
                        fontWeight="400"
                        variant="h6"
                        color="#333233"
                        lineHeight="16px">
                        {params.value == 1 ? 'Nam' : 'Nữ'}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'diaChi',
            headerName: 'Địa chỉ',
            width: 171
        },
        {
            field: 'tenChucVu',
            headerName: 'Vị trí',
            width: 113
        },
        {
            field: 'ngayVaoLam',
            headerName: 'Ngày tham gia',
            width: 128,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <DateIcon style={{ marginRight: 4 }} />
                    <Typography
                        fontSize="14px"
                        variant="h6"
                        fontWeight="400"
                        color="#333233"
                        lineHeight="16px">
                        {new Date(params.value).toLocaleDateString('en-GB')}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'trangThai',
            headerName: 'Trạng thái',
            width: 116,
            renderCell: (params) => (
                <Typography
                    fontSize="14px"
                    variant="h6"
                    lineHeight="16px"
                    padding="4px 8px"
                    borderRadius="12px"
                    fontWeight="400"
                    color="#009EF7"
                    sx={{ backgroundColor: '#F1FAFF' }}>
                    Hoạt động
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: '',
            width: 48,
            disableColumnMenu: true,

            renderCell: (params) => (
                <IconButton
                    aria-label="Actions"
                    aria-controls={`actions-menu-${params.row.id}`}
                    aria-haspopup="true"
                    onClick={(event) => this.handleOpenMenu(event, params.row.id)}>
                    <MoreHorizIcon />
                </IconButton>
            )
        }
    ];
    public render() {
        const breadcrumbs = [
            <Typography key="1" color="#999699" fontSize="14px">
                Dịch vụ
            </Typography>,
            <Typography key="2" color="#333233" fontSize="14px">
                Danh mục dịch vụ
            </Typography>
        ];

        return (
            <Box
                className="list-nhan-vien"
                paddingLeft="2.2222222222222223vw"
                paddingRight="2.2222222222222223vw"
                paddingTop="1.5277777777777777vw">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto">
                        <Breadcrumbs separator="›" aria-label="breadcrumb">
                            {breadcrumbs}
                        </Breadcrumbs>
                        <Typography
                            color="#0C050A"
                            variant="h1"
                            fontSize="24px"
                            fontWeight="700"
                            lineHeight="32px"
                            marginTop="4px">
                            Danh sách nhân viên
                        </Typography>
                    </Grid>

                    <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                        <ButtonGroup
                            variant="contained"
                            sx={{ gap: '8px', height: '40px', boxShadow: 'unset!important' }}>
                            <Button
                                size="small"
                                onClick={() => {
                                    this.createOrUpdateModalOpen('');
                                }}
                                variant="contained"
                                startIcon={<img src={AddIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    minWidth: '173px',
                                    fontSize: '14px',
                                    borderRadius: '4px!important',
                                    backgroundColor: '#7C3367!important'
                                }}>
                                Thêm nhân viên
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    padding="8px 24px"
                    sx={{ backgroundColor: '#F2EBF0', borderRadius: '8px', marginTop: '30px' }}>
                    <Box component="form" className="form-search">
                        <TextField
                            sx={{
                                backgroundColor: '#FFFAFF',
                                borderColor: '#CDC9CD'
                            }}
                            onChange={(e) => {
                                this.setState({ filter: e.target.value });
                            }}
                            size="small"
                            className="search-field"
                            variant="outlined"
                            type="search"
                            placeholder="Tìm kiếm"
                            InputProps={{
                                startAdornment: (
                                    <IconButton type="button" onClick={this.getListNhanVien}>
                                        <img src={SearchIcon} />
                                    </IconButton>
                                )
                            }}
                        />
                    </Box>
                    <Box>
                        <Button
                            sx={{
                                minWidth: 'unset',
                                padding: '8px',
                                backgroundColor: '#fff!important',
                                marginRight: '8px'
                            }}>
                            <FilterAltIcon sx={{ color: '#666466' }} />
                        </Button>
                        <Button
                            size="small"
                            startIcon={<img src={DownloadIcon} />}
                            sx={{
                                backgroundColor: '#fff!important',
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                padding: '10px 16px',
                                marginRight: '8px',
                                borderRadius: '4px!important'
                            }}>
                            Nhập
                        </Button>
                        <Button
                            size="small"
                            startIcon={<img src={UploadIcon} />}
                            sx={{
                                backgroundColor: '#fff!important',
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                padding: '10px 16px',

                                borderRadius: '4px!important'
                            }}>
                            Xuất
                        </Button>
                    </Box>
                </Box>
                <Box minHeight={'576px'} height={'576px'} marginTop="24px">
                    <DataGrid
                        rows={this.state.listNhanVien}
                        columns={this.columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 }
                            }
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                    />
                    <Menu
                        id={`actions-menu-${this.state.selectedRowId}`}
                        anchorEl={this.state.anchorEl}
                        keepMounted
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleCloseMenu}
                        sx={{ minWidth: '120px' }}>
                        <MenuItem onClick={this.handleView}>
                            <Typography
                                color="#009EF7"
                                fontSize="12px"
                                variant="button"
                                textTransform="unset"
                                width="64px"
                                fontWeight="400"
                                marginRight="8px">
                                View
                            </Typography>
                            <InfoIcon sx={{ color: '#009EF7' }} />
                        </MenuItem>
                        <MenuItem onClick={this.handleEdit}>
                            <Typography
                                color="#009EF7"
                                fontSize="12px"
                                variant="button"
                                textTransform="unset"
                                width="64px"
                                fontWeight="400"
                                marginRight="8px">
                                Edit
                            </Typography>
                            <EditIcon sx={{ color: '#009EF7' }} />
                        </MenuItem>
                        <MenuItem onClick={this.handleDelete}>
                            <Typography
                                color="#F1416C"
                                fontSize="12px"
                                variant="button"
                                textTransform="unset"
                                width="64px"
                                fontWeight="400"
                                marginRight="8px">
                                Delete
                            </Typography>
                            <DeleteForeverIcon sx={{ color: '#F1416C' }} />
                        </MenuItem>
                    </Menu>
                </Box>
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.handleDelete}></ConfirmDelete>
                <CreateOrEditNhanVienDialog
                    visible={this.state.modalVisible}
                    onCancel={this.onCloseDialog}
                    onOk={this.handleSubmit}
                    onChange={this.handleChange}
                    title={
                        this.state.idNhanSu === ''
                            ? 'Thêm mới nhân viên'
                            : 'Cập nhật thông tin nhân viên'
                    }
                    suggestChucVu={this.state.suggestChucVu}
                    formRef={this.state.createOrEditNhanSu}></CreateOrEditNhanVienDialog>
            </Box>
        );
    }
}

export default EmployeeScreen;
