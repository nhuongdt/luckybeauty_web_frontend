import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Stack,
    Typography
} from '@mui/material';
import { Button } from 'antd';
import CloseIcon from '@mui/icons-material/Close';
import { Formik } from 'formik';
const CreateOrEditNhanVienDialog = ({ modalVisible, onCloseDialog }: any) => {
    return (
        <Dialog
            open={modalVisible}
            keepMounted
            onClose={onCloseDialog}
            aria-describedby="alert-dialog-slide-description"
            fullWidth
            maxWidth="md">
            <DialogTitle>
                {' '}
                <div className="row">
                    <div className="col-8" style={{ float: 'left' }}>
                        Thêm mới nhân viên
                    </div>
                    <div className="col-4" style={{ float: 'right' }}>
                        <CloseIcon
                            style={{ float: 'right', height: '24px' }}
                            onClick={onCloseDialog}
                        />
                    </div>
                </div>
            </DialogTitle>
            <DialogContent>
                <form>
                    <div className="row">
                        <div className="col-8">
                            <Typography variant="subtitle1" component="div">
                                Thông tin chi tiết
                            </Typography>
                            <div className="form-group mt-3">
                                <label>Tên nhân viên</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="row mt-3">
                                <div className="form-group col">
                                    <label>Email</label>
                                    <input type="email" className="form-control" />
                                </div>
                                <div className="form-group col">
                                    <label>Số điện thoại</label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="form-group col">
                                    <label>Ngày sinh</label>
                                    <input type="date" className="form-control" />
                                </div>
                                <div className="form-group col">
                                    <label>Giới tính</label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="form-group col">
                                    <label>CCCD</label>
                                    <input type="text" className="form-control" />
                                </div>
                                <div className="form-group col">
                                    <label>Nơi cấp</label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="form-group col">
                                    <label>Ngày cấp</label>
                                    <input type="date" className="form-control" />
                                </div>
                                <div className="form-group col">
                                    <label>Địa chỉ</label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="form-group mt-3">
                                <label>Chức vụ</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="form-group mt-3">
                                <label>Ghi chú</label>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-group mt-3 border-1" style={{ width: '100%' }}>
                                <label></label>
                                <image href="#">
                                    <input type="file" height={'200px'} />
                                </image>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCloseDialog} className="btn btn-btn-outline-danger">
                    Close
                </Button>
                <Button onClick={onCloseDialog} className="btn btn-info">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default CreateOrEditNhanVienDialog;
