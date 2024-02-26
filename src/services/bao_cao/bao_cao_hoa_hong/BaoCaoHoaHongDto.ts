import { IHoaDonChiTiet_UseForBaoCao } from '../../ban_hang/HoaDonChiTietDto';
import { RequestFromToDto } from '../../dto/ParamSearchDto';
import { IHangHoaInfor_UseForBaoCao } from '../../product/dto';

export interface PageBaoCaoHoaHongTongHop {
    idNhanVien: string;
    maNhanVien: string;
    tenNhanVien: string;
    hoaHongThucHien_TienChietKhau: number;
    hoaHongTuVan_TienChietKhau: number;
    tongHoaHong: number;
}
export interface PageBaoCaoHoaHongChiTiet
    extends PageBaoCaoHoaHongTongHop,
        IHangHoaInfor_UseForBaoCao,
        IHoaDonChiTiet_UseForBaoCao {
    id: string; //--- chỉ lấy ra với mục đích tránh lỗi samekey data grid MUI (id in Bh_NhanVienThucHien)
    maHoaDon: string;
    ngayLapHoaDon: string;
    maKhachHang: string;
    tenKhachHang: string;
    hoaHongThucHien_PTChietKhau: number;
    hoaHongTuVan_PTChietKhau: number;
}

export class ParamSearchBaoCaoHoaHong extends RequestFromToDto {
    idLoaiChungTus?: string[];
    idNhomHangs?: string[];

    constructor({
        idChiNhanhs = [''],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        fromDate = null,
        toDate = null,
        idLoaiChungTus = [''],
        idNhomHangs = ['']
    }) {
        super({
            idChiNhanhs: idChiNhanhs,
            textSearch: textSearch,
            currentPage: currentPage,
            pageSize: pageSize,
            columnSort: columnSort,
            typeSort: typeSort,
            fromDate: fromDate,
            toDate: toDate
        });
        this.idLoaiChungTus = idLoaiChungTus;
        this.idNhomHangs = idNhomHangs;
    }
}
