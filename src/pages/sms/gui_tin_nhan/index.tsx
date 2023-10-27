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
import { useState } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridValidRowModel } from '@mui/x-data-grid';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import { PagedRequestDto } from '../../../services/dto/pagedRequestDto';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { CreateOrEditSMSDto, PagedResultSMSDto } from '../../../services/sms/gui_tin_nhan/create_or_edit_sms_dto';
import { TextTranslate } from '../../../components/TableLanguage';
import ActionViewEditDelete from '../../../components/Menu/ActionViewEditDelete';
import { format } from 'date-fns';

export default function PageSMS({ xx }: any) {
    const [isShowModalAdd, setIsShowModalAdd] = useState(false);
    const [isShowModalNapTien, setIsShowModalNapTien] = useState(false);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [dataGrid_typeAction, setDataGrid_typeAction] = useState(0);
    const [inforDelete, setInforDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));

    const [pageSMS, setPageSMS] = useState<PagedResultSMSDto>(new PagedResultSMSDto({ items: [] }));
    const [paramSearch, setParamSearch] = useState<PagedRequestDto>({
        keyword: '',
        skipCount: 1,
        maxResultCount: 5,
        sortBy: 'createTime',
        sortType: 'DESC'
    } as PagedRequestDto);

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        if (paramSearch.skipCount !== 1) {
            setParamSearch({
                ...paramSearch,
                skipCount: 1
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
        param.skipCount = 1;
    };

    const handleChangePage = (event: any, value: number) => {
        setParamSearch({
            ...paramSearch,
            skipCount: value
        });
    };
    const handlePerPageChange = (event: SelectChangeEvent<number>) => {
        setParamSearch({
            ...paramSearch,
            maxResultCount: parseInt(event.target.value.toString(), 10)
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

    const columns: GridColDef[] = [
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
            field: 'thoiGianGui',
            headerName: 'Thời gian gửi',
            headerAlign: 'center',
            align: 'center',
            flex: 0.8,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => <Box title={params.value}>{format(new Date(params.value), 'dd/MM/yyyy')}</Box>
        },
        {
            field: 'loaiTinNhan',
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
                            params.row.trangThai === 3 ? '#E8FFF3' : params.row.trangThai === 1 ? '#FFF8DD' : '#FFF5F8',
                        color:
                            params.row.trangThai === 3 ? '#50CD89' : params.row.trangThai === 1 ? '#FF9900' : '#F1416C',
                        margin: 'auto'
                    }}
                    className="state-thanh-toan">
                    {params.value}
                </Box>
            )
        },
        {
            field: '#',
            headerAlign: 'center',
            width: 48,
            flex: 0.4,
            disableColumnMenu: true,
            renderCell: (params) => (
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
                        }
                    ]}
                    handleAction={(action: any) => doActionRow(action, params.row)}
                />
            ),
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        }
    ];

    return (
        <>
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
                            currentPage={paramSearch.skipCount ?? 1}
                            rowPerPage={paramSearch.maxResultCount ?? 10}
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
