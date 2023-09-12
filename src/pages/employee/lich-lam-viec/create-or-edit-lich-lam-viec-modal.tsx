import React, { useEffect, useState } from 'react';
import {
    Box,
    Dialog,
    TextField,
    Button,
    Grid,
    Typography,
    Select,
    MenuItem,
    SelectChangeEvent,
    ToggleButtonGroup,
    ToggleButton,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Autocomplete
} from '@mui/material';
import * as Yup from 'yup';
import { ReactComponent as ArrowDown } from '../../../images/arow-down.svg';
import { ReactComponent as DateIcon } from '../../../images/calendarMenu.svg';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import AppConsts from '../../../lib/appconst';
import { SuggestCaLamViecDto } from '../../../services/suggests/dto/SuggestCaLamViecDto';
import SuggestService from '../../../services/suggests/SuggestService';
import { Form, Formik } from 'formik';
import Cookies from 'js-cookie';
import lichLamViecService from '../../../services/nhan-vien/lich_lam_viec/lichLamViecService';
import { enqueueSnackbar } from 'notistack';
import { observer } from 'mobx-react';
import suggestStore from '../../../stores/suggestStore';

interface DialogComponentProps {
    open: boolean;
    idNhanVien: string;
    onClose: () => void;
}
const CreateOrEditLichLamViecModal: React.FC<DialogComponentProps> = ({
    open,
    onClose,
    idNhanVien
}) => {
    const [curent, setCurent] = useState(1);
    const [idCaLamViec, setIdCaLamViec] = useState('');
    const [suggestCaLamViec, setSuggestCaLamViec] = useState<SuggestCaLamViecDto[]>([]);

    const caLamViecHandleChange = (event: SelectChangeEvent<any>) => {
        setIdCaLamViec(event.target.value);
    };
    const [date, setDate] = useState<string>('20/6/2023');
    useEffect(() => {
        getSuggestCaLamViec();
    }, []);
    const getSuggestCaLamViec = async () => {
        const result = await SuggestService.SuggestCaLamViec();
        if (result && result.length > 0) {
            setIdCaLamViec(result[0].id);
            setSuggestCaLamViec(result);
        }
    };
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value);
    };
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const handleDayToggle = (event: React.MouseEvent<HTMLElement>, newDays: string[]) => {
        setSelectedDays(newDays);
    };
    const rules = Yup.object().shape({
        idCaLamViec: Yup.string().required('Ca làm việc không được để trống'),
        tuNgay: Yup.string().required('Ngày bắt đầu không được để trống'),
        denNgay: Yup.string().required('Ngày kết thúc không được để trống')
        // ngayLamViec: Yup.array()
        //     .of(Yup.string().required('Ngày làm việc trong tuần không được để trống'))
        //     .required('Ngày làm việc trong tuần không được để trống')
    });
    const initValues = {
        id: AppConsts.guidEmpty,
        idNhanVien: idNhanVien,
        idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
        idCaLamViec: '',
        tuNgay: '',
        denNgay: '',
        lapLai: false,
        kieuLapLai: 0,
        giaTriLap: 0,
        ngayLamViec: [] as string[]
    };
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ '& .MuiPaper-root': { width: '71vw' } }}
            maxWidth={false}>
            <DialogTitle>
                <Typography
                    variant="h3"
                    fontSize="24px"
                    // color="#333233"
                    fontWeight="700"
                    mb={3}>
                    Đặt ca làm việc thường xuyên
                </Typography>
                <Button
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: '16px',
                        top: '16px',
                        minWidth: 'unset',
                        '&:hover svg': {
                            filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                        }
                    }}>
                    <CloseIcon />
                </Button>
            </DialogTitle>
            <DialogContent>
                <Formik
                    validationSchema={rules}
                    initialValues={initValues}
                    onSubmit={async (values, helper) => {
                        values.ngayLamViec = selectedDays;
                        if (values.ngayLamViec.length == 0 || values.ngayLamViec == null) {
                            helper.setFieldError(
                                'ngayLamViec',
                                'Ngày làm việc không được để trống'
                            );
                        } else {
                            const result = await lichLamViecService.createOrEditLichLamViec(values);
                            result == true
                                ? enqueueSnackbar('Thêm mới thành công', {
                                      variant: 'success',
                                      autoHideDuration: 3000
                                  })
                                : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau!', {
                                      variant: 'error',
                                      autoHideDuration: 3000
                                  });
                            helper.resetForm();
                            onClose();
                        }
                    }}>
                    {({ values, handleChange, errors, touched, setFieldValue }) => (
                        <Form
                            onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault(); // Prevent form submission
                                }
                            }}>
                            <Grid container spacing={3}>
                                <Grid item xs={5}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: '16px',
                                            flexDirection: 'column',
                                            border: '1px solid #E6E1E6',
                                            padding: '24px',
                                            borderRadius: '8px'
                                        }}>
                                        <FormControl fullWidth>
                                            <InputLabel>
                                                <Typography fontSize="14px">Lặp lại</Typography>
                                            </InputLabel>
                                            <Select
                                                label={
                                                    <Typography fontSize="14px">Lặp lại</Typography>
                                                }
                                                value={curent}
                                                onChange={(e) => {
                                                    setCurent(
                                                        Number.parseInt(e.target.value.toString())
                                                    );
                                                }}
                                                sx={{
                                                    width: '100%',
                                                    '[aria-expanded="true"] ~ svg': {
                                                        transform: 'rotate(180deg)'
                                                    },
                                                    pr: '20px',
                                                    //color: '#4C4B4C',

                                                    mt: '8px'
                                                }}
                                                size="small"
                                                IconComponent={() => <ArrowDown />}>
                                                <MenuItem value={2}>Mỗi tuần</MenuItem>
                                                <MenuItem value={1}>Mỗi ngày</MenuItem>
                                                <MenuItem value={3}>Mỗi tháng</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Box>
                                            <TextField
                                                label={
                                                    <Typography fontSize="13px" fontWeight="500">
                                                        Ngày bắt đầu
                                                    </Typography>
                                                }
                                                type="date"
                                                value={values.tuNgay}
                                                error={
                                                    touched.tuNgay && errors.tuNgay ? true : false
                                                }
                                                helperText={
                                                    touched.tuNgay &&
                                                    errors.tuNgay && (
                                                        <span className="text-danger">
                                                            {errors.tuNgay}
                                                        </span>
                                                    )
                                                }
                                                name={'tuNgay'}
                                                size="small"
                                                onChange={handleChange}
                                                fullWidth
                                                sx={{
                                                    mt: '8px',
                                                    cursor: 'pointer',
                                                    position: 'relative',

                                                    '& input': {
                                                        flexDirection: 'row-reverse',
                                                        gap: '10px'
                                                    },
                                                    '& svg': {
                                                        position: 'absolute',
                                                        zIndex: '2',
                                                        pointerEvents: 'none'
                                                    },
                                                    '& input[type="date"]::-webkit-calendar-picker-indicator':
                                                        {
                                                            opacity: '0'
                                                        },
                                                    '& input[type="date"]::-moz-calendar-picker-indicator':
                                                        {
                                                            opacity: '0'
                                                        }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <React.Fragment>
                                                            <DateIcon />
                                                        </React.Fragment>
                                                    )
                                                }}
                                            />
                                        </Box>
                                        <Box>
                                            <TextField
                                                label={
                                                    <Typography fontSize="13px" fontWeight="500">
                                                        Ngày kết thúc
                                                    </Typography>
                                                }
                                                type="date"
                                                value={values.denNgay}
                                                name={'denNgay'}
                                                error={
                                                    touched.denNgay && errors.denNgay ? true : false
                                                }
                                                helperText={
                                                    touched.denNgay &&
                                                    errors.denNgay && (
                                                        <span className="text-danger">
                                                            {errors.denNgay}
                                                        </span>
                                                    )
                                                }
                                                size="small"
                                                onChange={handleChange}
                                                fullWidth
                                                sx={{
                                                    mt: '8px',
                                                    cursor: 'pointer',
                                                    position: 'relative',

                                                    '& input': {
                                                        flexDirection: 'row-reverse',
                                                        gap: '10px'
                                                    },
                                                    '& svg': {
                                                        position: 'absolute',
                                                        zIndex: '2',
                                                        pointerEvents: 'none'
                                                    },
                                                    '& input[type="date"]::-webkit-calendar-picker-indicator':
                                                        {
                                                            opacity: '0'
                                                        },
                                                    '& input[type="date"]::-moz-calendar-picker-indicator':
                                                        {
                                                            opacity: '0'
                                                        }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <React.Fragment>
                                                            <DateIcon />
                                                        </React.Fragment>
                                                    )
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={7}>
                                    <Box
                                        sx={{
                                            gap: '16px',
                                            border: '1px solid #E6E1E6',
                                            padding: '24px',
                                            borderRadius: '8px'
                                        }}>
                                        <Grid container item spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete
                                                    fullWidth
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'idNhanVien',
                                                            value?.id ?? ''
                                                        );
                                                        //idNhanVien = value?.id;
                                                    }}
                                                    options={suggestStore.suggestNhanVien}
                                                    value={
                                                        suggestStore.suggestNhanVien.find(
                                                            (x) => x.id == values.idNhanVien
                                                        ) ?? null
                                                    }
                                                    disabled={
                                                        idNhanVien !== AppConsts.guidEmpty ||
                                                        idNhanVien === ''
                                                            ? true
                                                            : false
                                                    }
                                                    getOptionLabel={(item) => item.tenNhanVien}
                                                    size="small"
                                                    sx={{
                                                        '& .MuiAutocomplete-root': {
                                                            backgroundColor: '#fff',
                                                            '& .MuiSvgIcon-root': {
                                                                position: 'relative',
                                                                left: '-10px'
                                                            },
                                                            '&[aria-expanded="true"] .MuiSvgIcon-root':
                                                                {
                                                                    transform: 'rotate(180deg)'
                                                                }
                                                        }
                                                    }}
                                                    renderInput={(params: any) => (
                                                        <TextField
                                                            fullWidth
                                                            {...params}
                                                            label="Nhân viên"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <InputLabel>
                                                        <Typography fontSize="14px">
                                                            Ca làm việc
                                                        </Typography>
                                                    </InputLabel>
                                                    <Select
                                                        label={
                                                            <Typography fontSize="14px">
                                                                Ca làm việc
                                                            </Typography>
                                                        }
                                                        value={values.idCaLamViec}
                                                        onChange={handleChange}
                                                        name="idCaLamViec"
                                                        error={
                                                            touched.idCaLamViec &&
                                                            errors.idCaLamViec
                                                                ? true
                                                                : false
                                                        }
                                                        sx={{
                                                            width: '100%',
                                                            '[aria-expanded="true"] ~ svg': {
                                                                transform: 'rotate(180deg)'
                                                            },
                                                            pr: '20px',
                                                            color: '#4C4B4C'
                                                        }}
                                                        displayEmpty
                                                        size="small"
                                                        IconComponent={() => <ArrowDown />}>
                                                        {Array.isArray(suggestCaLamViec) &&
                                                            suggestCaLamViec.map((item) => (
                                                                <MenuItem
                                                                    key={item.id}
                                                                    value={item.id}>
                                                                    {item.tenCa}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                    {touched.idCaLamViec && errors.idCaLamViec && (
                                                        <span className="text-danger">
                                                            {errors.idCaLamViec}
                                                        </span>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <Typography
                                                        //color="#4C4B4C"
                                                        fontSize="14px"
                                                        fontWeight="500">
                                                        Ngày làm việc
                                                    </Typography>
                                                    <ToggleButtonGroup
                                                        fullWidth
                                                        size="small"
                                                        orientation="horizontal"
                                                        value={selectedDays}
                                                        sx={{ mt: '8px', padding: '2px' }}
                                                        onChange={handleDayToggle}>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.monday}
                                                            aria-label="Monday"
                                                            style={
                                                                selectedDays.includes(
                                                                    AppConsts.dayOfWeek.monday
                                                                )
                                                                    ? {
                                                                          backgroundColor:
                                                                              'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            T2
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.tuesday}
                                                            aria-label="Tuesday"
                                                            style={
                                                                selectedDays.includes(
                                                                    AppConsts.dayOfWeek.tuesday
                                                                )
                                                                    ? {
                                                                          backgroundColor:
                                                                              'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            T3
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.wednesday}
                                                            aria-label="Wednesday"
                                                            style={
                                                                selectedDays.includes(
                                                                    AppConsts.dayOfWeek.wednesday
                                                                )
                                                                    ? {
                                                                          backgroundColor:
                                                                              'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            T4
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.thursday}
                                                            aria-label="Thursday"
                                                            style={
                                                                selectedDays.includes(
                                                                    AppConsts.dayOfWeek.thursday
                                                                )
                                                                    ? {
                                                                          backgroundColor:
                                                                              'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            T5
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.friday}
                                                            aria-label="Friday"
                                                            style={
                                                                selectedDays.includes(
                                                                    AppConsts.dayOfWeek.friday
                                                                )
                                                                    ? {
                                                                          backgroundColor:
                                                                              'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            T6
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.saturday}
                                                            aria-label="Saturday"
                                                            style={
                                                                selectedDays.includes(
                                                                    AppConsts.dayOfWeek.saturday
                                                                )
                                                                    ? {
                                                                          backgroundColor:
                                                                              'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            T7
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.sunday}
                                                            aria-label="Sunday"
                                                            style={
                                                                selectedDays.includes(
                                                                    AppConsts.dayOfWeek.sunday
                                                                )
                                                                    ? {
                                                                          backgroundColor:
                                                                              'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            CN
                                                        </ToggleButton>
                                                    </ToggleButtonGroup>
                                                    {errors.ngayLamViec && (
                                                        <span className="text-danger">
                                                            {errors.ngayLamViec}
                                                        </span>
                                                    )}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                            <DialogActions>
                                <Box
                                    display="flex"
                                    marginLeft="auto"
                                    gap="8px"
                                    sx={{
                                        '& button': {
                                            textTransform: 'unset!important'
                                        }
                                    }}>
                                    <Button
                                        onClick={onClose}
                                        variant="outlined"
                                        sx={{ color: 'var(--color-main)!important' }}
                                        className="btn-outline-hover">
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        className="btn-container-hover">
                                        Lưu
                                    </Button>
                                </Box>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};
export default observer(CreateOrEditLichLamViecModal);
