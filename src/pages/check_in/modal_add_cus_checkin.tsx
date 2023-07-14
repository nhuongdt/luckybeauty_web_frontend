import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import AutocompleteCustomer from '../../components/Autocomplete/Customer';

import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import KhachHangService from '../../services/khach-hang/khachHangService';
import CheckinService from '../../services/check_in/CheckinService';
import { KHCheckInDto, PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import { ChiNhanhContext } from '../../services/chi_nhanh/ChiNhanhContext';

import Utils from '../../utils/utils'; // func common
import { ReactComponent as CloseIcon } from '../../images/close-square.svg';
import { Guid } from 'guid-typescript';
import TabKhachHang from './TabModalKhachHang';
import TabCuocHen from './TabModalCuocHen';
export default function ModalAddCustomerCheckIn({ trigger, handleSave }: any) {
    const chiNhanhCurrent = useContext(ChiNhanhContext);
    const [isShow, setIsShow] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [errPhone, setErrPhone] = useState(false);
    const [errCheckIn, setErrCheckIn] = useState(false);

    const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>({
        id: Guid.EMPTY,
        maKhachHang: '',
        tenKhachHang: '',
        idLoaiKhach: 1,
        soDienThoai: '',
        diaChi: '',
        gioiTinh: false,
        idNguonKhach: '',
        idNhomKhach: ''
    });
    //const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>();

    useEffect(() => {
        if (trigger.isShow) {
            setIsShow(true);
            setNewCus({
                id: Guid.EMPTY,
                maKhachHang: '',
                tenKhachHang: '',
                idLoaiKhach: 1,
                soDienThoai: '',
                diaChi: '',
                gioiTinh: false,
                idNguonKhach: '',
                idNhomKhach: ''
            });
        }
        setIsSave(false);
    }, [trigger]);

    const changeCustomer = (item: KhachHangItemDto) => {
        if (item === null || item === undefined) {
            setNewCus({
                id: Guid.EMPTY,
                maKhachHang: '',
                tenKhachHang: '',
                idLoaiKhach: 1,
                soDienThoai: '',
                diaChi: '',
                gioiTinh: false,
                idNguonKhach: '',
                idNhomKhach: ''
            });

            return;
        }
        setNewCus((itemOlds: any) => {
            return {
                ...itemOlds,
                id: item.id.toString(),
                maKhachHang: item.maKhachHang,
                tenKhachHang: item.tenKhachHang,
                soDienThoai: item.soDienThoai,
                tongTichDiem: item.tongTichDiem
            };
        });
        setIsSave(false);
        setErrCheckIn(false);
    };

    const checkSaveCus = async () => {
        if (Utils.checkNull(newCus?.tenKhachHang ?? '')) {
            return false;
        }
        if (!Utils.checkNull(newCus?.soDienThoai ?? '')) {
            const exists = await KhachHangService.checkExistSoDienThoai(
                newCus?.soDienThoai ?? '',
                newCus.id
            );
            if (exists) {
                setErrPhone(true);
                return false;
            }
        }
        return true;
    };
    const checkSaveCheckin = async (idCus: string) => {
        if (Utils.checkNull(newCus?.tenKhachHang ?? '')) {
            return false;
        }
        if (!Utils.checkNull(newCus?.soDienThoai ?? '')) {
            const exists = await CheckinService.CheckExistCusCheckin(newCus.id);
            if (exists) {
                setErrCheckIn(true);
                return false;
            }
        }
        return true;
    };

    const saveCheckIn = async () => {
        if (isSave) return;
        setIsSave(true);

        if (Utils.checkNull(newCus?.id) || newCus.id === Guid.EMPTY) {
            // insert customer
            const check = await checkSaveCus();
            if (!check) {
                return;
            }
            const khCheckIn = await KhachHangService.createOrEdit(newCus);
            setNewCus((itemOlds: any) => {
                return {
                    ...itemOlds,
                    id: khCheckIn.id,
                    maKhachHang: khCheckIn.maKhachHang,
                    tenKhachHang: khCheckIn.tenKhachHang
                };
            });
            const objCheckIn: KHCheckInDto = new KHCheckInDto({
                idKhachHang: khCheckIn.id.toString(),
                idChiNhanh: chiNhanhCurrent.id
            });
            // insert checkin
            const dataCheckIn = await CheckinService.InsertCustomerCheckIn(objCheckIn);
            const objCheckInNew: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
                idCheckIn: dataCheckIn.id,
                idKhachHang: khCheckIn.id.toString(),
                maKhachHang: khCheckIn.maKhachHang,
                tenKhachHang: khCheckIn.tenKhachHang,
                soDienThoai: khCheckIn.soDienThoai,
                tongTichDiem: khCheckIn.tongTichDiem,
                dateTimeCheckIn: dataCheckIn.dateTimeCheckIn,
                txtTrangThaiCheckIn: dataCheckIn.txtTrangThaiCheckIn
            });
            handleSave(objCheckInNew);
        } else {
            const check = await checkSaveCheckin(newCus.id);
            if (!check) {
                return;
            }
            const objCheckIn: KHCheckInDto = new KHCheckInDto({
                idKhachHang: newCus.id,
                idChiNhanh: chiNhanhCurrent.id
            });
            // insert checkin
            const dataCheckIn = await CheckinService.InsertCustomerCheckIn(objCheckIn);
            const objCheckInNew: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
                idCheckIn: dataCheckIn.id,
                idKhachHang: objCheckIn.idKhachHang,
                maKhachHang: newCus.maKhachHang,
                tenKhachHang: newCus.tenKhachHang,
                soDienThoai: newCus.soDienThoai,
                tongTichDiem: newCus.tongTichDiem,
                dateTimeCheckIn: dataCheckIn.dateTimeCheckIn,
                txtTrangThaiCheckIn: dataCheckIn.txtTrangThaiCheckIn
            });
            handleSave(objCheckInNew);
        }

        setIsShow(false);
    };
    const [currentTab, setCurrentTab] = useState(1);
    const handleChangeTab = (value: number) => {
        setCurrentTab(value);
    };
    return (
        <>
            <Dialog
                open={isShow}
                onClose={() => setIsShow(false)}
                fullWidth
                maxWidth="md"
                sx={{
                    '& .MuiDialog-paperScrollPaper': {
                        overflowX: 'hidden'
                    }
                }}>
                <DialogTitle
                    sx={{
                        display: 'flex',
                        position: 'sticky',
                        top: '0',
                        left: '0',
                        bgcolor: '#fff',
                        zIndex: '5',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                    <Box fontWeight="700!important" component="h3" fontSize="24px">
                        Thêm checkin
                    </Box>
                    <IconButton
                        onClick={() => setIsShow(false)}
                        sx={{
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ overflow: 'visible' }}>
                    {/* <Grid container columnSpacing={6}>
                        <Grid item xs={12} sm={5} md={5} lg={5}>
                            <AutocompleteCustomer
                                handleChoseItem={changeCustomer}
                                idChosed={newCus?.id}
                            />
                            {isSave && errCheckIn && (
                                <Typography
                                    variant="body2"
                                    style={{ color: 'red', paddingTop: '4px' }}>
                                    Khách hàng đã check-in
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={7} md={7} lg={7}>
                            <Stack direction="column" paddingTop={2}>
                                <Typography variant="body2">Họ và tên</Typography>
                                <TextField
                                    size="small"
                                    value={newCus?.tenKhachHang}
                                    error={isSave && Utils.checkNull(newCus?.tenKhachHang)}
                                    helperText={
                                        isSave && Utils.checkNull(newCus?.tenKhachHang)
                                            ? 'Vui lòng nhập thông tin khách hàng'
                                            : ''
                                    }
                                    onChange={(event) => {
                                        setNewCus((itemOlds: any) => {
                                            return {
                                                ...itemOlds,
                                                tenKhachHang: event.target.value
                                            };
                                        });
                                        setIsSave(false);
                                    }}></TextField>
                            </Stack>
                            <Stack direction="column" paddingTop={2}>
                                <Typography variant="body2">Số điện thoại</Typography>
                                <TextField
                                    size="small"
                                    value={newCus?.soDienThoai}
                                    error={isSave && errPhone}
                                    helperText={
                                        isSave && errPhone ? 'Số điện thoại đã tồn tại' : ''
                                    }
                                    onChange={(event) => {
                                        setNewCus((itemOlds: any) => {
                                            return {
                                                ...itemOlds,
                                                soDienThoai: event.target.value
                                            };
                                        });
                                        setIsSave(false);
                                        setErrPhone(false);
                                    }}></TextField>
                            </Stack>
                        </Grid>
                    </Grid> */}
                    <Stack
                        direction="row"
                        gap="32px"
                        sx={{
                            '& button': {
                                minWidth: 'unset',
                                padding: '0',
                                transition: '.4s'
                            }
                        }}>
                        <Button
                            sx={{
                                color: currentTab === 1 ? '#7C3367' : '#999699',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-5px',
                                    transition: '.4s',
                                    left: currentTab === 1 ? '0' : 'calc(100% + 32px)',
                                    width: currentTab === 1 ? '100%' : '77.2px',
                                    borderTop: '2px solid #7C3367'
                                }
                            }}
                            variant="text"
                            onClick={() => handleChangeTab(1)}>
                            Cuộc hẹn
                        </Button>
                        <Button
                            sx={{ color: currentTab === 2 ? '#7C3367' : '#999699' }}
                            variant="text"
                            onClick={() => handleChangeTab(2)}>
                            Khách hàng
                        </Button>
                    </Stack>
                    <Box sx={{ marginTop: '20px' }}>
                        {currentTab === 1 ? <TabCuocHen /> : <TabKhachHang />}
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        position: 'sticky',
                        left: '0',
                        bottom: '0',
                        zIndex: '5',
                        bgcolor: '#fff'
                    }}>
                    <Stack direction="row" spacing={1} paddingTop={2} justifyContent="flex-end">
                        <Button
                            variant="contained"
                            className="button-container btn-container-hover"
                            sx={{ width: '70px' }}
                            onClick={saveCheckIn}>
                            Lưu
                        </Button>
                        <Button
                            variant="outlined"
                            className=" btn-outline-hover"
                            sx={{
                                width: '70px',
                                bgcolor: '#fff',
                                borderColor: '#E6E1E6',
                                color: '#666466'
                            }}
                            onClick={() => setIsShow(false)}>
                            Hủy
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
}
