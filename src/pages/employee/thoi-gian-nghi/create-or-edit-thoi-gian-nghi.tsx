import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormGroup,
    FormLabel,
    Grid,
    TextField,
    Box,
    TextFieldProps
} from '@mui/material';
import { BsX } from 'react-icons/bs';
import { Formik, Form, Field } from 'formik';
import { CreateOrEditNgayNghiLeDto } from '../../../services/ngay_nghi_le/dto/createOrEditNgayNghiLe';
import ngayNghiLeService from '../../../services/ngay_nghi_le/ngayNghiLeService';
import { format } from 'date-fns';
import AppConsts from '../../../lib/appconst';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import { enqueueSnackbar } from 'notistack';
interface CreateOrEditProps {
    visible: boolean;
    onCancel: () => void;
    title: React.ReactNode;
    createOrEditDto: CreateOrEditNgayNghiLeDto;
}

class CreateOrEditThoiGianNghi extends React.Component<CreateOrEditProps> {
    render(): React.ReactNode {
        const { visible, onCancel, title, createOrEditDto } = this.props;

        const initialValues = {
            id: createOrEditDto.id,
            tenNgayLe: createOrEditDto.tenNgayLe,
            tuNgay: createOrEditDto.tuNgay,
            denNgay: createOrEditDto.denNgay
        };

        const handleSubmit = async (values: CreateOrEditNgayNghiLeDto) => {
            const createOrEdit = await ngayNghiLeService.createOrEdit(values);
            createOrEdit != null
                ? values.id === AppConsts.guidEmpty || values.id === ''
                    ? enqueueSnackbar('Thêm mới thành công', {
                          variant: 'success',
                          autoHideDuration: 3000
                      })
                    : enqueueSnackbar('Cập nhật thành công', {
                          variant: 'success',
                          autoHideDuration: 3000
                      })
                : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau', {
                      variant: 'error',
                      autoHideDuration: 3000
                  });
            onCancel();
        };

        return (
            <Dialog open={visible} onClose={onCancel} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <div className="row">
                        <Box className="col-8" sx={{ float: 'left' }}>
                            {title}
                        </Box>
                        <Box
                            className="col-4"
                            sx={{
                                float: 'right',
                                '& svg:hover': {
                                    filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                                }
                            }}>
                            <CloseIcon
                                style={{ float: 'right', height: '24px', cursor: 'pointer' }}
                                onClick={onCancel}
                            />
                        </Box>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                        {({ values, handleChange }) => (
                            <Form>
                                <Field as={TextField} type="text" name="id" hidden />
                                <FormGroup>
                                    <FormLabel>Tên ngày lễ</FormLabel>
                                    <TextField
                                        className="mt-2"
                                        value={values.tenNgayLe}
                                        type="text"
                                        name="tenNgayLe"
                                        size="small"
                                        onChange={handleChange}
                                        placeholder="Nhập tên ngày lễ"
                                    />
                                </FormGroup>
                                <Grid
                                    container
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                    className="mt-2">
                                    <Grid item xs={6}>
                                        <FormGroup>
                                            <FormLabel>Từ ngày</FormLabel>
                                            <TextField
                                                className="mt-2"
                                                type="date"
                                                size="small"
                                                name="tuNgay"
                                                value={values.tuNgay.toString().slice(0, 10)}
                                                onChange={handleChange}
                                                placeholder="Nhập từ ngày"
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormGroup>
                                            <FormLabel>Đến ngày</FormLabel>
                                            <TextField
                                                type="date"
                                                className="mt-2"
                                                size="small"
                                                name="denNgay"
                                                value={values.denNgay.toString().slice(0, 10)}
                                                onChange={handleChange}
                                                placeholder="Nhập từ ngày"
                                            />
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                                <DialogActions>
                                    <Button
                                        sx={{ bgcolor: '#7C3367!important' }}
                                        variant="contained"
                                        type="submit"
                                        className="btn-ok-dialog btn-container-hover">
                                        Lưu
                                    </Button>
                                    <Button
                                        sx={{
                                            color: '#965C85!important',
                                            bgcolor: '#fff!important'
                                        }}
                                        variant="outlined"
                                        type="button"
                                        onClick={onCancel}
                                        className="btn-cancel-dialog btn-outline-hover">
                                        Hủy
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        );
    }
}

export default CreateOrEditThoiGianNghi;
