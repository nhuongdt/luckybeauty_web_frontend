import FilterDramaOutlinedIcon from '@mui/icons-material/FilterDramaOutlined';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
    Grid,
    TextField,
    Checkbox,
    Button
} from '@mui/material';
import { useState } from 'react';
import utils from '../../../../utils/utils';
import khachHangService from '../../../../services/khach-hang/khachHangService';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Guid } from 'guid-typescript';
import { CreateOrEditKhachHangDto } from '../../../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import ZaloService from '../../../../services/sms/gui_tin_nhan/ZaloService';
import { IMemberZOA } from '../../../../services/sms/gui_tin_nhan/zalo_dto';

export default function FormDangKyThanhVienZOA({ accountZOA }: any) {
    const [showModal, setShowModal] = useState(true);
    const [isCheckAgree, setIsCheckAgree] = useState(true);
    const newMember = { memberName: '', memberPhone: '' } as IMemberZOA;

    const rules = yup.object().shape({
        memberName: yup.string().required('Vui lòng nhập tên đăng ký'),
        memberPhone: yup.string().required('Vui lòng nhập SDT đăng ký')
    });

    const CheckSaveDB = async (values: IMemberZOA): Promise<string> => {
        const checkExistCustomer = await khachHangService.GetListCustomerId_byPhone(values?.memberPhone);
        if (checkExistCustomer !== null) {
            if (checkExistCustomer.length > 1) return '';
            return checkExistCustomer[0];
        }
        return Guid.EMPTY;
    };

    const GuiThongTinDangKy = async (values: IMemberZOA) => {
        const check = await CheckSaveDB(values);
        if (utils.checkNull(check)) {
            return; // exist > 1 customer
        }

        let idKhachHang = check;
        if (check === Guid.EMPTY) {
            // insert customer
            const customerNew = await khachHangService.createOrEdit({
                id: Guid.EMPTY,
                tenKhachHang: values.memberName,
                soDienThoai: values.memberPhone
            } as CreateOrEditKhachHangDto);
            idKhachHang = customerNew.id.toString();
        }
        // only insert thanhvien
        values.idKhachHang = idKhachHang;
        const newObj = await ZaloService.DangKyThanhVienZOA(values);

        setShowModal(false);
        // go to other page
    };

    return (
        <>
            <Dialog open={showModal} maxWidth="xl">
                <DialogTitle>Zalo</DialogTitle>
                <Formik
                    initialValues={newMember}
                    validationSchema={rules}
                    onSubmit={GuiThongTinDangKy}
                    enableReinitialize>
                    {({ isSubmitting, handleChange, values, errors, touched }: any) => (
                        <Form>
                            <DialogContent>
                                <Grid container padding={4}>
                                    <Grid item xs={12}>
                                        <Stack spacing={2} alignItems={'center'}>
                                            <Stack spacing={1} direction={'row'}>
                                                <FilterDramaOutlinedIcon sx={{ height: 80, color: '#9c27b0' }} />
                                                <Typography
                                                    sx={{
                                                        fontSize: '18px',
                                                        color: '#9c27b0',
                                                        fontFamily:
                                                            '"Roboto", "Helvetica Neue", "Helvetica", "Arial", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important'
                                                    }}>
                                                    Lucky Beauty
                                                </Typography>
                                                <FilterDramaOutlinedIcon sx={{ height: 80, color: '#9c27b0' }} />
                                            </Stack>
                                            <span>
                                                Gửi{' '}
                                                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                                                    {accountZOA?.name}
                                                </span>{' '}
                                                thông tin liên hệ của bạn
                                            </span>
                                        </Stack>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Họ tên"
                                            name="memberName"
                                            value={values.memberName}
                                            variant="outlined"
                                            helperText={
                                                touched.memberName &&
                                                errors.memberName && <span>{errors.memberName}</span>
                                            }
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Số điện thoại"
                                            name="memberPhone"
                                            value={values.memberPhone}
                                            variant="outlined"
                                            helperText={
                                                touched.memberPhone &&
                                                errors.memberPhone && <span>{errors.memberPhone}</span>
                                            }
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Checkbox
                                            value={isCheckAgree}
                                            onChange={(e) => {
                                                setIsCheckAgree(e.target.checked);
                                            }}
                                        />{' '}
                                        Đồng ý cung cấp thông tin cho {accountZOA?.name}
                                    </Grid>
                                </Grid>
                                <Grid container paddingTop={4}>
                                    {isSubmitting ? (
                                        <Grid item xs={12}>
                                            <Button variant="contained" fullWidth>
                                                ĐANG GỬI THÔNG TIN
                                            </Button>
                                        </Grid>
                                    ) : (
                                        <Grid item xs={12}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                type="submit"
                                                disabled={!isCheckAgree}>
                                                GỬI THÔNG TIN
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </DialogContent>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
}
