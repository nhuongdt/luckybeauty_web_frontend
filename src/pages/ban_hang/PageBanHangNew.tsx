import * as React from 'react';
import {
    Box,
    Grid,
    Typography,
    ButtonGroup,
    Button,
    TextField,
    IconButton,
    List,
    ListItem,
    Avatar,
    ListItemIcon,
    ListItemText,
    InputAdornment
} from '@mui/material';
import binIcon from '../../images/trash.svg';
import closeIcon from '../../images/closeSmall.svg';
import arrowIcon from '../../images/arrow_back.svg';
import serviceIcon1 from '../../images/tocIcon.svg';
import serviceIcon2 from '../../images/hoachatIcon.svg';
import serviceIcon3 from '../../images/other.svg';
import serviceIcon4 from '../../images/combo.svg';
import productIcon1 from '../../images/goixa.svg';
import productIcon2 from '../../images/dactri.svg';
import productIcon3 from '../../images/duongtoc.svg';
import avatar from '../../images/avatar.png';
import searchIcon from '../../images/search-normal.svg';
import dotIcon from '../../images/dotssIcon.svg';
import { LocalOffer, Search } from '@mui/icons-material';

import { useState, useEffect, useReducer } from 'react';
import { useAsyncValue, useNavigate } from 'react-router-dom';

import ProductService from '../../services/product/ProductService';
import GroupProductService from '../../services/product/GroupProductService';

import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import HoaDonService from '../../services/ban_hang/HoaDonService';

import SoQuyServices from '../../services/so_quy/SoQuyServices';
import QuyHoaDonDto from '../../services/so_quy/QuyHoaDonDto';
import MauInServices from '../../services/mau_in/MauInServices';

import { dbDexie } from '../../lib/dexie/dexieDB';

import Utils from '../../utils/utils';
import HoaDonChiTietDto from '../../services/ban_hang/HoaDonChiTietDto';
import { Guid } from 'guid-typescript';
import utils from '../../utils/utils';
import QuyChiTietDto from '../../services/so_quy/QuyChiTietDto';
import CheckinService from '../../services/check_in/CheckinService';
import { ModelNhomHangHoa } from '../../services/product/dto';

