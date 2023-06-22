import http from '../httpService';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import { Guid } from 'guid-typescript';
import { HoaDonRequestDto } from '../dto/ParamSearchDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import utils from '../../utils/utils';
class HoaDonService {
    CreateHoaDon = async (input: any) => {
        if (input.idKhachHang === '' || input.idKhachHang === Guid.EMPTY.toString()) {
            input.idKhachHang = null;
        }
        const result = await http.post('api/services/app/HoaDon/CreateHoaDon', input);
        return result.data.result;
    };
    CreateHoaDon2 = async (input: {
        hoadon: PageHoaDonDto;
        hoadonChiTiet: PageHoaDonChiTietDto[];
    }) => {
        const result = await http.post('api/services/app/HoaDon/CreateHoaDon2', input);

        return result.data.result;
    };
    UpdateHoaDon = async (input: any) => {
        const result = await http.post('api/services/app/HoaDon/UpdateHoaDon', input);
        console.log('UpdateHoaDon ', result);
        return result.data.result;
    };
    GetListHoaDon = async (input: HoaDonRequestDto): Promise<PagedResultDto<PageHoaDonDto>> => {
        const result = await http.post('api/services/app/HoaDon/GetListHoaDon', input);
        return result.data.result;
    };
    GetInforHoaDon_byId = async (id: string): Promise<PageHoaDonDto[]> => {
        if (utils.checkNull(id)) {
            return [];
        }
        const result = await http.get(`api/services/app/HoaDon/GetInforHoaDon_byId?id=${id}`);
        return result.data.result;
    };
    GetChiTietHoaDon_byIdHoaDon = async (idHoaDon: string): Promise<PageHoaDonChiTietDto[]> => {
        if (utils.checkNull(idHoaDon)) {
            return [];
        }
        const result = await http.get(
            `api/services/app/HoaDon/GetChiTietHoaDon_byIdHoaDon?idHoaDon=${idHoaDon}`
        );
        return result.data.result;
    };
}

export default new HoaDonService();
