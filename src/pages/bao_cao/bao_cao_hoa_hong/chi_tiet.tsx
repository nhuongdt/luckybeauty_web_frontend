import { Grid, Box, Stack, Typography, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { TextTranslate } from '../../../components/TableLanguage';
import { useContext, useEffect, useRef, useState } from 'react';
import utils from '../../../utils/utils';
import { PageBaoCaoHoaHongChiTiet } from '../../../services/bao_cao/bao_cao_hoa_hong/BaoCaoHoaHongDto';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import { BaoCaoHoaHongDataContextFilter } from '../../../services/bao_cao/bao_cao_hoa_hong/BaoCaoHoaHongContext';
import { LoaiBaoCao } from '../../../lib/appconst';
import BaoCaoHoaHongServices from '../../../services/bao_cao/bao_cao_hoa_hong/BaoCaoHoaHongServices';
import { format } from 'date-fns';

export default function PageBaoCaoHoaHongNhanVienChiTiet({ onChangePage, onChangePageSize }: any) {
    const dataFilterContext = useContext(BaoCaoHoaHongDataContextFilter);
    const [pageDataBaoCaoChiTiet, setPageDataBaoCaoChiTiet] = useState<PagedResultDto<PageBaoCaoHoaHongChiTiet>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    });

    useEffect(() => {
        if (dataFilterContext.loaiBaoCao === LoaiBaoCao.CHI_TIET) {
            GetBaoCaoHoaHongChiTiet();
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
            field: 'hoaHongThucHien',
            headerName: 'Thực hiện',
            flex: 1,
            headerAlign: 'center',
            align: 'right',
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
        },
        {
            field: 'hoaHongTuVan',
            headerName: 'Tư vấn',
            flex: 1,
            headerAlign: 'center',
            align: 'right',
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
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

    const columnGroupingModel: GridColumnGroupingModel = [
        {
            groupId: 'hoaHongThucHien',
            description: '',
            children: [
                { field: 'hoaHongThucHien_PTChietKhau', headerName: '%' },
                { field: 'hoaHongThucHien_TienChietKhau', headerName: 'vnd' }
            ]
        },
        {
            groupId: 'hoaHongTuVan',
            description: '',
            children: [
                { field: 'hoaHongTuVan_PTChietKhau', headerName: '%' },
                { field: 'hoaHongTuVan_TienChietKhau', headerName: 'vnd' }
            ]
        }
    ];

    return (
        <>
            <Grid container paddingTop={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className="page-box-right">
                        <Box>
                            <DataGrid
                                rowHeight={46}
                                autoHeight={pageDataBaoCaoChiTiet?.totalCount === 0}
                                className="data-grid-row"
                                columns={columns}
                                rows={pageDataBaoCaoChiTiet?.items}
                                disableRowSelectionOnClick
                                checkboxSelection={false}
                                hideFooterPagination
                                hideFooter
                                localeText={TextTranslate}
                                experimentalFeatures={{ columnGrouping: true }}
                            />
                        </Box>
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
