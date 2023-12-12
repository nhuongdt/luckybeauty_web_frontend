import { FC, useEffect, useState } from 'react';
import AppConsts from '../../../lib/appconst';
import bookingStore from '../../../stores/bookingStore';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import {
    Avatar,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    Step,
    Stepper,
    StepLabel
} from '@mui/material';
import { observer } from 'mobx-react';
import { format as formatDate } from 'date-fns';
import { vi } from 'date-fns/locale';
import datLichService from '../../../services/dat-lich/datLichService';
import { enqueueSnackbar } from 'notistack';
import utils from '../../../utils/utils';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
// const LichHenDetail: FC = () => {
//     return (
//         <Dialog
//             open={bookingStore.isShowBookingInfo}
//             onClose={async () => {
//                 await bookingStore.onShowBookingInfo();
//                 bookingStore.idBooking = AppConsts.guidEmpty;
//             }}
//             sx={{ borderRadius: '8px' }}
//             fullWidth
//             maxWidth="sm">
//             <Box>
//                 <Box
//                     display={'flex'}
//                     justifyContent={'space-between'}
//                     padding={'16px 24px'}
//                     borderBottom="1px solid #C2C9D6">
//                     <Typography fontSize="24px" fontWeight={700}>
//                         Chi tiết cuộc hẹn
//                     </Typography>
//                     <IconButton
//                         onClick={async () => {
//                             await bookingStore.onShowBookingInfo();
//                             bookingStore.idBooking = AppConsts.guidEmpty;
//                         }}>
//                         <CloseIcon />
//                     </IconButton>
//                 </Box>
//                 <Box>
//                     <Grid container>
//                         <Grid item xs={12} padding={'8px 24px'} justifyContent={'space-between'}>
//                             <Box display={'flex'} justifyContent={'space-between'}>
//                                 <Box display={'flex'}>
//                                     <Avatar src={bookingStore.bookingInfoDto?.avatarKhachHang} />
//                                     <Box
//                                         display={'flex'}
//                                         flexDirection={'column'}
//                                         justifyContent={'space-between'}
//                                         marginLeft={'5px'}>
//                                         <Typography>{bookingStore.bookingInfoDto?.tenKhachHang}</Typography>
//                                         <Typography>{bookingStore.bookingInfoDto?.soDienThoai}</Typography>
//                                     </Box>
//                                 </Box>
//                                 <Box>
//                                     <ButtonGroup orientation="horizontal">
//                                         <Button
//                                             onClick={async () => {
//                                                 await bookingStore.onShowBookingInfo();
//                                                 await bookingStore.getForEditBooking(bookingStore.bookingInfoDto?.id);
//                                                 bookingStore.isShowCreateOrEdit = true;
//                                             }}>
//                                             Chỉnh sửa
//                                         </Button>
//                                         <Button
//                                             onClick={async () => {
//                                                 bookingStore.isShowConfirmDelete = true;
//                                             }}>
//                                             Xóa
//                                         </Button>
//                                     </ButtonGroup>
//                                 </Box>
//                             </Box>
//                         </Grid>
//                         <Grid
//                             item
//                             xs={12}
//                             padding={'8px'}
//                             display={'flex'}
//                             justifyContent={'center'}
//                             alignItems={'center'}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell sx={{ fontSize: '13px' }}>Ngày</TableCell>
//                                         <TableCell sx={{ fontSize: '13px' }}>Dịch vụ</TableCell>
//                                         <TableCell sx={{ fontSize: '13px' }}>Giá</TableCell>
//                                         <TableCell sx={{ fontSize: '13px' }}>Nhân viên</TableCell>
//                                         <TableCell sx={{ fontSize: '13px' }}>Ghi chú</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     <TableRow>
//                                         <TableCell>
//                                             <Typography
//                                                 sx={{
//                                                     color: 'black',
//                                                     fontFamily: 'Roboto',
//                                                     fontSize: '13px',
//                                                     fontWeight: '500',
//                                                     marginLeft: '8px'
//                                                 }}>
//                                                 {formatDate(
//                                                     new Date(bookingStore.bookingInfoDto.bookingDate),
//                                                     'iii, dd/MM/yyyy',
//                                                     { locale: vi }
//                                                 )}{' '}
//                                                 ({bookingStore.bookingInfoDto.startTime} -{' '}
//                                                 {bookingStore.bookingInfoDto.endTime})
//                                             </Typography>
//                                         </TableCell>
//                                         <TableCell>
//                                             <Typography
//                                                 sx={{
//                                                     color: 'black',
//                                                     fontFamily: 'Roboto',
//                                                     fontSize: '13px',
//                                                     fontWeight: '500',
//                                                     marginLeft: '8px'
//                                                 }}>
//                                                 {bookingStore.bookingInfoDto.tenDichVu}
//                                             </Typography>
//                                         </TableCell>
//                                         <TableCell>
//                                             {new Intl.NumberFormat('vi-VN').format(bookingStore.bookingInfoDto.donGia)}
//                                         </TableCell>
//                                         <TableCell>
//                                             <Typography
//                                                 sx={{
//                                                     color: 'black',
//                                                     fontFamily: 'Roboto',
//                                                     fontSize: '13px',
//                                                     fontWeight: '500',
//                                                     marginLeft: '8px'
//                                                 }}>
//                                                 {bookingStore.bookingInfoDto.nhanVienThucHien}
//                                             </Typography>
//                                         </TableCell>
//                                         <TableCell>
//                                             <Typography
//                                                 sx={{
//                                                     color: 'black',
//                                                     fontFamily: 'Roboto',
//                                                     fontSize: '13px',
//                                                     fontWeight: '500',
//                                                     marginLeft: '8px'
//                                                 }}>
//                                                 {bookingStore.bookingInfoDto.ghiChu}
//                                             </Typography>
//                                         </TableCell>
//                                     </TableRow>
//                                 </TableBody>
//                             </Table>
//                         </Grid>
//                         <Grid item xs={12} padding={'8px 24px'}>
//                             <Box
//                                 padding={'12px'}
//                                 display={'flex'}
//                                 alignItems={'center'}
//                                 justifyContent={'space-between'}>
//                                 <Typography fontSize={'13px'}>Trạng thái:</Typography>
//                                 <Stack direction="row">
//                                     <Button
//                                         variant="text"
//                                         onClick={() => {
//                                             bookingStore.bookingInfoDto.trangThai = TrangThaiBooking.Wait;
//                                         }}
//                                         sx={{
//                                             '&:hover': {
//                                                 background: '#FF9900',
//                                                 color: '#FFF'
//                                             },
//                                             background:
//                                                 bookingStore.bookingInfoDto?.trangThai == TrangThaiBooking.Wait
//                                                     ? '#FF9900'
//                                                     : '#FF99001a',
//                                             color:
//                                                 bookingStore.bookingInfoDto?.trangThai == TrangThaiBooking.Wait
//                                                     ? '#FFF'
//                                                     : '#FF9900'
//                                         }}>
//                                         Đang chờ
//                                     </Button>
//                                     <Button
//                                         onClick={() => {
//                                             bookingStore.bookingInfoDto.trangThai = TrangThaiBooking.Confirm;
//                                         }}
//                                         sx={{
//                                             '&:hover': {
//                                                 background: '#7DC1FF',
//                                                 color: '#FFF'
//                                             },
//                                             background:
//                                                 bookingStore.bookingInfoDto?.trangThai == TrangThaiBooking.Confirm
//                                                     ? '#7DC1FF'
//                                                     : '#7DC1FF1a',
//                                             color:
//                                                 bookingStore.bookingInfoDto?.trangThai == TrangThaiBooking.Confirm
//                                                     ? '#FFF'
//                                                     : '#7DC1FF'
//                                         }}>
//                                         Đã xác nhận
//                                     </Button>
//                                     <Button
//                                         onClick={() => {
//                                             bookingStore.bookingInfoDto.trangThai = TrangThaiBooking.CheckIn;
//                                         }}
//                                         sx={{
//                                             '&:hover': {
//                                                 background: '#009EF7',
//                                                 color: '#FFF'
//                                             },
//                                             background:
//                                                 bookingStore.bookingInfoDto?.trangThai == TrangThaiBooking.CheckIn
//                                                     ? '#009EF7'
//                                                     : '#009EF71a',
//                                             color:
//                                                 bookingStore.bookingInfoDto?.trangThai == TrangThaiBooking.CheckIn
//                                                     ? '#FFF'
//                                                     : '#009EF7'
//                                         }}>
//                                         Đã checkin
//                                     </Button>
//                                     <Button
//                                         onClick={() => {
//                                             bookingStore.bookingInfoDto.trangThai = TrangThaiBooking.Success;
//                                         }}
//                                         sx={{
//                                             '&:hover': {
//                                                 background: '#50CD89',
//                                                 color: '#FFF'
//                                             },
//                                             background:
//                                                 bookingStore.bookingInfoDto?.trangThai == TrangThaiBooking.Success
//                                                     ? '#50CD89'
//                                                     : '#50CD891a',
//                                             color:
//                                                 bookingStore.bookingInfoDto?.trangThai == TrangThaiBooking.Success
//                                                     ? '#FFF'
//                                                     : '#50CD89'
//                                         }}>
//                                         Đã hoàn thành
//                                     </Button>
//                                     <Button
//                                         onClick={() => {
//                                             bookingStore.bookingInfoDto.trangThai = TrangThaiBooking.Cancel;
//                                         }}
//                                         sx={{
//                                             '&:hover': {
//                                                 background: '#F1416C',
//                                                 color: '#FFF'
//                                             },
//                                             background:
//                                                 bookingStore.bookingInfoDto?.trangThai == TrangThaiBooking.Cancel
//                                                     ? '#F1416C'
//                                                     : '#F1416C1a',
//                                             color:
//                                                 bookingStore.bookingInfoDto?.trangThai == TrangThaiBooking.Cancel
//                                                     ? '#FFF'
//                                                     : '#F1416C'
//                                         }}>
//                                         Hủy
//                                     </Button>
//                                 </Stack>
//                             </Box>
//                         </Grid>
//                     </Grid>
//                 </Box>
//                 <DialogActions>
//                     <Button
//                         color="primary"
//                         variant="contained"
//                         onClick={async () => {
//                             const result = await datLichService.UpdateTrangThaiBooking(
//                                 bookingStore.bookingInfoDto?.id,
//                                 bookingStore.bookingInfoDto?.trangThai
//                             );
//                             await bookingStore.onShowBookingInfo();
//                             bookingStore.idBooking = AppConsts.guidEmpty;
//                             await bookingStore.getData();
//                             enqueueSnackbar(result.message, {
//                                 variant: result.status,
//                                 autoHideDuration: 3000
//                             });
//                         }}>
//                         Lưu trạng thái
//                     </Button>
//                 </DialogActions>
//             </Box>
//         </Dialog>
//     );
// };
// export default observer(LichHenDetail);

