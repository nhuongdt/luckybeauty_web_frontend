import { Grid, Box, Typography, Button, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import { Edit, DeleteForever } from '@mui/icons-material';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import { GetAllUserOutput } from '../../../services/user/dto/getAllUserOutput';
import { TextTranslate } from '../../../components/TableLanguage';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { ParamSearchDto } from '../../../services/dto/ParamSearchDto';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import ModalAddUser from './components/modal_add_user';
import { SuggestNhanSuDto } from '../../../services/suggests/dto/SuggestNhanSuDto';
import { ChiNhanhDto } from '../../../services/chi_nhanh/Dto/chiNhanhDto';
import { GetRoles } from '../../../services/user/dto/getRolesOuput';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import chiNhanhService from '../../../services/chi_nhanh/chiNhanhService';
import { PagedRequestDto } from '../../../services/dto/pagedRequestDto';
import userService from '../../../services/user/userService';
import SuggestService from '../../../services/suggests/SuggestService';
import ActionViewEditDelete from '../../../components/Menu/ActionViewEditDelete';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import { IUserProfileDto } from '../../../services/user/dto/ProfileDto';
import utils from '../../../utils/utils';

export default function PageUser({ isShowModalAdd, onCloseModal }: any) {
    const firstLoad = useRef(true);
    const [userId, setUserId] = useState(0);
    const [isShowModalAddUser, setIsShowModalAddUser] = useState(false);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [allUser, setAllUser] = useState<IUserProfileDto[]>([]);
    const [allNhanVien, setAllNhanVien] = useState<SuggestNhanSuDto[]>([]);
    const [allChiNhanh, setAllChiNhanh] = useState<ChiNhanhDto[]>([]);
    const [allRole, setAllRole] = useState<GetRoles[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenuAction = Boolean(anchorEl);

    useEffect(() => {
        setIsShowModalAddUser(isShowModalAdd);
    }, [isShowModalAdd]);

    const [paramSearch, setParamSearch] = useState<ParamSearchDto>(
        new ParamSearchDto({ currentPage: 1, pageSize: 10 })
    );
    const [pageDataUser, setPageDataUser] = useState<PagedResultDto<IUserProfileDto>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    } as PagedResultDto<IUserProfileDto>);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [objConfirmDelete, setObjConfirmDelete] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );

    const getAllChiNhanh = async () => {
        const data = await chiNhanhService.GetAll({
            keyword: '',
            maxResultCount: 100,
            skipCount: 0
        } as PagedRequestDto);
        if (data) {
            setAllChiNhanh(data.items);
        }
    };

    const getAllRole = async () => {
        const allRole = await userService.getRoles();
        setAllRole(allRole);
    };

    const getAllNhanVien = async () => {
        const allRole = await SuggestService.SuggestNhanSu();
        setAllNhanVien(allRole);
    };

    const getAllUser = async () => {
        // get all user && paging at client
        const data = await userService.GetAllUser({
            maxResultCount: 500,
            skipCount: paramSearch?.currentPage ?? 1,
            keyword: paramSearch?.textSearch ?? ''
        });
        setAllUser(data.items);

        console.log('ok', data);

        setPageDataUser({
            ...pageDataUser,
            totalCount: data.totalCount,
            totalPage: data.totalPage
        });
        PagingData(data.items, data.totalCount);
    };

    const PageLoad = async () => {
        await getAllChiNhanh();
        await getAllRole();
        await getAllNhanVien();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        getAllUser();
    }, [paramSearch.textSearch]);

    const PagingData = (allUser: IUserProfileDto[] = [], totalCount: null | number = null) => {
        let currentPage = paramSearch?.currentPage ?? 0;
        if (currentPage > 0) {
            currentPage = currentPage - 1;
        }
        const from = currentPage * (paramSearch?.pageSize ?? 0);
        let to = from + (paramSearch?.pageSize ?? 0);

        if (totalCount == null) {
            totalCount = pageDataUser?.totalCount ?? 0;
        }
        if (to > totalCount) {
            to = totalCount;
        }
        const arrPaging = allUser.slice(from, to) ?? [];
        setPageDataUser({
            ...pageDataUser,
            items: arrPaging
        });
    };

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        PagingData();
    }, [paramSearch.currentPage, paramSearch.pageSize]);

    const handlePageChange = async (event: any, value: number) => {
        setParamSearch({
            ...paramSearch,
            currentPage: value
        });
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        setParamSearch({
            ...paramSearch,
            pageSize: parseInt(event.target.value.toString(), 10)
        });
    };

    const doActionRow = (action: number, item: GetAllUserOutput) => {
        switch (action) {
            case 1:
                {
                    setIsShowModalAddUser(true);
                    setUserId(item.id);
                }
                break;
            case 2:
                setObjConfirmDelete({
                    ...objConfirmDelete,
                    show: true,
                    mes: `Bạn có chắc chắn muốn xóa user ${item.userName} không?`
                });
                break;
        }
    };

    const deleteUser = async () => {
        const deleteResult = await userService.delete(userId);
        if (deleteResult != null) {
            setObjAlert({ ...objAlert, show: false, mes: 'Xóa thành công', type: 1 });
        } else {
            setObjAlert({ ...objAlert, show: false, mes: 'Xóa thất bại', type: 2 });
        }
        setObjConfirmDelete({ ...objConfirmDelete, show: false });
    };

    const saveUserOK = () => {
        setIsShowModalAddUser(false);
        getAllUser();
        onCloseModal();
    };

    const columns = [
        {
            field: 'userName',
            headerName: 'Tên đăng nhập',
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => <Box>{params.value}</Box>
        },
        {
            field: 'tenNhanVien',
            headerName: 'Tên nhân viên',
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => <Box>{params.value}</Box>
        },
        {
            field: 'roleNames',
            headerName: 'Vai trò',
            flex: 0.8,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => <Box>{utils.Remove_LastComma(params.value)}</Box>
        },
        {
            field: 'emailAddress',
            headerName: 'Địa chỉ email',
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => <Box>{params.value}</Box>
        },
        {
            field: 'tenChiNhanh',
            headerName: 'Chi nhánh mặc định',
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => <Box>{params.value}</Box>
        },
        {
            field: 'isActive',
            headerName: 'Trạng thái',
            headerAlign: 'center',
            flex: 0.8,
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    alignItems={'center'}
                    borderRadius="12px"
                    padding={'4px 8px'}
                    sx={{
                        margin: 'auto',
                        backgroundColor: params.row.isActive === true ? '#E8FFF3' : '#FFF8DD',
                        color: params.row.isActive === true ? '#50CD89' : '#FF9900'
                    }}
                    fontSize="13px"
                    fontWeight="400">
                    {params.value === true ? 'Hoạt động' : 'Ngừng hoạt động'}
                </Typography>
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        },
        {
            field: 'creationTime',
            headerName: 'Ngày tạo',
            headerAlign: 'center',
            flex: 0.6,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                    <Typography variant="body2">{new Date(params.value).toLocaleDateString('en-GB')}</Typography>
                </Box>
            )
        },
        {
            field: 'action',
            headerName: '#',
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            disableColumnMenu: true,
            flex: 0.5,
            renderCell: (params: any) => (
                <ActionViewEditDelete
                    lstOption={[
                        {
                            id: '1',
                            text: 'Sửa',
                            color: '#009EF7',
                            icon: <Edit sx={{ color: '#009EF7' }} />
                        },
                        {
                            id: '2',
                            text: 'Xóa',
                            color: '#F1416C',
                            icon: <DeleteForever sx={{ color: '#F1416C' }} />
                        },
                        {
                            id: '3',
                            text: 'Ngừng hoạt động',
                            color: '#650404'
                        }
                    ]}
                    handleAction={(action: any) => doActionRow(action, params.row)}
                />
            ),
            renderHeader: (params) => <Box sx={{ display: 'none' }}>{params.colDef.headerName}</Box>
        }
    ] as GridColDef[];

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ConfirmDelete
                isShow={objConfirmDelete.show}
                onOk={deleteUser}
                onCancel={() => setObjConfirmDelete({ ...objConfirmDelete, show: false })}></ConfirmDelete>
            <ModalAddUser
                isShowModal={isShowModalAddUser}
                onCancel={() => {
                    setIsShowModalAddUser(false);
                    onCloseModal();
                }}
                // chỉ lấy nhân viên chưa có tk đăng nhập
                dataNhanVien={allNhanVien.filter(
                    (xOut: SuggestNhanSuDto) =>
                        !allUser
                            ?.map((x: IUserProfileDto) => {
                                // get list nhansuId from allUser
                                return x.nhanSuId;
                            })
                            .includes(xOut.id)
                )}
                dataChiNhanh={allChiNhanh}
                userId={userId}
                allRoles={allRole}
                onOk={saveUserOK}
            />
            <Grid container paddingTop={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className="page-box-right">
                        <Box>
                            {rowSelectionModel.length > 0 ? (
                                <Box mb={1}>
                                    <Button variant="contained" color="secondary">
                                        Xóa {rowSelectionModel.length} bản ghi đã chọn
                                    </Button>
                                </Box>
                            ) : null}
                            <DataGrid
                                rowHeight={46}
                                autoHeight={pageDataUser?.totalCount === 0}
                                className="data-grid-row"
                                columns={columns}
                                rows={pageDataUser?.items ?? []}
                                rowSelectionModel={rowSelectionModel || undefined}
                                onRowSelectionModelChange={(row) => {
                                    setRowSelectionModel(row);
                                }}
                                disableRowSelectionOnClick
                                checkboxSelection={false}
                                hideFooterPagination
                                hideFooter
                                localeText={TextTranslate}
                            />
                        </Box>
                        <CustomTablePagination
                            currentPage={paramSearch?.currentPage ?? 1}
                            rowPerPage={paramSearch?.pageSize ?? 10}
                            totalPage={pageDataUser?.totalPage ?? 0}
                            totalRecord={pageDataUser?.totalCount ?? 0}
                            handlePerPageChange={handlePerPageChange}
                            handlePageChange={handlePageChange}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
