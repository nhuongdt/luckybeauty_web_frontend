import { Component, ReactNode } from 'react';
import { CreateOrEditCaLamViecDto } from '../../../../services/nhan-vien/ca_lam_viec/dto/createOrEditCaLamViecDto';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormGroup,
    FormLabel,
    Grid,
    TextField
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../../../images/close-square.svg';
import { Field, Form, Formik } from 'formik';
import caLamViecService from '../../../../services/nhan-vien/ca_lam_viec/caLamViecService';
import { enqueueSnackbar } from 'notistack';
import AppConsts from '../../../../lib/appconst';
interface CreateOrEditProps {
    visible: boolean;
    onCancel: () => void;
    title: React.ReactNode;
    createOrEditDto: CreateOrEditCaLamViecDto;
}
class CreateOrEditCaLamViecDialog extends Component<CreateOrEditProps> {
    render(): ReactNode {
        const { visible, onCancel, title, createOrEditDto } = this.props;
        const initValues = createOrEditDto;
        const handleSubmit = async (values: CreateOrEditCaLamViecDto) => {
            const createOrEdit = await caLamViecService.ceateOrEdit(values);
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
                    <Formik initialValues={initValues} onSubmit={handleSubmit}>
                        {({ values, handleChange }) => (
                            <Form>
                                <Field as={TextField} type="text" name="id" hidden />
                                <TextField
                                    className="mt-2"
                                    value={values.maCa}
                                    type="text"
                                    name="maCa"
                                    size="small"
                                    disabled
                                />
                                <FormGroup>
                                    <FormLabel>Tên ca</FormLabel>
                                    <TextField
                                        className="mt-2"
                                        value={values.tenCa}
                                        type="text"
                                        name="tenCa"
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
                                            <FormLabel>Bắt đầu ca</FormLabel>
                                            <TextField
                                                className="mt-2"
                                                type="time"
                                                size="small"
                                                name="gioVao"
                                                value={values.gioVao}
                                                onChange={handleChange}
                                                placeholder="Nhập từ ngày"
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormGroup>
                                            <FormLabel>Kết thúc ca</FormLabel>
                                            <TextField
                                                type="time"
                                                className="mt-2"
                                                size="small"
                                                name="gioRa"
                                                value={values.gioRa}
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
export default CreateOrEditCaLamViecDialog;
