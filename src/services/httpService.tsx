/* eslint-disable @typescript-eslint/no-var-requires */
// import AppConsts from './../lib/appconst'
// import { L } from '../lib/abpUtility'
import { Modal } from 'antd';
import axios from 'axios';
import { error } from 'console';
import Cookies from 'js-cookie';
const qs = require('qs');

//declare let abp: any

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
            Modal.error({
                title: error.response.data.error.message,
                content: error.response.data.error.details
            });
        } else if (
            !!error.response &&
            !!error.response.data.error &&
            !!error.response.data.error.message
        ) {
            Modal.error({
                title: 'LoginFailed',
                content: error.response.data.error.message
            });
        } else if (!error.response) {
            Modal.error({ content: 'UnknownError' });
        }

        setTimeout(() => 1000);

        return Promise.reject(error);
    }
);

export default http;
