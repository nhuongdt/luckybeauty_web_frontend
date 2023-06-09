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
interface ICreateOrEditProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    suggestDichVu: SuggestDonViQuiDoiDto[];
    suggestKhachHang: SuggestKhachHangDto[];
    suggestNhanVien: SuggestNhanSuDto[];
    onOk: () => void;
}

class CreateOrEditLichHenModal extends Component<ICreateOrEditProps> {
    render(): ReactNode {
        const { visible, onCancel, modalType, suggestDichVu, suggestKhachHang, suggestNhanVien } =
            this.props;
        return (
            <Dialog open={visible} onClose={onCancel} fullWidth maxWidth="md">
                <DialogTitle>
                    <Typography
                        variant="h3"
                        fontSize="24px"
                        color="rgb(51, 50, 51)"
                        fontWeight="700">
                        {modalType}
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
                    <Formik
                        initialValues={{ id: '' }}
                        onSubmit={(e) => {
                            console.log(e);
                        }}>
                        {({ errors, touched, handleChange }) => (
                            <Form>
                                <Grid container spacing={[8, 4]}>
                                    <Grid item xs={5}>
                                        <FormGroup>
                                            <Select size="small">
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
                                    <Grid item xs={7}>
                                        Chi tiết cuộc hẹn
                                        <FormGroup>
                                            <Typography variant="body1" fontSize="14px">
                                                Ngày
                                            </Typography>
                                            <TextField type="date" size="small"></TextField>
                                        </FormGroup>
                                        <Grid container item spacing={[4, 2]}>
                                            <Grid item xs={8}>
                                                <FormGroup>
                                                    <Typography variant="body1" fontSize="14px">
                                                        Dịch vụ
                                                    </Typography>
                                                    <Select fullWidth size="small">
                                                        {suggestDichVu.map((item) => (
                                                            <MenuItem key={item.id} value={item.id}>
                                                                {item.tenDonVi}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormGroup>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormGroup>
                                                    <Typography variant="body1" fontSize="14px">
                                                        Thời gian bắt đầu
                                                    </Typography>
                                                    <TextField type="time" size="small"></TextField>
                                                </FormGroup>
                                            </Grid>
                                        </Grid>
                                        <Grid container item spacing={[4, 2]}>
                                            <Grid item xs={8}>
                                                <FormGroup>
                                                    <Typography variant="body1" fontSize="14px">
                                                        Nhân viên
                                                    </Typography>
                                                    <Select fullWidth size="small">
                                                        {suggestNhanVien.map((item) => (
                                                            <MenuItem key={item.id} value={item.id}>
                                                                {item.tenNhanVien}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormGroup>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormGroup>
                                                    <Typography variant="body1" fontSize="14px">
                                                        Thời gian làm
                                                    </Typography>
                                                    <TextField
                                                        type="number"
                                                        size="small"></TextField>
                                                </FormGroup>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <FormGroup>
                                                <Typography variant="body1" fontSize="14px">
                                                    Trạng thái
                                                </Typography>
                                                <TextField type="text" size="small"></TextField>
                                            </FormGroup>
                                        </Grid>
                                        <Grid item>
                                            <FormGroup>
                                                <Typography variant="body1" fontSize="14px">
                                                    Ghi chú
                                                </Typography>
                                                <TextField
                                                    type="text"
                                                    multiline
                                                    rows={4}
                                                    size="small"></TextField>
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
        );
    }
}
export default CreateOrEditLichHenModal;
