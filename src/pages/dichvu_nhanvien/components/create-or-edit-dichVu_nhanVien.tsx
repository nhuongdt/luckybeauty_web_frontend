import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Box,
    Grid,
    TextField,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Avatar,
    Button,
    DialogActions,
    Checkbox
} from '@mui/material';
import React, { Component } from 'react';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import { observer } from 'mobx-react';
import suggestStore from '../../../stores/suggestStore';
import dichVuNhanVienStore from '../../../stores/dichVuNhanVienStore';
import { DichVuNhanVienThucHien } from '../../../services/dichvu_nhanvien/dto/DichVuNhanVienDetailDto';
import dichVuNhanVienService from '../../../services/dichvu_nhanvien/dichVuNhanVienService';
import { enqueueSnackbar } from 'notistack';
import { LocalOffer } from '@mui/icons-material';
interface ModalProps {
    visiable: boolean;
    handleClose: () => void;
    handleOk: () => void;
}
class CreateOrEditDichVuNhanVienModal extends Component<ModalProps> {
    state = {
        settingValue: 'Service',
        selectedIdService: [] as string[]
    };
    componentDidMount(): void {
        this.getData();

        this.setState({
            selectedIdService: dichVuNhanVienStore.selectedIdService
        });
    }
    async getData() {
        await suggestStore.getSuggestKyThuatVien();
        //await suggestStore.getSuggestDichVu();
    }
    handleCheckboxClick = (id: string) => {
        const { selectedIdService } = dichVuNhanVienStore;

        // Check if the clicked service is already selected
        const isSelected = selectedIdService?.includes(id);

        if (isSelected) {
            // Remove the service from the selectedIdService array
            const updatedSelectedIdService = selectedIdService?.filter((item) => item !== id);
            dichVuNhanVienStore.selectedIdService = updatedSelectedIdService;
        } else {
            // Add the service to the selectedIdService array

            dichVuNhanVienStore.selectedIdService.push(id);
        }
    };
    handleSettingChange = async (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        await this.setState({
            settingValue: value
        });
    };
    render(): React.ReactNode {
        const { visiable, handleClose } = this.props;
        return (
            <Dialog open={visiable} fullWidth maxWidth={'sm'} onClose={handleClose}>
                <DialogTitle>
                    <Typography fontSize="24px" fontWeight="700" mb={3}>
                        {dichVuNhanVienStore.dichVuNhanVienDetail?.tenNhanVien} - Dịch vụ
                    </Typography>
                    <Button
                        onClick={this.props.handleClose}
                        sx={{
                            position: 'absolute',
                            right: '16px',
                            top: '16px',
                            minWidth: 'unset',
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}>
                        <CloseIcon />
                    </Button>
                    <TextField fullWidth size="small" placeholder="Tìm kiếm dịch vụ..." />
                </DialogTitle>
                <DialogContent>
                    <Box>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {suggestStore.suggestDichVu?.map((item, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                '& .MuiTableCell-root': {
                                                    padding: '8px'
                                                }
                                            }}>
                                            <TableCell width={'40px'}>
                                                <Checkbox
                                                    checked={dichVuNhanVienStore.selectedIdService.includes(
                                                        item.id
                                                    )}
                                                    onClick={() => {
                                                        this.handleCheckboxClick(item.id);
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="left" width={'250px'}>
                                                <Box
                                                    display={'flex'}
                                                    flexDirection={'row'}
                                                    alignItems={'center'}
                                                    gap="8px">
                                                    <Avatar variant="square" />{' '}
                                                    <Typography>{item.tenDichVu}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align={'right'}>
                                                <Typography>40 {' phút'}</Typography>
                                            </TableCell>
                                            <TableCell align={'right'}>
                                                <Typography>
                                                    {new Intl.NumberFormat('vi-VN').format(
                                                        item.donGia
                                                    )}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        type="button"
                        onClick={async () => {
                            const result = await dichVuNhanVienStore.createOrEditByEmployee();
                            enqueueSnackbar(result.message, {
                                variant: result.status,
                                autoHideDuration: 3000
                            });
                            this.props.handleClose();
                        }}
                        variant="contained"
                        sx={{
                            fontSize: '14px',
                            textTransform: 'unset',
                            color: '#fff',

                            border: 'none'
                        }}
                        className="btn-container-hover">
                        Lưu
                    </Button>
                    <Button
                        onClick={this.props.handleClose}
                        variant="outlined"
                        sx={{
                            fontSize: '14px',
                            textTransform: 'unset',
                            color: 'var(--color-main)'
                        }}
                        className="btn-outline-hover">
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default observer(CreateOrEditDichVuNhanVienModal);
