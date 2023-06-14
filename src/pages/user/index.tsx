import React, { ChangeEventHandler } from 'react';
import AppComponentBase from '../../components/AppComponentBase';
import {
    Box,
    Grid,
    TextField,
    Button,
    Typography,
    IconButton,
    SelectChangeEvent
} from '@mui/material';
import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import { DataGrid } from '@mui/x-data-grid';
import userService from '../../services/user/userService';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '../../images/add.svg';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import '../../custom.css';
import { GetAllUserOutput } from '../../services/user/dto/getAllUserOutput';
import CreateOrEditUser from './components/create-or-edit-user';
import { CreateOrUpdateUserInput } from '../../services/user/dto/createOrUpdateUserInput';
import SuggestService from '../../services/suggests/SuggestService';
import { GetRoles } from '../../services/user/dto/getRolesOuput';
import { SuggestNhanSuDto } from '../../services/suggests/dto/SuggestNhanSuDto';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import { ReactComponent as IconSorting } from '../../images/column-sorting.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { TextTranslate } from '../../components/TableLanguage';
import ActionMenuTable from '../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../components/Pagination/CustomTablePagination';
class UserScreen extends AppComponentBase {
    state = {
        modalVisible: false,
        maxResultCount: 10,
        userId: 0,
        filter: '',
        listUser: [] as GetAllUserOutput[],
        totalCount: 0,
        currentPage: 1,
        totalPage: 0,
        startIndex: 1,
        userEdit: {
            userName: '',
            name: '',
            surname: '',
            emailAddress: '',
            phoneNumber: '',
            isActive: false,
            roleNames: [],
            password: '',
            id: 0,
            nhanSuId: ''
        } as CreateOrUpdateUserInput,
        isShowConfirmDelete: false,
        roles: [] as GetRoles[],
        suggestNhanSu: [] as SuggestNhanSuDto[],
        anchorEl: null,
        selectedRowId: 0
    };

    async componentDidMount() {
        await this.getAll();
    }

    async getAll() {
        const users = await userService.getAll({
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.currentPage,
            keyword: this.state.filter
        });

        const suggestNhanSu = await SuggestService.SuggestNhanSu();
        this.setState({
            listUser: users.items,
            totalCount: users.totalCount,
            totalPage: Math.ceil(users.totalCount / this.state.maxResultCount),
            suggestNhanSu: suggestNhanSu
        });
    }

