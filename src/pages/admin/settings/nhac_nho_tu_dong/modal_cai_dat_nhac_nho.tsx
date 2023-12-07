import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    Box,
    TextField,
    Typography,
    Stack,
    FormGroup,
    Checkbox
} from '@mui/material';
import { Form, Formik } from 'formik';
import AppConsts, { ISelect, LoaiTin, TypeAction, TimeType } from '../../../../lib/appconst';
import { IOSSwitch } from '../../../../components/Switch/IOSSwitch';
import { useEffect, useState, useMemo } from 'react';
import * as yup from 'yup';
import utils from '../../../../utils/utils';
import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';
import DialogButtonClose from '../../../../components/Dialog/ButtonClose';
import { Guid } from 'guid-typescript';
import SelectWithData from '../../../../components/Select/SelectWithData';
import { CaiDatNhacNhoDto } from '../../../../services/sms/cai_dat_nhac_nho/cai_dat_nhac_nho_dto';
import CaiDatNhacNhoService from '../../../../services/sms/cai_dat_nhac_nho/CaiDatNhacNhoService';
import AutocompleteWithData from '../../../../components/Autocomplete/AutocompleteWithData';
import { MauTinSMSDto } from '../../../../services/sms/mau_tin_sms/mau_tin_dto';
import { IDataAutocomplete } from '../../../../services/dto/IDataAutocomplete';
import { ExpandMoreOutlined } from '@mui/icons-material';

