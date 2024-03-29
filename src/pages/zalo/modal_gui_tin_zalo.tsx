import React, { useContext, useEffect, useState } from 'react';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import {
    CreateOrEditSMSDto,
    NhatKyGuiTinSMSDto,
    ParamSearchSMS
} from '../../services/sms/gui_tin_nhan/gui_tin_nhan_dto';
import utils from '../../utils/utils';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Button,
    TextField,
    Stack,
    Typography,
    Autocomplete
} from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

import DialogButtonClose from '../../components/Dialog/ButtonClose';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import SelectWithData from '../../components/Select/SelectWithData';
import AppConsts, {
    DateType,
    ISelect,
    LoaiTin,
    SMS_HinhThucGuiTin,
    TrangThaiGuiTinZalo,
    TrangThaiSMS
} from '../../lib/appconst';
import AutocompleteWithData from '../../components/Autocomplete/AutocompleteWithData';
import DateFilterCustom from '../../components/DatetimePicker/DateFilterCustom';
import { format } from 'date-fns';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import HeThongSMSServices from '../../services/sms/gui_tin_nhan/he_thong_sms_services';
import { IInforUserZOA, ITemplateZNS, IZaloDataSend } from '../../services/zalo/zalo_dto';
import ZaloService from '../../services/zalo/ZaloService';
import { IDataAutocomplete } from '../../services/dto/IDataAutocomplete';
import { RequestFromToDto } from '../../services/dto/ParamSearchDto';
import { PagedKhachHangResultRequestDto } from '../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import khachHangService from '../../services/khach-hang/khachHangService';
import { Guid } from 'guid-typescript';
import { ZaloTemplateData } from '../../services/zalo/ZaloTemplateData';
import uploadFileService from '../../services/uploadFileService';
import datLichService from '../../services/dat-lich/datLichService';

export function AutocompleteCustomerZalo({ handleChoseItem, lstOption, helperText, err }: any) {
    const [lstChosed, setLstChosed] = useState<IInforUserZOA[]>([]);
    const choseItem = (lst: IInforUserZOA[]) => {
        setLstChosed(lst);
        handleChoseItem(lst);
    };
    return (
        <>
            <Autocomplete
                size="small"
                fullWidth
                disablePortal
                autoComplete
                multiple={true}
                filterSelectedOptions
                value={lstChosed}
                filterOptions={(x) => x}
                onChange={(event: any, newValue: IInforUserZOA[]) => choseItem(newValue)}
                options={lstOption}
                getOptionLabel={(option: IInforUserZOA) => (option?.display_name ? option.display_name : '')}
                renderInput={(params) => (
                    <TextField {...params} label={'Gửi đến'} helperText={helperText} error={err} />
                )}
                renderOption={(props, option) => {
                    return (
                        <li
                            {...props}
                            key={option.user_id}
                            style={{
                                borderBottom: '1px dashed var(--border-color)'
                            }}>
                            <Stack spacing={1} direction={'row'} sx={{ wordWrap: 'break-word' }} alignItems={'center'}>
                                <img src={option?.avatar} height={40} width={40} style={{ borderRadius: '100%' }} />
                                <Typography style={{ fontSize: '13px' }}>{option?.display_name}</Typography>
                            </Stack>
                        </li>
                    );
                }}
            />
        </>
    );
}

export const Zalo_Template: React.FC<{ idMauTinZalo: string }> = ({ idMauTinZalo }) => {
    const dataTemp = ZaloTemplateData.filter((x) => x.id === idMauTinZalo)[0];
    const zalo_logoBanner = `https://lh3.googleusercontent.com/d/1TDXeqE458lvu9DJXFg85FtBEuC_1OHUw`;
    return (
        <>
            <Stack spacing={1} padding={2}>
                <img src={zalo_logoBanner} style={{ width: '200px', height: '48px' }} />
                <Typography variant="body1" fontWeight={600}>
                    {dataTemp?.tieuDe}
                </Typography>
                <Typography variant="body2">{dataTemp?.noiDung}</Typography>

                {dataTemp?.noiDungChiTiet?.map((x, index) => (
                    <Grid container key={index}>
                        <Grid item xs={4}>
                            <Typography variant="body2">{x.key}</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body2">{x.value}</Typography>
                        </Grid>
                    </Grid>
                ))}

                <Stack spacing={1}>
                    {dataTemp?.buttons?.map((x: any, index: number) => (
                        <Button variant="contained" key={index}>
                            {x.title}
                        </Button>
                    ))}
                </Stack>
            </Stack>
        </>
    );
};

