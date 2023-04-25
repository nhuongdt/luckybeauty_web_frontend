import { AnyObject } from 'antd/es/table/Table';

const rules = {
    tenancyName: [{ required: true, message: 'This FieldIs Required' }],
    name: [{ required: false, message: 'This Field Is Required' }],
    adminEmailAddress: [
        { required: true, message: 'This Field Is Required' },
        {
            type: 'email',
            message: 'The input is not valid E-mail!'
        }
    ],
    password: [{ required: true, message: 'This Field Is Required' }],
    confirmPassword: [
        { required: true, message: 'This Field Is Required' }
        // ({ getFieldValue }:AnyObject) => ({
        //   validator(_: any, value: any) {
        //     if (!value || getFieldValue('password') === value) {
        //       return Promise.resolve();
        //     }
        //     return Promise.reject(new Error('Passwords do not match'));
        //   },
        // }),
    ]
};

export default rules;
