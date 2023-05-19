import * as React from 'react';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import './customerPage.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import downtLoadIcon from '../../images/download.svg';
import uploadIcon from '../../images/upload.svg';
import addIcon from '../../images/add.svg';
const Customer: React.FC = () => {
    function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }
    const breadcrumbs = [
        <Typography key="1" color="inherit" onClick={handleClick}>
            Khách hàng
        </Typography>,
        <Typography key="2" color="inherit" onClick={handleClick}>
            Quản lý khách hàng
        </Typography>
    ];

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'name', headerName: 'Tên khách hàng', width: 185 },
        { field: 'phone', headerName: 'Số điện thoại', width: 114 },
        {
            field: 'group',
            headerName: 'Nhóm khách',

            width: 112
        },
        { field: 'gender', headerName: 'Giới tính', width: 89 },
        {
            field: 'staff',
            headerName: 'Nhân viên phục vụ',

            width: 185
        },
        {
            field: 'total',
            headerName: 'Tổng chi tiêu',

            width: 113
        },
        {
            field: 'recentAppointment',
            headerName: 'Cuộc hẹn gần đây',

            width: 128
        },
        {
            field: 'source',
            headerName: 'Nguồn',

            width: 86
        }
    ];

    const rows = [
        {
            id: 1,
            name: 'Võ Việt Hà',
            phone: '0911290476',
            group: 'Vip',
            total: '3,232.000',
            source: 'Trực tiếp',
            staff: 'Đinh Tuấn Tài',
            recentAppointment: '18/09/2022 ',
            gender: 'Nam'
        },
        {
            id: 1777,
            name: 'Võ Việt Hà',
            phone: 'Jon',
            age: 35,
            staff: 'Hà Nội',
            position: 'Nhân viên',
            recentAppointment: '12/02/2022',
            State: 'Đang làm việc',
            gender: 'Nam'
        },
        {
            id: 10,
            name: 'Võ Việt Hà',
            phone: 'Jon',
            age: 35,
            location: 'Hà Nội',
            position: 'Nhân viên',
            join: '12/02/2022',
            State: 'Đang làm việc',
            gender: 'Nam'
        },
        {
            id: 16,
            name: 'Võ Việt Hà',
            phone: 'Jon',
            age: 35,
            location: 'Hà Nội',
            total: 'Nhân viên',
            join: '12/02/2022',
            State: 'Đang làm việc',
            gender: 'Nam'
        },
        { id: 2, name: 'Lannister', phone: 'Cersei', age: 42, location: 'Hà Nội' },
        { id: 3, name: 'Lannister', phone: 'Jaime', age: 45, location: 'Hà Nội' },
        { id: 4, name: 'Stark', phone: 'Arya', age: 16, location: 'Hà Nội' },
        { id: 5, name: 'Targaryen', phone: 'Daenerys', age: null, location: 'Hà Nội' },
        { id: 6, name: 'Melisandre', phone: null, age: 150, location: 'Hà Nội' },
        { id: 7, name: 'Clifford', phone: 'Ferrara', age: 44, location: 'Hà Nội' },
        { id: 8, name: 'Frances', phone: 'Rossini', age: 36, location: 'Hà Nội' },
        { id: 9, name: 'Roxie', phone: 'Harvey', age: 65, location: 'Hà Nội' }
    ];

    return (
        <div className="customer-page">
            <Grid container className="customer-page_row-1">
                <Grid item xs={5}>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>
                    <h1>Danh sách khách hàng</h1>
                </Grid>
                <Grid item xs={7}>
                    <ButtonGroup variant="contained">
                        <Button variant="outlined" startIcon={<img src={downtLoadIcon} />}>
                            Nhập
                        </Button>
                        <Button startIcon={<img src={uploadIcon} />} variant="outlined">
                            Xuất
                        </Button>
                        <Button startIcon={<img src={addIcon} />} variant="contained">
                            Thêm khách hàng
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
            <div className="customer-page_row-2" style={{ height: 582, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 }
                        }
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
            </div>
        </div>
    );
};
export default Customer;
