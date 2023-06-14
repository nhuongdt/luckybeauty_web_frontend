import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormGroup,
    Grid,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { Component, ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import { SuggestDonViQuiDoiDto } from '../../../services/suggests/dto/SuggestDonViQuiDoi';
import { SuggestKhachHangDto } from '../../../services/suggests/dto/SuggestKhachHangDto';
import { SuggestNhanSuDto } from '../../../services/suggests/dto/SuggestNhanSuDto';
import AppConsts from '../../../lib/appconst';
import datLichService from '../../../services/dat-lich/datLichService';
import Cookies from 'js-cookie';
interface ICreateOrEditProps {
    visible: boolean;
    onCancel: () => void;
    idLichHen: string;
    suggestDichVu: SuggestDonViQuiDoiDto[];
    suggestKhachHang: SuggestKhachHangDto[];
    suggestNhanVien: SuggestNhanSuDto[];
    onOk: () => void;
}

class CreateOrEditLichHenModal extends Component<ICreateOrEditProps> {
    handleSubmit = async (values: any) => {
        if (this.props.idLichHen === '') {
            await datLichService.CreateBooking({
                idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
                idDonViQuiDoi: values.idDonViQuiDoi,
                idKhachHang: values.idKhachHang,
                idNhanVien: values.idNhanVien,
                startHours: values.startHours,
                startTime: values.startTime,
                ghiChu: values.ghiChu,
                trangThai: values.trangThai
            });
        }
        this.props.onOk();
    };
    render(): ReactNode {
        const { visible, onCancel, idLichHen, suggestDichVu, suggestKhachHang, suggestNhanVien } =
            this.props;
        const initialValues = {
            id: '',
            idChiNhanh: '',
            startTime: '',
            startHours: '',
            trangThai: 0,
            ghiChu: '',
            idKhachHang: '',
            idNhanVien: '',
            idDonViQuiDoi: ''
        };

        return (
            <div>
                <Dialog open={visible} onClose={onCancel} fullWidth maxWidth="md">
                    <DialogTitle>
                        <Typography
                            variant="h3"
                            fontSize="24px"
                            color="rgb(51, 50, 51)"
                            fontWeight="700">
                            {idLichHen ? 'Cập nhật lịch hẹn' : 'Thêm mới lịch hẹn'}
                        </Typography>
                        <IconButton
                            aria-label="close"
                            onClick={onCancel}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Formik initialValues={initialValues} onSubmit={this.handleSubmit}>
                            {({ errors, touched, values, handleChange }) => (
                                <Form>
                                    <Grid container spacing={[8, 4]}>
                                        <Grid item xs={5}>
                                            <FormGroup>
                                                <Select
                                                    size="small"
                                                    name="idKhachHang"
                                                    onChange={handleChange}>
                                                    <MenuItem>
                                                        <Button>
                                                            <span
                                                                style={{
                                                                    marginLeft: '10px',
                                                                    textAlign: 'center'
                                                                }}>
                                                                Thêm khách hàng mới
                                                            </span>
                                                        </Button>
                                                    </MenuItem>
                                                    {suggestKhachHang.map((item) => (
                                                        <MenuItem key={item.id} value={item.id}>
                                                            {item.tenKhachHang} - {item.soDienThoai}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormGroup>
                                        </Grid>
                                        <Grid item xs={7} rowSpacing={4}>
                                            <Typography variant="subtitle1" fontSize="18px">
                                                Chi tiết cuộc hẹn
                                            </Typography>
                                            <FormGroup className="mt-4 mb-1">
                                                <Typography
                                                    variant="body1"
                                                    className="mb-1"
                                                    fontSize="14px">
                                                    Ngày
                                                </Typography>
                                                <TextField
                                                    type="date"
                                                    size="small"
                                                    name="startTime"
                                                    value={values.startTime}
                                                    onChange={handleChange}></TextField>
                                            </FormGroup>
                                            <Grid container item spacing={2}>
                                                <Grid item xs={8}>
                                                    <FormGroup className="mt-2 mb-1">
                                                        <Typography
                                                            variant="body1"
                                                            className="mb-2"
                                                            fontSize="14px">
                                                            Dịch vụ
                                                        </Typography>
                                                        <Select
                                                            fullWidth
                                                            size="small"
                                                            name="idDonViQuiDoi"
                                                            value={values.idDonViQuiDoi}
                                                            onChange={handleChange}>
                                                            {suggestDichVu.map((item) => (
                                                                <MenuItem
                                                                    key={item.id}
                                                                    value={item.id}>
                                                                    {item.tenDonVi}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <FormGroup className="mt-2 mb-1">
                                                        <Typography
                                                            variant="body1"
                                                            className="mb-1"
                                                            fontSize="14px">
                                                            Thời gian bắt đầu
                                                        </Typography>
                                                        <TextField
                                                            type="time"
                                                            size="small"
                                                            name="startHours"
                                                            value={values.startHours}
                                                            onChange={handleChange}></TextField>
                                                    </FormGroup>
                                                </Grid>
                                            </Grid>
                                            <Grid container item spacing={[4, 2]}>
                                                <Grid item xs={8}>
                                                    <FormGroup className="mt-2 mb-1">
                                                        <Typography
                                                            variant="body1"
                                                            className="mb-1"
                                                            fontSize="14px">
                                                            Nhân viên
                                                        </Typography>
                                                        <Select
                                                            fullWidth
                                                            size="small"
                                                            name="idNhanVien"
                                                            value={values.idNhanVien}
                                                            onChange={handleChange}>
                                                            {suggestNhanVien.map((item) => (
                                                                <MenuItem
                                                                    key={item.id}
                                                                    value={item.id}>
                                                                    {item.tenNhanVien}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <FormGroup className="mt-2 mb-1">
                                                        <Typography
                                                            variant="body1"
                                                            className="mb-1"
                                                            fontSize="14px">
                                                            Thời gian làm
                                                        </Typography>
                                                        <TextField
                                                            type="number"
                                                            size="small"></TextField>
                                                    </FormGroup>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <FormGroup className="mt-2 mb-1">
                                                    <Typography
                                                        variant="body1"
                                                        className="mb-1"
                                                        fontSize="14px">
                                                        Trạng thái
                                                    </Typography>
                                                    <Select
                                                        fullWidth
                                                        size="small"
                                                        name="trangThai"
                                                        value={values.trangThai}
                                                        onChange={handleChange}>
                                                        {AppConsts.trangThaiCheckIn.map((item) => (
                                                            <MenuItem
                                                                key={item.value}
                                                                value={item.value}>
                                                                {item.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormGroup>
                                            </Grid>
                                            <Grid item>
                                                <FormGroup className="mt-2 mb-4">
                                                    <Typography
                                                        variant="body1"
                                                        className="mb-1"
                                                        fontSize="14px">
                                                        Ghi chú
                                                    </Typography>
                                                    <TextField
                                                        type="text"
                                                        multiline
                                                        rows={4}
                                                        size="small"
                                                        name="ghiChu"
                                                        value={values.ghiChu}
                                                        onChange={handleChange}></TextField>
                                                </FormGroup>
                                            </Grid>
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
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    borderColor: '#7C3367!important',
                                                    color: '#7C3367'
                                                }}
                                                onClick={onCancel}>
                                                Hủy
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                type="submit"
                                                sx={{ backgroundColor: '#7C3367!important' }}>
                                                Lưu
                                            </Button>
                                        </Box>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
export default CreateOrEditLichHenModal;
