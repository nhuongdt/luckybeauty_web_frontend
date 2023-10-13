import http from '../../httpService';
import ILichSuNap_ChuyenTienDto from './ILichSuNap_ChuyenTienDto';

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
}

export default new LichSuNap_ChuyenTienService();
