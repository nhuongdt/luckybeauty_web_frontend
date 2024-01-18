import { useContext, useEffect, useState } from 'react';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import {
    CreateOrEditSMSDto,
    CustomerSMSDto,
    ESMSDto,
    NhatKyGuiTinSMSDto
} from '../../../services/sms/gui_tin_nhan/gui_tin_nhan_dto';
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
    Typography
} from '@mui/material';
import DialogButtonClose from '../../../components/Dialog/ButtonClose';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import SelectWithData from '../../../components/Select/SelectWithData';
import AppConsts, { DateType, ISelect, LoaiTin, TrangThaiSMS } from '../../../lib/appconst';
import AutocompleteMultipleCustomerFromDB from '../../../components/Autocomplete/MultipleCustomerFromDB';
import { IDataAutocomplete } from '../../../services/dto/IDataAutocomplete';
import AutocompleteWithData from '../../../components/Autocomplete/AutocompleteWithData';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';
import { format } from 'date-fns';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import HeThongSMSServices from '../../../services/sms/gui_tin_nhan/he_thong_sms_services';
import { MauTinSMSDto } from '../../../services/sms/mau_tin_sms/mau_tin_dto';
import LichSuNap_ChuyenTienService from '../../../services/sms/lich_su_nap_tien/LichSuNap_ChuyenTienService';
import CaiDatNhacNhoService from '../../../services/sms/cai_dat_nhac_nho/CaiDatNhacNhoService';

