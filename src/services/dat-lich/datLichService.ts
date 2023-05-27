import http from '../httpService';
import { BookingDto } from './dto/BookingDto';
import { CreateOrEditBookingDto } from './dto/CreateOrEditBookingDto';
import { PagedBookingResultRequestDto } from './dto/PagedBookingResultRequestDto';
class BookingServices {
    public async getAllBooking(input: PagedBookingResultRequestDto): Promise<BookingDto[]> {
        const result = await http.get('api/services/app/Booking/GetAll', { params: input });
        return result.data.result;
    }
    public async CreateBooking(input: CreateOrEditBookingDto) {
        const result = await http.post('api/services/app/Booking/CreateBooking', input);
        return result.data.success;
    }
}
export default new BookingServices();
