import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, SelectChangeEvent } from '@mui/material';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import { observer } from 'mobx-react';
import khachHangStore from '../../../stores/khachHangStore';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { format as formatDate } from 'date-fns';
import { useParams } from 'react-router-dom';
import AppConsts from '../../../lib/appconst';
const TabCuocHen: React.FC = () => {
    const { khachHangId } = useParams();
    const [curentPage, setCurrentPage] = useState<number>(1);
    const [maxResultCount, setMaxResultCount] = useState<number>(10);
    const [sortBy, setSortBy] = useState('creationTime');
    const [sortType, setSortType] = useState('desc');
    useEffect(() => {
        getLichSuDatLich();
    }, [curentPage, maxResultCount, sortBy, sortType]);
    const getLichSuDatLich = async () => {
        await khachHangStore.getLichSuDatLich(khachHangId ?? AppConsts.guidEmpty, {
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
            field: 'bookingDate',
            headerName: 'Ngày',
            minWidth: 70,
            flex: 0.8,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} sx={{ width: '100%' }}>
                    {formatDate(new Date(params.value), 'dd/MM/yyyy')}
                </Box>
            )
        },
        {
            field: 'tenDichVu',
            headerName: 'Dịch vụ',
            flex: 1.2,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} sx={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'thoiGianThucHien',
            headerName: 'Thời gian',
            flex: 0.8,
            headerAlign: 'left',
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} sx={{ width: '100%' }}>
                    {params.value} phút
                </Box>
            )
        },
        {
            field: 'donGia',
            headerName: 'Giá',
            flex: 0.8,
            headerAlign: 'left',
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box title={params.value} sx={{ width: '100%' }}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'nhanVienThucHien',
            headerName: 'Nhân viên phục vụ',
            flex: 1.1,
            renderHeader: (params: any) => (
                <Box
                    sx={{
                        fontWeight: '700',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        width: '100%'
                    }}
                    title={params.value}>
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params: any) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'trangThai',
            headerName: 'Tình trạng',
            flex: 0.8,
            headerAlign: 'left',
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }} title={params.value}>
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params: any) => (
                <Box
                    sx={{
                        color: params.value == 'Hủy' ? '#F1416C' : '#50CD89',
                        backgroundColor: params.value == 'Hủy' ? '#FFF5F8' : '#E8FFF3'
                    }}>
                    {params.value}
                </Box>
            )
        }
    ] as GridColDef[];
    return (
        <>
            <Box mt="24px">
                <DataGrid
                    disableRowSelectionOnClick
                    hideFooter
                    autoHeight
                    columns={columns}
                    rows={khachHangStore.lichSuDatLich === undefined ? [] : khachHangStore.lichSuDatLich.items}
                    getRowId={(row) => row.bookingDate}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 }
                        }
                    }}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    localeText={TextTranslate}
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
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            bgcolor: '#F2EBF0'
                        }
                    }}
                />
            </Box>
            <CustomTablePagination
                currentPage={curentPage}
                rowPerPage={maxResultCount}
                totalRecord={khachHangStore.lichSuDatLich === undefined ? 0 : khachHangStore.lichSuDatLich.totalCount}
                totalPage={
                    khachHangStore.lichSuDatLich === undefined
                        ? 0
                        : Math.ceil(khachHangStore.lichSuDatLich.totalCount / maxResultCount)
                }
                handlePerPageChange={handlePerPageChange}
                handlePageChange={handlePageChange}
            />
        </>
    );
};
export default observer(TabCuocHen);
