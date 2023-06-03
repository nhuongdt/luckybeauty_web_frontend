import React from 'react';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { ReactComponent as DateIcon } from '../../../images/calendar-5.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ChiNhanhDto } from '../../../services/chi_nhanh/Dto/chiNhanhDto';
import { TextTranslate } from '../../../components/TableLanguage';
import avatar from '../../../images/avatar.png';
const ChiNhanh: React.FC = () => {
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            minWidth: 50,
            flex: 0.6,

            renderHeader: (params: any) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'name',
            headerName: 'Tên chi nhánh',
            minWidth: 140,
            flex: 0.8,
            renderCell: (params: any) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        src={params.row.avatar}
                        alt="Avatar"
                        style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    <Typography
                        fontSize="14px"
                        fontWeight="400"
                        variant="h6"
                        color="#333233"
                        lineHeight="16px"
                        title={params.value}>
                        {params.value}
                    </Typography>
                </Box>
            ),
            renderHeader: (params: any) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'location',
            headerName: 'Địa chỉ',
            minWidth: 180,
            flex: 1.2,
            renderCell: (params: any) => (
                <Typography
                    variant="caption"
                    fontSize="14px"
                    title={params.value}
                    sx={{
                        textOverflow: 'ellipsis',
                        width: '100%',
                        overflow: 'hidden'
                    }}>
                    {params.value}
                </Typography>
            ),
            renderHeader: (params: any) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'phone',
            headerName: 'Số điện thoại',
            minWidth: 110,
            flex: 0.8,
            renderCell: (params: any) => (
                <Typography variant="caption" fontSize="14px" title={params.value}>
                    {params.value}
                </Typography>
            ),
            renderHeader: (params: any) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'startDate',
            headerName: 'Ngày áp dụng',
            minWidth: 130,
            flex: 0.8,
            renderCell: (params: any) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DateIcon style={{ marginRight: 4 }} />
                    <Typography
                        fontSize="14px"
                        variant="h6"
                        fontWeight="400"
                        color="#333233"
                        lineHeight="16px">
                        {params.value}
                    </Typography>
                </Box>
            ),
            renderHeader: (params: any) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'endDate',
            headerName: 'Ngày hết hạn',
            minWidth: 130,
            flex: 0.8,
            renderCell: (params: any) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DateIcon style={{ marginRight: 4 }} />
                    <Typography
                        fontSize="14px"
                        variant="h6"
                        fontWeight="400"
                        color="#333233"
                        lineHeight="16px">
                        {params.value}
                    </Typography>
                </Box>
            ),
            renderHeader: (params: any) => (
                <Box>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            minwidth: 48,
            flex: 0.3,
            disableColumnMenu: true,
            renderCell: (params: any) => (
                <IconButton
                    aria-label="Actions"
                    aria-controls={`actions-menu-${params.row.id}`}
                    aria-haspopup="true">
                    <MoreHorizIcon />
                </IconButton>
            ),
            renderHeader: (params: any) => (
                <Box sx={{ display: 'none' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        }
    ];
    const rows = [
        {
            id: '565',
            name: 'Ssort1',
            avatar: avatar,
            phone: '0911290476',
            startDate: '28/10/2012',
            endDate: '07/05/2025',
            location: 'Số 2 Trường Chinh, quận Đống Đa, Hà Nội'
        },
        {
            id: '565',
            name: 'Ssort1',
            avatar: avatar,
            phone: '0911290476',
            startDate: '28/10/2012',
            endDate: '07/05/2025',
            location: 'Số 2 Trường Chinh, quận Đống Đa, Hà Nội'
        }
    ];
    return (
        <>
            <Box>
                <DataGrid
                    autoHeight
                    columns={columns}
                    rows={rows}
                    checkboxSelection
                    sx={{
                        '& .MuiDataGrid-iconButtonContainer': {
                            display: 'none'
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#F2EBF0'
                        },
                        '& p': {
                            mb: 0
                        },
                        '& .MuiDataGrid-virtualScroller': {
                            bgcolor: '#fff'
                        }
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 }
                        }
                    }}
                    pageSizeOptions={[5, 10]}
                    localeText={TextTranslate}
                />
            </Box>
        </>
    );
};
export default ChiNhanh;
