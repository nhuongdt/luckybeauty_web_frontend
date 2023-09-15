import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography
} from '@mui/material';
import { Component, ReactNode } from 'react';
import { ReactComponent as CloseIcon } from '../../../../images/close-square.svg';
import { Form, Formik } from 'formik';
import chucVuService from '../../../../services/nhan-vien/chuc_vu/chucVuService';
import AppConsts from '../../../../lib/appconst';
import suggestStore from '../../../../stores/suggestStore';
import { observer } from 'mobx-react';
import nhanVienStore from '../../../../stores/nhanVienStore';

interface ModalProps {
    visiable: boolean;
    handleClose: () => void;
    handleSubmit: () => void;
}

class CreateOrEditChucVuModal extends Component<ModalProps> {
    render(): ReactNode {
        return (
            <Dialog
                fullWidth
                maxWidth="sm"
                open={this.props.visiable}
                onClose={this.props.handleClose}>
                <Box>
                    <DialogTitle>
                        <Typography
                            variant="h3"
                            fontSize="24px"
                            //color="#333233"
                            fontWeight="700"
                            mb={3}>
                            Thêm mới chức vụ
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
                    </DialogTitle>
                    <DialogContent>
                        <Formik
                            initialValues={{
                                id: AppConsts.guidEmpty,
                                maChucVu: '12',
                                tenChucVu: '',
                                moTa: '',
                                trangThai: 1
                            }}
                            onSubmit={async (values) => {
                                const result = await chucVuService.CreateOrEditChucVu(values);
                                await suggestStore.getSuggestChucVu();
                                nhanVienStore.createEditNhanVien.idChucVu = result.id;
                                this.props.handleSubmit();
                            }}>
                            {({ handleChange, values }) => (
                                <Form>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography
                                                //color="#4C4B4C"
                                                fontSize="14px"
                                                fontWeight="500">
                                                Tên chức vụ
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="tenChucVu"
                                                onChange={handleChange}></TextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography
                                                //color="#4C4B4C"
                                                fontSize="14px"
                                                fontWeight="500">
                                                Mô tả
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="moTa"
                                                onChange={handleChange}></TextField>
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
                                                onClick={this.props.handleClose}
                                                variant="outlined"
                                                sx={{ color: 'var(--color-main)!important' }}
                                                className="btn-outline-hover">
                                                Hủy
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                className="btn-container-hover">
                                                Lưu
                                            </Button>
                                        </Box>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Box>
            </Dialog>
        );
    }
}
export default observer(CreateOrEditChucVuModal);
