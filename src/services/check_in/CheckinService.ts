import http from '../httpService';
import { KHCheckInDto } from './CheckinDto';
import Utils from '../../utils/utils';

class CheckinService {
    InsertCustomerCheckIn = async (input: KHCheckInDto) => {
        const xx = await http
            .post(`api/services/app/HangHoa/InsertCustomerCheckIn`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        console.log('InsertCustomerCheckIn', xx, input);
        return xx;
    };
    UpdatetCustomerCheckIn = async (input: KHCheckInDto) => {
        const xx = await http
            .post(`api/services/app/HangHoa/UpdatetCustomerCheckIn`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        console.log('InsertCustomerCheckIn', xx, input);
        return xx;
    };
}
export default new CheckinService();
