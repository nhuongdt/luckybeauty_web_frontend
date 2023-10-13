import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, SelectChangeEvent } from '@mui/material';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import khachHangStore from '../../../stores/khachHangStore';
import { observer } from 'mobx-react';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { format as formatDate } from 'date-fns';
import AppConsts from '../../../lib/appconst';
import { useParams } from 'react-router-dom';
const TabMuaHang: React.FC = () => {
    const { khachHangId } = useParams();
    const [curentPage, setCurrentPage] = useState<number>(1);
    const [maxResultCount, setMaxResultCount] = useState<number>(10);
    const [sortBy, setSortBy] = useState('creationTime');
    const [sortType, setSortType] = useState('desc');
    useEffect(() => {
        getLichSuMuaHang();
    }, [maxResultCount, curentPage, sortBy, sortType]);
    const getLichSuMuaHang = async () => {
        await khachHangStore.getLichSuGiaoDich(khachHangId ?? AppConsts.guidEmpty, {
            keyword: '',
            maxResultCount: maxResultCount,
            skipCount: curentPage,
            sortBy: sortBy,
            sortType: sortType
        });
    };
    const handlePageChange = async (event: any, newPage: number) => {
        setCurrentPage(newPage);
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        setCurrentPage(1);
        setMaxResultCount(parseInt(event.target.value.toString(), 10));
    };
    const onSort = async (sortType: string, sortBy: string) => {
        setSortType(sortType);
        setSortBy(sortBy);
    };
    const columns = [
        {
            field: 'maHoaDon',
            headerName: 'Mã hóa đơn',
            minWidth: 70,
            flex: 1.2,
            renderHeader: (params: any) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box title={params.value} sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'ngayLapHoaDon',
            headerName: 'Ngày bán',
            flex: 1.2,
            renderHeader: (params: any) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box sx={{ width: '100%' }} title={params.value}>
                    {formatDate(new Date(params.value), 'dd/MM/yyyy')}
                </Box>
            )
        },
        {
            field: 'tongTienHang',
            headerName: 'Tổng tiền hàng',
            flex: 1,
            renderHeader: (params: any) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box sx={{ width: '100%' }} title={params.value}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'tongGiamGia',
            headerName: 'Tổng giảm giá',
            flex: 1,
            renderHeader: (params: any) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box title={params.value} sx={{ width: '100%' }}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'tongPhaiTra',
            headerName: 'Tổng phải trả',
            flex: 1,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value}>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
            )
        },
        {
            field: 'khachDaTra',
            headerName: 'Khách đã trả',
            flex: 1,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value}>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
            )
        },
        {
            field: 'conNo',
            headerName: 'Còn nợ',
            flex: 1,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value}>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
            )
        },
        {
            field: 'trangThai',
            headerName: 'Trạng thái',
            flex: 1,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box
                    title={params.value}
                    sx={{
                        color: params.value == 'Hoàn thành' ? '#50CD89' : params.value == 'Hủy' ? '#F1416C' : '#FF9900',
                        backgroundColor:
                            params.value == 'Hoàn thành' ? '#E8FFF3' : params.value == 'Hủy' ? '#FFF5F8' : '#FFF8DD'
                    }}>
                    {params.value}
                </Box>
            )
        }
    ];

    return (
        <>
            <Box mt="24px">
                <DataGrid
                    disableRowSelectionOnClick
                    hideFooter
                    autoHeight
                    columns={columns}
                    rows={khachHangStore.lichSuGiaoDich === undefined ? [] : khachHangStore.lichSuGiaoDich.items}
                    getRowId={(row) => row.maHoaDon}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 }
                        }
                    }}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    sortingOrder={['desc', 'asc']}
                    // sortModel={[
                    //     {
                    //         field: sortBy,
                    //         sort: sortType == 'desc' ? 'desc' : 'asc'
                    //     }
                    // ]}
                    onSortModelChange={(newSortModel) => {
                        if (newSortModel.length > 0) {
                            onSort(newSortModel[0].sort?.toString() ?? 'creationTime', newSortModel[0].field ?? 'desc');
                        }
                    }}
                    localeText={TextTranslate}
                />
                <CustomTablePagination
                    currentPage={curentPage}
                    rowPerPage={maxResultCount}
                    totalRecord={
                        khachHangStore.lichSuGiaoDich === undefined ? 0 : khachHangStore.lichSuGiaoDich.totalCount
                    }
                    totalPage={
                        khachHangStore.lichSuGiaoDich === undefined
                            ? 0
                            : Math.ceil(khachHangStore.lichSuGiaoDich.totalCount / maxResultCount)
                    }
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                />
            </Box>
        </>
    );
};
export default observer(TabMuaHang);
