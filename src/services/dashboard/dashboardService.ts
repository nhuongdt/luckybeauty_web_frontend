import { ICharDataDto } from '../dto/ICharDataDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import { RequestFromToDto } from '../dto/ParamSearchDto';
import http from '../httpService';
import { DanhSachLichHen } from './dto/danhSachLichHen';

class DashboardService {
    public async thongKeSoLuong(input: RequestFromToDto) {
        const response = await http.post(`api/services/app/Dashboard/ThongKeSoLuong`, input);
        return response.data.result;
    }
    public async danhSachLichHen(input: RequestFromToDto): Promise<PagedResultDto<DanhSachLichHen>> {
        const response = await http.post(`api/services/app/Dashboard/DanhSachLichHen`, input);
        return response.data.result;
    }
    public async thongKeLichHen(input: RequestFromToDto) {
        const response = await http.post(`api/services/app/Dashboard/ThongKeLichHen`, input);
        return response.data.result;
    }
    public async thongKeDoanhThu(input: RequestFromToDto): Promise<ICharDataDto[]> {
        const response = await http.post(`api/services/app/Dashboard/ThongKeDoanhThu`, input);
        return response.data.result;
    }
    public async thongKeHotService(input: RequestFromToDto | null) {
        try {
            const response = await http.post(`api/services/app/Dashboard/ThongKeHotService`, input);
            return response.data.result;
        } catch {
            return null;
        }
    }
}
export default new DashboardService();
