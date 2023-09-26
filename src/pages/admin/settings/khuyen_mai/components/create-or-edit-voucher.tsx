import {
    Autocomplete,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    Button,
    Switch,
    TextField,
    Typography,
    Stack,
    ToggleButtonGroup,
    ToggleButton,
    Radio,
    RadioGroup,
    Tabs,
    Tab,
    Box
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../../../../images/close-square.svg';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { format as formatDate } from 'date-fns';
import DatePickerRequiredCustom from '../../../../../components/DatetimePicker/DatePickerRequiredCustom';
import suggestStore from '../../../../../stores/suggestStore';
import { SuggestDichVuDto } from '../../../../../services/suggests/dto/SuggestDichVuDto';
import { observer } from 'mobx-react';
import AppConsts from '../../../../../lib/appconst';
import { useState } from 'react';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ThoiGianConst from '../../../../../lib/thoiGianConst';
function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`
    };
}
const CreateOrEditVoucher: React.FC<{
    visiable: boolean;
    handleClose: () => void;
}> = ({ visiable, handleClose }: any) => {
    const [tatCaChiNhanh, setTatCaChiNhanh] = useState(true);
    const [tatCaNhanVien, setTatCaNhanVien] = useState(true);
    const [tatCaNhomKhach, setTatCaNhomKhach] = useState(true);
    const [loaiKhuyenMai, setLoaiKhuyenMai] = useState(AppConsts.loaiKhuyenMai.hoaDon);
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event: any, value: number) => {
        setTabIndex(value);
    };

    return (
        <Dialog open={visiable} maxWidth="md" fullWidth onClose={handleClose}>
            <DialogTitle>
                <Typography fontSize="24px" fontWeight={700}>
                    Thêm mới voucher
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        '&:hover': {
                            filter: ' brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                        }
                    }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        id: '',
                        maKhuyenMai: '',
                        tenKhuyenMai: '',
                        trangThai: 1,
                        hinhThucKM: 11,
                        loaiKhuyenMai: 1,
                        thoiGianApDung: '',
                        thoiGianKetThuc: '',
                        ngayApDung: [],
                        thangApDung: [],
                        thuApDung: [],
                        gioApDung: [],
                        ghiChu: '',
                        idNhanViens: [] as string[],
                        idChiNhanhs: [],
                        idNhomKhachs: [],
                        tongTienHang: 0
                    }}
                    onSubmit={function (
                        values: FormikValues,
                        formikHelpers: FormikHelpers<FormikValues>
                    ): void | Promise<any> {
                        alert(JSON.stringify(values));
                        handleClose();
                    }}>
                    {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        value="start"
                                        control={
                                            <Switch
                                                checked={values.trangThai === 1 ? true : false}
                                                color="primary"
                                            />
                                        }
                                        label="Kích hoạt"
                                        labelPlacement="start"
                                        onChange={(e, v) => {
                                            setFieldValue('trangThai', v === true ? 1 : 0);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        size="small"
                                        type="text"
                                        name="maKhuyenMai"
                                        label={
                                            <Typography variant="subtitle2">
                                                Mã chương trình
                                            </Typography>
                                        }
                                        value={values.maKhuyenMai}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{ fontSize: '16px' }}></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        size="small"
                                        type="text"
                                        name="tenKhuyenMai"
                                        label={
                                            <Typography variant="subtitle2">
                                                Tên chương trình
                                            </Typography>
                                        }
                                        value={values.tenKhuyenMai}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{ fontSize: '16px' }}></TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <Tabs
                                        orientation="vertical"
                                        variant="scrollable"
                                        value={tabIndex}
                                        onChange={handleTabChange}
                                        sx={{
                                            borderRight: 1,
                                            borderColor: 'divider',
                                            marginTop: '8px'
                                        }}>
                                        <Tab
                                            sx={{ alignItems: 'start' }}
                                            label="Hình thức khuyến mại"
                                            {...a11yProps(0)}
                                        />
                                        <Tab
                                            sx={{ alignItems: 'start' }}
                                            label="Thời gian áp dụng"
                                            {...a11yProps(1)}
                                        />
                                        <Tab
                                            sx={{ alignItems: 'start' }}
                                            label="Phạm vi áp dụng"
                                            {...a11yProps(2)}
                                        />
                                    </Tabs>
                                </Grid>

                                <Grid item xs={8}>
                                    <TabPanel value={tabIndex} index={0}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Stack direction={'row'} spacing={3}>
                                                    <Typography
                                                        component="div"
                                                        display={'flex'}
                                                        alignItems={'center'}>
                                                        Khuyến mại theo
                                                    </Typography>
                                                    <FormControl>
                                                        <RadioGroup
                                                            row
                                                            value={values.loaiKhuyenMai}
                                                            onChange={(e, v) => {
                                                                setLoaiKhuyenMai(
                                                                    Number.parseInt(v)
                                                                );
                                                                setFieldValue(
                                                                    'loaiKhuyenMai',
                                                                    Number.parseInt(v)
                                                                );
                                                            }}>
                                                            <FormControlLabel
                                                                value={
                                                                    AppConsts.loaiKhuyenMai.hangHoa
                                                                }
                                                                control={<Radio />}
                                                                label="Hàng hóa"
                                                            />
                                                            <FormControlLabel
                                                                value={
                                                                    AppConsts.loaiKhuyenMai.hoaDon
                                                                }
                                                                control={<Radio />}
                                                                label="Hóa đơn"
                                                            />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <FormGroup>
                                                    <Autocomplete
                                                        options={
                                                            loaiKhuyenMai ===
                                                            AppConsts.loaiKhuyenMai.hoaDon
                                                                ? AppConsts.hinhThucKhuyenMaiHoaDon
                                                                : AppConsts.hinhThucKhuyenMaiHangHoa
                                                        }
                                                        getOptionLabel={(option) =>
                                                            `${option.name}`
                                                        }
                                                        value={
                                                            loaiKhuyenMai ===
                                                            AppConsts.loaiKhuyenMai.hoaDon
                                                                ? AppConsts.hinhThucKhuyenMaiHoaDon.filter(
                                                                      (x) =>
                                                                          x.value ==
                                                                          values.hinhThucKM
                                                                  )?.[0]
                                                                : AppConsts.hinhThucKhuyenMaiHangHoa.filter(
                                                                      (x) =>
                                                                          x.value ==
                                                                          values.hinhThucKM
                                                                  )?.[0]
                                                        }
                                                        size="small"
                                                        fullWidth
                                                        disablePortal
                                                        onChange={(event, value) => {
                                                            setFieldValue(
                                                                'hinhThucKM',
                                                                value ? value.value : 0
                                                            );
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={
                                                                    <Typography
                                                                        variant="body1"
                                                                        fontSize="14px">
                                                                        Hình thức
                                                                    </Typography>
                                                                }
                                                                placeholder="Chọn hình thức khuyễn mãi"
                                                            />
                                                        )}
                                                    />
                                                </FormGroup>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1} direction={'row'}>
                                                    <TextField
                                                        size="small"
                                                        type="text"
                                                        name="tongTienHang"
                                                        label={
                                                            <Typography variant="subtitle2">
                                                                Giảm giá
                                                            </Typography>
                                                        }
                                                        value={values.tongTienHang}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        sx={{ fontSize: '16px' }}></TextField>
                                                    <ToggleButtonGroup value={true} size="small">
                                                        <ToggleButton
                                                            value={true}
                                                            sx={{ padding: '5px', width: '30px' }}>
                                                            %
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value={false}
                                                            sx={{ padding: '5px', width: '30px' }}>
                                                            đ
                                                        </ToggleButton>
                                                    </ToggleButtonGroup>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel value={tabIndex} index={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <DatePickerRequiredCustom
                                                    props={{
                                                        width: '100%',
                                                        size: 'small',
                                                        label: (
                                                            <Typography variant="subtitle2">
                                                                Ngày bắt đầu
                                                                <span className="text-danger">
                                                                    {' '}
                                                                    *
                                                                </span>
                                                            </Typography>
                                                        ),
                                                        error:
                                                            Boolean(errors.thoiGianApDung) &&
                                                            touched.thoiGianApDung
                                                                ? true
                                                                : false,
                                                        helperText: Boolean(
                                                            errors.thoiGianApDung
                                                        ) &&
                                                            touched?.thoiGianApDung && (
                                                                <span className="text-danger">
                                                                    {String(errors.thoiGianApDung)}
                                                                </span>
                                                            )
                                                    }}
                                                    defaultVal={
                                                        values.thoiGianApDung
                                                            ? formatDate(
                                                                  new Date(values.thoiGianApDung),
                                                                  'yyyy-MM-dd'
                                                              )
                                                            : ''
                                                    }
                                                    handleChangeDate={(value: string) => {
                                                        values.thoiGianApDung = value;
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DatePickerRequiredCustom
                                                    props={{
                                                        width: '100%',
                                                        size: 'small',
                                                        label: (
                                                            <Typography variant="subtitle2">
                                                                Ngày kêt thúc
                                                                <span className="text-danger">
                                                                    {' '}
                                                                    *
                                                                </span>
                                                            </Typography>
                                                        ),
                                                        error:
                                                            Boolean(errors.thoiGianKetThuc) &&
                                                            touched.thoiGianKetThuc
                                                                ? true
                                                                : false,
                                                        helperText: Boolean(
                                                            errors.thoiGianKetThuc
                                                        ) &&
                                                            touched?.thoiGianKetThuc && (
                                                                <span className="text-danger">
                                                                    {String(errors.thoiGianKetThuc)}
                                                                </span>
                                                            )
                                                    }}
                                                    defaultVal={
                                                        values.thoiGianKetThuc
                                                            ? formatDate(
                                                                  new Date(values.thoiGianKetThuc),
                                                                  'yyyy-MM-dd'
                                                              )
                                                            : ''
                                                    }
                                                    handleChangeDate={(value: string) => {
                                                        values.thoiGianKetThuc = value;
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    multiple
                                                    options={ThoiGianConst.thang}
                                                    getOptionLabel={(option) =>
                                                        `${option.displayName}`
                                                    }
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={
                                                                    <CheckBoxOutlineBlankIcon fontSize="small" />
                                                                }
                                                                checkedIcon={
                                                                    <CheckBoxIcon fontSize="small" />
                                                                }
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option.displayName}
                                                        </li>
                                                    )}
                                                    value={ThoiGianConst.thang.filter((x) =>
                                                        values.thangApDung.includes(x.value)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'thangApDung',
                                                            value.map((x) => x.value)
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Theo tháng" />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    multiple
                                                    options={ThoiGianConst.ngay}
                                                    getOptionLabel={(option) =>
                                                        `${option.displayName}`
                                                    }
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={
                                                                    <CheckBoxOutlineBlankIcon fontSize="small" />
                                                                }
                                                                checkedIcon={
                                                                    <CheckBoxIcon fontSize="small" />
                                                                }
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option.displayName}
                                                        </li>
                                                    )}
                                                    value={ThoiGianConst.ngay.filter((x) =>
                                                        values.ngayApDung.includes(x.value)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'ngayApDung',
                                                            value.map((x) => x.value)
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Theo ngày" />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    multiple
                                                    options={ThoiGianConst.thu}
                                                    getOptionLabel={(option) =>
                                                        `${option.displayName}`
                                                    }
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={
                                                                    <CheckBoxOutlineBlankIcon fontSize="small" />
                                                                }
                                                                checkedIcon={
                                                                    <CheckBoxIcon fontSize="small" />
                                                                }
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option.displayName}
                                                        </li>
                                                    )}
                                                    value={ThoiGianConst.thu.filter((x) =>
                                                        values.thuApDung.includes(x.value)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'thuApDung',
                                                            value.map((x) => x.value)
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Theo thứ" />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    multiple
                                                    options={ThoiGianConst.gio}
                                                    getOptionLabel={(option) => `${option}`}
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={
                                                                    <CheckBoxOutlineBlankIcon fontSize="small" />
                                                                }
                                                                checkedIcon={
                                                                    <CheckBoxIcon fontSize="small" />
                                                                }
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option}
                                                        </li>
                                                    )}
                                                    value={ThoiGianConst.gio.filter((x) =>
                                                        values.gioApDung.includes(x)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue('gioApDung', value);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Theo giờ" />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel value={tabIndex} index={2}>
                                        <Grid item xs={12}>
                                            <FormControl
                                                component="fieldset"
                                                variant="standard"
                                                fullWidth>
                                                <RadioGroup
                                                    row
                                                    value={tatCaChiNhanh}
                                                    onChange={(e, v) => {
                                                        setTatCaChiNhanh(
                                                            v === 'true' ? true : false
                                                        );
                                                        setFieldValue('idChiNhanhs', []);
                                                    }}>
                                                    <FormControlLabel
                                                        control={<Radio value="true" />}
                                                        label="Toàn hệ thống"
                                                    />
                                                    <FormControlLabel
                                                        control={<Radio value="false" />}
                                                        label="Chi nhánh"
                                                    />
                                                </RadioGroup>
                                                <Autocomplete
                                                    multiple
                                                    disabled={tatCaChiNhanh}
                                                    options={suggestStore?.suggestChiNhanh ?? []}
                                                    getOptionLabel={(option) =>
                                                        `${option.tenChiNhanh}`
                                                    }
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={
                                                                    <CheckBoxOutlineBlankIcon fontSize="small" />
                                                                }
                                                                checkedIcon={
                                                                    <CheckBoxIcon fontSize="small" />
                                                                }
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option.tenChiNhanh}
                                                        </li>
                                                    )}
                                                    value={suggestStore.suggestChiNhanh.filter(
                                                        (x) => values.idChiNhanhs.includes(x.id)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'idChiNhanhs',
                                                            value.map((x) => x.id)
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            placeholder="Chọn chi nhánh áp dụng..."
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                            <FormControl
                                                component="fieldset"
                                                variant="standard"
                                                fullWidth>
                                                <RadioGroup
                                                    row
                                                    value={tatCaNhanVien}
                                                    onChange={(v, e) => {
                                                        setTatCaNhanVien(
                                                            e === 'true' ? true : false
                                                        );
                                                        setFieldValue('idNhanViens', []);
                                                    }}>
                                                    <FormControlLabel
                                                        control={<Radio value="true" />}
                                                        label="Toàn bô người bán"
                                                    />
                                                    <FormControlLabel
                                                        control={<Radio value={'false'} />}
                                                        label="Người bán"
                                                    />
                                                </RadioGroup>
                                                <Autocomplete
                                                    multiple
                                                    disabled={tatCaNhanVien}
                                                    options={suggestStore?.suggestNhanVien ?? []}
                                                    getOptionLabel={(option) =>
                                                        `${option.tenNhanVien}`
                                                    }
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={
                                                                    <CheckBoxOutlineBlankIcon fontSize="small" />
                                                                }
                                                                checkedIcon={
                                                                    <CheckBoxIcon fontSize="small" />
                                                                }
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option.tenNhanVien}
                                                        </li>
                                                    )}
                                                    value={suggestStore.suggestNhanVien.filter(
                                                        (x) => values.idNhanViens.includes(x.id)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'idNhanViens',
                                                            value.map((x) => x.id)
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            placeholder="Chọn nhân viên áp dụng..."
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                            <FormControl
                                                component="fieldset"
                                                variant="standard"
                                                fullWidth>
                                                <RadioGroup
                                                    row
                                                    value={tatCaNhomKhach}
                                                    onChange={(e, value) => {
                                                        setTatCaNhomKhach(
                                                            value === 'true' ? true : false
                                                        );
                                                        setFieldValue('idNhomKhachs', []);
                                                    }}>
                                                    <FormControlLabel
                                                        control={<Radio value={'true'} />}
                                                        label="Toàn bộ khách hàng"
                                                    />
                                                    <FormControlLabel
                                                        control={<Radio value={'false'} />}
                                                        label="Nhóm khách hàng"
                                                    />
                                                </RadioGroup>
                                                <Autocomplete
                                                    multiple
                                                    disabled={tatCaNhomKhach}
                                                    options={suggestStore?.suggestNhomKhach ?? []}
                                                    getOptionLabel={(option) =>
                                                        `${option.tenNhomKhach}`
                                                    }
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={
                                                                    <CheckBoxOutlineBlankIcon fontSize="small" />
                                                                }
                                                                checkedIcon={
                                                                    <CheckBoxIcon fontSize="small" />
                                                                }
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option.tenNhomKhach}
                                                        </li>
                                                    )}
                                                    value={suggestStore.suggestNhomKhach.filter(
                                                        (x) => values.idNhomKhachs.includes(x.id)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'idNhomKhachs',
                                                            value.map((x) => x.id)
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            placeholder="Chọn nhóm khách hàng áp dụng..."
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </TabPanel>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label={
                                            <Typography variant="subtitle2" fontSize="14px">
                                                Ghi chú
                                            </Typography>
                                        }
                                        fullWidth
                                        type="text"
                                        multiline
                                        rows={4}
                                        size="small"
                                        name="ghiChu"
                                        //value={values.ghiChu}
                                        onChange={handleChange}></TextField>
                                </Grid>
                            </Grid>
                            <DialogActions sx={{ paddingRight: '0!important' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleClose}
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
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};
export default observer(CreateOrEditVoucher);
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}>
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </div>
    );
}
