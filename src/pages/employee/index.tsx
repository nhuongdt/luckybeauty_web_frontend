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
import React from 'react';
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
import { observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import NhanVienStore from '../../stores/nhanVienStore';
class EmployeeScreen extends React.Component {
    state = {
        idNhanSu: '',
        idChiNhanh: '',
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        filter: '',
        moreOpen: false,
        anchorEl: null,
        selectedRowId: null,
        suggestChucVu: [] as SuggestChucVuDto[],
        createOrEditNhanSu: {} as CreateOrUpdateNhanSuDto,
        currentPage: 1,
        totalPage: 1,
        isShowConfirmDelete: false
    };
    async componentDidMount() {
        const idChiNhanh = Cookies.get('IdChiNhanh');
        await this.setState({ idChiNhanh: idChiNhanh });
        await this.getData();
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
        await this.getListNhanVien();
    }
    async getListNhanVien() {
        const { filter, skipCount, maxResultCount } = this.state;
        const input = { skipCount, maxResultCount };
        await NhanVienStore.search(filter, input);
        await this.setState({
            totalPage: Math.ceil(NhanVienStore.listNhanVien.totalCount / maxResultCount)
        });
    }
    async createOrEdit() {
        nhanVienService.createOrEdit(this.state.createOrEditNhanSu);
    }
    async delete(id: string) {
        NhanVienStore.delete(id);
        this.resetData();
    }
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    async createOrUpdateModalOpen(id: string) {
        console.log(this.state.idChiNhanh);
        if (id === '') {
            await NhanVienStore.createNhanVien(this.state.idChiNhanh);
            this.setState({
                createOrEditNhanSu: NhanVienStore.createEditNhanVien
            });
        } else {
            await NhanVienStore.getForEdit(id);
            this.setState({
                createOrEditNhanSu: NhanVienStore.createEditNhanVien
            });
        }
        this.setState({ IdKhachHang: id });
        this.Modal();
    }
    handleSubmit = async () => {
        await NhanVienStore.createOrEdit(this.state.createOrEditNhanSu);
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
        //await this.getData();
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
            minWidth: 171,
            flex: 1,
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
                        lineHeight="16px"
                        title={params.value}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        { field: 'soDienThoai', headerName: 'Số điện thoại', width: 114 },
        {
            field: 'ngaySinh',
            headerName: 'Ngày sinh',
            minWidth: 112,
            flex: 1,
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
            minWidth: 60,
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
            minWidth: 130,
            flex: 1
        },
        {
            field: 'tenChucVu',
            headerName: 'Vị trí',
            minWidth: 113,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    fontSize="14px"
                    fontWeight="400"
                    variant="h6"
                    color="#333233"
                    lineHeight="16px">
                    Kỹ thuật viên
                </Typography>
            )
        },
        {
            field: 'ngayVaoLam',
            headerName: 'Ngày tham gia',
            minWidth: 120,
            flex: 1,
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
            minWidth: 116,
            flex: 1,
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
            flex: 0.4,
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
                Nhân viên
            </Typography>,
            <Typography key="2" color="#333233" fontSize="14px">
                Danh mục nhân viên
            </Typography>
        ];
        const { listNhanVien } = NhanVienStore;
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
                        <Box className="form-search">
                            <TextField
                                sx={{
                                    backgroundColor: '#FFFAFF',
                                    borderColor: '#CDC9CD',
                                    height: '40px'
                                }}
                                onChange={(e) => {
                                    this.setState({ filter: e.target.value });
                                }}
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        this.getListNhanVien();
                                    }
                                }}
                                size="small"
                                className="search-field"
                                variant="outlined"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton
                                            type="button"
                                            onClick={() => {
                                                this.getListNhanVien();
                                            }}>
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>
                        <Button
                            size="small"
                            startIcon={<img src={DownloadIcon} />}
                            sx={{
                                backgroundColor: '#fff!important',
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                height: '40px',
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
                                height: '40px',
                                borderRadius: '4px!important'
                            }}>
                            Xuất
                        </Button>
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

                <Box minHeight={'576px'} height={'576px'} marginTop="24px" bgcolor="#fff">
                    <DataGrid
                        rows={listNhanVien === undefined ? [] : listNhanVien.items}
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
                    onCancel={() => {
                        this.setState({ modalVisible: false });
                    }}
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

export default observer(EmployeeScreen);
