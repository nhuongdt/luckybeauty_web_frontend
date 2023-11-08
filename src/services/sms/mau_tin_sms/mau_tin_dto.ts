export class MauTinSMSDto {
    id: string;
    idLoaiTin: number;
    tenMauTin: string;
    noiDungTinMau?: string;
    laMacDinh: boolean;
    trangThai: number;

    constructor({ id = '', idLoaiTin = 1, tenMauTin = '', noiDungTinMau = '', laMacDinh = true, trangThai = 1 }) {
        this.id = id;
        this.idLoaiTin = idLoaiTin;
        this.tenMauTin = tenMauTin;
        this.noiDungTinMau = noiDungTinMau;
        this.laMacDinh = laMacDinh;
        this.trangThai = trangThai;
    }
}
