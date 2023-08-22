import { Component, ReactNode, useEffect } from 'react';
import { CreateOrEditKhachHangDto } from '../../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import {
    Autocomplete,
    Box,
    Button,
    Grid,
    TextField,
    TextareaAutosize,
    Typography,
    Dialog,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stack,
    DialogTitle,
    DialogContent
} from '@mui/material';
import useWindowWidth from '../../../components/StateWidth';
import fileIcon from '../../../images/file.svg';
import closeIcon from '../../../images/close-square.svg';
import fileSmallIcon from '../../../images/fi_upload-cloud.svg';
import React from 'react';
import { Form, Formik } from 'formik';
import khachHangService from '../../../services/khach-hang/khachHangService';
import AppConsts from '../../../lib/appconst';
import { enqueueSnackbar } from 'notistack';
import { observer } from 'mobx-react';
import suggestStore from '../../../stores/suggestStore';
import '../customerPage.css';
import rules from './create-or-edit-customer.validate';
import { fontSize } from '@mui/system';
import utils from '../../../utils/utils';
import uploadFileService from '../../../services/uploadFileService';
import { Close } from '@mui/icons-material';
export interface ICreateOrEditCustomerProps {
    visible: boolean;
    onCancel: () => void;
    title: string;
    onOk: ({ dataSave }: any) => void;
    formRef: CreateOrEditKhachHangDto;
}
class CreateOrEditCustomerDialog extends Component<ICreateOrEditCustomerProps> {
    state = {
        errorPhoneNumber: false,
        errorTenKhach: false,
        cusImage: '',
        googleDrive_fileId: '',
        fileImage: {} as File
    };
    async getSuggest() {
        await suggestStore.getSuggestNguonKhach();
        await suggestStore.getSuggestNhomKhach();
    }
    componentDidMount(): void {
        this.getSuggest();
    }
    UNSAFE_componentWillReceiveProps(nextProp: any): void {
        if (nextProp.formRef !== undefined) {
            const objUpdate = JSON.parse(JSON.stringify(nextProp.formRef));
            console.log('objUpdate ', objUpdate);
            this.setState({
                cusImage: objUpdate?.avatar ?? '',
                googleDrive_fileId: uploadFileService.GoogleApi_GetFileIdfromLink(
                    objUpdate?.avatar ?? ''
                )
            });
        }
    }
    choseImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file: File = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.setState((prev) => {
                    return {
                        ...prev,
                        cusImage: reader.result?.toString() ?? ''
                    };
                });
            };
            this.setState((prev) => {
                return {
                    ...prev,
                    fileImage: file
                };
            });
        }
    };
    closeImage = async () => {
        if (!utils.checkNull(this.state.googleDrive_fileId)) {
            await uploadFileService.GoogleApi_RemoveFile_byId(this.state.googleDrive_fileId);
        }
        this.setState((prev) => {
            return {
                ...prev,
                googleDrive_fileId: '',
                cusImage: ''
            };
        });
    };

    render(): ReactNode {
        const { visible, onCancel, title, onOk, formRef } = this.props;
        const initValues: CreateOrEditKhachHangDto = formRef;

        return (
            <Dialog open={visible} onClose={onCancel} maxWidth="md" fullWidth>
                <DialogTitle className="poppup-title">{title}</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initValues}
                        validationSchema={rules}
                        onSubmit={async (values) => {
                            let fileId = this.state.googleDrive_fileId;
                            const fileSelect = this.state.fileImage;
                            if (!utils.checkNull(this.state.cusImage)) {
                                // nếu cập nhật: chỉ upload nếu chọn lại ảnh
                                if (
                                    utils.checkNull(formRef.id) ||
                                    (!utils.checkNull(formRef.id) &&
                                        !utils.checkNull(formRef.avatar) &&
                                        utils.checkNull(this.state.googleDrive_fileId)) ||
                                    utils.checkNull(formRef.avatar)
                                ) {
                                    // awlay insert: because image was delete before save
                                    fileId = await uploadFileService.GoogleApi_UploaFileToDrive(
                                        fileSelect,
                                        'KhachHang'
                                    );
                                }
                            }
                            // gán lại image theo id mới
                            values.avatar =
                                fileId !== ''
                                    ? `https://drive.google.com/uc?export=view&id=${fileId}`
                                    : '';
                            const createOrEdit = await khachHangService.createOrEdit(values);

                            createOrEdit != null
                                ? values.id === AppConsts.guidEmpty
                                    ? enqueueSnackbar('Thêm mới thành công', {
                                          variant: 'success',
                                          autoHideDuration: 3000
                                      })
                                    : enqueueSnackbar('Cập nhật thành công', {
                                          variant: 'success',
                                          autoHideDuration: 3000
                                      })
                                : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau', {
                                      variant: 'error',
                                      autoHideDuration: 3000
                                  });
                            this.setState({ errorPhoneNumber: false, errorTenKhach: false });
                            onOk(createOrEdit);
                        }}>
                        {({ setFieldValue, values, handleChange, errors, touched }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Box
                                    className="form-add"
                                    sx={{
                                        '& .text-danger': {
                                            fontSize: '12px'
                                        }
                                    }}>
                                    <Grid container className="form-container" spacing={2}>
                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <Typography className="modal-lable ">
                                                    Họ và tên <span className="text-danger">*</span>
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    name="tenKhachHang"
                                                    value={values.tenKhachHang}
                                                    onChange={handleChange}
                                                    helperText={
                                                        errors.tenKhachHang &&
                                                        touched.tenKhachHang ? (
                                                            <small className="text-danger">
                                                                Tên khách hàng không được để trống
                                                            </small>
                                                        ) : null
                                                    }
                                                    fullWidth
                                                    sx={{
                                                        fontSize: '16px',
                                                        color: '#4c4b4c'
                                                    }}></TextField>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography className="modal-lable ">
                                                    Số điện thoại{' '}
                                                    <span className="text-danger">*</span>
                                                </Typography>
                                                <TextField
                                                    type="tel"
                                                    size="small"
                                                    name="soDienThoai"
                                                    value={values.soDienThoai}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    helperText={
                                                        errors.soDienThoai &&
                                                        touched.soDienThoai ? (
                                                            <small className="text-danger">
                                                                Số điện thoại không hợp lệ
                                                            </small>
                                                        ) : null
                                                    }
                                                    sx={{ fontSize: '13px' }}></TextField>
                                            </Stack>
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <Stack spacing={1}>
                                                <Typography className="modal-lable ">
                                                    Địa chỉ
                                                </Typography>
                                                <TextField
                                                    type="text"
                                                    size="small"
                                                    name="diaChi"
                                                    value={values.diaChi}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    sx={{ fontSize: '16px' }}></TextField>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography className="modal-lable ">
                                                    Ngày sinh
                                                </Typography>
                                                <TextField
                                                    type="date"
                                                    fullWidth
                                                    placeholder="21/04/2004"
                                                    name="ngaySinh"
                                                    value={
                                                        values.ngaySinh != null
                                                            ? values.ngaySinh
                                                                  ?.toString()
                                                                  .substring(0, 10)
                                                            : ''
                                                    }
                                                    onChange={handleChange}
                                                    sx={{ fontSize: '16px' }}
                                                    size="small"
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography className="modal-lable ">
                                                    Nhóm khách
                                                </Typography>
                                                <Autocomplete
                                                    options={suggestStore.suggestNhomKhach}
                                                    getOptionLabel={(option) =>
                                                        `${option.tenNhomKhach}`
                                                    }
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'idNhomKhach',
                                                            value ? value.id : undefined
                                                        );
                                                        // Cập nhật giá trị id trong Formik
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Chọn nhóm khách"
                                                        />
                                                    )}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography className="modal-lable ">
                                                    Nguồn khách
                                                </Typography>
                                                <Autocomplete
                                                    options={suggestStore.suggestNguonKhach}
                                                    getOptionLabel={(option) =>
                                                        `${option.tenNguonKhach}`
                                                    }
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'idNguonKhach',
                                                            value ? value.id : undefined
                                                        ); // Cập nhật giá trị id trong Formik
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Chọn nguồn khách"
                                                        />
                                                    )}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography className="modal-lable ">
                                                    Giới tính
                                                </Typography>
                                                <RadioGroup
                                                    onChange={handleChange}
                                                    row
                                                    defaultValue={'true'}
                                                    value={values.gioiTinh}
                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                    name="gioiTinh">
                                                    <FormControlLabel
                                                        value="true"
                                                        control={<Radio />}
                                                        label="Nam"
                                                    />
                                                    <FormControlLabel
                                                        value="false"
                                                        control={<Radio />}
                                                        label="Nữ"
                                                    />
                                                    <FormControlLabel
                                                        value=""
                                                        control={<Radio />}
                                                        label="Khác"
                                                    />
                                                </RadioGroup>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <Typography className="modal-lable ">
                                                    Ghi chú
                                                </Typography>
                                                <TextareaAutosize
                                                    name="moTa"
                                                    value={values.moTa}
                                                    onChange={handleChange}
                                                    maxRows={4}
                                                    minRows={4}
                                                    style={{
                                                        width: '100%',
                                                        borderColor: '#E6E1E6',
                                                        borderRadius: '8px',
                                                        padding: '16px',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        sx={{ width: useWindowWidth() > 600 ? '350px' : '100%' }}
                                        className=" box-1">
                                        <Grid item xs={12} className="position-relative">
                                            {!utils.checkNull(this.state.cusImage) ? (
                                                <Box sx={{ position: 'relative', height: '100%' }}>
                                                    <img
                                                        src={this.state.cusImage}
                                                        style={{ width: '100%', height: '100%' }}
                                                    />
                                                    <Close
                                                        onClick={this.closeImage}
                                                        sx={{
                                                            left: 0,
                                                            color: 'red',
                                                            position: 'absolute'
                                                        }}
                                                    />
                                                </Box>
                                            ) : (
                                                <div
                                                    className=" inner-box"
                                                    style={{ textAlign: 'center' }}>
                                                    <img src={fileIcon} />
                                                    <TextField
                                                        type="file"
                                                        name="avatar"
                                                        onChange={this.choseImage}
                                                        id="input-file"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '0',
                                                            left: '0',
                                                            width: '100%',
                                                            height: '100%'
                                                        }}
                                                    />
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            marginTop: '34px',
                                                            fontSize: '12px',
                                                            justifyContent: 'center',
                                                            '& img': {
                                                                filter: 'var(--color-hoverIcon)'
                                                            }
                                                        }}>
                                                        <img src={fileSmallIcon} />
                                                        <div>Tải ảnh lên</div>
                                                    </Box>
                                                    <div
                                                        style={{
                                                            marginTop: '12px',
                                                            fontSize: '12px'
                                                        }}>
                                                        File định dạng{' '}
                                                        <span style={{ color: '#333233' }}>
                                                            jpeg, png
                                                        </span>{' '}
                                                    </div>
                                                </div>
                                            )}
                                        </Grid>
                                        <Grid item xs={6}></Grid>
                                        <Grid item xs={6}></Grid>
                                    </Grid>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: '8px',
                                        padding: '8px',
                                        justifyContent: 'end',
                                        marginTop: useWindowWidth() > 600 ? '0' : '24px',
                                        bgcolor: '#fff',
                                        position: useWindowWidth() > 600 ? 'static' : 'sticky',
                                        bottom: '0',
                                        left: '0'
                                    }}>
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
                                    <Button
                                        variant="outlined"
                                        onClick={onCancel}
                                        sx={{
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            color: '#666466'
                                        }}
                                        className="btn-outline-hover">
                                        Hủy
                                    </Button>
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
                </DialogContent>
            </Dialog>
        );
    }
}
export default observer(CreateOrEditCustomerDialog);
