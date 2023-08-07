import { makeAutoObservable } from 'mobx';
import { CreateOrEditKhachHangDto } from '../services/khach-hang/dto/CreateOrEditKhachHangDto';
import khachHangService from '../services/khach-hang/khachHangService';
import AppConsts from '../lib/appconst';
import { KhachHangDetail } from '../services/khach-hang/dto/KhachHangDetail';
import { LichSuDatLich } from '../services/khach-hang/dto/LichSuDatLich';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { LichSuGiaoDich } from '../services/khach-hang/dto/LichSuGiaoDich';

class KhachHangSrore {
    createEditKhachHangDto!: CreateOrEditKhachHangDto;
    khachHangDetail!: KhachHangDetail;
    lichSuDatLich!: PagedResultDto<LichSuDatLich>;
    lichSuGiaoDich!: PagedResultDto<LichSuGiaoDich>;
    constructor() {
        this.khachHangDetail = {
            id: AppConsts.guidEmpty,
            avatar: '',
            ngaySinh: '',
            maKhachHang: '',
            tenKhachHang: '',
            soDienThoai: '',
            diaChi: '',
            gioiTinh: '',
            email: '',
            maSoThue: '',
            loaiKhach: '',
            nhomKhach: '',
            nguonKhach: '',
            diemThuong: 0
        };
        makeAutoObservable(this);
    }
    async getForEdit(id: string) {
        const result = await khachHangService.getKhachHang(id);
        this.createEditKhachHangDto = result;
    }
    async getDetail(id: string) {
        const result = await khachHangService.getDetail(id);
        this.khachHangDetail = result;
    }
    async getLichSuDatLich(idKhachHang: string) {
        const result = await khachHangService.lichSuDatLich(idKhachHang);
        this.lichSuDatLich = result;
    }
    async getLichSuGiaoDich(idKhachHang: string) {
        const result = await khachHangService.lichSuGiaoDich(idKhachHang);
        this.lichSuGiaoDich = result;
    }
    async createKhachHangDto() {
        this.createEditKhachHangDto = {
            id: AppConsts.guidEmpty,
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
    }
}
export default new KhachHangSrore();
