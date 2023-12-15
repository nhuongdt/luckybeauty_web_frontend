export interface CreateOrEditChietKhauDichVuDto {
    id?: string;
    idChiNhanh: string;
    idNhanViens: string[];
    idDonViQuiDoi: string;
    loaiChietKhau: number;
    giaTri: number;
    laPhanTram: boolean;
}
export interface ChietKhauDichVuDto_AddMultiple {
    idChiNhanh: string | null;
    idNhanViens: string[];
    idDonViQuyDois: string[];
    loaiChietKhau: number;
    giaTri: number;
    laPhanTram: boolean;
}
