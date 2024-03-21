import React, { useEffect, useState } from 'react';
import { Grid, Stack, Box, Tab, Tabs, Button, Typography, Link } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ReactComponent as ZaloIcon } from '../../../../images/icons/zalo-icon-nen-trang.svg';
import { ReactComponent as ZaloIconOffical } from '../../../../images/icons/zalo-icon-nen-xanh.svg';
import ZaloService from '../../../../services/sms/gui_tin_nhan/ZaloService';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import { InforZOA, ZaloAuthorizationDto } from '../../../../services/sms/gui_tin_nhan/zalo_dto';
import utils from '../../../../utils/utils';
import { Guid } from 'guid-typescript';
import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';
import { ButtonNavigate } from '../../../../components/Button/ButtonNavigate';
import { useNavigate } from 'react-router-dom';

export default function ThietLapKetNoiZaloGmail({ xx }: any) {
    const [tabActive, setTabActive] = useState('2');
    const [inforZOA, setInforZOA] = useState<InforZOA>({} as InforZOA);
    const [zaloToken, setZaloToken] = useState<ZaloAuthorizationDto>(new ZaloAuthorizationDto({ id: Guid.EMPTY }));
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const navigate = useNavigate(); // Sử dụng hook useNavigate

    const handleClick = () => {
        navigate('');
    };

    useEffect(() => {
        GetTokenfromDB();
    }, []);

    const GetTokenfromDB = async () => {
        const objAuthen = await ZaloService.GetTokenfromDB();
        if (objAuthen !== null) {
            setZaloToken(objAuthen);
            if (utils.checkNull(objAuthen?.accessToken)) {
                await GetAuthenCode(objAuthen.codeVerifier, objAuthen);
            } else {
                const newOA = await ZaloService.GetInfor_ZaloOfficialAccount(objAuthen?.accessToken);
                setInforZOA(newOA);
            }
        }
    };

    const CreateConnectZOA = async () => {
        // const objnew = { ...zaloToken };
        // objnew.codeVerifier = ZaloService.CreateCodeVerifier();
        // objnew.codeChallenge = await ZaloService.GenerateCodeChallenge(objnew.codeVerifier);
        // setZaloToken({ ...zaloToken, codeVerifier: objnew.codeVerifier, codeChallenge: objnew.codeChallenge });
        // await ZaloService.InsertCodeVerifier(objnew);
        await ZaloService.CreateCodeVerifier_andCodeChallenge();

        // const urlPermission = `https://oauth.zaloapp.com/v4/oa/permission?app_id=${process.env.REACT_APP_ZALO_APP_ID}&redirect_uri=${process.env.REACT_APP_APP_BASE_URL}/settings/ket-noi-zalo-gmail`;
        // navigate(urlPermission);
        const iframe = document.createElement('iframe');
        iframe.src = `https://oauth.zaloapp.com/v4/oa/permission?app_id=${process.env.REACT_APP_ZALO_APP_ID}&redirect_uri=${process.env.REACT_APP_APP_WEBSITE_URL}/settings/ket-noi-zalo-gmail`;
        console.log('iframe.src ', iframe.src);
        iframe.id = 'iframe';
        iframe.style.position = 'absolute';
        iframe.style.zIndex = '999';
        iframe.style.height = '100%';
        iframe.style.width = '100%';
        iframe.style.top = '0';
        iframe.style.backgroundColor = 'white';
        iframe.style.border = 'none';
        document.body.prepend(iframe);
        document.body.style.overflow = 'hidden';
    };

    // useEffect(() => {
    //     window.addEventListener('close-iframe', function (event) {
    //         const frameToRemove = document.getElementById('iframe');
    //         if (frameToRemove != null) {
    //             frameToRemove?.parentNode?.removeChild(frameToRemove);
    //             document.body.style.overflow = 'inherit';
    //             console.log('frameToRemove33 ', frameToRemove);
    //         }
    //     });
    // }, []);

    const GetAuthenCode = async (codeVerifier: string, zaloToken: ZaloAuthorizationDto) => {
        // check exist db or create new
        const params = new URLSearchParams(window.location.search);
        if (params.size > 0) {
            const authenCode = params.get('code');
            if (authenCode !== null) {
                if (!utils.checkNull(codeVerifier)) {
                    const dataAccessToken = await ZaloService.GetAccessToken_fromAuthorizationCode(
                        authenCode,
                        codeVerifier
                    );

                    // update authenCode if is first connect
                    const objUpdate = { ...zaloToken };
                    objUpdate.authorizationCode = authenCode;
                    objUpdate.accessToken = dataAccessToken?.access_token;
                    objUpdate.refreshToken = dataAccessToken?.refresh_token;
                    objUpdate.expiresToken = dataAccessToken?.expires_in;
                    if (utils.checkNull(zaloToken.refreshToken)) {
                        setZaloToken({
                            ...zaloToken,
                            authorizationCode: authenCode,
                            accessToken: dataAccessToken?.access_token,
                            refreshToken: dataAccessToken?.refresh_token,
                            expiresToken: dataAccessToken?.expires_in
                        });
                        await ZaloService.UpdateZaloToken(objUpdate);
                    }

                    if (dataAccessToken != null) {
                        const newOA = await ZaloService.GetInfor_ZaloOfficialAccount(dataAccessToken?.access_token);
                        setInforZOA(newOA);
                    }
                }
            }
        } else {
            const newOA = await ZaloService.GetInfor_ZaloOfficialAccount(zaloToken?.accessToken);
            setInforZOA(newOA);
        }
    };

    const onClickXoaKetNoi = async () => {
        setZaloToken({ ...zaloToken, authorizationCode: '', accessToken: '' });
        await ZaloService.XoaKetNoi(zaloToken?.id);
        setObjAlert({ ...objAlert, show: true, mes: 'Bạn vừa ngắt kết nối tới Zalo' });
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
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Grid container>
                <Grid item xs={12}>
                    <TabContext value={tabActive}>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'end'}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange}>
                                    <Tab label="Zalo" value="2" />
                                    <Tab label="Email" value="3" />
                                </TabList>
                            </Box>
                            <Stack>
                                <ButtonNavigate navigateTo="/settings" btnText="Trở về trang cài đặt" />
                            </Stack>
                        </Stack>

                        <TabPanel value="2">
                            {!zaloToken?.accessToken && (
                                <Grid container spacing={3}>
                                    <Grid item xs={5}></Grid>
                                    <Grid item xs={2}>
                                        <Box alignItems={'center'}>
                                            <Button
                                                startIcon={<ZaloIcon style={{ height: '30px' }} />}
                                                variant="contained"
                                                fullWidth
                                                sx={{ height: 50, fontSize: '18px', borderRadius: '20px' }}
                                                onClick={CreateConnectZOA}>
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

                            {zaloToken?.accessToken && (
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                            <ZaloIconOffical style={{ height: '40px' }} />
                                            <Typography
                                                fontSize={'14px'}
                                                fontWeight={500}
                                                color={'#0180c7'}
                                                sx={{
                                                    fontFamily: 'var(--font-family-main) !important'
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
                                            <img src={inforZOA?.avatar} width={50} height={50} />
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
