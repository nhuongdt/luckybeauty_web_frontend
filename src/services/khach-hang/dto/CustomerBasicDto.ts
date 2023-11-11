export class CustomerBasicDto {
    id: string;
    maKhachHang: string;
    tenKhachHang: string;
    soDienThoai: string;

    constructor({ id = '', maKhachHang = '', tenKhachHang = '', soDienThoai = '' }) {
        this.id = id;
        this.maKhachHang = maKhachHang;
        this.tenKhachHang = tenKhachHang;
        this.soDienThoai = soDienThoai;
    }
}
