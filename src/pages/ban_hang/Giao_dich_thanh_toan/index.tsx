import React from 'react';
import { Box, Typography, Grid, TextField, IconButton, Button } from '@mui/material';
import SearchIcon from '../../../images/search-normal.svg';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as FilterIcon } from '../../../images/filter-icon.svg';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
const GiaoDichThanhToan: React.FC = () => {
    const columns: GridColDef[] = [
        {
            field: 'id',
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
            field: 'ngayBan',
            headerName: 'Ngày bán',
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
            field: 'tongGiamGia',
            headerName: 'Tổng giảm giá',
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
            field: 'tongPhaiTra',
            headerName: 'Tổng phải trả',
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
            field: 'khachDaTra',
            headerName: 'Khách đã trả',
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
            field: 'conNo',
            headerName: 'Còn nợ',
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
            field: 'trangThai',
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
                            params.value === 'Hoàn thành'
                                ? '#E8FFF3'
                                : params.value === 'Chưa thanh toán'
                                ? '#FFF8DD'
                                : '#FFF5F8',
                        color:
                            params.value === 'Hoàn thành'
                                ? '#50CD89'
                                : params.value === 'Chưa thanh toán'
                                ? '#FF9900'
                                : '#F1416C'
                    }}
                    className="state-thanh-toan">
                    {params.value}
                </Box>
            )
        }
    ];
    const rows = [
        {
            id: 'y68765gfghfnbgf,mjhg',
            ngayBan: '21/01/2004',
            tenKhachHang: 'Đinh Tuấn Tài',
            tongTienHang: '100.000đ',
            tongGiamGia: '300đ',
            tongPhaiTra: '150.000đ',
            khachDaTra: '300.000đ',
            conNo: '2.000.000đ',
            trangThai: 'Hoàn thành'
        },
        {
            id: '09bnmbmnb',
            ngayBan: '21/01/2004',
            tenKhachHang: 'Đinh Tuấn Tài1',
            tongTienHang: '100.000đ',
            tongGiamGia: '300đ',
            tongPhaiTra: '150.000đ',
            khachDaTra: '300.000đ',
            conNo: '2.000.000đ',
            trangThai: 'Chưa thanh toán'
        },
        {
            id: 'y68765gfghfnblkl',
            ngayBan: '21/01/2004',
            tenKhachHang: 'Đinh Tuấn Tài1',
            tongTienHang: '100.000đ',
            tongGiamGia: '300đ',
            tongPhaiTra: '150.000đ',
            khachDaTra: '300.000đ',
            conNo: '2.000.000đ',
            trangThai: 'Hủy'
        }
    ];
    return (
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
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: '#CDC9CD!important',
                                bgcolor: '#fff!important',
                                color: '#333233',
                                fontSize: '14px'
                            }}>
                            30 tháng 6, 2023 - 30 tháng 6, 2023{' '}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<UploadIcon />}
                            sx={{
                                borderColor: '#CDC9CD!important',
                                bgcolor: '#fff!important',
                                color: '#333233',
                                fontSize: '14px'
                            }}>
                            Xuất{' '}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<FilterIcon />}
                            sx={{
                                bgcolor: '#7C3367!important',
                                color: '#fff',
                                fontSize: '14px'
                            }}>
                            Bộ lọc{' '}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Box>
                <DataGrid
                    columns={columns}
                    rows={rows}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 5, pageSize: 10 }
                        }
                    }}
                    pageSizeOptions={[10, 20]}
                    checkboxSelection
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
                        }
                    }}
                    localeText={TextTranslate}
                />
            </Box>
        </Box>
    );
};
export default GiaoDichThanhToan;
