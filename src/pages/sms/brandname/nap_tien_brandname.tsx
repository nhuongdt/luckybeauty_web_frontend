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

import { ReactComponent as CloseIcon } from '../../../../images/close-square.svg';
import { Formik, Form } from 'formik';
import { useEffect, useState, useRef, useContext } from 'react';
import { NumericFormat } from 'react-number-format';
import utils from '../../../utils/utils';
import DateTimePickerCustom from '../../../components/DatetimePicker/DateTimePickerCustom';
import AutocompleteCustomer from '../../../components/Autocomplete/Customer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as yup from 'yup';
import { useFormik, useFormikContext } from 'formik';
import { addDays, format, isDate, parse } from 'date-fns';
import AppConsts, { ISelect } from '../../../lib/appconst';
import { Guid } from 'guid-typescript';
import { AppContext, ChiNhanhContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import { TrendingUpTwoTone } from '@mui/icons-material';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import QuyChiTietDto from '../../../services/so_quy/QuyChiTietDto';
import SelectWithData from '../../../components/Menu/SelectWithData';
import DialogButtonClose from '../../../components/Dialog/ButtonClose';
import AutocompleteFromDB from '../../../components/Autocomplete/AutocompleteFromDB';

const NapTienBrandname = ({ visiable = false, idQuyHD = null, onClose, onOk }: any) => {
    const doiTuongNopTien = [
        { value: 1, text: 'Khách hàng' },
        // { id: 2, text: 'Nhà cung cấp' },
        { value: 3, text: 'Nhân viên' }
    ];

    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

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
        const data = await SoQuyServices.GetInforQuyHoaDon_byId(idQuyHD ?? '');
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
                    idTaiKhoanNganHang: quyCT[0].idTaiKhoanNganHang,
                    quyHoaDon_ChiTiet: quyCT
                });
            }
        }
    };

    const PageLoad = () => {
        //
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
                idTaiKhoanNganHang: null,
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
        const idKhachHang = (
            quyHoaDon.loaiDoiTuong == 3 ? null : quyHoaDon.idDoiTuongNopTien
        ) as null;
        const idNhanVien = (
            quyHoaDon.loaiDoiTuong == 3 ? quyHoaDon.idDoiTuongNopTien : null
        ) as null;

        if (utils.checkNull(idQuyHD)) {
            // insert
            const quyCT = new QuyChiTietDto({
                idKhachHang: idKhachHang,
                hinhThucThanhToan: quyHoaDon.hinhThucThanhToan,
                tienThu: quyHoaDon.tongTienThu,
                idNhanVien: idNhanVien,
                idKhoanThuChi: quyHoaDon.idKhoanThuChi as null,
                idTaiKhoanNganHang: quyHoaDon.idTaiKhoanNganHang as null
            });
            myData.quyHoaDon_ChiTiet = [quyCT];
            const data = await SoQuyServices.CreateQuyHoaDon(myData);
            quyHoaDon.id = data.id;
            quyHoaDon.maHoaDon = data.maHoaDon;
            quyHoaDon.txtTrangThai = 'Đã thanh toán';
            onOk(quyHoaDon, 1);
        } else {
            // update
            // assign again ctquy
            myData.quyHoaDon_ChiTiet = quyHoaDon.quyHoaDon_ChiTiet?.map((x: any) => {
                return {
                    id: x.id,
                    idQuyHoaDon: x.idQuyHoaDon,
                    idKhachHang: idKhachHang,
                    hinhThucThanhToan: quyHoaDon.hinhThucThanhToan,
                    tienThu: quyHoaDon.tongTienThu,
                    idNhanVien: idNhanVien,
                    idKhoanThuChi: quyHoaDon.idKhoanThuChi as null,
                    diemThanhToan: x.diemThanhToan,
                    chiPhiNganHang: x.chiPhiNganHang,
                    idTaiKhoanNganHang: quyHoaDon.idTaiKhoanNganHang,
                    laPTChiPhiNganHang: x.laPTChiPhiNganHang,
                    thuPhiTienGui: x.thuPhiTienGui
                } as QuyChiTietDto;
            });
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
            sHinhThucThanhToan: AppConsts.hinhThucThanhToan.filter(
                (x: ISelect) => x.value === quyHoaDon.hinhThucThanhToan
            )[0]?.text
        });
    }, [quyHoaDon.hinhThucThanhToan]);

    // todo validate ngaylapHoaDon
    const validate = yup.object().shape({
        hinhThucThanhToan: yup.number(),
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
        // idTaiKhoanNganHang: yup
        //     .string()
        //     .when('hinhThucThanhToan', ([hinhThucThanhToan], schema) => {
        //         if (hinhThucThanhToan !== 1)
        //             return yup.string().required('Vui lòng chọn tài khoản ngân hàng');
        //         return schema;
        //     })
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
                    <Box className="modal-title" sx={{ float: 'left' }}>
                        {utils.checkNull(idQuyHD) ? 'Thêm mới' : 'Cập nhật'} phiếu nạp tiền
                    </Box>
                    <DialogButtonClose onClose={onClose} />
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={quyHoaDon}
                        validationSchema={validate}
                        onSubmit={saveSoQuy}
                        enableReinitialize>
                        {(formik) => (
                            <>
                                <Form>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <AutocompleteFromDB type="brandname" idChosed="" />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <DateTimePickerCustom
                                                defaultVal={quyHoaDon.ngayLapHoaDon}
                                                labelText="Ngày lập phiếu"
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
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                label="Mã phiếu"
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
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <SelectWithData
                                                label="Hình thức"
                                                data={AppConsts.hinhThucThanhToan}
                                                idChosed={quyHoaDon?.hinhThucThanhToan}
                                                handleChange={(item: ISelect) =>
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        hinhThucThanhToan: item.value
                                                    })
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <SelectWithData
                                                label="Đối tượng nộp"
                                                data={doiTuongNopTien}
                                                idChosed={quyHoaDon?.loaiDoiTuong}
                                                handleChange={(item: any) =>
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        loaiDoiTuong: item.value
                                                    })
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
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
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <NumericFormat
                                                fullWidth
                                                size="small"
                                                name="tongTienThu"
                                                label={`Tiền ${sLoai}`}
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
                                            <TextField
                                                size="small"
                                                multiline
                                                rows={3}
                                                fullWidth
                                                label={`Nội dung ${sLoai}`}
                                                value={quyHoaDon?.noiDungThu}
                                                onChange={(e: any) =>
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        noiDungThu: e.target.value
                                                    })
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} style={{ display: 'none' }}>
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
                                        <Grid item xs={12}>
                                            <Stack
                                                spacing={1}
                                                direction={'row'}
                                                justifyContent={'flex-end'}>
                                                <Button
                                                    variant="outlined"
                                                    sx={{ color: 'var(--color-main)' }}
                                                    className="btn-outline-hover"
                                                    onClick={onClose}>
                                                    Hủy
                                                </Button>
                                                {!formik.isSubmitting ? (
                                                    <Button
                                                        variant="contained"
                                                        sx={{ bgcolor: '#7C3367' }}
                                                        className="btn-container-hover"
                                                        type="submit">
                                                        Lưu
                                                    </Button>
                                                ) : (
                                                    formik.isSubmitting && (
                                                        <Button
                                                            variant="contained"
                                                            sx={{ bgcolor: '#7C3367' }}
                                                            className="btn-container-hover"
                                                            type="submit">
                                                            Đang lưu
                                                        </Button>
                                                    )
                                                )}

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
                                                                            quyHoaDon?.loaiPhieu ??
                                                                            ' '
                                                                        }  ${
                                                                            quyHoaDon?.maHoaDon ??
                                                                            ' '
                                                                        } không?`
                                                                    })
                                                                );
                                                            }}>
                                                            Xóa
                                                        </Button>
                                                    </>
                                                )}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Form>
                            </>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default NapTienBrandname;
