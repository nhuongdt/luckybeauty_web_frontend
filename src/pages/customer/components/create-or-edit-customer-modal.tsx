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
    DialogContent,
    InputAdornment
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
import { fontSize, width } from '@mui/system';
import utils from '../../../utils/utils';
import uploadFileService from '../../../services/uploadFileService';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Close } from '@mui/icons-material';
import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import { NumericFormat } from 'react-number-format';

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
    }
    componentDidMount(): void {
        this.getSuggest();
    }
    UNSAFE_componentWillReceiveProps(nextProp: any): void {
        if (nextProp.formRef !== undefined) {
            const objUpdate = JSON.parse(JSON.stringify(nextProp.formRef));
            this.setState({
                cusImage: objUpdate?.avatar ?? '',
                googleDrive_fileId: uploadFileService.GoogleApi_GetFileIdfromLink(
                    objUpdate?.avatar ?? ''
                )
            });
        }
    }
    choseImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await this.closeImage();
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
            <Dialog open={visible} onClose={onCancel} maxWidth="sm" fullWidth>
                <DialogTitle className="modal-title">{title}</DialogTitle>
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
                        {({
                            isSubmitting,
                            setFieldValue,
                            values,
                            handleChange,
                            errors,
                            touched
                        }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Box
                                    sx={{
                                        '& .text-danger': {
                                            fontSize: '12px'
                                        }
                                    }}>
                                    <Grid container className="form-container" spacing={2}>
                                        <Grid item xs={12}>
                                            <Grid container justifyContent="flex-start">
                                                <Grid item xs={5}></Grid>
                                                <Grid item xs={2}>
                                                    <Stack
                                                        alignItems="center"
                                                        position={'relative'}>
                                                        {!utils.checkNull(this.state.cusImage) ? (
                                                            <Box
                                                                sx={{
                                                                    position: 'relative'
                                                                }}>
                                                                <img
                                                                    src={this.state.cusImage}
                                                                    className="user-image-upload"
                                                                />
                                                            </Box>
                                                        ) : (
                                                            <div>
                                                                <PersonIcon className="user-icon-upload" />
                                                            </div>
                                                        )}
                                                        <TextField
                                                            type="file"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                width: '100%',
                                                                height: '100%',
                                                                opacity: 0,
                                                                '& input': {
                                                                    height: '100%'
                                                                },
                                                                '& div': {
                                                                    height: '100%'
                                                                }
                                                            }}
                                                            onChange={this.choseImage}
                                                        />
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={5}></Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                size="small"
                                                name="tenKhachHang"
                                                autoFocus
                                                value={values.tenKhachHang}
                                                onChange={handleChange}
                                                label="Tên khách hàng *"
                                                helperText={
                                                    errors.tenKhachHang && touched.tenKhachHang ? (
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
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <NumericFormat
                                                name="soDienThoai"
                                                size="small"
                                                type="tel"
                                                label="Số điện thoại"
                                                fullWidth
                                                value={values.soDienThoai}
                                                helperText={
                                                    errors.soDienThoai && touched.soDienThoai ? (
                                                        <small className="text-danger">
                                                            Số điện thoại không hợp lệ
                                                        </small>
                                                    ) : null
                                                }
                                                sx={{ fontSize: '13px' }}
                                                onChange={handleChange}
                                                customInput={TextField}
                                            />
                                            {/* <TextField
                                                type="tel"
                                                size="small"
                                                name="soDienThoai"
                                                label=" Số điện thoại *"
                                                value={values.soDienThoai}
                                                onChange={handleChange}
                                                fullWidth
                                                helperText={
                                                    errors.soDienThoai && touched.soDienThoai ? (
                                                        <small className="text-danger">
                                                            Số điện thoại không hợp lệ
                                                        </small>
                                                    ) : null
                                                }
                                                sx={{ fontSize: '13px' }}></TextField> */}
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            {/* <DatePickerCustom
                                                props={{ width: '100%', label: 'Ngày sinh' }}
                                                defaultVal={values.ngaySinh}
                                                handleChangeDate={handleChange}
                                            /> */}
                                            <TextField
                                                size="small"
                                                type="date"
                                                fullWidth
                                                name="ngaySinh"
                                                label={
                                                    <Typography
                                                        //color="#4C4B4C"
                                                        variant="subtitle2">
                                                        Ngày sinh
                                                    </Typography>
                                                }
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                value={values.ngaySinh?.toString().substring(0, 10)}
                                                onChange={handleChange}
                                                sx={{
                                                    fontSize: '16px'
                                                }}></TextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                type="text"
                                                size="small"
                                                name="diaChi"
                                                label="Địa chỉ"
                                                value={values.diaChi}
                                                onChange={handleChange}
                                                fullWidth
                                                sx={{ fontSize: '16px' }}></TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Autocomplete
                                                value={
                                                    suggestStore.suggestNhomKhach !== undefined
                                                        ? suggestStore.suggestNhomKhach.filter(
                                                              (x) => x.id == values.idNhomKhach
                                                          )[0] || { id: '', tenNhomKhach: '' }
                                                        : { id: '', tenNhomKhach: '' }
                                                }
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
                                                        label="Nhóm khách"
                                                        // placeholder="Chọn nhóm khách"
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Autocomplete
                                                value={
                                                    suggestStore.suggestNguonKhach !== undefined
                                                        ? suggestStore.suggestNguonKhach.filter(
                                                              (x) => x.id == values.idNguonKhach
                                                          )[0] || { id: '', tenNguonKhach: '' }
                                                        : { id: '', tenNguonKhach: '' }
                                                }
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
                                                        label="Nguồn khách"
                                                        placeholder="Chọn nguồn khách"
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12}>
                                            <Stack spacing={2} direction={'row'}>
                                                <Stack
                                                    className="modal-lable "
                                                    justifyContent={'center'}
                                                    alignItems={'center'}>
                                                    Giới tính
                                                </Stack>
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
                                            <TextField
                                                fullWidth
                                                name="moTa"
                                                label="Ghi chú"
                                                value={values.moTa}
                                                onChange={handleChange}
                                                // rows={2}
                                                // maxRows={2}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack
                                                spacing={1}
                                                direction={'row'}
                                                justifyContent={'flex-end'}>
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
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                    <Button
                        onClick={onCancel}
                        sx={{
                            position: 'absolute',
                            top: '16px',
                            right: '24px',
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
