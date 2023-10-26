import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Box, IconButton } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import CheckinService from '../../services/check_in/CheckinService';
import { KHCheckInDto, PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';

import { ReactComponent as CloseIcon } from '../../images/close-square.svg';
import { Guid } from 'guid-typescript';
import TabKhachHang from './TabModalKhachHang';
import TabCuocHen from './TabModalCuocHen';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import Cookies from 'js-cookie';
import { BookingDetail_ofCustomerDto } from '../../services/dat-lich/dto/BookingGetAllItemDto';
import { dbDexie } from '../../lib/dexie/dexieDB';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
export default function ModalAddCustomerCheckIn({ trigger, handleSave }: any) {
    const appContext = useContext(AppContext);
    const chiNhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = chiNhanhCurrent?.id ?? Cookies.get('IdChiNhanh');
    const [isShow, setIsShow] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [errPhone, setErrPhone] = useState(false);
    const [errCheckIn, setErrCheckIn] = useState(false);
    const [objAlert, setObjAlert] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));

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

    const checkSaveCheckin = async (idCus: string) => {
        const exists = await CheckinService.CheckExistCusCheckin(idCus);
        if (exists) {
            setErrCheckIn(true);
            setObjAlert({ ...objAlert, show: true, mes: 'Khách hàng đã check in' });
            return false;
        }
        return true;
    };
    const saveCheckIn = async (cusChosed: any, type = 0) => {
        // 0.from tab customer, 1.add from booking
        if (type === 1) {
            cusChosed.id = cusChosed.idKhachHang;
        }
        const check = await checkSaveCheckin(cusChosed.id);
        if (!check) {
            return;
        }
        setIsShow(false);

        setNewCus((itemOlds: any) => {
            return {
                ...itemOlds,
                id: cusChosed.id,
                maKhachHang: cusChosed.maKhachHang,
                tenKhachHang: cusChosed.tenKhachHang,
                soDienThoai: cusChosed.soDienThoai
            };
        });
        const objCheckIn: KHCheckInDto = new KHCheckInDto({
            idKhachHang: cusChosed.id,
            idChiNhanh: idChiNhanh
        });
        const dataCheckIn = await CheckinService.InsertCustomerCheckIn(objCheckIn);
        const objCheckInNew: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
            idCheckIn: dataCheckIn.id,
            idKhachHang: objCheckIn.idKhachHang,
            maKhachHang: cusChosed.maKhachHang,
            tenKhachHang: cusChosed.tenKhachHang,
            soDienThoai: cusChosed.soDienThoai,
            tongTichDiem: cusChosed.tongTichDiem,
            dateTimeCheckIn: dataCheckIn.dateTimeCheckIn,
            txtTrangThaiCheckIn: dataCheckIn.txtTrangThaiCheckIn
        });

        // save to Booking_Checkin_HD
        await CheckinService.InsertCheckInHoaDon({
            idCheckIn: dataCheckIn.id,
            idBooking: cusChosed?.idBooking
        });
        if (type === 1) {
            // save to cache hdDB
            await addDataBooking_toCacheHD(cusChosed, dataCheckIn.id);
        }
        handleSave(objCheckInNew, type);
    };

    const addDataBooking_toCacheHD = async (itemBook: BookingDetail_ofCustomerDto, idCheckIn: string) => {
        // always add new cache hoadon
        const hoadonCT = [];
        let tongTienHang = 0;

        for (let i = 0; i < itemBook.details.length; i++) {
            const itFor = itemBook.details[i];
            const newCT = new PageHoaDonChiTietDto({
                idDonViQuyDoi: itFor.idDonViQuyDoi as unknown as null,
                maHangHoa: itFor.maHangHoa,
                tenHangHoa: itFor.tenHangHoa,
                giaBan: itFor.giaBan,
                idNhomHangHoa: itFor.idNhomHangHoa as unknown as null,
                idHangHoa: itFor.idHangHoa as unknown as null,
                soLuong: 1
            });
            hoadonCT.push(newCT);
            tongTienHang += itFor.giaBan;
        }
        // create cache hd with new id
        const hoadon = new PageHoaDonDto({
            idChiNhanh: idChiNhanh,
            idKhachHang: itemBook.idKhachHang as unknown as null,
            maKhachHang: itemBook.maKhachHang,
            tenKhachHang: itemBook.tenKhachHang,
            soDienThoai: itemBook.soDienThoai,
            tongTienHang: tongTienHang
        });
        hoadon.idCheckIn = idCheckIn;
        hoadon.tongTienHangChuaChietKhau = tongTienHang;
        hoadon.tongTienHDSauVAT = tongTienHang;
        hoadon.tongThanhToan = tongTienHang;
        hoadon.hoaDonChiTiet = hoadonCT;
        await dbDexie.hoaDon.add(hoadon);
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
                <SnackbarAlert
                    showAlert={objAlert.show}
                    type={objAlert.type}
                    title={objAlert.mes}
                    handleClose={() =>
                        setObjAlert({ show: false, mes: '', type: 1 } as PropConfirmOKCancel)
                    }></SnackbarAlert>
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
                    <Box fontWeight="700!important" fontSize="24px">
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
                                color: currentTab === 1 ? 'var(--color-main)' : '#999699',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-5px',
                                    transition: '.4s',
                                    left: currentTab === 1 ? '0' : 'calc(100% + 32px)',
                                    width: currentTab === 1 ? '100%' : '77.2px',
                                    borderTop: '2px solid var(--color-main)'
                                }
                            }}
                            variant="text"
                            onClick={() => handleChangeTab(1)}>
                            Cuộc hẹn
                        </Button>
                        <Button
                            sx={{ color: currentTab === 2 ? 'var(--color-main)' : '#999699' }}
                            variant="text"
                            onClick={() => handleChangeTab(2)}>
                            Khách hàng
                        </Button>
                    </Stack>
                    <Box sx={{ marginTop: '20px' }}>
                        {currentTab === 1 ? (
                            <TabCuocHen handleChoseCusBooking={saveCheckIn} />
                        ) : (
                            <TabKhachHang handleChoseCus={saveCheckIn} />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        display: 'none',
                        position: 'sticky',
                        left: '0',
                        bottom: '0',
                        zIndex: '5',
                        bgcolor: '#fff'
                    }}>
                    <Stack direction="row" spacing={1} paddingTop={2} justifyContent="flex-end">
                        <Button
                            variant="contained"
                            className=" btn-container-hover"
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
