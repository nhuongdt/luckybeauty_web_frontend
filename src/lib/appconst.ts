const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phoneRegex = /(84|0[1-9])+([0-9]{8})\b/g;

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
    trangThaiCheckIn: [
        { value: 1, name: 'Đặt lịch' },
        { value: 2, name: 'Đã gọi (nhắn tin) cho khách' },
        { value: 3, name: 'Check in' },
        { value: 4, name: 'Xóa' }
    ],
    loaiBooking: {
        online: 0,
        offline: 1,
        cuaHangBook: 2
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
    phoneRegex: phoneRegex
};

export default AppConsts;
