import React, { useEffect, useRef, useState, useContext } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    IconButton,
    Button,
    SelectChangeEvent
} from '@mui/material';
import SearchIcon from '../../../images/search-normal.svg';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as FilterIcon } from '../../../images/filter-icon.svg';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import ThongTinHoaDon from '../Hoa_don/ThongTinHoaDon';
import { ChiNhanhContext } from '../../../services/chi_nhanh/ChiNhanhContext';

import Utils from '../../../utils/utils'; // func common.
import { format, lastDayOfMonth } from 'date-fns';

import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import { HoaDonRequestDto } from '../../../services/dto/ParamSearchDto';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';

const GiaoDichThanhToan: React.FC = () => {
    const today = new Date();
    const firstLoad = useRef(true);
    const current = useContext(ChiNhanhContext);
    console.log('current ', current);

    const [idHoadonChosing, setIdHoadonChosing] = useState('');
    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(new PageHoaDonDto({ id: '' }));

    const [paramSearch, setParamSearch] = useState<HoaDonRequestDto>({
        textSearch: '',
        idChiNhanhs: [current.id],
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

    const GetListHoaDon = async () => {
        const data = await HoaDonService.GetListHoaDon(paramSearch);
        setPageDataHoaDon({
            totalCount: data.totalCount,
            totalPage: Utils.getTotalPage(data.totalCount, paramSearch.pageSize),
            items: data.items
        });
    };

    const PageLoad = () => {
        GetListHoaDon();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        GetListHoaDon();
    }, [paramSearch.currentPage, paramSearch.pageSize, paramSearch.fromDate, paramSearch.toDate]);

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

    const choseRow = (param: any) => {
        console.log('into');
        setIdHoadonChosing(param.id);
        setHoaDon(param.row);
    };

    const columns: GridColDef[] = [
        {
            field: 'maHoaDon',
            headerName: 'Mã hóa đơn',
            minWidth: 100,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting />{' '}
                </Box>
            ),
            renderCell: (params: any) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'ngayLapHoaDon',
            headerName: 'Ngày bán',
            headerAlign: 'center',
            align: 'center',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value}>{format(new Date(params.value), 'dd/MM/yyyy HH:mm')}</Box>
            )
        },
        {
            field: 'tenKhachHang',
            headerName: 'Tên khách hàng',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting />{' '}
                </Box>
            ),
            renderCell: (params: any) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'tongTienHang',
            headerName: 'Tổng tiền hàng',
            headerAlign: 'right',
            align: 'right',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value}>
                    {new Intl.NumberFormat('en-IN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'tongGiamGiaHD',
            headerName: 'Tổng giảm giá',
            headerAlign: 'right',
            align: 'right',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value}>
                    {' '}
                    {new Intl.NumberFormat('en-IN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'tongThanhToan',
            headerName: 'Tổng phải trả',
            headerAlign: 'right',
            align: 'right',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value}>
                    {' '}
                    {new Intl.NumberFormat('en-IN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'daThanhToan',
            headerName: 'Khách đã trả',
            headerAlign: 'right',
            align: 'right',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value}>
                    {' '}
                    {new Intl.NumberFormat('en-IN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'conNo',
            headerName: 'Còn nợ',
            headerAlign: 'right',
            align: 'right',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting />{' '}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value}>
                    {' '}
                    {new Intl.NumberFormat('en-IN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'txtTrangThaiHD',
            headerName: 'Trạng thái',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => (
                <Box title={params.value}>
                    {params.colDef.headerName}
                    <IconSorting />{' '}
                </Box>
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
                                : '#F1416C'
                    }}
                    className="state-thanh-toan">
                    {params.value}
                </Box>
            )
        }
    ];
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (params: any) => {
        setSelectedRow(params.id);
    };
    const CustomRowDetails = ({ row }: any) => {
        // Giao diện tùy chỉnh dưới hàng được chọn
        return (
            <div>
                <h4>Thông tin chi tiết</h4>
                <p>ID: {row.id}</p>
                <p>Name: {row.name}</p>
                {/* Các trường thông tin khác */}
            </div>
        );
    };
    return (
        <>
            {idHoadonChosing !== '' ? (
                <ThongTinHoaDon
                    idHoaDon={idHoadonChosing}
                    hoadon={hoadon}
                    gotoBack={() => setIdHoadonChosing('')}
                />
            ) : (
                <Box padding="16px 2.2222222222222223vw 16px 2.2222222222222223vw">
                    <Grid container justifyContent="space-between">
                        <Grid item md="auto" display="flex" alignItems="center" gap="10px">
                            <Typography
                                color="#333233"
                                variant="h1"
                                fontSize="16px"
                                fontWeight="700">
                                Giao dịch thanh toán
                            </Typography>
                            <Box className="form-search">
                                <TextField
                                    size="small"
                                    sx={{
                                        backgroundColor: '#FFFAFF',
                                        borderColor: '#CDC9CD!important'
                                    }}
                                    className="search-field"
                                    variant="outlined"
                                    type="search"
                                    placeholder="Tìm kiếm"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton type="button">
                                                <img src={SearchIcon} />
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
                            </Box>
                        </Grid>
                        <Grid item md="auto">
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '8px',
                                    '& button': {
                                        height: '40px'
                                    }
                                }}>
                                <DatePickerCustom
                                    defaultVal={paramSearch.fromDate}
                                    handleChangeDate={(newVal: string) =>
                                        setParamSearch({ ...paramSearch, fromDate: newVal })
                                    }
                                />
                                <DatePickerCustom
                                    defaultVal={paramSearch.toDate}
                                    handleChangeDate={(newVal: string) =>
                                        setParamSearch({ ...paramSearch, toDate: newVal })
                                    }
                                />

                                <Button
                                    variant="outlined"
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
                                        bgcolor: '#7C3367!important',
                                        color: '#fff',
                                        fontSize: '14px'
                                    }}
                                    className="btn-container-hover">
                                    Bộ lọc{' '}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box marginTop="16px">
                        <DataGrid
                            autoHeight
                            columns={columns}
                            rows={pageDataHoaDon.items}
                            hideFooter
                            checkboxSelection
                            onRowClick={(row) => choseRow(row)}
                            sx={{
                                '& .MuiDataGrid-iconButtonContainer': {
                                    display: 'none'
                                },
                                '& .MuiDataGrid-columnHeadersInner': {
                                    backgroundColor: '#F2EBF0'
                                },
                                '& .MuiBox-root': {
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontSize: '12px'
                                },
                                '& .MuiDataGrid-columnHeaderTitleContainerContent .MuiBox-root': {
                                    fontWeight: '700'
                                },
                                '& .MuiDataGrid-virtualScroller': {
                                    bgcolor: '#fff'
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
                            localeText={TextTranslate}
                        />
                        <CustomTablePagination
                            currentPage={paramSearch.currentPage ?? 1}
                            rowPerPage={paramSearch.pageSize ?? 10}
                            totalRecord={pageDataHoaDon.totalCount}
                            totalPage={pageDataHoaDon.totalPage}
                            handlePerPageChange={handlePerPageChange}
                            handlePageChange={handleChangePage}
                        />
                    </Box>
                </Box>
            )}
        </>
    );
};
export default GiaoDichThanhToan;
