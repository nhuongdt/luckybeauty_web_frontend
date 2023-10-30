import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import { Formik, Form } from 'formik';
import AppConsts from '../../../lib/appconst';
import closeIcon from '../../../images/close-square.svg';
const CreateOrEditTinNhanModal = ({ visiable, onCancel }: any) => {
    const initValues = {
        id: '',
        idLoaiTin: 1
    };
    return (
        <Dialog open={visiable} onClose={onCancel}>
            <DialogTitle sx={{ borderBottom: '1px solid #F0F0F0' }}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>Thêm mới SMS</Typography>
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
                            <Grid container spacing={2} paddingTop={2}>
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
                                        label="Gửi đến"
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
                                    />
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
                                        renderInput={(args) => <TextField {...args} size="small" label={'Mẫu tin'} />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="noiDungTinMau"
                                        label="Nội dung"
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
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

export default CreateOrEditTinNhanModal;
