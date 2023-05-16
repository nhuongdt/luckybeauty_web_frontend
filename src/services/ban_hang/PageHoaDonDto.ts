import { Guid } from 'guid-typescript';
import { KhachHangItemDto } from '../khach-hang/dto/KhachHangItemDto';
import HoaDonDto from './HoaDonDto';

export default class PageHoaDonDto extends HoaDonDto {
    maKhachHang = '';
    tenKhachHang = '';
    soDienThoai!: string;
    tongTichDiem = 0;

    maNhanVien = '';
    tenNhanVien = '';

    txtTrangThaiHD = 'Hoàn thành';

    // khachhang?: KhachHangItemDto; // object (test todo)

    constructor({
        idKhachHang = null,
        maKhachHang = '',
        tenKhachHang = '',
        soDienThoai = '',
        tongTichDiem = 0,
        txtTrangThaiHD = 'Hoàn thành',
        maNhanVien = '',
        tenNhanVien = ''
        // khachhang = {
        //     id: Guid.createEmpty(),
        //     maKhachHang: '',
        //     tenKhachHang: '',
        //     soDienThoai: '',
        //     tongTichDiem: 0
        // }
    }) {
        super({ idKhachHang: idKhachHang });
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
