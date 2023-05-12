import { Guid } from 'guid-typescript';
import utils from '../../utils/utils';
import moment from 'moment';
export class KHCheckInDto {
    idKhachHang = '';
    idChiNhanh = '';
    dateTimeCheckIn = moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS');
    ghiChu = '';
    constructor({
        idKhachHang = '',
        idChiNhanh = '',
        dateTimeCheckIn = moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')
    }) {
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
    dateTimeCheckIn = new Date().toLocaleString();
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
        this.dateTimeCheckIn = dateTimeCheckIn.toLocaleString();
        this.ghiChu = ghiChu;
        this.txtTrangThaiCheckIn = txtTrangThaiCheckIn;
    }
    get dateCheckIn() {
        return moment(new Date(this.dateTimeCheckIn)).format('DD/MM/YYYY');
        return utils.formatDatetoDDMMYYY(new Date(this.dateTimeCheckIn));
    }
    get timeCheckIn() {
        return moment(new Date(this.dateTimeCheckIn)).format('hh:mm A');
        return utils.formatDatetime_AMPM(new Date(this.dateTimeCheckIn));
    }
    get tenKhach_KiTuDau() {
        return utils.getFirstLetter(this.tenKhachHang);
    }
}
