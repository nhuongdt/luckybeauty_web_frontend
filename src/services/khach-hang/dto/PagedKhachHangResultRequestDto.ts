import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedKhachHangResultRequestDto extends PagedFilterAndSortedRequest {
    keyword: string;
    loaiDoiTuong?: number;
}
