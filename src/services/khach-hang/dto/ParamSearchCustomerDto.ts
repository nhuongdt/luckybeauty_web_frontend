import { LoaiKhachHang } from '../../../enum/LoaiKhachHang';
import { RequestFromToDto } from '../../dto/ParamSearchDto';

export class ParamSearchCustomerDto extends RequestFromToDto {
    loaiDoiTuong: number;
    idNhomKhachs?: string[];
    idNguonKhachs?: string[];
    gioiTinh?: boolean | null;
    ngaySinhFrom?: string | null;
    ngaySinhTo?: string | null;
    creationTimeFrom?: string | null;
    creationTimeTo?: string | null;
    tongChiTieuTu?: number | null;
    tongChiTieuDen?: number | null;
    conNoFrom?: number | null;
    conNoTo?: number | null;

    constructor({
        idChiNhanhs = [],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        fromDate = null,
        toDate = null,

        loaiDoiTuong = LoaiKhachHang.KHACH_HANG,
        idNhomKhachs = [],
        idNguonKhachs = [],
        gioiTinh = null,
        ngaySinhFrom = null,
        ngaySinhTo = null,
        creationTimeFrom = null,
        creationTimeTo = null,
        tongChiTieuTu = null,
        tongChiTieuDen = null,
        conNoFrom = null,
        conNoTo = null
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
        this.loaiDoiTuong = loaiDoiTuong;
        this.idNhomKhachs = idNhomKhachs;
        this.idNguonKhachs = idNguonKhachs;
        this.gioiTinh = gioiTinh;
        this.ngaySinhFrom = ngaySinhFrom;
        this.ngaySinhTo = ngaySinhTo;
        this.creationTimeFrom = creationTimeFrom;
        this.creationTimeTo = creationTimeTo;
        this.tongChiTieuTu = tongChiTieuTu;
        this.tongChiTieuDen = tongChiTieuDen;
        this.conNoFrom = conNoFrom;
        this.conNoTo = conNoTo;
    }
}
