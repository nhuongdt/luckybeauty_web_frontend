import http from '../httpService';
import { BookingDto } from './dto/BookingDto';
import { CreateOrEditBookingDto } from './dto/CreateOrEditBookingDto';
class BookingServices {
    public async getAllBooking(): Promise<BookingDto[]> {
        const result = await http.get('api/services/app/Booking/GetAll');
        return result.data.result;
    }
    public async CreateBooking(input: CreateOrEditBookingDto) {
        const result = await http.post('api/services/app/Booking/CreateBooking', input);
        return result.data.success;
    }
}
export default new BookingServices();
