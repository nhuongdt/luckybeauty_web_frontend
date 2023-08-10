import http from '../httpService';
import { DashboardFilter } from './dto/dashboardFilter';

class DashboardService {
    public async thongKeSoLuong(input: DashboardFilter) {
        const response = await http.post(`api/services/app/Dashboard/ThongKeSoLuong`, input);
        return response.data.result;
    }
    public async danhSachLichHen(input: DashboardFilter) {
        const response = await http.post(`api/services/app/Dashboard/DanhSachLichHen`, input);
        return response.data.result;
    }
    public async thongKeLichHen(input: DashboardFilter) {
        const response = await http.post(`api/services/app/Dashboard/ThongKeLichHen`, input);
        return response.data.result;
    }
    public async thongKeDoanhThu(input: DashboardFilter) {
        const response = await http.post(`api/services/app/Dashboard/ThongKeDoanhThu`, input);
        return response.data.result;
    }
    public async thongKeHotService(input: DashboardFilter) {
        const response = await http.post(`api/services/app/Dashboard/ThongKeHotService`, input);
        return response.data.result;
    }
}
export default new DashboardService();
