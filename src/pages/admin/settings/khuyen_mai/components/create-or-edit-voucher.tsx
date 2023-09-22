import {
    Autocomplete,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    IconButton,
    Button,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../../../../images/close-square.svg';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { format as formatDate } from 'date-fns';
import DatePickerRequiredCustom from '../../../../../components/DatetimePicker/DatePickerRequiredCustom';
import suggestStore from '../../../../../stores/suggestStore';
import { SuggestDichVuDto } from '../../../../../services/suggests/dto/SuggestDichVuDto';
import { observer } from 'mobx-react';
import { SuggestNhanVienDichVuDto } from '../../../../../services/suggests/dto/SuggestNhanVienDichVuDto';
const CreateOrEditVoucher: React.FC<{
    visiable: boolean;
    handleClose: () => void;
}> = ({ visiable, handleClose }: any) => {
    return (
        <Dialog open={visiable} maxWidth="md" fullWidth onClose={handleClose}>
            <DialogTitle>
                <Typography fontSize="24px" fontWeight={700}>
                    Thêm mới voucher
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        '&:hover': {
                            filter: ' brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                        }
                    }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{ id: '' }}
                    onSubmit={function (
                        values: FormikValues,
                        formikHelpers: FormikHelpers<FormikValues>
                    ): void | Promise<any> {
                        handleClose();
                    }}>
                    {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        value="start"
                                        control={<Switch color="success" />}
                                        label="Kích hoạt"
                                        labelPlacement="start"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        size="small"
                                        type="text"
                                        name="ten"
                                        label={<Typography variant="subtitle2">Tên</Typography>}
                                        //value={values.diaChi}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{ fontSize: '16px' }}></TextField>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        size="small"
                                        type="text"
                                        name="ma"
                                        label={<Typography variant="subtitle2">Mã</Typography>}
                                        //value={values.diaChi}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{ fontSize: '16px' }}></TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        size="small"
                                        type="text"
                                        name="giamGia"
                                        label={
                                            <Typography variant="subtitle2">Giảm giá</Typography>
                                        }
                                        //value={values.diaChi}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{ fontSize: '16px' }}></TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <DatePickerRequiredCustom
                                        props={{
                                            width: '100%',
                                            size: 'small',
                                            label: (
                                                <Typography variant="subtitle2">
                                                    Ngày áp dụng
                                                    <span className="text-danger"> *</span>
                                                </Typography>
                                            ),
                                            error:
                                                Boolean(errors.denNgay) && touched.denNgay
                                                    ? true
                                                    : false,
                                            helperText: Boolean(errors.denNgay) &&
                                                touched?.denNgay && (
                                                    <span className="text-danger">
                                                        {String(errors.denNgay)}
                                                    </span>
                                                )
                                        }}
                                        defaultVal={
                                            values.denNgay
                                                ? formatDate(new Date(values.denNgay), 'yyyy-MM-dd')
                                                : ''
                                        }
                                        handleChangeDate={(value: string) => {
                                            values.denNgay = value;
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <DatePickerRequiredCustom
                                        props={{
                                            width: '100%',
                                            size: 'small',
                                            label: (
                                                <Typography variant="subtitle2">
                                                    Ngày kết thúc
                                                    <span className="text-danger"> *</span>
                                                </Typography>
                                            ),
                                            error:
                                                Boolean(errors.denNgay) && touched.denNgay
                                                    ? true
                                                    : false,
                                            helperText: Boolean(errors.denNgay) &&
                                                touched?.denNgay && (
                                                    <span className="text-danger">
                                                        {String(errors.denNgay)}
                                                    </span>
                                                )
                                        }}
                                        defaultVal={
                                            values.denNgay
                                                ? formatDate(new Date(values.denNgay), 'yyyy-MM-dd')
                                                : ''
                                        }
                                        handleChangeDate={(value: string) => {
                                            values.denNgay = value;
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} sm={6} xs={12}>
                                    <FormGroup>
                                        <Autocomplete
                                            options={suggestStore?.suggestDichVu ?? []}
                                            getOptionLabel={(option) => `${option.tenDichVu}`}
                                            value={
                                                suggestStore.suggestDichVu?.filter(
                                                    (x) => x.id == values.idDonViQuiDoi
                                                )?.[0] ??
                                                ({
                                                    id: '',
                                                    donGia: 0,
                                                    tenDichVu: ''
                                                } as SuggestDichVuDto)
                                            }
                                            size="small"
                                            fullWidth
                                            disablePortal
                                            onChange={async (event, value) => {
                                                setFieldValue(
                                                    'idDonViQuiDoi',
                                                    value ? value.id : ''
                                                ); // Cập nhật giá trị id trong Formik

                                                await suggestStore.getSuggestKyThuatVienByIdDichVu(
                                                    value ? value.id : ''
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={
                                                        <Typography
                                                            variant="subtitle2"
                                                            fontSize="14px">
                                                            Dịch vụ{' '}
                                                            <span className="text-danger">*</span>
                                                        </Typography>
                                                    }
                                                    error={
                                                        errors.idDonViQuiDoi &&
                                                        touched.idDonViQuiDoi
                                                            ? true
                                                            : false
                                                    }
                                                    // helperText={
                                                    //     errors.idDonViQuiDoi &&
                                                    //     touched.idDonViQuiDoi && (
                                                    //         <small className="text-danger">
                                                    //             {errors.idDonViQuiDoi}
                                                    //         </small>
                                                    //     )
                                                    // }
                                                    placeholder="Nhập tên dịch vụ"
                                                />
                                            )}
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={6} sm={6} xs={12}>
                                    <FormGroup>
                                        <Autocomplete
                                            options={suggestStore?.suggestKyThuatVien ?? []}
                                            getOptionLabel={(option) => `${option.tenNhanVien}`}
                                            value={
                                                suggestStore.suggestKyThuatVien?.filter(
                                                    (x) => x.id == values.idNhanVien
                                                )?.[0] ??
                                                ({
                                                    id: '',
                                                    avatar: '',
                                                    chucVu: '',
                                                    soDienThoai: '',
                                                    tenNhanVien: ''
                                                } as SuggestNhanVienDichVuDto)
                                            }
                                            size="small"
                                            fullWidth
                                            disablePortal
                                            onChange={(event, value) => {
                                                setFieldValue('idNhanVien', value ? value.id : ''); // Cập nhật giá trị id trong Formik
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={
                                                        <Typography variant="body1" fontSize="14px">
                                                            Nhân viên
                                                        </Typography>
                                                    }
                                                    placeholder="Nhập tên nhân viên"
                                                />
                                            )}
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl component="fieldset" variant="standard">
                                        <FormLabel component="legend">Giới hạn sử dụng</FormLabel>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        //checked={gilad}
                                                        onChange={handleChange}
                                                        name="gilad"
                                                    />
                                                }
                                                label="Một lần cho mỗi khách hàng"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        //checked={jason}
                                                        onChange={handleChange}
                                                        name="jason"
                                                    />
                                                }
                                                label="Giới hạn tổng số lần sử dụng"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        //checked={antoine}
                                                        onChange={handleChange}
                                                        name="antoine"
                                                    />
                                                }
                                                label="Giới hạn số tiền mua tối thiểu"
                                            />
                                        </FormGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label={
                                            <Typography variant="subtitle2" fontSize="14px">
                                                Ghi chú
                                            </Typography>
                                        }
                                        fullWidth
                                        type="text"
                                        multiline
                                        rows={4}
                                        size="small"
                                        name="ghiChu"
                                        //value={values.ghiChu}
                                        onChange={handleChange}></TextField>
                                </Grid>
                            </Grid>
                            <DialogActions sx={{ paddingRight: '0!important' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleClose}
                                    sx={{
                                        fontSize: '14px',
                                        textTransform: 'unset',
                                        color: '#666466'
                                    }}
                                    className="btn-outline-hover">
                                    Hủy
                                </Button>
                                {!isSubmitting ? (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            color: '#fff',

                                            border: 'none'
                                        }}
                                        type="submit"
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
export default observer(CreateOrEditVoucher);