    handlePageChange = async (event: any, value: number) => {
        await this.setState({
            currentPage: value
        });
        this.getAll();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            currentPage: 1,
            skipCount: 1
        });
        this.getAll();
    };
    handleSearchChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
        event: any
    ) => {
        const filter = event.target.value;
        this.setState({ filter: filter });
    };
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    handleCreate = () => {
        this.getAll();
        this.Modal();
    };
    onShowDelete = () => {
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };
    onOkDelete = () => {
        this.delete(this.state.selectedRowId);
        this.onShowDelete();
        this.handleCloseMenu();
    };
    async delete(input: number) {
        await userService.delete(input);
        await this.getAll();
    }

    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: 0 });
        await this.getAll();
    };

    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };
    async createOrUpdateModalOpen(entityDto: number) {
        if (entityDto === 0) {
            const roles = await userService.getRoles();
            await this.setState({
                roles: roles,
                userEdit: {
                    userName: '',
                    name: '',
                    surname: '',
                    emailAddress: '',
                    phoneNumber: '',
                    isActive: false,
                    roleNames: [],
                    password: '',
                    id: 0,
                    nhanSuId: ''
                }
            });
        } else {
            const user = await userService.get(entityDto);
            const roles = await userService.getRoles();
            await this.setState({
                userEdit: user,
                roles: roles
            });
        }

        this.setState({ userId: entityDto });
        this.Modal();
    }
    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? 0);
        this.handleCloseMenu();
    };
    render(): React.ReactNode {
        const columns = [
            {
                field: 'userName',
                headerName: 'Tên đăng nhập',
                minWidth: 125,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }} title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'fullName',
                headerName: 'Họ và tên',
                minWidth: 125,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box
                        sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                        title={params.colDef.headerName}
                        width="100%">
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'roleNames',
                headerName: 'Vai trò',
                minWidth: 100,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }} title={params.colDef.headerName}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'emailAddress',
                headerName: 'Địa chỉ email',
                minWidth: 125,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box
                        sx={{
                            fontWeight: '700',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: '100%'
                        }}
                        title={params.colDef.headerName}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'creationTime',
                headerName: 'Thời gian tạo',
                minWidth: 150,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }} title={params.colDef.headerName}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="12px"
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
                field: 'action',
                headerName: 'Hành động',
                maxWidth: 60,
                flex: 1,
                disableColumnMenu: true,
                renderCell: (params: any) => (
                    <Box>
                        <IconButton
                            aria-label="Actions"
                            aria-controls={`actions-menu-${params.row.id}`}
                            aria-haspopup="true"
                            onClick={(event) => {
                                this.handleOpenMenu(event, params.row.id);
                            }}>
                            <MoreHorizIcon />
                        </IconButton>
                    </Box>
                ),
                renderHeader: (params: any) => (
                    <Box sx={{ display: 'none' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            }
        ];

        return (
            <Box
                sx={{
                    paddingTop: '22px',
                    paddingRight: '2.2222222222222223vw',
                    paddingLeft: '2.2222222222222223vw'
                }}>
                <Box>
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        rowGap="16px">
                        <Grid item>
                            <div>
                                <Box display="flex" gap="10px" alignItems="center">
                                    <Typography
                                        variant="h1"
                                        fontWeight="700"
                                        fontSize="16px"
                                        color="#333233">
                                        Danh sách người dùng
                                    </Typography>
                                    <TextField
                                        onKeyDown={(e) => {
                                            if (e.key == 'Enter') {
                                                this.getAll();
                                            }
                                        }}
                                        onChange={this.handleSearchChange}
                                        size="small"
                                        sx={{
                                            borderColor: '#E6E1E6!important',
                                            bgcolor: '#fff'
                                        }}
                                        placeholder="Tìm kiếm..."
                                        InputProps={{
                                            startAdornment: (
                                                <SearchIcon
                                                    onClick={() => {
                                                        this.getAll();
                                                    }}
                                                    style={{
                                                        marginRight: '8px',
                                                        color: 'gray'
                                                    }}
                                                />
                                            )
                                        }}
                                    />
                                </Box>
                            </div>
                        </Grid>
                        <Grid item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Box display="flex" alignItems="center">
                                    <Box display="flex" gap="8px">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<img src={DownloadIcon} />}
                                            sx={{
                                                height: '40px',
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                fontWeight: '400',
                                                borderColor: '#E6E1E6!important',
                                                color: '#666466',
                                                backgroundColor: '#fff!important'
                                            }}>
                                            Nhập
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            className="btn-export"
                                            size="small"
                                            startIcon={<img src={UploadIcon} />}
                                            sx={{
                                                height: '40px',
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                fontWeight: '400',
                                                borderColor: '#E6E1E6!important',
                                                color: '#666466',
                                                backgroundColor: '#fff!important'
                                            }}>
                                            Xuất
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<img src={AddIcon} />}
                                            size="small"
                                            onClick={() => {
                                                this.createOrUpdateModalOpen(0);
                                            }}
                                            sx={{
                                                height: '40px',
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                fontWeight: '400',
                                                backgroundColor: '#7C3367!important'
                                            }}>
                                            Thêm người dùng
                                        </Button>
                                    </Box>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
                <Box
                    className="page-content"
                    sx={{ marginTop: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
                    <Box>
                        <DataGrid
                            autoHeight
                            columns={columns}
                            rows={this.state.listUser}
                            checkboxSelection
                            sx={{
                                '& .MuiDataGrid-iconButtonContainer': {
                                    display: 'none'
                                },

                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#F2EBF0'
                                },
                                '& p': {
                                    mb: 0
                                },
                                '& .MuiDataGrid-cellContent': {
                                    fontSize: '12px'
                                },
                                '& .MuiDataGrid-columnHeaderCheckbox:focus': {
                                    outline: 'none!important'
                                },
                                '&  .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
                                    outline: 'none '
                                },
                                '& .MuiDataGrid-columnHeaderTitleContainer:hover': {
                                    color: '#7C3367'
                                },
                                '& .MuiDataGrid-columnHeaderTitleContainer svg path:hover': {
                                    fill: '#7C3367'
                                },
                                '& [aria-sort="ascending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-child(2)':
                                    {
                                        fill: '#000'
                                    },
                                '& [aria-sort="descending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-child(1)':
                                    {
                                        fill: '#000'
                                    },
                                '& .Mui-checked, &.MuiCheckbox-indeterminate': {
                                    color: '#7C3367!important'
                                },
                                '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within':
                                    {
                                        outline: 'none'
                                    },
                                '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover,.MuiDataGrid-row.Mui-selected.Mui-hovered':
                                    {
                                        bgcolor: '#f2ebf0'
                                    }
                            }}
                            hideFooterPagination
                            hideFooter
                            localeText={TextTranslate}
                        />
                    </Box>
                    <CustomTablePagination
                        currentPage={this.state.currentPage}
                        rowPerPage={this.state.maxResultCount}
                        totalPage={this.state.totalPage}
                        totalRecord={this.state.totalCount}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                    <CreateOrEditUser
                        visible={this.state.modalVisible}
                        modalType={
                            this.state.userId === 0 ? 'Thêm mới tài khoản' : 'Cập nhật tài khoản'
                        }
                        formRef={this.state.userEdit}
                        onCancel={() =>
                            this.setState({
                                modalVisible: false
                            })
                        }
                        roles={this.state.roles}
                        suggestNhanSu={this.state.suggestNhanSu}
                        userId={this.state.userId}
                        onOk={this.handleCreate}
                    />
                    <ConfirmDelete
                        isShow={this.state.isShowConfirmDelete}
                        onOk={this.onOkDelete}
                        onCancel={this.onShowDelete}></ConfirmDelete>
                    <ActionMenuTable
                        anchorEl={this.state.anchorEl}
                        selectedRowId={this.state.selectedRowId}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleView}
                        handleEdit={this.handleEdit}
                        handleDelete={this.onOkDelete}
                    />
                </Box>
            </Box>
        );
    }
}

export default UserScreen;
