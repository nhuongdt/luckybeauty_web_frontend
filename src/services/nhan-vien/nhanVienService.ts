import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { CreateOrUpdateNhanSuDto } from './dto/createOrUpdateNhanVienDto';
import NhanSuDto from './dto/nhanSuDto';
import NhanSuItemDto from './dto/nhanSuItemDto';
import { PagedNhanSuRequestDto } from './dto/PagedNhanSuRequestDto';

class NhanVienService {
    public async createOrEdit(createOrEditInput: CreateOrUpdateNhanSuDto): Promise<NhanSuItemDto> {
        const result = await http.post('api/services/app/NhanSu/CreateOrEdit', createOrEditInput);
        return result.data.result;
    }
    public async getAll(input: PagedNhanSuRequestDto): Promise<PagedResultDto<NhanSuItemDto>> {
        const result = await http.get(`api/services/app/NhanSu/GetAll`, {
            params: JSON.stringify(input)
        });
        return result.data.result;
    }
    public async search(
        keyword: string,
        input: PagedFilterAndSortedRequest
    ): Promise<PagedResultDto<NhanSuItemDto>> {
        const result = await http.post(
            `api/services/app/NhanSu/Search?keyWord=${keyword.toString()}`,
            input
        );
        return result.data.result;
    }
    public async getNhanSu(id: string): Promise<CreateOrUpdateNhanSuDto> {
        const result = await http.post(`api/services/app/NhanSu/GetNhanSu?id=${id}`);
        return result.data.result;
    }
    public async delete(id: string): Promise<NhanSuDto> {
        const result = await http.post(`api/services/app/NhanSu/Delete?id=${id}`);
        return result.data.result;
    }
}
export default new NhanVienService();
