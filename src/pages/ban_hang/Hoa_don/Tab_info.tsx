import React from 'react';
import { Box, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
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
            )
        }
    ];
    return (
        <>
            <Box></Box>
        </>
    );
};
export default TabInfo;
