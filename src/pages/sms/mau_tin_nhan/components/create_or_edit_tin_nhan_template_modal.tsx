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
    Typography
} from '@mui/material';
import { Form, Formik } from 'formik';
import AppConsts from '../../../../lib/appconst';
import closeIcon from '../../../../images/close-square.svg';
const CreateOrEditMauTinNhanModal = ({ visiable, onCancel }: any) => {
    const initValues = {
        id: '',
        idLoaiTin: 1
    };
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
                        }}>
                        <img src={closeIcon} />
                    </Button>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initValues}
                    onSubmit={(values) => {
                        alert(JSON.stringify(values));
                    }}>
                    {({ values, handleChange, errors, touched, isSubmitting, setFieldValue }) => (
                        <Form>
                            <Grid container spacing={2}>
                                <FormControlLabel
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
                                        renderInput={(args) => <TextField {...args} size="small" label={'Loại tin'} />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="tenMauTin"
                                        label="Tiêu đề"
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
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
    );
};
export default CreateOrEditMauTinNhanModal;
