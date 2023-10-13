export default interface ILichSuNap_ChuyenTienDto {
    tenantId: number;
    idPhieuNapTien: string;
    thoiGianNap_ChuyenTien: number;
    idNguoiChuyenTien?: number;
    idNguoiNhanTien?: number;
    soTienChuyen_Nhan: number;
    noiDungChuyen_Nhan: string;
}
