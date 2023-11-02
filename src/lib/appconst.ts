const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phoneRegex = /(84[1-9]|0[1-9])+([0-9]{8})\b/g;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
const yyyyMMddHHmmRegex = /^\d{4}-[0-1][0-2]-[0-3]\d\s([0-1][0-9]|2[0-3]):[0-5]\d$/;

import { IList } from '../services/dto/IList';
import { L } from './abpUtility';

export interface ISelect {
    value: number | string;
    text: string;
}

export const DateType = {
    HOM_NAY: 'HOM_NAY',
    HOM_QUA: 'HOM_QUA',
    NGAY_MAI: 'NGAY_MAI',
    TUAN_NAY: 'TUAN_NAY',
    TUAN_TRUOC: 'TUAN_TRUOC',
    TUAN_TOI: 'TUAN_TOI',
    THANG_NAY: 'THANG_NAY',
    THANG_TRUOC: 'THANG_TRUOC',
    THANG_TOI: 'THANG_TOI',
    QUY_NAY: 'QUY_NAY',
    QUY_TRUOC: 'QUY_TRUOC',
    NAM_NAY: 'NAM_NAY',
    NAM_TRUOC: 'NAM_TRUOC',
    TUY_CHON: 'TUY_CHON',
    TAT_CA: 'TAT_CA'
};
export const LoaiTin = {
    TIN_THUONG: 1,
    TIN_SINH_NHAT: 2,
    TIN_LICH_HEN: 3,
    TIN_GIAO_DICH: 4
};
export const TrangThaiSMS = {
    SUCCESS: 100,
    NOT_BALANCE: 103,
    BRANDNAME_NOTEXIST: 104,
    MESSAGE_NOT_VALID: 118,
    ERROR_UNDEFINED: 99
};

const AppConsts = {
    userManagement: {
        defaultAdminUserName: 'admin'
    },
    localization: {
        defaultLocalizationSourceName: 'BanHangBeautify'
    },
    authorization: {
        encrptedAuthTokenName: 'enc_auth_token'
    },
    appBaseUrl: process.env.REACT_APP_APP_BASE_URL,
    remoteServiceBaseUrl: process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
    guidEmpty: '00000000-0000-0000-0000-000000000000',
    pageOption: [
        { value: 10, text: '10/ trang' },
        { value: 20, text: '20/ trang' }
    ],
    smsLoaiTin: [
        { value: LoaiTin.TIN_THUONG, text: 'Tin nhắn thường' },
        { value: LoaiTin.TIN_SINH_NHAT, text: 'Tin nhắn sinh nhật' },
        { value: LoaiTin.TIN_LICH_HEN, text: 'Tin nhắn lịch hẹn' },
        { value: LoaiTin.TIN_GIAO_DICH, text: 'Tin nhắn giao dịch' }
    ] as ISelect[],
    ListTrangThaiGuiTin: [
        { value: TrangThaiSMS.SUCCESS, text: 'Thành công' },
        { value: TrangThaiSMS.NOT_BALANCE, text: 'Không đủ số dư' },
        { value: TrangThaiSMS.BRANDNAME_NOTEXIST, text: 'Brandname không tồn tại' },
        { value: TrangThaiSMS.MESSAGE_NOT_VALID, text: 'Tin nhắn không hợp lệ' },
        { value: TrangThaiSMS.ERROR_UNDEFINED, text: 'Lỗi không xác định' }
    ] as ISelect[],

    ListDateType: [
        { id: DateType.HOM_NAY, text: 'Hôm nay' },
        { id: DateType.HOM_QUA, text: 'Hôm qua' },
        { id: DateType.NGAY_MAI, text: 'Ngày mai' },
        { id: DateType.TUAN_NAY, text: 'Tuần này' },
        { id: DateType.TUAN_TRUOC, text: 'Tuần trước' },
        { id: DateType.TUAN_TOI, text: 'Tuần tới' },
        { id: DateType.THANG_NAY, text: 'Tháng này' },
        { id: DateType.THANG_TRUOC, text: 'Tháng trước' },
        { id: DateType.THANG_TOI, text: 'Tháng tới' },
        { id: DateType.QUY_NAY, text: 'Quý này' },
        { id: DateType.QUY_TRUOC, text: 'Quý trước' },
        { id: DateType.NAM_NAY, text: 'Năm này' },
        { id: DateType.NAM_TRUOC, text: 'Năm trước' },
        { id: DateType.TAT_CA, text: 'Toàn thời gian' },
        { id: DateType.TUY_CHON, text: 'Tùy chỉnh' }
    ] as IList[],
    trangThaiCheckIn: [
        { value: 1, name: 'Đặt lịch' },
        { value: 2, name: 'Đã gọi (nhắn tin) cho khách' },
        { value: 3, name: 'Check in' },
        { value: 4, name: 'Hoàn thành' },
        { value: 0, name: 'Xóa' }
    ],
    hinhThucThanhToan: [
        { value: 1, text: 'Tiền mặt' },
        { value: 2, text: 'Chuyển khoản' },
        { value: 3, text: 'Quẹt thẻ' }
    ] as ISelect[],
    hinhThucKhuyenMaiHoaDon: [
        {
            value: 11,
            name: 'Giảm giá hóa đơn'
        },
        {
            value: 12,
            name: 'Tặng hàng'
        },
        {
            value: 13,
            name: 'Giảm giá hàng'
        },
        {
            value: 14,
            name: 'Tặng Điểm'
        }
    ],
    hinhThucKhuyenMaiHangHoa: [
        {
            value: 21,
            name: 'Mua hàng giảm giá hàng'
        },
        {
            value: 22,
            name: 'Mua hàng tặng hàng'
        },
        {
            value: 23,
            name: 'Mua hàng giảm giá theo số lượng mua'
        },
        {
            value: 24,
            name: 'Mua hàng tặng điểm'
        }
    ],
    loaiBooking: {
        online: 0,
        offline: 1,
        cuaHangBook: 2
    },
    loaiKhuyenMai: {
        hangHoa: 2,
        hoaDon: 1
    },
    listColumnCustomer: {
        actions: true,
        cuocHenGanNhat: true,
        gioiTinh: true,
        nhanVienPhuTrach: true,
        soDienThoai: true,
        tenKhachHang: true,
        tenNguonKhach: true,
        tenNhomKhach: true,
        tongChiTieu: true
    },
    emailRegex: emailRegex,
    phoneRegex: phoneRegex,
    passwordRegex: passwordRegex,
    yyyyMMddHHmmRegex: yyyyMMddHHmmRegex,
    dayOfWeek: {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
    },
    lstMauInMacDinh: [
        {
            value: 1,
            text: 'Mẫu K80'
        },
        {
            value: 2,
            text: 'Mẫu A4'
        }
    ] as ISelect[]
};

export default AppConsts;
