export class CustomerBasicDto {
    idKhachHang: string;
    maKhachHang: string;
    tenKhachHang: string;
    soDienThoai: string;

    constructor({ idKhachHang = '', maKhachHang = '', tenKhachHang = '', soDienThoai = '' }) {
        this.idKhachHang = idKhachHang;
        this.maKhachHang = maKhachHang;
        this.tenKhachHang = tenKhachHang;
        this.soDienThoai = soDienThoai;
    }
}

export interface ICustomerBasic {
    idKhachHang?: string;
    maKhachHang?: string;
    tenKhachHang?: string;
    soDienThoai?: string;
}
