import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { Form, Formik } from 'formik';
import { Component } from 'react';
import AppConsts from '../../../lib/appconst';
import suggestStore from '../../../stores/suggestStore';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import khachHangService from '../../../services/khach-hang/khachHangService';
import { observer } from 'mobx-react';
import khachHangStore from '../../../stores/khachHangStore';
interface ModalProps {
    visiable: boolean;
    handleClose: () => void;
}
class CreateOrEditNhomKhachModal extends Component<ModalProps> {
    render() {
        return (
            <Dialog
                fullWidth
                maxWidth="xs"
                open={this.props.visiable}
                onClose={this.props.handleClose}>
                <Box>
                    <DialogTitle>
                        <Typography
                            fontSize="24px"
                            //color="#333233"
                            fontWeight="700">
                            {khachHangStore.createOrEditNhomKhachDto?.id != AppConsts.guidEmpty
                                ? 'Cập nhật '
                                : 'Thêm mới '}
                            nhóm khách
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
                            initialValues={khachHangStore.createOrEditNhomKhachDto}
                            onSubmit={async (values) => {
                                values.id = khachHangStore.createOrEditNhomKhachDto.id;
                                await khachHangService.createNhomKhach(values);
                                await suggestStore.getSuggestNhomKhach();
                                await khachHangStore.createNewNhomKhachDto();
                                this.props.handleClose();
                            }}>
                            {({ handleChange, values }) => (
                                <Form>
                                    <Grid container spacing={2} paddingTop={2}>
                                        <Grid item xs={12}>
                                            {/* <Typography
                                                //color="#4C4B4C"
                                                fontSize="14px"
                                                fontWeight="500">
                                                Tên nhóm khách
                                            </Typography> */}
                                            <TextField
                                                autoFocus
                                                fullWidth
                                                label="Tên nhóm khách"
                                                size="small"
                                                value={values.tenNhomKhach}
                                                name="tenNhomKhach"
                                                onChange={handleChange}></TextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {/* <Typography
                                                //color="#4C4B4C"
                                                fontSize="14px"
                                                fontWeight="500">
                                                Mô tả
                                            </Typography> */}
                                            <TextField
                                                fullWidth
                                                label=" Mô tả"
                                                size="small"
                                                value={values.moTa}
                                                name="moTa"
                                                onChange={handleChange}></TextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack
                                                spacing={1}
                                                direction={'row'}
                                                justifyContent={'flex-end'}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    className="btn-container-hover">
                                                    Lưu
                                                </Button>
                                                <Button
                                                    onClick={this.props.handleClose}
                                                    variant="outlined"
                                                    sx={{ color: 'var(--color-main)!important' }}
                                                    className="btn-outline-hover">
                                                    Hủy
                                                </Button>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Box>
            </Dialog>
        );
    }
}
export default observer(CreateOrEditNhomKhachModal);
