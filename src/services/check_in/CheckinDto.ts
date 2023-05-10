import { Guid } from 'guid-typescript';
import utils from '../../utils/utils';
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
    idKhachHang: string | null = null;
    idChiNhanh = null;
    idCheckIn = Guid.EMPTY;
    maKhachHang = '';
    tenKhachHang = '';
    soDienThoai = '';
    tongTichDiem = 0;
    dateTimeCheckIn = new Date();
    ghiChu? = '';
    txtTrangThaiCheckIn? = '';

    constructor({
        idKhachHang = Guid.EMPTY,
        idChiNhanh = null,
        idCheckIn = Guid.EMPTY,
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
    get dateCheckIn() {
        return utils.formatDatetoDDMMYYY(new Date(this.dateTimeCheckIn));
    }
    get timeCheckIn() {
        return utils.formatDatetime_AMPM(new Date(this.dateTimeCheckIn));
    }
}
