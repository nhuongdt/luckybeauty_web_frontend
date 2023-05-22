import http from '../httpService';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
class HoaDonService {
    CreateHoaDon = async (input: any) => {
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
}

export default new HoaDonService();
