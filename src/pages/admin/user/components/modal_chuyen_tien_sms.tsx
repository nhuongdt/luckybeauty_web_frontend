import { Box, Button, Typography, Dialog, DialogContent, DialogTitle, Grid, TextField, Stack } from '@mui/material';

import { Formik, Form } from 'formik';
import { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import * as yup from 'yup';
import { format } from 'date-fns';
import { Guid } from 'guid-typescript';
import { AppContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
import { PropConfirmOKCancel } from '../../../../utils/PropParentToChild';
import SoQuyServices from '../../../../services/so_quy/SoQuyServices';
import utils from '../../../../utils/utils';
import QuyChiTietDto from '../../../../services/so_quy/QuyChiTietDto';
import BrandnameService from '../../../../services/sms/brandname/BrandnameService';
import LichSuNap_ChuyenTienService from '../../../../services/sms/lich_su_nap_tien/LichSuNap_ChuyenTienService';
import ILichSuNap_ChuyenTienDto from '../../../../services/sms/lich_su_nap_tien/ILichSuNap_ChuyenTienDto';
import AppConsts, { ISelect } from '../../../../lib/appconst';
import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';
import ConfirmDelete from '../../../../components/AlertDialog/ConfirmDelete';
import DialogButtonClose from '../../../../components/Dialog/ButtonClose';
import AutocompleteWithData from '../../../../components/Autocomplete/AutocompleteWithData';
import { GetAllUserOutput } from '../../../../services/user/dto/getAllUserOutput';
import { IDataAutocomplete } from '../../../../services/dto/IDataAutocomplete';
import Cookies from 'js-cookie';
import userService from '../../../../services/user/userService';
import { PagedUserResultRequestDto } from '../../../../services/user/dto/PagedUserResultRequestDto';

const ModalChuyenTienSMS = ({ visiable = false, idNhatKyNapTien = null, onClose, onOk }: any) => {
    const userLogin = Cookies.get('userId');
    const [soduTaiKhoan, setSoDuTaiKhoan] = useState(0);
    const [allUser, setAllUser] = useState<GetAllUserOutput[]>([]);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [objChuyenTien, setObjChuyenTien] = useState<ILichSuNap_ChuyenTienDto>({
        id: ''
    } as ILichSuNap_ChuyenTienDto);
    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    const GetAllUser = async () => {
        const data = await userService.getAll({
            skipCount: 0,
            maxResultCount: 500,
            keyword: ''
        } as PagedUserResultRequestDto);
        if (data) {
            console.log('dât ', data);
            setAllUser(data.items);
        }
    };

    const GetBrandnameBalance_byUserLogin = async () => {
        const data = await LichSuNap_ChuyenTienService.GetBrandnameBalance_byUserLogin();
        if (data != null) {
            setSoDuTaiKhoan(data);
        }
    };

    const PageLoad = async () => {
        await GetAllUser();
        await GetBrandnameBalance_byUserLogin();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    const getInforPhieuNapTien = async () => {
        if (utils.checkNull(idNhatKyNapTien)) return;
    };

    useEffect(() => {
        if (utils.checkNull(idNhatKyNapTien)) {
            setObjChuyenTien({
                ...objChuyenTien,
                idNguoiChuyenTien: userLogin as unknown as number,
                idNguoiNhanTien: 0,
                thoiGianNap_ChuyenTien: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
            });
        } else {
            // update
            if (visiable) getInforPhieuNapTien();
        }
    }, [visiable]);

    const deleteSoQuy = () => {
        setinforDelete({ ...inforDelete, show: false });
    };

    const savePhieuChuyenTien = async (values: ILichSuNap_ChuyenTienDto) => {
        const tongThu = utils.formatNumberToFloat(values.soTienChuyen_Nhan);
        const myData = { ...values };
        myData.soTienChuyen_Nhan = tongThu;

        if (utils.checkNull(idNhatKyNapTien)) {
            // insert
            const naptien = await LichSuNap_ChuyenTienService.ThemMoiPhieuChuyenTien(myData);
            values.id = naptien.id;
            setObjAlert({ ...objAlert, show: true, mes: 'Thêm phiếu chuyển tiền thành công' });
            onOk(values, 1);
        } else {
            // update
            // assign again ctquy
            setObjAlert({ ...objAlert, show: true, mes: 'Cập nhật phiếu chuyển tiền thành công' });

            onOk(values, 2);
        }
    };

    // todo validate ngaylapHoaDon
    const validate = yup.object().shape({
        idNguoiNhanTien: yup.string().required('Vui lòng chọn người nhận tiền'),
        soTienChuyen_Nhan: yup
            .number()
            .transform((value: any, originalValue: any) => {
                return utils.formatNumberToFloat(originalValue);
            })
            .notOneOf([0], 'Tổng tiền chuyển phải > 0')
            .required('Vui lòng nhập số tiền')
    });

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={deleteSoQuy}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <Dialog open={visiable} fullWidth maxWidth={'sm'} onClose={onClose}>
                <DialogTitle>
                    <Box className="modal-title" sx={{ float: 'left' }}>
                        {utils.checkNull(idNhatKyNapTien) ? 'Thêm mới' : 'Cập nhật'} phiếu chuyển tiền
                    </Box>
                    <DialogButtonClose onClose={onClose} />
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={objChuyenTien}
                        validationSchema={validate}
                        onSubmit={savePhieuChuyenTien}
                        enableReinitialize>
                        {({ isSubmitting, values, errors, touched, setFieldValue }: any) => (
                            <Form>
                                <Grid container spacing={2} marginTop={0.5}>
                                    <Grid item xs={12}>
                                        <AutocompleteWithData
                                            label="Người gửi"
                                            idChosed={values?.idNguoiChuyenTien}
                                            lstData={allUser
                                                // ?.filter((x: GetAllUserOutput) => x.id === values?.idNguoiChuyenTien)
                                                .map((x: GetAllUserOutput) => {
                                                    return { id: x.id, text1: x.userName, text2: x.surname };
                                                })}
                                            handleChoseItem={(item: IDataAutocomplete) => {
                                                setFieldValue('idNguoiChuyenTien', item?.id);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <AutocompleteWithData
                                            label="Người nhận"
                                            idChosed={values?.idNguoiNhanTien}
                                            lstData={allUser
                                                // ?.filter((x: GetAllUserOutput) => x.id === values?.idNguoiNhanTien)
                                                .map((x: GetAllUserOutput) => {
                                                    return { id: x.id, text1: x.userName, text2: x.surname };
                                                })}
                                            handleChoseItem={(item: IDataAutocomplete) => {
                                                setFieldValue('idNguoiNhanTien', item?.id);
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={12}>
                                        <NumericFormat
                                            fullWidth
                                            size="small"
                                            label={`Số tiền`}
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            value={values?.tongTienThu}
                                            customInput={TextField}
                                            onChange={(e) => {
                                                setFieldValue('soTienChuyen_Nhan', e.target.value);
                                            }}
                                            error={touched?.tongTienThu && Boolean(errors?.tongTienThu)}
                                            helperText={touched.tongTienThu && errors.tongTienThu}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={12}>
                                        <Stack spacing={1}>
                                            <TextField
                                                size="small"
                                                multiline
                                                rows={3}
                                                fullWidth
                                                label={`Nội dung`}
                                                value={values?.noiDungThu}
                                                onChange={(e) => setFieldValue('noiDungChuyen_Nhan', e.target.value)}
                                            />
                                            <Stack justifyContent={'flex-end'} direction={'row'}>
                                                <Typography fontSize={'14px'}>
                                                    {new Intl.NumberFormat('vi-VN').format(soduTaiKhoan)}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1} direction={'row'} justifyContent={'flex-end'}>
                                            <Button
                                                variant="outlined"
                                                sx={{ color: 'var(--color-main)' }}
                                                className="btn-outline-hover"
                                                onClick={onClose}>
                                                Hủy
                                            </Button>
                                            {!isSubmitting ? (
                                                <Button
                                                    variant="contained"
                                                    sx={{ bgcolor: '#7C3367' }}
                                                    className="btn-container-hover"
                                                    type="submit">
                                                    Lưu
                                                </Button>
                                            ) : (
                                                isSubmitting && (
                                                    <Button
                                                        variant="contained"
                                                        sx={{ bgcolor: '#7C3367' }}
                                                        className="btn-container-hover"
                                                        type="submit">
                                                        Đang lưu
                                                    </Button>
                                                )
                                            )}

                                            {!utils.checkNull(idNhatKyNapTien) && (
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
                                                                    mes: `Bạn có chắc chắn muốn xóa phiếu chuyển tiền này không?`
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
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default ModalChuyenTienSMS;
