export interface TaiKhoanNganHangDto {
    id: string;
    tenChuThe: string;
    soTaiKhoan: string;
    idNganHang: string;
    ghiChu?: string;

    tenNganHang: string;
}

export interface NganHangDto {
    id: string;
    maNganHang: string;
    tenNganHang: string;
}
