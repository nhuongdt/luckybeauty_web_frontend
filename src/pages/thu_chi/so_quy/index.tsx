import { Box, Grid, Stack, TextField, IconButton, Button, SelectChangeEvent } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';

import { ReactComponent as FilterIcon } from '../../../images/filter-icon.svg';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import SearchIcon from '../../../images/search-normal.svg';

import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import CreateOrEditSoQuyDialog from './components/CreateOrEditSoQuyDialog';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { TextTranslate } from '../../../components/TableLanguage';
import { RequestFromToDto } from '../../../services/dto/ParamSearchDto';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import { format, lastDayOfMonth } from 'date-fns';
import { DataGrid, GridColDef, GridSortModel, GridRowSelectionModel } from '@mui/x-data-grid';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import { GetAllQuyHoaDonItemDto } from '../../../services/so_quy/Dto/QuyHoaDonViewItemDto';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import utils from '../../../utils/utils';
import ActionViewEditDelete from '../../../components/Menu/ActionViewEditDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import { Add, Search } from '@mui/icons-material';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import fileDowloadService from '../../../services/file-dowload.service';
import abpCustom from '../../../components/abp-custom';
import ActionRowSelect from '../../../components/DataGrid/ActionRowSelect';
import DataMauIn from '../../admin/settings/mau_in/DataMauIn';
import { KhachHangItemDto } from '../../../services/khach-hang/dto/KhachHangItemDto';
import MauInServices from '../../../services/mau_in/MauInServices';
import chiNhanhService from '../../../services/chi_nhanh/chiNhanhService';
import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';

