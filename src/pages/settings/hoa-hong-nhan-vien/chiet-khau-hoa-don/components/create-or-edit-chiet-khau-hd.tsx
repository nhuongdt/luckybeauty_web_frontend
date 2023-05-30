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
import { CreateOrEditChietKhauHoaDonDto } from '../../../../../services/hoa_hong/chiet_khau_hoa_don/Dto/CreateOrEditChietKhauHoaDonDto';
interface DialogProps {
    visited: boolean;
    title?: React.ReactNode;
    onClose: () => void;
    onSave: () => void;
    onChange: (event: any) => void;
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
        const { title, onClose, onSave, visited, formRef, onChange } = this.props;
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
                    <Grid container spacing={4} rowSpacing={2}>
                        <Grid item xs={6}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Chứng từ áp dụng
                            </Typography>
                            <Select
                                size="small"
                                name="chungTuApDung"
                                multiple
                                onChange={onChange}
                                value={formRef.chungTuApDung}
                                renderValue={(selected: any) => selected.join(', ')}
                                MenuProps={MenuProps}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}>
                                {loaiChungTu.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={formRef.chungTuApDung.includes(name)} />
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
                                value={formRef.loaiChietKhau}
                                onChange={onChange}
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
                                <FormControlLabel value={3} control={<Radio />} label="Theo VNĐ" />
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Giá trị
                            </Typography>
                            <TextField
                                size="small"
                                name="giaTriChietKhau"
                                value={formRef.giaTriChietKhau}
                                onChange={onChange}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
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
                            onClick={onSave}>
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
            </Dialog>
        );
    }
}
export default CreateOrEditChietKhauHoaDonModal;
