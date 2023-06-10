import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import qs from 'qs';
const http = axios.create({
    baseURL: process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
    timeout: 30000,
    paramsSerializer: function (params) {
        return qs.stringify(params, {
            encode: false
        });
    }
});

http.interceptors.request.use(
    (config) => {
        if (Cookies.get('accessToken') !== null || Cookies.get('accessToken') !== undefined) {
            config.headers.Authorization = 'Bearer ' + Cookies.get('accessToken');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (
            !!error.response &&
            !!error.response.data.error &&
            !!error.response.data.error.message &&
            error.response.data.error.details
        ) {
            // Hiển thị thông báo lỗi sử dụng toastify
            toast.error(
                `${error.response.data.error.message}: ${error.response.data.error.details}`,
                {
                    position: 'top-center',
                    autoClose: false,
                    theme: 'colored',
                    progress: 1
                }
            );
        } else if (
            !!error.response &&
            !!error.response.data.error &&
            !!error.response.data.error.message
        ) {
            // Hiển thị thông báo lỗi sử dụng toastify
            toast.error('Đăng nhập thất bại: Người dùng chưa đăng nhập vào ứng dụng', {
                position: 'top-center',
                autoClose: false,
                theme: 'colored',
                progress: 1
            });
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        } else if (!error.response) {
            // Hiển thị thông báo lỗi sử dụng toastify
            toast.error('UnknownError', {
                position: 'top-center',
                autoClose: false,
                theme: 'colored',
                progress: 1
            });
        }
        return Promise.reject(error);
    }
);

export default http;
