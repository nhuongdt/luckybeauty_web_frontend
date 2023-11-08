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
    Switch,
    Box,
    TextField,
    Typography,
    Stack
} from '@mui/material';
import { Form, Formik } from 'formik';
import AppConsts, { TypeAction } from '../../../../lib/appconst';
import closeIcon from '../../../../images/close-square.svg';
import { IOSSwitch } from '../../../../components/Switch/IOSSwitch';
import { useEffect, useState } from 'react';
import { MauTinSMSDto } from '../../../../services/sms/mau_tin_sms/mau_tin_dto';
import * as yup from 'yup';
import MauTinSMService from '../../../../services/sms/mau_tin_sms/MauTinSMService';
import utils from '../../../../utils/utils';
import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';
import DialogButtonClose from '../../../../components/Dialog/ButtonClose';
import { Guid } from 'guid-typescript';

const ModalSmsTemplate = ({ visiable, onCancel, idMauTin, objMauTinOld, onOK }: any) => {
    const [objMauTin, setObjMauTin] = useState<MauTinSMSDto>(new MauTinSMSDto({ id: '', trangThai: 1 }));
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    useEffect(() => {
        if (visiable) {
            if (utils.checkNull(idMauTin)) {
                setObjMauTin(new MauTinSMSDto({}));
            } else {
                setObjMauTin(new MauTinSMSDto(objMauTinOld));
            }
        }
    }, [visiable]);

    const rules = yup.object().shape({
        tenMauTin: yup.string().required('Vui lòng nhập tên mẫu tin'),
        noiDungTinMau: yup.string().required('Vui lòng nhập nội dung mẫu tin')
    });

    const saveMauTin = async (params: MauTinSMSDto) => {
        if (utils.checkNull(params.id)) {
            params.id = Guid.EMPTY;
        }

        const data = await MauTinSMService.CreateMauTinSMS(params);
        params.id = data.id;
        onOK(params, TypeAction.INSEART);
        setObjAlert({ ...objAlert, show: true, mes: 'Thêm mới mẫu tin thành công' });
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
                        <Typography className="modal-title">Thêm mẫu tin mới</Typography>
                        <DialogButtonClose onClose={onCancel}></DialogButtonClose>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Formik initialValues={objMauTin} validationSchema={rules} onSubmit={saveMauTin}>
                        {({ values, handleChange, errors, touched, isSubmitting, setFieldValue }) => (
                            <Form>
                                <Grid container spacing={2} paddingTop={1}>
                                    {/* <FormControlLabel
                                    sx={{ padding: '16px 16px 0px 16px' }}
                                    control={<Switch />}
                                    label="Kích hoạt"
                                /> */}
                                    <Grid item xs={12}>
                                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                            <Typography variant="body2">Là mẫu mặc định</Typography>
                                            <IOSSwitch
                                                sx={{ m: 1 }}
                                                value={values.laMacDinh}
                                                checked={values.laMacDinh}
                                                onChange={() => {
                                                    setFieldValue('trangThai', !values.laMacDinh);
                                                }}
                                            />
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Autocomplete
                                            fullWidth
                                            options={AppConsts.loaiTinNhan}
                                            getOptionLabel={(options) => options.name}
                                            defaultValue={AppConsts.loaiTinNhan[0]}
                                            value={AppConsts.loaiTinNhan.find((x) => x.value == values.idLoaiTin)}
                                            onChange={(event, option) => {
                                                setFieldValue('idLoaiTin', option?.value);
                                            }}
                                            renderInput={(args) => (
                                                <TextField {...args} size="small" label={'Loại tin'} />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="tenMauTin"
                                            label="Tiêu đề"
                                            onChange={handleChange}
                                            size="small"
                                            fullWidth
                                            helperText={
                                                touched.tenMauTin && errors.tenMauTin && <span>{errors.tenMauTin}</span>
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="noiDungTinMau"
                                            label="Nội dung"
                                            size="small"
                                            fullWidth
                                            onChange={handleChange}
                                            multiline
                                            minRows={3}
                                            maxRows={4}
                                            helperText={
                                                touched.noiDungTinMau &&
                                                errors.noiDungTinMau && <span>{errors.noiDungTinMau}</span>
                                            }
                                        />
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
export default ModalSmsTemplate;
