import { Guid } from 'guid-typescript';
import NhanVienThucHienDto from '../nhan_vien_thuc_hien/NhanVienThucHienDto';

export default class HoaDonChiTietDto {
    id = Guid.create().toString();
    idHoaDon = Guid.createEmpty().toString();
    idDonViQuyDoi? = null;
    soLuong = 1;
    donGiaTruocCK = 0;
    pTChietKhau? = 0;
    tienChietKhau? = 0;
    thanhTienTruocCK? = 0;
    pTThue? = 0;
    tienThue? = 0;
    ghiChu = '';
    trangThai? = 3; // 0.Xóa, 1.Tạm lưu, 2.Đang xử lý, 3.Hoàn thành

    donGiaSauCK? = 0;
    donGiaSauVAT? = 0;
    thanhTienSauCK? = 0;
    thanhTienSauVAT? = 0;

    nhanVienThucHien?: NhanVienThucHienDto[];

    constructor({
        id = Guid.create().toString(),
        idHoaDon = Guid.createEmpty().toString(),
        idDonViQuyDoi = null,
        soLuong = 1,
        donGiaTruocCK = 0,
        pTChietKhau = 0,
        tienChietKhau = 0,
        pTThue = 0,
        tienThue = 0,
        ghiChu = '',
        trangThai = 3
    }) {
        this.id = id;
        this.idHoaDon = idHoaDon;
        this.idDonViQuyDoi = idDonViQuyDoi;
        this.soLuong = soLuong;
        this.donGiaTruocCK = donGiaTruocCK;
        this.pTChietKhau = pTChietKhau;
        this.tienChietKhau = tienChietKhau;
        this.pTThue = pTThue;
        this.tienThue = tienThue;
        this.ghiChu = ghiChu;
        this.trangThai = trangThai;
        this.nhanVienThucHien = [];

        Object.defineProperties(this, {
            thanhTienTruocCK: {
                get() {
                    return this.soLuong * this.donGiaTruocCK;
                }
            },
            donGiaSauCK: {
                get() {
                    if (this.pTChietKhau ?? 0 > 0) {
                        return (
                            this.donGiaTruocCK -
                            (this.donGiaTruocCK * (this.pTChietKhau ?? 0)) / 100
                        );
                    }
                    return this.donGiaTruocCK - (this.tienChietKhau ?? 0);
                }
            },
            thanhTienSauCK: {
                get() {
                    return this.soLuong * this.donGiaSauCK;
                }
            },
            donGiaSauVAT: {
                get() {
                    if (this.pTThue ?? 0 > 0) {
                        return this.donGiaSauCK + (this.donGiaSauCK * (this.pTThue ?? 0)) / 100;
                    }
                    return this.donGiaSauCK - (this.tienThue ?? 0);
                }
            },
            thanhTienSauVAT: {
                get() {
                    return this.soLuong * this.donGiaSauVAT;
                }
            }
        });
    }
}
