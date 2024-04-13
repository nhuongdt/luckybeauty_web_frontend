import React, { useContext, useEffect, useState } from 'react';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import {
    CreateOrEditSMSDto,
    CustomerSMSDto,
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
    Typography
} from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

import DialogButtonClose from '../../components/Dialog/ButtonClose';
import SelectWithData from '../../components/Select/SelectWithData';
import AppConsts, { DateType, ISelect, LoaiTin, TypeAction } from '../../lib/appconst';
import AutocompleteWithData from '../../components/Autocomplete/AutocompleteWithData';
import DateFilterCustom from '../../components/DatetimePicker/DateFilterCustom';
import { format } from 'date-fns';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import {
    IInforUserZOA,
    ITemplateZNS,
    IZaloDataMessage,
    InforZOA,
    ZaloAuthorizationDto
} from '../../services/zalo/zalo_dto';
import ZaloService from '../../services/zalo/ZaloService';
import { IDataAutocomplete } from '../../services/dto/IDataAutocomplete';
import { Guid } from 'guid-typescript';
import { IPropModal } from '../../services/dto/IPropsComponent';
import Zalo_MultipleAutoComplete_WithSDT, {
    IPropsZalo_AutocompleteMultipleCustomer
} from '../../components/Autocomplete/Zalo_MultipleAutoComplete_WithSDT';

