import { Guid } from 'guid-typescript';
import PageHoaDonChiTietDto from './PageHoaDonChiTietDto';

export default class HoaDonDto {
    id = Guid.create().toString();
    idKhachHang = null;
    idChiNhanh? = null;
    idNhanVien? = null;
    idLoaiChungTu = 1;
    maHoaDon = '';
    ngayLapHoaDon = new Date();
    tongTienHang = 0;
    pTGiamGiaHD? = 0;
    tongGiamGiaHD = 0;
    tongThanhToan = 0;
    ghiChuHD? = '';
    trangThai? = 3; // 0.Xóa, 1.Tạm lưu, 2.Đang xử lý, 3.Hoàn thành

    tongTienHangChuaChietKhau = 0;
    tongChietKhauHangHoa = 0;

    hoaDonChiTiet?: PageHoaDonChiTietDto[];

    constructor({
        id = Guid.create().toString(),
        idLoaiChungTu = 1,
        idKhachHang = null,
        idChiNhanh = null,
        idNhanVien = null,
        maHoaDon = '',
        ngayLapHoaDon = new Date(),
        tongTienHangChuaChietKhau = 0,
        tongChietKhauHangHoa = 0,
        tongTienHang = 0,
        pTGiamGiaHD = 0,
        tongGiamGiaHD = 0,
        tongThanhToan = 0,
        ghiChuHD = '',
        trangThai = 3
    }) {
        this.id = id;
        this.idLoaiChungTu = idLoaiChungTu;
        this.idKhachHang = idKhachHang;
        this.idChiNhanh = idChiNhanh;
        this.idNhanVien = idNhanVien;
        this.maHoaDon = maHoaDon;
        this.ngayLapHoaDon = ngayLapHoaDon;
        this.tongTienHangChuaChietKhau = tongTienHangChuaChietKhau;
        this.tongChietKhauHangHoa = tongChietKhauHangHoa;
        this.tongTienHang = tongTienHang;
        this.pTGiamGiaHD = pTGiamGiaHD;
        this.tongGiamGiaHD = tongGiamGiaHD;
        this.tongThanhToan = tongThanhToan;
        this.ghiChuHD = ghiChuHD;
        this.trangThai = trangThai;
    }
}
