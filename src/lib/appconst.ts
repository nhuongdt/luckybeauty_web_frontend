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
    array: {
        pageOption: [
            { value: 5, text: '5/ trang' },
            { value: 10, text: '10/ trang' },
            { value: 20, text: '20/ trang' }
        ]
    },
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
    }
};
export default AppConsts;