const PageBanHang = ({ customerChosed }: any) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    const [nhomDichVu, setNhomDichVu] = useState<ModelNhomHangHoa[]>([]);
    const [nhomHangHoa, setNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);
    const [listProduct, setListProduct] = useState([]);

    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(
        new PageHoaDonDto({ idKhachHang: null, tenKhachHang: '' })
    );
    const [hoaDonChiTiet, setHoaDonChiTiet] = useState<PageHoaDonChiTietDto[]>([]);
    const [clickSSave, setClickSave] = useState(false);
    const [idNhomHang, setIdNhomHang] = useState('');

    const GetTreeNhomHangHoa = async () => {
        const list = await GroupProductService.GetTreeNhomHangHoa();
        const lstAll = [...list.items];

        setNhomDichVu(lstAll.filter((x) => !x.laNhomHangHoa));
        setNhomHangHoa(lstAll.filter((x) => x.laNhomHangHoa));
    };

    const GetDMHangHoa_groupByNhom = async () => {
        const input = {
            IdNhomHangHoas: idNhomHang,
            TextSearch: '',
            CurrentPage: 0,
            PageSize: 50
        };
        const data = await ProductService.GetDMHangHoa_groupByNhom(input);
        setListProduct(data);
    };

    const PageLoad = () => {
        GetTreeNhomHangHoa();
    };
    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        GetDMHangHoa_groupByNhom();
    }, [idNhomHang]);

    useEffect(() => {
        FirstLoad_getSetDataFromCache();
    }, [customerChosed]);

    const choseNhomDichVu = (item: any) => {
        setIdNhomHang(item.id);
    };

    const FirstLoad_getSetDataFromCache = async () => {
        const idCus = customerChosed.idKhachHang;
        if (!utils.checkNull(idCus)) {
            const data = await dbDexie.hoaDon.where('idKhachHang').equals(idCus).toArray();
            if (data.length === 0) {
                const dataHD: PageHoaDonDto = {
                    ...hoadon,
                    idKhachHang: customerChosed.idKhachHang,
                    maKhachHang: customerChosed.maKhachHang,
                    tenKhachHang: customerChosed.tenKhachHang,
                    soDienThoai: customerChosed.soDienThoai,
                    tongTichDiem: customerChosed.tongTichDiem
                };
                setHoaDon(dataHD);
                if (hoadon.id !== dataHD.id) {
                    // avoid warning when StrictMode (add twice)
                    dbDexie.hoaDon.add(dataHD);
                }
            } else {
                // get hoadon + cthd
                const hdctCache = data[0].hoaDonChiTiet ?? [];
                setHoaDon(data[0]);
                setHoaDonChiTiet(hdctCache);
            }
        } else {
            // asisgn hoadon
            setHoaDon((old) => {
                return {
                    ...old,
                    idKhachHang: customerChosed.idKhachHang,
                    maKhachHang: customerChosed.maKhachHang,
                    tenKhachHang: customerChosed.tenKhachHang,
                    soDienThoai: customerChosed.soDienThoai,
                    tongTichDiem: customerChosed.tongTichDiem
                };
            });
        }
    };

    const updateCurrentInvoice = async () => {
        let tongTienHangChuaCK = 0,
            tongChietKhau = 0,
            tongTienHang = 0,
            thanhtiensauVAT = 0;

        for (let i = 0; i < hoaDonChiTiet.length; i++) {
            const itFor = hoaDonChiTiet[i];
            tongTienHangChuaCK += itFor.soLuong * itFor.donGiaTruocCK;
            tongTienHang += itFor.thanhTienSauCK ?? 0;
            tongChietKhau += itFor.tienChietKhau ?? 0;
            thanhtiensauVAT += itFor.thanhTienSauVAT ?? 0;
        }
        const dataHD = {
            ...hoadon,
            tongTienHangChuaChietKhau: tongTienHangChuaCK,
            tongTienHang: tongTienHang,
            tongChietKhauHangHoa: tongChietKhau,
            tongTienHDSauVAT: thanhtiensauVAT,
            tongThanhToan: thanhtiensauVAT,
            hoaDonChiTiet: hoaDonChiTiet
        };
        setHoaDon((old: any) => {
            return {
                ...old,
                tongTienHangChuaChietKhau: tongTienHangChuaCK,
                tongTienHang: tongTienHang,
                tongChietKhauHangHoa: tongChietKhau,
                tongTienHDSauVAT: thanhtiensauVAT,
                tongThanhToan: thanhtiensauVAT,
                hoaDonChiTiet: hoaDonChiTiet
            };
        });
        UpdateCacheHD(dataHD);
    };

    const UpdateCacheHD = async (dataHD: any) => {
        const id = dataHD.id ?? Guid.create().toString();
        const data = await dbDexie.hoaDon.where('id').equals(id).toArray();

        if (data.length > 0) {
            await dbDexie.hoaDon
                .where('id')
                .equals(id)
                .delete()
                .then(function (deleteCount: any) {
                    if (deleteCount > 0) {
                        console.log('dataHD ', dataHD);
                        dbDexie.hoaDon.add(dataHD);
                    }
                });
        }
    };

    useEffect(() => {
        updateCurrentInvoice();
    }, [hoaDonChiTiet]);

    const deleteChiTietHoaDon = (item: any) => {
        setHoaDonChiTiet(hoaDonChiTiet.filter((x) => x.idDonViQuyDoi !== item.idDonViQuyDoi));
    };

    const choseChiTiet = async (item: any, index: any) => {
        const newCT = new PageHoaDonChiTietDto({
            idDonViQuyDoi: item.idDonViQuyDoi,
            maHangHoa: item.maHangHoa,
            tenHangHoa: item.tenHangHoa,
            giaBan: item.giaBan,
            idNhomHangHoa: item.idNhomHangHoa,
            idHangHoa: item.id,
            soLuong: 1
        });

        const checkCT = hoaDonChiTiet.filter((x) => x.idDonViQuyDoi === item.idDonViQuyDoi);
        if (checkCT.length === 0) {
            setHoaDonChiTiet((olds: any) => {
                return [newCT, ...olds];
            });
        } else {
            newCT.soLuong = checkCT[0].soLuong + 1;
            newCT.nhanVienThucHien = checkCT[0].nhanVienThucHien;

            // remove & unshift but keep infor old cthd
            const arrOld = hoaDonChiTiet?.filter((x) => x.idDonViQuyDoi !== item.idDonViQuyDoi);
            setHoaDonChiTiet((olds: any) => {
                return [newCT, ...arrOld];
            });
        }
    };

    const RemoveCache = async () => {
        console.log('RemoveCache ', hoadon.id, customerChosed.idCheckIn);
        // remove  hoadon
        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon.id)
            .delete()
            .then(function (deleteCount: any) {
                console.log('hoadonDelete ', hoadon.id, deleteCount);
            });

        // remove cache kh_checkin
        await dbDexie.khachCheckIn
            .where('id')
            .equals(customerChosed.idCheckIn)
            .delete()
            .then(function (deleteCount: any) {
                console.log('customerChosed.idCheckIn ', customerChosed.idCheckIn, deleteCount);
            });
    };

    const saveHoaDon = async () => {
        setClickSave(true);

        const hodaDonDB = await HoaDonService.CreateHoaDon(hoadon);
        setHoaDonChiTiet([]);
        setHoaDon(new PageHoaDonDto({ idKhachHang: null }));

        // checkout
        const checkout = await CheckinService.UpdateTrangThaiCheckin(customerChosed.idCheckIn, 2);

        // save soquy
        const quyHD: QuyHoaDonDto = new QuyHoaDonDto({
            idLoaiChungTu: 11,
            ngayLapHoaDon: hoadon.ngayLapHoaDon,
            tongTienThu: hoadon.tongThanhToan
        });
        quyHD.quyHoaDon_ChiTiet = [
            new QuyChiTietDto({
                idHoaDonLienQuan: hodaDonDB.id,
                idKhachHang: hoadon.idKhachHang,
                tienThu: hoadon.tongThanhToan
            })
        ];
        console.log('quyHD', quyHD);
        const soquyDB = await SoQuyServices.CreateQuyHoaDon(quyHD);
        console.log('soquyDB', soquyDB);
        // remove  cache
        await RemoveCache();

        const content = await MauInServices.GetFileMauIn('HoaDonBan.txt');
        const newIframe = document.createElement('iframe');
        newIframe.height = '0';
        newIframe.src = 'about:blank';
        document.body.appendChild(newIframe);
        newIframe.src = 'javascript:window["contents"]';
        newIframe.focus();
        const pri = newIframe.contentWindow;
        pri?.document.open();
        pri?.document.write(content);
        pri?.document.close();
        // pri.focus();
        pri?.print();

        // back to cuschecking (todo)
    };

    return (
        <>
            <Grid
                container
                spacing={3}
                marginTop="21px"
                paddingLeft="2.2222222222222223vw"
                paddingBottom="24px">
                <Grid item md={3}>
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: ' 0px 20px 100px 0px #0000000D',
                            padding: '16px 24px',
                            height: '100%',
                            maxHeight: '62.5vh',
                            overflowY: 'auto'
                        }}>
                        <Box>
                            <Typography
                                variant="h3"
                                fontSize="18px"
                                color="#4C4B4C"
                                fontWeight="700">
                                Nhóm dịch vụ
                            </Typography>
                            <List>
                                {nhomDichVu.map((nhomDV, index) => (
                                    <ListItem
                                        key={index}
                                        onClick={() => choseNhomDichVu(nhomDV)}
                                        sx={{
                                            gap: '6px',
                                            padding: '10px',
                                            borderWidth: '1px',
                                            borderStyle: 'solid',
                                            borderColor: nhomDV.color,
                                            borderRadius: '8px',
                                            marginTop: '12px'
                                        }}>
                                        <ListItemIcon sx={{ minWidth: '0' }}>
                                            <LocalOffer style={{ color: nhomDV.color }} />
                                        </ListItemIcon>
                                        <ListItemText>{nhomDV.tenNhomHang}</ListItemText>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <Box>
                            <Typography
                                variant="h3"
                                fontSize="18px"
                                color="#4C4B4C"
                                fontWeight="700"
                                marginTop="12px">
                                Sản phẩm
                            </Typography>
                            <List>
                                {nhomHangHoa.map((nhomHH, index) => (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            gap: '6px',
                                            padding: '10px',
                                            borderWidth: '1px',
                                            borderStyle: 'solid',
                                            borderColor: nhomHH.color,
                                            borderRadius: '8px',
                                            marginTop: '12px'
                                        }}
                                        onClick={() => choseNhomDichVu(nhomHH)}>
                                        <ListItemIcon sx={{ minWidth: '0' }}>
                                            <LocalOffer style={{ color: nhomHH.color }} />
                                        </ListItemIcon>
                                        <ListItemText>{nhomHH.tenNhomHang}</ListItemText>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={5}>
                    <Box display="flex" flexDirection="column">
                        <TextField
                            fullWidth
                            sx={{
                                backgroundColor: '#fff',
                                borderColor: '#CDC9CD!important',
                                borderWidth: '1px!important',
                                maxWidth: 'calc(100% - 32px)',
                                boxShadow: ' 0px 20px 100px 0px #0000000D',

                                margin: 'auto'
                            }}
                            size="small"
                            className="search-field"
                            variant="outlined"
                            type="search"
                            placeholder="Tìm kiếm"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap="24px"
                            padding="16px"
                            marginTop="12px"
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                maxHeight: '56.0898vh',
                                overflowY: 'auto'
                            }}>
                            {listProduct.map((nhom: any, index: any) => (
                                <Box key={index}>
                                    <Typography
                                        variant="h4"
                                        fontSize="16px"
                                        color="#000"
                                        fontWeight="700"
                                        marginBottom="16px">
                                        {nhom.tenNhomHang}
                                    </Typography>

                                    <Grid container spacing={1.5}>
                                        {nhom.hangHoas.map((item: any, index2: any) => (
                                            <Grid item md={4} key={item.id}>
                                                <Box
                                                    height="104px"
                                                    padding="8px 12px 9px 12px"
                                                    display="flex"
                                                    flexDirection="column"
                                                    justifyContent="space-between"
                                                    borderRadius="4px"
                                                    style={{
                                                        backgroundColor: nhom.color + '1a'
                                                    }}
                                                    onClick={() => {
                                                        choseChiTiet(item, index);
                                                    }}>
                                                    <Typography
                                                        variant="h5"
                                                        fontSize="14px"
                                                        fontWeight="700"
                                                        color="#333233">
                                                        {item.tenHangHoa}
                                                    </Typography>
                                                    <Typography
                                                        variant="body1"
                                                        fontSize="14px"
                                                        color="#333233">
                                                        {utils.formatNumber(item.giaBan)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={4}>
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            height: '100%',
                            maxHeight: '72.9492vh',
                            overflowY: 'auto',
                            padding: '24px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                radius: '8px',
                                borderBottom: '1px solid #F2F2F2',
                                paddingBottom: '24px'
                            }}>
                            <Box display="flex" gap="8px" alignItems="start">
                                <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
                                <Box>
                                    <Typography variant="body2" fontSize="14px" color="#666466">
                                        {hoadon?.tenKhachHang}
                                    </Typography>
                                    <Typography variant="body2" fontSize="12px" color="#999699">
                                        {hoadon?.soDienThoai}
                                    </Typography>
                                </Box>
                                <Button sx={{ marginLeft: 'auto' }}>
                                    <img
                                        src={dotIcon}
                                        style={{
                                            filter: 'brightness(0) saturate(100%) invert(11%) sepia(2%) saturate(2336%) hue-rotate(295deg) brightness(93%) contrast(94%)'
                                        }}
                                    />
                                </Button>
                            </Box>
                        </Box>
                        <Box
                            marginBottom="auto"
                            padding="24px 16px"
                            borderRadius="8px"
                            border="1px solid #F2F2F2"
                            marginTop="24px">
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography
                                        variant="body1"
                                        fontSize="16px"
                                        color="#7C3367"
                                        fontWeight="400"
                                        lineHeight="24px">
                                        Combo cắt uốn
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Typography
                                        color="#000"
                                        variant="body1"
                                        fontSize="16px"
                                        fontWeight="400">
                                        <span>1</span>x<span>200.000</span>
                                    </Typography>
                                    <IconButton sx={{ marginLeft: '16px' }}>
                                        <img src={binIcon} alt="bin" />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Typography
                                    variant="body2"
                                    fontSize="12px"
                                    color="#666466"
                                    lineHeight="16px">
                                    Nhân viên :
                                </Typography>
                                <Typography
                                    variant="body1"
                                    fontSize="14px"
                                    lineHeight="16px"
                                    color="#4C4B4C"
                                    display="flex"
                                    alignItems="center"
                                    sx={{
                                        backgroundColor: '#F2EBF0',
                                        padding: '4px 8px',
                                        gap: '10px',
                                        borderRadius: '100px'
                                    }}>
                                    <span>Tài Đinh</span>
                                    <span>
                                        <img src={closeIcon} alt="close" />
                                    </span>
                                </Typography>
                            </Box>
                        </Box>

                        <Box display="flex" flexDirection="column" gap="32px" marginTop="24px">
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" fontSize="14px" color="#3B4758">
                                    Tổng tiền hàng
                                </Typography>
                                <Typography variant="caption" fontSize="12px" color="#3B4758">
                                    {Utils.formatNumber(hoadon.tongTienHangChuaChietKhau)}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" fontSize="14px" color="#3B4758">
                                    Giảm giá
                                </Typography>
                                <Typography variant="caption" fontSize="12px" color="#3B4758">
                                    {Utils.formatNumber(hoadon.tongChietKhauHangHoa)}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" fontSize="14px" color="#3B4758">
                                    Tổng giảm giá
                                </Typography>
                                <Typography variant="caption" fontSize="12px" color="#3B4758">
                                    {Utils.formatNumber(hoadon.tongChietKhauHangHoa)}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography
                                    variant="h5"
                                    fontWeight="700"
                                    fontSize="18px"
                                    color="#3B4758">
                                    Tổng thanh toán
                                </Typography>
                                <Typography
                                    variant="body1"
                                    fontWeight="700"
                                    fontSize="16px"
                                    color="#3B4758">
                                    {Utils.formatNumber(hoadon.tongThanhToan)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Box
                sx={{
                    width: '100%',
                    justifyContent: 'space-between',
                    display: 'flex',
                    padding: '28px 32px',
                    backgroundColor: '#fff'
                }}>
                <Button
                    variant="outlined"
                    sx={{
                        display: 'flex',
                        gap: '6px',
                        borderColor: '#3B4758',
                        textTransform: 'unset!important'
                    }}>
                    <img src={arrowIcon} />
                    <Typography
                        color="#3B4758"
                        variant="button"
                        fontSize="14px"
                        fontWeight="400"
                        sx={{ textTransform: 'unset!important' }}>
                        Quay trở lại
                    </Typography>
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        fontSize: '14px',
                        fontWeight: '400',
                        color: '#fff',
                        textTransform: 'unset!important',
                        backgroundColor: '#7C3367!important',
                        width: 'calc(33.33333% - 75px)'
                    }}>
                    Thanh Toán
                </Button>
            </Box>
        </>
    );
};
export default PageBanHang;
