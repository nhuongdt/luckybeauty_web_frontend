import { ISelect } from './appconst';

const ZaloTemplateType = {
    PROMOTION: 'promotion',
    TRANSACTION: 'transaction_transaction',
    BOOKING: 'transaction_booking'
};
const ZaloElementType = {
    BANNER: 'banner',
    HEADER: 'header',
    TEXT: 'text',
    TABLE: 'table'
};
const ZaloButtonType = {
    PHONE: 'oa.open.phone',
    URL: 'oa.open.url',
    SHOW: 'oa.open.show'
};

export const ZaloConst = {
    ElementType: ZaloElementType,
    ButtonType: ZaloButtonType,
    TemplateType: ZaloTemplateType,
    ListButtonType: [
        { value: ZaloButtonType.PHONE, text: 'Số điện thoại' },
        { value: ZaloButtonType.URL, text: 'Đường dẫn liên kết' },
        { value: ZaloButtonType.SHOW, text: 'Xem' }
    ] as ISelect[]
};
