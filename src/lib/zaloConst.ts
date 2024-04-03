import { ISelect } from './appconst';

const ZaloTemplateType = {
    PROMOTION: 'promotion',
    TRANSACTION: 'transaction_transaction',
    BOOKING: 'transaction_booking',
    PARTNERSHIP: 'transaction_partnership',
    MEDIA: 'media',
    FILE: 'file',
    MESSAAGE: 'message',
    REQUEST_USER_INFOR: 'request_user_info'
};
const ZaloElementType = {
    BANNER: 'banner',
    HEADER: 'header',
    TEXT: 'text',
    TABLE: 'table',
    BUTTON: 'button'
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
    ListTemplateType: [
        { value: ZaloTemplateType.BOOKING, text: 'Lịch hẹn' },
        { value: ZaloTemplateType.PARTNERSHIP, text: 'Sinh nhật' },
        { value: ZaloTemplateType.TRANSACTION, text: 'Giao dịch' },
        { value: ZaloTemplateType.PROMOTION, text: 'Khuyến mãi' },
        { value: ZaloTemplateType.MEDIA, text: 'Tin thường (kèm ảnh)' },
        { value: ZaloTemplateType.MESSAAGE, text: 'Tin thường (dạng văn bản)' },
        { value: ZaloTemplateType.REQUEST_USER_INFOR, text: 'Mời quan tâm cửa hàng' }
    ] as ISelect[],
    ListElementType: [
        { value: ZaloElementType.BANNER, text: 'Logo, hình ảnh' },
        { value: ZaloElementType.HEADER, text: 'Tiêu đề' },
        { value: ZaloElementType.TEXT, text: 'Văn bản' },
        { value: ZaloElementType.TABLE, text: 'Bảng' },
        { value: ZaloElementType.BUTTON, text: 'Nút thao tác' }
    ] as ISelect[],
    ListButtonType: [
        { value: ZaloButtonType.PHONE, text: 'Số điện thoại' },
        { value: ZaloButtonType.URL, text: 'Đường dẫn liên kết' },
        { value: ZaloButtonType.SHOW, text: 'Xem' }
    ] as ISelect[]
};
