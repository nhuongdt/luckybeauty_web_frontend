import { Component, ReactNode } from 'react';
import { CreateOrUpdateNhanSuDto } from '../../../services/nhan-vien/dto/createOrUpdateNhanVienDto';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    Grid,
    Stack,
    TextField,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import closeIcon from '../../../images/close-square.svg';
import '../employee.css';
import { Form, Formik } from 'formik';
import nhanVienService from '../../../services/nhan-vien/nhanVienService';
import rules from './createOrEditNhanVien.validate';
import AppConsts from '../../../lib/appconst';
import { enqueueSnackbar } from 'notistack';
import useWindowWidth from '../../../components/StateWidth';
import AddIcon from '@mui/icons-material/Add';
import CreateOrEditChucVuModal from '../chuc-vu/components/create-or-edit-chuc-vu-modal';
import suggestStore from '../../../stores/suggestStore';
import { observer } from 'mobx-react';
import abpCustom from '../../../components/abp-custom';
import utils from '../../../utils/utils';
import uploadFileService from '../../../services/uploadFileService';
import { Guid } from 'guid-typescript';
import { SuggestChucVuDto } from '../../../services/suggests/dto/SuggestChucVuDto';
import PersonIcon from '@mui/icons-material/Person';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';
import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import { NumericFormat } from 'react-number-format';
export interface ICreateOrEditUserProps {
    visible: boolean;
    onCancel: () => void;
    title: string;
    onOk: () => void;
    formRef: CreateOrUpdateNhanSuDto;
}

class CreateOrEditEmployeeDialog extends Component<ICreateOrEditUserProps> {
    state = {
        avatarFile: '',
        chucVuVisiable: false,
        staffImage: '',
        googleDrive_fileId: '',
        fileImage: {} as File
    };

    onModalChucVu = () => {
        this.setState({
            chucVuVisiable: !this.state.chucVuVisiable
        });
    };

    UNSAFE_componentWillReceiveProps(nextProp: any): void {
        if (nextProp.formRef !== undefined) {
            const objUpdate = JSON.parse(JSON.stringify(nextProp.formRef));
            this.setState({
                staffImage: objUpdate?.avatar ?? '',
                googleDrive_fileId: uploadFileService.GoogleApi_GetFileIdfromLink(
                    objUpdate?.avatar ?? ''
                )
            });
        }
    }

    onSelectAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file: File = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                this.setState((prev) => ({
                    ...prev,
                    staffImage: reader.result?.toString() ?? '',
                    fileImage: file
                }));
            };
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
                staffImage: ''
            };
        });
    };
    render(): ReactNode {
        const { visible, onCancel, title, onOk, formRef } = this.props;
        const initValues: CreateOrUpdateNhanSuDto = formRef;

        return (
            <Dialog
                open={visible}
                onClose={onCancel}
                maxWidth="md"
                //className="poppup-them-nhan-vien"
                sx={{
                    borderRadius: '12px',
                    padding: '24px'
                }}>
                <Box
                    sx={{
                        position: 'sticky',
                        top: '0',
                        left: '0',
                        bgcolor: '#fff',
                        zIndex: '5',
                        paddingBottom: '8px'
                    }}>
                    <Typography
                        variant="h3"
                        fontSize="24px"
                        //color="#333233"
                        fontWeight="700"
                        paddingLeft="24px"
                        marginTop="28px">
                        {title}
                    </Typography>
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
                </Box>
                <Formik
                    initialValues={initValues}
                    validationSchema={rules}
                    onSubmit={async (values) => {
                        values.id = initValues.id;
                        let fileId = this.state.googleDrive_fileId;
                        const fileSelect = this.state.fileImage;
                        if (!utils.checkNull(this.state.staffImage)) {
                            if (this.state.staffImage !== formRef.avatar) {
                                fileId = await uploadFileService.GoogleApi_UploaFileToDrive(
                                    fileSelect,
                                    'NhanVien'
                                );
                            }
                        }
                        values.avatar =
                            fileId !== ''
                                ? `https://drive.google.com/uc?export=view&id=${fileId}`
                                : '';
                        const createOrEdit = await nhanVienService.createOrEdit(values);
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
                        onOk();
                    }}>
                    {({ isSubmitting, handleChange, errors, values, setFieldValue, touched }) => (
                        <Form
                            onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault(); // Prevent form submission
                                }
                            }}>
                            <Box
                                display="flex"
                                flexDirection={useWindowWidth() < 600 ? 'column' : 'row'}
                                justifyContent="space-between"
                                padding="0px 24px 0px 24px">
                                <Grid
                                    container
                                    className="form-container"
                                    spacing={2}
                                    rowSpacing={2}
                                    marginTop="0"
                                    marginLeft="0">
                                    <Grid item xs={12}>
                                        <Box>
                                            <Stack alignItems="center" position={'relative'}>
                                                {!utils.checkNull(this.state.staffImage) ? (
                                                    <Box
                                                        sx={{
                                                            position: 'relative'
                                                        }}>
                                                        <img
                                                            src={this.state.staffImage}
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
                                                    onChange={this.onSelectAvatarFile}
                                                />
                                            </Stack>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="tenNhanVien"
                                            size="small"
                                            value={values.tenNhanVien}
                                            label={
                                                <Typography
                                                    //color="#4C4B4C"
                                                    variant="subtitle2">
                                                    Họ và tên
                                                    <span className="text-danger">*</span>
                                                </Typography>
                                            }
                                            error={
                                                errors.tenNhanVien && touched.tenNhanVien
                                                    ? true
                                                    : false
                                            }
                                            helperText={
                                                errors.tenNhanVien &&
                                                touched.tenNhanVien && (
                                                    <small className="text-danger">
                                                        {errors.tenNhanVien}
                                                    </small>
                                                )
                                            }
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{
                                                fontSize: '16px'
                                            }}></TextField>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <NumericFormat
                                            name="soDienThoai"
                                            size="small"
                                            type="tel"
                                            label={
                                                <Typography
                                                    //color="#4C4B4C"
                                                    variant="subtitle2">
                                                    Số điện thoại
                                                </Typography>
                                            }
                                            fullWidth
                                            value={values.soDienThoai}
                                            error={
                                                errors.soDienThoai && touched.soDienThoai
                                                    ? true
                                                    : false
                                            }
                                            helperText={
                                                errors.soDienThoai &&
                                                touched.soDienThoai && (
                                                    <small className="text-danger">
                                                        {errors.soDienThoai}
                                                    </small>
                                                )
                                            }
                                            sx={{ fontSize: '13px' }}
                                            onChange={handleChange}
                                            customInput={TextField}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            size="small"
                                            type="text"
                                            name="diaChi"
                                            label={
                                                <Typography
                                                    //color="#4C4B4C"
                                                    variant="subtitle2">
                                                    Địa chỉ
                                                </Typography>
                                            }
                                            value={values.diaChi}
                                            onChange={handleChange}
                                            placeholder="Nhập địa chỉ của nhân viên"
                                            fullWidth
                                            sx={{ fontSize: '16px' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
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
                                            value={values.ngaySinh?.substring(0, 10)}
                                            onChange={handleChange}
                                            placeholder="21/04/2004"
                                            sx={{
                                                fontSize: '16px'
                                            }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1} direction={'row'}>
                                            <Stack
                                                className="modal-lable "
                                                justifyContent={'center'}
                                                alignItems={'center'}>
                                                <Typography
                                                    //color="#4C4B4C"
                                                    variant="subtitle2">
                                                    Giới tính
                                                </Typography>
                                            </Stack>
                                            <RadioGroup
                                                onChange={handleChange}
                                                row
                                                defaultValue={'true'}
                                                value={values.gioiTinh}
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="gioiTinh">
                                                <FormControlLabel
                                                    value={1}
                                                    control={<Radio />}
                                                    label="Nam"
                                                />
                                                <FormControlLabel
                                                    value={2}
                                                    control={<Radio />}
                                                    label="Nữ"
                                                />
                                                <FormControlLabel
                                                    value={0}
                                                    control={<Radio />}
                                                    label="Khác"
                                                />
                                            </RadioGroup>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box display={'flex'} flexDirection={'row'} gap={1}>
                                            <Autocomplete
                                                value={
                                                    suggestStore.suggestChucVu.filter(
                                                        (x) => x.idChucVu == values.idChucVu
                                                    )[0] ||
                                                    ({
                                                        idChucVu: '',
                                                        tenChucVu: ''
                                                    } as SuggestChucVuDto)
                                                }
                                                options={suggestStore.suggestChucVu}
                                                getOptionLabel={(option) => `${option.tenChucVu}`}
                                                fullWidth
                                                disablePortal
                                                onChange={(event, value) => {
                                                    setFieldValue(
                                                        'idChucVu',
                                                        value ? value.idChucVu : ''
                                                    ); // Cập nhật giá trị id trong Formik
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        label={
                                                            <Typography
                                                                //color="#4C4B4C"
                                                                variant="subtitle2">
                                                                Vị trí{' '}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </Typography>
                                                        }
                                                        error={
                                                            errors.idChucVu && touched.idChucVu
                                                                ? true
                                                                : false
                                                        }
                                                        helperText={
                                                            errors.idChucVu &&
                                                            touched.idChucVu && (
                                                                <small className="text-danger">
                                                                    {errors.idChucVu}
                                                                </small>
                                                            )
                                                        }
                                                        placeholder="Nhập tên vị trí"
                                                    />
                                                )}
                                            />
                                            <Button
                                                hidden={
                                                    !abpCustom.isGrandPermission(
                                                        'Pages.ChucVu.Create'
                                                    )
                                                }
                                                sx={{ maxHeight: '38px' }}
                                                onClick={this.onModalChucVu}
                                                variant="contained">
                                                <AddIcon />
                                            </Button>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            multiline
                                            size="small"
                                            label={
                                                <Typography
                                                    //color="#4C4B4C"
                                                    variant="subtitle2">
                                                    Ghi chú
                                                </Typography>
                                            }
                                            placeholder="Điền"
                                            name="ghiChu"
                                            value={values.ghiChu?.toString()}
                                            maxRows={4}
                                            minRows={4}
                                            style={{
                                                width: '100%',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box
                                sx={{
                                    position: 'sticky',
                                    bgcolor: '#fff',
                                    bottom: '0',
                                    display: 'flex',
                                    gap: '8px',
                                    padding: '8px 24px 8px 8px',

                                    right: '50px',
                                    justifyContent: 'end'
                                }}>
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
                            </Box>
                        </Form>
                    )}
                </Formik>
                <CreateOrEditChucVuModal
                    visiable={this.state.chucVuVisiable}
                    handleClose={this.onModalChucVu}
                />
            </Dialog>
        );
    }
}
export default observer(CreateOrEditEmployeeDialog);
