import {
    Add,
    DeleteForever,
    DeleteSweepOutlined,
    Edit,
    FileUploadOutlined,
    PrintOutlined,
    Search
} from '@mui/icons-material';
import { Grid, Box, Stack, Typography, IconButton, TextField, Button, SelectChangeEvent } from '@mui/material';
import ActionRowSelect from '../../../components/DataGrid/ActionRowSelect';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridValidRowModel } from '@mui/x-data-grid';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import { PagedRequestDto } from '../../../services/dto/pagedRequestDto';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { CreateOrEditSMSDto, PagedResultSMSDto } from '../../../services/sms/gui_tin_nhan/gui_tin_nhan_dto';
import { TextTranslate } from '../../../components/TableLanguage';
import ActionViewEditDelete from '../../../components/Menu/ActionViewEditDelete';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import BrandnameService from '../../../services/sms/brandname/BrandnameService';
import Cookies from 'js-cookie';
import { BrandnameDto } from '../../../services/sms/brandname/BrandnameDto';
import { isNaN } from 'lodash';
import ModalGuiTinNhan from '../components/modal_gui_tin_nhan';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import HeThongSMServices from '../../../services/sms/gui_tin_nhan/he_thong_sms_services';
import { RequestFromToDto } from '../../../services/dto/ParamSearchDto';
import AppConsts, { TrangThaiSMS } from '../../../lib/appconst';

