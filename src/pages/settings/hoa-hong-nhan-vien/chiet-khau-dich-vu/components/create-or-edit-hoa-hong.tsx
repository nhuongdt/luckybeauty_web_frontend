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
    Select,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Component, ReactNode } from 'react';
import { CreateOrEditChietKhauDichVuDto } from '../../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/CreateOrEditChietKhauDichVuDto';
import { SuggestDonViQuiDoiDto } from '../../../../../services/suggests/dto/SuggestDonViQuiDoi';
interface DialogProps {
    visited: boolean;
    title?: React.ReactNode;
    onClose: () => void;
    onSave: () => void;
    onChange: (event: any) => void;
    formRef: CreateOrEditChietKhauDichVuDto;
    suggestDonViQuiDoi: SuggestDonViQuiDoiDto[];
}
class CreateOrEditChietKhauDichVuModal extends Component<DialogProps> {
    render(): ReactNode {
        const { title, onClose, onSave, visited, formRef, onChange, suggestDonViQuiDoi } =
            this.props;
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
                                Dịch vụ
                            </Typography>
                            <Select
                                size="small"
                                name="idDonViQuyDoi"
                                value={formRef.idDonViQuyDoi}
                                onChange={onChange}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}>
                                {suggestDonViQuiDoi.map((item) => {
                                    return <MenuItem value={item.id}>{item.tenDonVi}</MenuItem>;
                                })}
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Loại chiết khấu
                            </Typography>
                            <RadioGroup
                                value={formRef.loaiChietKhau}
                                defaultValue={formRef.loaiChietKhau}
                                name="loaiChietKhau"
                                onChange={onChange}
                                sx={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel value={1} control={<Radio />} label="Thực hiện" />
                                <FormControlLabel value={2} control={<Radio />} label="Yêu cầu" />
                                <FormControlLabel value={3} control={<Radio />} label="Tư vấn" />
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography color="#4C4B4C" variant="subtitle2">
                                Giá trị
                            </Typography>
                            <TextField
                                size="small"
                                name="giaTri"
                                value={formRef.giaTri}
                                onChange={onChange}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                label={'Là phần trăm'}
                                control={
                                    <Checkbox
                                        defaultChecked
                                        name="laPhanTram"
                                        value={formRef.laPhanTram}
                                        onChange={onChange}
                                    />
                                }
                            />
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
export default CreateOrEditChietKhauDichVuModal;
