import React, { useEffect, useRef, useState, useContext } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    IconButton,
    Button,
    SelectChangeEvent,
    Stack,
    Select,
    MenuItem
} from '@mui/material';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { Search } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { ReactComponent as FilterIcon } from '../../../images/filter-icon.svg';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import ThongTinHoaDon from '../Hoa_don/ThongTinHoaDon';
import { AppContext, ChiNhanhContextbyUser } from '../../../services/chi_nhanh/ChiNhanhContext';
import chiNhanhService from '../../../services/chi_nhanh/chiNhanhService';
import { ChiNhanhDto } from '../../../services/chi_nhanh/Dto/chiNhanhDto';

import Utils from '../../../utils/utils'; // func common.
import { format, lastDayOfMonth } from 'date-fns';
import avatar from '../../../images/avatar.png';
import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import { HoaDonRequestDto } from '../../../services/dto/ParamSearchDto';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import fileDowloadService from '../../../services/file-dowload.service';
import { MauInDto } from '../../../services/mau_in/MauInDto';
import MauInServices from '../../../services/mau_in/MauInServices';
import ActionRowSelect from '../../../components/DataGrid/ActionRowSelect';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import DataMauIn from '../../admin/settings/mau_in/DataMauIn';
import { KhachHangItemDto } from '../../../services/khach-hang/dto/KhachHangItemDto';

