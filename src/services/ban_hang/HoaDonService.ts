import http from '../httpService';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import { Guid } from 'guid-typescript';
import { HoaDonRequestDto } from '../dto/ParamSearchDto';
import { PagedResultDto } from '../dto/pagedResultDto';
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
}

export default new HoaDonService();
