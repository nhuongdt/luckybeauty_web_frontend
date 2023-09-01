import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, SelectChangeEvent } from '@mui/material';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import khachHangStore from '../../../stores/khachHangStore';
import { observer } from 'mobx-react';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { format as formatDate } from 'date-fns';
const TabMuaHang: React.FC = () => {
    const handlePageChange = async (event: any, newPage: number) => {
        console.log(newPage);
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        console.log(event);
    };
    const columns = [
        {
            field: 'maHoaDon',
            headerName: 'Mã hóa đơn',
            minWidth: 70,
            flex: 1.2,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params: any) => (
                <Box
                    title={params.value}
                    sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'ngayLapHoaDon',
            headerName: 'Ngày bán',
            flex: 1.2,
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
            ),
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
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
            ),
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
            renderHeader: (params: any) => (
                <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
            ),
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
                <Box title={params.value}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
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
                <Box title={params.value}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
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
                <Box title={params.value}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
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
                        color:
                            params.value == 'Hoàn thành'
                                ? '#50CD89'
                                : params.value == 'Hủy'
                                ? '#F1416C'
                                : '#FF9900',
                        backgroundColor:
                            params.value == 'Hoàn thành'
                                ? '#E8FFF3'
                                : params.value == 'Hủy'
                                ? '#FFF5F8'
                                : '#FFF8DD'
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
                    //hideFooter
                    autoHeight
                    columns={columns}
                    rows={
                        khachHangStore.lichSuGiaoDich === undefined
                            ? []
                            : khachHangStore.lichSuGiaoDich.items
                    }
                    getRowId={(row) => row.maHoaDon}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 }
                        }
                    }}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    localeText={TextTranslate}
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            bgcolor: '#F2EBF0'
                        },
                        '& .MuiDataGrid-iconButtonContainer': {
                            display: 'none'
                        },
                        '& .MuiBox-root': {
                            fontSize: '12px'
                        },
                        '& .MuiDataGrid-virtualScroller': {
                            bgcolor: '#fff'
                        },
                        '& .MuiDataGrid-columnHeaderCheckbox:focus': {
                            outline: 'none!important'
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
                        '& [aria-sort="ascending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-of-type(2)':
                            {
                                fill: '#000'
                            },
                        '& [aria-sort="descending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-of-type(1)':
                            {
                                fill: '#000'
                            },
                        '& .Mui-checked, &.MuiCheckbox-indeterminate': {
                            color: '#7C3367!important'
                        },
                        '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within':
                            {
                                outline: 'none'
                            }
                    }}
                />
                {/* <CustomTablePagination
                    currentPage={1}
                    rowPerPage={10}
                    totalRecord={8}
                    totalPage={1}
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                /> */}
            </Box>
        </>
    );
};
export default observer(TabMuaHang);
