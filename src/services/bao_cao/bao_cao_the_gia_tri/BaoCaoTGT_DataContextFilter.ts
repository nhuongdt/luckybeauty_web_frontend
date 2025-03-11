import { createContext } from 'react';
import { format, startOfMonth, lastDayOfMonth } from 'date-fns';
import { ParamSearchBaoCaoTGT } from './ParamSearchBaoCaoTGT';

export interface IBaoCaoTGT_DataContextFilter {
    loaiBaoCao: number;
    countClick: number;
    filter: ParamSearchBaoCaoTGT;
}

export const BaoCaoTGT_DataContextFilter = createContext<IBaoCaoTGT_DataContextFilter>({
    loaiBaoCao: 2,
    countClick: 0,
    filter: {
        textSearch: '',
        currentPage: 0,
        pageSize: 10,
        fromDate: format(new Date('2000-01-01'), 'yyyy-MM-dd') as unknown as undefined,
        toDate: format(new Date(), 'yyyy-MM-dd') as unknown as undefined
    } as ParamSearchBaoCaoTGT
});
