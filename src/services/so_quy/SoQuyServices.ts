import { async } from 'q';
import http from '../httpService';
import QuyHoaDonDto from '../so_quy/QuyHoaDonDto';

class SoQuyServices {
    CreateQuyHoaDon = async (input: any) => {
        const result = await http.post('api/services/app/QuyHoaDon/Create', input);
        return result.data.result;
    };
    GetNhatKyThanhToan_ofHoaDon = async (idHoaDonLienQuan: string): Promise<QuyHoaDonDto[]> => {
        const result = await http.get(
            `api/services/app/QuyHoaDon/GetNhatKyThanhToan_ofHoaDon?idHoaDonLienQuan=${idHoaDonLienQuan}`
        );
        console.log('GetNhatKyThanhToan_ofHoaDon ', result.data.result);
        return result.data.result;
    };
}

export default new SoQuyServices();
