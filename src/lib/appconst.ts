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
    }
};
export default AppConsts;
