import { useContext, useEffect, useState } from 'react';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import {
    CreateOrEditSMSDto,
    CustomerZaloDto,
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
    Typography,
    InputAdornment,
    Autocomplete,
    Box
} from '@mui/material';
import DialogButtonClose from '../../../components/Dialog/ButtonClose';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import SelectWithData from '../../../components/Select/SelectWithData';
import AppConsts, { DateType, ISelect, LoaiTin, TrangThaiSMS } from '../../../lib/appconst';
import AutocompleteWithData from '../../../components/Autocomplete/AutocompleteWithData';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';
import { format } from 'date-fns';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import HeThongSMSServices from '../../../services/sms/gui_tin_nhan/he_thong_sms_services';
import { MauTinSMSDto } from '../../../services/sms/mau_tin_sms/mau_tin_dto';
import { IInforUserZOA, ZaloAuthorizationDto } from '../../../services/sms/gui_tin_nhan/zalo_dto';
import ZaloService from '../../../services/sms/gui_tin_nhan/ZaloService';
import { IDataAutocomplete } from '../../../services/dto/IDataAutocomplete';
import { RequestFromToDto } from '../../../services/dto/ParamSearchDto';
import { PagedKhachHangResultRequestDto } from '../../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import khachHangService from '../../../services/khach-hang/khachHangService';

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

export default function ModalGuiTinNhanZalo({
    accountZOA,
    zaloToken,
    lstMauTinSMS,
    isShow,
    idTinNhan,
    onClose,
    onSaveOK
}: any) {
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

    useEffect(() => {
        if (isShow) {
            if (utils.checkNull(idTinNhan)) {
                setNewSMS({ ...newSMS, id: '', idLoaiTin: 1, soTinGui: 0 });
            } else {
                // get data from db
            }
        }
        console.log('modetinnhan');
        Zalo_GetListKhachHangQuanTam();
    }, [isShow]);

    const rules = yup.object().shape({
        noiDungTin: yup.string().required('Vui lòng nhập nội dung tin nhắn'),
        lstCustomer: yup.array().required('Vui lòng chọn khách hàng')
    });

    const choseCustomer = (lstCustomer: IInforUserZOA[]) => {
        setLstCustomerChosed(lstCustomer);
        console.log('choseCustomer ', lstCustomer);
    };
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    useEffect(() => {
        onApplyFilterDate(fromDate, toDate, dateType, dateTypeText);
        setLstCustomerChosed([]); //?? chưa reset dược khách hàng đã chọn
    }, [newSMS?.idLoaiTin]);

    const Zalo_GetListKhachHangQuanTam = async () => {
        if (!utils.checkNull(zaloToken?.accessToken)) {
            const arr = [];
            const param = new RequestFromToDto({
                fromDate: fromDate as unknown as null,
                toDate: toDate as unknown as null,
                idChiNhanhs: [idChiNhanh],
                currentPage: 0,
                pageSize: 100
            });

            switch (newSMS?.idLoaiTin) {
                case 1:
                    {
                        const param = {
                            keyword: '',
                            loaiDoiTuong: 1,
                            skipCount: 0,
                            maxResultCount: 50
                        } as PagedKhachHangResultRequestDto;
                        let data = await khachHangService.jqAutoCustomer(param);
                        if (data !== null && data.length > 0) {
                            // only get customer has ZOA
                            data = data.filter((x: any) => !utils.checkNull(x.zoaUserId));
                            for (let i = 0; i < data.length; i++) {
                                const itFor = data[i];
                                const user = await ZaloService.GetInforUser_ofOA(
                                    zaloToken?.accessToken,
                                    itFor.zoaUserId
                                );
                                user.idKhachHang = itFor.id;
                                arr.push(user);
                            }
                        }
                    }
                    break;
                default:
                    {
                        let data = await HeThongSMSServices.JqAutoCustomer_byIdLoaiTin(param, newSMS?.idLoaiTin);
                        if (data !== null && data.length > 0) {
                            // only get customer has ZOA
                            data = data.filter((x: CustomerZaloDto) => !utils.checkNull(x.zoaUserId));
                            for (let i = 0; i < data.length; i++) {
                                const itFor = data[i];
                                const user = await ZaloService.GetInforUser_ofOA(
                                    zaloToken?.accessToken,
                                    itFor.zoaUserId
                                );
                                user.idKhachHang = itFor.idKhachHang;
                                arr.push(user);
                            }
                        }
                    }
                    break;
            }

            setAllKhachHangOA(arr);
            setLstcustomerByLoaiTin(arr);
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
                    setLstcustomerByLoaiTin(allKhachHangOA.filter((x: IInforUserZOA) => x.birth_date === 1));
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
    };

    const saveNhatKyGuiTin = async (idHeThongSMS: string, idKhachHang: string, idLoaiTin: number) => {
        if (idLoaiTin !== 1) {
            const nky = new NhatKyGuiTinSMSDto();
            nky.idHeThongSMS = idHeThongSMS;
            nky.idChiNhanh = idChiNhanh;
            nky.idKhachHang = idKhachHang;
            nky.idLoaiTin = idLoaiTin;
            nky.thoiGianTu = fromDate;
            nky.thoiGianDen = toDate;

            // lưu nháp: vẫn lưu nhật ký, để check trangthai gửi tin
            await HeThongSMSServices.ThemMoi_NhatKyGuiTin(nky);
        }
    };

    const saveDraft = async (params: CreateOrEditSMSDto) => {
        const noiDungTin = params.noiDungTin;

        // await ZaloService.GuiTinTuVan(zaloToken?.accessToken);
        await ZaloService.NguoiDung_ChiaSeThongTin_ChoOA(accountZOA, zaloToken?.accessToken);

        onSaveOK(1);
    };

    const saveSMS = async (params: CreateOrEditSMSDto) => {
        const noiDungTin = params.noiDungTin;
        // only get customer has phone
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
                <Formik initialValues={newSMS} validationSchema={rules} onSubmit={saveSMS} enableReinitialize>
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
                                                    isFuture={1}
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
                                        <Button
                                            variant="contained"
                                            sx={{ bgcolor: 'var(--color-main)!important' }}
                                            onClick={() => saveDraft(values)}
                                            className="btn-container-hover">
                                            Lưu
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ bgcolor: 'var(--color-main)!important' }}
                                            type="submit"
                                            className="btn-container-hover">
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