export default function PageSMS({ xx }: any) {
    const [isShowModalAdd, setIsShowModalAdd] = useState(false);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [dataGrid_typeAction, setDataGrid_typeAction] = useState(0);
    const [inforDelete, setInforDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));
    const [lstBrandname, setLstBrandname] = useState<BrandnameDto[]>([]);

    const [pageSMS, setPageSMS] = useState<PagedResultSMSDto>(new PagedResultSMSDto({ items: [] }));
    const [paramSearch, setParamSearch] = useState<RequestFromToDto>({
        textSearch: '',
        fromDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        toDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    } as RequestFromToDto);

    const GetListBrandname = async () => {
        let tenantId = parseInt(Cookies.get('Abp.TenantId') ?? '1') ?? 1;
        tenantId = isNaN(tenantId) ? 1 : tenantId;
        const param = {
            keyword: ''
        } as PagedRequestDto;
        const data = await BrandnameService.GetListBandname(param, tenantId);
        if (data !== null) {
            setLstBrandname(data.items);
        }
    };

    const GetListSMS = async () => {
        const data = await HeThongSMServices.GetListSMS(paramSearch);
        if (data != null) {
            setPageSMS({ items: data.items, totalCount: data.totalCount, totalPage: 1 });
        }
    };

    useEffect(() => {
        GetListBrandname();
        GetListSMS();
    }, []);
    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        if (paramSearch.currentPage !== 1) {
            setParamSearch({
                ...paramSearch,
                currentPage: 1
            });
        } else {
            //
        }
    };
    const choseRow = (item: any) => {
        // setBrandChosed(item?.row);
    };

    const DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case 1:
                setInforDelete({
                    ...inforDelete,
                    show: true,
                    title: 'Thông báo xóa',
                    mes: `Bạn có chắc chắn muốn xóa ${rowSelectionModel.length} brandname này không?`
                });
                break;
            case 2:
                {
                    setInforDelete({
                        ...inforDelete,
                        show: true,
                        title: 'Kích hoạt',
                        mes: `Bạn có chắc chắn muốn kích hoạt ${rowSelectionModel.length} brandname này không?`
                    });
                }
                break;
        }
        setDataGrid_typeAction(parseInt(item.id));
    };

    const exportToExcel = async () => {
        const param = { ...paramSearch };
        param.currentPage = 1;
    };

    const handleChangePage = (event: any, value: number) => {
        setParamSearch({
            ...paramSearch,
            currentPage: value
        });
    };
    const handlePerPageChange = (event: SelectChangeEvent<number>) => {
        setParamSearch({
            ...paramSearch,
            pageSize: parseInt(event.target.value.toString(), 10)
        });
    };
    const doActionRow = (action: number, item: any) => {
        switch (action) {
            case 1:
                {
                    setIsShowModalAdd(true);
                }
                break;
            case 2:
                setInforDelete({
                    ...inforDelete,
                    show: true,
                    mes: `Bạn có chắc chắn muốn xóa brandname ${item.brandname} này không?`
                });
                break;
        }
    };

    const saveSMSOK = (obinew: CreateOrEditSMSDto) => {
        setPageSMS({ ...pageSMS, items: [obinew, ...pageSMS.items], totalCount: pageSMS.totalCount + 1 });
        setIsShowModalAdd(false);
        setObjAlert({ show: true, mes: 'Thêm mới tin nhắn thành công', type: 1 });
    };

    const columns: GridColDef[] = [
        {
            field: 'thoiGianGui',
            headerName: 'Thời gian gửi',
            headerAlign: 'center',
            align: 'center',
            flex: 0.8,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => <Box title={params.value}>{format(new Date(params.value), 'dd/MM/yyyy')}</Box>
        },
        {
            field: 'tenKhachHang',
            headerName: 'Tên khách hàng',
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>
        },
        {
            field: 'soDienThoai',
            headerName: 'SDT khách hàng',
            flex: 1,
            renderHeader: (params: GridValidRowModel) => <Box title={params.value}>{params.colDef.headerName}</Box>
        },
        {
            field: 'loaiTin',
            headerName: 'Loại tin nhắn',
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>
        },
        {
            field: 'noiDungTin',
            headerName: 'Nội dung tin',
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>
        },
        {
            field: 'txtTrangThai',
            headerAlign: 'center',
            headerName: 'Trạng thái',
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box
                    title={params.value}
                    sx={{
                        padding: '4px 8px',
                        borderRadius: '100px',
                        backgroundColor:
                            params.row.trangThai === TrangThaiSMS.SUCCESS
                                ? '#E8FFF3'
                                : params.row.trangThai !== TrangThaiSMS.SUCCESS
                                ? '#FFF8DD'
                                : '#FFF5F8',
                        color:
                            params.row.trangThai !== TrangThaiSMS.SUCCESS
                                ? '#50CD89'
                                : params.row.trangThai === TrangThaiSMS.SUCCESS
                                ? '#FF9900'
                                : '#F1416C',
                        margin: 'auto'
                    }}
                    className="state-thanh-toan">
                    {params.value}
                </Box>
            )
        }
    ];

    return (
        <>
            <ModalGuiTinNhan
                lstBrandname={lstBrandname.map((x: BrandnameDto) => {
                    return { value: x.id, text: x.brandname };
                })}
                isShow={isShowModalAdd}
                idTinNhan={''}
                onClose={() => setIsShowModalAdd(false)}
                onSaveOK={saveSMSOK}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Grid container paddingTop={2}>
                <Grid item xs={6}>
                    <Grid container alignItems={'center'}>
                        <Grid item lg={4}>
                            <Typography className="page-title">Tin nhắn đã gửi</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                fullWidth
                                sx={{
                                    backgroundColor: '#fff',
                                    borderColor: '#CDC9CD!important'
                                }}
                                className="search-field"
                                variant="outlined"
                                type="search"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton type="button">
                                            <Search />
                                        </IconButton>
                                    )
                                }}
                                onChange={(event) =>
                                    setParamSearch((itemOlds) => {
                                        return {
                                            ...itemOlds,
                                            keyword: event.target.value
                                        };
                                    })
                                }
                                onKeyDown={(event) => {
                                    handleKeyDownTextSearch(event);
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Stack direction={'row'} spacing={1} justifyContent={'end'}>
                        <Button
                            size="small"
                            onClick={exportToExcel}
                            variant="outlined"
                            startIcon={<FileUploadOutlined />}
                            className="btnNhapXuat btn-outline-hover"
                            sx={{ bgcolor: '#fff!important', color: '#666466' }}>
                            Xuất
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setIsShowModalAdd(true);
                            }}
                            startIcon={<Add />}>
                            Thêm mới
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    {rowSelectionModel.length > 0 && (
                        <div style={{ marginTop: '24px' }}>
                            <ActionRowSelect
                                lstOption={[
                                    {
                                        id: '1',
                                        text: 'Xóa brandname',
                                        icon: <DeleteSweepOutlined sx={{ width: '1rem', height: '1rem' }} />
                                    },
                                    {
                                        id: '2',
                                        text: 'Kích hoạt',
                                        icon: <PrintOutlined sx={{ width: '1rem', height: '1rem' }} />
                                    }
                                ]}
                                countRowSelected={rowSelectionModel.length}
                                title="brandname"
                                choseAction={DataGrid_handleAction}
                                removeItemChosed={() => {
                                    setRowSelectionModel([]);
                                }}
                            />
                        </div>
                    )}

                    <Stack marginTop={rowSelectionModel.length > 0 ? 1 : 5} className="page-box-right" spacing={1}>
                        <DataGrid
                            disableRowSelectionOnClick
                            className={rowSelectionModel.length > 0 ? 'data-grid-row-chosed' : 'data-grid-row'}
                            rowHeight={46}
                            autoHeight={pageSMS.items.length === 0}
                            columns={columns}
                            rows={pageSMS.items}
                            hideFooter
                            checkboxSelection
                            onRowClick={(item) => choseRow(item)}
                            localeText={TextTranslate}
                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                setRowSelectionModel(newRowSelectionModel);
                            }}
                            rowSelectionModel={rowSelectionModel}
                        />
                        <CustomTablePagination
                            currentPage={paramSearch.currentPage ?? 1}
                            rowPerPage={paramSearch.pageSize ?? 10}
                            totalRecord={pageSMS.totalCount}
                            totalPage={pageSMS.totalPage}
                            handlePerPageChange={handlePerPageChange}
                            handlePageChange={handleChangePage}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
