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
import AppConsts from '../../../lib/appconst';
import { enqueueSnackbar } from 'notistack';
export interface ICreateOrEditCustomerProps {
    visible: boolean;
    onCancel: () => void;
    title: string;
    onOk: () => void;
    handleChange: (event: any) => void;
    formRef: CreateOrEditKhachHangDto;
}
class CreateOrEditCustomerDialog extends Component<ICreateOrEditCustomerProps> {
    state = {
        errorPhoneNumber: false,
        errorTenKhach: false
    };
    render(): ReactNode {
        const { visible, onCancel, title, onOk, formRef, handleChange } = this.props;
        const initValues: CreateOrEditKhachHangDto = formRef;
        return (
            <div className={visible ? 'show poppup-add' : 'poppup-add'}>
                <div className="poppup-title">{title}</div>
                <div className="poppup-des">Thông tin chi tiết</div>
                <Formik
                    initialValues={initValues}
                    onSubmit={async (values) => {
                        const isValidPhoneNumber = AppConsts.phoneRegex.test(formRef.soDienThoai);
                        console.log(isValidPhoneNumber);
                        if (isValidPhoneNumber == false) {
                            this.setState({ errorPhoneNumber: true });
                        }
                        if (formRef.tenKhachHang === '' || formRef.tenKhachHang === null) {
                            this.setState({ errorTenKhach: true });
                        }
                        if (formRef.tenKhachHang && isValidPhoneNumber) {
                            const createOrEdit = await khachHangService.createOrEdit(formRef);
                            createOrEdit != null
                                ? formRef.id === AppConsts.guidEmpty
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
                            this.setState({ errorPhoneNumber: false, errorTenKhach: false });
                            onOk();
                        }
                    }}>
                    {() => (
                        <Form>
                            <Box
                                className="form-add"
                                sx={{
                                    '& .text-danger': {
                                        fontSize: '12px'
                                    }
                                }}>
                                <Grid container className="form-container" spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            name="id"
                                            value={formRef.id}
                                            fullWidth
                                            hidden></TextField>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Họ và tên
                                        </Typography>
                                        <TextField
                                            size="small"
                                            placeholder="Họ và tên"
                                            name="tenKhachHang"
                                            value={formRef.tenKhachHang}
                                            onChange={handleChange}
                                            helperText={
                                                this.state.errorTenKhach ? (
                                                    <small className="text-danger">
                                                        Tên khách hàng không được để trống
                                                    </small>
                                                ) : null
                                            }
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Số điện thoại
                                        </Typography>
                                        <TextField
                                            type="tel"
                                            size="small"
                                            name="soDienThoai"
                                            value={formRef.soDienThoai}
                                            onChange={handleChange}
                                            placeholder="Số điện thoại"
                                            fullWidth
                                            helperText={
                                                this.state.errorPhoneNumber ? (
                                                    <small className="text-danger">
                                                        Số điện thoại không hợp lệ
                                                    </small>
                                                ) : null
                                            }
                                            sx={{ fontSize: '16px' }}></TextField>
                                        <small className="text-danger"></small>
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
                                            value={formRef.diaChi}
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
                                                formRef.ngaySinh != null
                                                    ? formRef.ngaySinh?.toString().substring(0, 10)
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
                                            value={formRef.gioiTinh ? 'true' : 'false'}
                                            name="gioiTinh"
                                            onChange={handleChange}
                                            sx={{
                                                height: '42px',
                                                backgroundColor: '#fff',
                                                padding: '0',
                                                fontSize: '16px',
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
                                            value={formRef.moTa}
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
                                                value={formRef.avatar}
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
                                                backgroundColor: '#7C3367',
                                                border: 'none'
                                            }}
                                            type="submit"
                                            className="btn-container-hover">
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
                                            }}
                                            className="btn-outline-hover">
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
                        minWidth: '0',
                        '&:hover img': {
                            filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                        }
                    }}>
                    <img src={closeIcon} />
                </Button>
            </div>
        );
    }
}
export default CreateOrEditCustomerDialog;
