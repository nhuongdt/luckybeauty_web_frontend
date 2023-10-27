import { Guid } from 'guid-typescript';
import { PagedResultDto } from '../../dto/pagedResultDto';

export class CreateOrEditSMSDto {
    id = Guid.EMPTY;
    idChiNhanh: string;
    soTinGui = 1;
    noiDungTin = '';
    idKhachHang = Guid.EMPTY;
    soDienThoai = '';
    idHoaDon?: string | null;

    idLoaiTin?: string | null = null;
    idNguoiGui?: string | null = null;

    tenKhachHang = '';
    loaiTinNhan = '';
    thoiGianGui = new Date();
    sTrangThaiGuiTinNhan = '';

    constructor({
        idChiNhanh = Guid.EMPTY,
        idKhachHang = Guid.EMPTY,
        noiDungTin = '',
        soTinGui = 1,
        soDienThoai = ''
    }) {
        this.idChiNhanh = idChiNhanh;
        this.idKhachHang = idKhachHang;
        this.noiDungTin = noiDungTin;
        this.soTinGui = soTinGui;
        this.soDienThoai = soDienThoai;
    }
}

export class PagedResultSMSDto implements PagedResultDto<CreateOrEditSMSDto> {
    totalCount: number;
    totalPage: number;
    items: CreateOrEditSMSDto[];

    constructor({ totalCount = 0, totalPage = 0, items = [] }) {
        this.totalCount = totalCount;
        this.totalPage = totalPage;
        this.items = items;
    }
}
