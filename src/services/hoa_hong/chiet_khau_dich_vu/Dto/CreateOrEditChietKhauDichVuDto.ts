export interface CreateOrEditChietKhauDichVuDto {
    id: string;
    idChiNhanh: string;
    idNhanViens: string[];
    idDonViQuiDoi: string;
    loaiChietKhau: number;
    giaTri: number;
    laPhanTram: boolean;
}
