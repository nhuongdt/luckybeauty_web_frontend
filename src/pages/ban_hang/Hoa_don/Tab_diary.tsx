import React, { useEffect, useState } from 'react';
import { Box, Link } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import { format } from 'date-fns';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';

export default function TabDiary({ idHoaDon }: any) {
    const [phieuThuChi, setPhieuThuChi] = useState<QuyHoaDonDto[]>([]);
    const GetNhatKyThanhToan = async () => {
        const data = await SoQuyServices.GetNhatKyThanhToan_ofHoaDon(idHoaDon);
        setPhieuThuChi(data);
    };
    useEffect(() => {
        GetNhatKyThanhToan();
    }, [idHoaDon]);
    const columns: GridColDef[] = [
        {
            field: 'maHoaDon',
            headerName: 'Mã phiếu',
            minWidth: 120,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Link>{params.value}</Link>
        },
        {
            field: 'ngayLapHoaDon',
            headerName: 'Ngày lập phiếu',
            minWidth: 120,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Box>{format(new Date(params.value), 'dd/MM/yyyy HH:mm')}</Box>
        },
        {
            field: 'sLoaiPhieu',
            headerName: 'Loại thu/chi',
            minWidth: 90,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'sHinhThucThanhToan',
            headerName: 'Phương thức',
            minWidth: 100,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'tongTienThu',
            headerName: 'Tiền thu',
            headerAlign: 'right',
            align: 'right',
            minWidth: 100,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Box>{new Intl.NumberFormat().format(params.value)}</Box>
        },
        {
            field: 'sTrangThai',
            headerName: 'Trạng thái',
            minWidth: 100,
            flex: 1,
            renderHeader: (params) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting />
                </Box>
            ),
            renderCell: (params) => <Box>{params.value}</Box>
        }
    ];

    return (
        <Box>
            <DataGrid
                autoHeight
                columns={columns}
                rows={phieuThuChi}
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
                    '& .MuiDataGrid-cell .MuiBox-root': {
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
                    '& .MuiDataGrid-columnHeaderTitleContainerContent': {
                        fontWeight: '700',
                        fontSize: '12px'
                    },
                    '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
                        outline: 'none'
                    },
                    '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover,.MuiDataGrid-row.Mui-selected.Mui-hovered':
                        {
                            bgcolor: '#f2ebf0'
                        }
                }}
                localeText={TextTranslate}
            />
        </Box>
    );
}
