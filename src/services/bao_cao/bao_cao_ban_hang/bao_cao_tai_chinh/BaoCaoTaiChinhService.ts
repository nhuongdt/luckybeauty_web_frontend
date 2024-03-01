import { IFileDto } from '../../../dto/FileDto';
import { PagedResultDto } from '../../../dto/pagedResultDto';
import http from '../../../httpService';
import { IBaoCaoTaiChinh_ChiTietSoQuy, ParamSearchBaoCaoTaiChinh } from './BaoCaoTaiChinhDto';

class BaoCaoTaiChinhService {
    GetBaoCaoTaichinh_ChiTietSoQuy = async (
        input: ParamSearchBaoCaoTaiChinh
    ): Promise<PagedResultDto<IBaoCaoTaiChinh_ChiTietSoQuy>> => {
        const response = await http.post('api/services/app/BaoCao/GetBaoCaoTaichinh_ChiTietSoQuy', input);
        return response.data.result;
    };
    GetBaoCaoHoaHongChiTiet = async (
        input: ParamSearchBaoCaoTaiChinh
    ): Promise<PagedResultDto<IBaoCaoTaiChinh_ChiTietSoQuy>> => {
        const response = await http.post('api/services/app/BaoCao/BaoCaoHoaHongChiTiet', input);
        return response.data.result;
    };
    ExportToExcel_BaoCaoHoaHongTongHop = async (input: ParamSearchBaoCaoTaiChinh): Promise<IFileDto> => {
        const response = await http.post('api/services/app/BaoCao/ExportToExcel_BaoCaoHoaHongTongHop', input);
        return response.data.result;
    };
    ExportToExcel_BaoCaoHoaHongChiTiet = async (input: ParamSearchBaoCaoTaiChinh): Promise<IFileDto> => {
        const response = await http.post('api/services/app/BaoCao/ExportToExcel_BaoCaoHoaHongChiTiet', input);
        return response.data.result;
    };
}

export default new BaoCaoTaiChinhService();
