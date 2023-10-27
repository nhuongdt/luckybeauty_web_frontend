export interface NganHangDto {
    id: string;
    maNganHang: string;
    tenNganHang: string;
    bin: string;
    logo: string;
    tenRutGon: string;
}

export interface TaiKhoanNganHangDto {
    id: string;
    tenChuThe: string;
    soTaiKhoan: string;
    idNganHang: string;
    ghiChu?: string;

    maNganHang: string;
    tenNganHang: string;
    loGoNganHang: string;
    maPinNganHang: string;
    tenRutGon: string;
}
