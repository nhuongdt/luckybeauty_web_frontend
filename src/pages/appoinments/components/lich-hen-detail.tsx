import { FC, useEffect, useState } from 'react';
import AppConsts from '../../../lib/appconst';
import bookingStore from '../../../stores/bookingStore';
import CloseIcon from '@mui/icons-material/Close';
import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    Grid,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { observer } from 'mobx-react';
import { format as formatDate } from 'date-fns';
import { vi } from 'date-fns/locale';
import TrangThaiBooking from '../../../enum/TrangThaiBooking';
import datLichService from '../../../services/dat-lich/datLichService';
import { enqueueSnackbar } from 'notistack';

const LichHenDetail: FC = () => {
    return (
        <Dialog
            open={bookingStore.isShowBookingInfo}
            onClose={async () => {
                await bookingStore.onShowBookingInfo();
                bookingStore.idBooking = AppConsts.guidEmpty;
            }}
            sx={{ borderRadius: '8px' }}
            fullWidth
            maxWidth="sm">
            <Box>
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    padding={'16px 24px'}
                    borderBottom="1px solid #C2C9D6">
                    <Typography fontSize="24px" fontWeight={700}>
                        Chi tiết cuộc hẹn
                    </Typography>
                    <IconButton
                        onClick={async () => {
                            await bookingStore.onShowBookingInfo();
                            bookingStore.idBooking = AppConsts.guidEmpty;
                        }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box>
                    <Grid container>
                        <Grid item xs={12} padding={'8px 24px'} justifyContent={'space-between'}>
                            <Box display={'flex'} justifyContent={'space-between'}>
                                <Box display={'flex'}>
                                    <Avatar src={bookingStore.bookingInfoDto?.avatarKhachHang} />
                                    <Box
                                        display={'flex'}
                                        flexDirection={'column'}
                                        justifyContent={'space-between'}
                                        marginLeft={'5px'}>
                                        <Typography>
                                            {bookingStore.bookingInfoDto?.tenKhachHang}
                                        </Typography>
                                        <Typography>
                                            {bookingStore.bookingInfoDto?.soDienThoai}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <ButtonGroup orientation="horizontal">
                                        <Button
                                            onClick={async () => {
                                                await bookingStore.onShowBookingInfo();
                                                await bookingStore.getForEditBooking(
                                                    bookingStore.bookingInfoDto?.id
                                                );
                                                bookingStore.isShowCreateOrEdit = true;
                                            }}>
                                            Chỉnh sửa
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                bookingStore.isShowConfirmDelete = true;
                                            }}>
                                            Xóa
                                        </Button>
                                    </ButtonGroup>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            padding={'8px 24px 8px 0px'}
                            display={'flex'}
                            justifyContent={'center'}
                            alignItems={'center'}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ngày</TableCell>
                                        <TableCell>Dịch vụ</TableCell>
                                        <TableCell>Giá</TableCell>
                                        <TableCell>Nhân viên</TableCell>
                                        <TableCell>Ghi chú</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    color: 'black',
                                                    fontFamily: 'Roboto',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    marginLeft: '8px'
                                                }}>
                                                {formatDate(
                                                    new Date(
                                                        bookingStore.bookingInfoDto.bookingDate
                                                    ),
                                                    'iii, dd/MM/yyyy',
                                                    { locale: vi }
                                                )}{' '}
                                                ({bookingStore.bookingInfoDto.startTime} -{' '}
                                                {bookingStore.bookingInfoDto.endTime})
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    color: 'black',
                                                    fontFamily: 'Roboto',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    marginLeft: '8px'
                                                }}>
                                                {bookingStore.bookingInfoDto.tenDichVu}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat('vi-VN').format(
                                                bookingStore.bookingInfoDto.donGia
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    color: 'black',
                                                    fontFamily: 'Roboto',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    marginLeft: '8px'
                                                }}>
                                                {bookingStore.bookingInfoDto.nhanVienThucHien}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    color: 'black',
                                                    fontFamily: 'Roboto',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    marginLeft: '8px'
                                                }}>
                                                {bookingStore.bookingInfoDto.ghiChu}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item xs={12} padding={'8px 24px'}>
                            <Box
                                padding={'12px'}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'space-between'}>
                                <Typography>Trạng thái:</Typography>
                                <Stack direction="row">
                                    <Button
                                        variant="text"
                                        onClick={() => {
                                            bookingStore.bookingInfoDto.trangThai =
                                                TrangThaiBooking.Wait;
                                        }}
                                        sx={{
                                            '&:hover': {
                                                background: '#FF9900',
                                                color: '#FFF'
                                            },
                                            background:
                                                bookingStore.bookingInfoDto?.trangThai ==
                                                TrangThaiBooking.Wait
                                                    ? '#FF9900'
                                                    : '#FF99001a',
                                            color:
                                                bookingStore.bookingInfoDto?.trangThai ==
                                                TrangThaiBooking.Wait
                                                    ? '#FFF'
                                                    : '#FF9900'
                                        }}>
                                        Đang chờ
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            bookingStore.bookingInfoDto.trangThai =
                                                TrangThaiBooking.Confirm;
                                        }}
                                        sx={{
                                            '&:hover': {
                                                background: '#7DC1FF',
                                                color: '#FFF'
                                            },
                                            background:
                                                bookingStore.bookingInfoDto?.trangThai ==
                                                TrangThaiBooking.Confirm
                                                    ? '#7DC1FF'
                                                    : '#7DC1FF1a',
                                            color:
                                                bookingStore.bookingInfoDto?.trangThai ==
                                                TrangThaiBooking.Confirm
                                                    ? '#FFF'
                                                    : '#7DC1FF'
                                        }}>
                                        Đã xác nhận
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            bookingStore.bookingInfoDto.trangThai =
                                                TrangThaiBooking.CheckIn;
                                        }}
                                        sx={{
                                            '&:hover': {
                                                background: '#009EF7',
                                                color: '#FFF'
                                            },
                                            background:
                                                bookingStore.bookingInfoDto?.trangThai ==
                                                TrangThaiBooking.CheckIn
                                                    ? '#009EF7'
                                                    : '#009EF71a',
                                            color:
                                                bookingStore.bookingInfoDto?.trangThai ==
                                                TrangThaiBooking.CheckIn
                                                    ? '#FFF'
                                                    : '#009EF7'
                                        }}>
                                        Đã checkin
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            bookingStore.bookingInfoDto.trangThai =
                                                TrangThaiBooking.Success;
                                        }}
                                        sx={{
                                            '&:hover': {
                                                background: '#50CD89',
                                                color: '#FFF'
                                            },
                                            background:
                                                bookingStore.bookingInfoDto?.trangThai ==
                                                TrangThaiBooking.Success
                                                    ? '#50CD89'
                                                    : '#50CD891a',
                                            color:
                                                bookingStore.bookingInfoDto?.trangThai ==
                                                TrangThaiBooking.Success
                                                    ? '#FFF'
                                                    : '#50CD89'
                                        }}>
                                        Đã hoàn thành
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            bookingStore.bookingInfoDto.trangThai =
                                                TrangThaiBooking.Cancel;
                                        }}
                                        sx={{
                                            '&:hover': {
                                                background: '#F1416C',
                                                color: '#FFF'
                                            },
                                            background:
                                                bookingStore.bookingInfoDto?.trangThai ==
                                                TrangThaiBooking.Cancel
                                                    ? '#F1416C'
                                                    : '#F1416C1a',
                                            color:
                                                bookingStore.bookingInfoDto?.trangThai ==
                                                TrangThaiBooking.Cancel
                                                    ? '#FFF'
                                                    : '#F1416C'
                                        }}>
                                        Hủy
                                    </Button>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={async () => {
                            const result = await datLichService.UpdateTrangThaiBooking(
                                bookingStore.bookingInfoDto?.id,
                                bookingStore.bookingInfoDto?.trangThai
                            );
                            await bookingStore.onShowBookingInfo();
                            bookingStore.idBooking = AppConsts.guidEmpty;
                            await bookingStore.getData();
                            enqueueSnackbar(result.message, {
                                variant: result.status,
                                autoHideDuration: 3000
                            });
                        }}>
                        Lưu trạng thái
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};
export default observer(LichHenDetail);
