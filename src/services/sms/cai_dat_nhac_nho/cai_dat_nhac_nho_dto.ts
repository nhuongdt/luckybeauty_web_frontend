import { Guid } from 'guid-typescript';

export class CaiDatNhacNhoDto {
    id: string;
    idLoaiTin: number;
    idMauTin: string | null;
    noiDungTin?: string;
    nhacTruocKhoangThoiGian = 0;
    loaiThoiGian = 0;
    trangThai = 1;

    caiDatNhacNhoChiTiets?: CaiDatNhacNhoChiTietDto[] = [];

    constructor({
        id = Guid.EMPTY,
        idLoaiTin = 1,
        idMauTin = null,
        noiDungTin = '',
        nhacTruocKhoangThoiGian = 0,
        loaiThoiGian = 0,
        trangThai = 1,
        caiDatNhacNhoChiTiets = []
    }) {
        this.id = id;
        this.idLoaiTin = idLoaiTin;
        this.idMauTin = idMauTin;
        this.noiDungTin = noiDungTin;
        this.nhacTruocKhoangThoiGian = nhacTruocKhoangThoiGian;
        this.loaiThoiGian = loaiThoiGian;
        this.trangThai = trangThai;
        this.caiDatNhacNhoChiTiets = caiDatNhacNhoChiTiets;
    }
}

export class CaiDatNhacNhoChiTietDto {
    id = '';
    idCaiDatNhacTuDong = '';
    hinhThucGui = 1;
    trangThai = 0;
}
