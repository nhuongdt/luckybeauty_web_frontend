import { Guid } from 'guid-typescript';
import { PagedResultDto } from '../../dto/pagedResultDto';

export class CreateOrEditSMSDto {
    id = Guid.EMPTY;
    idTinNhan = Guid.EMPTY;
    idChiNhanh: string;
    idBrandname?: string;
    soTinGui = 1;
    noiDungTin = '';
    idKhachHang = Guid.EMPTY;
    soDienThoai = '';
    idHoaDon?: string | null;
    trangThai = 100;

    idLoaiTin = 1;
    idNguoiGui?: string | null = null;

    tenKhachHang = '';
    loaiTinNhan = '';
    thoiGianGui = new Date();
    sTrangThaiGuiTinNhan = '';

    constructor({
        idLoaiTin = 1,
        idChiNhanh = Guid.EMPTY,
        idKhachHang = Guid.EMPTY,
        noiDungTin = '',
        soTinGui = 1,
        soDienThoai = ''
    }) {
        this.idLoaiTin = idLoaiTin;
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

// ESMS
export class ESMSDto {
    phone: string;
    content: string;
    brandname: string;

    constructor({ sdtKhachhang = '', noiDungTin = '', tenBranname = '' }) {
        this.phone = sdtKhachhang;
        this.content = noiDungTin;
        this.brandname = tenBranname;
    }
}

export class ResultESMSDto {
    messageId: string;
    messageStatus: number;

    constructor({ messageId = '', messageStatus = 100 }) {
        this.messageId = messageId;
        this.messageStatus = messageStatus;
    }
}
