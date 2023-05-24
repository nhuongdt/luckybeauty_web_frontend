import { Guid } from 'guid-typescript';
import { KhachHangItemDto } from '../khach-hang/dto/KhachHangItemDto';
import HoaDonDto from './HoaDonDto';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import moment from 'moment';

export default class PageHoaDonDto extends HoaDonDto {
    maKhachHang = '';
    tenKhachHang = '';
    soDienThoai!: string;
    tongTichDiem = 0;

    maNhanVien = '';
    tenNhanVien = '';

    txtTrangThaiHD = 'Hoàn thành';
    hoaDonChiTiet?: PageHoaDonChiTietDto[];

    constructor({
        id = Guid.create().toString(),
        idKhachHang = null,
        maKhachHang = '',
        tenKhachHang = '',
        soDienThoai = '',
        tongTichDiem = 0,
        txtTrangThaiHD = 'Hoàn thành',
        maNhanVien = '',
        tenNhanVien = '',
        maHoaDon = '',
        ngayLapHoaDon = moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS'),
        tongTienHang = 0,
        tongTienThue = 0
    }) {
        super({
            id: id,
            idKhachHang: idKhachHang,
            maHoaDon: maHoaDon,
            ngayLapHoaDon: ngayLapHoaDon,
            tongTienHang: tongTienHang,
            tongTienThue: tongTienThue
        });
        this.maKhachHang = maKhachHang;
        this.tenKhachHang = tenKhachHang;
        this.soDienThoai = soDienThoai;
        this.tongTichDiem = tongTichDiem;
        this.txtTrangThaiHD = txtTrangThaiHD;
        this.maNhanVien = maNhanVien;
        this.tenNhanVien = tenNhanVien;
        this.hoaDonChiTiet = [];
    }
}
