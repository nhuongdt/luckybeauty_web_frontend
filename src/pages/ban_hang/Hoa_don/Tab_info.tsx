import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';

const TabInfo: React.FC = () => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            minWidth: 50,
            flex: 0.8,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'name',
            headerName: 'Tên dịch vụ',
            minWidth: 150,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'quantity',
            headerName: 'Số lượng',
            minWidth: 80,
            flex: 0.9,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'price',
            headerName: 'Giá',
            minWidth: 90,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'discount',
            headerName: 'Chiết khấu',
            minWidth: 100,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'gia_Ban',
            headerName: 'Giá bán',
            minWidth: 100,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'thanh_Tien',
            headerName: 'Thành tiền',
            minWidth: 100,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        }
    ];
    const rows = [
        {
            id: '647587yuihjklllnjhj',
            name: 'Dịch vụ uốn ép duỗi nhuộm các kiểu  ',
            quantity: 60,
            price: '7.000.000đ',
            discount: '400.000đ',
            gia_Ban: '6.000.000đ',
            thanh_Tien: '9.000.000đ'
        }
    ];
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    <DataGrid
                        autoHeight
                        columns={columns}
                        rows={rows}
                        sx={{
                            '& p': {
                                mb: 0
                            },
                            '& .MuiBox-root': {
                                maxWidth: '100%',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden'
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                bgcolor: '#F2EBF0'
                            },
                            '& .MuiDataGrid-footerContainer': {
                                display: 'none'
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                bgcolor: '#fff'
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainerContent .MuiBox-root': {
                                fontWeight: '700',
                                fontSize: '12px'
                            },
                            '& .MuiIconButton-root': {
                                display: 'none'
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
                </Grid>
                <Grid item xs={3}>
                    <Box
                        sx={{
                            padding: '24px',
                            bgcolor: '#fff',
                            boxShadow: '0px 4px 20px 0px #AAA9B81A',
                            borderRadius: '12px'
                        }}>
                        <Typography
                            variant="h2"
                            fontSize="16px"
                            fontWeight="700"
                            color="#3B4758"
                            mb="36px">
                            Chi tiết thanh toán
                        </Typography>
                        <Grid
                            container
                            alignItems="center"
                            rowGap="24px"
                            sx={{
                                '& .MuiGrid-item:nth-child(even) .MuiTypography-root': {
                                    textAlign: 'right'
                                }
                            }}>
                            <Grid item xs={6}>
                                <Typography
                                    color="#3B4758"
                                    variant="h3"
                                    fontSize="14px"
                                    fontWeight="400">
                                    Tổng tiền hàng{' '}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body1"
                                    fontSize="14px"
                                    fontWeight="700"
                                    color="#3B4758">
                                    700.000đ
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    color="#3B4758"
                                    variant="h3"
                                    fontSize="14px"
                                    fontWeight="400">
                                    Giảm hóa đơn{' '}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body1"
                                    fontSize="14px"
                                    fontWeight="700"
                                    color="#3B4758">
                                    700.000đ
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    color="#3B4758"
                                    variant="h3"
                                    fontSize="14px"
                                    fontWeight="400">
                                    Tổng thanh toán{' '}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body1"
                                    fontSize="14px"
                                    fontWeight="700"
                                    color="#3B4758">
                                    700.000đ
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    color="#3B4758"
                                    variant="h3"
                                    fontSize="14px"
                                    fontWeight="400">
                                    Khách đã trả{' '}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body1"
                                    fontSize="14px"
                                    fontWeight="700"
                                    color="#3B4758">
                                    700.000đ
                                </Typography>
                            </Grid>
                            <Grid item xs={6} marginTop="28px">
                                <Typography
                                    color="#3B4758"
                                    variant="h3"
                                    fontSize="18px"
                                    fontWeight="700">
                                    Tiền còn lại{' '}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} marginTop="28px">
                                <Typography
                                    variant="body1"
                                    fontSize="18px"
                                    fontWeight="700"
                                    color="#3B4758">
                                    700.000đ
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};
export default TabInfo;
