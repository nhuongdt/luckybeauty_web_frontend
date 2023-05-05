import {
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
import { useEffect, useState } from 'react';
import AutocompleteCustomer from '../../components/Autocomplete/Customer';

import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import Utils from '../../utils/utils'; // func common

import '../../App.css';

export default function ModalAddCustomerCheckIn({ trigger, handleSave }: any) {
    const [isShow, setIsShow] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>();

    useEffect(() => {
        if (trigger.isShow) {
            setIsShow(true);
            setNewCus({
                id: '',
                maKhachHang: '',
                tenKhachHang: '',
                idLoaiKhach: 1,
                soDienThoai: '',
                diaChi: '',
                gioiTinh: false,
                idNguonKhach: '',
                idNhomKhach: ''
            });
        }
        setIsSave(false);
    }, [trigger]);

    const changeCustomer = (item: KhachHangItemDto) => {
        if (item === null || item === undefined) {
            setNewCus({
                id: '',
                maKhachHang: '',
                tenKhachHang: '',
                idLoaiKhach: 1,
                soDienThoai: '',
                diaChi: '',
                gioiTinh: false,
                idNguonKhach: '',
                idNhomKhach: ''
            });
            return;
        }
        setNewCus({
            ...newCus,
            id: item.id.toString(),
            maKhachHang: item.maKhachHang,
            tenKhachHang: item.tenKhachHang,
            idLoaiKhach: 1,
            soDienThoai: '',
            gioiTinh: false,
            idNguonKhach: '',
            idNhomKhach: ''
        });
        setIsSave(false);
    };

    const saveCheckIn = () => {
        if (isSave) return;
        setIsSave(true);
        setIsShow(false);
        handleSave(newCus);
    };
    return (
        <>
            <Dialog open={isShow} onClose={() => setIsShow(false)} fullWidth maxWidth="md">
                <DialogTitle>Thêm khách hàng checkin</DialogTitle>
                <DialogContent>
                    <Grid container columnSpacing={6}>
                        <Grid item xs={7} sm={7} md={7} lg={7}>
                            <Stack direction="column">
                                <Typography className="modal-lable">Họ và tên</Typography>
                                <TextField
                                    size="small"
                                    value={newCus?.tenKhachHang}
                                    error={isSave && Utils.checkNull(newCus?.tenKhachHang)}
                                    helperText={
                                        isSave && Utils.checkNull(newCus?.tenKhachHang)
                                            ? 'Vui lòng nhập thông tin khách hàng'
                                            : ''
                                    }
                                    onChange={(event) => {
                                        setNewCus((itemOlds: any) => {
                                            return {
                                                ...itemOlds,
                                                tenKhachHang: event.target.value
                                            };
                                        });
                                        setIsSave(false);
                                    }}></TextField>
                            </Stack>
                            <Stack direction="column" paddingTop={2}>
                                <Typography className="modal-lable">Số điện thoại</Typography>
                                <TextField size="small" value={newCus?.soDienThoai}></TextField>
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={1}
                                paddingTop={2}
                                justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    className="button-container"
                                    sx={{ width: '70px' }}
                                    onClick={saveCheckIn}>
                                    Lưu
                                </Button>
                                <Button
                                    variant="outlined"
                                    className="button-outline"
                                    sx={{ width: '70px' }}
                                    onClick={() => setIsShow(false)}>
                                    Hủy
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={5} sm={5} md={5} lg={5}>
                            <AutocompleteCustomer handleChoseItem={changeCustomer} />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
