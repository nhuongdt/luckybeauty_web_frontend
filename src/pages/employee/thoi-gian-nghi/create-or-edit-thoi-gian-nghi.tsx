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
    TextFieldProps
} from '@mui/material';
import { BsX } from 'react-icons/bs';
import { Formik, Form, Field } from 'formik';
import { CreateOrEditNgayNghiLeDto } from '../../../services/ngay_nghi_le/dto/createOrEditNgayNghiLe';
import ngayNghiLeService from '../../../services/ngay_nghi_le/ngayNghiLeService';
import { format } from 'date-fns';
import AppConsts from '../../../lib/appconst';

interface CreateOrEditProps {
    visible: boolean;
    onOk: () => void;
    onCancel: () => void;
    title: React.ReactNode;
    createOrEditDto: CreateOrEditNgayNghiLeDto;
}

class CreateOrEditThoiGianNghi extends React.Component<CreateOrEditProps> {
    render(): React.ReactNode {
        const { visible, onOk, onCancel, title, createOrEditDto } = this.props;

        const initialValues = {
            id: createOrEditDto.id === '' ? AppConsts.guidEmpty : createOrEditDto.id,
            tenNgayLe: createOrEditDto.tenNgayLe,
            tuNgay: createOrEditDto.tuNgay,
            denNgay: createOrEditDto.denNgay
        };

        const handleSubmit = async (values: CreateOrEditNgayNghiLeDto) => {
            await ngayNghiLeService.createOrEdit(values);
            onCancel();
        };

        return (
            <Dialog open={visible} onClose={onCancel} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <div className="row">
                        <div className="col-8" style={{ float: 'left' }}>
                            {title}
                        </div>
                        <div className="col-4" style={{ float: 'right' }}>
                            <BsX
                                style={{ float: 'right', height: '24px', cursor: 'pointer' }}
                                onClick={onCancel}
                            />
                        </div>
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
                                    <Button type="submit" className="btn-ok-dialog">
                                        Lưu
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={onCancel}
                                        className="btn-cancel-dialog">
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
