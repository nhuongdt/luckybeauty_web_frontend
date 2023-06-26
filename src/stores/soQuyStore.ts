import { makeAutoObservable } from 'mobx';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { GetAllQuyHoaDonItemDto } from '../services/so_quy/Dto/QuyHoaDonViewItemDto';
import { PagedQuyHoaDonRequestDto } from '../services/so_quy/Dto/PagedQuyHoaDonRequest';
import SoQuyServices from '../services/so_quy/SoQuyServices';
import { CreateOrEditSoQuyDto } from '../services/so_quy/Dto/CreateOrEditSoQuyDto';

class SoQuyStore {
    lstSoQuy!: PagedResultDto<GetAllQuyHoaDonItemDto>;
    createOrEditSoQuyDto: CreateOrEditSoQuyDto = {
        id: '',
        maPhieu: ''
    };
    constructor() {
        makeAutoObservable(this);
    }
    async getAll(input: PagedQuyHoaDonRequestDto) {
        const response = await SoQuyServices.getAll(input);
        this.lstSoQuy = response;
    }
}
export default new SoQuyStore();
