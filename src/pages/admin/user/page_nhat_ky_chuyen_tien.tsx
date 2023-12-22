import { Grid, Box, Typography, Button, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
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
import ModalChuyenTienSMS from './components/modal_chuyen_tien_sms';
import LichSuNap_ChuyenTienService from '../../../services/sms/lich_su_nap_tien/LichSuNap_ChuyenTienService';
import { INhatKyChuyenTienDto } from '../../../services/sms/lich_su_nap_tien/ILichSuNap_ChuyenTienDto';
import { format } from 'date-fns';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';

export default function PageNhatKyChuyenTien({ isShowModalAdd, onCloseModal }: any) {
    const [idNhatKyNapTien, setidNhatKyNapTien] = useState('');
    const [isShowModalChuyenTien, setIsShowModalChuyenTien] = useState(false);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [allUser, setAllUser] = useState<GetAllUserOutput[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenuAction = Boolean(anchorEl);

    const [paramSearch, setparamSearch] = useState<ParamSearchDto>(new ParamSearchDto({ currentPage: 1 }));
    const [pageDataNhatKyChuyenCHuyen, setPageDataUser] = useState<PagedResultDto<INhatKyChuyenTienDto>>();
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [objConfirmDelete, setObjConfirmDelete] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );

    useEffect(() => {
        setIsShowModalChuyenTien(isShowModalAdd);
    }, [isShowModalAdd]);

    const GetAllNhatKyChuyenTien = async () => {
        const data = await LichSuNap_ChuyenTienService.GetAllNhatKyChuyenTien(paramSearch);
        setPageDataUser({
            ...pageDataNhatKyChuyenCHuyen,
            items: data.items,
            totalCount: data.totalCount,
            totalPage: data.totalPage
        });
    };

    const getAllUser = async () => {
        const data = await userService.getAll({
            maxResultCount: paramSearch?.pageSize ?? 10,
            skipCount: paramSearch?.currentPage ?? 1,
            keyword: paramSearch?.textSearch ?? ''
        });
        if (data) {
            setAllUser(data.items);
        }
    };

    const PageLoad = async () => {
        await getAllUser();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        GetAllNhatKyChuyenTien();
    }, [paramSearch.currentPage, paramSearch.pageSize, paramSearch.textSearch]);

    const handlePageChange = async (event: any, value: number) => {
        setparamSearch({
            ...paramSearch,
            currentPage: value
        });
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        setparamSearch({
            ...paramSearch,
            pageSize: parseInt(event.target.value.toString(), 10)
        });
    };

    const deleteUser = async () => {
        //
    };

    const saveChuyenTienOK = () => {
        setIsShowModalChuyenTien(false);
        onCloseModal();
    };

    const columns = [
        {
            field: 'userChuyenTien',
            headerName: 'Người chuyển',
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => <Box>{params.value}</Box>
        },
        {
            field: 'userNhanTien',
            headerName: 'Người nhận',
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => <Box>{params.value}</Box>
        },
        {
            field: 'soTienChuyen_Nhan',
            headerName: 'Số tiền',
            headerAlign: 'right',
            align: 'right',
            flex: 0.6,
            renderHeader: (params: any) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => <Box>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
        },
        {
            field: 'loaiPhieu',
            headerName: 'Loại phiếu',
            flex: 1,
            renderHeader: (params: any) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => <Box>{params.value}</Box>
        },
        {
            field: 'noiDungChuyen_Nhan',
            headerName: 'Ghi chú',
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box
                    sx={{
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'creationTime',
            headerName: 'Ngày tạo',
            headerAlign: 'center',
            flex: 0.6,
            renderHeader: (params: any) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                    <Typography variant="body2">{format(new Date(params.value), 'dd/MM/yyyy HH:mm')}</Typography>
                </Box>
            )
        },
        {
            field: '#',
            headerName: '#',
            maxWidth: 60,
            flex: 1,
            disableColumnMenu: true,
            renderCell: (params: any) => <Box></Box>,
            renderHeader: (params: any) => <Box>{params.colDef.headerName}</Box>
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
            <ModalChuyenTienSMS
                visiable={isShowModalChuyenTien}
                idNhatKyNapTien={idNhatKyNapTien}
                onClose={() => {
                    setIsShowModalChuyenTien(false);
                    onCloseModal();
                }}
                onOk={saveChuyenTienOK}
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
                                autoHeight={pageDataNhatKyChuyenCHuyen?.totalCount === 0}
                                className="data-grid-row"
                                columns={columns}
                                rows={pageDataNhatKyChuyenCHuyen?.items ?? []}
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
                            totalPage={pageDataNhatKyChuyenCHuyen?.totalPage ?? 0}
                            totalRecord={pageDataNhatKyChuyenCHuyen?.totalCount ?? 0}
                            handlePerPageChange={handlePerPageChange}
                            handlePageChange={handlePageChange}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
