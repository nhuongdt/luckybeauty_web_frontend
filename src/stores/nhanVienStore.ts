import { Guid } from 'guid-typescript';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { CreateOrUpdateNhanSuDto } from '../services/nhan-vien/dto/createOrUpdateNhanVienDto';
import NhanSuItemDto from '../services/nhan-vien/dto/nhanSuItemDto';
import NhanVienService from '../services/nhan-vien/nhanVienService';
import NhanSuDto from '../services/nhan-vien/dto/nhanSuDto';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';
import { action, makeObservable, observable } from 'mobx';
import AppConsts from '../lib/appconst';

class NhanVienStore {
    listNhanVien!: PagedResultDto<NhanSuItemDto>;
    createEditNhanVien!: CreateOrUpdateNhanSuDto;
    id!: string;
    constructor() {
        makeObservable(this, {
            listNhanVien: observable,
            createEditNhanVien: observable,
            id: observable,
            createOrEdit: action,
            delete: action,
            search: action,
            getForEdit: action
        });
    }
    async createOrEdit(createOrEditNhanSuInput: CreateOrUpdateNhanSuDto) {
        const result = await NhanVienService.createOrEdit(createOrEditNhanSuInput);
        this.listNhanVien.items.push(result);
        await this.createNhanVien(createOrEditNhanSuInput.idChiNhanh ?? '');
    }
    async delete(id: string) {
        await NhanVienService.delete(id);
        this.listNhanVien.items = this.listNhanVien.items.filter((x) => x.id !== id);
    }
    async search(keyWord: string, input: PagedFilterAndSortedRequest) {
        const result = await NhanVienService.search(keyWord, input);
        this.listNhanVien = result;
    }
    async getForEdit(id: string) {
        const result = await NhanVienService.getNhanSu(id);
        this.createEditNhanVien = result;
    }
    async createNhanVien(idChiNhanh: string) {
        this.createEditNhanVien = {
            id: AppConsts.guidEmpty,
            maNhanVien: '',
            ho: '',
            tenLot: '',
            tenNhanVien: '',
            diaChi: '',
            soDienThoai: '',
            cccd: '',
            ngaySinh: '',
            kieuNgaySinh: 0,
            gioiTinh: 0,
            ngayCap: '',
            noiCap: '',
            avatar: '',
            idChucVu: '',
            idChiNhanh: idChiNhanh,
            ghiChu: ''
        };
    }
}
export default new NhanVienStore();
