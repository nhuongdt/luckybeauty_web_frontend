import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Grid,
    Radio,
    TextField,
    Stack,
    debounce
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SelectWithData from '../../../../components/Menu/SelectWithData';
import { Formik, Form } from 'formik';
import { useEffect, useState, useRef, useContext } from 'react';
import { NumericFormat } from 'react-number-format';
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
import AppConsts from '../../../../lib/appconst';
import { Guid } from 'guid-typescript';
import { ChiNhanhContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
import nhanVienService from '../../../../services/nhan-vien/nhanVienService';
import NhanSuItemDto from '../../../../services/nhan-vien/dto/nhanSuItemDto';
import AutocompleteNhanVien from '../../../../components/Autocomplete/NhanVien';
import ConfirmDelete from '../../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../../utils/PropParentToChild';
import { TrendingUpTwoTone } from '@mui/icons-material';

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
    console.log('CreateOrEditSoQuyDialog ');

    const formRef = useRef();
    const chinhanh = useContext(ChiNhanhContext);
    const [errMaHoadon, setErrMaHoaDon] = useState('');
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);
    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    const [quyHoaDon, setQuyHoaDon] = useState<QuyHoaDonDto>(
        new QuyHoaDonDto({
            id: Guid.create().toString(),
            idChiNhanh: chinhanh.id,
            idLoaiChungTu: 11,
            tongTienThu: 0,
            idDoiTuongNopTien: null,
            hinhThucThanhToan: 1,
            hachToanKinhDoanh: true,
            ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm')
        })
    );
    const sLoai = quyHoaDon?.idLoaiChungTu === 11 ? 'thu' : 'chi';

    const getInforQuyHoaDon = async () => {
        if (utils.checkNull(idQuyHD)) return;
        const data = await SoQuyServices.GetForEdit(idQuyHD ?? '');
        if (data !== null) {
            const quyCT = data.quyHoaDon_ChiTiet;

            if (quyCT !== undefined && quyCT?.length > 0) {
                setQuyHoaDon({
                    ...quyHoaDon,
                    id: data.id,
                    idChiNhanh: data.idChiNhanh,
                    idLoaiChungTu: data.idLoaiChungTu,
                    ngayLapHoaDon: data.ngayLapHoaDon,
                    maHoaDon: data.maHoaDon,
                    noiDungThu: data.noiDungThu,
                    tongTienThu: data.tongTienThu,
                    hachToanKinhDoanh: data.hachToanKinhDoanh,
                    loaiDoiTuong: quyCT[0]?.idNhanVien != null ? 3 : 1,
                    idDoiTuongNopTien:
                        quyCT[0]?.idNhanVien != null ? quyCT[0]?.idNhanVien : quyCT[0]?.idKhachHang,
                    hinhThucThanhToan: quyCT[0].hinhThucThanhToan,
                    idKhoanThuChi: quyCT[0].idKhoanThuChi,
                    quyHoaDon_ChiTiet: quyCT
                });
            }
        }
    };
    const GetListNhanVien = async () => {
        const data = await nhanVienService.search('', { skipCount: 0, maxResultCount: 100 });
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
            if (visiable) getInforQuyHoaDon();
        }
    }, [visiable]);

    const deleteSoQuy = () => {
        setinforDelete({ ...inforDelete, show: false });
        onOk(quyHoaDon, 3);
    };

    const saveSoQuy = async () => {
        const myData = { ...quyHoaDon };
        // assign again ctquy
        myData.quyHoaDon_ChiTiet = quyHoaDon.quyHoaDon_ChiTiet?.map((x: any) => {
            return {
                id: x.id,
                idQuyHoaDon: x.idQuyHoaDon,
                idKhachHang: (quyHoaDon.loaiDoiTuong == 3
                    ? null
                    : quyHoaDon.idDoiTuongNopTien) as null,
                hinhThucThanhToan: quyHoaDon.hinhThucThanhToan,
                tienThu: quyHoaDon.tongTienThu,
                idNhanVien: (quyHoaDon.loaiDoiTuong == 3
                    ? quyHoaDon.idDoiTuongNopTien
                    : null) as null,
                idKhoanThuChi: quyHoaDon.idKhoanThuChi as null,
                diemThanhToan: x.diemThanhToan,
                chiPhiNganHang: x.chiPhiNganHang,
                idTaiKhoanNganHang: x.idTaiKhoanNganHang,
                laPTChiPhiNganHang: x.laPTChiPhiNganHang,
                thuPhiTienGui: x.thuPhiTienGui
            } as QuyChiTietDto;
        });
        console.log('myData', myData);
        if (utils.checkNull(idQuyHD)) {
            const data = await SoQuyServices.CreateQuyHoaDon(myData);
            quyHoaDon.id = data.id;
            quyHoaDon.maHoaDon = data.maHoaDon;
            quyHoaDon.txtTrangThai = 'Đã thanh toán';
            onOk(quyHoaDon, 1);
        } else {
            const data = await SoQuyServices.UpdateQuyHoaDon(myData);
            quyHoaDon.id = data.id;
            quyHoaDon.maHoaDon = data.maHoaDon;
            quyHoaDon.txtTrangThai = 'Đã thanh toán';
            onOk(quyHoaDon, 2);
        }
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

    // todo validate ngaylapHoaDon
    const validate = yup.object().shape({
        // check dc mã, nhưng call API quá nhiều lần
        maHoaDon: yup.string().test('maHoaDon', 'Mã phiếu đã tồn tại', async () => {
            if (!utils.checkNull(quyHoaDon?.maHoaDon)) {
                const response = await SoQuyServices.CheckExistsMaPhieuThuChi(
                    quyHoaDon?.maHoaDon ?? '',
                    idQuyHD
                );
                return !response;
            }
            return true;
        }),
        tongTienThu: yup
            .number()
            .transform((value: any, originalValue: any) => {
                return utils.formatNumberToFloat(originalValue);
            })
            .notOneOf([0], 'Tổng tiền phải > 0')
            .required('Vui lòng nhập số tiền'),
        idDoiTuongNopTien: yup.string().required('Vui lòng chọn đối tượng nộp tiền')
    });

    return (
        <>
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={deleteSoQuy}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <Dialog open={visiable} fullWidth maxWidth={'sm'} onClose={onClose}>
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
                    <Formik
                        initialValues={quyHoaDon}
                        validationSchema={validate}
                        onSubmit={saveSoQuy}
                        enableReinitialize>
                        {(formik) => (
                            <>
                                {console.log('formik ', formik.values)}
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
                                                    onChange={(e) => {
                                                        formik.setFieldValue(
                                                            'maHoaDon',
                                                            e.target.value
                                                        );
                                                        setQuyHoaDon({
                                                            ...quyHoaDon,
                                                            maHoaDon: e.target.value
                                                        });
                                                    }}
                                                    helperText={
                                                        formik.touched.maHoaDon &&
                                                        formik.errors.maHoaDon
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
                                                <span className="modal-lable">
                                                    {utils.FirstChar_UpperCase(sLoai)}{' '}
                                                    {quyHoaDon?.idLoaiChungTu == 11 ? 'của' : 'cho'}
                                                </span>
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
                                                            Boolean(
                                                                formik.errors?.idDoiTuongNopTien
                                                            )
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
                                                        idChosed={quyHoaDon?.idDoiTuongNopTien}
                                                        dataNhanVien={allNhanVien}
                                                        handleChoseItem={(item: any) => {
                                                            {
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
                                                            Boolean(
                                                                formik.errors?.idDoiTuongNopTien
                                                            )
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
                                            <span className="modal-lable">Tiền {sLoai} </span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <NumericFormat
                                                fullWidth
                                                size="small"
                                                name="tongTienThu"
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                value={quyHoaDon?.tongTienThu}
                                                customInput={TextField}
                                                onChange={(e: any) => {
                                                    formik.setFieldValue(
                                                        'tongTienThu',
                                                        e.target.value
                                                    );
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
                                            <span className="modal-lable">Tài khoản {sLoai} </span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <AutocompleteCustomer />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <span className="modal-lable">Nội dung {sLoai} </span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                size="small"
                                                multiline
                                                rows={3}
                                                fullWidth
                                                value={quyHoaDon?.noiDungThu}
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
                                                                    hachToanKinhDoanh:
                                                                        e.target.checked
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
                                        {!utils.checkNull(idQuyHD) && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    sx={{ bgcolor: 'red' }}
                                                    className="btn-container-hover"
                                                    onClick={() => {
                                                        setinforDelete(
                                                            new PropConfirmOKCancel({
                                                                show: true,
                                                                title: 'Xác nhận xóa',
                                                                mes: `Bạn có chắc chắn muốn xóa ${
                                                                    quyHoaDon?.loaiPhieu ?? ' '
                                                                }  ${
                                                                    quyHoaDon?.maHoaDon ?? ' '
                                                                } không?`
                                                            })
                                                        );
                                                    }}>
                                                    Xóa
                                                </Button>
                                            </>
                                        )}

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
        </>
    );
};
export default CreateOrEditSoQuyDialog;
