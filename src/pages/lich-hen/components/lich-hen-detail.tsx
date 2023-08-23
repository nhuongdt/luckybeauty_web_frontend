import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { Component, ReactNode } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CommentIcon from '@mui/icons-material/Comment';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { observer } from 'mobx-react';
import bookingStore from '../../../stores/bookingStore';
import AppConsts from '../../../lib/appconst';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
class LichhenDetail extends Component {
    render(): ReactNode {
        return (
            <Dialog
                open={bookingStore.isShowBookingInfo}
                onClose={async () => {
                    await bookingStore.onShowBookingInfo();
                    bookingStore.idBooking = AppConsts.guidEmpty;
                }}
                maxWidth="sm">
                <Box
                    sx={{
                        background: bookingStore.bookingInfoDto.color
                            ? bookingStore.bookingInfoDto.color
                            : '#EA7A57'
                    }}>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
                        <IconButton
                            size="small"
                            onClick={async () => {
                                await bookingStore.onShowBookingInfo();
                            }}>
                            <ModeEditOutlineIcon sx={{ color: '#FFF' }} />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={async () => {
                                bookingStore.isShowConfirmDelete = true;
                            }}>
                            <DeleteIcon sx={{ color: '#FFF' }} />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={async () => {
                                await bookingStore.onShowBookingInfo();
                                bookingStore.idBooking = AppConsts.guidEmpty;
                            }}>
                            <CloseIcon sx={{ color: '#FFF' }} />
                        </IconButton>
                    </Box>
                    <Box padding={'8px 16px 8px 16px'}>
                        <Typography
                            sx={{
                                color: '#FFF',
                                fontFamily: 'Roboto',
                                fontSize: '18px',
                                fontWeight: '700'
                            }}>
                            {bookingStore.bookingInfoDto.tenKhachHang}{' '}
                            {bookingStore.bookingInfoDto.soDienThoai
                                ? '(' + bookingStore.bookingInfoDto.soDienThoai + ')'
                                : ''}
                        </Typography>
                    </Box>
                </Box>
                <DialogContent>
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
                        <Box width={'100%'} sx={{ padding: '0px 4px' }}>
                            <Box sx={{ padding: '4px' }}>
                                <Box display={'flex'} alignItems={'center'}>
                                    <EventNoteIcon />
                                    <Typography
                                        sx={{
                                            //color: '#525F7A',
                                            fontFamily: 'Roboto',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            marginLeft: '8px'
                                        }}>
                                        {format(
                                            new Date(bookingStore.bookingInfoDto.bookingDate),
                                            'iii, dd/MM/yyyy',
                                            { locale: vi }
                                        )}{' '}
                                        ({bookingStore.bookingInfoDto.startTime} -{' '}
                                        {bookingStore.bookingInfoDto.endTime})
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ padding: '4px' }}>
                                <Box display={'flex'} alignItems={'center'}>
                                    <RoomServiceIcon />
                                    <Typography
                                        sx={{
                                            //color: '#525F7A',
                                            fontFamily: 'Roboto',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            marginLeft: '8px'
                                        }}>
                                        Dịch vụ: {bookingStore.bookingInfoDto.tenDichVu}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ padding: '4px' }}>
                                <Box display={'flex'} alignItems={'center'}>
                                    <PersonOutlineIcon />
                                    <Typography
                                        sx={{
                                            //color: '#525F7A',
                                            fontFamily: 'Roboto',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            marginLeft: '8px'
                                        }}>
                                        Nhân viên: {bookingStore.bookingInfoDto.nhanVienThucHien}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ padding: '4px' }}>
                                <Box display={'flex'} alignItems={'start'}>
                                    <CommentIcon />
                                    <Typography
                                        sx={{
                                            //color: '#525F7A',
                                            fontFamily: 'Roboto',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            marginLeft: '8px'
                                        }}>
                                        Ghi chú:{bookingStore.bookingInfoDto.ghiChu}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        );
    }
}
export default observer(LichhenDetail);
