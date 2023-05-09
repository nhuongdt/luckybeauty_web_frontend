import { Guid } from 'guid-typescript';
export class KHCheckInDto {
    idKhachHang = '';
    idChiNhanh = '';
    dateTimeCheckIn: Date = new Date();
    ghiChu = '';
    constructor({ idKhachHang = '', idChiNhanh = '', dateTimeCheckIn = new Date() }) {
        this.idKhachHang = idKhachHang;
        this.idChiNhanh = idChiNhanh;
        this.dateTimeCheckIn = dateTimeCheckIn;
    }
}

export class PageKhachHangCheckInDto {
    idKhachHang: Guid | null = null;
    idChiNhanh = null;
    idCheckIn = Guid.createEmpty();
    maKhachHang = '';
    tenKhachHang = '';
    soDienThoai = '';
    tongTichDiem = 0;
    dateTimeCheckIn: Date = new Date();
    ghiChu = '';
    txtTrangThaiCheckIn = '';

    get dateCheckIn() {
        return (
            this.dateTimeCheckIn.getFullYear() +
            '-' +
            (this.dateTimeCheckIn.getMonth() + 1) +
            '-' +
            this.dateTimeCheckIn.getDate()
        );
    }
    get timeCheckIn() {
        // const tt = this.dateTimeCheckIn.toTimeString().split(' ')[0];
        return this.dateTimeCheckIn.toLocaleTimeString();
    }
    constructor({
        idKhachHang = null,
        idChiNhanh = null,
        idCheckIn = Guid.createEmpty(),
        dateTimeCheckIn = new Date(),
        maKhachHang = '',
        tenKhachHang = '',
        soDienThoai = '',
        tongTichDiem = 0,
        ghiChu = '',
        txtTrangThaiCheckIn = 'Đang chờ'
    }) {
        this.idKhachHang = idKhachHang;
        this.idChiNhanh = idChiNhanh;
        this.idCheckIn = idCheckIn;
        this.maKhachHang = maKhachHang;
        this.tenKhachHang = tenKhachHang;
        this.soDienThoai = soDienThoai;
        this.tongTichDiem = tongTichDiem;
        this.dateTimeCheckIn = dateTimeCheckIn;
        this.ghiChu = ghiChu;
        this.txtTrangThaiCheckIn = txtTrangThaiCheckIn;
    }
}
