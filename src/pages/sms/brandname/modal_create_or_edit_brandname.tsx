import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    DialogActions,
    TextField,
    Button,
    Stack,
    Typography,
    Checkbox,
    Radio
} from '@mui/material';
import DialogButtonClose from '../../../components/Dialog/ButtonClose';
import utils from '../../../utils/utils';
import { useEffect, useState } from 'react';
import { BrandnameDto } from '../../../services/sms/brandname/BrandnameDto';
import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import BrandnameService from '../../../services/sms/brandname/BrandnameService';
import { IOSSwitch } from '../../../components/Switch/IOSSwitch';
import { Guid } from 'guid-typescript';

export default function ModalCreateOrEditBrandname({
    isShow,
    idBrandname,
    onClose,
    objUpdate,
    onSave
}: any) {
    const [objBrandname, setObjBrandname] = useState<BrandnameDto>({
        id: '',
        brandname: '',
        sdtCuaHang: '',
        ngayKichHoat: new Date(),
        trangThai: 1
    } as BrandnameDto);

    useEffect(() => {
        if (isShow) {
            if (utils.checkNull(idBrandname)) {
                setObjBrandname({
                    ...objBrandname,
                    id: '',
                    brandname: '',
                    sdtCuaHang: '',
                    ngayKichHoat: new Date(),
                    trangThai: 1
                } as BrandnameDto);
            } else {
                // get data from db
                setObjBrandname({
                    ...objBrandname,
                    id: objUpdate.id,
                    brandname: objUpdate.brandname,
                    sdtCuaHang: objUpdate.sdtCuaHang,
                    ngayKichHoat: objUpdate.ngayKichHoat,
                    trangThai: objUpdate.trangThai
                } as BrandnameDto);
            }
        }
    }, [isShow]);

    const checkSaveDB = async () => {
        // brandname exist
        return true;
    };
    const saveBrandname = async (values: BrandnameDto) => {
        const check = await checkSaveDB();
        if (!check) return;

        console.log('save_values ', values);
        if (utils.checkNull(idBrandname)) {
            values.id = Guid.EMPTY;
        }
        const data = await BrandnameService.CreateBrandname(values);
        if (utils.checkNull(idBrandname)) {
            data.txtTrangThai = values.trangThai === 1 ? 'Kích hoạt' : 'Chưa kích hoạt';
            data.tongTienNap = 0;
            data.daSuDung = 0;
            data.conLai = 0;
        }
        onSave(data);
    };

    const rules = yup.object().shape({
        brandname: yup.string().required('Vui lòng nhập tên brandname'),
        sdtCuaHang: yup.string().required('Vui lòng nhập số điện thoại gửi tin')
    });

    return (
        <>
            <Dialog
                open={isShow}
                onClose={onClose}
                aria-labelledby="draggable-dialog-title"
                maxWidth="xs">
                <DialogTitle className="modal-title" id="draggable-dialog-title">
                    {utils.checkNull(idBrandname) ? 'Thêm' : 'Cập nhật'} brandname
                </DialogTitle>
                <DialogButtonClose onClose={onClose} />
                <Formik
                    initialValues={objBrandname}
                    validationSchema={rules}
                    onSubmit={saveBrandname}>
                    {({
                        isSubmitting,
                        handleChange,
                        values,
                        errors,
                        touched,
                        setFieldValue
                    }: any) => (
                        <Form>
                            <DialogContent sx={{ overflow: 'unset' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                            <Typography variant="body2">Kích hoạt</Typography>
                                            <IOSSwitch
                                                sx={{ m: 1 }}
                                                value={values.trangThai == 1 ? true : false}
                                                checked={values.trangThai == 1 ? true : false}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            name="brandname"
                                            fullWidth
                                            autoFocus
                                            label={`Tên brandname *`}
                                            onChange={handleChange}
                                            value={values.brandName}
                                            helperText={
                                                touched.brandName &&
                                                errors.brandName && <span>{errors.brandName}</span>
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            name="sdtCuaHang"
                                            fullWidth
                                            label={`Số điện thoại`}
                                            onChange={handleChange}
                                            value={values.sdtCuaHang}
                                            helperText={
                                                touched.sdtCuaHang &&
                                                errors.sdtCuaHang && (
                                                    <span>{errors.sdtCuaHang}</span>
                                                )
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <DatePickerCustom
                                            label="Ngày kích hoạt"
                                            props={{ width: '100%', label: 'Ngày kích hoạt' }}
                                            defaultVal={values.ngayKichHoat}
                                            handleChangeDate={(newVal: string) =>
                                                setFieldValue('ngayKichHoat', newVal)
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions style={{ paddingBottom: '20px' }}>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: 'var(--color-main)'
                                    }}
                                    onClick={onClose}
                                    className="btn-outline-hover">
                                    Hủy
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ bgcolor: 'var(--color-main)!important' }}
                                    type="submit"
                                    className="btn-container-hover">
                                    Lưu
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
}
