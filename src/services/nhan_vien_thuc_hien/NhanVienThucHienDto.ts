export default class NhanVienThucHienDto {
    idHoaDon?: string | null = null;
    idHoaDonChiTiet?: string | null = null;
    idNhanVien? = '';
    ptChietKhau = 0;
    tienChietKhau = 0;
    heSo = 1;
    chiaDeuChietKhau = false;
    tinhHoaHongTruocCK = false;
    loaiChietKhau = 1; // nvThucHien
    constructor({
        idHoaDon = null,
        idHoaDonChiTiet = null,
        idNhanVien = '',
        ptChietKhau = 0,
        tienChietKhau = 0,
        heSo = 1,
        chiaDeuChietKhau = false,
        tinhHoaHongTruocCK = false,
        loaiChietKhau = 1
    }) {
        this.idHoaDon = idHoaDon;
        this.idHoaDonChiTiet = idHoaDonChiTiet;
        this.idNhanVien = idNhanVien;
        this.ptChietKhau = ptChietKhau;
        this.tienChietKhau = tienChietKhau;
        this.heSo = heSo;
        this.chiaDeuChietKhau = chiaDeuChietKhau;
        this.tinhHoaHongTruocCK = tinhHoaHongTruocCK;
        this.loaiChietKhau = loaiChietKhau;
    }
}
