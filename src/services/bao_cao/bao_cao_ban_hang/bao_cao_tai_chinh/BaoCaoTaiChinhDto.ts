import { RequestFromToDto } from '../../../dto/ParamSearchDto';

export interface IBaoCaoTaiChinh_ChiTietSoQuy {
    id: string;
    maPhieuThuChi: string;
    ngayLapPhieu: string;
    tenNguoiNopTien: string;
    maHoaDonLienQuans: string;

    thu_TienMat: number;
    thu_TienChuyenKhoan: number;
    thu_TienQuyetThe: number;
    chi_TienMat: number;
    chi_TienChuyenKhoan: number;
    chi_TienQuyetThe: number;
    tienThu: number;
    tienChi: number;
    tongThuChi: number;

    sum_ThuTienMat: number;
    sum_ThuTienChuyenKhoan: number;
    sum_ThuTienQuyetThe: number;
    sum_ChiTienMat: number;
    sum_ChiTienChuyenKhoan: number;
    sum_ChiTienQuyetThe: number;
    sumTienThu: number;
    sumTienChi: number;
    sumTongThuChi: number;

    noiDungThu: string;
}

export interface IBaoCaoCongNoKhachHang {
    maKhachHang: string;
    tenKhachHang: string;
    maHoaDon: string;
    ngayLapHoaDon: string;
    tongPhaiTra: number;
    khachDaTra: number;
    conNo: string;
    ghiChuHD: string;

    sumTongPhaiTra: number;
    sumConNo: number;
}

export class ParamSearchBaoCaoTaiChinh extends RequestFromToDto {
    idLoaiChungTus?: string[];
    ngayLapHoaDon_FromDate?: string | null;
    ngayLapHoaDon_ToDate?: string | null;

    constructor({
        idChiNhanhs = [''],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        fromDate = null, // ngaylapPhieuThu
        toDate = null,
        idLoaiChungTus = [''],
        ngayLapHoaDon_FromDate = null,
        ngayLapHoaDon_ToDate = null
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
        this.ngayLapHoaDon_FromDate = ngayLapHoaDon_FromDate;
        this.ngayLapHoaDon_ToDate = ngayLapHoaDon_ToDate;
    }
}
