import { Guid } from 'guid-typescript';
import QuyChiTietDto from './QuyChiTietDto';
import { format } from 'date-fns';

export default class QuyHoaDonDto {
    id = Guid.create().toString();
    idChiNhanh?: string | null = null;
    idNhanVien?: string | null = null;
    idLoaiChungTu = 11;
    maHoaDon? = '';
    tienThu = 0;
    tongTienThu = 0;
    ngayLapHoaDon = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    trangThai? = 1;

    noiDungThu? = '';
    hachToanKinhDoanh? = true;
    thuPhiTienGui? = 0;
    diemThanhToan? = 0;

    quyHoaDon_ChiTiet?: QuyChiTietDto[];

    sLoaiPhieu? = '';
    maNguoiNop? = '';
    tenNguoiNop? = '';
    tenChiNhanh? = '';
    tenNhanVien? = '';
    sTrangThai? = '';

    constructor({
        id = Guid.create().toString(),
        idLoaiChungTu = 11,
        maHoaDon = '',
        idNhanVien = null,
        ngayLapHoaDon = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS'),
        tongTienThu = 0,
        noiDungThu = '',
        hachToanKinhDoanh = true,
        thuPhiTienGui = 0,
        diemThanhToan = 0,
        tienThu = 0
    }) {
        this.id = id;
        this.idLoaiChungTu = idLoaiChungTu;
        this.maHoaDon = maHoaDon;
        this.idNhanVien = idNhanVien;
        this.ngayLapHoaDon = ngayLapHoaDon;
        this.tongTienThu = tongTienThu;
        this.noiDungThu = noiDungThu;
        this.hachToanKinhDoanh = hachToanKinhDoanh;
        this.thuPhiTienGui = thuPhiTienGui;
        this.diemThanhToan = diemThanhToan;
        this.tienThu = tienThu;
        this.quyHoaDon_ChiTiet = [];

        Object.defineProperties(this, {
            sLoaiPhieu: {
                get() {
                    let txt = '';
                    switch (this.idLoaiChungTu) {
                        case 11:
                            txt = 'Phiếu thu';
                            break;
                        case 12:
                            txt = 'Phiếu chi';
                            break;
                    }
                    return txt;
                }
            },
            sTrangThai: {
                get() {
                    let txt = '';
                    switch (this.trangThai) {
                        case 1:
                            txt = 'Đã thanh toán';
                            break;
                        case 0:
                            txt = 'Đã hủy';
                            break;
                    }
                    return txt;
                }
            }
        });
    }
}
