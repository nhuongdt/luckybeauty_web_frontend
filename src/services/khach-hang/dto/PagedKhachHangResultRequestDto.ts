import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedKhachHangResultRequestDto extends PagedFilterAndSortedRequest {
    keyword: string;
    loaiDoiTuong?: number;
    idChiNhanh?: string;
    idNhomKhach?: string;
    sortBy: string;
    sortType: string;
}
