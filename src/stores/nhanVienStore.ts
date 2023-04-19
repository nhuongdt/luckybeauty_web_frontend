import { Guid } from "guid-typescript";
import { PagedResultDto } from "../services/dto/pagedResultDto";
import CreateOrUpdateNhanSuDto from "../services/nhan-vien/dto/createOrUpdateNhanVienDto";
import NhanSuItemDto from "../services/nhan-vien/dto/nhanSuItemDto";
import NhanVienService from "../services/nhan-vien/nhanVienService";
import NhanSuDto from "../services/nhan-vien/dto/nhanSuDto";
import { PagedFilterAndSortedRequest } from "../services/dto/pagedFilterAndSortedRequest";
import { makeAutoObservable } from "mobx";

class NhanVienStore{
    listNhanVien!: PagedResultDto<NhanSuItemDto>
    createEditNhanVien! : CreateOrUpdateNhanSuDto
    id!: Guid
    constructor(){
        makeAutoObservable(this)
    }
    async createOrEdit(createOrEditNhanSuInput: CreateOrUpdateNhanSuDto) {
        const result = await NhanVienService.createOrEdit(createOrEditNhanSuInput)
        
        this.listNhanVien.items.push(
           result
        )
    }
    async delete(id:Guid){
        const result = await NhanVienService.delete(id)
        this.listNhanVien.items.filter(x=>x.id!==id)
    }
    async search(keyWord:string,input: PagedFilterAndSortedRequest){
        const result = await NhanVienService.search(keyWord,input)
        this.listNhanVien = result
    }
}
export default NhanVienStore 