export class ParamSearchDto {
    textSearch?: string;
    currentPage = 1;
    pageSize = 10;
    columnSort?: string;
    typeSort?: string;
}
