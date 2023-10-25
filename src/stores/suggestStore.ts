import { makeAutoObservable } from 'mobx';
import { SuggestDichVuDto } from '../services/suggests/dto/SuggestDichVuDto';
import { SuggestNhanVienDichVuDto } from '../services/suggests/dto/SuggestNhanVienDichVuDto';
import SuggestService from '../services/suggests/SuggestService';
import { SuggestChucVuDto } from '../services/suggests/dto/SuggestChucVuDto';
import { SuggestNhomKhachDto } from '../services/suggests/dto/SuggestNhomKhachDto';
import { SuggestNhanSuDto } from '../services/suggests/dto/SuggestNhanSuDto';
import { SuggestNguonKhachDto } from '../services/suggests/dto/SuggestNguonKhachDto';
import { SuggestKhachHangDto } from '../services/suggests/dto/SuggestKhachHangDto';
import { SuggestNhomHangHoaDto } from '../services/suggests/dto/SuggestNhomHangHoaDto';
import { SuggestLoaiChungTu } from '../services/suggests/dto/SuggestLoaiChungTu';
import { SuggestChiNhanhDto } from '../services/suggests/dto/SuggestChiNhanhDto';
import { SuggestDonViQuiDoiDto } from '../services/suggests/dto/SuggestDonViQuiDoi';
import chiNhanhService from '../services/chi_nhanh/chiNhanhService';
import { SuggestNganHangDto } from '../services/suggests/dto/SuggestNganHangDto';

class SuggestStore {
    suggestKyThuatVien!: SuggestNhanVienDichVuDto[];
    suggestDichVu!: SuggestDichVuDto[];
    suggestNhomHangHoa!: SuggestNhomHangHoaDto[];
    suggestChucVu!: SuggestChucVuDto[];
    suggestNhomKhach!: SuggestNhomKhachDto[];
    suggestNguonKhach!: SuggestNguonKhachDto[];
    suggestNhanVien!: SuggestNhanSuDto[];
    suggestKhachHang!: SuggestKhachHangDto[];
    suggestLoaiChungTu!: SuggestLoaiChungTu[];
    suggestChiNhanh!: SuggestChiNhanhDto[];
    suggestChiNhanhByUser!: SuggestChiNhanhDto[];
    suggestDonViQuiDoi!: SuggestDonViQuiDoiDto[];
    suggestNganHang!: SuggestNganHangDto[];
    constructor() {
        makeAutoObservable(this);
    }
    async getSuggestKyThuatVien(idNhanVien?: string) {
        const data = await SuggestService.SuggestNhanVienLamDichVu(idNhanVien);
        this.suggestKyThuatVien = data;
    }
    async getSuggestKyThuatVienByIdDichVu(idDichVu: string) {
        const data = await SuggestService.SuggestNhanVienByIdDichVu(idDichVu);
        this.suggestKyThuatVien = data;
    }
    async getSuggestNhanVien() {
        const data = await SuggestService.SuggestNhanSu();
        this.suggestNhanVien = data;
    }
    async getSuggestNhomHangHoa() {
        const data = await SuggestService.SuggestNhomHangHoa();
        this.suggestNhomHangHoa = data;
    }
    async getSuggestDichVu(idNhanVien?: string) {
        const data = await SuggestService.SuggestDichVu(idNhanVien);
        this.suggestDichVu = data;
    }
    async getSuggestChucVu() {
        const data = await SuggestService.SuggestChucVu();
        this.suggestChucVu = data;
    }
    async getSuggestNhomKhach() {
        const data = await SuggestService.SuggestNhomKhach();
        this.suggestNhomKhach = data;
    }
    async getSuggestNguonKhach() {
        const data = await SuggestService.SuggestNguonKhach();
        this.suggestNguonKhach = data;
    }
    async getSuggestKhachHang() {
        const data = await SuggestService.SuggestKhachHang();
        this.suggestKhachHang = data;
    }
    async getSuggestLoaiChungTu() {
        const data = await SuggestService.SuggestLoaiChungTu();
        this.suggestLoaiChungTu = data;
    }
    async getSuggestChiNhanh() {
        const data = await SuggestService.SuggestChiNhanh();
        this.suggestChiNhanh = data;
    }
    async getSuggestChiNhanhByUser() {
        const data = await chiNhanhService.GetChiNhanhByUser();
        this.suggestChiNhanhByUser = data;
    }
    async getSuggestDonViQuiDoi() {
        const data = await SuggestService.SuggestDonViQuiDoi();
        this.suggestDonViQuiDoi = data;
    }
    async getSuggestNganHang() {
        const data = await SuggestService.SuggestNganHang();
        this.suggestNganHang = data;
    }
}
export default new SuggestStore();
