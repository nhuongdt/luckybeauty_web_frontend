import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    FormGroup,
    Grid,
    Radio,
    TextField,
    Stack,
    Autocomplete,
    ListItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SelectWithData from '../../../../components/Menu/SelectWithData';
import { Formik, Form } from 'formik';
import { Component, ReactNode, useEffect, useState, useRef, useContext } from 'react';
import { NumericFormat } from 'react-number-format';
import { CreateOrEditSoQuyDto } from '../../../../services/so_quy/Dto/CreateOrEditSoQuyDto';
import QuyChiTietDto from '../../../../services/so_quy/QuyChiTietDto';
import QuyHoaDonDto from '../../../../services/so_quy/QuyHoaDonDto';
import SoQuyServices from '../../../../services/so_quy/SoQuyServices';
import utils from '../../../../utils/utils';
import DateTimePickerCustom from '../../../../components/DatetimePicker/DateTimePickerCustom';
import AutocompleteCustomer from '../../../../components/Autocomplete/Customer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as yup from 'yup';
import { useFormik, useFormikContext } from 'formik';
import { addDays, format, isDate, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import AppConsts from '../../../../lib/appconst';
import { Guid } from 'guid-typescript';
import { ChiNhanhContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
import Cookies from 'js-cookie';
import nhanVienService from '../../../../services/nhan-vien/nhanVienService';
import NhanSuItemDto from '../../../../services/nhan-vien/dto/nhanSuItemDto';
import AutocompleteNhanVien from '../../../../components/Autocomplete/NhanVien';

interface SoQuyDialogProps {
    visiable: boolean;
    onClose: () => void;
    onOk: (dataSave: any, type: number) => void;
    idQuyHD: string | null;
}
// const LableForm = (text: string) => {
//     return (
//         <span
//             sx={{ marginTop: 2, marginBottom: 1 }}
//             variant="h3"
//             fontSize="14px"
//             fontWeight="500"
//             fontFamily="Roboto"
//             fontStyle="normal"
//             color="#4C4B4C">
//             {text}
//         </span>
//     );
// };

const themeDate = createTheme({
    components: {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    minWidth: '100%'
                }
            }
        }
    }
});
const CreateOrEditSoQuyDialog = ({
    visiable = false,
    idQuyHD = null,
    onClose,
    onOk
}: SoQuyDialogProps) => {
    const hinhThucThanhToan = [
        { id: 1, text: 'Tiền mặt' },
        { id: 2, text: 'POS' },
        { id: 3, text: 'Chuyển khoản' }
    ];

    const doiTuongNopTien = [
        { id: 1, text: 'Khách hàng' },
        // { id: 2, text: 'Nhà cung cấp' },
        { id: 3, text: 'Nhân viên' }
    ];
    const formRef = useRef();
    const [isSaving, setIsSaving] = useState(false);
    const chinhanh = useContext(ChiNhanhContext);
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);

    const [quyHoaDon, setQuyHoaDon] = useState<QuyHoaDonDto>(
        new QuyHoaDonDto({
            id: Guid.create().toString(),
            idChiNhanh: chinhanh.id,
            idLoaiChungTu: 11,
            tongTienThu: 0,
            idDoiTuongNopTien: null,
            hinhThucThanhToan: 1,
            ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm')
        })
    );

    const getInforQuyHoaDon = async () => {
        if (utils.checkNull(idQuyHD)) return;
        const data = await SoQuyServices.GetForEdit(idQuyHD ?? '');
        console.log(data);
        if (data !== null) {
            setQuyHoaDon(data);
        }
    };
    const GetListNhanVien = async () => {
        const data = await nhanVienService.search('', { skipCount: 0, maxResultCount: 100 });
        console.log('âlNV ', data);
        setAllNhanVien(data.items);
    };

    const PageLoad = () => {
        GetListNhanVien();
    };

    useEffect(() => {
        PageLoad();
    }, []);
    useEffect(() => {
        if (utils.checkNull(idQuyHD)) {
            // insert
            setQuyHoaDon({
                ...quyHoaDon,
                id: Guid.create().toString(),
                idChiNhanh: chinhanh.id,
                idLoaiChungTu: 11,
                tongTienThu: 0,
                idDoiTuongNopTien: null,
                maHoaDon: '',
                loaiDoiTuong: 1,
                ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm'),
                noiDungThu: '',
                hinhThucThanhToan: 1,
                idKhoanThuChi: null,
                hachToanKinhDoanh: true
            });
        } else {
            // update
            getInforQuyHoaDon();
        }
    }, [visiable]);

    const checkSave = async () => {
        // check ma xexists
        return true;
    };

    const saveSoQuy = async () => {
        setIsSaving(true);
        const quyCT = new QuyChiTietDto({
            idKhachHang: (quyHoaDon.loaiDoiTuong == 3 ? null : quyHoaDon.idDoiTuongNopTien) as null,
            hinhThucThanhToan: quyHoaDon.hinhThucThanhToan,
            tienThu: quyHoaDon.tongTienThu,
            idNhanVien: (quyHoaDon.loaiDoiTuong == 3 ? quyHoaDon.idDoiTuongNopTien : null) as null,
            idKhoanThuChi: quyHoaDon.idKhoanThuChi as null
        });
        const myData = { ...quyHoaDon };
        myData.quyHoaDon_ChiTiet = [quyCT];
        const data = await SoQuyServices.CreateQuyHoaDon(myData);
        quyHoaDon.id = data.id;
        quyHoaDon.maHoaDon = data.maHoaDon;
        quyHoaDon.txtTrangThai = 'Đã thanh toán';
        console.log('data ', quyHoaDon);

        onOk(quyHoaDon, 1);
    };

    useEffect(() => {
        setQuyHoaDon({
            ...quyHoaDon,
            loaiPhieu: quyHoaDon.idLoaiChungTu === 11 ? 'Phiếu thu' : 'Phiếu chi'
        });
    }, [quyHoaDon.idLoaiChungTu]);

    useEffect(() => {
        setQuyHoaDon({
            ...quyHoaDon,
            sHinhThucThanhToan: hinhThucThanhToan.filter(
                (x: any) => x.id === quyHoaDon.hinhThucThanhToan
            )[0]?.text
        });
    }, [quyHoaDon.hinhThucThanhToan]);

    const validate = yup.object().shape({
        tongTienThu: yup
            .number()
            .transform((value: any, originalValue: any) => {
                return utils.formatNumberToFloat(originalValue);
            })
            .notOneOf([0], 'Tổng tiền phải > 0')
            .required('Vui lòng nhập số tiền'),
        idDoiTuongNopTien: yup.string().required('Vui lòng chọn đối tượng nộp tiền')
        // ngayLapHoaDon: yup.string().transform((value: any, originalValue: any) => {
        //     console.log('originalVal ', isDate(originalValue), value); // todo check ngaylap
        //     const parsedDate = isDate(originalValue)
        //         ? originalValue
        //         : parse(originalValue, 'yyyy-MM-dd HH:mm', new Date());

        //     return parsedDate;
        // })
    });

    return (
        <Dialog open={visiable} fullWidth maxWidth={'sm'}>
            <DialogTitle>
                <div className="row">
                    <Box className="col-8" sx={{ float: 'left' }}>
                        {utils.checkNull(idQuyHD) ? 'Thêm mới' : 'Cập nhật'} sổ quỹ
                    </Box>
                    <Box
                        className="col-4"
                        sx={{
                            float: 'right',
                            '& svg:hover': {
                                filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                            }
                        }}>
                        <CloseIcon
                            style={{ float: 'right', height: '24px', cursor: 'pointer' }}
                            onClick={onClose}
                        />
                    </Box>
                </div>
            </DialogTitle>
            <DialogContent>
                <Formik initialValues={quyHoaDon} validationSchema={validate} onSubmit={saveSoQuy}>
                    {(formik) => (
                        <>
                            {console.log(123, formik.values)}
                            <Form>
                                <Grid container rowGap={1} columnSpacing={2}>
                                    <Grid item xs={12} sm={12} lg={12}>
                                        <FormControlLabel
                                            value="end"
                                            control={
                                                <Radio
                                                    color="secondary"
                                                    value={11}
                                                    checked={quyHoaDon.idLoaiChungTu === 11}
                                                    onChange={() =>
                                                        setQuyHoaDon({
                                                            ...quyHoaDon,
                                                            idLoaiChungTu: 11
                                                        })
                                                    }
                                                />
                                            }
                                            label="Phiếu thu"
                                        />
                                        <FormControlLabel
                                            value="end"
                                            control={
                                                <Radio
                                                    color="secondary"
                                                    name="idLoaiChungTu"
                                                    value={12}
                                                    checked={quyHoaDon.idLoaiChungTu === 12}
                                                    onChange={() =>
                                                        setQuyHoaDon({
                                                            ...quyHoaDon,
                                                            idLoaiChungTu: 12
                                                        })
                                                    }
                                                />
                                            }
                                            label="Phiếu chi"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <span className="modal-lable">Ngày </span>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <ThemeProvider theme={themeDate}>
                                            <DateTimePickerCustom
                                                defaultVal={quyHoaDon.ngayLapHoaDon}
                                                handleChangeDate={(dt: string) => {
                                                    formik.setFieldValue('ngayLapHoaDon', dt);
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        ngayLapHoaDon: dt
                                                    });
                                                }}
                                                helperText={
                                                    formik.touched.idDoiTuongNopTien &&
                                                    formik.errors.idDoiTuongNopTien
                                                }
                                            />
                                        </ThemeProvider>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Stack direction="column" rowGap={1}>
                                            <span className="modal-lable">Mã phiếu </span>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                value={quyHoaDon.maHoaDon}
                                                onChange={(e) =>
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        maHoaDon: e.target.value
                                                    })
                                                }
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack
                                            direction="column"
                                            rowGap={1}
                                            sx={{
                                                '& legend': {
                                                    display: 'none'
                                                }
                                            }}>
                                            <span className="modal-lable">Hình thức </span>
                                            <SelectWithData
                                                data={hinhThucThanhToan}
                                                idChosed={quyHoaDon?.hinhThucThanhToan}
                                                handleChange={(item: any) =>
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        hinhThucThanhToan: item.id
                                                    })
                                                }
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack
                                            direction="column"
                                            rowGap={1}
                                            sx={{
                                                '& legend': {
                                                    display: 'none'
                                                }
                                            }}>
                                            <span className="modal-lable">Thu của </span>
                                            <SelectWithData
                                                data={doiTuongNopTien}
                                                idChosed={quyHoaDon?.loaiDoiTuong}
                                                handleChange={(item: any) =>
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        loaiDoiTuong: item.id
                                                    })
                                                }
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        pt={{ xs: 2, sm: '28px', lg: '28px' }}>
                                        {quyHoaDon.loaiDoiTuong !== 3 && (
                                            <>
                                                <AutocompleteCustomer
                                                    idChosed={quyHoaDon?.idDoiTuongNopTien}
                                                    handleChoseItem={(item: any) => {
                                                        {
                                                            formik.setFieldValue(
                                                                'idDoiTuongNopTien',
                                                                item?.id ?? null
                                                            );
                                                            setQuyHoaDon({
                                                                ...quyHoaDon,
                                                                idDoiTuongNopTien: item?.id,
                                                                maNguoiNop: item?.maKhachHang,
                                                                tenNguoiNop: item?.tenKhachHang
                                                            });
                                                        }
                                                    }}
                                                    error={
                                                        formik.touched.idDoiTuongNopTien &&
                                                        Boolean(formik.errors?.idDoiTuongNopTien)
                                                    }
                                                    helperText={
                                                        formik.touched.idDoiTuongNopTien &&
                                                        formik.errors.idDoiTuongNopTien
                                                    }
                                                />
                                            </>
                                        )}
                                        {quyHoaDon.loaiDoiTuong === 3 && (
                                            <>
                                                <AutocompleteNhanVien
                                                    value={quyHoaDon?.idDoiTuongNopTien}
                                                    dataNhanVien={allNhanVien}
                                                    handleChoseItem={(item: any) => {
                                                        {
                                                            console.log('item ', item);
                                                            formik.setFieldValue(
                                                                'idDoiTuongNopTien',
                                                                item?.id ?? null
                                                            );
                                                            setQuyHoaDon({
                                                                ...quyHoaDon,
                                                                idDoiTuongNopTien: item?.id,
                                                                maNguoiNop: item?.maNhanVien,
                                                                tenNguoiNop: item?.tenNhanVien
                                                            });
                                                        }
                                                    }}
                                                    error={
                                                        formik.touched.idDoiTuongNopTien &&
                                                        Boolean(formik.errors?.idDoiTuongNopTien)
                                                    }
                                                    helperText={
                                                        formik.touched.idDoiTuongNopTien &&
                                                        formik.errors.idDoiTuongNopTien
                                                    }
                                                />
                                            </>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <span className="modal-lable">Tiền thu </span>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <NumericFormat
                                            fullWidth
                                            thousandSeparator
                                            size="small"
                                            name="tongTienThu"
                                            // value={formik.values.tongTienThu}
                                            customInput={TextField}
                                            onChange={(e: any) => {
                                                formik.setFieldValue('tongTienThu', e.target.value);
                                                setQuyHoaDon({
                                                    ...quyHoaDon,
                                                    tongTienThu: utils.formatNumberToFloat(
                                                        e.target.value
                                                    )
                                                });
                                            }}
                                            error={
                                                formik.touched?.tongTienThu &&
                                                Boolean(formik.errors?.tongTienThu)
                                            }
                                            helperText={
                                                formik.touched.tongTienThu &&
                                                formik.errors.tongTienThu
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <span className="modal-lable">Tài khoản thu </span>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <AutocompleteCustomer />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <span className="modal-lable">Nội dung thu </span>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            size="small"
                                            multiline
                                            rows={3}
                                            fullWidth
                                            onChange={(e: any) =>
                                                setQuyHoaDon({
                                                    ...quyHoaDon,
                                                    noiDungThu: e.target.value
                                                })
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <FormGroup>
                                            <FormControlLabel
                                                value="end"
                                                control={
                                                    <Checkbox
                                                        name="ckHachToanKinhDoanh"
                                                        checked={
                                                            quyHoaDon.hachToanKinhDoanh === true
                                                        }
                                                        onChange={(e: any) => {
                                                            setQuyHoaDon({
                                                                ...quyHoaDon,
                                                                hachToanKinhDoanh: e.target.checked
                                                            });
                                                        }}
                                                        value="true"
                                                        sx={{
                                                            color: '#7C3367!important'
                                                        }}
                                                    />
                                                }
                                                label="Hạch toán vào kết quả hoạt động kinh doanh"
                                            />
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                                <DialogActions>
                                    <Button
                                        variant="outlined"
                                        sx={{ color: '#7C3367' }}
                                        className="btn-outline-hover"
                                        onClick={onClose}>
                                        Hủy
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: '#7C3367' }}
                                        className="btn-container-hover"
                                        type="submit"
                                        disabled={formik.isSubmitting}>
                                        Lưu
                                    </Button>
                                </DialogActions>
                            </Form>
                        </>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};
export default CreateOrEditSoQuyDialog;
