import http from '../httpService';
import { BookingDto } from './dto/BookingDto';
import { BookingGetAllItemDto } from './dto/BookingGetAllItemDto';
import { CreateBookingDto } from './dto/CreateBookingDto';
import {
    BookingRequestDto,
    PagedBookingResultRequestDto
} from './dto/PagedBookingResultRequestDto';
class BookingServices {
    public async getAllBooking(
        input: PagedBookingResultRequestDto
    ): Promise<BookingGetAllItemDto[]> {
        const result = await http.get('api/services/app/Booking/GetAll', { params: input });
        return result.data.result;
    }
    public async CreateBooking(input: CreateBookingDto) {
        const result = await http.post('api/services/app/Booking/CreateBooking', input);
        return result.data.success;
    }
    public async GetList_Booking_byCustomer(input: BookingRequestDto) {
        const xx = await http.get(
            `api/services/app/Booking/GetList_Booking_byCustomer?input=${input}`
        );
        return xx.data.result;
    }
}
export default new BookingServices();
