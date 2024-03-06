import { RequestFromToDto } from '../../dto/ParamSearchDto';

export class ParamSearchSoQuyDto extends RequestFromToDto {
    hinhThucThanhToans?: number[];
    idTaiKhoanNganHang?: string | null;
    idKhoanThuChi?: string | null;

    constructor({
        idChiNhanhs = [],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        fromDate = null,
        toDate = null,
        hinhThucThanhToans = []
    }) {
        super({
            idChiNhanhs: idChiNhanhs,
            textSearch: textSearch,
            currentPage: currentPage,
            pageSize: pageSize,
            columnSort: columnSort,
            typeSort: typeSort,
            fromDate: fromDate,
            toDate: toDate
        });
        this.hinhThucThanhToans = hinhThucThanhToans;
    }
}
