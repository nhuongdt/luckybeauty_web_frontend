import { makeAutoObservable } from 'mobx';
import { CreateOrEditKhachHangDto } from '../services/khach-hang/dto/CreateOrEditKhachHangDto';
import khachHangService from '../services/khach-hang/khachHangService';

class KhachHangSrore {
    createEditKhachHangDto: CreateOrEditKhachHangDto = {
        id: '',
        maKhachHang: '',
        tenKhachHang: '',
        soDienThoai: '',
        gioiTinh: false,
        idLoaiKhach: 0,
        idNhomKhach: '',
        idNguonKhach: '',
        diaChi: '',
        moTa: ''
    };
    constructor() {
        makeAutoObservable(this);
    }
    async getForEdit(id: string) {
        const result = await khachHangService.getKhachHang(id);
        this.createEditKhachHangDto = result;
    }
}
export default new KhachHangSrore();
