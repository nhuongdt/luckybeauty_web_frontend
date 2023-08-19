import { makeAutoObservable } from 'mobx';
import { DichVuNhanVienDetailDto } from '../services/dichvu_nhanvien/dto/DichVuNhanVienDetailDto';
import dichVuNhanVienService from '../services/dichvu_nhanvien/dichVuNhanVienService';

class DichVuNhanVienStore {
    idNhanVien!: string;
    dichVuNhanVienDetail!: DichVuNhanVienDetailDto;
    constructor() {
        makeAutoObservable(this);
    }
    async getDichVuNhanVienDetail(idNhanVien: string) {
        const data = await dichVuNhanVienService.getDichVuNhanVienDetail(idNhanVien);
        this.dichVuNhanVienDetail = data;
    }
}
export default new DichVuNhanVienStore();
