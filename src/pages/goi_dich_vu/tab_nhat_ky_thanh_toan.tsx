import {
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { FC, useEffect, useState } from 'react';
import SoQuyServices from '../../services/so_quy/SoQuyServices';
import utils from '../../utils/utils';
import QuyHoaDonDto from '../../services/so_quy/QuyHoaDonDto';
import { IHeaderTable, MyHeaderTable } from '../../components/Table/MyHeaderTable';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import { format } from 'date-fns';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import { LoaiChungTu, TypeAction } from '../../lib/appconst';

const TabNhatKyThanhToan: FC<{ idHoaDon: string }> = ({ idHoaDon }) => {
    const [lstPhieuThuChi, setLstPhieuThuChi] = useState<QuyHoaDonDto[]>([]);
    const [quyHDChosing, setQuyHDChosing] = useState<QuyHoaDonDto | null>(null);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [confirmDialog, setConfirmDialog] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1, // 1.remove customer, 2.change tabhoadon
        mes: ''
    });

    const GetNhatKyThanhToan = async () => {
        const data = await SoQuyServices.GetNhatKyThanhToan_ofHoaDon(idHoaDon);
        setLstPhieuThuChi(data);
    };

    useEffect(() => {
        if (!utils.checkNull_OrEmpty(idHoaDon)) {
            GetNhatKyThanhToan();
        }
    }, [idHoaDon]);

    const doActionRow = async (typeAction: number, item: QuyHoaDonDto) => {
        switch (typeAction) {
            case TypeAction.UPDATE:
                {
                    //
                }
                break;
            case TypeAction.DELETE:
                {
                    setQuyHDChosing({ ...item });
                    setConfirmDialog({
                        ...confirmDialog,
                        show: true,
                        title: 'Xác nhận xóa',
                        mes: `Bạn có chắc chắn muốn xóa ${
                            item?.idLoaiChungTu === LoaiChungTu.PHIEU_THU ? 'phiếu thu' : 'phiếu chi'
                        } ${item.maHoaDon} không?`
                    });
                }
                break;
        }
    };

    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'maHoaDon', columnText: 'Mã phiếu' },
        { columnId: 'ngayLapHoaDon', columnText: 'Ngày lập phiếu', align: 'center' },
        { columnId: 'loaiPhieu', columnText: 'Loại phiếu' },
        { columnId: 'hinhThucThanhToan', columnText: 'Hình thức thanh toán' },
        { columnId: 'tongTienThu', columnText: 'Tiền thu/chi', align: 'right' },
        { columnId: 'trangThai', columnText: 'Trạng thái' }
    ];

    return (
        <>
            <Grid container spacing={2}>
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
                                {lstPhieuThuChi?.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row?.maHoaDon}</TableCell>
                                        <TableCell align="center">
                                            {format(new Date(row?.ngayLapHoaDon), 'dd/MM/yyyy HH:mm')}
                                        </TableCell>
                                        <TableCell>{row?.loaiPhieu}</TableCell>
                                        <TableCell>{row?.sHinhThucThanhToan}</TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat('vi-VN').format(row?.tongTienThu ?? 0)}
                                        </TableCell>
                                        <TableCell
                                            className={
                                                row?.trangThai === 1
                                                    ? 'data-grid-cell-trangthai-active'
                                                    : 'data-grid-cell-trangthai-notActive'
                                            }>
                                            {row?.txtTrangThai}
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 40 }}>
                                            <Stack spacing={1} direction={'row'}>
                                                <OpenInNewOutlinedIcon
                                                    titleAccess="Cập nhật"
                                                    className="only-icon"
                                                    sx={{ width: '16px', color: '#7e7979' }}
                                                    //onClick={() => doActionRow(TypeAction.UPDATE, row)}
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
                                                    //onClick={() => doActionRow(TypeAction.DELETE, row)}
                                                />
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item lg={6}></Grid>
                <Grid item lg={6}>
                    <Stack direction="row" justifyContent={'end'}>
                        <LabelDisplayedRows
                            currentPage={1}
                            pageSize={lstPhieuThuChi?.length ?? 0}
                            totalCount={lstPhieuThuChi?.length ?? 0}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};
export default TabNhatKyThanhToan;
