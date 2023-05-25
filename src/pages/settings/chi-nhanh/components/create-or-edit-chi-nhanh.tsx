import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import { Component, ReactNode } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { CreateOrEditChiNhanhDto } from '../../../../services/chi_nhanh/Dto/createOrEditChiNhanhDto';
interface ChiNhanhProps {
    isShow: boolean;
    onSave: () => void;
    onCLose: () => void;
    onChange: (e: any) => void;
    formRef: CreateOrEditChiNhanhDto;
    title: React.ReactNode;
}
class CreateOrEditChiNhanhModal extends Component<ChiNhanhProps> {
    render(): ReactNode {
        const { formRef, onChange, onSave, onCLose, title, isShow } = this.props;
        return (
            <Dialog open={isShow} onClose={onCLose} fullWidth maxWidth={'md'}>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    {title}
                    <IconButton
                        aria-label="close"
                        onClick={onCLose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500]
                        }}>
                        <CloseOutlinedIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Mã chi nhánh
                            </Typography>
                            <TextField
                                size="small"
                                name="maChiNhanh"
                                placeholder="Nhập mã chi nhánh"
                                value={formRef.maChiNhanh}
                                onChange={onChange}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Tên chi nhánh
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="Nhập tên chi nhánh"
                                name="tenChiNhanh"
                                value={formRef.tenChiNhanh}
                                onChange={onChange}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Số điện thoại
                            </Typography>
                            <TextField
                                size="small"
                                name="soDienThoai"
                                placeholder="Nhập số điện thoại"
                                value={formRef.soDienThoai}
                                onChange={onChange}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Địa chỉ
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="Nhập địa chỉ"
                                name="diaChi"
                                value={formRef.diaChi}
                                onChange={onChange}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Ngày áp dụng
                            </Typography>
                            <TextField
                                size="small"
                                type="date"
                                name="ngayApDung"
                                value={formRef.ngayApDung}
                                onChange={onChange}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Ngày hết hạn
                            </Typography>
                            <TextField
                                size="small"
                                type="date"
                                name="ngayHetHan"
                                value={formRef.ngayHetHan}
                                onChange={onChange}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Ghi chú
                            </Typography>
                            <TextField
                                size="small"
                                rows={4}
                                multiline
                                placeholder="Ghi chú"
                                name="ghiChu"
                                value={formRef.ghiChu}
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
                            onClick={this.props.onSave}>
                            Lưu
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                fontSize: '14px',
                                textTransform: 'unset',
                                color: '#965C85',
                                borderColor: '#965C85'
                            }}
                            onClick={this.props.onCLose}>
                            Hủy
                        </Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        );
    }
}
export default CreateOrEditChiNhanhModal;
