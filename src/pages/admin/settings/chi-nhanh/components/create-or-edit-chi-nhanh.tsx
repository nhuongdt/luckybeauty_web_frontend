import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography,
    Box,
    FormControl,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { Component, ReactNode } from 'react';
import rules from './createOrEditChiNhanh.validate';
import { ReactComponent as CloseIcon } from '../../../../../images/close-square.svg';
import { CreateOrEditChiNhanhDto } from '../../../../../services/chi_nhanh/Dto/createOrEditChiNhanhDto';
import { Form, Formik } from 'formik';
import chiNhanhService from '../../../../../services/chi_nhanh/chiNhanhService';
import { string } from 'yup';
import AppConsts from '../../../../../lib/appconst';
interface ChiNhanhProps {
    isShow: boolean;
    onSave: () => void;
    onCLose: () => void;
    formRef: CreateOrEditChiNhanhDto;
    title: React.ReactNode;
}
class CreateOrEditChiNhanhModal extends Component<ChiNhanhProps> {
    render(): ReactNode {
        const { formRef, onSave, onCLose, title, isShow } = this.props;
        const initValues: CreateOrEditChiNhanhDto = formRef;
        return (
            <Dialog open={isShow} onClose={onCLose} fullWidth maxWidth={'md'}>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    {title}
                    <IconButton
                        aria-label="close"
                        onClick={onCLose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                            '&:hover svg': {
                                filter: ' brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Formik
                        initialValues={initValues}
                        validationSchema={rules}
                        onSubmit={async (values) => {
                            values.id = values.id == '' ? AppConsts.guidEmpty : values.id;
                            await chiNhanhService.CreateOrEdit(values);
                            onSave();
                        }}>
                        {({ handleChange, values, errors, touched, setFieldValue }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label={
                                                <Typography variant="subtitle2">
                                                    Mã chi nhánh
                                                </Typography>
                                            }
                                            size="small"
                                            name="maChiNhanh"
                                            placeholder="Nhập mã chi nhánh"
                                            value={values.maChiNhanh}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label={
                                                <Typography variant="subtitle2">
                                                    Tên chi nhánh
                                                </Typography>
                                            }
                                            error={
                                                errors.tenChiNhanh && touched.tenChiNhanh
                                                    ? true
                                                    : false
                                            }
                                            helperText={
                                                errors.tenChiNhanh &&
                                                touched.tenChiNhanh && (
                                                    <span className="text-danger">
                                                        {errors.tenChiNhanh}
                                                    </span>
                                                )
                                            }
                                            size="small"
                                            placeholder="Nhập tên chi nhánh"
                                            name="tenChiNhanh"
                                            value={values.tenChiNhanh}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label={
                                                <Typography variant="subtitle2">
                                                    Số điện thoại
                                                </Typography>
                                            }
                                            error={
                                                errors.soDienThoai && touched.soDienThoai
                                                    ? true
                                                    : false
                                            }
                                            helperText={
                                                errors.soDienThoai &&
                                                touched.soDienThoai && (
                                                    <span className="text-danger">
                                                        {errors.soDienThoai}
                                                    </span>
                                                )
                                            }
                                            size="small"
                                            name="soDienThoai"
                                            placeholder="Nhập số điện thoại"
                                            value={values.soDienThoai}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label={
                                                <Typography variant="subtitle2">Địa chỉ</Typography>
                                            }
                                            size="small"
                                            placeholder="Nhập địa chỉ"
                                            name="diaChi"
                                            value={values.diaChi}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label={
                                                <Typography variant="subtitle2">
                                                    Ngày áp dụng
                                                </Typography>
                                            }
                                            error={touched.ngayApDung && Boolean(errors.ngayApDung)}
                                            helperText={
                                                touched.ngayApDung &&
                                                Boolean(errors.ngayApDung) && (
                                                    <span className="text-danger">
                                                        {String(errors.ngayApDung)}
                                                    </span>
                                                )
                                            }
                                            size="small"
                                            type="date"
                                            name="ngayApDung"
                                            value={values.ngayApDung.toString().substring(0, 10)}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label={
                                                <Typography variant="subtitle2">
                                                    Ngày hết hạn
                                                </Typography>
                                            }
                                            error={touched.ngayHetHan && Boolean(errors.ngayHetHan)}
                                            helperText={
                                                touched.ngayHetHan &&
                                                Boolean(errors.ngayHetHan) && (
                                                    <span className="text-danger">
                                                        {String(errors.ngayHetHan)}
                                                    </span>
                                                )
                                            }
                                            size="small"
                                            type="date"
                                            name="ngayHetHan"
                                            value={values.ngayHetHan.toString().substring(0, 10)}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <FormControlLabel
                                                label="Trạng thái"
                                                onChange={(e, v) => {
                                                    setFieldValue('trangThai', v === true ? 1 : 0);
                                                }}
                                                value={values.trangThai === 1 ? true : false}
                                                checked={values.trangThai === 1 ? true : false}
                                                control={<Checkbox />}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={
                                                <Typography variant="subtitle2">Ghi chú</Typography>
                                            }
                                            size="small"
                                            rows={4}
                                            multiline
                                            placeholder="Ghi chú"
                                            name="ghiChu"
                                            value={values.ghiChu}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                </Grid>
                                <DialogActions
                                    sx={{
                                        paddingRight: '0!important',
                                        position: 'sticky',
                                        bottom: '0',
                                        left: '0',
                                        bgcolor: '#fff'
                                    }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: '8px',
                                            height: '32px',
                                            bottom: '24px',
                                            right: '50px'
                                        }}>
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: 'var(--color-main)'
                                            }}
                                            onClick={this.props.onCLose}
                                            className="btn-outline-hover">
                                            Hủy
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#fff'
                                            }}
                                            type="submit"
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
export default CreateOrEditChiNhanhModal;
