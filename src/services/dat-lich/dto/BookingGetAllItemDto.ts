import { ModelHangHoaDto } from '../../product/dto';

export interface BookingGetAllItemDto {
    id: string;
    sourceId: string;
    startTime: string;
    endTime: string;
    customer: string;
    employee: string;
    services: string;
    dayOfWeek: string;
    color: string;
    bookingDate: Date;
}
export class BookingDetailDto extends ModelHangHoaDto {
    maHangHoa = '';
    tenHangHoa = '';
    giaBan = 0;
}

export class BookingDetail_ofCustomerDto {
    idBooking = '';
    idChiNhanh = '';
    idKhachHang = '';
    avatar = '';
    startTime = '';
    endTime = '';
    bookingDate = '';
    trangThai = 1;

    maKhachHang = '';
    tenKhachHang = '';
    soDienThoai = '';
    txtTrangThaiBook = '';

    tenChiNhanh = '';
    soDienThoaiChiNhanh = '';
    diaChiChiNhanh = '';

    details: BookingDetailDto[] = [];
}
