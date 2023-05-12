import http from '../httpService';
import { KHCheckInDto, PageKhachHangCheckInDto } from './CheckinDto';
import { PagedKhachHangResultRequestDto } from '../khach-hang/dto/PagedKhachHangResultRequestDto';

class CheckinService {
    InsertCustomerCheckIn = async (input: KHCheckInDto) => {
        const xx = await http
            .post(`api/services/app/CheckIn/InsertCustomerCheckIn`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    UpdatetCustomerCheckIn = async (input: KHCheckInDto) => {
        const xx = await http
            .post(`api/services/app/CheckIn/UpdatetCustomerCheckIn`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    GetListCustomerChecking = async (input: any): Promise<PageKhachHangCheckInDto[]> => {
        const xx = await http
            .post(`api/services/app/CheckIn/GetListCustomerChecking`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
}
export default new CheckinService();
