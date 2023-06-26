import React, { useEffect, useRef, useState, useContext } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    IconButton,
    Button,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Collapse
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import SearchIcon from '../../../images/search-normal.svg';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as FilterIcon } from '../../../images/filter-icon.svg';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import ThongTinHoaDonn from '../Hoa_don/ChiTietHoaDon';
import { ChiNhanhContext } from '../../../services/chi_nhanh/ChiNhanhContext';

import Utils from '../../../utils/utils'; // func common.
import { format, lastDayOfMonth } from 'date-fns';
import avatar from '../../../images/avatar.png';
import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import { HoaDonRequestDto } from '../../../services/dto/ParamSearchDto';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';

interface TableRowData {
    id: number;
    name: string;
    description: string;
}
const GiaoDichThanhToanTest: React.FC = () => {
    // const today = new Date();
    // const firstLoad = useRef(true);
    // const current = useContext(ChiNhanhContext);
    // console.log('current ', current);

    // const [idHoadonChosing, setIdHoadonChosing] = useState('');
    // const [hoadon, setHoaDon] = useState<PageHoaDonDto>(new PageHoaDonDto({ id: '' }));

    // const [paramSearch, setParamSearch] = useState<HoaDonRequestDto>({
    //     textSearch: '',
    //     idChiNhanhs: [current.id],
    //     currentPage: 1,
    //     pageSize: 5,
    //     columnSort: 'NgayLapHoaDon',
    //     typeSort: 'DESC',
    //     fromDate: format(today, 'yyyy-MM-01'),
    //     toDate: format(lastDayOfMonth(today), 'yyyy-MM-dd')
    // });

    // const [pageDataHoaDon, setPageDataHoaDon] = useState<PagedResultDto<PageHoaDonDto>>({
    //     totalCount: 0,
    //     totalPage: 0,
    //     items: []
    // });

    // const GetListHoaDon = async () => {
    //     const data = await HoaDonService.GetListHoaDon(paramSearch);
    //     setPageDataHoaDon({
    //         totalCount: data.totalCount,
    //         totalPage: Utils.getTotalPage(data.totalCount, paramSearch.pageSize),
    //         items: data.items
    //     });
    // };

    // const PageLoad = () => {
    //     GetListHoaDon();
    // };

    // useEffect(() => {
    //     PageLoad();
    // }, []);

    // useEffect(() => {
    //     if (firstLoad.current) {
    //         firstLoad.current = false;
    //         return;
    //     }
    //     GetListHoaDon();
    // }, [paramSearch.currentPage, paramSearch.pageSize, paramSearch.fromDate, paramSearch.toDate]);

    // const handleKeyDownTextSearch = (event: any) => {
    //     console.log(22);
    //     if (event.keyCode === 13) {
    //         hanClickIconSearch();
    //     }
    // };

    // const hanClickIconSearch = () => {
    //     if (paramSearch.currentPage !== 1) {
    //         setParamSearch({
    //             ...paramSearch,
    //             currentPage: 1
    //         });
    //     } else {
    //         GetListHoaDon();
    //     }
    // };

    // const handleChangePage = (event: any, value: number) => {
    //     setParamSearch({
    //         ...paramSearch,
    //         currentPage: value
    //     });
    // };
    // const handlePerPageChange = (event: SelectChangeEvent<number>) => {
    //     setParamSearch({
    //         ...paramSearch,
    //         pageSize: parseInt(event.target.value.toString(), 10)
    //     });
    // };

    // const choseRow = (param: any) => {
    //     console.log('into');
    //     setIdHoadonChosing(param.id);
    //     setHoaDon(param.row);
    // };

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
            renderCell: (params: any) => <Box title={params.value}>{params.value}</Box>
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
    const row = [
        {
            id: '789899',
            maHoaDon: '78687y',
            ngayLapHoaDon: '20/10/2004',
            tenKhachHang: 'Nguyễn Hà Vy',
            tongTienHang: '100000đ',
            tongGiamGiaHD: '60008dd',
            tongThanhToan: '99999đ',
            daThanhToan: '66666đ',
            conNo: '99999đ',
            txtTrangThaiHD: 'hihi'
        },
        {
            id: '789809',
            maHoaDon: '78607y',
            ngayLapHoaDon: '20/10/2004',
            tenKhachHang: 'Đinh Thị Huyền',
            tongTienHang: '100000đ',
            tongGiamGiaHD: '60008dd',
            tongThanhToan: '99999đ',
            daThanhToan: '66666đ',
            conNo: '99999đ',
            txtTrangThaiHD: 'hihi'
        }
    ];
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const handleRowClick = (rowId: string) => {
        setExpandedRowId(rowId === expandedRowId ? null : rowId);
    };

    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const handleRowSelection = (event: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
        setExpandedRowId('');
        if (event.target.checked) {
            setSelectedRows((prevSelectedRows) => [...prevSelectedRows, rowId]);
        } else {
            setSelectedRows((prevSelectedRows) => prevSelectedRows.filter((id) => id !== rowId));
        }
    };
    return (
        <>
            {/* {idHoadonChosing !== '' ? (
               
            ) : ( */}
            <Box padding="16px 2.2222222222222223vw 16px 2.2222222222222223vw">
                <Grid container justifyContent="space-between">
                    <Grid item md="auto" display="flex" alignItems="center" gap="10px">
                        <Typography color="#333233" variant="h1" fontSize="16px" fontWeight="700">
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
                                // onChange={(event) =>
                                // setParamSearch((itemOlds: any) => {
                                //     return {
                                //         ...itemOlds,
                                //         textSearch: event.target.value
                                //     };
                                // })
                                // }
                                // onKeyDown={(event) => {
                                // handleKeyDownTextSearch(event);
                                // }}
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
                            // defaultVal={paramSearch.fromDate}
                            // handleChangeDate={(newVal: string) =>
                            //     setParamSearch({ ...paramSearch, fromDate: newVal })
                            // }
                            />
                            <DatePickerCustom
                            // defaultVal={paramSearch.toDate}
                            // handleChangeDate={(newVal: string) =>
                            // setParamSearch({ ...paramSearch, toDate: newVal })
                            // }
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
                    <TableContainer component={Paper}>
                        <Table
                            sx={{
                                '& th,& td': {
                                    fontSize: '12px'
                                }
                            }}>
                            <TableHead sx={{ bgcolor: '#F2EBF0' }}>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            sx={{
                                                '&.Mui-checked,&.MuiCheckbox-indeterminate': {
                                                    color: '#7C3367!important'
                                                }
                                            }}
                                            checked={selectedRows.length === row.length}
                                            indeterminate={
                                                selectedRows.length > 0 &&
                                                selectedRows.length < row.length
                                            }
                                            onChange={(event) => {
                                                event.stopPropagation();
                                                if (event.target.checked) {
                                                    setSelectedRows(row.map((item) => item.id));
                                                } else {
                                                    setSelectedRows([]);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Tên khách hàng</TableCell>
                                    <TableCell>Tổng tiền hàng</TableCell>
                                    <TableCell>Tổng giảm giá</TableCell>
                                    <TableCell>Tổng phải trả</TableCell>
                                    <TableCell>Khách đã trả</TableCell>
                                    <TableCell>Còn nợ</TableCell>
                                    <TableCell>Trang thái</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {row.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <TableRow onClick={() => handleRowClick(item.id)}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    sx={{
                                                        '&.Mui-checked': {
                                                            color: '#7C3367!important'
                                                        }
                                                    }}
                                                    checked={selectedRows.includes(item.id)}
                                                    onChange={(event) =>
                                                        handleRowSelection(event, item.id)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.tenKhachHang}</TableCell>
                                            <TableCell>{item.tongTienHang}</TableCell>
                                            <TableCell>{item.tongGiamGiaHD}</TableCell>
                                            <TableCell>{item.tongThanhToan}</TableCell>
                                            <TableCell>{item.daThanhToan}</TableCell>
                                            <TableCell>{item.conNo}</TableCell>
                                            <TableCell>{item.txtTrangThaiHD}</TableCell>
                                        </TableRow>
                                        {expandedRowId === item.id && (
                                            <TableRow>
                                                <TableCell style={{ padding: 0 }} colSpan={9}>
                                                    <Collapse in={expandedRowId === item.id}>
                                                        <ThongTinHoaDonn />
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* <CustomTablePagination
                            currentPage={paramSearch.currentPage ?? 1}
                            rowPerPage={paramSearch.pageSize ?? 10}
                            totalRecord={pageDataHoaDon.totalCount}
                            totalPage={pageDataHoaDon.totalPage}
                            handlePerPageChange={handlePerPageChange}
                            handlePageChange={handleChangePage}
                        /> */}
                </Box>
            </Box>
            {/* )} */}
        </>
    );
};
export default GiaoDichThanhToanTest;
