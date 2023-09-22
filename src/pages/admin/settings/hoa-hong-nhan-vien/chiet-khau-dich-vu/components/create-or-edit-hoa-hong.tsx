import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    Grid,
    RadioGroup,
    Radio,
    FormControlLabel,
    Checkbox,
    Select,
    Box,
    MenuItem,
    Autocomplete
} from '@mui/material';

import { ReactComponent as CloseIcon } from '../../../../../../images/close-square.svg';
import { Component, ReactNode } from 'react';
import { CreateOrEditChietKhauDichVuDto } from '../../../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/CreateOrEditChietKhauDichVuDto';
import { SuggestDonViQuiDoiDto } from '../../../../../../services/suggests/dto/SuggestDonViQuiDoi';
import { Form, Formik } from 'formik';
import Cookies from 'js-cookie';
import * as Yup from 'yup';
import chietKhauDichVuService from '../../../../../../services/hoa_hong/chiet_khau_dich_vu/chietKhauDichVuService';
import AppConsts from '../../../../../../lib/appconst';
import { enqueueSnackbar } from 'notistack';
import chietKhauDichVuStore from '../../../../../../stores/chietKhauDichVuStore';
import { observer } from 'mobx-react';
import suggestStore from '../../../../../../stores/suggestStore';
import { values } from 'lodash';
interface DialogProps {
    visited: boolean;
    title?: React.ReactNode;
    onClose: () => void;
    onSave: () => void;
    idNhanVien: string;
    formRef: CreateOrEditChietKhauDichVuDto;
}
class CreateOrEditChietKhauDichVuModal extends Component<DialogProps> {
    render(): ReactNode {
        const { title, onClose, onSave, visited } = this.props;
        const initialValues: CreateOrEditChietKhauDichVuDto = chietKhauDichVuStore.createOrEditDto;
        const rules = Yup.object().shape({
            idDonViQuiDoi: Yup.string().required('Dịch vụ là bắt buộc'),
            idNhanVien: Yup.string().required('Vui lòng chọn nhân viên'),
            loaiChietKhau: Yup.number().required('Vui lòng chọn loại chiết khấu'),
            giaTri: Yup.number()
                .required('Vui lòng nhập giá trị chiết khấu')
                .test('non-zero', 'Giá trị chiết khấu phải khác 0', function (value) {
                    return value !== 0;
                })
        });
        return (
            <Dialog open={visited} fullWidth maxWidth="md">
                <DialogTitle
                    sx={{
                        fontSize: '24px',
                        fontWeight: '700'
                    }}>
                    {onClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                '&:hover svg': {
                                    filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                                }
                            }}>
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={rules}
                        onSubmit={async (values) => {
                            values.id = values.id ?? AppConsts.guidEmpty;
                            values.idChiNhanh = Cookies.get('IdChiNhanh') ?? '';
                            const createOrEdit = await chietKhauDichVuService.CreateOrEdit(values);
                            enqueueSnackbar(createOrEdit.message, {
                                variant: createOrEdit.status,
                                autoHideDuration: 3000
                            });
                            await onSave();
                        }}>
                        {({ values, handleChange, errors, touched, setFieldValue }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Grid container spacing={4} rowSpacing={2}>
                                    <Grid item xs={12} sm={6} marginTop={2}>
                                        <Autocomplete
                                            options={suggestStore?.suggestNhanVien ?? []}
                                            getOptionLabel={(item) => item.tenNhanVien}
                                            value={
                                                suggestStore.suggestNhanVien?.find(
                                                    (item) => item.id === values?.idNhanVien
                                                ) || null
                                            }
                                            disabled={
                                                values.id === AppConsts.guidEmpty ? false : true
                                            }
                                            onChange={(event, newValue) => {
                                                handleChange({
                                                    target: {
                                                        name: 'idNhanVien',
                                                        value: newValue ? newValue.id : '' // Set the value to the selected item's id or an empty string if nothing is selected
                                                    }
                                                });
                                            }}
                                            fullWidth
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={
                                                        <Typography variant="subtitle2">
                                                            Nhân viên
                                                        </Typography>
                                                    }
                                                    error={
                                                        errors.idNhanVien && touched.idNhanVien
                                                            ? true
                                                            : false
                                                    }
                                                    size="small"
                                                    sx={{ fontSize: '16px', color: '#4c4b4c' }}
                                                />
                                            )}
                                        />
                                        {errors.idNhanVien && touched.idNhanVien && (
                                            <small className="text-danger">
                                                {errors.idNhanVien}
                                            </small>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6} marginTop={2}>
                                        <Autocomplete
                                            options={suggestStore?.suggestDichVu ?? []}
                                            getOptionLabel={(item) => item.tenDichVu}
                                            value={
                                                suggestStore.suggestDichVu?.find(
                                                    (item) => item.id === values?.idDonViQuiDoi
                                                ) || null
                                            }
                                            onChange={(event, newValue) => {
                                                handleChange({
                                                    target: {
                                                        name: 'idDonViQuiDoi',
                                                        value: newValue ? newValue.id : '' // Set the value to the selected item's id or an empty string if nothing is selected
                                                    }
                                                });
                                            }}
                                            fullWidth
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={
                                                        <Typography variant="subtitle2">
                                                            Dịch vụ
                                                        </Typography>
                                                    }
                                                    error={
                                                        errors.idDonViQuiDoi &&
                                                        touched.idDonViQuiDoi
                                                            ? true
                                                            : false
                                                    }
                                                    size="small"
                                                    sx={{ fontSize: '16px', color: '#4c4b4c' }}
                                                />
                                            )}
                                        />
                                        {errors.idDonViQuiDoi && touched.idDonViQuiDoi && (
                                            <small className="text-danger">
                                                {errors.idDonViQuiDoi}
                                            </small>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {/* <Typography variant="subtitle2">Loại chiết khấu</Typography> */}
                                        <RadioGroup
                                            value={values?.loaiChietKhau}
                                            defaultValue={values?.loaiChietKhau}
                                            title="Loại chiết khấu"
                                            name="loaiChietKhau"
                                            onChange={handleChange}
                                            sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <FormControlLabel
                                                value={1}
                                                control={<Radio />}
                                                label="Thực hiện"
                                            />
                                            <FormControlLabel
                                                value={2}
                                                control={<Radio />}
                                                label="Yêu cầu"
                                            />
                                            <FormControlLabel
                                                value={3}
                                                control={<Radio />}
                                                label="Tư vấn"
                                            />
                                        </RadioGroup>
                                        {errors.loaiChietKhau && touched.loaiChietKhau && (
                                            <small className="text-danger">
                                                {errors.loaiChietKhau}
                                            </small>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label={
                                                <Typography variant="subtitle2">Giá trị</Typography>
                                            }
                                            type="number"
                                            size="small"
                                            name="giaTri"
                                            value={values?.giaTri}
                                            error={errors.giaTri && touched.giaTri ? true : false}
                                            helperText={
                                                errors.giaTri &&
                                                touched.giaTri && (
                                                    <small className="text-danger">
                                                        {errors.giaTri}
                                                    </small>
                                                )
                                            }
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            label={'Là phần trăm'}
                                            value={values?.laPhanTram == true ? true : false}
                                            onChange={(e, checked) => {
                                                setFieldValue('laPhanTram', checked);
                                            }}
                                            name="laPhanTram"
                                            control={<Checkbox />}
                                        />
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ pr: '0!important' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: '8px',
                                            bottom: '24px',
                                            right: '50px'
                                        }}>
                                        <Button
                                            variant="outlined"
                                            onClick={onClose}
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#965C85',
                                                borderColor: '#965C85'
                                            }}
                                            className="btn-outline-hover">
                                            Hủy
                                        </Button>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#fff',
                                                backgroundColor: '#7C3367',
                                                border: 'none'
                                            }}
                                            className="btn-container-hover">
                                            Lưu
                                        </Button>
                                    </Box>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        );
    }
}
export default observer(CreateOrEditChietKhauDichVuModal);
