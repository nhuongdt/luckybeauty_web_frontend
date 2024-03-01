import { createContext } from 'react';
import { ParamSearchBaoCaoTaiChinh } from '../bao_cao_tai_chinh/BaoCaoTaiChinhDto';

export interface IBaoCaoDatataFilterContext<T> {
    loaiBaoCao: string;
    countClick: number;
    filter: T;
}

export const BaoCaoTaiChinhDatataFilterContext = createContext<IBaoCaoDatataFilterContext<ParamSearchBaoCaoTaiChinh>>({
    countClick: 0,
    loaiBaoCao: '1',
    filter: {} as ParamSearchBaoCaoTaiChinh
});
