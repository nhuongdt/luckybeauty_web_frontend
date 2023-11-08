import http from '../../httpService';
import { MauTinSMSDto } from './mau_tin_dto';

class MauTinSMService {
    GetAllMauTinSMS = async (): Promise<MauTinSMSDto[]> => {
        const xx = await http.get(`api/services/app/MauTinSMS/GetAllMauTinSMS`);
        return xx.data.result;
    };
    CreateMauTinSMS = async (input: MauTinSMSDto): Promise<MauTinSMSDto> => {
        const xx = await http.post(`api/services/app/MauTinSMS/CreateMauTinSMS`, input);
        return xx.data.result;
    };
    UpdateMauTinSMS = async (input: MauTinSMSDto): Promise<string> => {
        const xx = await http.post(`api/services/app/MauTinSMS/UpdateMauTinSMS`, input);
        return xx.data.result;
    };
}
export default new MauTinSMService();
