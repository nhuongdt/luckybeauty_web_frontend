import { RequestFromToDto } from '../../dto/ParamSearchDto';

export class ParamSearchBaoCaoGDV extends RequestFromToDto {
    textSearchDV?: string | null;
    gdv_fromDate?: string | null;
    gdv_toDate?: string | null;

    constructor({
        idChiNhanhs = [''],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        fromDate = null,
        toDate = null,
        textSearchDV = '',
        gdv_fromDate = '',
        gdv_toDate = ''
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
        this.textSearchDV = textSearchDV;
        this.gdv_fromDate = gdv_fromDate;
        this.gdv_toDate = gdv_toDate;
    }
}
