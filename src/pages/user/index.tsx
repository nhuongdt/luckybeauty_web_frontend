import React, { FormEventHandler, ChangeEventHandler } from 'react';
import AppComponentBase from '../../components/AppComponentBase';
import { Box, Grid, TextField, Button, Typography, Pagination } from '@mui/material';
import userService from '../../services/user/userService';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '../../images/add.svg';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import '../../custom.css';
import { GetAllUserOutput } from '../../services/user/dto/getAllUserOutput';
import CreateOrEditUser from './components/create-or-edit-user';
import { CreateOrUpdateUserInput } from '../../services/user/dto/createOrUpdateUserInput';
import SuggestService from '../../services/suggests/SuggestService';
import { GetRoles } from '../../services/user/dto/getRolesOuput';
import { SuggestNhanSuDto } from '../../services/suggests/dto/SuggestNhanSuDto';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserProps {}

export interface IUserState {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    userId: number;
    filter: string;
    listUser: GetAllUserOutput[];
    totalCount: number;
    currentPage: number;
    totalPage: number;
    startIndex: number;
    userEdit: CreateOrUpdateUserInput;
    isShowConfirmDelete: boolean;
    roles: GetRoles[];
    suggestNhanSu: SuggestNhanSuDto[];
}
class UserScreen extends AppComponentBase<IUserProps, IUserState> {
    state = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
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
        suggestNhanSu: [] as SuggestNhanSuDto[]
    };

    async componentDidMount() {
        await this.getAll();
    }

    async getAll() {
        const users = await userService.getAll({
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount,
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

    handlePageChange = (event: any, value: any) => {
        const { maxResultCount } = this.state;
        this.setState({
            currentPage: value,
            skipCount: value,
            startIndex: (value - 1 <= 0 ? 0 : value - 1) * maxResultCount
        });
        this.getAll();
    };

    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
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

    async delete(input: number) {
        await userService.delete(input);
        await this.getAll();
    }

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
        this.delete(this.state.userId);
        this.onShowDelete();
    };
    handleSearchChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
        event: any
    ) => {
        const filter = event.target.value;
        this.setState({ filter: filter });
    };
    render(): React.ReactNode {
        return (
            <Box
                sx={{
                    paddingTop: '22px',
                    paddingRight: '2.2222222222222223vw',
                    paddingLeft: '2.2222222222222223vw'
                }}>
                <Box>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <div>
                                <div>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="body1" fontSize="14px" color="#999699">
                                            Người dùng
                                        </Typography>
                                        <ArrowForwardIosIcon
                                            fontSize="small"
                                            sx={{
                                                width: '12px',
                                                height: '12px'
                                            }}
                                        />
                                        <Typography variant="body1" fontSize="14px" color="#333233">
                                            Thông tin người dùng
                                        </Typography>
                                    </Box>
                                </div>
                                <div>
                                    <Typography
                                        variant="h1"
                                        fontWeight="700"
                                        fontSize="24px"
                                        sx={{ marginTop: '4px' }}>
                                        Danh sách người dùng
                                    </Typography>
                                </div>
                            </div>
                        </Grid>
                        <Grid item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Box display="flex" alignItems="center">
                                    <Box display="flex" gap="8px">
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
                    <table className="h-100 w-100 table table-border-0 table">
                        <thead className="bg-table w-100">
                            <tr style={{ height: '48px' }}>
                                <th className="text-center">
                                    <input className="text-th-table text-center" type="checkbox" />
                                </th>
                                <th className="text-th-table">STT</th>
                                <th className="text-th-table">Tên truy cập</th>
                                <th className="text-th-table">Họ và tên</th>
                                <th className="text-th-table">Vai trò</th>
                                <th className="text-th-table">Địa chỉ email</th>
                                <th className="text-th-table">Thời gian tạo</th>
                                <th className="text-th-table">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.listUser.map((item, index) => {
                                return (
                                    <tr>
                                        <td className="text-td-table text-center">
                                            <input
                                                className="text-th-table text-center"
                                                type="checkbox"
                                            />
                                        </td>
                                        <td className="text-td-table">{index + 1}</td>
                                        <td className="text-td-table" title={item['userName']}>
                                            {item['userName']}
                                        </td>
                                        <td className="text-td-table" title={item.fullName}>
                                            {item.fullName}
                                        </td>
                                        <td className="text-td-table">
                                            {item.roleNames.length > 1
                                                ? item.roleNames.map((role: any) => {
                                                      return <span>{role};</span>;
                                                  })
                                                : item.roleNames.map((role: any) => {
                                                      return <span>{role} </span>;
                                                  })}
                                        </td>
                                        <td className="text-td-table" title={item.emailAddress}>
                                            {item.emailAddress}
                                        </td>
                                        <td className="text-td-table">
                                            {item.creationTime.toString()}
                                        </td>
                                        <td className="text-td-table" style={{ width: '150px' }}>
                                            <Box display="flex" justifyContent="start">
                                                <Button
                                                    onClick={() => {
                                                        this.setState({
                                                            userId: item.id
                                                        });
                                                        this.createOrUpdateModalOpen(item.id);
                                                    }}
                                                    sx={{ minWidth: 'unset' }}>
                                                    <EditIcon />
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        this.setState({
                                                            userId: item.id
                                                        });
                                                        this.onShowDelete();
                                                    }}
                                                    sx={{ minWidth: 'unset' }}>
                                                    <DeleteForeverIcon sx={{ color: 'red' }} />
                                                </Button>
                                            </Box>
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
                                        {this.state.totalCount} mục
                                    </label>
                                </div>
                                <div style={{ float: 'right' }} className="col-7">
                                    <Box display="flex" className="align-items-center">
                                        <Pagination
                                            count={Math.ceil(
                                                this.state.totalCount / this.state.maxResultCount
                                            )}
                                            page={this.state.currentPage}
                                            onChange={this.handlePageChange}
                                            sx={{
                                                '& button': {
                                                    borderRadius: '4px',
                                                    lineHeight: '1'
                                                },
                                                '& .Mui-selected': {
                                                    backgroundColor: '#7C3367!important',
                                                    color: '#fff'
                                                }
                                            }}
                                        />
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </div>
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
                </Box>
            </Box>
        );
    }
}

export default UserScreen;
