import { Guid } from "guid-typescript";
import { PagedKhachHangResultRequestDto } from "./dto/PagedKhachHangResultRequestDto";
import { PagedResultDto } from "../dto/pagedResultDto";
import { KhachHangItemDto } from "./dto/KhachHangItemDto";
import Cookies from "js-cookie";
import http from "../httpService";
import  {CreateOrEditKhachHangDto} from "./dto/CreateOrEditKhachHangDto";
import { KhachHangDto } from "./dto/KhachHangDto";

class KhachHangService{
    public async getAll(input:PagedKhachHangResultRequestDto):Promise<PagedResultDto<KhachHangItemDto>>{
        const result = await http.post(
            `api/services/app/KhachHang/Search`,
            input,{
                headers:{
                    "Accept": 'text-plain',
                    "X-XSRF-TOKEN" : Cookies.get("encryptedAccessToken")
                }
            }
        )
        return result.data.result
    }
    public async create(input:CreateOrEditKhachHangDto):Promise<KhachHangDto>{
        const result = await http.post(
            "api/services/app/KhachHang/CreateKhachHang",input
        )
        return result.data.result
    }
    public async update(input:CreateOrEditKhachHangDto):Promise<KhachHangDto>{
        const result = await http.post(
            "api/services/app/KhachHang/EditKhachHang",input
        )
        return result.data.result
    }
    public async getDetail(id:Guid){

    }
    public async getKhachHang(id:string):Promise<CreateOrEditKhachHangDto>{
        const result = await http.get(
            `api/services/app/KhachHang/GetKhachHang?id=${id}`
        )
        return result.data.result
    }
    public async delete(id:string){
        const result = await http.post(
            `api/services/app/KhachHang/Delete?id=${id}`
        )
        return result.data.result
    }
}
export default new KhachHangService()