const LichHenDetail: FC = () => {
    const [firstCharCustomer, setfirstCharCustomer] = useState('');
    useEffect(() => {
        if (bookingStore.bookingInfoDto?.tenKhachHang !== undefined) {
            const allChar = utils.getFirstLetter(bookingStore.bookingInfoDto?.tenKhachHang);
            console.log('allChar ', bookingStore.bookingInfoDto?.trangThai);
            if (allChar != undefined) {
                if (allChar.length > 2) {
                    setfirstCharCustomer(allChar.substring(0, 2));
                } else {
                    setfirstCharCustomer(allChar);
                }
            } else {
                setfirstCharCustomer('');
            }
        }
    }, [bookingStore.bookingInfoDto?.tenKhachHang]);

    const onClickEditLichHen = async () => {
        bookingStore.isShowCreateOrEdit = true;
        await bookingStore.getForEditBooking(bookingStore.bookingInfoDto?.id);
    };

    const onCloseThisForm = async () => {
        await bookingStore.onShowBookingInfo();
        bookingStore.idBooking = AppConsts.guidEmpty;
    };

    const updateTrangThai = async (trangThai: number) => {
        const result = await datLichService.UpdateTrangThaiBooking(bookingStore.bookingInfoDto?.id, trangThai);
        enqueueSnackbar(result.message, {
            variant: result.status,
            autoHideDuration: 3000
        });
        await bookingStore.onShowBookingInfo();
        await bookingStore.getData();
    };

    return (
        <>
            <Dialog open={bookingStore.isShowBookingInfo} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ backgroundColor: bookingStore?.bookingInfoDto?.color, color: 'white' }}>
                    <Stack direction={'row'} spacing={1}>
                        <span>Thông tin cuộc hẹn</span>
                        <CreateOutlinedIcon titleAccess="Chỉnh sửa lịch hẹn" onClick={onClickEditLichHen} />
                    </Stack>

                    <CloseOutlinedIcon
                        onClick={onCloseThisForm}
                        sx={{
                            position: 'absolute',
                            right: '16px',
                            top: '16px',
                            minWidth: 35,
                            minHeight: 35,
                            '&:hover': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}
                    />
                </DialogTitle>
                <DialogContent sx={{ fontSize: '15px' }}>
                    <Grid container spacing={2} marginTop={0}>
                        <Grid item xs={12}>
                            <Grid container padding={'16px 16px 0px 0px'}>
                                <Grid item xs={3}>
                                    Thời gian
                                </Grid>
                                <Grid item xs={9}>
                                    <Stack spacing={1} direction={'row'}>
                                        <Stack>
                                            {formatDate(
                                                new Date(bookingStore.bookingInfoDto.bookingDate),
                                                'iii, dd/MM/yyyy',
                                                {
                                                    locale: vi
                                                }
                                            )}
                                        </Stack>
                                        <Stack>
                                            {bookingStore.bookingInfoDto.startTime} -{' '}
                                            {bookingStore.bookingInfoDto.endTime}
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container padding={'16px 16px 0px 0px'} alignItems={'center'}>
                                <Grid item xs={3}>
                                    Khách hàng
                                </Grid>
                                <Grid item xs={9}>
                                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                        <Stack>
                                            {bookingStore.bookingInfoDto?.avatarKhachHang ? (
                                                <Avatar
                                                    src={bookingStore.bookingInfoDto?.avatarKhachHang}
                                                    sx={{ width: 24, height: 24 }}
                                                />
                                            ) : (
                                                <Avatar
                                                    sx={{
                                                        width: 30,
                                                        height: 30,
                                                        fontSize: '12px',
                                                        color: 'white',
                                                        backgroundColor: bookingStore.bookingInfoDto?.color
                                                    }}>
                                                    {firstCharCustomer}
                                                </Avatar>
                                            )}
                                        </Stack>
                                        <Stack spacing={1}>
                                            <Stack sx={{ fontWeight: 600 }}>
                                                {bookingStore?.bookingInfoDto?.tenKhachHang}
                                            </Stack>
                                            <Stack sx={{ fontSize: '12px', color: '#a7b2bb' }}>
                                                {bookingStore.bookingInfoDto?.soDienThoai}
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container padding={'16px 16px 0px 0px'}>
                                <Grid item xs={3}>
                                    Dịch vụ
                                </Grid>
                                <Grid item xs={9}>
                                    {bookingStore.bookingInfoDto.tenDichVu}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Stepper
                                activeStep={bookingStore.bookingInfoDto?.trangThai - 1}
                                alternativeLabel
                                sx={{ paddingTop: '16px', paddingBottom: '16px' }}>
                                {AppConsts.trangThaiCheckIn
                                    .filter((x) => x.value !== 0)
                                    .map((item) => (
                                        <Step
                                            key={item.value}
                                            sx={{
                                                '& .MuiSvgIcon-root ': {
                                                    width: 30,
                                                    height: 30
                                                },
                                                ' & .MuiStepIcon-root.Mui-active': {
                                                    color: bookingStore?.bookingInfoDto?.color
                                                }
                                            }}
                                            onClick={() => updateTrangThai(item.value)}>
                                            <StepLabel title="Click vào đây để cập nhật trạng thái">
                                                {item.name}
                                            </StepLabel>
                                        </Step>
                                    ))}
                            </Stepper>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction={'row'} spacing={1} justifyContent={'flex-end'} paddingTop={3}>
                                <Button variant="outlined" onClick={onCloseThisForm} startIcon={<BlockOutlinedIcon />}>
                                    Đóng
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteOutlinedIcon />}
                                    onClick={() => (bookingStore.isShowConfirmDelete = true)}>
                                    Xóa lịch hẹn
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default observer(LichHenDetail);
