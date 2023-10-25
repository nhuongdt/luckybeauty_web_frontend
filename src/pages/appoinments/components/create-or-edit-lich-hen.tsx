import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormGroup,
    Grid,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Typography,
    Autocomplete,
    InputAdornment,
    InputLabel,
    FormControl,
    Avatar
} from '@mui/material';
import { Component, ReactNode } from 'react';
import { ReactComponent as AddIcon } from '../../../images/add.svg';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import { Formik, Form } from 'formik';
import AppConsts from '../../../lib/appconst';
import Cookies from 'js-cookie';
import { enqueueSnackbar } from 'notistack';
import { ReactComponent as SearchIcon } from '../../../images/search-normal.svg';
import { ReactComponent as IconMore } from '../../../images/iconContainer.svg';
import { ReactComponent as CustomerIcon } from '../../../images/icons/profile-2user.svg';
import rules from './create-or-edit-lich-hen.validate';
import khachHangStore from '../../../stores/khachHangStore';
import CreateOrEditCustomerDialog from '../../customer/components/create-or-edit-customer-modal';
import { observer } from 'mobx-react';
import suggestStore from '../../../stores/suggestStore';
import bookingStore from '../../../stores/bookingStore';
import { SuggestKhachHangDto } from '../../../services/suggests/dto/SuggestKhachHangDto';
import { SuggestDichVuDto } from '../../../services/suggests/dto/SuggestDichVuDto';
import { SuggestNhanVienDichVuDto } from '../../../services/suggests/dto/SuggestNhanVienDichVuDto';
import DatePickerRequiredCustom from '../../../components/DatetimePicker/DatePickerRequiredCustom';
import { format as formatDate } from 'date-fns';
interface ICreateOrEditProps {
    visible: boolean;
    onCancel: () => void;
    idLichHen: string;
    onOk: (idBooking: string) => void;
}

