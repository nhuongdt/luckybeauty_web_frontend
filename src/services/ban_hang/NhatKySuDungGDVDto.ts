import PageHoaDonChiTietDto from './PageHoaDonChiTietDto';
import PageHoaDonDto from './PageHoaDonDto';

export default interface INhatKySuDungGDVDto {
    maKhachHang: string;
    tenKhachHang: string;
    sdtKhachHang: string;

    maGoiDichVu: string;
    ngayMuaGDV: string;
    maDichVuMua: string;
    tenDichVuMua: string;
    soLuongMua: number;
    donGiaMuaSauCK: number;
    thanhTienMuaSauCK: number;

    maHoaDonSD: string;
    ngayLapHoaDonSD: string;
    maDichVuSD: string;
    tenDichVuSD: string;
    soLuongSD: number;
    thanhTienSDSauCK: number;
    nvthucHiens: string;
}
