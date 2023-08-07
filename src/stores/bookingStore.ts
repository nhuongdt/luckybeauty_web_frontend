import { makeAutoObservable } from 'mobx';
import { BookingGetAllItemDto } from '../services/dat-lich/dto/BookingGetAllItemDto';
import datLichService from '../services/dat-lich/datLichService';
import Cookies from 'js-cookie';
import { BookingInfoDto } from '../services/dat-lich/dto/BookingInfoDto';
import AppConsts from '../lib/appconst';

class BookingStore {
    selectedDate: Date = new Date();
    listBooking!: BookingGetAllItemDto[];
    typeView!: string;
    idNhanVien!: string;
    idService!: string;
    idBooking!: string;
    bookingInfoDto!: BookingInfoDto;
    isShowBookingInfo!: boolean;
    isShowConfirmDelete!: boolean;
    constructor() {
        makeAutoObservable(this);
        this.selectedDate = new Date();
        this.isShowBookingInfo = false;
        this.isShowConfirmDelete = false;
        this.bookingInfoDto = {
            id: AppConsts.guidEmpty,
            bookingDate: new Date(),
            startTime: '',
            endTime: '',
            color: 'blue',
            donGia: 0,
            ghiChu: '',
            nhanVienThucHien: '',
            soDienThoai: '',
            tenDichVu: '',
            tenKhachHang: ''
        };
    }
    async onShowBookingInfo() {
        this.isShowBookingInfo = !this.isShowBookingInfo;
    }
    async getData() {
        const result = await datLichService.getAllBooking({
            dateSelected: this.selectedDate,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
            typeView: this.typeView ?? 'week',
            idNhanVien: this.idNhanVien,
            idDichVu: this.idService
        });
        this.listBooking = result;
    }
    async getBookingInfo(id: string) {
        const result = await datLichService.GetInforBooking(id);
        this.bookingInfoDto = result;
    }
    async onChangeTypeView(type: string) {
        this.typeView = type;
        await this.getData();
    }
    async onChangeDate(date: Date) {
        this.selectedDate = date;
        await this.getData();
    }
    async onChangeEmployee(idNhanVien: string) {
        this.idNhanVien = idNhanVien;
        await this.getData();
    }
    async onChangeService(idService: string) {
        this.idService = idService;
        await this.getData();
    }
}
export default new BookingStore();
