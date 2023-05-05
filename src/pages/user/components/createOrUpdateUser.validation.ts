const rules = {
    name: [{ required: true, message: 'ThisFieldIsRequired' }],
    surname: [{ required: true, message: 'ThisFieldIsRequired' }],
    userName: [{ required: true, message: 'ThisFieldIsRequired' }],
    emailAddress: [
        { required: true, message: 'ThisFieldIsRequired' },
        {
            type: 'email',
            message: 'The input is not valid E-mail!'
        }
    ]
};

export default rules;
