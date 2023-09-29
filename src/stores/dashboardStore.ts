import { makeAutoObservable } from 'mobx';
import { DanhSachDichVuHot } from '../services/dashboard/dto/danhSachDichVuHot';
import { DanhSachLichHen } from '../services/dashboard/dto/danhSachLichHen';
import { DashboardFilter } from '../services/dashboard/dto/dashboardFilter';
import { ThongKeDoanhThu } from '../services/dashboard/dto/thongKeDoanhThu';
import { ThongKeLichHen } from '../services/dashboard/dto/thongKeLichHen';
import { ThongKeSoLuong } from '../services/dashboard/dto/thongKeSoLuong';
import Cookies from 'js-cookie';
import AppConsts from '../lib/appconst';
import dashboardService from '../services/dashboard/dashboardService';
import { format as format_date } from 'date-fns';

class DashboardStore {
    filter!: DashboardFilter;
    danhSachLichHen!: DanhSachLichHen[];
    thongKeLichHen!: ThongKeLichHen[];
    thongKeDoanhThu!: ThongKeDoanhThu[];
    danhSachDichVuHot!: DanhSachDichVuHot[];
    thongKeSoLuong!: ThongKeSoLuong;
    dashboardDateType!: string;
    constructor() {
        makeAutoObservable(this);
        this.filter = {
            idChiNhanh: Cookies.get('IdChiNhanh') ?? AppConsts.guidEmpty,
            thoiGianDen: new Date().toLocaleDateString(),
            thoiGianTu: new Date().toLocaleDateString()
        };
    }
    async getData(input: DashboardFilter) {
        input.idChiNhanh = Cookies.get('IdChiNhanh') ?? AppConsts.guidEmpty;
        this.getThongKeSoLuong(input);
        this.getDanhSachLichHen(input);
        this.getThongKeDoanhThu(input);
        this.getThongKeHotService(input);
        this.getThongKeLichHen(input);
    }
    async getThongKeSoLuong(input: DashboardFilter) {
        const result = await dashboardService.thongKeSoLuong(input);
        this.thongKeSoLuong = result;
    }
    async getDanhSachLichHen(input: DashboardFilter) {
        const result = await dashboardService.danhSachLichHen(input);
        this.danhSachLichHen = result;
    }
    async getThongKeLichHen(input: DashboardFilter) {
        const result = await dashboardService.thongKeLichHen(input);
        this.thongKeLichHen = result;
    }
    async getThongKeDoanhThu(input: DashboardFilter) {
        const result = await dashboardService.thongKeDoanhThu(input);
        this.thongKeDoanhThu = result;
    }
    async getThongKeHotService(input: DashboardFilter) {
        const result = await dashboardService.thongKeHotService(input);
        this.danhSachDichVuHot = result;
    }
    async onChangeDateType(type: string) {
        this.dashboardDateType = type;

        const today = new Date();
        const firstDayOfWeek = new Date(today);
        const dayOfWeek = today.getDay(); // 0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Điều chỉnh ngày nếu là chủ nhật
        firstDayOfWeek.setDate(today.getDate() - diff); // Lấy ngày đầu tuần

        const endDayOfWeek = new Date(firstDayOfWeek);
        endDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Lấy ngày cuối tuần

        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Lấy ngày cuối tháng

        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const endDayOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999); // Lấy ngày cuối năm

        if (type === 'day') {
            this.filter.thoiGianTu = format_date(today, 'yyyy/MM/dd').toString();
            this.filter.thoiGianDen = format_date(today, 'yyyy/MM/dd').toString();
        } else if (type === 'week') {
            this.filter.thoiGianTu = format_date(firstDayOfWeek, 'yyyy/MM/dd').toString();
            this.filter.thoiGianDen = format_date(endDayOfWeek, 'yyyy/MM/dd').toString();
        } else if (type === 'month') {
            this.filter.thoiGianTu = format_date(firstDayOfMonth, 'yyyy/MM/dd').toString();
            this.filter.thoiGianDen = format_date(endDayOfMonth, 'yyyy/MM/dd').toString();
        } else if (type === 'year') {
            this.filter.thoiGianTu = format_date(firstDayOfYear, 'yyyy/MM/dd').toString();
            this.filter.thoiGianDen = format_date(endDayOfYear, 'yyyy/MM/dd').toString();
        } else {
            this.filter.thoiGianTu = format_date(today, 'yyyy/MM/dd').toString();
            this.filter.thoiGianDen = format_date(today, 'yyyy/MM/dd').toString();
        }

        this.getData(this.filter);
    }
}
export default new DashboardStore();
