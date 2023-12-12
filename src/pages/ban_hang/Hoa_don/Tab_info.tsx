import { Box, Grid, Typography, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import utils from '../../../utils/utils';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import HoaDonChiTietDto from '../../../services/ban_hang/HoaDonChiTietDto';
import { useState } from 'react';
import HoaHongNhanVienDichVu from '../../nhan_vien_thuc_hien/hoa_hong_nhan_vien_dich_vu';

export default function TabInfo({ hoadon, chitietHoaDon, onSaveOKNVThucHienDV }: any) {
    const columns: GridColDef[] = [
        {
            field: 'tenHangHoa',
            headerName: 'Tên dịch vụ',
            flex: 1.5,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Stack>{params.value}</Stack>
        },
        {
            field: 'soLuong',
            headerName: 'Số lượng',
            headerAlign: 'center',
            align: 'center',
            minWidth: 80,
            flex: 0.2,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={new Intl.NumberFormat('vi-VN').format(params.value)}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'donGiaTruocCK',
            headerName: 'Đơn giá',
            headerAlign: 'right',
            align: 'right',
            minWidth: 90,
            flex: 0.5,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={new Intl.NumberFormat('vi-VN').format(params.value)}>
                    {' '}
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'tienChietKhau',
            headerName: 'Chiết khấu',
            headerAlign: 'right',
            align: 'right',
            minWidth: 100,
            flex: 0.5,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={new Intl.NumberFormat('vi-VN').format(params.value)}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'thanhTienSauCK',
            headerName: 'Thành tiền',
            headerAlign: 'right',
            align: 'right',
            minWidth: 100,
            flex: 0.6,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={new Intl.NumberFormat('vi-VN').format(params.value)}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'tenNVThucHiens',
            headerName: 'NV thực hiện',
            minWidth: 100,
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Stack sx={{ fontSize: '13px', fontStyle: 'italic' }}>{utils.Remove_LastComma(params.value)}</Stack>
            )
        },
        {
            field: '#',
            headerName: '#',
            headerAlign: 'center',
            align: 'center',
            minWidth: 50,
            flex: 0.2,
            sortable: false,
            renderCell: (params) => (
                <PermIdentityOutlinedIcon
                    titleAccess="NV thực hiện"
                    onClick={() => getNVThucHien_ofChiTiet(params.row)}
                />
            )
        }
    ];

    const [isShowHoaHongDV, setIsShowHoaHongDV] = useState(false);
    const [itemHoaDonChiTiet, setItemHoaDonChiTiet] = useState<HoaDonChiTietDto>({} as HoaDonChiTietDto);

    const getNVThucHien_ofChiTiet = (itemCTHD: HoaDonChiTietDto) => {
        // modal nvthuchien
        setItemHoaDonChiTiet(itemCTHD);
        setIsShowHoaHongDV(true);
    };

    const saveOKNVienDichVu = () => {
        onSaveOKNVThucHienDV();
        setIsShowHoaHongDV(false);
    };

    return (
        <>
            <HoaHongNhanVienDichVu
                iShow={isShowHoaHongDV}
                itemHoaDonChiTiet={itemHoaDonChiTiet}
                onSaveOK={saveOKNVienDichVu}
                onClose={() => setIsShowHoaHongDV(false)}
            />
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    <DataGrid
                        disableRowSelectionOnClick
                        autoHeight
                        rowHeight={46}
                        columns={columns}
                        rows={chitietHoaDon}
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
                        <Typography variant="h2" fontSize="16px" fontWeight="700" color="#3B4758" mb="36px">
                            Chi tiết thanh toán
                        </Typography>
                        <Grid
                            container
                            alignItems="center"
                            rowGap="24px"
                            sx={{
                                '& .MuiGrid-item:nth-of-typ(even) .MuiTypography-root': {
                                    textAlign: 'right'
                                }
                            }}>
                            <Grid item xs={6}>
                                <Typography color="#3B4758" variant="h3" fontSize="14px" fontWeight="400">
                                    Tổng tiền hàng{' '}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" fontSize="14px" fontWeight="700" color="#3B4758">
                                    {new Intl.NumberFormat('vi-VN').format(hoadon?.tongTienHang)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="#3B4758" variant="h3" fontSize="14px" fontWeight="400">
                                    Giảm hóa đơn{' '}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" fontSize="14px" fontWeight="700" color="#3B4758">
                                    {new Intl.NumberFormat('vi-VN').format(hoadon?.tongGiamGiaHD)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="#3B4758" variant="h3" fontSize="14px" fontWeight="400">
                                    Tổng thanh toán{' '}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" fontSize="14px" fontWeight="700" color="#3B4758">
                                    {new Intl.NumberFormat('vi-VN').format(hoadon?.tongThanhToan)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="#3B4758" variant="h3" fontSize="14px" fontWeight="400">
                                    Khách đã trả{' '}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" fontSize="14px" fontWeight="700" color="#3B4758">
                                    {new Intl.NumberFormat('vi-VN').format(hoadon?.daThanhToan)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} marginTop="28px">
                                <Typography color="#3B4758" variant="h3" fontSize="18px" fontWeight="700">
                                    Còn nợ
                                </Typography>
                            </Grid>
                            <Grid item xs={6} marginTop="28px">
                                <Typography variant="body1" fontSize="18px" fontWeight="700" color="#3B4758">
                                    {new Intl.NumberFormat('vi-VN').format(hoadon?.conNo)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
