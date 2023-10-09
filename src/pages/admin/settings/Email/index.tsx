import { Button, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { useEffect, useState } from 'react';
import { EmailSettingsEditDto } from '../../../../services/settings/dto/EmailSettingsEditDto';
import SettingService from '../../../../services/settings/settingService';

const EmailSetting = () => {
    const [settingEmail, setSettingEmail] = useState<EmailSettingsEditDto>({
        defaultFromAddress: '',
        defaultFromDisplayName: '',
        smtpDomain: '',
        smtpEnableSsl: false,
        smtpHost: '',
        smtpPassword: '',
        smtpPort: 0,
        smtpUseDefaultCredentials: false,
        smtpUserName: ''
    });
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        const data = await SettingService.getEmailSettings();
        setSettingEmail(data);
    };

    return (
        <Box paddingTop={2}>
            <Formik
                enableReinitialize={true}
                initialValues={settingEmail}
                onSubmit={(values) => {
                    throw new Error('Function not implemented.');
                }}>
                {({ values, errors, touched, handleChange }) => (
                    <Form>
                        <Box
                            sx={{ borderBottom: '1px soild black' }}
                            paddingBottom={'16px 0px'}
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}>
                            <Typography variant="h1" fontSize="16px" fontWeight="700" color="#333233">
                                Email (SMTP)
                            </Typography>
                            <Button variant="contained">Lưu</Button>
                        </Box>
                        <Box marginTop={'24px'} gap={4}>
                            <Typography marginTop={2}>Địa chỉ email người gửi mặc định</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name={'defaultFromAddress'}
                                value={values.defaultFromAddress}
                                onChange={handleChange}></TextField>
                            <Typography marginTop={2}>Tên hiển thị người gửi mặc định</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name={'defaultFromDisplayName'}
                                value={values.defaultFromDisplayName}
                                onChange={handleChange}></TextField>
                            <Typography marginTop={2}>Địa chỉ máy chủ SMTP</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name={'smtpDomain'}
                                value={values.smtpDomain}
                                onChange={handleChange}
                            />
                            <Typography marginTop={2}>Cổng SMTP</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name={'smtpPort'}
                                value={values.smtpPort}
                                onChange={handleChange}></TextField>
                            <Typography marginTop={2}>Mật khẩu</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name={'smtpPassword'}
                                value={values.smtpPassword}></TextField>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};
export default EmailSetting;
