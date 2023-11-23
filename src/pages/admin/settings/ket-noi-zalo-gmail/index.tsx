import { useEffect, useState } from 'react';
import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Grid, Stack, Box, Tab, Tabs, Button, Typography, Link, Modal, Dialog, DialogContent } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { ReactComponent as ZaloIcon } from '../../../../images/icons/zalo-icon-nen-trang.svg';
import { ReactComponent as ZaloIconOffical } from '../../../../images/icons/zalo-icon-nen-xanh.svg';
import { useNavigate, Route, Navigate } from 'react-router-dom';
import ZaloService from '../../../../services/sms/gui_tin_nhan/ZaloService';
import { useParams } from 'react-router-dom';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import LinkOffOutlinedIcon from '@mui/icons-material/LinkOffOutlined';
import { InforZOA } from '../../../../services/sms/gui_tin_nhan/zalo_dto';
import utils from '../../../../utils/utils';

export default function ThietLapKetNoiZaloGmail({ xx }: any) {
    const [tabActive, setTabActive] = useState('2');
    const [openZaloLogin, setOpenZaloLogin] = useState(false);
    const [url, setUrl] = useState('');
    const [codeVerifier, setCodeVerifier] = useState('');
    const [codeChallenge, setCodeChallenge] = useState('');
    const [authenCode, setAuthenCode] = useState<string>('');
    const [inforZOA, setInforZOA] = useState<InforZOA>({} as InforZOA);

    useEffect(() => {
        GetCodeVerifier();
        GetAuthenCode();
    }, []);

    const GetCodeVerifier = async () => {
        // check exist db or create new
        const code = ZaloService.CreateCodeVerifier();
        setCodeVerifier(code);
        console.log(' setCodeVerifier ', code);

        const code_challenge = await ZaloService.GenerateCodeChallenge(code);
        setCodeChallenge(code_challenge);
    };

    const GetAuthenCode = async () => {
        // check exist db or create new
        const params = new URLSearchParams(window.location.search);
        if (params.size > 0) {
            const authenCode = params.get('code');
            if (authenCode !== null) {
                setAuthenCode(authenCode); // todo save db
                console.log('codeVerifier ', codeVerifier);
                if (!utils.checkNull(codeVerifier)) {
                    const dataAccessToken = await ZaloService.GetAccessToken_fromAuthorizationCode(
                        authenCode,
                        codeVerifier
                    );

                    if (dataAccessToken != null) {
                        const newOA = await ZaloService.GetInfor_ZaloOfficialAccount(dataAccessToken.access_token);
                        setInforZOA(newOA);
                    }
                }
            }
        }
    };

    const onClickXoaKetNoi = () => {
        setAuthenCode('');
    };

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabActive(newValue);
        switch (newValue) {
            case '1':
                {
                    //setListMauInHoaDon(allMauIn);
                }
                break;
            default:
                //setListMauInHoaDon(allMauIn);
                break;
        }
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <TabContext value={tabActive}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Zalo" value="2" />
                                <Tab label="Email" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="2">
                            {!authenCode && (
                                <Grid container spacing={3}>
                                    <Grid item xs={5}></Grid>
                                    <Grid item xs={2}>
                                        <Box alignItems={'center'}>
                                            <Button
                                                startIcon={<ZaloIcon style={{ height: '30px' }} />}
                                                variant="contained"
                                                fullWidth
                                                sx={{ height: 50, fontSize: '18px', borderRadius: '20px' }}
                                                onClick={() => {
                                                    setOpenZaloLogin(true);
                                                    window.open(
                                                        `https://oauth.zaloapp.com/v4/oa/permission?app_id=1575833233908225704&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsettings%2Fket-noi-zalo-gmail&code_challenge=${codeChallenge}`
                                                    );
                                                }}>
                                                Thêm kết nối
                                            </Button>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={5}></Grid>

                                    <Grid item xs={12}>
                                        <Stack spacing={2} alignItems={'center'}>
                                            <Typography variant="body2">
                                                Kết nối với Zalo để thiết lập gửi tin nhắn tự động qua hệ thống Lucky
                                                beauty
                                            </Typography>
                                            {/* <Route path="https://id.zalo.me/account" /> */}
                                            <Typography variant="body2">
                                                Chỉ áp dụng cho tài khoản ZOA được phép tích hợp API.{' '}
                                                <Link
                                                    href="https://developers.zalo.me/docs/official-account/bat-dau/kham-pha"
                                                    underline="hover">
                                                    {'Xem chi tiết'}
                                                </Link>
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            )}

                            {authenCode && (
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                            <ZaloIconOffical style={{ height: '40px' }} />
                                            <Typography
                                                fontSize={'14px'}
                                                fontWeight={500}
                                                color={'#0180c7'}
                                                sx={{
                                                    fontFamily:
                                                        '"Roboto", "Helvetica Neue", "Helvetica", "Arial", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important'
                                                }}>
                                                Official Account
                                            </Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Stack
                                            direction={'row'}
                                            spacing={1}
                                            justifyContent={'end'}
                                            alignItems={'center'}>
                                            <Typography fontSize={'14px'} fontWeight={600}>
                                                {inforZOA?.name}
                                            </Typography>
                                            <Button
                                                startIcon={<LinkOutlinedIcon />}
                                                variant="contained"
                                                onClick={onClickXoaKetNoi}>
                                                Xóa kết nối
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            )}
                        </TabPanel>
                        <TabPanel value="3">Item Three</TabPanel>
                    </TabContext>
                </Grid>
            </Grid>
        </>
    );
}
