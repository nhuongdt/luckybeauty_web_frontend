import Cookies from 'js-cookie';
import http from '../../httpService';
import ILichSuNap_ChuyenTienDto from './ILichSuNap_ChuyenTienDto';
import utils from '../../../utils/utils';

class LichSuNap_ChuyenTienService {
    ThemMoi_CapNhatPhieuChuyenTien = async (tenantId: number, input: ILichSuNap_ChuyenTienDto) => {
        const result = await http.post(
            `api/services/app/LichSuNap_ChuyenTien/ThemMoi_CapNhatPhieuChuyenTien?tenantId=${tenantId}`,
            input
        );
        return result.data.result;
    };
    ThemMoi_CapNhatPhieuNapTien = async (tenantId: number, input: ILichSuNap_ChuyenTienDto) => {
        const result = await http.post(
            `api/services/app/LichSuNap_ChuyenTien/ThemMoi_CapNhatPhieuNapTien?tenantId=${tenantId}`,
            input
        );
        return result.data.result;
    };
    GetBrandnameBalance_byUserLogin = async (): Promise<number> => {
        const userId = Cookies.get('userId');
        if (!utils.checkNull(userId)) {
            const result = await http.get(
                `api/services/app/LichSuNap_ChuyenTien/GetBrandnameBalance_byUserLogin?tenantId=${userId}`
            );
            return result.data.result;
        }
        return 0;
    };
}

export default new LichSuNap_ChuyenTienService();
