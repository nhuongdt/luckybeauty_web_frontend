import React, { useContext, useEffect, useState } from 'react';
import {
    Grid,
    Box,
    Typography,
    Button,
    Tabs,
    Tab,
    TextField,
    Select,
    MenuItem
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import { ReactComponent as InIcon } from '../../../images/printer.svg';
import Avatar from '../../../images/xinh.png';
import TabInfo from './Tab_info';
import TabDiary from './Tab_diary';
import { ReactComponent as ArrowIcon } from '../../../images/arrow_back.svg';
import ModalWarning from './Modal_warning';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../../services/ban_hang/PageHoaDonChiTietDto';
import DateTimePickerCustom from '../../../components/DatetimePicker/DateTimePickerCustom';
import { ReactComponent as ArrowDown } from '../.././../images/arow-down.svg';
import {
    ChiNhanhContext,
    ChiNhanhContextbyUser
} from '../../../services/chi_nhanh/ChiNhanhContext';
import AutocompleteChiNhanh from '../../../components/Autocomplete/ChiNhanh';
import ModalEditChiTietGioHang from '../modal_edit_chitiet';
import { ChiNhanhDto } from '../../../services/chi_nhanh/Dto/chiNhanhDto';

import { format } from 'date-fns';
import { Stack } from '@mui/system';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import AutocompleteCustomer from '../../../components/Autocomplete/Customer';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';

const themOutlineInput = createTheme({
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '8px'
                }
            }
        }
    }
});

