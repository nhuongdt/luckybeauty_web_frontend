import http from '../httpService';
import { CreateCuaHangDto } from './Dto/CreateCuaHangDto';
import { CuaHangDto } from './Dto/CuaHangDto';
import { EditCuaHangDto } from './Dto/EditCuaHangDto';

class CuaHangService {
    async Create(input: CreateCuaHangDto): Promise<CuaHangDto> {
        const result = await http.post('api/services/app/CuaHang/CreateCuaHang', input);
        return result.data.result;
    }
    async Update(input: EditCuaHangDto): Promise<CuaHangDto> {
        const result = await http.post('api/services/app/CuaHang/EditCuaHang', input);
        return result.data.result;
    }
    async delete(id: string) {
        const result = await http.post(`api/services/app/CuaHang/DeleteCongTy?id=${id}`);
        return result.data.result;
    }
    async getCongTyEdit(idChiNhanh: string): Promise<EditCuaHangDto> {
        const result = await http.get(
            `api/services/app/CuaHang/GetCongTyForEdit?idChiNhanh=${idChiNhanh}`
        );
        return result.data.result;
    }
}
export default new CuaHangService();
