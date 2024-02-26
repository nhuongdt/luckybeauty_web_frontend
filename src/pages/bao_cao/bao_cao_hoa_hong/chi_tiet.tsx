import {
    Grid,
    Box,
    Stack,
    Typography,
    SelectChangeEvent,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { TextTranslate } from '../../../components/TableLanguage';
import { useContext, useEffect, useRef, useState } from 'react';
import utils from '../../../utils/utils';
import {
    IPageBaoCaoHoaHongChiTiet,
    PageBaoCaoHoaHongChiTiet
} from '../../../services/bao_cao/bao_cao_hoa_hong/BaoCaoHoaHongDto';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import { BaoCaoHoaHongDataContextFilter } from '../../../services/bao_cao/bao_cao_hoa_hong/BaoCaoHoaHongContext';
import { LoaiBaoCao } from '../../../lib/appconst';
import BaoCaoHoaHongServices from '../../../services/bao_cao/bao_cao_hoa_hong/BaoCaoHoaHongServices';
import { format } from 'date-fns';

export default function PageBaoCaoHoaHongNhanVienChiTiet({ onChangePage, onChangePageSize }: any) {
    const dataFilterContext = useContext(BaoCaoHoaHongDataContextFilter);
    const [pageDataBaoCaoChiTiet, setPageDataBaoCaoChiTiet] = useState<PagedResultDto<IPageBaoCaoHoaHongChiTiet>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    });
    const [pageDataBaoCaoChiTietGr, setPageDataBaoCaoChiTietGr] = useState<PagedResultDto<PageBaoCaoHoaHongChiTiet>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    });

    useEffect(() => {
        if (dataFilterContext.loaiBaoCao === LoaiBaoCao.CHI_TIET) {
            GetBaoCaoHoaHongChiTiet();
            GetBaoCaoHoaHongChiTietGr();
        }
    }, [
        dataFilterContext?.countClick,
        dataFilterContext?.filter?.currentPage,
        dataFilterContext?.filter?.pageSize,
        dataFilterContext?.filter?.fromDate,
        dataFilterContext?.filter?.toDate,
        dataFilterContext?.filter?.idChiNhanhs
    ]);

    const GetBaoCaoHoaHongChiTiet = async () => {
        const data = await BaoCaoHoaHongServices.GetBaoCaoHoaHongChiTiet(dataFilterContext.filter);
        setPageDataBaoCaoChiTiet(data);
    };
    const GetBaoCaoHoaHongChiTietGr = async () => {
        const data = await BaoCaoHoaHongServices.GetBaoCaoHoaHongChiTietGr(dataFilterContext.filter);
        console.log('data ', data);
        setPageDataBaoCaoChiTietGr({ ...pageDataBaoCaoChiTietGr, items: data.items, totalCount: data?.totalCount });
    };

    const handlePageChange = async (event: any, value: number) => {
        onChangePage(value);
    };
    const changePageSize = async (event: SelectChangeEvent<number>) => {
        const pageSizeNew = parseInt(event.target.value.toString());
        onChangePageSize(pageSizeNew);
    };

    const columns = [
        {
            field: 'maHoaDon',
            headerName: 'Mã hóa đơn',
            flex: 0.5,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'ngayLapHoaDon',
            headerName: 'Ngày lập hóa đơn',
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{format(new Date(params.value), 'dd/MM/yyyy HH:mm')}</Box>
        },
        {
            field: 'tenKhachHang',
            headerName: 'Tên khách hàng',
            flex: 1,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'tenHangHoa',
            headerName: 'Tên dịch vụ',
            flex: 1,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'tenNhanVien',
            headerName: 'Tên nhân viên',
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'soLuong',
            headerName: 'Số lượng',
            flex: 0.4,
            headerAlign: 'center',
            align: 'center',
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{params.value}</Box>
        },

        {
            field: 'thanhTienSauCK',
            headerName: 'Giá trị tính',
            headerAlign: 'center',
            align: 'right',
            flex: 0.6,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
        },
        {
            field: 'hoaHongThucHien_PTChietKhau',
            headerName: 'Thực hiện (%)',
            flex: 1,
            headerAlign: 'center',
            align: 'right',
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
        },
        {
            field: 'hoaHongThucHien_TienChietKhau',
            headerName: 'Thực hiện (vnd)',
            flex: 1,
            headerAlign: 'center',
            align: 'right',
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
        },
        {
            field: 'hoaHongTuVan_PTChietKhau',
            headerName: 'Tư vấn (%)',
            flex: 1,
            headerAlign: 'center',
            align: 'right',
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
        },
        {
            field: 'hoaHongTuVan_TienChietKhau',
            headerName: 'Tư vấn (vnd)',
            flex: 1,
            headerAlign: 'center',
            align: 'right',
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
        },
        {
            field: 'tongHoaHong',
            headerName: 'Tổng hoa hồng',
            flex: 0.6,
            headerAlign: 'right',
            align: 'right',
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
        }
    ] as GridColDef[];

    return (
        <>
            <Grid container paddingTop={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className="page-box-right">
                        <Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Mã hóa đơn</TableCell>
                                            <TableCell align="center">Ngày lập hóa đơn</TableCell>
                                            <TableCell align="center">Tên khách hàng</TableCell>
                                            <TableCell align="center">Tên dịch vụ</TableCell>
                                            <TableCell align="center">Số lượng</TableCell>
                                            <TableCell align="center">Giá trị tính</TableCell>
                                            <TableCell align="center">Tên nhân viên</TableCell>
                                            <TableCell align="center">
                                                <Stack
                                                    sx={{
                                                        ' & .MuiTypography-root': {
                                                            fontWeight: 500,
                                                            fontSize: 'var(--font-size-main)'
                                                        }
                                                    }}>
                                                    <Typography>Hoa hồng thực hiện</Typography>
                                                    <Stack direction={'row'} justifyContent={'space-evenly'}>
                                                        <Typography>%</Typography>
                                                        <Typography>vnd</Typography>
                                                    </Stack>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack
                                                    sx={{
                                                        ' & .MuiTypography-root': {
                                                            fontWeight: 500,
                                                            fontSize: 'var(--font-size-main)'
                                                        }
                                                    }}>
                                                    <Typography>Hoa hồng tư vấn</Typography>
                                                    <Stack direction={'row'} justifyContent={'space-evenly'}>
                                                        <Typography>%</Typography>
                                                        <Typography>vnd</Typography>
                                                    </Stack>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">Tổng hoa hồng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {pageDataBaoCaoChiTietGr?.items?.map((row, index) => (
                                        <TableBody>
                                            <TableRow key={index}>
                                                <>
                                                    <TableCell align="right" rowSpan={row?.rowSpan + 1}>
                                                        {`${row?.maHoaDon}`}
                                                    </TableCell>
                                                    <TableCell rowSpan={row?.rowSpan + 1}>
                                                        {format(new Date(row?.ngayLapHoaDon), 'dd/MM/yyyy')}
                                                    </TableCell>
                                                    <TableCell align="right" rowSpan={row?.rowSpan + 1}>
                                                        {row?.tenKhachHang}
                                                    </TableCell>
                                                    <TableCell align="right" rowSpan={row?.rowSpan + 1}>
                                                        {row?.tenHangHoa}
                                                    </TableCell>
                                                    <TableCell align="right" rowSpan={row?.rowSpan + 1}>
                                                        {row?.soLuong}
                                                    </TableCell>
                                                    <TableCell align="right" rowSpan={row?.rowSpan + 1}>
                                                        {new Intl.NumberFormat('vi-VN').format(
                                                            row?.thanhTienSauCK ?? 0
                                                        )}
                                                    </TableCell>
                                                </>
                                            </TableRow>

                                            {row?.lstDetail?.map((rowDetail, index2) => (
                                                <TableRow>
                                                    <TableCell align="right">{rowDetail?.tenNhanVien}</TableCell>

                                                    <TableCell align="right">
                                                        <Stack direction={'row'} justifyContent={'space-evenly'}>
                                                            <Typography variant="body2">
                                                                {rowDetail?.hoaHongThucHien_PTChietKhau}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {new Intl.NumberFormat('vi-VN').format(
                                                                    rowDetail?.hoaHongThucHien_TienChietKhau ?? 0
                                                                )}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Stack direction={'row'} justifyContent={'space-evenly'}>
                                                            <Typography variant="body2">
                                                                {rowDetail?.hoaHongTuVan_PTChietKhau}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {new Intl.NumberFormat('vi-VN').format(
                                                                    rowDetail?.hoaHongTuVan_TienChietKhau ?? 0
                                                                )}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(
                                                            rowDetail?.tongHoaHong ?? 0
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    ))}
                                </Table>
                            </TableContainer>
                        </Box>
                        {/* <Box>
                            <DataGrid
                                rowHeight={46}
                                autoHeight={pageDataBaoCaoChiTiet?.totalCount === 0}
                                className="data-grid-row"
                                columns={columns}
                                rows={pageDataBaoCaoChiTiet?.items}
                                getRowId={(row) => row.idHoaDonChiTiet}
                                disableRowSelectionOnClick
                                checkboxSelection={false}
                                hideFooterPagination
                                hideFooter
                                localeText={TextTranslate}
                                experimentalFeatures={{ columnGrouping: true }}
                            />
                        </Box> */}
                        <CustomTablePagination
                            currentPage={dataFilterContext?.filter?.currentPage ?? 1}
                            rowPerPage={dataFilterContext?.filter?.pageSize ?? 10}
                            totalPage={pageDataBaoCaoChiTiet?.totalPage}
                            totalRecord={pageDataBaoCaoChiTiet?.totalCount}
                            handlePerPageChange={changePageSize}
                            handlePageChange={handlePageChange}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
