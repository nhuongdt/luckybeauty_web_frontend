import http from '../httpService';
import { BookingDto } from './dto/BookingDto';
import { BookingDetail_ofCustomerDto, BookingGetAllItemDto } from './dto/BookingGetAllItemDto';
import { CreateBookingDto } from './dto/CreateBookingDto';
import qs from 'qs';
import { BookingRequestDto, PagedBookingResultRequestDto } from './dto/PagedBookingResultRequestDto';
import utils from '../../utils/utils';
import { Guid } from 'guid-typescript';
import { BookingInfoDto } from './dto/BookingInfoDto';
class BookingServices {
    public async getAllBooking(input: PagedBookingResultRequestDto): Promise<BookingGetAllItemDto[]> {
        const result = await http.get('api/services/app/Booking/GetAll', { params: input });
        return result.data.result;
    }
    public async CreateOrEditBooking(input: CreateBookingDto) {
        const result = await http.post('api/services/app/Booking/CreateOrEditBooking', input);
        return result.data.result;
    }
    public async GetKhachHang_Booking(input: BookingRequestDto) {
        const param = qs.stringify(input);
        const xx = await http.get(`api/services/app/Booking/GetKhachHang_Booking?${param}`);
        return xx.data.result;
    }
    public async UpdateTrangThaiBooking(idBooking: string, trangthai: number) {
        const xx = await http.post(
            `api/services/app/Booking/UpdateTrangThaiBooking?idBooking=${idBooking}&trangThai=${trangthai}`
        );
        return xx.data.result;
    }
    public async GetForEdit(id: string) {
        const response = await http.get(`api/services/app/Booking/GetForEdit?id=${id}`);
        return response.data.result;
    }
    GetInforBooking_byID = async (idBooking: string): Promise<BookingDetail_ofCustomerDto[]> => {
        if (utils.checkNull(idBooking) || idBooking == Guid.EMPTY) return [];
        const xx = await http.get(`api/services/app/Booking/GetInforBooking_byID?idBooking=${idBooking}`);
        return xx.data.result;
    };
    GetInforBooking = async (idBooking: string): Promise<BookingInfoDto> => {
        const response = await http.get(`api/services/app/Booking/GetBookingInfo?id=${idBooking}`);
        return response.data.result;
    };
    DeleteBooking = async (idBooking: string) => {
        const result = await http.post(`api/services/app/Booking/DeleteBooking?id=${idBooking}`);
        return result.data.result;
    };
}
export default new BookingServices();