const PageSoQuy = ({ xx }: any) => {
    const today = new Date();
    const firstLoad = useRef(true);
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const [isShowModal, setisShowModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState('');
    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [paramSearch, setParamSearch] = useState<RequestFromToDto>({
        textSearch: '',
        currentPage: 1,
        columnSort: 'ngayLapHoaDon',
        typeSort: 'desc',
        idChiNhanhs: chinhanh.id === '' ? [] : [chinhanh.id],
        fromDate: format(today, 'yyyy-MM-01'),
        toDate: format(lastDayOfMonth(today), 'yyyy-MM-dd')
    });
    const [pageDataSoQuy, setPageDataSoQuy] = useState<PagedResultDto<QuyHoaDonDto>>({
        totalCount: 0,
        totalPage: 0,
        items: []
    });
    const [sortModel, setSortModel] = useState<GridSortModel>([
        {
            field: 'ngayLapHoaDon',
            sort: 'desc'
        }
    ]);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const GetListSoQuy = async () => {
        const data = await SoQuyServices.getAll(paramSearch);
        setPageDataSoQuy({
            totalCount: data.totalCount,
            totalPage: utils.getTotalPage(data.totalCount, paramSearch.pageSize),
            items: data.items
        });
    };
    const PageLoad = () => {
        GetListSoQuy();
    };
    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        setParamSearch({ ...paramSearch, idChiNhanhs: chinhanh.id === '' ? [] : [chinhanh.id] });
    }, [chinhanh.id]);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        GetListSoQuy();
    }, [
        paramSearch.currentPage,
        paramSearch.pageSize,
        paramSearch.fromDate,
        paramSearch.toDate,
        paramSearch.idChiNhanhs,
        paramSearch.columnSort,
        paramSearch.typeSort
    ]);

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
            GetListSoQuy();
        }
    };
    const exportToExcel = async () => {
        const param = { ...paramSearch };
        param.pageSize = pageDataSoQuy.totalCount;
        param.currentPage = 1;
        const data = await SoQuyServices.ExportToExcel(param);
        fileDowloadService.downloadExportFile(data);
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
            currentPage: 1,
            pageSize: parseInt(event.target.value.toString(), 10)
        });
    };

    const doActionRow = (action: number, itemSQ: GetAllQuyHoaDonItemDto) => {
        setSelectedRowId(itemSQ?.id);
        if (action < 2) {
            if (utils.checkNull(itemSQ?.idHoaDonLienQuan)) {
                setisShowModal(true);
            }
        } else {
            setinforDelete(
                new PropConfirmOKCancel({
                    show: true,
                    title: 'Xác nhận xóa',
                    mes: `Bạn có chắc chắn muốn xóa ${itemSQ?.loaiPhieu ?? ' '}  ${
                        itemSQ?.maHoaDon ?? ' '
                    } không?`
                })
            );
        }
    };

    const deleteSoQuy = async () => {
        if (rowSelectionModel.length > 0) {
            const ok = await SoQuyServices.DeleteMultiple_QuyHoaDon(rowSelectionModel);
            if (ok) {
                setObjAlert({
                    show: true,
                    type: 1,
                    mes: `Hủy ${rowSelectionModel.length} sổ quỹ thành công`
                });
                setPageDataSoQuy({
                    ...pageDataSoQuy,
                    items: pageDataSoQuy.items.filter(
                        (x: any) => !rowSelectionModel.toString().includes(x.id)
                    ),
                    totalCount: pageDataSoQuy.totalCount - rowSelectionModel.length,
                    totalPage: utils.getTotalPage(
                        pageDataSoQuy.totalCount - rowSelectionModel.length,
                        paramSearch.pageSize
                    )
                });
                setRowSelectionModel([]);
            } else {
                setObjAlert({
                    show: true,
                    type: 2,
                    mes: `Hủy ${rowSelectionModel.length} sổ quỹ thất bại`
                });
            }
        } else {
            await SoQuyServices.DeleteSoQuy(selectedRowId);
            setPageDataSoQuy({
                ...pageDataSoQuy,
                items: pageDataSoQuy.items.filter((x: any) => x.id !== selectedRowId),
                totalCount: pageDataSoQuy.totalCount - 1,
                totalPage: utils.getTotalPage(pageDataSoQuy.totalCount - 1, paramSearch.pageSize)
            });
            setObjAlert({
                show: true,
                type: 1,
                mes: 'Hủy thành công'
            });
        }
        setinforDelete(
            new PropConfirmOKCancel({
                show: false,
                title: '',
                mes: ''
            })
        );
    };

    const saveSoQuy = async (dataSave: any, type: number) => {
        setisShowModal(false);
        switch (type) {
            case 1: // insert
                {
                    // phải gán lại ngày lập: để chèn dc dòng mới thêm lên trên cùng
                    dataSave.ngayLapHoaDon = new Date(dataSave.ngayLapHoaDon);
                    setPageDataSoQuy({
                        ...pageDataSoQuy,
                        items: [dataSave, ...pageDataSoQuy.items],
                        totalCount: pageDataSoQuy.totalCount + 1,
                        totalPage: utils.getTotalPage(
                            pageDataSoQuy.totalCount + 1,
                            paramSearch.pageSize
                        )
                    });
                    setObjAlert({
                        show: true,
                        type: 1,
                        mes: 'Thêm ' + dataSave.loaiPhieu + ' thành công'
                    });
                }
                break;
            case 2:
                setPageDataSoQuy({
                    ...pageDataSoQuy,
                    items: pageDataSoQuy.items.map((item: any) => {
                        if (item.id === selectedRowId) {
                            return {
                                ...item,
                                maHoaDon: dataSave.maHoaDon,
                                ngayLapHoaDon: dataSave.ngayLapHoaDon,
                                idLoaiChungTu: dataSave.idLoaiChungTu,
                                loaiPhieu: dataSave.loaiPhieu,
                                hinhThucThanhToan: dataSave.hinhThucThanhToan,
                                sHinhThucThanhToan: dataSave.sHinhThucThanhToan,
                                tongTienThu: dataSave.tongTienThu,
                                maNguoiNop: dataSave.maNguoiNop,
                                tenNguoiNop: dataSave.tenNguoiNop,
                                idKhoanThuChi: dataSave.idKhoanThuChi,
                                tenKhoanThuChi: dataSave.tenKhoanThuChi,
                                txtTrangThai: dataSave.txtTrangThai,
                                trangThai: dataSave.trangThai
                            };
                        } else {
                            return item;
                        }
                    })
                });
                setObjAlert({
                    show: true,
                    type: 1,
                    mes: 'Cập nhật ' + dataSave.loaiPhieu + ' thành công'
                });
                break;
            case 3:
                await deleteSoQuy();
                break;
        }
    };

    const DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case 1:
                setinforDelete({
                    ...inforDelete,
                    show: true,
                    mes: `Bạn có chắc chắn muốn xóa ${rowSelectionModel.length} sổ quỹ này không?`
                });
                break;
            case 2:
                {
                    let htmlPrint = '';
                    for (let i = 0; i < rowSelectionModel.length; i++) {
                        const idSoquy = rowSelectionModel[i].toString();
                        // select dataQuyHoaDon from page
                        const quyHD = pageDataSoQuy.items.filter((x: any) => x.id === idSoquy);
                        const quyCT = await SoQuyServices.GetQuyChiTiet_byIQuyHoaDon(idSoquy);

                        if (quyHD.length > 0) {
                            console.log('quyHD ', quyHD);
                            DataMauIn.congty = appContext.congty;
                            const chinhanhPrint = await await chiNhanhService.GetDetail(
                                quyHD[0]?.idChiNhanh ?? ''
                            );
                            DataMauIn.chinhanh = chinhanhPrint;
                            DataMauIn.khachhang = {
                                maKhachHang: quyHD[0]?.maNguoiNop,
                                tenKhachHang: quyHD[0].tenNguoiNop,
                                soDienThoai: quyHD[0]?.sdtNguoiNop
                            } as KhachHangItemDto;
                            DataMauIn.phieuthu = quyHD[0];
                            DataMauIn.phieuthu.quyHoaDon_ChiTiet = quyCT;

                            let tempMauIn = '';
                            if (quyHD[0].idLoaiChungTu === 11) {
                                tempMauIn = await MauInServices.GetFileMauIn('K80_PhieuThu.txt');
                            } else {
                                tempMauIn = await MauInServices.GetFileMauIn('K80_PhieuChi.txt');
                            }
                            let newHtml = DataMauIn.replaceChiNhanh(tempMauIn);
                            newHtml = DataMauIn.replacePhieuThuChi(newHtml);
                            if (i < rowSelectionModel.length - 1) {
                                htmlPrint = htmlPrint.concat(
                                    newHtml,
                                    `<p style="page-break-before:always;"></p>`
                                );
                            } else {
                                htmlPrint = htmlPrint.concat(newHtml);
                            }
                        }
                    }
                    DataMauIn.Print(htmlPrint);
                }
                break;
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'loaiPhieu',
            headerName: 'Loại phiếu',
            flex: 0.8,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params) => (
                <Box title={params.value} width="100%">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'maHoaDon',
            headerName: 'Mã phiếu',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'ngayLapHoaDon',
            headerName: 'Ngày lập',
            headerAlign: 'center',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} width="100%" textAlign="center">
                    {format(new Date(params.value), 'dd/MM/yyyy HH:mm')}
                </Box>
            )
        },
        // {
        //     field: 'tenKhoanThuChi',
        //     headerName: 'Loại thu chi',
        //     minWidth: 118,
        //     flex: 1,
        //     renderHeader: (params: any) => (
        //         <Box title={params.value}>
        //             {params.colDef.headerName}
        //             <IconSorting
        //                 onClick={() => {
        //                     setParamSearch({ ...paramSearch, columnSort: 'tenKhoanThuChi' });
        //                 }}
        //             />
        //         </Box>
        //     ),
        //     renderCell: (params: any) => <Box title={params.value}>{params.value}</Box>
        // },
        {
            field: 'tenNguoiNop',
            headerName: 'Người nộp',
            // minWidth: 118,
            flex: 1.5,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'tongTienThu',
            headerName: 'Tổng tiền',
            headerAlign: 'right',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} width="100%" textAlign="end">
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'sHinhThucThanhToan',
            headerName: 'Hình thức',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} width="100%">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'txtTrangThai',
            headerName: 'Trạng thái',
            headerAlign: 'center',
            minWidth: 118,
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
                            params.value === 'Đã thanh toán'
                                ? '#E8FFF3'
                                : params.value === 'Chưa thanh toán'
                                ? '#FFF8DD'
                                : '#FFF5F8',
                        color:
                            params.value === 'Đã thanh toán'
                                ? '#50CD89'
                                : params.value === 'Chưa thanh toán'
                                ? '#FF9900'
                                : '#F1416C',
                        margin: 'auto'
                    }}
                    className="state-thanh-toan">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: '#',
            headerAlign: 'center',
            width: 48,
            flex: 0.4,
            disableColumnMenu: true,
            renderCell: (params) => (
                <ActionViewEditDelete
                    handleAction={(action: any) => doActionRow(action, params.row)}
                />
            ),
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        }
    ];

    return (
        <>
            <CreateOrEditSoQuyDialog
                onClose={() => {
                    setisShowModal(false);
                }}
                onOk={saveSoQuy}
                visiable={isShowModal}
                idQuyHD={selectedRowId}
            />
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={deleteSoQuy}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Box paddingTop={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} lg={5} md={12}>
                        <Grid container alignItems="center">
                            <Grid item xs={4} sm={5} lg={2} md={2}>
                                <span className="page-title"> Sổ quỹ</span>
                            </Grid>
                            <Grid item xs={8} sm={7} lg={6} md={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    sx={{
                                        backgroundColor: '#fff',
                                        borderColor: '#CDC9CD!important',
                                        '& .MuiInputBase-root': {
                                            pl: '0'
                                        }
                                    }}
                                    onChange={(e: any) => {
                                        setParamSearch({
                                            ...paramSearch,
                                            textSearch: e.target.value
                                        });
                                    }}
                                    onKeyDown={handleKeyDownTextSearch}
                                    className="search-field"
                                    variant="outlined"
                                    type="search"
                                    placeholder="Tìm kiếm"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <Search />
                                            </IconButton>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={7} md={12}>
                        <Stack
                            direction={'row'}
                            spacing={1}
                            justifyContent={'flex-end'}
                            sx={{
                                '& button': {
                                    height: '40px'
                                }
                            }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    bgcolor: '#fff',
                                    alignItems: 'center',
                                    border: '1px solid #E6E1E6',
                                    borderRadius: '4px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none'
                                    },
                                    '& .MuiInputBase-root': {
                                        paddingRight: '0',
                                        flexDirection: 'row-reverse'
                                    }
                                }}>
                                <DatePickerCustom
                                    defaultVal={paramSearch.fromDate}
                                    handleChangeDate={(newVal: string) =>
                                        setParamSearch({ ...paramSearch, fromDate: newVal })
                                    }
                                />
                                <Box>-</Box>
                                <DatePickerCustom
                                    defaultVal={paramSearch.toDate}
                                    handleChangeDate={(newVal: string) =>
                                        setParamSearch({ ...paramSearch, toDate: newVal })
                                    }
                                />
                            </Box>
                            <Button
                                hidden={!abpCustom.isGrandPermission('Pages.QuyHoaDon.Export')}
                                variant="outlined"
                                onClick={exportToExcel}
                                startIcon={<UploadIcon />}
                                sx={{
                                    borderColor: '#CDC9CD!important',
                                    bgcolor: '#fff!important',
                                    color: '#333233',
                                    fontSize: '14px'
                                }}
                                className="btn-outline-hover">
                                Xuất{' '}
                            </Button>
                            <Button
                                hidden={!abpCustom.isGrandPermission('Pages.QuyHoaDon.Create')}
                                variant="contained"
                                startIcon={<Add />}
                                sx={{
                                    color: '#fff',
                                    fontSize: '14px'
                                }}
                                className="btn-container-hover"
                                onClick={() => {
                                    setisShowModal(true);
                                    setSelectedRowId('');
                                }}>
                                Lập phiếu
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>

                {rowSelectionModel.length > 0 && (
                    <div style={{ marginTop: '24px' }}>
                        <ActionRowSelect
                            lstOption={[
                                {
                                    id: '1',
                                    text: 'Xóa sổ quỹ'
                                },
                                {
                                    id: '2',
                                    text: 'In sổ quỹ'
                                }
                            ]}
                            countRowSelected={rowSelectionModel.length}
                            title="sổ quỹ"
                            choseAction={DataGrid_handleAction}
                        />
                    </div>
                )}
                <Box marginTop={rowSelectionModel.length > 0 ? 1 : 5} className="page-box-right">
                    <DataGrid
                        disableRowSelectionOnClick
                        className={
                            rowSelectionModel.length > 0 ? 'data-grid-row-chosed' : 'data-grid-row'
                        }
                        rowHeight={46}
                        rows={pageDataSoQuy.items}
                        columns={columns}
                        checkboxSelection
                        hideFooter
                        localeText={TextTranslate}
                        sortModel={sortModel}
                        sortingOrder={['desc', 'asc']}
                        onSortModelChange={(newSortModel) => {
                            setSortModel(() => newSortModel);
                            if (newSortModel.length > 0) {
                                setParamSearch({
                                    ...paramSearch,
                                    columnSort: newSortModel[0].field,
                                    typeSort: newSortModel[0].sort?.toString()
                                });
                            } else {
                                // vì fistload: mặc dịnh sort 'ngaylapHoaDon decs'
                                // nên nếu click cột ngaylapHoaDon luôn, thì newSortModel = []
                                setParamSearch({
                                    ...paramSearch,
                                    typeSort: 'asc'
                                });
                            }
                        }}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setRowSelectionModel(newRowSelectionModel);
                        }}
                        rowSelectionModel={rowSelectionModel}
                    />

                    <CustomTablePagination
                        currentPage={paramSearch.currentPage ?? 0}
                        rowPerPage={paramSearch.pageSize ?? 10}
                        totalRecord={pageDataSoQuy.totalCount ?? 0}
                        totalPage={pageDataSoQuy.totalPage}
                        handlePerPageChange={handlePerPageChange}
                        handlePageChange={handleChangePage}
                    />
                </Box>
            </Box>
        </>
    );
};

export default PageSoQuy;