const ThongTinHoaDon = ({ idHoaDon, hoadon, handleGotoBack }: any) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [hoadonChosed, setHoaDonChosed] = useState<PageHoaDonDto>(new PageHoaDonDto({ id: '' }));
    const [chitietHoaDon, setChiTietHoaDon] = useState<PageHoaDonChiTietDto[]>([]);

    const [isShowEditGioHang, setIsShowEditGioHang] = useState(false);
    const [idCTHDChosing, setIdCTHDChosing] = useState('');

    const current = useContext(ChiNhanhContext);
    const allChiNhanh = useContext(ChiNhanhContextbyUser);

    // todo change chinhanh --> back to list
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const GetChiTietHoaDon_byIdHoaDon = async () => {
        const data = await HoaDonService.GetChiTietHoaDon_byIdHoaDon(idHoaDon);
        setChiTietHoaDon(data);
    };

    useEffect(() => {
        GetChiTietHoaDon_byIdHoaDon();
        setHoaDonChosed(hoadon);
    }, [idHoaDon]);

    const changeNgayLapHoaDon = (value: any) => {
        setHoaDonChosed({ ...hoadonChosed, ngayLapHoaDon: value });
    };

    const changeChiNhanh = (item: ChiNhanhDto) => {
        setHoaDonChosed({ ...hoadonChosed, idChiNhanh: item?.id });
    };
    const changeCustomer = (item: any) => {
        setHoaDonChosed({ ...hoadonChosed, idKhachHang: item?.id });
    };

    const gotoBack = () => {
        // nếu cập nhật hóa đơn --> pass thông tin hóa đơn đã cập nhật
        handleGotoBack(hoadonChosed);
    };

    const checkSave = async () => {
        // if tongtien > tongtienold
        if (hoadon?.tongThanhToan > hoadonChosed?.tongThanhToan) {
            setObjAlert({ ...objAlert, show: true, mes: 'Tổng tiền hàng > Tổng cũ' });
        }
    };

    const huyHoaDon = async () => {
        setOpenDialog(true);
        await HoaDonService.DeleteHoaDon(idHoaDon);
        await SoQuyServices.HuyPhieuThuChi_ofHoaDonLienQuan(idHoaDon);

        // update state hoadon
        const objUpdate = { ...hoadonChosed };
        objUpdate.trangThai = 0;
        setHoaDonChosed({ ...hoadonChosed, trangThai: 0 });
        handleGotoBack(objUpdate);
    };

    const showModalEditGioHang = () => {
        setIsShowEditGioHang(true);
        setIdCTHDChosing('');
        console.log('hoaadonC ', chitietHoaDon);
    };

    const AgreeGioHang = async (lstCTAfter: PageHoaDonChiTietDto[]) => {
        console.log('lstCTAfter ', lstCTAfter);
        setIsShowEditGioHang(false);
        setObjAlert({ ...objAlert, show: true, mes: 'Cập nhật chi tiết hóa đơn thành công' });
        setChiTietHoaDon([...lstCTAfter]);

        // caculator TongTien
        let tongTienHangChuaChietKhau = 0,
            tongChietKhauHangHoa = 0,
            tongTienHang = 0,
            tongTienThue = 0,
            tongTienHDSauVAT = 0,
            tongThanhToan = 0;
        for (let i = 0; i < lstCTAfter.length; i++) {
            const ctFor = lstCTAfter[i];
            tongTienHangChuaChietKhau += ctFor?.thanhTienTruocCK ?? 0;
            tongChietKhauHangHoa += (ctFor?.soLuong ?? 0) * (ctFor?.tienChietKhau ?? 0);
            tongTienHang += ctFor?.thanhTienSauCK ?? 0;
            tongTienThue += (ctFor?.soLuong ?? 0) * (ctFor?.tienThue ?? 0);
            tongTienHDSauVAT += ctFor?.thanhTienSauVAT ?? 0;
        }
        tongThanhToan = tongTienHDSauVAT - (hoadon?.tongGiamGiaHD ?? 0);

        const objHDAfter = { ...hoadonChosed };
        objHDAfter.tongTienHangChuaChietKhau = tongTienHangChuaChietKhau;
        objHDAfter.tongChietKhauHangHoa = tongChietKhauHangHoa;
        objHDAfter.tongTienHang = tongTienHang;
        objHDAfter.tongTienThue = tongTienThue;
        objHDAfter.tongTienHDSauVAT = tongTienHDSauVAT;
        objHDAfter.tongThanhToan = tongThanhToan;

        console.log('objHDAfter ', objHDAfter);
        const data = await HoaDonService.Update_InforHoaDon(objHDAfter);
        setHoaDonChosed({
            ...hoadonChosed,
            tongTienHangChuaChietKhau: tongTienHangChuaChietKhau,
            tongChietKhauHangHoa: tongChietKhauHangHoa,
            tongTienHang: tongTienHang,
            tongTienThue: tongTienThue,
            tongTienHDSauVAT: tongTienHDSauVAT,
            tongThanhToan: tongThanhToan,
            maHoaDon: data?.maHoaDon
        });
    };
    const updateHoaDon = async () => {
        const data = await HoaDonService.Update_InforHoaDon(hoadonChosed);
        setHoaDonChosed({ ...hoadonChosed, maHoaDon: data?.maHoaDon });
        setObjAlert({ ...objAlert, show: true, mes: 'Cập nhật thông tin hóa đơn thành công' });
    };

    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (event: any, newValue: number) => {
        setActiveTab(newValue);
    };
    interface TabPanelProps {
        children?: React.ReactNode;
        value: number;
        index: number;
    }
    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
        return (
            <Box role="tabpanel" hidden={value !== index}>
                {value === index && <Box>{children}</Box>}
            </Box>
        );
    };
    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ModalEditChiTietGioHang
                formType={0}
                isShow={isShowEditGioHang}
                hoadonChiTiet={
                    idCTHDChosing === ''
                        ? chitietHoaDon
                        : chitietHoaDon.filter((x: any) => x.id === idCTHDChosing)
                }
                handleSave={AgreeGioHang}
                handleClose={() => setIsShowEditGioHang(false)}
            />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 'calc(100vh - 70px)'
                }}>
                <ModalWarning open={openDialog} onClose={handleCloseDialog} onOK={huyHoaDon} />
                <Box padding="16px 2.2222222222222223vw ">
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item xs="auto">
                            <Typography
                                variant="h1"
                                fontSize="16px"
                                fontWeight="700"
                                color="#333233">
                                Hóa đơn
                            </Typography>
                        </Grid>
                        <Grid item xs="auto">
                            <Box display="flex" gap="8px">
                                <Button
                                    startIcon={<InIcon />}
                                    variant="outlined"
                                    sx={{
                                        bgcolor: '#fff!important',
                                        color: '#666466',
                                        borderColor: '#E6E1E6!important'
                                    }}>
                                    In
                                </Button>
                                <Button
                                    startIcon={<UploadIcon />}
                                    variant="outlined"
                                    sx={{
                                        bgcolor: '#fff!important',
                                        color: '#666466',
                                        borderColor: '#E6E1E6!important'
                                    }}>
                                    Xuất
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#7C3367!important',
                                        color: '#fff'
                                    }}>
                                    Sao chép
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        sx={{
                            mt: '16px',
                            boxShadow: '0px 4px 20px 0px #AAA9B81A',
                            borderRadius: '12px',
                            padding: '24px 24px 0px 24px',
                            bgcolor: '#fff',
                            alignItems: 'center'
                        }}>
                        <Grid item xs={1.5}>
                            <Box
                                sx={{
                                    borderRadius: '6px',
                                    '& img': {
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'cover'
                                    }
                                }}>
                                <img width={100} src={Avatar} alt="avatar" />
                            </Box>
                        </Grid>
                        <Grid item xs={10.5}>
                            <Box display="flex" gap="23px" mb="12px">
                                <Typography
                                    variant="h4"
                                    color="#3B4758"
                                    fontWeight="700"
                                    fontSize="24px">
                                    {hoadonChosed?.tenKhachHang}
                                </Typography>
                                {/* <AutocompleteCustomer handleChoseItem={changeCustomer} /> */}
                                <Box
                                    sx={{
                                        padding: '2px 3px',
                                        borderRadius: '100px',
                                        color: '#0DA678',
                                        bgcolor: '#CAFBEC',
                                        width: 'fit-content',
                                        fontSize: '12px',
                                        height: 'fit-content'
                                    }}>
                                    {hoadonChosed?.txtTrangThaiHD}
                                </Box>
                            </Box>
                            <Grid container>
                                <Grid item xs={3}>
                                    <Typography
                                        variant="h5"
                                        fontSize="12px"
                                        color="#999699"
                                        fontWeight="400"
                                        height={24}>
                                        Mã hóa đơn
                                    </Typography>
                                    <TextField
                                        size="small"
                                        className="inputEdit"
                                        onChange={(event: any) =>
                                            setHoaDonChosed({
                                                ...hoadonChosed,
                                                maHoaDon: event.target.value
                                            })
                                        }
                                        value={hoadonChosed?.maHoaDon}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography
                                        variant="h5"
                                        fontSize="12px"
                                        color="#999699"
                                        fontWeight="400"
                                        height={24}>
                                        Ngày lập
                                    </Typography>
                                    <ThemeProvider theme={themOutlineInput}>
                                        <DateTimePickerCustom
                                            className="inputEdit"
                                            defaultVal={hoadonChosed?.ngayLapHoaDon}
                                            handleChangeDate={changeNgayLapHoaDon}
                                        />
                                    </ThemeProvider>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography
                                        variant="h5"
                                        fontSize="12px"
                                        color="#999699"
                                        fontWeight="400"
                                        height={24}>
                                        Chi nhánh
                                    </Typography>
                                    <ThemeProvider theme={themOutlineInput}>
                                        <AutocompleteChiNhanh
                                            dataChiNhanh={allChiNhanh}
                                            idChosed={hoadonChosed?.idChiNhanh}
                                            handleChoseItem={changeChiNhanh}
                                        />
                                    </ThemeProvider>
                                </Grid>
                                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                                    <Typography
                                        variant="h5"
                                        fontSize="12px"
                                        color="#999699"
                                        fontWeight="400"
                                        height={24}>
                                        User lập phiếu
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        fontSize="14px"
                                        color="#333233"
                                        marginTop="2px">
                                        {hoadonChosed?.userName}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid xs={12} item>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                sx={{
                                    borderTop: '1px solid #EEF0F4',
                                    paddingTop: '16px',
                                    marginTop: '20px',
                                    '& .MuiTabs-flexContainer': {
                                        gap: '32px'
                                    },
                                    '& button': {
                                        textTransform: 'unset',
                                        color: '#999699',
                                        fontSize: '16px',
                                        fontWeight: '400',
                                        padding: '0',
                                        minWidth: 'unset',
                                        minHeight: 'unset'
                                    },
                                    '& .Mui-selected': {
                                        color: '#7C3367!important'
                                    },
                                    '& .MuiTabs-indicator': {
                                        bgcolor: '#7C3367'
                                    }
                                }}>
                                <Tab label="Thông tin" />
                                <Tab label="Nhật ký thanh toán" />
                            </Tabs>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: '40px' }}>
                        <TabPanel value={activeTab} index={0}>
                            <TabInfo hoadon={hoadonChosed} chitietHoaDon={chitietHoaDon} />
                        </TabPanel>
                        <TabPanel value={activeTab} index={1}>
                            <TabDiary idHoaDon={idHoaDon} />
                        </TabPanel>
                    </Box>
                </Box>
                <Box
                    sx={{
                        bgcolor: '#fff',
                        width: '100%',
                        padding: '24px 32px',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                    <Box>
                        <Button
                            startIcon={<ArrowIcon />}
                            variant="outlined"
                            sx={{ color: '#3B4758', borderColor: '#3B4758' }}
                            className="btn-outline-hover"
                            onClick={gotoBack}>
                            Quay trở lại
                        </Button>
                    </Box>
                    <Box display="flex" gap="8px">
                        <Button
                            variant="outlined"
                            sx={{ borderColor: '#3B4758', color: '#4C4B4C' }}
                            className="btn-outline-hover"
                            onClick={showModalEditGioHang}>
                            Chỉnh sửa
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ bgcolor: '#7C3367!important', color: '#fff' }}
                            className="btn-container-hover"
                            onClick={updateHoaDon}>
                            Lưu
                        </Button>
                        <Button
                            onClick={handleOpenDialog}
                            variant="contained"
                            sx={{
                                transition: '.4s',
                                bgcolor: '#FF316A!important',
                                color: '#fff',
                                '&:hover': {
                                    bgcolor: 'red!important'
                                }
                            }}>
                            Hủy bỏ
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};
export default ThongTinHoaDon;
