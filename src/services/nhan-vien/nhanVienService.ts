import { Guid } from "guid-typescript"
import { PagedFilterAndSortedRequest } from "../dto/pagedFilterAndSortedRequest"
import { PagedResultDto } from "../dto/pagedResultDto"
import http from "../httpService"
import {CreateOrUpdateNhanSuDto} from "./dto/createOrUpdateNhanVienDto"
import NhanSuDto from "./dto/nhanSuDto"
import NhanSuItemDto from "./dto/nhanSuItemDto"
import Cookies from "js-cookie"

class NhanVienService {
    public async createOrEdit(
        createOrEditInput: CreateOrUpdateNhanSuDto
      ): Promise<NhanSuItemDto> {
        const result = await http.post(
          'api/services/app/NhanSu/CreateOrEdit',
          createOrEditInput
        )
        return result.data.sussess
    }
    public async search(keyword: string, input: PagedFilterAndSortedRequest):Promise<PagedResultDto<NhanSuItemDto>>{
        const result = await http.post(
            `api/services/app/NhanSu/Search?keyWord=${keyword!==""? keyword: ''}`,
            input,{
                headers:{
                    "Accept": 'text-plain',
                    //"Authorization": "Bearer " + Cookies.get("accessToken"),
                    "X-XSRF-TOKEN" : Cookies.get("encryptedAccessToken")
                }
            }
        )
        return result.data.result
    }
    public async getNhanSu(id:string):Promise<CreateOrUpdateNhanSuDto>{
        const result = await http.post(
            `api/services/app/NhanSu/GetNhanSu?id=${id}`
          )
          return result.data.result
    }
    public async delete(id: string):Promise<NhanSuDto>{
        const result = await http.post(
            `api/services/app/NhanSu/Delete?id=${id}`
        )
        return result.data.result
    }
}
export default new NhanVienService()