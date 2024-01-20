import { Grid, Stack, Box, Avatar, Typography, Button, Tab } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabCuocHen from './TabCuocHen';
import TabMuaHang from './TabMuaHang';
import utils from '../../../utils/utils';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { Guid } from 'guid-typescript';
import { KhachHangDetail } from '../../../services/khach-hang/dto/KhachHangDetail';
import khachHangStore from '../../../stores/khachHangStore';
import khachHangService from '../../../services/khach-hang/khachHangService';
import { ICustomerDetail_FullInfor } from '../../../services/khach-hang/dto/KhachHangDto';
import { HoatDongKhachHang } from '../../../services/khach-hang/dto/ThongTinKhachHangTongHopDto';
import { format } from 'date-fns';
import CreateOrEditCustomerDialog from '../components/create-or-edit-customer-modal';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import { CreateOrEditKhachHangDto } from '../../../services/khach-hang/dto/CreateOrEditKhachHangDto';

const CustomerInfor2 = () => {
    const { khachHangId } = useParams();
    const [tabActive, setTabActive] = useState('1');
    const [isShowEditKhachHang, setIsShowEditKhachHang] = useState(false);
    const [inforCus, setInforCus] = useState<ICustomerDetail_FullInfor>();
    // vi khong dung Mobx nên phải k hai báo 2 lần inforCus, cusEdit
    const [cusEdit, setCusEdit] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);
    const [nkyHoatDong, setNKyHoatDong] = useState<HoatDongKhachHang[]>([]);
    const [objAlert, setObjAlert] = useState({ show: false, mes: '', type: 1 });
    const [objDelete, setObjDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabActive(newValue);
    };

    useEffect(() => {
        getKhachHangInfo();
        getNhatKyHoatDong();
    }, [khachHangId]);
    const getKhachHangInfo = async () => {
        const data = await khachHangService.getDetail(khachHangId ?? Guid.EMPTY);
        setInforCus(data);
    };
    const getNhatKyHoatDong = async () => {
        const data = await khachHangService.GetNhatKyHoatDong_ofKhachHang(khachHangId ?? Guid.EMPTY);
        setNKyHoatDong(data);
    };

    const onShowModalEditCustomer = async () => {
        setIsShowEditKhachHang(true);
        const dataEdit = await khachHangService.getKhachHang(khachHangId ?? Guid.EMPTY);
        setCusEdit({
            ...cusEdit,
            id: dataEdit?.id,
            maKhachHang: dataEdit?.maKhachHang,
            tenKhachHang: dataEdit?.tenKhachHang,
            soDienThoai: dataEdit?.soDienThoai,
            ngaySinh: dataEdit?.ngaySinh,
            diaChi: dataEdit?.diaChi ?? '',
            gioiTinhNam: dataEdit?.gioiTinhNam ?? false,
            moTa: dataEdit?.moTa ?? ''
        });
        // await khachHangStore.getForEdit(khachHangId ?? Guid.EMPTY);
    };

    const gotoBack = () => {
        window.location.replace('/khach-hangs');
    };

    const onDeleteCustomer = async () => {
        await khachHangService.delete(khachHangId ?? Guid.EMPTY);
        setObjDelete({ ...objDelete, show: false });
        setObjAlert({ ...objAlert, show: true, mes: 'Xóa khách hàng thành công' });
        gotoBack();
    };

    const onSaveEditCustomer = async () => {
        await getKhachHangInfo();
        // get lai thong tin: vì hàm createOrEdit không trả về thông tin (tenNhomKhach)
        // const data = await khachHangService.getDetail(khachHangId ?? Guid.EMPTY);
        // setInforCus({
        //     ...inforCus,
        //     id: data?.id,
        //     idLoaiKhach: data?.idLoaiKhach,
        //     maKhachHang: data?.maKhachHang,
        //     tenKhachHang: data?.tenKhachHang,
        //     gioiTinhNam: data?.gioiTinhNam,
        //     ngaySinh: data?.ngaySinh,
        //     diaChi: data?.diaChi,
        //     soDienThoai: data?.soDienThoai,
        //     tenNhomKhach: data?.tenNhomKhach
        // });
        setIsShowEditKhachHang(false);
    };

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ConfirmDelete
                title={objDelete.title}
                mes={objDelete.mes}
                isShow={objDelete.show}
                onOk={onDeleteCustomer}
                onCancel={() => setObjDelete({ ...objDelete, show: false })}></ConfirmDelete>
            <CreateOrEditCustomerDialog
                visible={isShowEditKhachHang}
                onCancel={() => {
                    setIsShowEditKhachHang(!isShowEditKhachHang);
                }}
                onOk={onSaveEditCustomer}
                title={'Cập nhật thông tin khách hàng'}
                formRef={cusEdit}
            />
            <Grid container paddingTop={2} spacing={1}>
                <Grid item xs={12} md={4} lg={3} sx={{ position: 'relative' }}>
                    <Stack
                        padding={2}
                        spacing={2}
                        className="page-full"
                        sx={{ border: '1px solid #cccc', borderRadius: '4px' }}>
                        <Stack sx={{ position: 'relative' }}>
                            <Stack direction={'row'} spacing={1.5} alignItems={'center'}>
                                <Stack position={'relative'}>
                                    {inforCus?.avatar ? (
                                        <Stack
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
                                            <img src={inforCus?.avatar} alt="avatar" />
                                        </Stack>
                                    ) : (
                                        <Avatar
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                backgroundColor: 'var(--color-bg)',
                                                color: 'var(--color-main)',
                                                fontSize: '18px'
                                            }}>
                                            {utils.getFirstLetter(inforCus?.tenKhachHang, 3)}
                                        </Avatar>
                                    )}
                                    <ModeEditOutlinedIcon
                                        sx={{
                                            position: 'absolute',
                                            right: '0px',
                                            bottom: '-7px',
                                            width: '20px',
                                            color: '#5292e1'
                                        }}
                                    />
                                </Stack>
                                <Stack sx={{ position: 'relative' }}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                                        {inforCus?.tenKhachHang}
                                    </Typography>
                                    <Typography variant="caption" color={'#b2b7bb'}>
                                        {inforCus?.maKhachHang}
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
                                    <Typography variant="body2">{inforCus?.soDienThoai}</Typography>
                                </Grid>
                                <Grid item xs={5} lg={4}>
                                    <Typography variant="body2" fontWeight={600}>
                                        Ngày sinh
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} lg={8}>
                                    <Typography variant="body2">
                                        {!utils.checkNull(inforCus?.ngaySinh as unknown as string)
                                            ? format(new Date(inforCus?.ngaySinh as unknown as string), 'dd/MM/yyyy')
                                            : ''}
                                    </Typography>
                                </Grid>
                                <Grid item xs={5} lg={4}>
                                    <Typography variant="body2" fontWeight={600}>
                                        Địa chỉ
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} lg={8}>
                                    <Typography variant="body2"> {inforCus?.diaChi}</Typography>
                                </Grid>
                                <Grid item xs={5} lg={4}>
                                    <Typography variant="body2" fontWeight={600}>
                                        Nhóm khách
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} lg={8}>
                                    <Typography variant="body2">{inforCus?.tenNhomKhach}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1} direction={'row'} justifyContent={'center'}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            sx={{ borderRadius: '12px', flex: 8 }}
                                            onClick={onShowModalEditCustomer}>
                                            Thay đổi thông tin
                                        </Button>
                                        <DeleteOutlinedIcon
                                            titleAccess="Xóa khách hàng"
                                            sx={{ color: '#b75151' }}
                                            onClick={() => {
                                                setObjDelete({
                                                    ...objDelete,
                                                    show: true,
                                                    title: 'Thông báo xóa',
                                                    mes: 'Bạn có chắc chắn muốn xóa khách hàng này không?'
                                                });
                                            }}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack sx={{ borderBottom: '1px solid #cccc' }} paddingBottom={2}>
                            <Stack spacing={2}>
                                <Stack justifyContent={'space-between'} direction={'row'}>
                                    <Typography variant="body2">Cuộc hẹn gần nhất</Typography>

                                    <Typography variant="body2">
                                        {!utils.checkNull(inforCus?.cuocHenGanNhat as unknown as string)
                                            ? format(
                                                  new Date(inforCus?.cuocHenGanNhat as unknown as string),
                                                  'dd/MM/yyyy'
                                              )
                                            : ''}
                                    </Typography>
                                </Stack>
                                <Stack justifyContent={'space-between'} direction={'row'}>
                                    <Stack alignItems={'center'}>
                                        <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                                            {inforCus?.soLanBooking}
                                        </Typography>
                                        <Typography variant="caption">Cuộc hẹn</Typography>
                                    </Stack>
                                    <Stack alignItems={'center'}>
                                        <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                                            {utils.formatNumber(inforCus?.tongChiTieu ?? 0)}
                                        </Typography>
                                        <Typography variant="caption">Chi tiêu</Typography>
                                    </Stack>
                                    <Stack alignItems={'center'}>
                                        <Typography
                                            sx={{
                                                fontSize: '18px',
                                                fontWeight: 600,
                                                color: (inforCus?.conNo ?? 0) > 0 ? '#b75151' : 'var(--font-color-main)'
                                            }}>
                                            {utils.formatNumber(inforCus?.conNo ?? 0)}
                                        </Typography>
                                        <Typography variant="caption">Còn nợ</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack>
                            <Stack spacing={2}>
                                <Typography variant="body2" fontWeight={600} textAlign={'center'}>
                                    Nhật ký hoạt động
                                </Typography>
                                <Stack
                                    spacing={1.5}
                                    // 70vh - 335px: 335 là chiều cao các phần (thông tin khách + thông tin cuộc hẹn)
                                    // 70vh là chiều cao max của phần bên trái
                                    sx={{ overflow: 'auto', maxHeight: 'calc(70vh - 335px)', paddingBottom: '16px' }}>
                                    {nkyHoatDong?.map((item, index) => (
                                        <Stack key={index} spacing={0.5}>
                                            <Typography
                                                variant="body2"
                                                dangerouslySetInnerHTML={{ __html: item?.hoatDong }}></Typography>
                                            <Typography variant="caption" color={'#978686'}>
                                                {format(new Date(item?.thoiGian), 'dd/MM/yyyy HH:mm')}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={8} lg={9}>
                    <Stack padding={2} className="page-full" sx={{ border: '1px solid #cccc', borderRadius: '4px' }}>
                        <TabContext value={tabActive}>
                            <Grid container alignItems={'center'}>
                                <Grid item lg={6}>
                                    <TabList onChange={handleChangeTab}>
                                        <Tab label="Cuộc hẹn" value="1" />
                                        <Tab label="Mua hàng" value="2" />
                                    </TabList>
                                </Grid>
                                <Grid item lg={6}>
                                    <Stack direction={'row'} spacing={1} justifyContent={'end'}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ArrowBackOutlinedIcon />}
                                            onClick={gotoBack}>
                                            Quay trở lại
                                        </Button>
                                        <Button variant="outlined" startIcon={<FileUploadOutlinedIcon />}>
                                            Xuất excel
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
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
// export default observer(CustomerInfor2);
export default CustomerInfor2;
