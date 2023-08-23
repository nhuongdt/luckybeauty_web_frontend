import { Component, ReactNode } from 'react';
import { CreateOrUpdateNhanSuDto } from '../../../services/nhan-vien/dto/createOrUpdateNhanVienDto';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    Grid,
    MenuItem,
    Select,
    Stack,
    TextField,
    TextareaAutosize,
    Typography,
    Link
} from '@mui/material';
import fileSmallIcon from '../../../images/fi_upload-cloud.svg';
import closeIcon from '../../../images/close-square.svg';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
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
import { Close } from '@mui/icons-material';
import uploadFileService from '../../../services/uploadFileService';
import { Guid } from 'guid-typescript';
import khachHangStore from '../../../stores/khachHangStore';
import nhanVienStore from '../../../stores/nhanVienStore';
import { SuggestChucVuDto } from '../../../services/suggests/dto/SuggestChucVuDto';
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
            console.log('objUpdate ', objUpdate);
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
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const avatar = {
                    fileBase64: reader.result?.toString().split(',')[1],
                    fileName: file.name,
                    fileType: file.type
                };
                this.props.formRef.avatarFile = avatar;
                this.setState({ avatarFile: reader.result?.toString() });
            };
        }
    };
    choseImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file: File = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.setState((prev) => {
                    return {
                        ...prev,
                        staffImage: reader.result?.toString() ?? ''
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
                className="poppup-them-nhan-vien"
                sx={{
                    borderRadius: '12px',

                    width: '100%',
                    padding: '28px 24px'
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
                        color="#333233"
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
                        values.tenNhanVien = values.ho + ' ' + values.tenLot;
                        let fileId = this.state.googleDrive_fileId;
                        const fileSelect = this.state.fileImage;
                        console.log(33, this.state.googleDrive_fileId);
                        if (!utils.checkNull(this.state.staffImage)) {
                            // nếu cập nhật: chỉ upload nếu chọn lại ảnh

                            if (
                                utils.checkNull(formRef.id) ||
                                formRef.id == Guid.EMPTY ||
                                (!utils.checkNull(formRef.id) &&
                                    !utils.checkNull(formRef.avatar) &&
                                    utils.checkNull(this.state.googleDrive_fileId)) ||
                                utils.checkNull(formRef.avatar)
                            ) {
                                // awlay insert: because image was delete before save
                                fileId = await uploadFileService.GoogleApi_UploaFileToDrive(
                                    fileSelect,
                                    'NhanVien'
                                );
                            }
                        }
                        // gán lại image theo id mới
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
                    {({ handleChange, errors, values, setFieldValue, touched }) => (
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
                                padding="12px 24px 0px 24px">
                                <Grid
                                    container
                                    className="form-container"
                                    spacing={2}
                                    width={useWindowWidth() > 600 ? '70%' : '100%'}
                                    paddingRight={useWindowWidth() > 600 ? '12px' : '0'}
                                    marginTop="0"
                                    marginLeft="0">
                                    <Grid item xs={12} md={6}>
                                        <Typography
                                            color="#4C4B4C"
                                            variant="subtitle2"
                                            paddingBottom={'4px'}>
                                            Họ nhân viên <span className="text-danger">*</span>
                                        </Typography>
                                        <TextField
                                            size="small"
                                            name="ho"
                                            value={values.ho}
                                            placeholder="Họ nhân viên"
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                        {errors.ho && touched.ho && (
                                            <small className="text-danger">{errors.ho}</small>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography
                                            color="#4C4B4C"
                                            variant="subtitle2"
                                            paddingBottom={'4px'}>
                                            Tên nhân viên <span className="text-danger">*</span>
                                        </Typography>
                                        <TextField
                                            size="small"
                                            name="tenLot"
                                            value={values.tenLot}
                                            placeholder="Tên nhân viên"
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                        {errors.tenLot && touched.tenLot && (
                                            <small className="text-danger">{errors.tenLot}</small>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography
                                            color="#4C4B4C"
                                            variant="subtitle2"
                                            paddingBottom={'4px'}>
                                            Số điện thoại <span className="text-danger">*</span>
                                        </Typography>
                                        <TextField
                                            type="tel"
                                            name="soDienThoai"
                                            value={values.soDienThoai}
                                            size="small"
                                            onChange={handleChange}
                                            placeholder="Số điện thoại"
                                            fullWidth
                                            sx={{ fontSize: '16px' }}></TextField>
                                        {errors.soDienThoai && touched.soDienThoai && (
                                            <small className="text-danger">
                                                {errors.soDienThoai}
                                            </small>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography
                                            color="#4C4B4C"
                                            variant="subtitle2"
                                            paddingBottom={'4px'}>
                                            Địa chỉ
                                        </Typography>
                                        <TextField
                                            type="text"
                                            size="small"
                                            name="diaChi"
                                            value={values.diaChi}
                                            onChange={handleChange}
                                            placeholder="Nhập địa chỉ của nhân viên"
                                            fullWidth
                                            sx={{ fontSize: '16px' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography
                                            color="#4C4B4C"
                                            variant="subtitle2"
                                            paddingBottom={'4px'}>
                                            Ngày sinh
                                        </Typography>
                                        <TextField
                                            type="date"
                                            fullWidth
                                            name="ngaySinh"
                                            value={values.ngaySinh?.substring(0, 10)}
                                            onChange={handleChange}
                                            placeholder="21/04/2004"
                                            sx={{ fontSize: '16px' }}
                                            size="small"></TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography
                                            color="#4C4B4C"
                                            variant="subtitle2"
                                            paddingBottom={'4px'}>
                                            Giới tính
                                        </Typography>
                                        <Select
                                            id="gender"
                                            size="small"
                                            fullWidth
                                            name="gioiTinh"
                                            value={values.gioiTinh}
                                            onChange={handleChange}
                                            defaultValue={0}
                                            sx={{
                                                backgroundColor: '#fff',
                                                padding: '0',
                                                fontSize: '16px',
                                                borderRadius: '8px',
                                                borderColor: '#E6E1E6'
                                            }}>
                                            <MenuItem value={0}>Lựa chọn</MenuItem>
                                            <MenuItem value={2}>Nữ</MenuItem>
                                            <MenuItem value={1}>Nam</MenuItem>
                                        </Select>
                                    </Grid>

                                    <Grid item container xs={12}>
                                        <Grid item xs={12}>
                                            <Typography
                                                color="#4C4B4C"
                                                variant="subtitle2"
                                                paddingBottom={'4px'}>
                                                Vị trí <span className="text-danger">*</span>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box display={'flex'} flexDirection={'row'} gap={1}>
                                                <Autocomplete
                                                    value={
                                                        suggestStore.suggestChucVu.filter(
                                                            (x) => x.idChucVu == values.idChucVu
                                                        )[0] ??
                                                        ({
                                                            idChucVu: '',
                                                            tenChucVu: ''
                                                        } as SuggestChucVuDto)
                                                    }
                                                    options={suggestStore.suggestChucVu}
                                                    getOptionLabel={(option) =>
                                                        `${option.tenChucVu}`
                                                    }
                                                    size="small"
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
                                                            placeholder="Nhập tên vị trí"
                                                        />
                                                    )}
                                                />
                                                <Button
                                                    onClick={this.onModalChucVu}
                                                    variant="contained">
                                                    <AddIcon />
                                                </Button>
                                            </Box>

                                            {errors.idChucVu && touched.idChucVu && (
                                                <small className="text-danger">
                                                    {errors.idChucVu}
                                                </small>
                                            )}
                                        </Grid>
                                        {/* <Grid
                                            item
                                            xs={1}
                                            hidden={
                                                !abpCustom.isGrandPermission('Pages.ChucVu.Create')
                                            }>
                                            <Button fullWidth onClick={this.onModalChucVu}>
                                                <AddBoxIcon
                                                    sx={{ width: '28px', height: '28px' }}
                                                />
                                            </Button>
                                        </Grid> */}
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography
                                            color="#4C4B4C"
                                            variant="subtitle2"
                                            paddingBottom={'4px'}>
                                            Ghi chú
                                        </Typography>
                                        <TextareaAutosize
                                            placeholder="Điền"
                                            name="ghiChu"
                                            value={values.ghiChu?.toString()}
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
                                <Grid
                                    container
                                    width={useWindowWidth() > 600 ? '30%' : '100%'}
                                    paddingLeft="12px">
                                    <Grid item xs={12}>
                                        <Box
                                            // display="grid"
                                            ml={{ xs: 0, sm: 4, md: 4, lg: 4 }}
                                            sx={{
                                                border: '1px solid var(--color-main)',
                                                p: 1,
                                                height: 200,
                                                textAlign: 'center',
                                                position: 'relative'
                                            }}>
                                            {!utils.checkNull(this.state.staffImage) ? (
                                                <Box sx={{ position: 'relative', height: '100%' }}>
                                                    {/* <img
                                                        src={this.state.staffImage}
                                                        style={{ width: '100%', height: '100%' }}
                                                    /> */}
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
                                                <>
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
                                                    <Stack spacing={1} paddingTop={2}>
                                                        <Box>
                                                            <InsertDriveFileIcon className="icon-size" />
                                                        </Box>

                                                        <Box>
                                                            <CloudDoneIcon
                                                                style={{
                                                                    paddingRight: '5px',
                                                                    color: 'var(--color-main)'
                                                                }}
                                                            />
                                                            <Link underline="always">
                                                                Tải ảnh lên
                                                            </Link>
                                                        </Box>
                                                        <Typography variant="caption">
                                                            File định dạng jpeg, png
                                                        </Typography>
                                                    </Stack>
                                                </>
                                            )}
                                        </Box>
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
