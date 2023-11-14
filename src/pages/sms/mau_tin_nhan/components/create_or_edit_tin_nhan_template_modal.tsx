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
    Checkbox
} from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import AppConsts from '../../../../lib/appconst';
import { CreateOrEditSMSTemplateDto } from '../../../../services/sms/template/dto/CreateOrEditSMSTemplateDto';
import smsTemplateService from '../../../../services/sms/template/smsTemplateService';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
const CreateOrEditMauTinNhanModal = ({ visiable, onCancel, formRef, onOk }: any) => {
    const initValues = formRef as CreateOrEditSMSTemplateDto;
    const rules = Yup.object().shape({
        idLoaiTin: Yup.number().required('Loại tin không được để trống'),
        tenMauTin: Yup.string().required('Tên mẫu tin không được để trống'),
        noiDungTinMau: Yup.string().required('Nội dung mẫu tin không được để trống')
    });
    return (
        <Dialog open={visiable} onClose={onCancel}>
            <DialogTitle sx={{ borderBottom: '1px solid #F0F0F0' }}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>Thêm mẫu tin mới</Typography>
                    <Button
                        onClick={onCancel}
                        sx={{
                            maxWidth: '24px',
                            minWidth: '0',
                            '&:hover img': {
                                filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                            }
                        }}></Button>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Formik
                    enableReinitialize
                    initialValues={initValues}
                    validationSchema={rules}
                    onSubmit={async (values) => {
                        const result = await smsTemplateService.createOrEdit(values);
                        enqueueSnackbar(result.message, {
                            variant: result.status,
                            autoHideDuration: 3000
                        });
                        onOk();
                    }}>
                    {({ values, handleChange, errors, touched, isSubmitting, setFieldValue }) => (
                        <Form>
                            <Grid container spacing={2}>
                                <FormControlLabel
                                    checked={values.trangThai == 1 ? true : false}
                                    sx={{ padding: '16px 16px 0px 16px' }}
                                    control={<Switch />}
                                    label="Kích hoạt"
                                />
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
                                            <TextField
                                                {...args}
                                                size="small"
                                                label={'Loại tin'}
                                                error={errors.idLoaiTin && touched.idLoaiTin ? true : false}
                                                helperText={
                                                    errors.idLoaiTin &&
                                                    touched.idLoaiTin && (
                                                        <span className="text-danger">{errors.idLoaiTin}</span>
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="tenMauTin"
                                        label="Tiêu đề"
                                        value={values.tenMauTin}
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
                                        error={errors.tenMauTin && touched.idLoaiTin ? true : false}
                                        helperText={
                                            errors.tenMauTin &&
                                            touched.tenMauTin && <span className="text-danger">{errors.tenMauTin}</span>
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="noiDungTinMau"
                                        label="Nội dung"
                                        value={values.noiDungTinMau}
                                        size="small"
                                        fullWidth
                                        onChange={handleChange}
                                        multiline
                                        minRows={3}
                                        maxRows={5}
                                        error={errors.noiDungTinMau && touched.noiDungTinMau ? true : false}
                                        helperText={
                                            errors.noiDungTinMau &&
                                            touched.noiDungTinMau && (
                                                <span className="text-danger">{errors.noiDungTinMau}</span>
                                            )
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <Box>
                                <FormControlLabel
                                    label="Mẫu mặc định"
                                    checked={values.laMacDinh}
                                    onChange={(event, value) => {
                                        setFieldValue('isDefault', value);
                                    }}
                                    control={<Checkbox />}
                                />
                            </Box>
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
    );
};
export default CreateOrEditMauTinNhanModal;