export default function ModalGuiTinNhanZalo(props: IPropModal<CreateOrEditSMSDto>) {
    const { isShowModal, idUpdate, onClose, onOK } = props;
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanh.id;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lstIdCustomer, setLstIdCustomer] = useState<string[]>([]);
    const [txtFromTo, setTextFromTo] = useState('');
    const [lblLoaiKhach, setLblLoaiKhach] = useState(`Khách sinh nhật`);
    const [fromDate, setFromDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [dateType, setDateType] = useState<string>(DateType.HOM_NAY);
    const [dateTypeText, setDateTypeText] = useState<string>('Hôm nay');

    const [inforZOA, setInforZOA] = useState<InforZOA>({} as InforZOA);
    const [zaloToken, setZaloToken] = useState<ZaloAuthorizationDto>(new ZaloAuthorizationDto({ id: Guid.EMPTY }));

    const [idMauTinZalo, setIdMauTinZalo] = useState('');
    const [newSMS, setNewSMS] = useState<CreateOrEditSMSDto>(new CreateOrEditSMSDto({}) as CreateOrEditSMSDto);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [lstCustomerChosed, setLstCustomerChosed] = useState<CustomerSMSDto[]>([]);
    const [allMauTinZNS, setAllMauTinZNS] = useState<ITemplateZNS[]>([]);
    const [itemMauTinZNS, setItemMauTinZNS] = useState<ITemplateZNS>();

    useEffect(() => {
        if (isShowModal) {
            setIdMauTinZalo('');
            if (utils.checkNull(idUpdate)) {
                setNewSMS({ ...newSMS, id: '', idLoaiTin: LoaiTin.TIN_THUONG, soTinGui: 0 });
            } else {
                // get data from db
            }
            GetZaloTokenfromDB();
            console.log('into1');
        }
    }, [isShowModal]);

    const GetZaloTokenfromDB = async () => {
        const objAuthen = await ZaloService.Innit_orGetToken();
        if (objAuthen !== null) {
            setZaloToken(objAuthen);
            await GetInfor_ZaloOfficialAccount(objAuthen?.accessToken);
            await GetList_TempFromZNS(objAuthen?.accessToken);
        }
    };

    const GetList_TempFromZNS = async (accessToken: string) => {
        const data = await ZaloService.GetList_TempFromZNS(accessToken, 2);
        setAllMauTinZNS(data);
    };

    const GetInfor_ZaloOfficialAccount = async (accessToken: string) => {
        const newOA = await ZaloService.GetInfor_ZaloOfficialAccount(accessToken);
        setInforZOA(newOA);
    };

    const choseCustomer = (lstCustomer: CustomerSMSDto[]) => {
        setLstCustomerChosed(lstCustomer);
    };

    useEffect(() => {
        setLstCustomerChosed([]); //?? chưa reset dược khách hàng đã chọn
    }, [newSMS?.idLoaiTin]);

    const choseMauTinZNS = async (item: IDataAutocomplete) => {
        setIdMauTinZalo(item?.id);

        const dataMauTin = await ZaloService.GetZNSTemplate_byId(zaloToken?.accessToken, item?.id);
        if (dataMauTin !== null) {
            console.log('choseMauTinZNS ', dataMauTin);
            setItemMauTinZNS(dataMauTin);
        }
    };

    const data: IPropsZalo_AutocompleteMultipleCustomer = {
        paramFilter: {
            idLoaiTin: newSMS.idLoaiTin,
            IdChiNhanhs: [idChiNhanh],
            fromDate: fromDate,
            toDate: toDate
        } as ParamSearchSMS,
        arrIdChosed: lstIdCustomer,
        handleChoseItem: choseCustomer
    };

    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);
    const isDateFuture = newSMS?.idLoaiTin === LoaiTin.TIN_LICH_HEN || newSMS?.idLoaiTin === LoaiTin.TIN_SINH_NHAT;

    useEffect(() => {
        onApplyFilterDate(fromDate, toDate, dateType, dateTypeText);
        setLstCustomerChosed([]); //?? chưa reset dược khách hàng đã chọn
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
                }
                break;
        }
    };

    const saveHeThongSMS = async (cusItem: IInforUserZOA, dataZalo: IZaloDataMessage, objSMS: CreateOrEditSMSDto) => {
        //
    };

    const GuiTinZalo = async () => {
        let countErr = 0;

        for (let index = 0; index < lstCustomerChosed?.length; index++) {
            const element = lstCustomerChosed[index];
            const dataSend: CustomerSMSDto = {
                id: element.id,
                zoaUserId: element.zoaUserId,
                soDienThoai: `+84${element?.soDienThoai}`,
                tenKhachHang: element?.tenKhachHang ?? 'test mau tin ZNS',
                maHoaDon: element?.maHoaDon ?? '',
                ngayLapHoaDon: element?.ngayLapHoaDon ?? '',
                tongThanhToan: element?.tongThanhToan
            };
            const dataZalo = await ZaloService.DevMode_GuiTinNhanGiaoDich_ByTempId(
                zaloToken?.accessToken,
                idMauTinZalo,
                dataSend
            );
            if (dataZalo?.error !== 0) {
                countErr += 1;
            }
        }
        if (countErr === 0) {
            setObjAlert({ ...objAlert, mes: 'Gửi tin thành công', show: true });
            onOK(TypeAction.INSEART);
        }
        onOK(TypeAction.INSEART);
    };

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Dialog open={isShowModal} onClose={onClose} aria-labelledby="draggable-dialog-title" maxWidth="sm">
                <DialogTitle className="modal-title" id="draggable-dialog-title">
                    Gửi tin nhắn Zalo (qua SĐT)
                </DialogTitle>
                <DialogButtonClose onClose={onClose} />

                <DialogContent sx={{ overflow: 'unset', paddingTop: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                <img src={inforZOA?.avatar} height={40} width={40} />
                                <Typography variant="body2" fontWeight={600}>
                                    {inforZOA?.name}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid item xs={12}>
                            <SelectWithData
                                label="Loại tin"
                                data={AppConsts.smsLoaiTin}
                                idChosed={newSMS?.idLoaiTin}
                                handleChange={(item: ISelect) => {
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
                        {newSMS?.idLoaiTin !== LoaiTin.TIN_THUONG && (
                            <Grid item xs={12} sm={12} md={12} lg={12}>
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
                                </Stack>
                            </Grid>
                        )}

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Stack direction={'row'}>
                                <Zalo_MultipleAutoComplete_WithSDT {...data} />
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack>
                                <AutocompleteWithData
                                    label="Mẫu tin"
                                    idChosed={idMauTinZalo}
                                    lstData={allMauTinZNS?.map((x) => {
                                        return { id: x?.templateId.toString(), text1: x?.templateName, text2: '' };
                                    })}
                                    handleChoseItem={choseMauTinZNS}
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
                                        //setFieldValue('noiDungTin', e.target.value);
                                    }}
                                />
                            ) : (
                                <iframe
                                    src={itemMauTinZNS?.previewUrl}
                                    width={'100%'}
                                    height={'100%'}
                                    style={{ minHeight: '380px' }}
                                    name={itemMauTinZNS?.templateName}></iframe>
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
                            <Button
                                variant="contained"
                                sx={{ bgcolor: 'var(--color-main)!important' }}
                                type="submit"
                                className="btn-container-hover"
                                startIcon={<SendOutlinedIcon />}
                                onClick={GuiTinZalo}>
                                Gửi
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
