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
    Checkbox,
    Stack
} from '@mui/material';
import { Component, ReactNode } from 'react';
import rules from './createOrEditChiNhanh.validate';
import { ReactComponent as CloseIcon } from '../../../../../images/close-square.svg';
import { CreateOrEditChiNhanhDto } from '../../../../../services/chi_nhanh/Dto/createOrEditChiNhanhDto';
import { Form, Formik } from 'formik';
import chiNhanhService from '../../../../../services/chi_nhanh/chiNhanhService';
import AddLogoIcon from '../../../../../images/add-logo.svg';
import AppConsts from '../../../../../lib/appconst';
import uploadFileService from '../../../../../services/uploadFileService';
import utils from '../../../../../utils/utils';
import { NumericFormat } from 'react-number-format';
import { format as formatDate } from 'date-fns';
import Cookies from 'js-cookie';
import DatePickerRequiredCustom from '../../../../../components/DatetimePicker/DatePickerRequiredCustom';
interface ChiNhanhProps {
    isShow: boolean;
    onSave: () => void;
    onCLose: () => void;
    formRef: CreateOrEditChiNhanhDto;
    title: React.ReactNode;
}
class CreateOrEditChiNhanhModal extends Component<ChiNhanhProps> {
    state = {
        branchLogo: '',
        googleDrive_fileId: '',
        fileImage: {} as File
    };
    UNSAFE_componentWillReceiveProps(nextProp: any): void {
        if (nextProp.formRef !== undefined) {
            const objUpdate = JSON.parse(JSON.stringify(nextProp.formRef));
            this.setState({
                branchLogo: objUpdate?.logo ?? '',
                googleDrive_fileId: uploadFileService.GoogleApi_GetFileIdfromLink(objUpdate?.logo ?? '')
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
                    branchLogo: reader.result?.toString() ?? '',
                    fileImage: file
                }));
            };
        }
    };
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
                            values.idCongTy = Cookies.get('IdCuaHang') ?? AppConsts.guidEmpty;
                            let fileId = this.state.googleDrive_fileId;
                            const fileSelect = this.state.fileImage;
                            if (!utils.checkNull(this.state.branchLogo)) {
                                if (this.state.branchLogo !== formRef.logo) {
                                    fileId = await uploadFileService.GoogleApi_UploaFileToDrive(fileSelect, 'ChiNhanh');
                                }
                            }
                            values.logo = fileId !== '' ? `https://drive.google.com/uc?export=view&id=${fileId}` : '';
                            await chiNhanhService.CreateOrEdit(values);
                            onSave();
                        }}>
                        {({ handleChange, values, errors, touched, setFieldValue, isSubmitting }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box>
                                            <Stack alignItems="center" position={'relative'}>
                                                {!utils.checkNull(this.state.branchLogo) ? (
                                                    <Box
                                                        sx={{
                                                            position: 'relative'
                                                        }}>
                                                        <img
                                                            src={this.state.branchLogo}
                                                            className="user-image-upload"
                                                        />
                                                    </Box>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            position: 'relative'
                                                        }}>
                                                        <img src={AddLogoIcon} className="user-image-upload" />
                                                    </Box>
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
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label={<Typography variant="subtitle2">Mã chi nhánh</Typography>}
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
                                            label={<Typography variant="subtitle2">Tên chi nhánh</Typography>}
                                            error={errors.tenChiNhanh && touched.tenChiNhanh ? true : false}
                                            helperText={
                                                errors.tenChiNhanh &&
                                                touched.tenChiNhanh && (
                                                    <span className="text-danger">{errors.tenChiNhanh}</span>
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
                                        <NumericFormat
                                            label={<Typography variant="subtitle2">Số điện thoại</Typography>}
                                            error={errors.soDienThoai && touched.soDienThoai ? true : false}
                                            helperText={
                                                errors.soDienThoai &&
                                                touched.soDienThoai && (
                                                    <span className="text-danger">{errors.soDienThoai}</span>
                                                )
                                            }
                                            size="small"
                                            name="soDienThoai"
                                            placeholder="Nhập số điện thoại"
                                            value={values.soDienThoai}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}
                                            customInput={TextField}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label={<Typography variant="subtitle2">Địa chỉ</Typography>}
                                            size="small"
                                            placeholder="Nhập địa chỉ"
                                            name="diaChi"
                                            value={values.diaChi}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DatePickerRequiredCustom
                                            props={{
                                                width: '100%',
                                                size: 'small',
                                                label: <Typography variant="subtitle2">Ngày áp dụng</Typography>,
                                                error: touched.ngayApDung && Boolean(errors.ngayApDung),
                                                helperText: touched.ngayApDung && Boolean(errors.ngayApDung) && (
                                                    <span className="text-danger">{String(errors.ngayApDung)}</span>
                                                )
                                            }}
                                            defaultVal={
                                                values.ngayApDung
                                                    ? formatDate(new Date(values.ngayApDung), 'yyyy/MM/dd')
                                                    : ''
                                            }
                                            handleChangeDate={(value: string) => {
                                                values.ngayApDung = new Date(value);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DatePickerRequiredCustom
                                            props={{
                                                width: '100%',
                                                size: 'small',
                                                label: <Typography variant="subtitle2">Ngày hết hạn</Typography>,
                                                error: touched.ngayHetHan && Boolean(errors.ngayHetHan),
                                                helperText: touched.ngayHetHan && Boolean(errors.ngayHetHan) && (
                                                    <span className="text-danger">{String(errors.ngayHetHan)}</span>
                                                )
                                            }}
                                            defaultVal={
                                                values.ngayHetHan
                                                    ? formatDate(new Date(values.ngayHetHan), 'yyyy/MM/dd')
                                                    : ''
                                            }
                                            handleChangeDate={(value: string) => {
                                                values.ngayHetHan = new Date(value);
                                            }}
                                        />
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
                                            label={<Typography variant="subtitle2">Ghi chú</Typography>}
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

                                        {!isSubmitting ? (
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
