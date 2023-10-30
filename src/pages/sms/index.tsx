import { Box, Button, Grid, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { format as formatDate } from 'date-fns';
import { TextTranslate } from '../../components/TableLanguage';
import CreateOrEditTinNhanModal from './components/createOrEditTinNhanModal';
import { useState } from 'react';
const TinNhanPage = () => {
    const [visiable, setVisiable] = useState(false);
    const columns: GridColDef[] = [
        {
            field: 'thoiGianGui',
            headerName: 'Thời gian',
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={params.value} width="100%">
                    {formatDate(new Date(params.value), 'dd/MM/yyyy HH:mm')}
                </Box>
            )
        },
        {
            field: 'tenKhachHang',
            headerName: 'Khách hàng',
            minWidth: 118,
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'soDienThoai',
            headerName: 'Số điện thoại',
            headerAlign: 'center',
            minWidth: 118,
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={params.value} width="100%" textAlign="center">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'idLoaiTin',
            headerName: 'Kiểu',
            // minWidth: 118,
            flex: 1.5,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'noiDungTin',
            headerName: 'Nội dung',
            headerAlign: 'left',
            minWidth: 350,
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={params.value} width="100%" textAlign="end">
                    {params.value}
                </Box>
            )
        }
    ];
    return (
        <Box paddingTop={2}>
            <Box paddingRight={2} pb={2}>
                <Typography color={'#3D475C'} fontSize={'18px'} fontWeight={700}>
                    Tin nhắn
                </Typography>
            </Box>
            <Box padding={2}>
                <Grid container spacing={2}>
                    <Grid item xs={4} sm={4} md={2.5}>
                        <Box padding={2} bgcolor={'#FFF'} borderRadius={'8px'}>
                            <Button
                                fullWidth
                                size="small"
                                sx={{ height: '40px' }}
                                variant="contained"
                                onClick={() => {
                                    setVisiable(true);
                                }}>
                                Tin nhắn mới
                            </Button>
                            <List>
                                <ListItemButton>
                                    <ListItemIcon sx={{ minWidth: '0', marginRight: '8px' }}>
                                        <SendIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Đã gửi" />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemIcon sx={{ minWidth: '0', marginRight: '8px' }}>
                                        <ArticleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Nháp" />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemIcon sx={{ minWidth: '0', marginRight: '8px' }}>
                                        <DeleteSweepOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Thất bại" />
                                </ListItemButton>
                            </List>
                            <List
                                subheader={
                                    <Typography fontSize={'16px'} color={'#3D475C'} fontWeight={500}>
                                        Danh sách
                                    </Typography>
                                }>
                                <ListItemButton>
                                    <ListItemIcon sx={{ minWidth: '0', marginRight: '8px' }}>
                                        <AssignmentOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Giao dịch" />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemIcon sx={{ minWidth: '0', marginRight: '8px' }}>
                                        <EventNoteOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Lịch hẹn" />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemIcon sx={{ minWidth: '0', marginRight: '8px' }}>
                                        <CakeOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Khách sinh nhật" />
                                </ListItemButton>
                            </List>
                        </Box>
                    </Grid>
                    <Grid item xs={8} sm={8} md={9.5}>
                        <Box bgcolor={'#FFF'} height={'100%'} borderRadius={'8px'}>
                            <DataGrid columns={columns} rows={[]} hideFooter localeText={TextTranslate} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <CreateOrEditTinNhanModal
                visiable={visiable}
                onCancel={() => {
                    setVisiable(!visiable);
                }}
            />
        </Box>
    );
};
export default TinNhanPage;
