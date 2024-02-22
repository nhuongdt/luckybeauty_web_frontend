import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Button, Typography, IconButton } from '@mui/material';
import abpCustom from '../../../components/abp-custom';
import AddIcon from '../../../images/add.svg';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as DateIcon } from '../../../images/calendar-5.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import editionService from '../../../services/editions/editionService';
import { da } from 'date-fns/locale';
import { EditionListDto } from '../../../services/editions/dto/EditionListDto';
const index = () => {
    const [listData, setListData] = useState([] as EditionListDto[]);
    const getEditions = async () => {
        const data = await editionService.getAllEdition();
        setListData(data.items);
    };
    useEffect(() => {
        getEditions();
    }, []);
    const columns = [
        {
            field: 'displayName',
            headerName: 'Tên phiên bản',
            minWidth: 125,
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box
                    sx={{
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'price',
            headerName: 'Giá',
            minWidth: 125,
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box
                    sx={{
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },

        {
            field: 'creationTime',
            headerName: 'Thời gian tạo',
            minWidth: 150,
            headerAlign: 'center',
            flex: 1,
            renderHeader: (params: any) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                    <DateIcon style={{ marginRight: 4 }} />
                    <Typography variant="body2">{new Date(params.value).toLocaleDateString('en-GB')}</Typography>
                </Box>
            )
        },
        {
            field: 'action',
            headerName: 'Hành động',
            maxWidth: 60,
            flex: 1,
            disableColumnMenu: true,
            renderCell: (params: any) => (
                <Box>
                    <IconButton
                        aria-label="Actions"
                        aria-controls={`actions-menu-${params.row.id}`}
                        aria-haspopup="true"
                        onClick={(event) => {
                            //this.handleOpenMenu(event, params.row.id);
                        }}>
                        <MoreHorizIcon />
                    </IconButton>
                </Box>
            ),
            renderHeader: (params: any) => <Box sx={{ display: 'none' }}>{params.colDef.headerName}</Box>
        }
    ] as GridColDef[];
    return (
        <Box
            sx={{
                paddingTop: '16px'
            }}>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                <Typography variant="h1" fontWeight="700" fontSize="16px" color="#333233">
                    Phiên bản
                </Typography>
                <Button
                    hidden={!abpCustom.isGrandPermission('Pages.Editions.Create')}
                    variant="contained"
                    startIcon={<img src={AddIcon} />}
                    size="small"
                    sx={{
                        height: '40px',
                        fontSize: '14px',
                        textTransform: 'unset',
                        fontWeight: '400',
                        backgroundColor: 'var(--color-main)!important'
                    }}>
                    Tạo phiên bản mới
                </Button>
            </Box>
            <Box mt={2} className="page-content">
                <DataGrid
                    rowHeight={46}
                    columns={columns}
                    rows={listData}
                    disableRowSelectionOnClick
                    checkboxSelection={false}
                    sx={{
                        '& .MuiDataGrid-columnHeader': {
                            background: '#EEF0F4'
                        }
                    }}
                    hideFooterPagination
                    hideFooter
                    localeText={TextTranslate}></DataGrid>
            </Box>
        </Box>
    );
};

export default index;
