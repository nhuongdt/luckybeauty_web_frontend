import { makeAutoObservable } from 'mobx';
import { BookingGetAllItemDto } from '../services/dat-lich/dto/BookingGetAllItemDto';
import datLichService from '../services/dat-lich/datLichService';
import Cookies from 'js-cookie';
import { BookingInfoDto } from '../services/dat-lich/dto/BookingInfoDto';
import AppConsts from '../lib/appconst';
import { CreateBookingDto } from '../services/dat-lich/dto/CreateBookingDto';
import { FullCalendarEvent } from '../services/dat-lich/dto/FullCalendarEvent';
import { format as formatDate, parse } from 'date-fns';
class BookingStore {
    selectedDate: string = new Date().toString();
    listBooking!: BookingGetAllItemDto[];
    fullCalendarEvents!: FullCalendarEvent[];
    typeView!: string;
    idNhanVien!: string;
    idService!: string;
    idBooking!: string;
    bookingInfoDto!: BookingInfoDto;
    createOrEditBookingDto!: CreateBookingDto;
    isShowCreateOrEdit!: boolean;
    isShowBookingInfo!: boolean;
    isShowConfirmDelete!: boolean;
    constructor() {
        makeAutoObservable(this);
        this.selectedDate = new Date().toString();
        this.isShowBookingInfo = false;
        this.isShowConfirmDelete = false;
        this.isShowCreateOrEdit = false;
        this.createNewBookingDto();
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
            tenKhachHang: '',
            avatarKhachHang: '',
            trangThai: 1
        };
    }
    async createNewBookingDto() {
        this.createOrEditBookingDto = {
            id: AppConsts.guidEmpty,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
            idDonViQuiDoi: '',
            idKhachHang: '',
            idNhanVien: '',
            startHours: '',
            startTime: '',
            ghiChu: '',
            trangThai: 1
        };
    }
    async getForEditBooking(id: string) {
        const result = await datLichService.GetForEdit(id);
        this.createOrEditBookingDto = result;
    }
    async onCreateOrEditBooking(input: CreateBookingDto) {
        const result = await datLichService.CreateOrEditBooking(input);
        this.isShowCreateOrEdit = false;
        await this.createNewBookingDto();
        return result;
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
        this.fullCalendarEvents = result.map((item) => {
            const [hoursStart, minutesStart] = item.startTime.split(':').map(Number);
            const [hoursEnd, minutesEnd] = item.endTime.split(':').map(Number);
            const bookingDateTime = new Date(item.bookingDate);
            const startTime = bookingDateTime.setHours(hoursStart, minutesStart);
            const endTime = bookingDateTime.setHours(hoursEnd, minutesEnd);
            const event: FullCalendarEvent = {
                id: item.id,
                title: item.services,
                start: new Date(startTime),
                end: new Date(endTime),
                backgroundColor: item.color + '1a',
                textColor: item.color,
                borderColor: item.color + '1a',
                display: item.customer,
                resourceId: item.sourceId,
                startStr: new Date(startTime).toISOString(),
                endStr: new Date(endTime).toISOString()
            };

            return event;
        });
    }
    async getBookingInfo(id: string) {
        const result = await datLichService.GetInforBooking(id);
        this.bookingInfoDto = result;
    }
    async onChangeTypeView(type: string) {
        this.typeView = type;
        await this.getData();
    }
    async onChangeDate(date: string) {
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
