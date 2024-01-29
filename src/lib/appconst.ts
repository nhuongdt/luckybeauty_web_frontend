const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phoneRegex = /(84[1-9]|0[1-9])+([0-9]{8})\b/g;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
const yyyyMMddHHmmRegex = /^\d{4}-[0-1][0-2]-[0-3]\d\s([0-1][0-9]|2[0-3]):[0-5]\d$/;
import TrangThaiBooking from '../enum/TrangThaiBooking';
import { IList } from '../services/dto/IList';

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
    DRAFT: 1,
    SUCCESS: 100,
    NOT_BALANCE: 103,
    BRANDNAME_NOTEXIST: 104,
    MESSAGE_NOT_VALID: 118,
    ERROR_UNDEFINED: 99
};

export const TypeAction = {
    INSEART: 1,
    UPDATE: 2,
    DELETE: 3
};

export const TimeType = {
    SECOND: 1,
    MINUTES: 2,
    HOUR: 3,
    DAY: 4,
    MONTH: 5
};

export const LoaiHoaHongDichVu = {
    THUC_HIEN: 1,
    YEU_CAU_THUC_HIEN: 2,
    TU_VAN: 3
};
export const LoaiHoaHongHoaDon = {
    THUC_THU: 1,
    DOANH_THU: 2,
    VND: 3
};
export const TrangThaiCheckin = {
    DELETED: 0,
    WAITING: 1,
    DOING: 2,
    COMPLETED: 3,
    CANCEL: 4
};
export const SMS_HinhThucGuiTin = {
    SMS: 1,
    ZALO: 2,
    EMAIL: 3
};
export const TrangThaiActive = {
    ACTIVE: 1,
    NOT_ACTIVE: 0
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
        { value: 20, text: '20/ trang' },
        { value: 50, text: '50/ trang' },
        { value: 100, text: '100/ trang' }
    ],

    TimeType: {
        HOUR: 'HOUR',
        MINUTES: 'MINUTES',
        SECOND: 'SECOND'
    },
    ListTimeType: [
        { value: TimeType.SECOND, text: 'Giây' },
        { value: TimeType.MINUTES, text: 'Phút' },
        { value: TimeType.HOUR, text: 'Giờ' },
        { value: TimeType.DAY, text: 'Ngày' },
        { value: TimeType.MONTH, text: 'Tháng' }
    ] as ISelect[],
    DanhSachBienSMS: [
        { value: '{TenKhachHang}', text: 'Tên khách hàng' },
        { value: '{BookingDate}', text: 'Ngày hẹn' },
        { value: '{ThoiGianHen}', text: 'Thời gian hẹn' },
        { value: '{MaHoaDon}', text: 'Mã giao dịch' },
        { value: '{NgayLapHoaDon}', text: 'Ngày giao dịch' },
        { value: '{TenHangHoa}', text: 'Dịch vụ hẹn' },
        { value: '{TenCuaHang}', text: 'Tên cửa hàng' },
        { value: '{SDTCuaHang}', text: 'Số điện thoại của hàng' }
    ] as ISelect[],

    smsLoaiTin: [
        { value: LoaiTin.TIN_THUONG, text: 'Tin thường' },
        { value: LoaiTin.TIN_SINH_NHAT, text: 'Tin sinh nhật' },
        { value: LoaiTin.TIN_LICH_HEN, text: 'Tin lịch hẹn' },
        { value: LoaiTin.TIN_GIAO_DICH, text: 'Tin giao dịch' }
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
    trangThaiBooking: [
        { value: TrangThaiBooking.Wait, name: 'Đặt lịch' },
        { value: TrangThaiBooking.Confirm, name: 'Đã xác nhận' },
        { value: TrangThaiBooking.CheckIn, name: 'Check in' },
        { value: TrangThaiBooking.Success, name: 'Hoàn thành' },
        { value: TrangThaiBooking.Cancel, name: 'Hủy lịch hẹn' }
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
    loaiTinNhan: [
        {
            name: 'Tin thường',
            value: 1
        },
        {
            name: 'Sinh nhật',
            value: 2
        },
        {
            name: 'Lịch hẹn',
            value: 3
        },
        {
            name: 'Đánh giá',
            value: 4
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
