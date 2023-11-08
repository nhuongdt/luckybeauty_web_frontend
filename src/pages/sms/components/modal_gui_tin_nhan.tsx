import { useContext, useEffect, useState } from 'react';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import { CreateOrEditSMSDto, ESMSDto, NhatKyGuiTinSMSDto } from '../../../services/sms/gui_tin_nhan/gui_tin_nhan_dto';
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
    IconButton
} from '@mui/material';
import DialogButtonClose from '../../../components/Dialog/ButtonClose';
import MenuIcon from '@mui/icons-material/Menu';
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

export default function ModalGuiTinNhan({ lstBrandname, lstMauTinSMS, isShow, idTinNhan, onClose, onSaveOK }: any) {
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanh.id;
    const [newSMS, setNewSMS] = useState<CreateOrEditSMSDto>(new CreateOrEditSMSDto({}) as CreateOrEditSMSDto);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [lstCustomerChosed, setLstCustomerChosed] = useState<IDataAutocomplete[]>([]);
    const [txtFromTo, setTextFromTo] = useState(`Hôm nay (${format(new Date(), 'dd/MM')})`);
    const [lblLoaiKhach, setLblLoaiKhach] = useState(`Khách sinh nhật`);
    const [fromDate, setFromDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    useEffect(() => {
        if (isShow) {
            if (utils.checkNull(idTinNhan)) {
                setNewSMS(new CreateOrEditSMSDto({}) as CreateOrEditSMSDto);
            } else {
                // get data from db
            }
        }
        console.log('modetinnhan');
    }, [isShow]);

    const rules = yup.object().shape({
        idKhachHang: yup.string().required('Vui lòng chọn khách hàng')
    });

    const choseCustomer = (abc: IDataAutocomplete[]) => {
        setLstCustomerChosed(abc);
    };
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    const onApplyFilterDate = async (fromDate: string, toDate: string, dateType: string, dateTypeText = '') => {
        setAnchorDateEl(null);
        setFromDate(fromDate);
        setToDate(toDate);

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
    };

    const saveDraft = async (params: any) => {
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
                await HeThongSMSServices.Insert_HeThongSMS(objSMS);
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

    const saveSMS = async (params: any) => {
        console.log('param ', params);
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
                if (params?.idLoaiTin !== 1) {
                    const nky = new NhatKyGuiTinSMSDto();
                    nky.idHeThongSMS = htSMS.id;
                    nky.idChiNhanh = idChiNhanh;
                    nky.idKhachHang = itFor.id;
                    nky.idLoaiTin = params?.idLoaiTin;
                    nky.thoiGianTu = fromDate;
                    nky.thoiGianDen = toDate;
                    await HeThongSMSServices.ThemMoi_NhatKyGuiTin(nky);
                }
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
                    {({ isSubmitting, handleChange, values, errors, touched, setFieldValue }: any) => (
                        <Form>
                            <DialogContent sx={{ overflow: 'unset' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <SelectWithData
                                            label="Brandname"
                                            data={lstBrandname}
                                            idChosed={lstBrandname.length > 0 ? lstBrandname[0].value : ''}
                                            handleChange={(item: ISelect) => setFieldValue('idBrandname', item.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <SelectWithData
                                            label="Loại tin"
                                            data={AppConsts.smsLoaiTin}
                                            idChosed={values.idLoaiTin ?? 1}
                                            handleChange={(item: ISelect) => {
                                                setFieldValue('idLoaiTin', item.value);
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
                                                <AutocompleteMultipleCustomerFromDB
                                                    type={values?.idLoaiTin}
                                                    label="Gửi đến"
                                                    paramFilter={{ idLoaiTin: values?.idLoaiTin }}
                                                    arrIdChosed={[]}
                                                    handleChoseItem={choseCustomer}
                                                    // error={touched.idDoiTuongNopTien && Boolean(errors?.idDoiTuongNopTien)}
                                                    // helperText={touched.idDoiTuongNopTien && errors.idDoiTuongNopTien}
                                                />
                                                <MenuIcon className="btnIcon" />
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
                                                    arrIdChosed={[]}
                                                    paramFilter={{
                                                        idLoaiTin: values?.idLoaiTin,
                                                        IdChiNhanhs: [idChiNhanh],
                                                        fromDate: fromDate,
                                                        toDate: toDate
                                                    }}
                                                    handleChoseItem={choseCustomer}
                                                    // error={touched.idDoiTuongNopTien && Boolean(errors?.idDoiTuongNopTien)}
                                                    // helperText={touched.idDoiTuongNopTien && errors.idDoiTuongNopTien}
                                                />
                                            </Stack>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AutocompleteWithData
                                            label="Mẫu tin"
                                            lstData={lstMauTinSMS
                                                ?.filter((x: MauTinSMSDto) => x.idLoaiTin === values?.idLoaiTin)
                                                .map((x: MauTinSMSDto) => {
                                                    return { id: x.id, text1: x.tenMauTin, text2: x.noiDungTinMau };
                                                })}
                                            // idChosed={values.idMauTin}
                                            handleChoseItem={(item: IDataAutocomplete) => {
                                                // setFieldValue('idMauTin', item.id);
                                                setFieldValue('noiDungTin', item.text2);
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            name="noiDungTin"
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label={`Nội dung tin`}
                                            onChange={handleChange}
                                            value={values.noiDungTin}
                                            helperText={
                                                touched.noiDungTin &&
                                                errors.noiDungTin && <span>{errors.noiDungTin}</span>
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}></Grid>
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
                                        <Button
                                            variant="contained"
                                            sx={{ bgcolor: 'var(--color-main)!important' }}
                                            onClick={() => saveDraft(values)}
                                            className="btn-container-hover">
                                            Lưu nháp
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ bgcolor: 'var(--color-main)!important' }}
                                            type="submit"
                                            className="btn-container-hover">
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
