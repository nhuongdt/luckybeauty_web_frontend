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
    Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SelectWithData from '../../../../components/Menu/SelectWithData';
import { Formik, Form } from 'formik';
import { Component, ReactNode, useEffect, useState, useRef } from 'react';
import { CreateOrEditSoQuyDto } from '../../../../services/so_quy/Dto/CreateOrEditSoQuyDto';
import QuyChiTietDto from '../../../../services/so_quy/QuyChiTietDto';
import QuyHoaDonDto from '../../../../services/so_quy/QuyHoaDonDto';
import SoQuyServices from '../../../../services/so_quy/SoQuyServices';
import utils from '../../../../utils/utils';
import DateTimePickerCustom from '../../../../components/DatetimePicker/DateTimePickerCustom';
import AutocompleteCustomer from '../../../../components/Autocomplete/Customer';
import * as yup from 'yup';
import { useFormik, useFormikContext } from 'formik';

interface SoQuyDialogProps {
    visiable: boolean;
    onClose: () => void;
    onOk: () => void;
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
const CreateOrEditSoQuyDialog = ({
    visiable = false,
    idQuyHD = null,
    onClose,
    onOk
}: SoQuyDialogProps) => {
    const hinhThucThanhToan = [
        { id: 1, text: 'Tiền mặt' },
        { id: 2, text: 'POS' },
        { id: 2, text: 'Chuyển khoản' }
    ];

    const doiTuongNopTien = [
        { id: 1, text: 'Khách hàng' },
        { id: 2, text: 'POS' },
        { id: 4, text: 'Nhân viên' }
    ];
    const formRef = useRef();
    const [quyHoaDon, setQuyHoaDon] = useState<QuyHoaDonDto>(new QuyHoaDonDto({ id: '' }));
    const [chitietSoQuy, setChitietSoQuy] = useState<QuyChiTietDto>();

    const getInforQuyHoaDon = async () => {
        const data = await SoQuyServices.GetForEdit(idQuyHD ?? '');
        console.log(data);
        if (data !== null) setQuyHoaDon(data);
    };
    useEffect(() => {
        getInforQuyHoaDon();
    }, [idQuyHD]);

    const saveSoQuy = async () => {
        console.log(666);
        // const data = await SoQuyServices.CreateQuyHoaDon(quyHoaDon);
    };

    // const formik = useFormik({
    //     initialValues: {
    //         quyHoaDon
    //     },
    //     validationSchema: yup.object({
    //         tongTienThu: yup.string().required('Vui lòng nhập số tiền'),
    //         maNguoiNop: yup.string().required('Vui lòng chọn người nộp')
    //     }),
    //     onSubmit: (values) => {
    //         console.log('sau');
    //     }
    // });

    // const handleChange = (event: any) => {
    //     const value = event.target.value;
    // };

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
                <Formik
                    initialValues={quyHoaDon}
                    validationSchema={yup.object().shape({
                        tongTienThu: yup.string().required('Vui lòng nhập số tiền'),
                        maNguoiNop: yup.string().required('Vui lòng chọn người nộp')
                    })}
                    onSubmit={saveSoQuy}>
                    {({ values, handleChange, errors, touched }) => (
                        <>
                            <Form>
                                <Grid container rowGap={1} columnSpacing={2}>
                                    <Grid item xs={12} sm={12} lg={12}>
                                        <FormControlLabel
                                            value="end"
                                            control={
                                                <Radio
                                                    color="secondary"
                                                    checked={quyHoaDon?.idLoaiChungTu === 11}
                                                    onChange={handleChange}
                                                    value="Phiếu thu"
                                                    name="maPhieu"
                                                />
                                            }
                                            label="Phiếu thu"
                                        />
                                        <FormControlLabel
                                            value="end"
                                            control={
                                                <Radio
                                                    color="secondary"
                                                    checked={quyHoaDon.idLoaiChungTu === 12}
                                                    onChange={handleChange}
                                                    value="Phiếu chi"
                                                    name="maPhieu"
                                                />
                                            }
                                            label="Phiếu chi"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <span className="modal-lable">Ngày </span>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <DateTimePickerCustom />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Stack direction="column" rowGap={1}>
                                            <span className="modal-lable">Mã phiếu </span>
                                            <TextField size="small" fullWidth />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack direction="column" rowGap={1}>
                                            <span className="modal-lable">Hình thức </span>
                                            <SelectWithData data={hinhThucThanhToan} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack direction="column" rowGap={1}>
                                            <span className="modal-lable">Thu của </span>
                                            <SelectWithData data={doiTuongNopTien} />
                                        </Stack>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        pt={{ xs: 2, sm: '28px', lg: '28px' }}>
                                        {/* <AutocompleteCustomer /> */}
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <span className="modal-lable">Tiền thu </span>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            error={
                                                touched.tongTienThu && Boolean(errors?.tongTienThu)
                                            }
                                            helperText={touched.tongTienThu && errors.tongTienThu}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <span className="modal-lable">Tài khoản thu </span>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        {/* <AutocompleteCustomer /> */}
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <span className="modal-lable">Nội dung thu </span>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField size="small" multiline rows={3} fullWidth />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <FormGroup>
                                            <FormControlLabel
                                                value="end"
                                                control={
                                                    <Checkbox
                                                        //checked={values.maPhieu === 'Phiếu thu'}
                                                        onChange={handleChange}
                                                        value="Phiếu thu"
                                                        name="acb"
                                                        sx={{
                                                            color: '#7C3367'
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
                                        className="btn-outline-hover">
                                        Hủy
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: '#7C3367' }}
                                        className="btn-container-hover"
                                        type="submit">
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
