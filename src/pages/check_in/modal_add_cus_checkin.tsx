import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Box, IconButton } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import CheckinService from '../../services/check_in/CheckinService';
import { ICheckInHoaDonto, KHCheckInDto, PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
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
import { TrangThaiCheckin, TypeAction } from '../../lib/appconst';
import utils from '../../utils/utils';
import DialogDraggable from '../../components/Dialog/DialogDraggable';

export const CheckIn_TabName = {
    CUSTOMER: 0,
    BOOKING: 1
};
export default function ModalAddCustomerCheckIn({ trigger, handleSave }: any) {
    const appContext = useContext(AppContext);
    const chiNhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = chiNhanhCurrent?.id ?? Cookies.get('IdChiNhanh');
    const [currentTab, setCurrentTab] = useState(CheckIn_TabName.BOOKING);

    const [isShow, setIsShow] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [errPhone, setErrPhone] = useState(false);
    const [errCheckIn, setErrCheckIn] = useState(false);
    const [objAlert, setObjAlert] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));

    const [objCheckIn, setObjCheckIn] = useState<KHCheckInDto>({} as KHCheckInDto);

    const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>({
        id: Guid.EMPTY,
        maKhachHang: '',
        tenKhachHang: '',
        idLoaiKhach: 1,
        soDienThoai: '',
        diaChi: '',
        gioiTinhNam: false,
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
                gioiTinhNam: false,
                idNguonKhach: '',
                idNhomKhach: ''
            });

            // nếu thay đổi khách hàng (từ A -->B)
            if (trigger?.isNew ?? true) {
                setCurrentTab(CheckIn_TabName.BOOKING);
            } else {
                setCurrentTab(CheckIn_TabName.CUSTOMER);
                getInforCheckIn();
            }
        }
        setIsSave(false);
    }, [trigger]);

    const getInforCheckIn = async () => {
        const dataCheckInDB = await CheckinService.GetInforCheckIn_byId(trigger?.id);
        setObjCheckIn(dataCheckInDB);
    };

    const checkSaveCheckin = async (idCus: string) => {
        const exists = await CheckinService.CheckExistCusCheckin(idCus);
        if (exists) {
            setErrCheckIn(true);
            setObjAlert({ ...objAlert, show: true, mes: 'Khách hàng đã check in' });
            return false;
        }
        return true;
    };
    const saveCheckIn = async (cusChosed: any, tabActive = 0) => {
        // 0.from tab customer, 1.add from booking
        if (tabActive === CheckIn_TabName.BOOKING) {
            cusChosed.id = cusChosed.idKhachHang;
        } else {
            // only check if checkin from tabKhachHang
            const check = await checkSaveCheckin(cusChosed.id);
            if (!check) {
                return;
            }
        }
        cusChosed.idKhachHang = cusChosed.id;

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
        // vì trangthaiCheckin: đang tính theo tổng số dịch vụ đang có (hoaDonChiTiet.length)
        // nên: nếu khách hàng có lịch hẹn và checkin: auto set trạng thái = Đang thực hiện
        // ngược lại: nếu chọn check in từ tab khách hàng: trạng thái = Đang chờ
        const newObjCheckin: KHCheckInDto = new KHCheckInDto({
            idKhachHang: cusChosed.id,
            idChiNhanh: idChiNhanh,
            trangThai: tabActive === CheckIn_TabName.BOOKING ? TrangThaiCheckin.DOING : TrangThaiCheckin.WAITING
        });

        if (trigger?.isNew || (!trigger?.isNew && (utils.checkNull(trigger?.id) || trigger?.id == Guid.EMPTY))) {
            const dataCheckIn = await CheckinService.InsertCustomerCheckIn(newObjCheckin);
            const pageObjCheckin: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
                idCheckIn: dataCheckIn.id,
                idKhachHang: newObjCheckin.idKhachHang,
                maKhachHang: cusChosed.maKhachHang,
                tenKhachHang: cusChosed.tenKhachHang,
                soDienThoai: cusChosed.soDienThoai,
                tongTichDiem: cusChosed.tongTichDiem,
                dateTimeCheckIn: dataCheckIn.dateTimeCheckIn,
                txtTrangThaiCheckIn: tabActive === CheckIn_TabName.BOOKING ? 'Đang thực hiện' : 'Đang chờ'
            });
            // save to Booking_Checkin_HD
            await CheckinService.InsertCheckInHoaDon({
                idCheckIn: dataCheckIn.id,
                idBooking: cusChosed?.idBooking
            } as ICheckInHoaDonto);
            // save to cache hdDB
            await addDataBooking_toCacheHD(cusChosed, dataCheckIn.id);
            handleSave(pageObjCheckin, TypeAction.INSEART);
        } else {
            // only change customer
            newObjCheckin.id = objCheckIn.id;
            newObjCheckin.idKhachHang = cusChosed.id;
            newObjCheckin.dateTimeCheckIn = objCheckIn.dateTimeCheckIn;
            newObjCheckin.idChiNhanh = objCheckIn.idChiNhanh;
            newObjCheckin.ghiChu = objCheckIn.ghiChu;
            await CheckinService.UpdateCustomerCheckIn(newObjCheckin);
            const dataCheckInOld = new PageKhachHangCheckInDto({
                idCheckIn: trigger?.id,
                idKhachHang: cusChosed?.id,
                maKhachHang: cusChosed.maKhachHang,
                tenKhachHang: cusChosed.tenKhachHang,
                soDienThoai: cusChosed.soDienThoai,
                tongTichDiem: cusChosed.tongTichDiem,
                txtTrangThaiCheckIn: 'Đang thực hiện'
            });
            handleSave(dataCheckInOld, TypeAction.UPDATE);
        }
    };

    const addDataBooking_toCacheHD = async (itemBook: BookingDetail_ofCustomerDto, idCheckIn: string) => {
        // always add new cache hoadon
        const hoadonCT = [];
        let tongTienHang = 0;

        for (let i = 0; i < itemBook?.details?.length; i++) {
            const itFor = itemBook?.details[i];
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
            idKhachHang: itemBook?.idKhachHang as unknown as null,
            maKhachHang: itemBook?.maKhachHang,
            tenKhachHang: itemBook?.tenKhachHang,
            soDienThoai: itemBook?.soDienThoai,
            tongTienHang: tongTienHang
        });
        hoadon.idCheckIn = idCheckIn;
        hoadon.tongTienHangChuaChietKhau = tongTienHang;
        hoadon.tongTienHDSauVAT = tongTienHang;
        hoadon.tongThanhToan = tongTienHang;
        hoadon.hoaDonChiTiet = hoadonCT;
        await dbDexie.hoaDon.add(hoadon);
    };

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
                aria-labelledby="dialogIdTitle"
                PaperComponent={DialogDraggable}
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
                    id="dialogIdTitle"
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
                        {trigger?.isNew ?? true ? 'Thêm check in' : 'Cập nhật khách hàng check in'}
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
                    {/* thu ngân: nếu thay đổi khách hàng --> ẩn tab */}
                    {(trigger?.isNew ?? true) && (
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
                    )}

                    <Box sx={{ marginTop: '20px' }}>
                        {currentTab === CheckIn_TabName.BOOKING ? (
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
