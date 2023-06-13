import { Component, ReactNode } from 'react';
import { CreateOrEditKhachHangDto } from '../../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import {
    Box,
    Button,
    ButtonGroup,
    Grid,
    MenuItem,
    Select,
    TextField,
    TextareaAutosize,
    Typography
} from '@mui/material';

import fileIcon from '../../../images/file.svg';
import closeIcon from '../../../images/close-square.svg';
import fileSmallIcon from '../../../images/fi_upload-cloud.svg';
import React from 'react';
import { Form, Formik } from 'formik';
import rules from './create-or-edit-customer.validate';
import khachHangService from '../../../services/khach-hang/khachHangService';
export interface ICreateOrEditCustomerProps {
    visible: boolean;
    onCancel: () => void;
    title: string;
    onOk: () => void;
    formRef: CreateOrEditKhachHangDto;
}
class CreateOrEditCustomerDialog extends Component<ICreateOrEditCustomerProps> {
    render(): ReactNode {
        const { visible, onCancel, title, onOk, formRef } = this.props;
        const initValues: CreateOrEditKhachHangDto = formRef;
        console.log(formRef);
        return (
            <div className={visible ? 'show poppup-add' : 'poppup-add'}>
                <div className="poppup-title">{title}</div>
                <div className="poppup-des">Thông tin chi tiết</div>
                <Formik
                    initialValues={initValues}
                    validationSchema={rules}
                    onSubmit={async (values) => {
                        await khachHangService.createOrEdit(values);
                        onOk();
                    }}>
                    {({ handleChange, errors, values }) => (
                        <Form>
                            <Box className="form-add">
                                <Grid container className="form-container" spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            name="id"
                                            value={values.id}
                                            fullWidth
                                            hidden></TextField>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Họ và tên
                                        </Typography>
                                        <TextField
                                            size="small"
                                            placeholder="Họ và tên"
                                            name="tenKhachHang"
                                            value={values.tenKhachHang}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                        {errors.tenKhachHang && (
                                            <small className="text-danger">
                                                {errors.tenKhachHang}
                                            </small>
                                        )}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Số điện thoại
                                        </Typography>
                                        <TextField
                                            type="tel"
                                            size="small"
                                            name="soDienThoai"
                                            value={values.soDienThoai}
                                            onChange={handleChange}
                                            placeholder="Số điện thoại"
                                            fullWidth
                                            sx={{ fontSize: '16px' }}></TextField>
                                        {errors.soDienThoai && (
                                            <small className="text-danger">
                                                {errors.soDienThoai}
                                            </small>
                                        )}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Địa chỉ
                                        </Typography>
                                        <TextField
                                            type="text"
                                            size="small"
                                            placeholder="Nhập địa chỉ của khách hàng"
                                            name="diaChi"
                                            value={values.diaChi}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px' }}></TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Ngày sinh
                                        </Typography>
                                        <TextField
                                            type="date"
                                            fullWidth
                                            placeholder="21/04/2004"
                                            name="ngaySinh"
                                            value={
                                                values.ngaySinh != null
                                                    ? values.ngaySinh?.toString().substring(0, 10)
                                                    : ''
                                            }
                                            onChange={handleChange}
                                            sx={{ fontSize: '16px' }}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Giới tính
                                        </Typography>
                                        <Select
                                            id="gender"
                                            fullWidth
                                            value={values.gioiTinh ? 'true' : 'false'}
                                            name="gioiTinh"
                                            onChange={handleChange}
                                            sx={{
                                                height: '42px',
                                                backgroundColor: '#fff',
                                                padding: '0',
                                                fontSize: '16px',
                                                borderRadius: '8px',
                                                borderColor: '#E6E1E6'
                                            }}>
                                            <MenuItem value="">Lựa chọn</MenuItem>
                                            <MenuItem value="false">Nữ</MenuItem>
                                            <MenuItem value="true">Nam</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Ghi chú
                                        </Typography>
                                        <TextareaAutosize
                                            placeholder="Điền"
                                            name="moTa"
                                            value={values.moTa}
                                            onChange={handleChange}
                                            maxRows={4}
                                            minRows={4}
                                            style={{
                                                width: '100%',
                                                borderColor: '#E6E1E6',
                                                borderRadius: '8px',
                                                padding: '16px'
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container sx={{ width: '350px' }} className=" box-1">
                                    <Grid item xs={12} className="position-relative">
                                        <div className=" inner-box" style={{ textAlign: 'center' }}>
                                            <img src={fileIcon} />
                                            <TextField
                                                type="file"
                                                name="avatar"
                                                value={values.avatar}
                                                onChange={handleChange}
                                                id="input-file"
                                                sx={{
                                                    position: 'absolute',
                                                    top: '0',
                                                    left: '0',
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                            />
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    marginTop: '34px',
                                                    justifyContent: 'center'
                                                }}>
                                                <img src={fileSmallIcon} />
                                                <div>Tải ảnh lên</div>
                                            </div>
                                            <div style={{ color: '#999699', marginTop: '13px' }}>
                                                File định dạng{' '}
                                                <span style={{ color: '#333233' }}>jpeg, png</span>{' '}
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}></Grid>
                                    <Grid item xs={6}></Grid>
                                    <ButtonGroup
                                        sx={{
                                            height: '32px',
                                            position: 'absolute',
                                            bottom: '24px',
                                            right: '50px'
                                        }}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#fff',
                                                backgroundColor: '#B085A4',
                                                border: 'none'
                                            }}
                                            type="submit">
                                            Lưu
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={onCancel}
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#965C85',
                                                borderColor: '#965C85'
                                            }}>
                                            Hủy
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                            </Box>
                        </Form>
                    )}
                </Formik>

                <Button
                    onClick={onCancel}
                    sx={{
                        position: 'absolute',
                        top: '32px',
                        right: '28px',
                        padding: '0',
                        maxWidth: '24px',
                        minWidth: '0'
                    }}>
                    <img src={closeIcon} />
                </Button>
            </div>
        );
    }
}
export default CreateOrEditCustomerDialog;
