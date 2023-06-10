import React from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';

const TabDiary: React.FC = () => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'mã phiếu',
            minWidth: 130,
            flex: 1,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'time',
            headerName: 'Thời gian',
            minWidth: 120,
            flex: 1,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'creator',
            headerName: 'Người tạo',
            minWidth: 112,
            flex: 1,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'type',
            headerName: 'Loại thu/chi',
            minWidth: 90,
            flex: 1,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'method',
            headerName: 'Phương thức',
            minWidth: 100,
            flex: 1,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'revenue',
            headerName: 'Tiền thu',
            minWidth: 100,
            flex: 1,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        }
    ];
    const rows = [
        {
            id: 'TTHDBL0000000526',
            time: '06/04/2023 08:49',
            creator: '0985064986',
            type: 'Phiếu thu',
            method: 'Tiền mặt',
            revenue: '670.000đ'
        }
    ];
    return (
        <Box>
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
                    '& .MuiDataGrid-cell .MuiBox-root': {
                        fontSize: '12px'
                    }
                }}
                localeText={TextTranslate}
            />
        </Box>
    );
};
export default TabDiary;
