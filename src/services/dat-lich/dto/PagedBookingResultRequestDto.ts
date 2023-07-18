import { ParamSearchDto } from '../../dto/ParamSearchDto';

export interface PagedBookingResultRequestDto {
    idChiNhanh: string;
    dateSelected: Date;
    typeView: string;
    idNhanVien?: string;
}

export class BookingRequestDto extends ParamSearchDto {
    trangThaiBook = '1,2,3';
}
