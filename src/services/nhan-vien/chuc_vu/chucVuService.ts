import http from '../../httpService';
import { CreateOrEditChucVuDto } from './dto/CreateOrEditChucVuDto';

class ChucVuService {
    async CreateOrEditChucVu(input: CreateOrEditChucVuDto) {
        const response = await http.post(`/api/services/app/ChucVu/CreateOrEdit`, input);
        return response.data.result;
    }
}
export default new ChucVuService();
