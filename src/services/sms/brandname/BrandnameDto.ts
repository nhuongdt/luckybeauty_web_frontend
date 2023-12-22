import { PagedResultDto } from '../../dto/pagedResultDto';

export class BrandnameDto {
    id = '';
    tenantId = '';
    brandname = '';
    sdtCuaHang = '';
    ngayKichHoat = new Date();
    trangThai = 0;
    tongTienNap = 0;
    daSuDung = 0;
    conLai = 0;

    txtTrangThai = '';
    tenantName = '';
    displayTenantName = '';
}

export class PagedResultBrandnameDto implements PagedResultDto<BrandnameDto> {
    totalCount: number;
    totalPage: number;
    items: BrandnameDto[];

    constructor({ totalCount = 0, totalPage = 0, items = [] }) {
        this.totalCount = totalCount;
        this.totalPage = totalPage;
        this.items = items;
    }
}
