import { List } from "lodash";
import { SuggestPhongBanDto } from "./dto/SuggestPhongBanDto";
import http from "../httpService";
import { SuggestCaLamViecDto } from "./dto/SuggestCaLamViecDto";
import { SuggestChiNhanhDto } from "./dto/SuggestChiNhanhDto";
import { SuggestLoaiHangHoaDto } from "./dto/SuggestLoaiHangHoa";
import { SuggestHangHoaDto } from "./dto/SuggestHangHoaDto";
import { SuggestDonViQuiDoiDto } from "./dto/SuggestDonViQuiDoi";
import { SuggestNguonKhachDto } from "./dto/SuggestNguonKhachDto";
import { SuggestNhomKhachDto } from "./dto/SuggestNhomKhachDto";
import { SuggestLoaiKhachDto } from "./dto/SuggestLoaiKhachDto";
import { SuggestKhachHangDto } from "./dto/SuggestKhachHangDto";
import { SuggestNhanSuDto } from "./dto/SuggestNhanSuDto";
import { SuggestChucVuDto } from "./dto/SuggestChucVuDto";

class SuggestService{
    public async SuggestPhongBan():Promise<SuggestPhongBanDto[]>{
        const result =await http.post('api/services/app/Suggest/SuggestPhongBans');
        return result.data.result
    }
    public async SuggestCaLamViec():Promise<SuggestCaLamViecDto[]>{
        const result =await http.post('api/services/app/Suggest/SuggestPhongBans');
        return result.data.result
    }
    public async SuggestChiNhanh():Promise<SuggestChiNhanhDto[]>{
        const result =await http.post('api/services/app/Suggest/SuggestChiNhanhs');
        return result.data.result
    }
    public async SuggestLoaiHangHoa():Promise<SuggestLoaiHangHoaDto[]>{
        const result =await http.post('api/services/app/Suggest/SuggestLoaiHangHoas');
        return result.data.result
    }
    public async SuggestHangHoa():Promise<SuggestHangHoaDto[]>{
        const result =await http.post('api/services/app/Suggest/SuggestHangHoas');
        return result.data.result
    }
    public async SuggestDonViQuiDoi():Promise<SuggestDonViQuiDoiDto[]>{
        const result =await http.post('api/services/app/Suggest/SuggestDonViQuiDois');
        return result.data.result
    }
    public async SuggestNguonKhach():Promise<SuggestNguonKhachDto[]>{
        const result =await http.post('api/services/app/Suggest/SuggestNguonKhachHangs');
        return result.data.result
    }
    public async SuggestNhomKhach():Promise<SuggestNhomKhachDto[]>{
        const result =await http.post('api/services/app/Suggest/SuggestNhomKhachHangs');
        return result.data.result
    }
    public async SuggestLoaiKhach():Promise<SuggestLoaiKhachDto[]>{
        const result =await http.post('api/services/app/Suggest/SuggestLoaiKhachHangs');
        return result.data.result
    }
    public async SuggestKhachHang():Promise<SuggestKhachHangDto[]>{
        const result =await http.post('api/services/app/Suggest/SuggestKhachHangs');
        return result.data.result
    }
    public async SuggestNhanSu():Promise<SuggestNhanSuDto[]>{
        const result =await http.post('api/services/app/Suggest/SuggestNhanSus');
        return result.data.result
    }
    public async SuggestChucVu():Promise<SuggestChucVuDto[]>{
        const result =await http.post('api/services/app/Suggest/SuggestChucVus');
        return result.data.result
    }
}
export default new SuggestService()