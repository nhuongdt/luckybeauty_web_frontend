import { Guid } from 'guid-typescript';
export default class NhanSuItemDto {
    id!: Guid;
    maNhanVien!: string;
    tenNhanVien!: string;
    diaChi!: string;
    soDienThoai!: string;
    cccd!: string;
    ngaySinh!: string;
    kieuNgaySinh!: number;
    gioiTinh!: number;
    ngayCap!: string;
    noiCap!: string;
    ngayVaoLam!: string;
    avatar!: string;
    tenChucVu!: string;
}