const GiaoDichThanhToan: React.FC = () => {
    const today = new Date();
    const firstLoad = useRef(true);
    const appContext = useContext(AppContext);
    const chinhanhCurrent = appContext.chinhanhCurrent;
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [idHoadonChosing, setIdHoadonChosing] = useState('');
    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(new PageHoaDonDto({ id: '' }));
    const [allChiNhanh, setAllChiNhanh] = useState<ChiNhanhDto[]>([]);
    const [lstMauIn, setLstMauIn] = useState<MauInDto[]>([]);
    const [inforDelete, setInforDeleteProduct] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );

    const [paramSearch, setParamSearch] = useState<HoaDonRequestDto>({
        textSearch: '',
        idChiNhanhs: [chinhanhCurrent?.id],
        currentPage: 1,
        pageSize: 5,
        columnSort: 'NgayLapHoaDon',
        typeSort: 'DESC',
        fromDate: format(today, 'yyyy-MM-01'),
        toDate: format(lastDayOfMonth(today), 'yyyy-MM-dd')
    });

    const [pageDataHoaDon, setPageDataHoaDon] = useState<PagedResultDto<PageHoaDonDto>>({
        totalCount: 0,
        totalPage: 0,
        items: []
    });
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);

    const GetListHoaDon = async () => {
        const data = await HoaDonService.GetListHoaDon(paramSearch);
        setPageDataHoaDon({
            totalCount: data.totalCount,
            totalPage: Utils.getTotalPage(data.totalCount, paramSearch.pageSize),
            items: data.items
        });
    };

    const GetlstMauIn_byChiNhanh = async () => {
        const data = await MauInServices.GetAllMauIn_byChiNhanh(chinhanhCurrent?.id, 1);
        setLstMauIn(data);
    };

    const GetAllChiNhanh = async () => {
        const data = await chiNhanhService.GetAll({
            keyword: '',
            maxResultCount: 10,
            skipCount: 1
        });
        if (data != null) {
            setAllChiNhanh(data.items);
        }
    };

    const PageLoad = () => {
        GetListHoaDon();
        GetAllChiNhanh();
        GetlstMauIn_byChiNhanh();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        setParamSearch({ ...paramSearch, idChiNhanhs: [chinhanhCurrent.id] });
    }, [chinhanhCurrent.id]);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        GetListHoaDon();
    }, [
        paramSearch.currentPage,
        paramSearch.pageSize,
        paramSearch.fromDate,
        paramSearch.toDate,
        paramSearch.idChiNhanhs
    ]);

    const handleKeyDownTextSearch = (event: any) => {
        console.log(22);
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
            GetListHoaDon();
        }
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

    const [openDetail, setOpenDetail] = useState(false);

    const choseRow = (param: any) => {
        console.log('into');
        setIdHoadonChosing(param.id);
        setHoaDon(param.row);
        setOpenDetail(true);
    };

    const childGotoBack = (hoadonAfterChange: PageHoaDonDto, typeAction = 0) => {
        setOpenDetail(false);
        setIdHoadonChosing('');

        switch (typeAction) {
            case 1: // update
                if (hoadonAfterChange.idChiNhanh !== hoadon?.idChiNhanh) {
                    // remove if huyhoadon or change chinhanh
                    setPageDataHoaDon({
                        ...pageDataHoaDon,
                        items: pageDataHoaDon.items.filter(
                            (x: any) => x.id !== hoadonAfterChange.id
                        )
                    });
                } else {
                    setPageDataHoaDon({
                        ...pageDataHoaDon,
                        items: pageDataHoaDon.items.map((itemHD: PageHoaDonDto) => {
                            if (itemHD.id === hoadonAfterChange.id) {
                                return hoadonAfterChange;
                            } else {
                                return itemHD;
                            }
                        })
                    });
                }
                break;
            case 2: // delete
                setPageDataHoaDon({
                    ...pageDataHoaDon,
                    items: pageDataHoaDon.items.map((itemHD: PageHoaDonDto) => {
                        if (itemHD.id === hoadonAfterChange.id) {
                            return { ...itemHD, trangThai: 0, txtTrangThaiHD: 'Đã hủy' };
                        } else {
                            return itemHD;
                        }
                    })
                });
                setObjAlert({ ...objAlert, show: true, mes: 'Hủy hóa đơn thành công' });
                break;
            default:
                break;
        }
    };
    const exportToExcel = async () => {
        const data = await HoaDonService.ExportToExcel(paramSearch);
        fileDowloadService.downloadExportFile(data);
    };
    console.log('apgeHoaDon');

    const DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case 1:
                setInforDeleteProduct({
                    ...inforDelete,
                    show: true,
                    mes: 'Bạn có chắc chắn muốn xóa những hóa đơn này không?'
                });
                break;
            case 2:
                {
                    let htmlPrint = '';
                    for (let i = 0; i < rowSelectionModel.length; i++) {
                        const idHoaDon = rowSelectionModel[i].toString();
                        const dataHoaDon = await HoaDonService.GetInforHoaDon_byId(idHoaDon);
                        const dataCTHD = await HoaDonService.GetChiTietHoaDon_byIdHoaDon(idHoaDon);

                        if (dataHoaDon.length > 0) {
                            DataMauIn.hoadon = dataHoaDon[0];
                            DataMauIn.hoadonChiTiet = dataCTHD;
                            DataMauIn.khachhang = {
                                maKhachHang: dataHoaDon[0]?.maKhachHang,
                                tenKhachHang: dataHoaDon[0]?.tenKhachHang,
                                soDienThoai: hoadon?.soDienThoai
                            } as KhachHangItemDto;
                            DataMauIn.chinhanh = {
                                tenChiNhanh: hoadon?.tenChiNhanh
                            } as ChiNhanhDto;
                            DataMauIn.congty = appContext.congty;
                            let tempMauIn = '';
                            const mauInMacDinh = lstMauIn.filter((x: MauInDto) => x.laMacDinh);
                            if (mauInMacDinh.length > 0) {
                                tempMauIn = mauInMacDinh[0].noiDungMauIn;
                            } else {
                                tempMauIn = await MauInServices.GetFileMauIn('K80_HoaDonBan.txt');
                            }
                            let newHtml = DataMauIn.replaceChiTietHoaDon(tempMauIn);
                            newHtml = DataMauIn.replaceChiNhanh(newHtml);
                            newHtml = DataMauIn.replaceHoaDon(newHtml);
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

    const Delete_MultipleHoaDon = async () => {
        await HoaDonService.Delete_MultipleHoaDon(rowSelectionModel);
        setInforDeleteProduct({ ...inforDelete, show: false });
        setObjAlert({ show: true, mes: 'Xóa thành công', type: 1 });

        setPageDataHoaDon({
            ...pageDataHoaDon,
            items: pageDataHoaDon.items.map((itemHD: PageHoaDonDto) => {
                if (rowSelectionModel.toString().indexOf(itemHD.id) > -1) {
                    return { ...itemHD, trangThai: 0, txtTrangThaiHD: 'Đã hủy' };
                } else {
                    return itemHD;
                }
            })
        });
    };
    const columns: GridColDef[] = [
        {
            field: 'maHoaDon',
            headerName: 'Mã hóa đơn',
            minWidth: 100,
            flex: 0.8,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => (
                <Box component="span" title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'ngayLapHoaDon',
            headerName: 'Ngày bán',
            headerAlign: 'center',
            align: 'center',
            minWidth: 130,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value}>{format(new Date(params.value), 'dd/MM/yyyy HH:mm')}</Box>
            )
        },
        {
            field: 'tenKhachHang',
            headerName: 'Tên khách hàng',
            minWidth: 140,
            flex: 1.5,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} component="span" textOverflow={'ellipsis'}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'tongTienHang',
            headerName: 'Tổng tiền hàng',
            headerAlign: 'center',
            align: 'right',
            minWidth: 118,
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
        // {
        //     field: 'tongGiamGiaHD',
        //     headerName: 'Tổng giảm giá', // bỏ bớt cột cho gọn
        //     headerAlign: 'center',
        //     align: 'center',
        //     minWidth: 118,
        //     flex: 1,
        //     renderHeader: (params: any) => (
        //         <Box title={params.value}>
        //             {params.colDef.headerName}
        //             <IconSorting />{' '}
        //         </Box>
        //     ),
        //     renderCell: (params: any) => (
        //         <Box title={params.value}>
        //             {' '}
        //             {new Intl.NumberFormat('vi-VN').format(params.value)}
        //         </Box>
        //     )
        // },
        {
            field: 'tongThanhToan',
            headerName: 'Tổng phải trả',
            headerAlign: 'center',
            align: 'right',
            minWidth: 118,
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
            field: 'daThanhToan',
            headerName: 'Khách đã trả',
            headerAlign: 'center',
            align: 'right',
            minWidth: 118,
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
            field: 'conNo',
            headerName: 'Còn nợ',
            headerAlign: 'right',
            align: 'right',
            minWidth: 100,
            flex: 0.5,
            renderHeader: (params: any) => (
                <Box title={params.value}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} component={'span'}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'txtTrangThaiHD',
            headerAlign: 'center',
            headerName: 'Trạng thái',
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
            <ChiNhanhContextbyUser.Provider value={allChiNhanh}>
                <ThongTinHoaDon
                    idHoaDon={idHoadonChosing}
                    hoadon={hoadon}
                    open={openDetail}
                    handleGotoBack={childGotoBack}
                    listMauIn={lstMauIn}
                />
            </ChiNhanhContextbyUser.Provider>

            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>

            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={Delete_MultipleHoaDon}
                onCancel={() =>
                    setInforDeleteProduct({ ...inforDelete, show: false })
                }></ConfirmDelete>

            <Box paddingTop={2}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={6} alignItems="center" gap="10px">
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={6} md={4}>
                                <span className="page-title"> Giao dịch thanh toán</span>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
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
                                                textSearch: event.target.value
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
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '8px',
                                justifyContent: { lg: 'end' }
                            }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    bgcolor: '#fff',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none!important'
                                    },
                                    '& input': {
                                        padding: '0!important'
                                    },
                                    border: '1px solid #CDC9CD',
                                    padding: '7px 16px',
                                    borderRadius: '4px',
                                    transition: '.4s',
                                    maxWidth: '300px',
                                    '&:hover': {
                                        borderColor: 'var(--color-main)'
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        pr: '0'
                                    },
                                    '& button': {
                                        // position: 'absolute',
                                        // height: '100%',
                                        // width: '100%',
                                        // left: '0',
                                        // top: '0',
                                        // borderRadius: '0',
                                        // bgcolor: 'unset!important',
                                        // opacity: '0'
                                        padding: '0',
                                        margin: '0'
                                    },
                                    '&  .MuiOutlinedInput-root': {
                                        display: 'flex',
                                        flexDirection: 'row-reverse',
                                        gap: '10px'
                                    },
                                    '& .date2 input': {
                                        textAlign: 'right'
                                    },
                                    '& .MuiFormControl-root': {
                                        width: 'unset'
                                    }
                                }}>
                                <Box>
                                    <DatePickerCustom
                                        defaultVal={paramSearch.fromDate}
                                        handleChangeDate={(newVal: string) =>
                                            setParamSearch({ ...paramSearch, fromDate: newVal })
                                        }
                                    />
                                </Box>
                                <Box sx={{ textAlign: 'center', flexBasis: '30%' }}>-</Box>
                                <Box className="date2">
                                    <DatePickerCustom
                                        defaultVal={paramSearch.toDate}
                                        handleChangeDate={(newVal: string) =>
                                            setParamSearch({ ...paramSearch, toDate: newVal })
                                        }
                                    />
                                </Box>
                            </Box>
                            <Button
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
                                variant="contained"
                                startIcon={<FilterIcon />}
                                sx={{
                                    bgcolor: 'var(--color-main)!important',
                                    color: '#fff',
                                    fontSize: '14px'
                                }}
                                className="btn-container-hover">
                                Bộ lọc{' '}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {rowSelectionModel.length > 0 && (
                    <ActionRowSelect
                        lstOption={[
                            {
                                id: '1',
                                text: 'Xóa hóa đơn',
                                icon: (
                                    <DeleteSweepOutlinedIcon
                                        sx={{ width: '1rem', height: '1rem' }}
                                    />
                                )
                            },
                            {
                                id: '2',
                                text: 'In hóa đơn',
                                icon: <PrintOutlinedIcon sx={{ width: '1rem', height: '1rem' }} />
                            }
                        ]}
                        countRowSelected={rowSelectionModel.length}
                        title="hóa đơn"
                        choseAction={DataGrid_handleAction}
                    />
                )}

                <Stack
                    marginTop={rowSelectionModel.length > 0 ? 1 : 5}
                    className="page-box-right"
                    spacing={1}>
                    <DataGrid
                        disableRowSelectionOnClick
                        className={
                            rowSelectionModel.length > 0 ? 'data-grid-row-chosed' : 'data-grid-row'
                        }
                        rowHeight={46}
                        columns={columns}
                        rows={pageDataHoaDon.items}
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
                        currentPage={paramSearch.currentPage ?? 1}
                        rowPerPage={paramSearch.pageSize ?? 10}
                        totalRecord={pageDataHoaDon.totalCount}
                        totalPage={pageDataHoaDon.totalPage}
                        handlePerPageChange={handlePerPageChange}
                        handlePageChange={handleChangePage}
                    />
                </Stack>
            </Box>
        </>
    );
};
export default GiaoDichThanhToan;