export default function ModalGuiTinNhanZalo({ accountZOA, zaloToken, isShow, idTinNhan, onClose, onSaveOK }: any) {
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanh.id;
    const zalo_logoBanner = `https://lh3.googleusercontent.com/d/1TDXeqE458lvu9DJXFg85FtBEuC_1OHUw`;

    const [newSMS, setNewSMS] = useState<CreateOrEditSMSDto>(new CreateOrEditSMSDto({}) as CreateOrEditSMSDto);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [lstCustomerChosed, setLstCustomerChosed] = useState<IInforUserZOA[]>([]);
    const [allKhachHangOA, setAllKhachHangOA] = useState<IInforUserZOA[]>([]);
    const [lstcustomerByLoaiTin, setLstcustomerByLoaiTin] = useState<IInforUserZOA[]>([]);
    const [txtFromTo, setTextFromTo] = useState('');
    const [lblLoaiKhach, setLblLoaiKhach] = useState(`Khách sinh nhật`);
    const [fromDate, setFromDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [dateType, setDateType] = useState<string>(DateType.HOM_NAY);
    const [dateTypeText, setDateTypeText] = useState<string>('Hôm nay');
    const [lstMauTinZNS, setLstMauTinZNS] = useState<ITemplateZNS[]>([]);
    const [idMauTinZalo, setIdMauTinZalo] = useState('');
    const [itemMauTinZaloChosed, setItemMauTinZaloChosed] = useState<any>();

    useEffect(() => {
        if (isShow) {
            setIdMauTinZalo('');
            if (utils.checkNull(idTinNhan)) {
                setNewSMS({ ...newSMS, id: '', idLoaiTin: 1, soTinGui: 0 });
            } else {
                // get data from db
            }
            Zalo_GetListKhachHangQuanTam();
            GetAllMauTinZalo_fromZNS();
            console.log('into1');
        }
    }, [isShow]);

    const rules = yup.object().shape({
        // noiDungTin: yup.string().required('Vui lòng nhập nội dung tin nhắn'),
        lstCustomer: yup.array().required('Vui lòng chọn khách hàng')
    });

    const choseCustomer = (lstCustomer: IInforUserZOA[]) => {
        setLstCustomerChosed(lstCustomer);
        console.log(' lstCustomer ', lstCustomer);
    };
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    useEffect(() => {
        onApplyFilterDate(fromDate, toDate, dateType, dateTypeText);
        setLstCustomerChosed([]); //?? chưa reset dược khách hàng đã chọn
    }, [newSMS?.idLoaiTin]);

    const isDateFuture = newSMS?.idLoaiTin === LoaiTin.TIN_LICH_HEN || newSMS?.idLoaiTin === LoaiTin.TIN_SINH_NHAT;

    const Zalo_GetListKhachHangQuanTam = async (fromDatePr: string | null = null, toDatePr: string | null = null) => {
        if (!utils.checkNull(zaloToken?.accessToken)) {
            const arr = [];
            const param = new ParamSearchSMS({
                fromDate: (fromDatePr ?? fromDate) as unknown as null,
                toDate: (toDatePr ?? toDate) as unknown as null,
                idChiNhanhs: [idChiNhanh],
                currentPage: 0,
                pageSize: 100
            });

            switch (newSMS?.idLoaiTin) {
                case LoaiTin.TIN_THUONG:
                    {
                        const param = {
                            keyword: '',
                            loaiDoiTuong: 1,
                            skipCount: 0,
                            maxResultCount: 50,
                            isUserZalo: 1
                        } as PagedKhachHangResultRequestDto;
                        const data = await khachHangService.jqAutoCustomer(param);
                        const allUser = await ZaloService.GetDanhSach_KhachHang_QuanTamOA(zaloToken?.accessToken);

                        const userZalo_IsCustomer: string[] = [];
                        if (data !== null && data.length > 0) {
                            // only get customer has ZOA
                            for (let i = 0; i < data.length; i++) {
                                const itFor = data[i];
                                const user = await ZaloService.GetInforUser_ofOA(
                                    zaloToken?.accessToken,
                                    itFor.zoaUserId
                                );
                                if (user != null) {
                                    if (!userZalo_IsCustomer.includes(itFor.zoaUserId)) {
                                        user.idKhachHang = itFor.id;
                                        user.soDienThoai = itFor?.soDienThoai;
                                        arr.push(user);
                                        userZalo_IsCustomer.push(itFor.zoaUserId);
                                    }
                                }
                            }
                        }

                        // tinthuong: get all user zalo (not/or not customer)
                        const userZalo_isNotCustomer = allUser?.followers?.filter(
                            (x: any) => !userZalo_IsCustomer.includes(x.user_id)
                        );
                        for (let i = 0; i < userZalo_isNotCustomer.length; i++) {
                            const itFor = userZalo_isNotCustomer[i];
                            const user = await ZaloService.GetInforUser_ofOA(zaloToken?.accessToken, itFor.user_id);
                            if (user != null) {
                                arr.push(user);
                            }
                        }
                    }
                    break;
                default:
                    {
                        param.isFilterCustomer = true;
                        param.loaiUser_CoTheGuiTin = SMS_HinhThucGuiTin.ZALO;
                        param.trangThais = [TrangThaiGuiTinZalo.FAIL, TrangThaiGuiTinZalo.CHUA_GUI];
                        const data = await HeThongSMSServices.JqAutoCustomer_byIdLoaiTin(param, newSMS?.idLoaiTin);
                        if (data !== null && data.length > 0) {
                            // only get customer has ZOA with birthday, appointment, transaction
                            const arrUserExists: string[] = [];
                            for (let i = 0; i < data.length; i++) {
                                const itFor = data[i];
                                if (!utils.checkNull(itFor.zoaUserId)) {
                                    if (!arrUserExists.includes(itFor.zoaUserId)) {
                                        arrUserExists.push(itFor.zoaUserId);
                                        const user = await ZaloService.GetInforUser_ofOA(
                                            zaloToken?.accessToken,
                                            itFor.zoaUserId
                                        );
                                        if (user != null) {
                                            user.idKhachHang = itFor.idKhachHang;
                                            user.soDienThoai = itFor?.soDienThoai;
                                            user.ngaySinh = itFor?.ngaySinh;
                                            user.idHoaDons = [itFor?.idHoaDon ?? ''];
                                            user.idBookings = [itFor?.idBooking ?? ''];
                                            arr.push(user);
                                        }
                                    } else {
                                        // push new idhoadon
                                        for (let index = 0; index < arr.length; index++) {
                                            const element = arr[index];
                                            if (element?.user_id == itFor.zoaUserId) {
                                                arr[index].idHoaDons?.push(itFor?.idHoaDon ?? '');
                                                arr[index].idBookings?.push(itFor?.idBooking ?? '');
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
            setAllKhachHangOA(arr);
            setLstcustomerByLoaiTin(arr);
        }
    };

    const GetAllMauTinZalo_fromZNS = async () => {
        const data = await ZaloService.GetList_TempFromZNS(zaloToken?.accessToken);
        setLstMauTinZNS(data);
    };

    const getMauTinZaLo = async (item: IDataAutocomplete | null) => {
        switch (item?.id) {
            case LoaiTin.TIN_GIAO_DICH.toString():
            case LoaiTin.TIN_LICH_HEN.toString():
            case LoaiTin.TIN_SINH_NHAT.toString():
                {
                    // get from data test / from DB (todo)
                    const data = ZaloTemplateData.filter((x) => x.id === item.id); // datatest
                    if (data?.length > 0) {
                        setItemMauTinZaloChosed(data[0]);
                        setIdMauTinZalo(item?.id);
                    }
                }
                break;
            default:
                {
                    // get from ZNS temp
                    const data = await ZaloService.GetZNSTemplate_byId(zaloToken?.accessToken, item?.id);
                    setItemMauTinZaloChosed(data);
                    setIdMauTinZalo(item?.id ?? '');
                }
                break;
        }
    };

    const onApplyFilterDate = (fromDate: string, toDate: string, dateType: string, dateTypeText = '') => {
        setAnchorDateEl(null);
        setFromDate(fromDate);
        setToDate(toDate);
        setDateType(dateType);
        setDateTypeText(dateTypeText);

        switch (newSMS?.idLoaiTin) {
            case LoaiTin.TIN_SINH_NHAT:
                {
                    switch (dateType) {
                        case DateType.HOM_NAY:
                        case DateType.HOM_QUA:
                        case DateType.NGAY_MAI:
                            {
                                const txtNgayThang = format(new Date(fromDate), 'dd/MM');
                                setTextFromTo(`${dateTypeText} (${txtNgayThang})`);
                            }
                            break;
                        case DateType.TUAN_NAY:
                        case DateType.TUAN_TRUOC:
                        case DateType.TUAN_TOI:
                        case DateType.TUY_CHON:
                            {
                                const txtFrom = format(new Date(fromDate), 'dd/MM');
                                const txtTo = format(new Date(toDate), 'dd/MM');
                                setTextFromTo(`${dateTypeText} (${txtFrom} đến ${txtTo})`);
                            }
                            break;
                        case DateType.THANG_NAY:
                        case DateType.THANG_TRUOC:
                        case DateType.THANG_TOI:
                            {
                                const txtMonth = format(new Date(fromDate), 'MM');
                                setTextFromTo(`Tháng ${txtMonth}`);
                            }
                            break;
                        case DateType.QUY_NAY:
                        case DateType.QUY_TRUOC:
                            {
                                const txtMonthFrom = format(new Date(fromDate), 'MM');
                                const txtMonthTo = format(new Date(toDate), 'MM');
                                setTextFromTo(`Tháng ${txtMonthFrom} - Tháng ${txtMonthTo}`);
                            }
                            break;
                        case DateType.NAM_NAY:
                        case DateType.NAM_TRUOC:
                            {
                                const txtYear = format(new Date(fromDate), 'yyyy');
                                setTextFromTo('Năm '.concat(txtYear));
                            }
                            break;
                        case DateType.TAT_CA:
                            {
                                setTextFromTo(`${dateTypeText}`);
                            }
                            break;
                    }
                    // get customer by loaitin
                    // setLstcustomerByLoaiTin(allKhachHangOA.filter((x: IInforUserZOA) => x.birth_date === 1));
                }
                break;
            case LoaiTin.TIN_GIAO_DICH:
            case LoaiTin.TIN_LICH_HEN:
                {
                    switch (dateType) {
                        case DateType.HOM_NAY:
                        case DateType.HOM_QUA:
                        case DateType.NGAY_MAI:
                            {
                                const txtNgayThang = format(new Date(fromDate), 'dd/MM/yyyy');
                                setTextFromTo(`${txtNgayThang}`);
                            }
                            break;
                        case DateType.TUAN_NAY:
                        case DateType.TUAN_TRUOC:
                        case DateType.TUAN_TOI:
                        case DateType.TUY_CHON:
                            {
                                const txtFrom = format(new Date(fromDate), 'dd/MM/yyyy');
                                const txtTo = format(new Date(toDate), 'dd/MM/yyyy');
                                setTextFromTo(`${txtFrom} đến ${txtTo}`);
                            }
                            break;
                        case DateType.THANG_NAY:
                        case DateType.THANG_TRUOC:
                        case DateType.THANG_TOI:
                            {
                                const txtMonth = format(new Date(fromDate), 'MM/yyyy');
                                setTextFromTo(`Tháng ${txtMonth}`);
                            }
                            break;
                        case DateType.QUY_NAY:
                        case DateType.QUY_TRUOC:
                            {
                                const txtMonthFrom = format(new Date(fromDate), 'MM/yyyy');
                                const txtMonthTo = format(new Date(toDate), 'MM/yyyy');
                                setTextFromTo(`Tháng ${txtMonthFrom} - Tháng ${txtMonthTo}`);
                            }
                            break;
                        case DateType.NAM_NAY:
                        case DateType.NAM_TRUOC:
                            {
                                const txtYear = format(new Date(fromDate), 'yyyy');
                                setTextFromTo('Năm '.concat(txtYear));
                            }
                            break;
                        case DateType.TAT_CA:
                            {
                                setTextFromTo(`${dateTypeText}`);
                            }
                            break;
                    }
                }
                break;
            default:
                {
                    setTextFromTo('');
                    setLstcustomerByLoaiTin([...allKhachHangOA]);
                }
                break;
        }

        Zalo_GetListKhachHangQuanTam(fromDate, toDate);
    };

    const saveHeThongSMS = async (cusItem: IInforUserZOA, dataZalo: any, objSMS: CreateOrEditSMSDto) => {
        console.log('saverdb ', cusItem, 'dataZalo ', dataZalo, 'objSMS', objSMS);
        if (!utils.checkNull(cusItem?.idKhachHang) && cusItem?.idKhachHang !== Guid.EMPTY) {
            const newObj = { ...objSMS };
            newObj.id = Guid.EMPTY;
            newObj.idChiNhanh = idChiNhanh;
            newObj.giaTienMoiTinNhan = 0;
            newObj.soTinGui = 1;
            newObj.idTinNhan = dataZalo?.message_id;
            newObj.hinhThucGui = SMS_HinhThucGuiTin.ZALO;
            newObj.idKhachHang = cusItem?.idKhachHang as string;
            newObj.soDienThoai = cusItem?.soDienThoai as string;
            newObj.tenKhachHang = cusItem?.tenKhachHang as string;
            newObj.trangThai = TrangThaiGuiTinZalo.SUCCESS;
            const loaiTin = AppConsts.smsLoaiTin.filter((x: ISelect) => x.value == newObj?.idLoaiTin);
            newObj.loaiTinNhan = loaiTin.length > 0 ? loaiTin[0].text : '';
            newObj.sTrangThaiGuiTinNhan = 'Thành công';

            const htSMS = await HeThongSMSServices.Insert_HeThongSMS(newObj);

            const nkyGuiTin = new NhatKyGuiTinSMSDto({
                idHeThongSMS: htSMS.id,
                idKhachHang: htSMS.idKhachHang,
                idChiNhanh: idChiNhanh,
                idHoaDon: objSMS.idHoaDon as unknown as null,
                idBooking: objSMS.idBooking as unknown as null,
                idLoaiTin: htSMS.idLoaiTin,
                thoiGianTu: fromDate,
                thoiGianDen: toDate
            });
            await HeThongSMSServices.ThemMoi_NhatKyGuiTinSMS(nkyGuiTin);
        }
    };

    const GuiTinZalo = async (params: CreateOrEditSMSDto) => {
        let countErr = 0;

        if (utils.checkNull(idMauTinZalo)) {
            for (let i = 0; i < lstCustomerChosed.length; i++) {
                const cusItem = lstCustomerChosed[i];
                const result = await ZaloService.GuiTinTuVan(
                    zaloToken?.accessToken,
                    cusItem.user_id,
                    params.noiDungTin
                );
                await saveHeThongSMS(cusItem, result.data, params);
            }
        } else {
            // todo check muatin - loaitin
            switch (idMauTinZalo) {
                case LoaiTin.TIN_GIAO_DICH.toString():
                    {
                        // get listHD from arrIdHoaDon
                        const arrIdHoaDon = lstCustomerChosed?.map((x) => {
                            return x?.idHoaDons?.filter((o) => !utils.checkNull(o));
                        })[0];

                        if (arrIdHoaDon !== undefined && arrIdHoaDon?.length > 0) {
                            const lstHD = await ZaloService.Zalo_GetInforHoaDon(arrIdHoaDon);

                            if (lstHD !== null) {
                                for (let index = 0; index < lstHD?.length; index++) {
                                    const element = lstHD[index];
                                    // find cutomer of thisHoaDon
                                    const itemEx = lstCustomerChosed?.filter(
                                        (x) => x?.idKhachHang === element?.idKhachHang
                                    );
                                    if (itemEx.length > 0) {
                                        const dataSend: IZaloDataSend = {
                                            logoChiNhanh: zalo_logoBanner,
                                            soDienThoai: itemEx[0].soDienThoai ?? '',
                                            tenKhachHang: itemEx[0]?.display_name,
                                            maHoaDon: element?.maHoaDon,
                                            tongTienHang: element?.tongTienHang ?? 0,
                                            ngayLapHoaDon: element?.ngayLapHoaDon
                                        };
                                        // const result = await ZaloService.DevMode_GuiTinNhanGiaoDich_ByTempId(
                                        //     zaloToken?.accessToken,
                                        //     idMauTinZalo,
                                        //     dataSend
                                        // );
                                        const result = await ZaloService.GuiTinNhanGiaoDich_WithMyTemp(
                                            zaloToken?.accessToken,
                                            itemEx[0]?.user_id,
                                            dataSend
                                        );
                                        if (result.error === 0) {
                                            params.idHoaDon = element?.id;

                                            params.noiDungTin = `${itemMauTinZaloChosed?.tieuDe} Hóa đơn:  ${
                                                dataSend?.maHoaDon
                                            } <br/> Ngày lập:  ${format(
                                                new Date(dataSend?.ngayLapHoaDon ?? new Date()),
                                                'HH:mm dd/MM/yyyy'
                                            )}<br /> Tổng tiền: ${new Intl.NumberFormat('vi-VN').format(
                                                dataSend?.tongTienHang ?? 0
                                            )}`;
                                            await saveHeThongSMS(itemEx[0], result.data, params);
                                        } else {
                                            countErr += 1;
                                            setObjAlert({ ...objAlert, show: true, type: 2, mes: result.message });
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                case LoaiTin.TIN_LICH_HEN.toString():
                    {
                        // get listBooking from arrIdBooing
                        const arrIdBooking = lstCustomerChosed?.map((x) => {
                            return x?.idBookings?.filter((o) => !utils.checkNull(o));
                        })[0];

                        if (arrIdBooking !== undefined && arrIdBooking.length > 0) {
                            const lstHD = await datLichService.GetListBooking_byId(arrIdBooking);

                            if (lstHD !== null) {
                                for (let index = 0; index < lstHD?.length; index++) {
                                    const element = lstHD[index];
                                    // find cutomer of by booking
                                    const itemEx = lstCustomerChosed?.filter(
                                        (x) => x?.idKhachHang === element?.idKhachHang
                                    );
                                    if (itemEx.length > 0) {
                                        let tenDichVu = '';
                                        // get all dichvu book
                                        for (let j = 0; j < element?.details?.length; j++) {
                                            tenDichVu += element?.details[j]?.tenHangHoa + ', ';
                                        }
                                        const dataSend: IZaloDataSend = {
                                            logoChiNhanh: zalo_logoBanner,
                                            soDienThoai: itemEx[0].soDienThoai ?? '',
                                            tenKhachHang: itemEx[0]?.display_name,
                                            bookingDate: element?.startTime,
                                            tenChiNhanh: element?.tenChiNhanh ?? '',
                                            diaChiChiNhanh: element?.diaChiChiNhanh ?? '',
                                            sdtChiNhanh: element?.soDienThoaiChiNhanh ?? '0973474985',
                                            tenDichVu: utils.Remove_LastComma(tenDichVu)
                                        };
                                        const result = await ZaloService.GuiTinNhanXacNhanLichHen_WithMyTemp(
                                            zaloToken?.accessToken,
                                            itemEx[0]?.user_id,
                                            dataSend
                                        );
                                        if (result.error === 0) {
                                            params.idBooking = element?.idBooking;

                                            params.noiDungTin = `${
                                                itemMauTinZaloChosed?.tieuDe
                                            } dịch vụ:  ${tenDichVu} <br/> Số điện thoại:  ${
                                                dataSend?.soDienThoai
                                            } <br /> Tên khách: ${dataSend?.tenKhachHang} <br/> Ngày đặt: ${format(
                                                new Date(dataSend?.bookingDate ?? new Date()),
                                                'HH:mm dd/MM/yyyy'
                                            )}`;

                                            await saveHeThongSMS(itemEx[0], result.data, params);
                                        } else {
                                            countErr += 1;
                                            setObjAlert({ ...objAlert, show: true, type: 2, mes: result.message });
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                case LoaiTin.TIN_SINH_NHAT.toString():
                    {
                        // get all dichvu book
                        for (let j = 0; j < lstCustomerChosed?.length; j++) {
                            const itemEx = lstCustomerChosed[j];
                            const dataSend: IZaloDataSend = {
                                logoChiNhanh: zalo_logoBanner,
                                tenChiNhanh: 'Lucky beauty',
                                soDienThoai: itemEx?.soDienThoai ?? '',
                                tenKhachHang: itemEx?.display_name
                            };
                            const result = await ZaloService.GuiTinNhanChucMungSinhNhat_WithMyTemp(
                                zaloToken?.accessToken,
                                itemEx?.user_id,
                                dataSend
                            );

                            if (result.error === 0) {
                                params.noiDungTin = `${itemMauTinZaloChosed?.tieuDe} khách hàng ${
                                    dataSend?.tenKhachHang
                                }, ngày sinh:  ${format(new Date(itemEx?.ngaySinh ?? new Date()), 'dd/MM/yyy')}`;
                                await saveHeThongSMS(itemEx, result.data, params);
                            } else {
                                countErr += 1;
                                setObjAlert({ ...objAlert, show: true, type: 2, mes: result.message });
                            }
                        }
                    }
                    break;
            }
        }

        if (countErr === 0) {
            setObjAlert({ ...objAlert, mes: 'Gửi tin thành công', show: true });
            onSaveOK(1);
        }
    };

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Dialog open={isShow} onClose={onClose} aria-labelledby="draggable-dialog-title" maxWidth="sm">
                <DialogTitle className="modal-title" id="draggable-dialog-title">
                    Gửi tin nhắn Zalo
                </DialogTitle>
                <DialogButtonClose onClose={onClose} />
                <Formik initialValues={newSMS} validationSchema={rules} onSubmit={GuiTinZalo} enableReinitialize>
                    {({ isSubmitting, values, errors, touched, setFieldValue }: any) => (
                        <Form>
                            <DialogContent sx={{ overflow: 'unset', paddingTop: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                            <img src={accountZOA?.avatar} height={40} width={40} />
                                            <Typography variant="body2" fontWeight={600}>
                                                {accountZOA?.name}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <SelectWithData
                                            label="Loại tin"
                                            data={AppConsts.smsLoaiTin}
                                            idChosed={values.idLoaiTin ?? 1}
                                            handleChange={(item: ISelect) => {
                                                setFieldValue('idLoaiTin', item.value);
                                                setNewSMS({ ...newSMS, idLoaiTin: item.value as number });
                                                switch (item.value) {
                                                    case LoaiTin.TIN_SINH_NHAT:
                                                        setLblLoaiKhach('Khách sinh nhật');
                                                        break;
                                                    case LoaiTin.TIN_GIAO_DICH:
                                                        setLblLoaiKhach('Khách giao dịch');
                                                        break;
                                                    case LoaiTin.TIN_LICH_HEN:
                                                        setLblLoaiKhach('Khách có hẹn');
                                                        break;
                                                    case LoaiTin.TIN_THUONG:
                                                        setLblLoaiKhach('');
                                                        break;
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        {values?.idLoaiTin == 1 ? (
                                            <Stack direction={'row'}>
                                                <AutocompleteCustomerZalo
                                                    lstOption={lstcustomerByLoaiTin}
                                                    handleChoseItem={(lst: IInforUserZOA[]) => {
                                                        choseCustomer(lst);
                                                        setFieldValue('lstCustomer', lst);
                                                    }}
                                                    error={touched.lstCustomer && Boolean(errors?.lstCustomer)}
                                                    helperText={touched.lstCustomer && errors.lstCustomer}
                                                />
                                            </Stack>
                                        ) : (
                                            <Stack spacing={2}>
                                                <TextField
                                                    size="small"
                                                    label={lblLoaiKhach}
                                                    value={txtFromTo}
                                                    onClick={(event) => setAnchorDateEl(event.currentTarget)}
                                                />
                                                <DateFilterCustom
                                                    id="popover-date-filter"
                                                    isFuture={isDateFuture}
                                                    dateTypeDefault={DateType.HOM_NAY}
                                                    open={openDateFilter}
                                                    anchorEl={anchorDateEl}
                                                    onClose={() => setAnchorDateEl(null)}
                                                    onApplyDate={onApplyFilterDate}
                                                />

                                                <AutocompleteCustomerZalo
                                                    lstOption={lstcustomerByLoaiTin}
                                                    handleChoseItem={(lst: IInforUserZOA[]) => {
                                                        choseCustomer(lst);
                                                        setFieldValue('lstCustomer', lst);
                                                    }}
                                                    error={touched.lstCustomer && Boolean(errors?.lstCustomer)}
                                                    helperText={touched.lstCustomer && errors.lstCustomer}
                                                />
                                            </Stack>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {/* <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                            <AutocompleteWithData
                                                label="Mẫu tin"
                                                idChosed={values?.idMauTin}
                                                lstData={lstMauTinZNS.map((x) => {
                                                    return { id: x.templateId, text1: x.templateName, text2: '' };
                                                })}
                                                handleChoseItem={(item: IDataAutocomplete) => {
                                                    getMauTinZaLo(item);
                                                    setFieldValue('idMauTin', item?.id);
                                                }}
                                            />
                                            <RemoveRedEyeOutlinedIcon
                                                className="btnIcon"
                                                titleAccess="Xem mẫu"
                                                onClick={() => window.open(itemMauTinZaloChosed?.previewUrl, '_blank')}
                                            />
                                        </Stack> */}
                                        <Stack>
                                            <AutocompleteWithData
                                                label="Mẫu tin"
                                                idChosed={values?.idMauTin}
                                                lstData={ZaloTemplateData.filter(
                                                    (x) => x.idLoaiTin == newSMS.idLoaiTin
                                                ).map((x) => {
                                                    return { id: x?.id, text1: x?.tieuDe, text2: x?.noiDung };
                                                })}
                                                handleChoseItem={(item: IDataAutocomplete | null) => {
                                                    getMauTinZaLo(item);
                                                    setFieldValue('idMauTin', item?.id);
                                                }}
                                            />
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        {utils.checkNull(idMauTinZalo) ? (
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                name="noiDungTin"
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label={`Nội dung tin`}
                                                onChange={(e) => {
                                                    setFieldValue('noiDungTin', e.target.value);
                                                }}
                                                value={values?.noiDungTin}
                                                helperText={
                                                    touched.noiDungTin &&
                                                    errors.noiDungTin && <span>{errors.noiDungTin}</span>
                                                }
                                            />
                                        ) : (
                                            <Zalo_Template idMauTinZalo={idMauTinZalo} />
                                        )}
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions style={{ paddingBottom: '20px' }}>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: 'var(--color-main)'
                                    }}
                                    onClick={onClose}
                                    className="btn-outline-hover">
                                    Hủy
                                </Button>
                                {isSubmitting ? (
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: 'var(--color-main)!important' }}
                                        className="btn-container-hover">
                                        Đang lưu
                                    </Button>
                                ) : (
                                    <>
                                        {/* <Button
                                            variant="contained"
                                            sx={{ bgcolor: 'var(--color-main)!important' }}
                                            onClick={() => saveDraft(values)}
                                            className="btn-container-hover">
                                            Lưu
                                        </Button> */}
                                        <Button
                                            variant="contained"
                                            sx={{ bgcolor: 'var(--color-main)!important' }}
                                            type="submit"
                                            className="btn-container-hover"
                                            startIcon={<SendOutlinedIcon />}>
                                            Gửi
                                        </Button>
                                    </>
                                )}
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
}