export default function ModalGuiTinNhan({
    lstBrandname,
    lstMauTinSMS,
    isShow,
    idTinNhan,
    onClose,
    onSaveOK,
    lstRowSelect, // lstRowSelect,idLoaiTin:  nếu chọn từ danh sách (giaodịch, sinhnhat,..) và click gửi tin
    idLoaiTin
}: any) {
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanh.id;
    const [newSMS, setNewSMS] = useState<CreateOrEditSMSDto>(new CreateOrEditSMSDto({}) as CreateOrEditSMSDto);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [lstCustomerChosed, setLstCustomerChosed] = useState<IDataAutocomplete[]>([]);
    const [txtFromTo, setTextFromTo] = useState('');
    const [lblLoaiKhach, setLblLoaiKhach] = useState(`Khách sinh nhật`);
    const [fromDate, setFromDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [dateType, setDateType] = useState<string>(DateType.HOM_NAY);
    const [dateTypeText, setDateTypeText] = useState<string>('Hôm nay');
    const [soduTaiKhoan, setSoDuTaiKhoan] = useState(0);
    const [lstIdCustomer, setLstIdCustomer] = useState<any[]>([]);

    useEffect(() => {
        if (isShow) {
            console.log('idLoaiTin ', idLoaiTin);
            if (utils.checkNull(idTinNhan)) {
                setNewSMS({ ...newSMS, id: '', idLoaiTin: idLoaiTin ?? 1, soTinGui: 0 });
            } else {
                // get data from db
            }
            GetBrandnameBalance_byUserLogin();
            if (lstRowSelect != null && lstRowSelect !== undefined) {
                const arrIdCustomer = lstRowSelect.map((x: CustomerSMSDto) => {
                    return x.idKhachHang;
                });
                const arrUnique = Array.from(new Set(arrIdCustomer));
                setLstIdCustomer(arrUnique);
            } else {
                setLstIdCustomer([]);
            }
        }
        console.log('modetinnhan');
    }, [isShow]);

    const rules = yup.object().shape({
        noiDungTin: yup.string().required('Vui lòng nhập nội dung tin nhắn'),
        lstCustomer: yup.array().required('Vui lòng chọn khách hàng')
    });

    const GetBrandnameBalance_byUserLogin = async () => {
        const data = await LichSuNap_ChuyenTienService.GetBrandnameBalance_byUserLogin();
        if (data != null) {
            setSoDuTaiKhoan(data);
        }
    };

    const choseCustomer = (lstCustomer: IDataAutocomplete[]) => {
        setLstCustomerChosed(lstCustomer);
    };
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    useEffect(() => {
        onApplyFilterDate(fromDate, toDate, dateType, dateTypeText);
        setLstCustomerChosed([]);
        switch (newSMS?.idLoaiTin) {
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
    }, [newSMS?.idLoaiTin]);

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
                setTextFromTo('');
                break;
        }
    };

    const saveDraft = async (params: CreateOrEditSMSDto) => {
        const noiDungTin = params.noiDungTin;
        if (lstCustomerChosed.length > 0) {
            for (let i = 0; i < lstCustomerChosed.length; i++) {
                const itFor = lstCustomerChosed[i];
                const objSMS = new CreateOrEditSMSDto({
                    idLoaiTin: params?.idLoaiTin,
                    idChiNhanh: idChiNhanh,
                    idKhachHang: itFor.id,
                    noiDungTin: noiDungTin,
                    soTinGui: 0,
                    soDienThoai: itFor.text2
                });
                objSMS.trangThai = TrangThaiSMS.DRAFT;
                objSMS.giaTienMoiTinNhan = 950;
                const htSMS = await HeThongSMSServices.Insert_HeThongSMS(objSMS);
                await saveNhatKyGuiTin(htSMS.id, htSMS.idKhachHang, htSMS?.idLoaiTin);
            }
        } else {
            // only save hethong sms
            const objSMS = new CreateOrEditSMSDto({
                idLoaiTin: params?.idLoaiTin,
                idChiNhanh: idChiNhanh,
                noiDungTin: noiDungTin,
                soTinGui: 0,
                soDienThoai: ''
            });
            objSMS.trangThai = TrangThaiSMS.DRAFT;
            await HeThongSMSServices.Insert_HeThongSMS(objSMS);
        }
        onSaveOK(1);
    };

    const saveNhatKyGuiTin = async (idHeThongSMS: string, idKhachHang: string, idLoaiTin: number) => {
        let idHoaDon = null,
            idBooking = null;
        let from = '',
            to = '';

        const nkyGuiTin = new NhatKyGuiTinSMSDto({
            idHeThongSMS: idHeThongSMS,
            idKhachHang: idKhachHang,
            idChiNhanh: idChiNhanh,
            idLoaiTin: idLoaiTin,
            thoiGianTu: fromDate,
            thoiGianDen: toDate
        });

        if (lstRowSelect != null && lstRowSelect !== undefined) {
            // find customer has chosed
            const rowChosed = lstRowSelect.filter((x: CustomerSMSDto) => x.idKhachHang === idKhachHang);
            if (rowChosed.length > 0) {
                switch (idLoaiTin) {
                    case 2: // sinhnhat
                        break;
                    case 3: // lichhhen
                        {
                            idBooking = rowChosed[0].id;
                            from = format(new Date(rowChosed[0].bookingDate), 'yyyy-MM-dd');
                            to = format(new Date(rowChosed[0].bookingDate), 'yyyy-MM-dd');
                        }
                        break;
                    case 4: // giaodich
                        {
                            idHoaDon = rowChosed[0].id;
                            from = format(new Date(rowChosed[0].ngayLapHoaDon), 'yyyy-MM-dd');
                            to = format(new Date(rowChosed[0].ngayLapHoaDon), 'yyyy-MM-dd');
                        }
                        break;
                }
            }
            nkyGuiTin.idHoaDon = idHoaDon;
            nkyGuiTin.idBooking = idBooking;
            nkyGuiTin.thoiGianTu = from;
            nkyGuiTin.thoiGianDen = to;
            await HeThongSMSServices.ThemMoi_NhatKyGuiTinSMS(nkyGuiTin);
        } else {
            await HeThongSMSServices.ThemMoi_NhatKyGuiTin_TrongKhoangThoiGian(nkyGuiTin);
        }
    };

    const saveSMS = async (params: CreateOrEditSMSDto) => {
        if (lstBrandname.length > 0) {
            const tenBranname = lstBrandname[0].text;
            const noiDungTin = params.noiDungTin;
            // only get customer has phone
            const lstCusHasPhone = lstCustomerChosed?.filter((x: IDataAutocomplete) => !utils.checkNull(x.text2));
            for (let i = 0; i < lstCusHasPhone.length; i++) {
                const itFor = lstCusHasPhone[i];
                const objEsms = new ESMSDto({
                    sdtKhachhang: itFor.text2,
                    tenBranname: tenBranname,
                    noiDungTin: params.noiDungTin
                });
                const sendSMS = await HeThongSMSServices.SendSMS_Json(objEsms);

                const objSMS = new CreateOrEditSMSDto({
                    idLoaiTin: params?.idLoaiTin,
                    idChiNhanh: idChiNhanh,
                    idKhachHang: itFor.id,
                    noiDungTin: noiDungTin,
                    soTinGui: Math.ceil(noiDungTin?.length / 160),
                    soDienThoai: itFor.text2
                });
                objSMS.giaTienMoiTinNhan = 950;
                objSMS.idTinNhan = sendSMS.messageId;
                objSMS.trangThai = sendSMS.messageStatus;
                objSMS.tenKhachHang = itFor.text1;

                const loaiTin = AppConsts.smsLoaiTin.filter((x: ISelect) => x.value == objSMS?.idLoaiTin);
                objSMS.loaiTinNhan = loaiTin.length > 0 ? loaiTin[0].text : '';

                const trangThaiTin = AppConsts.ListTrangThaiGuiTin.filter(
                    (x: ISelect) => x.value == sendSMS?.messageStatus
                );
                objSMS.sTrangThaiGuiTinNhan = trangThaiTin.length > 0 ? trangThaiTin[0].text : '';

                const htSMS = await HeThongSMSServices.Insert_HeThongSMS(objSMS);
                await saveNhatKyGuiTin(htSMS.id, htSMS.idKhachHang, htSMS?.idLoaiTin);
                onSaveOK(1);
            }
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
                    {utils.checkNull(idTinNhan) ? 'Thêm mới' : 'Cập nhật'} SMS
                </DialogTitle>
                <DialogButtonClose onClose={onClose} />
                <Formik initialValues={newSMS} validationSchema={rules} onSubmit={saveSMS} enableReinitialize>
                    {({ isSubmitting, values, errors, touched, setFieldValue }: any) => (
                        <Form>
                            <DialogContent sx={{ overflow: 'unset' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <SelectWithData
                                            label="Brandname"
                                            data={lstBrandname}
                                            idChosed={lstBrandname.length > 0 ? lstBrandname[0].value : ''}
                                            handleChange={(item: ISelect) => setFieldValue('idBrandname', item?.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <SelectWithData
                                            label="Loại tin"
                                            data={AppConsts.smsLoaiTin}
                                            idChosed={values.idLoaiTin}
                                            handleChange={(item: ISelect) => {
                                                setFieldValue('idLoaiTin', item.value);
                                                setNewSMS({ ...newSMS, idLoaiTin: item.value as number });
                                                // set default mautin macdinh?? why not set?
                                                const maumacdinh = lstMauTinSMS?.filter(
                                                    (x: MauTinSMSDto) => x.idLoaiTin === item.value && x.laMacDinh
                                                );
                                                if (maumacdinh.length > 0) {
                                                    setFieldValue('idMauTin', maumacdinh[0].id);
                                                    setFieldValue('noiDungTin', maumacdinh[0].noiDungTinMau);
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        {values?.idLoaiTin == 1 ? (
                                            <Stack direction={'row'}>
                                                <AutocompleteMultipleCustomerFromDB
                                                    type={values?.idLoaiTin}
                                                    label="Gửi đến"
                                                    paramFilter={{ idLoaiTin: values?.idLoaiTin }}
                                                    arrIdChosed={lstIdCustomer}
                                                    handleChoseItem={(lst: IDataAutocomplete[]) => {
                                                        choseCustomer(lst);
                                                        setFieldValue('lstCustomer', lst);
                                                    }}
                                                    error={touched.lstCustomer && Boolean(errors?.lstCustomer)}
                                                    helperText={touched.lstCustomer && errors.lstCustomer}
                                                />
                                                {/* <MenuIcon className="btnIcon" /> */}
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
                                                    isFuture={1}
                                                    dateTypeDefault={DateType.HOM_NAY}
                                                    open={openDateFilter}
                                                    anchorEl={anchorDateEl}
                                                    onClose={() => setAnchorDateEl(null)}
                                                    onApplyDate={onApplyFilterDate}
                                                />

                                                <AutocompleteMultipleCustomerFromDB
                                                    type={values?.idLoaiTin}
                                                    label="Gửi đến"
                                                    arrIdChosed={lstIdCustomer}
                                                    paramFilter={{
                                                        idLoaiTin: values?.idLoaiTin,
                                                        IdChiNhanhs: [idChiNhanh],
                                                        fromDate: fromDate,
                                                        toDate: toDate
                                                    }}
                                                    handleChoseItem={(lst: IDataAutocomplete[]) => {
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
                                        <AutocompleteWithData
                                            label="Mẫu tin"
                                            idChosed={values?.idMauTin}
                                            lstData={lstMauTinSMS
                                                ?.filter((x: MauTinSMSDto) => x.idLoaiTin === values?.idLoaiTin)
                                                .map((x: MauTinSMSDto) => {
                                                    return { id: x.id, text1: x.tenMauTin, text2: x.noiDungTinMau };
                                                })}
                                            handleChoseItem={(item: IDataAutocomplete) => {
                                                setFieldValue('idMauTin', item?.id);
                                                setFieldValue('noiDungTin', item?.text2);
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <Stack spacing={1}>
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
                                                    setFieldValue(
                                                        'soTinGui',
                                                        Math.ceil(values?.noiDungTin?.length / 160)
                                                    );
                                                }}
                                                value={values?.noiDungTin}
                                                helperText={
                                                    touched.noiDungTin &&
                                                    errors.noiDungTin && <span>{errors.noiDungTin}</span>
                                                }
                                            />
                                            <Stack justifyContent={'space-between'} direction={'row'}>
                                                <Typography
                                                    variant="caption"
                                                    color={
                                                        '#9b9090'
                                                    }>{`${values?.noiDungTin?.length}/160 (${values?.soTinGui} tin nhắn)`}</Typography>
                                                <Typography fontSize={'14px'}>
                                                    {new Intl.NumberFormat('vi-VN').format(soduTaiKhoan)}
                                                </Typography>
                                            </Stack>
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
                                    <Button variant="contained">Đang lưu</Button>
                                ) : (
                                    <>
                                        <Button variant="contained" onClick={() => saveDraft(values)}>
                                            Lưu nháp
                                        </Button>
                                        <Button variant="contained" type="submit">
                                            Lưu
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
