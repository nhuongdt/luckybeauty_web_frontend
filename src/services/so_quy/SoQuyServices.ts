import http from '../httpService';

class SoQuyServices {
    CreateQuyHoaDon = async (input: any) => {
        const result = await http.post('api/services/app/QuyHoaDon/Create', input);
        return result.data.result;
    };
}

export default new SoQuyServices();