class CreateOrEditLichHenModal extends Component<ICreateOrEditProps> {
    state = {
        isShowKhachHangModal: false,
        thoiGianThucHien: '0'
    };
    componentDidMount(): void {
        khachHangStore.createKhachHangDto();
        suggestStore.getSuggestKhachHang();
    }
    onOpenKhachHangModal = () => {
        this.setState({ isShowKhachHangModal: !this.state.isShowKhachHangModal });
    };
    handleSubmit = async (values: any) => {
        const createResult = await bookingStore.onCreateOrEditBooking({
            id: values.id,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
            idDonViQuiDoi: values.idDonViQuiDoi,
            idKhachHang: values.idKhachHang,
            idNhanVien: values.idNhanVien,
            startHours: values.startHours,
            startTime: values.startTime,
            ghiChu: values.ghiChu,
            trangThai: values.trangThai
        });
        const saveOK = createResult != null;
        saveOK
            ? enqueueSnackbar(
                  values.id === AppConsts.guidEmpty || values.id === '' ? 'Thêm mới thành công' : 'Cập nhật thành công',
                  {
                      variant: 'success',
                      autoHideDuration: 3000
                  }
              )
            : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        this.props.onOk(createResult.id);
    };
    render(): ReactNode {
        const { visible, onCancel } = this.props;
        const initialValues = bookingStore.createOrEditBookingDto;
        return (
            <Dialog open={visible} onClose={onCancel} fullWidth maxWidth="md">
                <DialogTitle sx={{ borderBottom: '1px solid #E6E1E6' }}>
                    <Typography
                        variant="h3"
                        fontSize="24px"
                        //color="rgb(51, 50, 51)"
                        fontWeight="700">
                        {initialValues.id === '' || initialValues.id === AppConsts.guidEmpty
                            ? 'Thêm cuộc hẹn'
                            : 'Cập hật lịch hẹn'}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={onCancel}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pr: '0', pb: '0' }}>
                    <Formik initialValues={initialValues} onSubmit={this.handleSubmit} validationSchema={rules}>
                        {({ errors, touched, values, handleChange, setFieldValue, isSubmitting }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={5}>
                                        {/* <FormGroup> */}
                                        <Box
                                            display={'flex'}
                                            justifyContent={'space-between'}
                                            width={'100%'}
                                            height={'100%'}
                                            flexDirection={'column'}>
                                            <Box>
                                                <Autocomplete
                                                    sx={{ pt: '24px' }}
                                                    options={suggestStore.suggestKhachHang}
                                                    getOptionLabel={(option) =>
                                                        `${option.tenKhachHang} ${
                                                            option.soDienThoai !== '' ? option.soDienThoai : ''
                                                        }`
                                                    }
                                                    value={
                                                        suggestStore.suggestKhachHang?.filter(
                                                            (x) => x.id == values.idKhachHang
                                                        )?.[0] ??
                                                        ({
                                                            id: '',
                                                            soDienThoai: '',
                                                            tenKhachHang: ''
                                                        } as SuggestKhachHangDto)
                                                    }
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue('idKhachHang', value ? value.id : ''); // Cập nhật giá trị id trong Formik
                                                    }}
                                                    placeholder="Chọn khách hàng"
                                                    renderInput={(params) => (
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px'
                                                            }}>
                                                            <TextField
                                                                {...params}
                                                                placeholder="Chọn khách hàng"
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    startAdornment: (
                                                                        <>
                                                                            {params.InputProps.startAdornment}
                                                                            <InputAdornment position="start">
                                                                                <SearchIcon />
                                                                            </InputAdornment>
                                                                        </>
                                                                    )
                                                                }}
                                                            />
                                                            <Button
                                                                size="small"
                                                                variant="text"
                                                                sx={{
                                                                    color: 'var(--color-main)',
                                                                    '& svg': {
                                                                        filter: 'var(--color-hoverIcon)',
                                                                        width: '24px',
                                                                        height: '24px'
                                                                    },
                                                                    minWidth: '36px',
                                                                    width: '36px',
                                                                    height: '36px',
                                                                    borderRadius: '4px',
                                                                    border: '1px solid #319DFF'
                                                                }}
                                                                onClick={this.onOpenKhachHangModal}>
                                                                <AddIcon />
                                                            </Button>
                                                        </div>
                                                    )}
                                                />
                                                {errors.idKhachHang && touched.idKhachHang && (
                                                    <small className="text-danger">{errors.idKhachHang}</small>
                                                )}
                                            </Box>
                                            <Box
                                                display={'flex'}
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                                flexDirection={'column'}>
                                                <Avatar sx={{ width: '140px', height: '140px', bgcolor: '#EEF0F4' }}>
                                                    <CustomerIcon width={'60px'} height={'60px'} />
                                                </Avatar>
                                                <Typography
                                                    marginTop={'40px'}
                                                    marginBottom={'12px'}
                                                    color={'#3D475C'}
                                                    fontSize={'18px'}
                                                    fontWeight={'700'}>
                                                    Thêm khách hàng
                                                </Typography>
                                                <Typography color={'#8492AE'} fontSize={'14px'} fontWeight={400}>
                                                    Sử dụng tìm kiếm để thêm khách hàng
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={7} sx={{ bgcolor: '#F9FAFC', pr: '24px' }}>
                                        <FormGroup className="mt-4 mb-1">
                                            <DatePickerRequiredCustom
                                                props={{
                                                    width: '100%',
                                                    size: 'small',
                                                    label: (
                                                        <Typography variant="subtitle2">
                                                            Ngày
                                                            <span className="text-danger"> *</span>
                                                        </Typography>
                                                    ),
                                                    error: Boolean(errors.startTime),
                                                    helperText: Boolean(errors.startTime) && (
                                                        <span className="text-danger">{String(errors.startTime)}</span>
                                                    )
                                                }}
                                                defaultVal={values.startTime}
                                                handleChangeDate={(value: string) => {
                                                    values.startTime = value;
                                                }}
                                            />
                                        </FormGroup>
                                        <Grid container spacing={2} sx={{ marginTop: '4px' }}>
                                            <Grid item md={8} sm={6} xs={12}>
                                                <FormGroup>
                                                    <Autocomplete
                                                        options={suggestStore?.suggestDichVu ?? []}
                                                        getOptionLabel={(option) => `${option.tenDichVu}`}
                                                        value={
                                                            suggestStore.suggestDichVu?.filter(
                                                                (x) => x.id == values.idDonViQuiDoi
                                                            )?.[0] ??
                                                            ({
                                                                id: '',
                                                                donGia: 0,
                                                                tenDichVu: ''
                                                            } as SuggestDichVuDto)
                                                        }
                                                        size="small"
                                                        fullWidth
                                                        disablePortal
                                                        onChange={async (event, value) => {
                                                            setFieldValue('idDonViQuiDoi', value ? value.id : ''); // Cập nhật giá trị id trong Formik

                                                            await suggestStore.getSuggestKyThuatVienByIdDichVu(
                                                                value ? value.id : ''
                                                            );
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={
                                                                    <Typography variant="subtitle2" fontSize="14px">
                                                                        Dịch vụ <span className="text-danger">*</span>
                                                                    </Typography>
                                                                }
                                                                error={
                                                                    errors.idDonViQuiDoi && touched.idDonViQuiDoi
                                                                        ? true
                                                                        : false
                                                                }
                                                                helperText={
                                                                    errors.idDonViQuiDoi &&
                                                                    touched.idDonViQuiDoi && (
                                                                        <small className="text-danger">
                                                                            {errors.idDonViQuiDoi}
                                                                        </small>
                                                                    )
                                                                }
                                                                placeholder="Nhập tên dịch vụ"
                                                            />
                                                        )}
                                                    />
                                                </FormGroup>
                                            </Grid>
                                            <Grid item md={4} xs={12} sm={6}>
                                                <FormGroup>
                                                    <TextField
                                                        label={
                                                            <Typography variant="subtitle2" fontSize="14px">
                                                                Thời gian bắt đầu <span className="text-danger">*</span>
                                                            </Typography>
                                                        }
                                                        error={errors.startHours && touched.startHours ? true : false}
                                                        helperText={
                                                            errors.startHours &&
                                                            touched.startHours && (
                                                                <span className="text-danger">{errors.startHours}</span>
                                                            )
                                                        }
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        type="time"
                                                        size="small"
                                                        name="startHours"
                                                        value={values.startHours}
                                                        onChange={handleChange}></TextField>
                                                </FormGroup>
                                            </Grid>
                                            <Grid container item spacing={[4, 2]}>
                                                <Grid item md={8} sm={6} xs={12}>
                                                    <FormGroup>
                                                        <Autocomplete
                                                            options={suggestStore?.suggestKyThuatVien ?? []}
                                                            getOptionLabel={(option) => `${option.tenNhanVien}`}
                                                            value={
                                                                suggestStore.suggestKyThuatVien?.filter(
                                                                    (x) => x.id == values.idNhanVien
                                                                )?.[0] ??
                                                                ({
                                                                    id: '',
                                                                    avatar: '',
                                                                    chucVu: '',
                                                                    soDienThoai: '',
                                                                    tenNhanVien: ''
                                                                } as SuggestNhanVienDichVuDto)
                                                            }
                                                            size="small"
                                                            fullWidth
                                                            disablePortal
                                                            onChange={(event, value) => {
                                                                setFieldValue('idNhanVien', value ? value.id : ''); // Cập nhật giá trị id trong Formik
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label={
                                                                        <Typography variant="body1" fontSize="14px">
                                                                            Nhân viên
                                                                        </Typography>
                                                                    }
                                                                    placeholder="Nhập tên nhân viên"
                                                                />
                                                            )}
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item md={4} sm={6} xs={12}>
                                                    <FormGroup>
                                                        <TextField
                                                            label={
                                                                <Typography variant="subtitle2" fontSize="14px">
                                                                    Thời gian làm
                                                                </Typography>
                                                            }
                                                            value={
                                                                suggestStore.suggestDichVu.find(
                                                                    (x) => x.id == values.idDonViQuiDoi
                                                                )?.thoiGianThucHien ?? '0'
                                                            }
                                                            type="text"
                                                            size="small"></TextField>
                                                    </FormGroup>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item sx={{ marginTop: '16px' }}>
                                            <FormControl fullWidth>
                                                <InputLabel>
                                                    <Typography fontSize="14px">Trạng thái</Typography>
                                                </InputLabel>
                                                <Select
                                                    label={<Typography fontSize="14px">Trạng thái</Typography>}
                                                    fullWidth
                                                    size="small"
                                                    name="trangThai"
                                                    value={values.trangThai}
                                                    onChange={handleChange}>
                                                    {AppConsts.trangThaiCheckIn.map((item) => (
                                                        <MenuItem key={item.value} value={item.value}>
                                                            {item.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item sx={{ marginTop: '16px' }}>
                                            <FormGroup className="mt-2 mb-4">
                                                <TextField
                                                    label={
                                                        <Typography variant="subtitle2" fontSize="14px">
                                                            Ghi chú
                                                        </Typography>
                                                    }
                                                    type="text"
                                                    multiline
                                                    rows={4}
                                                    size="small"
                                                    name="ghiChu"
                                                    value={values.ghiChu}
                                                    onChange={handleChange}></TextField>
                                            </FormGroup>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <DialogActions
                                    sx={{
                                        pr: '0',
                                        pb: '24px',
                                        position: 'sticky',
                                        bgcolor: '#fff',
                                        bottom: '0',
                                        left: '0'
                                    }}>
                                    <Grid container>
                                        <Grid item xs={12} sx={{ bgcolor: '#F9FAFC' }}>
                                            <Box
                                                display="flex"
                                                justifyContent="end"
                                                gap="8px"
                                                sx={{
                                                    '& button': {
                                                        textTransform: 'unset!important'
                                                    }
                                                }}>
                                                <Button
                                                    className="btn-outline-hover"
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        borderColor: '#E6E1E6',
                                                        color: 'var(--color-main)'
                                                    }}
                                                    onClick={onCancel}>
                                                    Hủy
                                                </Button>
                                                {!isSubmitting ? (
                                                    <Button
                                                        className="btn-container-hover"
                                                        variant="contained"
                                                        type="submit"
                                                        sx={{
                                                            backgroundColor: 'var(--color-main)!important'
                                                        }}>
                                                        Lưu
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        className="btn-container-hover"
                                                        variant="contained"
                                                        type="submit"
                                                        sx={{
                                                            backgroundColor: 'var(--color-main)!important'
                                                        }}>
                                                        Đang lưu
                                                    </Button>
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
                <CreateOrEditCustomerDialog
                    visible={this.state.isShowKhachHangModal}
                    formRef={khachHangStore.createEditKhachHangDto}
                    onCancel={this.onOpenKhachHangModal}
                    onOk={async (e: any) => {
                        await suggestStore.getSuggestKhachHang();
                        this.onOpenKhachHangModal();
                    }}
                    title="Thêm mới khách hàng"
                />
            </Dialog>
        );
    }
}
export default observer(CreateOrEditLichHenModal);
