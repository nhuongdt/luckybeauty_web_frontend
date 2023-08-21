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
import { SuggestDonViQuiDoiDto } from '../../../services/suggests/dto/SuggestDonViQuiDoi';
import { SuggestNhanVienDichVuDto } from '../../../services/suggests/dto/SuggestNhanVienDichVuDto';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import { observer } from 'mobx-react';
import suggestStore from '../../../stores/suggestStore';
import dichVuNhanVienStore from '../../../stores/dichVuNhanVienStore';
interface ModalProps {
    visiable: boolean;
    handleClose: () => void;
    handleOk: () => void;
}
class CreateOrEditDichVuNhanVienModal extends Component<ModalProps> {
    state = {
        settingValue: 'Service',
        suggestDichVu: [] as SuggestDonViQuiDoiDto[],
        suggestKyThuatVien: [] as SuggestNhanVienDichVuDto[]
    };
    componentDidMount(): void {
        this.getData();
    }
    async getData() {
        const kyThuatViens = await suggestStore.getSuggestKyThuatVien();
        const dichVus = await suggestStore.getSuggestDichVu();
        await this.setState({
            suggestDichVus: dichVus,
            suggestkyThuatVien: kyThuatViens
        });
    }
    handleSettingChange = async (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        await this.setState({
            settingValue: value
        });
    };
    render(): React.ReactNode {
        const { visiable, handleClose } = this.props;
        return (
            <Dialog open={visiable} fullWidth maxWidth={'md'} onClose={handleClose}>
                <DialogTitle>
                    <Typography fontSize="24px" color="#333233" fontWeight="700" mb={3}>
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
                    <Box padding={'16px'}>
                        <Grid container spacing={1}>
                            <Grid xs={4}></Grid>
                            <Grid xs={8}>
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            {suggestStore.suggestDichVu?.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={
                                                                dichVuNhanVienStore.dichVuNhanVienDetail?.dichVuThucHiens.find(
                                                                    (x) =>
                                                                        x.tenDichVu ===
                                                                        item.tenDichVu
                                                                ) !== undefined
                                                            }
                                                            onClick={() => {
                                                                dichVuNhanVienStore.dichVuNhanVienDetail?.dichVuThucHiens.push(
                                                                    {
                                                                        avatar: '',
                                                                        donGia: item.donGia,
                                                                        soPhutThucHien: '0',
                                                                        tenDichVu: item.tenDichVu
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Box
                                                            display={'flex'}
                                                            flexDirection={'row'}
                                                            alignItems={'center'}
                                                            gap="8px">
                                                            <Avatar variant="square" />{' '}
                                                            <Typography>
                                                                {item.tenDichVu}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align={'right'}>
                                                        <Typography>40 {' phút'}</Typography>
                                                    </TableCell>
                                                    <TableCell align={'right'}>
                                                        <Typography>{item.donGia}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        type="button"
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
