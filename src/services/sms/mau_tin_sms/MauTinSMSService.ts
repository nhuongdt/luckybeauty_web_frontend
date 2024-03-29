import http from '../../httpService';
import { MauTinSMSDto, GroupMauTinSMSDto } from './mau_tin_dto';

class MauTinSMSService {
    GetAllMauTinSMS = async (): Promise<MauTinSMSDto[]> => {
        const xx = await http.get(`api/services/app/MauTinSMS/GetAllMauTinSMS`);
        return xx.data.result;
    };
    GetAllMauTinSMS_GroupLoaiTin = async (): Promise<GroupMauTinSMSDto[]> => {
        const xx = await http.get(`api/services/app/MauTinSMS/GetAllMauTinSMS_GroupLoaiTin`);
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
export default new MauTinSMSService();
