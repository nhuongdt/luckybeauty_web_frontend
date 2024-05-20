import http from '../httpService';
import { IBankInfor } from './BaoKimDto';

class BaoKimPaymentServive {
    CreateQRCode = async (): Promise<IBankInfor> => {
        const xx = await http.post(`api/services/app/BaoKimPayment/CreateQRCode`);
        return xx.data.result;
    };
    UpdateQRCode = async (accNo: string): Promise<IBankInfor> => {
        const xx = await http.post(`api/services/app/BaoKimPayment/UpdateQRCode?accNo=${accNo}`);
        return xx.data.result;
    };
    NhanThongBaoGiaoDich = async (): Promise<IBankInfor> => {
        const xx = await http.post(`api/baokim-payment/webhook/transaction-notification`);
        return xx.data.result;
    };
}
export default new BaoKimPaymentServive();
