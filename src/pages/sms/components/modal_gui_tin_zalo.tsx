import { useContext, useEffect, useState } from 'react';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import { CreateOrEditSMSDto, NhatKyGuiTinSMSDto } from '../../../services/sms/gui_tin_nhan/gui_tin_nhan_dto';
import utils from '../../../utils/utils';
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

import DialogButtonClose from '../../../components/Dialog/ButtonClose';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import SelectWithData from '../../../components/Select/SelectWithData';
import AppConsts, { DateType, ISelect, LoaiTin, SMS_HinhThucGuiTin, TrangThaiGuiTinZalo } from '../../../lib/appconst';
import AutocompleteWithData from '../../../components/Autocomplete/AutocompleteWithData';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';
import { format } from 'date-fns';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import HeThongSMSServices from '../../../services/sms/gui_tin_nhan/he_thong_sms_services';
import { MauTinSMSDto } from '../../../services/sms/mau_tin_sms/mau_tin_dto';
import { IInforUserZOA, ITemplateZNS } from '../../../services/sms/gui_tin_nhan/zalo_dto';
import ZaloService from '../../../services/sms/gui_tin_nhan/ZaloService';
import { IDataAutocomplete } from '../../../services/dto/IDataAutocomplete';
import { RequestFromToDto } from '../../../services/dto/ParamSearchDto';
import { PagedKhachHangResultRequestDto } from '../../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import khachHangService from '../../../services/khach-hang/khachHangService';
import CaiDatNhacNhoService from '../../../services/sms/cai_dat_nhac_nho/CaiDatNhacNhoService';
import { Guid } from 'guid-typescript';
import axios from 'axios';

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

export default function ModalGuiTinNhanZalo({ accountZOA, zaloToken, isShow, idTinNhan, onClose, onSaveOK }: any) {
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanh.id;
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
            const param = new RequestFromToDto({
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
                                    user.idKhachHang = itFor.id;
                                    user.soDienThoai = itFor?.soDienThoai;
                                    arr.push(user);
                                    userZalo_IsCustomer.push(itFor.zoaUserId);
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
                        const data = await HeThongSMSServices.JqAutoCustomer_byIdLoaiTin(param, newSMS?.idLoaiTin);
                        if (data !== null && data.length > 0) {
                            // only get customer has ZOA with birthday, appointment, transaction
                            // todo 1 khachhang - nhieuhoadon
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
                                            user.idHoaDon = itFor?.idHoaDon;
                                            user.idBooking = itFor?.idBooking;
                                            arr.push(user);
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

    const getMauTinZaLo = async (item: IDataAutocomplete) => {
        const data = await ZaloService.GetZNSTemplate_byId(zaloToken?.accessToken, item?.id);
        setItemMauTinZaloChosed(data);
        setIdMauTinZalo(item?.id);
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
                idLoaiTin: htSMS.idLoaiTin,
                thoiGianTu: fromDate,
                thoiGianDen: toDate
            });
            await HeThongSMSServices.ThemMoi_NhatKyGuiTin_TrongKhoangThoiGian(nkyGuiTin);
        }
    };

    const GuiTinZalo = async (params: CreateOrEditSMSDto) => {
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
            switch (newSMS.idLoaiTin) {
                case LoaiTin.TIN_GIAO_DICH:
                    {
                        // get listHD from arrIdHoaDon
                        const arrIdHoaDon = lstCustomerChosed
                            ?.map((x) => {
                                return x.idHoaDon;
                            })
                            ?.filter((x) => x !== null);

                        const lstHD = await ZaloService.Zalo_GetInforHoaDon(arrIdHoaDon as string[]);

                        if (lstHD !== null) {
                            for (let index = 0; index < lstHD?.length; index++) {
                                const element = lstHD[index];
                                console.log('lselementtHD ', element);

                                // find cutomer by IdHoaDon
                                const itemEx = lstCustomerChosed?.filter((x) => x.idHoaDon === element.id);
                                if (itemEx.length > 0) {
                                    const dataSend = {
                                        soDienThoai: itemEx[0].soDienThoai,
                                        tenKhachHang: itemEx[0]?.display_name,
                                        MaHoaDon: element?.maHoaDon,
                                        TongTienHang: element?.tongTienHang ?? 0,
                                        NgayLapHoaDon: format(new Date(element?.ngayLapHoaDon), 'HH:mm dd/MM/yyyy')
                                    };
                                    const result = await ZaloService.DevMode_GuiTinNhanGiaoDich_ByTempId(
                                        zaloToken?.accessToken,
                                        idMauTinZalo,
                                        dataSend
                                    );
                                    await saveHeThongSMS(itemEx[0], result, params);
                                }
                            }
                        }
                    }
                    break;
            }
        }

        setObjAlert({ ...objAlert, mes: 'Gửi tin thành công', show: true });
        onSaveOK(1);
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
                                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
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
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <Stack
                                            spacing={1}
                                            sx={{ display: utils.checkNull(idMauTinZalo) ? '' : 'none' }}>
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
                                        </Stack>
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
