import {
    ButtonGroup,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    Grid,
    RadioGroup,
    Radio,
    FormControlLabel,
    Checkbox,
    MenuItem,
    ListItemText
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import { Component, ReactNode } from 'react';
import { CreateOrEditChietKhauHoaDonDto } from '../../../../../../services/hoa_hong/chiet_khau_hoa_don/Dto/CreateOrEditChietKhauHoaDonDto';
import { Form, Formik } from 'formik';
import chietKhauHoaDonStore from '../../../../../../stores/chietKhauHoaDonStore';
import { enqueueSnackbar } from 'notistack';
import AppConsts from '../../../../../../lib/appconst';
interface DialogProps {
    visited: boolean;
    title?: React.ReactNode;
    onClose: () => void;
    onSave: () => void;
    formRef: CreateOrEditChietKhauHoaDonDto;
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};
const loaiChungTu = [
    'Hóa đơn bán lẻ',
    'Gói dịch vụ',
    'Báo giá',
    'Phiếu nhập kho nhà cung cấp',
    'Phiếu xuất kho',
    'Khách trả hàng',
    'Thẻ giá trị',
    'Phiếu kiểm kê',
    'Chuyển hàng',
    'Phiếu thu',
    'Phiếu chi',
    'Điều chỉnh giá vốn',
    'Nhận hàng'
];
class CreateOrEditChietKhauHoaDonModal extends Component<DialogProps> {
    render(): ReactNode {
        const { title, onClose, onSave, visited, formRef } = this.props;
        const initValues: CreateOrEditChietKhauHoaDonDto = formRef;
        return (
            <Dialog open={visited} fullWidth maxWidth="md">
                <DialogTitle>
                    {title}
                    {onClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8
                            }}>
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initValues}
                        onSubmit={async (values) => {
                            const createOrEdit = await chietKhauHoaDonStore.createOrEdit(values);
                            createOrEdit != null
                                ? formRef.id === AppConsts.guidEmpty || formRef.id === ''
                                    ? enqueueSnackbar('Thêm mới thành công', {
                                          variant: 'success',
                                          autoHideDuration: 3000
                                      })
                                    : enqueueSnackbar('Cập nhật thành công', {
                                          variant: 'success',
                                          autoHideDuration: 3000
                                      })
                                : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau', {
                                      variant: 'error',
                                      autoHideDuration: 3000
                                  });
                            await onSave();
                        }}>
                        {({ handleChange, errors, values }) => (
                            <Form>
                                <Grid container spacing={4} rowSpacing={2}>
                                    <Grid item xs={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Chứng từ áp dụng
                                        </Typography>
                                        <Select
                                            size="small"
                                            name="chungTuApDung"
                                            multiple
                                            onChange={handleChange}
                                            value={values.chungTuApDung}
                                            renderValue={(selected: any) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}>
                                            {loaiChungTu.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    <Checkbox
                                                        checked={values.chungTuApDung.includes(
                                                            name
                                                        )}
                                                    />
                                                    <ListItemText primary={name} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Loại chiết khấu
                                        </Typography>
                                        <RadioGroup
                                            name="loaiChietKhau"
                                            value={values.loaiChietKhau}
                                            onChange={handleChange}
                                            sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <FormControlLabel
                                                value={1}
                                                control={<Radio />}
                                                label="Theo % thực thu"
                                            />
                                            <FormControlLabel
                                                value={2}
                                                control={<Radio />}
                                                label=" Theo % doanh thu"
                                            />
                                            <FormControlLabel
                                                value={3}
                                                control={<Radio />}
                                                label="Theo VNĐ"
                                            />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Giá trị
                                        </Typography>
                                        <TextField
                                            size="small"
                                            name="giaTriChietKhau"
                                            value={values.giaTriChietKhau}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                </Grid>
                                <DialogActions>
                                    <ButtonGroup
                                        sx={{
                                            height: '32px',
                                            bottom: '24px',
                                            right: '50px'
                                        }}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#fff',
                                                backgroundColor: '#B085A4',
                                                border: 'none'
                                            }}
                                            type="submit">
                                            Lưu
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={onClose}
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#965C85',
                                                borderColor: '#965C85'
                                            }}>
                                            Hủy
                                        </Button>
                                    </ButtonGroup>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        );
    }
}
export default CreateOrEditChietKhauHoaDonModal;
