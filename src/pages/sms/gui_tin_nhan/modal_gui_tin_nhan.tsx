import { useEffect, useState } from 'react';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import { CreateOrEditSMSDto } from '../../../services/sms/gui_tin_nhan/create_or_edit_sms_dto';
import utils from '../../../utils/utils';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Button, TextField } from '@mui/material';
import DialogButtonClose from '../../../components/Dialog/ButtonClose';
import { Form, Formik } from 'formik';
import * as yup from 'yup';

export default function ModalGuiTinNhan({ isShow, idTinNhan, onClose }: any) {
    const [newSMS, setNewSMS] = useState<CreateOrEditSMSDto>(new CreateOrEditSMSDto({}) as CreateOrEditSMSDto);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    useEffect(() => {
        if (isShow) {
            if (utils.checkNull(idTinNhan)) {
                setNewSMS(new CreateOrEditSMSDto({}) as CreateOrEditSMSDto);
            } else {
                // get data from db
            }
        }
    }, [isShow]);

    const rules = yup.object().shape({
        idKhachHang: yup.string().required('Vui lòng chọn khách hàng')
    });

    const saveSMS = async (params: any) => {
        //
    };
    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Dialog open={isShow} onClose={onClose} aria-labelledby="draggable-dialog-title" maxWidth="xs">
                <DialogTitle className="modal-title" id="draggable-dialog-title">
                    {utils.checkNull(idTinNhan) ? 'Thêm' : 'Cập nhật'} brandname
                </DialogTitle>
                <DialogButtonClose onClose={onClose} />
                <Formik initialValues={newSMS} validationSchema={rules} onSubmit={saveSMS} enableReinitialize>
                    {({ isSubmitting, handleChange, values, errors, touched, setFieldValue }: any) => (
                        <Form>
                            <DialogContent sx={{ overflow: 'unset' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}></Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            name="brandname"
                                            fullWidth
                                            autoFocus
                                            label={`Tên brandname *`}
                                            onChange={handleChange}
                                            value={values.brandname}
                                            helperText={
                                                touched.brandname && errors.brandname && <span>{errors.brandname}</span>
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
                                                errors.sdtCuaHang && <span>{errors.sdtCuaHang}</span>
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}></Grid>
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
