import { makeAutoObservable } from 'mobx';
import { SuggestDichVuDto } from '../services/suggests/dto/SuggestDichVuDto';
import { SuggestNhanVienDichVuDto } from '../services/suggests/dto/SuggestNhanVienDichVuDto';
import SuggestService from '../services/suggests/SuggestService';
import { SuggestChucVuDto } from '../services/suggests/dto/SuggestChucVuDto';

class SuggestStore {
    suggestKyThuatVien!: SuggestNhanVienDichVuDto[];
    suggestDichVu!: SuggestDichVuDto[];
    suggestChucVu!: SuggestChucVuDto[];
    constructor() {
        makeAutoObservable(this);
    }
    async getSuggestKyThuatVien(idNhanVien?: string) {
        const data = await SuggestService.SuggestNhanVienLamDichVu(idNhanVien);
        this.suggestKyThuatVien = data;
    }
    async getSuggestDichVu() {
        const data = await SuggestService.SuggestDichVu();
        this.suggestDichVu = data;
    }
    async getSuggestChucVu() {
        const data = await SuggestService.SuggestChucVu();
        this.suggestChucVu = data;
    }
}
export default new SuggestStore();
