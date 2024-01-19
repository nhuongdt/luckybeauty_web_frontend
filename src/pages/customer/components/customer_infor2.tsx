import { Grid, Stack, Box, Avatar, Typography, Button, Tab } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import khachHangStore from '../../../stores/khachHangStore';
import utils from '../../../utils/utils';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Guid } from 'guid-typescript';
import { KhachHangDetail } from '../../../services/khach-hang/dto/KhachHangDetail';
import khachHangService from '../../../services/khach-hang/khachHangService';
import { observer } from 'mobx-react';
import DialogButtonClose from '../../../components/Dialog/ButtonClose';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabCuocHen from './TabCuocHen';
import TabMuaHang from './TabMuaHang';
import { KhachHangItemDto } from '../../../services/khach-hang/dto/KhachHangItemDto';

const CustomerInfor2 = ({ cutomerInfor }: any) => {
    const { khachHangId } = useParams();
    // const [cutomerInfor, setInforCus] = useState<KhachHangDetail>();
    const [tabActive, setTabActive] = useState('1');
    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabActive(newValue);
    };

    useEffect(() => {
        //
    }, [khachHangId]);
    const getKhachHangInfo = async () => {
        // const data = await khachHangService.getDetail(khachHangId as string);
        // setInforCus(data);
        // console.log('data ', data);
    };

    return (
        <>
            <Grid container paddingTop={2} spacing={1}>
                <Grid item xs={12} md={4} lg={3}>
                    <Stack
                        padding={2}
                        spacing={2}
                        className="page-full"
                        sx={{ border: '1px solid #cccc', borderRadius: '4px' }}>
                        <Stack sx={{ position: 'relative' }}>
                            <Stack direction={'row'} spacing={1.5} alignItems={'center'}>
                                {cutomerInfor?.avatar ? (
                                    <Box
                                        sx={{
                                            '& img': {
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                height: '60px',
                                                width: '60px',
                                                objectFit: 'cover',
                                                borderRadius: '6px'
                                            }
                                        }}>
                                        <img src={cutomerInfor?.avatar} alt="avatar" />
                                    </Box>
                                ) : (
                                    <Avatar
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            backgroundColor: 'var(--color-bg)',
                                            color: 'var(--color-main)',
                                            fontSize: '18px'
                                        }}>
                                        {utils.getFirstLetter(cutomerInfor?.tenKhachHang, 3)}
                                    </Avatar>
                                )}
                                <Stack sx={{ position: 'relative' }}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                                        {cutomerInfor?.tenKhachHang}
                                    </Typography>
                                    <Typography variant="caption" color={'#b2b7bb'}>
                                        {cutomerInfor?.maKhachHang}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack sx={{ borderBottom: '1px solid #cccc' }}>
                            <Grid container spacing={1.5} paddingBottom={2}>
                                <Grid item xs={5} lg={4}>
                                    <Typography variant="body2" fontWeight={600}>
                                        Điện thoại
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} lg={8}>
                                    <Typography variant="body2">{cutomerInfor?.soDienThoai}</Typography>
                                </Grid>
                                <Grid item xs={5} lg={4}>
                                    <Typography variant="body2" fontWeight={600}>
                                        Ngày sinh
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} lg={8}>
                                    <Typography variant="body2">{'11/12/2000'}</Typography>
                                </Grid>
                                <Grid item xs={5} lg={4}>
                                    <Typography variant="body2" fontWeight={600}>
                                        Địa chỉ
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} lg={8}>
                                    <Typography variant="body2"> {cutomerInfor?.diaChi}</Typography>
                                </Grid>
                                <Grid item xs={5} lg={4}>
                                    <Typography variant="body2" fontWeight={600}>
                                        Nhóm khách
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} lg={8}>
                                    <Typography variant="body2"> {cutomerInfor?.tenNhomKhach}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={2} direction={'row'} justifyContent={'center'}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            sx={{ borderRadius: '12px', flex: 8 }}>
                                            Thay đổi thông tin
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack sx={{ borderBottom: '1px solid #cccc' }} paddingBottom={2}>
                            <Stack spacing={2}>
                                <Stack>
                                    <Typography variant="body2">Cuộc hẹn gần nhất: 20/12/2023</Typography>
                                </Stack>
                                <Stack justifyContent={'space-between'} direction={'row'}>
                                    <Stack alignItems={'center'}>
                                        <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                                            {cutomerInfor?.soLanBooking}
                                        </Typography>
                                        <Typography variant="caption">Cuộc hẹn</Typography>
                                    </Stack>
                                    <Stack alignItems={'center'}>
                                        <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                                            {utils.formatNumber(cutomerInfor?.tongChiTieu ?? 0)}
                                        </Typography>
                                        <Typography variant="caption">Chi tiêu</Typography>
                                    </Stack>
                                    <Stack alignItems={'center'}>
                                        <Typography
                                            sx={{
                                                fontSize: '18px',
                                                fontWeight: 600,
                                                color: (cutomerInfor?.conNo ?? 0) > 0 ? 'red' : 'var(--font-color-main)'
                                            }}>
                                            {utils.formatNumber(cutomerInfor?.conNo ?? 0)}
                                        </Typography>
                                        <Typography variant="caption">Còn nợ</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack>
                            <Stack spacing={2}>
                                <Typography variant="body2" fontWeight={600}>
                                    Nhật ký hoạt động
                                </Typography>
                                <Stack></Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={9} md={8} lg={9}>
                    <Stack className="page-full" padding={2} sx={{ border: '1px solid #cccc', borderRadius: '4px' }}>
                        <TabContext value={tabActive}>
                            <Box>
                                <TabList onChange={handleChangeTab}>
                                    <Tab label="Cuộc hẹn" value="1" />
                                    <Tab label="Mua hàng" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1" sx={{ padding: 0 }}>
                                <TabCuocHen />
                            </TabPanel>
                            <TabPanel value="2" sx={{ padding: 0 }}>
                                <TabMuaHang />
                            </TabPanel>
                        </TabContext>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};
export default observer(CustomerInfor2);
