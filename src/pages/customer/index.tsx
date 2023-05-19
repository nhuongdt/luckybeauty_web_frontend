import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
const Customer: React.FC = () => {
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
            group: 'Nhóm 1',
            total: 'Hà Nội',
            source: 'Trực tiếp',
            staff: '12/02/2022',
            recentAppointment: 'Đang làm việc',
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
            <div className="customer-page_row-1" style={{ height: 582, width: '100%' }}>
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
