import { FC, useEffect, useState } from 'react';
import { IHeaderTable, MyHeaderTable } from '../../components/Table/MyHeaderTable';
import {
    Button,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import SearchIcon from '@mui/icons-material/Search';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import utils from '../../utils/utils';
import HoaDonService from '../../services/ban_hang/HoaDonService';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import { TypeAction } from '../../lib/appconst';

const TabChiTietHoaDon: FC<{ idHoaDon: string }> = ({ idHoaDon }) => {
    const [lstCTHD, setLstCTHD] = useState<PageHoaDonChiTietDto[]>([]);

    const GetChiTietHoaDon_byIdHoaDon = async () => {
        if (!utils.checkNull(idHoaDon)) {
            const data = await HoaDonService.GetChiTietHoaDon_byIdHoaDon(idHoaDon);
            setLstCTHD(data);
        }
    };

    useEffect(() => {
        GetChiTietHoaDon_byIdHoaDon();
    }, [idHoaDon]);

    const doActionRow = (typeAction: number, item: PageHoaDonChiTietDto) => {
        switch (typeAction) {
            case TypeAction.UPDATE:
                {
                    //
                }
                break;
            case TypeAction.DELETE:
                {
                    //
                }
                break;
        }
    };

    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'maHangHoa', columnText: 'Mã dịch vụ' },
        { columnId: 'tenHangHoa', columnText: 'Tên dịch vụ' },
        { columnId: 'soLuong', columnText: 'Số lượng' },
        { columnId: 'donGiaTruocCK', columnText: 'Đơn giá (trước CK)', align: 'right' },
        { columnId: 'tienChietKhau', columnText: 'Chiết khấu', align: 'right' },
        { columnId: 'thanhTienSauCK', columnText: 'Thành tiền', align: 'right' }
    ];
    return (
        <Grid container spacing={2}>
            <Grid item lg={7}>
                <Stack spacing={1} direction={'row'} alignItems={'center'}>
                    <TextField
                        size="small"
                        fullWidth
                        sx={{ flex: 3 }}
                        placeholder="Tìm dịch vụ"
                        InputProps={{
                            startAdornment: <SearchIcon />
                        }}
                    />
                    <Button sx={{ flex: 1 }} variant="outlined" startIcon={<FileUploadIcon />}>
                        Xuất file
                    </Button>
                </Stack>
            </Grid>
            <Grid item lg={5}></Grid>

            <Grid item lg={12}>
                <TableContainer sx={{ overflow: 'auto', maxHeight: 420 }}>
                    <Table>
                        <TableHead>
                            <MyHeaderTable
                                showAction={true}
                                isCheckAll={false}
                                isShowCheck={false}
                                sortBy=""
                                sortType="stt"
                                onRequestSort={() => console.log('sort')}
                                listColumnHeader={listColumnHeader}
                            />
                        </TableHead>
                        <TableBody>
                            {lstCTHD?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row?.maHangHoa}</TableCell>
                                    <TableCell
                                        className="lableOverflow"
                                        sx={{ maxWidth: 250, minWidth: 250 }}
                                        title={row?.tenHangHoa}>
                                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                            <PersonAddOutlinedIcon
                                                className="only-icon"
                                                titleAccess="Chọn nhân viên thực hiện"
                                            />
                                            <Typography> {row?.tenHangHoa}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                        {new Intl.NumberFormat('vi-VN').format(row?.soLuong ?? 0)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {new Intl.NumberFormat('vi-VN').format(row?.donGiaTruocCK ?? 0)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {new Intl.NumberFormat('vi-VN').format(row?.tienChietKhau ?? 0)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {new Intl.NumberFormat('vi-VN').format(row?.thanhTienSauCK ?? 0)}
                                    </TableCell>
                                    <TableCell sx={{ minWidth: 40 }}>
                                        <Stack spacing={1} direction={'row'}>
                                            <OpenInNewOutlinedIcon
                                                titleAccess="Cập nhật"
                                                className="only-icon"
                                                sx={{ width: '16px', color: '#7e7979' }}
                                                onClick={() => doActionRow(TypeAction.UPDATE, row)}
                                            />
                                            <ClearIcon
                                                titleAccess="Xóa"
                                                sx={{
                                                    ' &:hover': {
                                                        color: 'red',
                                                        cursor: 'pointer'
                                                    }
                                                }}
                                                style={{ width: '16px', color: 'red' }}
                                                onClick={() => doActionRow(TypeAction.DELETE, row)}
                                            />
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12}>
                <Grid container paddingLeft={1} paddingRight={1}>
                    <Grid item lg={6}>
                        <Stack
                            direction={'row'}
                            spacing={1}
                            alignItems={'center'}
                            sx={{ textDecoration: 'underline', color: '#1976d2', cursor: 'pointer' }}>
                            <ControlPointIcon />
                            <Typography>Thêm chi tiết mới</Typography>
                        </Stack>
                    </Grid>
                    <Grid item lg={6}>
                        <Stack direction="row" justifyContent={'end'}>
                            <LabelDisplayedRows
                                currentPage={1}
                                pageSize={lstCTHD?.length ?? 0}
                                totalCount={lstCTHD?.length ?? 0}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
export default TabChiTietHoaDon;
