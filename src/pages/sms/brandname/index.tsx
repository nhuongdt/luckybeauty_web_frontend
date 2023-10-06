import { useEffect, useState } from 'react';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import {
    Button,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography,
    Box,
    SelectChangeEvent
} from '@mui/material';
import { DeleteSweepOutlined, PrintOutlined, Search } from '@mui/icons-material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { format, lastDayOfMonth } from 'date-fns';

import { PagedRequestDto } from '../../../services/dto/pagedRequestDto';
import ActionRowSelect from '../../../components/DataGrid/ActionRowSelect';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { TextTranslate } from '../../../components/TableLanguage';
import {
    BrandnameDto,
    PagedResultBrandnameDto
} from '../../../services/sms/brandname/BrandnameDto';
import BrandnameService from '../../../services/sms/brandname/BrandnameService';
import ModalCreateOrEditBrandname from './modal_create_or_edit_brandname';

export default function PageBrandname() {
    const [isShowModalAdd, setIsShowModalAdd] = useState(false);
    const [brandChosed, setBrandChosed] = useState<BrandnameDto>({ id: '' } as BrandnameDto);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [inforDelete, setInforDelete] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );
    const [paramSearch, setParamSearch] = useState<PagedRequestDto>({
        keyword: '',
        skipCount: 1,
        maxResultCount: 5,
        sortBy: 'createTime',
        sortType: 'DESC'
    } as PagedRequestDto);

    const [pageDataBrandname, setPageDataBrandname] = useState<PagedResultBrandnameDto>({
        items: [] as BrandnameDto[]
    } as PagedResultBrandnameDto);

    useEffect(() => {
        GetListBrandname();
    }, []);

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
            GetListBrandname();
        }
    };

    const GetListBrandname = async () => {
        const data = await BrandnameService.GetListBandname(paramSearch);
        console.log('GetListBrandname ', data);

        if (data !== null) {
            setPageDataBrandname({
                items: data.items,
                totalCount: data.totalCount,
                totalPage: data.totalPage
            });
        }
    };

    const exportToExcel = () => {
        //
    };

    const choseRow = (item: any) => {
        console.log('into');
        setBrandChosed(item);
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

    const DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case 1:
                setInforDelete({
                    ...inforDelete,
                    show: true,
                    mes: 'Bạn có chắc chắn muốn xóa những brandname này không?'
                });
                break;
            case 2:
                {
                    //
                }
                break;
        }
    };

    const onSaveBrandname = (dataSave: BrandnameDto) => {
        setIsShowModalAdd(false);
        setPageDataBrandname({
            ...pageDataBrandname,
            items: [dataSave, ...pageDataBrandname.items],
            totalCount: pageDataBrandname.totalCount + 1
        });
    };

    const columns: GridColDef[] = [
        {
            field: 'brandname',
            headerName: 'Tên brandname',
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            )
        },
        {
            field: 'sdtCuaHang',
            headerName: 'SDT cửa hàng',
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            )
        },
        {
            field: 'ngayKichHoat',
            headerName: 'Ngày kích hoạt',
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value}>{format(new Date(params.value), 'dd/MM/yyyy HH:mm')}</Box>
            )
        },
        {
            field: 'tongTienNap',
            headerName: 'Tổng tiền nạp',
            headerAlign: 'center',
            align: 'right',
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'daSuDung',
            headerName: 'Đã sử dụng',
            headerAlign: 'center',
            align: 'right',
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'conLai',
            headerName: 'Còn lại',
            headerAlign: 'center',
            align: 'right',
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} textAlign="center" width="100%">
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'txtTrangThai',
            headerAlign: 'center',
            headerName: 'Trạng thái',
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => (
                <Box
                    title={params.value}
                    sx={{
                        padding: '4px 8px',
                        borderRadius: '100px',
                        backgroundColor:
                            params.row.trangThai === 3
                                ? '#E8FFF3'
                                : params.row.trangThai === 1
                                ? '#FFF8DD'
                                : '#FFF5F8',
                        color:
                            params.row.trangThai === 3
                                ? '#50CD89'
                                : params.row.trangThai === 1
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
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>

            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                // onOk={Delete_MultipleHoaDon}
                onCancel={() => setInforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <ModalCreateOrEditBrandname
                isShow={isShowModalAdd}
                onClose={() => setIsShowModalAdd(false)}
                idBrandname=""
                objUpdate={brandChosed}
                onSave={onSaveBrandname}
            />

            <Grid container paddingTop={2}>
                <Grid item xs={6}>
                    <Grid container alignItems={'center'}>
                        <Grid item lg={4}>
                            <Typography className="page-title">Danh mục brandname</Typography>
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
                                    setParamSearch((itemOlds: any) => {
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
                            startIcon={<FileDownloadOutlinedIcon />}
                            className="btnNhapXuat btn-outline-hover"
                            sx={{ bgcolor: '#fff!important', color: '#666466' }}>
                            Xuất
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setIsShowModalAdd(true);
                                setBrandChosed({ id: '' } as BrandnameDto);
                            }}>
                            Thêm mới
                        </Button>
                        <Button variant="contained">Nạp tiền</Button>
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
                                        icon: (
                                            <DeleteSweepOutlined
                                                sx={{ width: '1rem', height: '1rem' }}
                                            />
                                        )
                                    },
                                    {
                                        id: '2',
                                        text: 'In brandname',
                                        icon: (
                                            <PrintOutlined sx={{ width: '1rem', height: '1rem' }} />
                                        )
                                    }
                                ]}
                                countRowSelected={rowSelectionModel.length}
                                title="brandname"
                                choseAction={DataGrid_handleAction}
                            />
                        </div>
                    )}

                    <Stack
                        marginTop={rowSelectionModel.length > 0 ? 1 : 5}
                        className="page-box-right"
                        spacing={1}>
                        <DataGrid
                            disableRowSelectionOnClick
                            className={
                                rowSelectionModel.length > 0
                                    ? 'data-grid-row-chosed'
                                    : 'data-grid-row'
                            }
                            rowHeight={46}
                            autoHeight={pageDataBrandname.items.length === 0}
                            columns={columns}
                            rows={pageDataBrandname.items}
                            hideFooter
                            checkboxSelection
                            onRowClick={(item: any) => choseRow(item)}
                            localeText={TextTranslate}
                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                setRowSelectionModel(newRowSelectionModel);
                            }}
                            rowSelectionModel={rowSelectionModel}
                        />
                        <CustomTablePagination
                            currentPage={paramSearch.skipCount ?? 1}
                            rowPerPage={paramSearch.maxResultCount ?? 10}
                            totalRecord={pageDataBrandname.totalCount}
                            totalPage={pageDataBrandname.totalPage}
                            handlePerPageChange={handlePerPageChange}
                            handlePageChange={handleChangePage}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
