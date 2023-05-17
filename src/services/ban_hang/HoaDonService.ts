import http from '../httpService';
class HoaDonService {
    CreateHoaDon = async (input: any) => {
        const result = await http.post('api/services/app/HoaDon/CreateHoaDon', input);
        console.log('CreateHoaDon ', result);
        return result.data.result;
    };
    CreateHoaDon2 = async (input: any) => {
        const result = await http.post('api/services/app/HoaDon/CreateHoaDon2', input);
        console.log('CreateHoaDon ', result);
        return result.data.result;
    };
    UpdateHoaDon = async (input: any) => {
        const result = await http.post('api/services/app/HoaDon/UpdateHoaDon', input);
        console.log('UpdateHoaDon ', result);
        return result.data.result;
    };
}

export default new HoaDonService();