const ModalCaiDatNhacNho = ({ visiable, onCancel, lstMauTinSMS, idLoaiTin, idSetup, onOK }: any) => {
    const [objSetup, setObjSetup] = useState<CaiDatNhacNhoDto>(
        new CaiDatNhacNhoDto({ id: '', trangThai: 1, noiDungTin: '' })
    );
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [expandAction, setExpandAction] = useState(false);
    const [titleDialog, setTitleDialog] = useState('');

    useEffect(() => {
        if (visiable) {
            if (utils.checkNull(idSetup) || idSetup === Guid.EMPTY) {
                switch (idLoaiTin) {
                    case LoaiTin.TIN_SINH_NHAT:
                    case LoaiTin.TIN_GIAO_DICH:
                        {
                            setObjSetup(new CaiDatNhacNhoDto({ loaiThoiGian: TimeType.SECOND, idLoaiTin: idLoaiTin }));
                        }
                        break;
                    case LoaiTin.TIN_LICH_HEN:
                        {
                            setObjSetup(new CaiDatNhacNhoDto({ loaiThoiGian: TimeType.HOUR, idLoaiTin: idLoaiTin }));
                        }
                        break;
                }
            } else {
                GetInforCaiDatNhacNho_byId(idSetup);
            }
            switch (idLoaiTin) {
                case LoaiTin.TIN_SINH_NHAT:
                    {
                        setTitleDialog('Cài đặt chúc mừng sinh nhật');
                    }
                    break;
                case LoaiTin.TIN_LICH_HEN:
                    {
                        setTitleDialog('Cài đặt nhắc nhở cuộc hẹn');
                    }
                    break;
                case LoaiTin.TIN_GIAO_DICH:
                    {
                        setTitleDialog('Cài đặt thông báo giao dịch');
                    }
                    break;
            }
        }
    }, [visiable]);

    const GetInforCaiDatNhacNho_byId = async (idSetup: string) => {
        const data = await CaiDatNhacNhoService.GetInforCaiDatNhacNho_byId(idSetup);
        if (data != null) {
            setObjSetup({
                id: idSetup,
                idLoaiTin: idLoaiTin,
                idMauTin: data.idMauTin,
                nhacTruocKhoangThoiGian: data.nhacTruocKhoangThoiGian,
                loaiThoiGian: data.loaiThoiGian,
                noiDungTin: data.noiDungTin,
                trangThai: data.trangThai,
                noiDungXemTruoc: CaiDatNhacNhoService.ReplaceBienSMS(data.noiDungTin as string)
            });
        }
        return data;
    };

    const rules = yup.object().shape({
        noiDungTin: yup.string().required('Vui lòng nhập nội dung tin')
    });

    const saveCaiDatNhacNho = async (params: CaiDatNhacNhoDto) => {
        if (utils.checkNull(params.id) || params.id === Guid.EMPTY) {
            params.id = Guid.EMPTY;
            const data = await CaiDatNhacNhoService.CreateCaiDatNhacNho(params);
            params.id = data.id;
            onOK(params, TypeAction.INSEART);
            setObjAlert({ ...objAlert, show: true, mes: 'Thêm mới mẫu tin thành công' });
        } else {
            await CaiDatNhacNhoService.UpdateCaiDatNhacNho(params);
            onOK(params, TypeAction.UPDATE);
            setObjAlert({ ...objAlert, show: true, mes: 'Cập nhật mẫu tin thành công' });
        }
    };

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>

            <Dialog open={visiable} onClose={onCancel}>
                <DialogTitle>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography className="modal-title">{titleDialog}</Typography>
                        <DialogButtonClose onClose={onCancel}></DialogButtonClose>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ overflow: 'hidden' }}>
                    <Formik
                        enableReinitialize
                        initialValues={objSetup}
                        validationSchema={rules}
                        onSubmit={saveCaiDatNhacNho}>
                        {({ values, handleChange, errors, touched, isSubmitting, setFieldValue }) => (
                            <Form>
                                <Grid container spacing={2} paddingTop={1}>
                                    <Grid item xs={12}>
                                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                            <Typography variant="body2">Kích hoạt</Typography>
                                            <IOSSwitch
                                                sx={{ m: 1 }}
                                                value={values.trangThai}
                                                checked={values.trangThai == 1 ? true : false}
                                                onChange={() => {
                                                    const newVal = values.trangThai == 1 ? 0 : 1;
                                                    setFieldValue('trangThai', newVal);
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    {idLoaiTin === LoaiTin.TIN_LICH_HEN && (
                                        <Grid item xs={12}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={9}>
                                                    <TextField
                                                        name="nhacTruocKhoangThoiGian"
                                                        label="Gửi trước"
                                                        value={values?.nhacTruocKhoangThoiGian}
                                                        onChange={handleChange}
                                                        size="small"
                                                        fullWidth
                                                        helperText={
                                                            touched.nhacTruocKhoangThoiGian &&
                                                            errors.nhacTruocKhoangThoiGian && (
                                                                <span>{errors.nhacTruocKhoangThoiGian}</span>
                                                            )
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <SelectWithData
                                                        label="Loại thời gian"
                                                        data={AppConsts.ListTimeType}
                                                        idChosed={values.loaiThoiGian}
                                                        handleChange={(item: ISelect) => {
                                                            setFieldValue('loaiThoiGian', item.value);
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )}

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
                                                setFieldValue(
                                                    'noiDungXemTruoc',
                                                    CaiDatNhacNhoService.ReplaceBienSMS(item?.text2 as string)
                                                );
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="noiDungTin"
                                            multiline
                                            rows={3}
                                            label="Nội dung tin"
                                            value={values?.noiDungTin}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFieldValue('noiDungTin', value);
                                                setFieldValue(
                                                    'noiDungXemTruoc',
                                                    CaiDatNhacNhoService.ReplaceBienSMS(value)
                                                );
                                            }}
                                            size="small"
                                            fullWidth
                                            helperText={
                                                touched.noiDungTin &&
                                                errors.noiDungTin && <span>{errors.noiDungTin}</span>
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ position: 'relative' }}>
                                            <Button
                                                variant="contained"
                                                endIcon={<ExpandMoreOutlined />}
                                                onClick={() => setExpandAction(!expandAction)}>
                                                Chèn
                                            </Button>

                                            <Box
                                                sx={{
                                                    display: expandAction ? '' : 'none',
                                                    overflow: 'auto',
                                                    maxHeight: '180px',
                                                    position: 'absolute',
                                                    borderRadius: '4px',
                                                    border: '1px solid #cccc',
                                                    minWidth: 160,
                                                    backgroundColor: 'rgba(248,248,248,1)',
                                                    '& .MuiStack-root .MuiStack-root:hover': {
                                                        backgroundColor: '#cccc'
                                                    }
                                                }}>
                                                <Stack alignContent={'center'}>
                                                    {AppConsts.DanhSachBienSMS?.map((item: ISelect, index: number) => (
                                                        <Stack
                                                            direction={'row'}
                                                            key={index}
                                                            spacing={1}
                                                            padding={'6px'}
                                                            onClick={() => {
                                                                const content = values.noiDungTin?.concat(
                                                                    item.value.toString()
                                                                );
                                                                setFieldValue('noiDungTin', content);
                                                                setFieldValue(
                                                                    'noiDungXemTruoc',
                                                                    CaiDatNhacNhoService.ReplaceBienSMS(
                                                                        content as string
                                                                    )
                                                                );
                                                                setExpandAction(false);
                                                            }}>
                                                            <Typography variant="subtitle2" marginLeft={1}>
                                                                {item.text}
                                                            </Typography>
                                                        </Stack>
                                                    ))}
                                                </Stack>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack
                                            padding={2}
                                            spacing={2}
                                            sx={{ border: '1px dashed #ccc' }}
                                            alignItems={'center'}>
                                            <Typography fontSize={16} fontWeight={600} color={'#525F7A'}>
                                                Xem trước tin nhắn
                                            </Typography>
                                            <Stack
                                                sx={{
                                                    width: '100%',
                                                    backgroundColor: '#EEF0F4',
                                                    borderRadius: '4px',
                                                    alignItems: 'center'
                                                }}>
                                                <Typography fontSize={14} padding={1}>
                                                    {values?.noiDungXemTruoc}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ padding: '16px 0px 0px !important' }}>
                                    <Button
                                        onClick={onCancel}
                                        variant="outlined"
                                        sx={{
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            color: 'var(--color-main)'
                                        }}
                                        className="btn-outline-hover">
                                        Hủy
                                    </Button>
                                    {!isSubmitting ? (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#fff',

                                                border: 'none'
                                            }}
                                            className="btn-container-hover">
                                            Lưu
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#fff',

                                                border: 'none'
                                            }}
                                            className="btn-container-hover">
                                            Đang lưu
                                        </Button>
                                    )}
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default ModalCaiDatNhacNho;
