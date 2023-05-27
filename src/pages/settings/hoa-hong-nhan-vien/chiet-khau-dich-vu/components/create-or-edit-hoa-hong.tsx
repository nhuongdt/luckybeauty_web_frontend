import {
    ButtonGroup,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Component, ReactNode } from 'react';
import { CreateOrEditChietKhauDichVuDto } from '../../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/CreateOrEditChietKhauDichVuDto';
interface DialogProps {
    visited: boolean;
    title?: React.ReactNode;
    onClose: () => void;
    onSave: () => void;
    formRef: CreateOrEditChietKhauDichVuDto;
}
class CreateOrEditChietKhauDichVuModal extends Component<DialogProps> {
    render(): ReactNode {
        const { title, onClose, onSave, visited } = this.props;
        return (
            <Dialog open={visited} fullWidth maxWidth="sm">
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
                <DialogContent></DialogContent>
                <DialogActions>
                    <ButtonGroup
                        sx={{
                            height: '32px',
                            position: 'absolute',
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
