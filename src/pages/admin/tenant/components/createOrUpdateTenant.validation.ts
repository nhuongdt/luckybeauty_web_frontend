import * as Yup from 'yup';

const rules = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập tên'),
    tenancyName: Yup.string().required('Vui lòng nhập tên tenancy'),
    adminEmailAddress: Yup.string().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
    //connectionString: Yup.string().required('Vui lòng nhập chuỗi kết nối'),
    isActive: Yup.boolean().required(),
    isDefaultPassword: Yup.boolean().required(),
    password: Yup.string().when(['isDefaultPassword'], {
        is: false,
        then: (schema) =>
            schema
                .matches(
                    /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
                    'Mật khẩu phải chứa ít nhất một chữ cái, một số và ít nhất 8 ký tự'
                )
                .required('Mật khẩu là bắt buộc'),
        otherwise: (schema) => schema.notRequired()
    })
});

export default rules;
