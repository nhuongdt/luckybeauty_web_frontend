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
                maxWidth="sm"
                open={this.props.visiable}
                onClose={this.props.handleClose}>
                <Box>
                    <DialogTitle>
                        <Typography
                            fontSize="24px"
                            //color="#333233"
                            fontWeight="700"
                            mb={3}>
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
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography
                                                //color="#4C4B4C"
                                                fontSize="14px"
                                                fontWeight="500">
                                                Tên nhóm khách
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={values.tenNhomKhach}
                                                name="tenNhomKhach"
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
                                                value={values.moTa}
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
export default observer(CreateOrEditNhomKhachModal);
