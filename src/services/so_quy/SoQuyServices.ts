import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { PagedQuyHoaDonRequestDto } from './Dto/PagedQuyHoaDonRequest';
import { GetAllQuyHoaDonItemDto } from './Dto/QuyHoaDonViewItemDto';

class SoQuyServices {
    CreateQuyHoaDon = async (input: any) => {
        const result = await http.post('api/services/app/QuyHoaDon/Create', input);
        return result.data.result;
    };
    async getAll(input: PagedQuyHoaDonRequestDto): Promise<PagedResultDto<GetAllQuyHoaDonItemDto>> {
        const response = await http.get('api/services/app/QuyHoaDon/GetAll', {
            params: input
        });
        return response.data.result;
    }
}

export default new SoQuyServices();
