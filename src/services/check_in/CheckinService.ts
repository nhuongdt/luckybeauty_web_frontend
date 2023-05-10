import http from '../httpService';
import { KHCheckInDto } from './CheckinDto';
import { PagedKhachHangResultRequestDto } from '../khach-hang/dto/PagedKhachHangResultRequestDto';

class CheckinService {
    InsertCustomerCheckIn = async (input: KHCheckInDto) => {
        const xx = await http
            .post(`api/services/app/CheckIn/InsertCustomerCheckIn`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        console.log('InsertCustomerCheckIn', xx);
        return xx;
    };
    UpdatetCustomerCheckIn = async (input: KHCheckInDto) => {
        const xx = await http
            .post(`api/services/app/CheckIn/UpdatetCustomerCheckIn`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        console.log('InsertCustomerCheckIn', xx, input);
        return xx;
    };
    GetListCustomerChecking = async (input: any) => {
        const xx = await http
            .post(`api/services/app/CheckIn/GetListCustomerChecking`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        console.log('GetListCustomerChecking', xx, input);
        return xx;
    };
}
export default new CheckinService();
