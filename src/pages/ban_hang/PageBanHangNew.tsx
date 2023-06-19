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
import closeIcon from '../../images/closeSmall.svg';
import arrowIcon from '../../images/arrow_back.svg';
import avatar from '../../images/avatar.png';
import dotIcon from '../../images/dotssIcon.svg';
import { LocalOffer, Search } from '@mui/icons-material';
import { AiOutlineDelete } from 'react-icons/ai';
// import { useReactToPrint } from 'react-to-print';
import { useState, useEffect, useRef } from 'react';
import { debounce } from '@mui/material/utils';
import { useReactToPrint } from 'react-to-print';

import { InHoaDon } from '../../components/Print/InHoaDon';
import { MauInHoaDon } from '../../components/Print/MauInHoaDon';

import ProductService from '../../services/product/ProductService';
import GroupProductService from '../../services/product/GroupProductService';

import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import HoaDonService from '../../services/ban_hang/HoaDonService';

import SoQuyServices from '../../services/so_quy/SoQuyServices';
import QuyHoaDonDto from '../../services/so_quy/QuyHoaDonDto';
import MauInServices from '../../services/mau_in/MauInServices';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';

import { dbDexie } from '../../lib/dexie/dexieDB';

import Utils from '../../utils/utils';
import HoaDonChiTietDto from '../../services/ban_hang/HoaDonChiTietDto';
import NhanSuItemDto from '../../services/nhan-vien/dto/nhanSuItemDto';
import { Guid } from 'guid-typescript';
import utils from '../../utils/utils';
import QuyChiTietDto from '../../services/so_quy/QuyChiTietDto';
import CheckinService from '../../services/check_in/CheckinService';
import { ModelNhomHangHoa } from '../../services/product/dto';
import { PropToChildMauIn, PropModal } from '../../utils/PropParentToChild';
import ModelNhanVienThucHien from '../nhan_vien_thuc_hien/modelNhanVienThucHien';
import ModalEditChiTietGioHang from './modal_edit_chitiet';
import NhanVienService from '../../services/nhan-vien/nhanVienService';

import logo from '../../images/Lucky_beauty.jpg';
import { ReactComponent as IconDv } from '../../images/icon-DV.svg';
import { ReactComponent as SearchIcon } from '../../images/search-normal.svg';
import { ReactComponent as DeleteIcon } from '../../images/trash.svg';
import { ReactComponent as UserIcon } from '../../images/user.svg';
import { ReactComponent as VoucherIcon } from '../../images/voucherIcon.svg';

const PageBanHang = ({ customerChosed }: any) => {
    const componentRef = useRef(null);
    const [txtSearch, setTxtSearch] = useState('');
    const [allNhomHangHoa, setAllNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);
    const [listProduct, setListProduct] = useState([]);

    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(
        new PageHoaDonDto({ idKhachHang: null, tenKhachHang: '' })
    );
    const [hoaDonChiTiet, setHoaDonChiTiet] = useState<PageHoaDonChiTietDto[]>([]);

    const isFirstRender = useRef(true);
    const afterRender = useRef(false);
    const [clickSSave, setClickSave] = useState(false);
    const [isPrint, setIsPrint] = useState(false); // todo check on/off print
    const [idNhomHang, setIdNhomHang] = useState('');
    const [idLoaiHangHoa, setIdLoaiHangHoa] = useState(0);

    // used to check update infor cthd
    const [cthdDoing, setCTHDDoing] = useState<PageHoaDonChiTietDto>(
        new PageHoaDonChiTietDto({ id: '', expanded: true })
    );

    const [contentPrint, setContentPrint] = useState('<h1> Hello </h1>');
    const [propMauIn, setPropMauIn] = useState<PropToChildMauIn>(
        new PropToChildMauIn({ contentHtml: '' })
    );
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);
    const [propNVThucHien, setPropNVThucHien] = useState<PropModal>(
        new PropModal({ isShow: false })
    );
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [triggerModalEditGioHang, setTriggerModalEditGioHang] = useState<PropModal>(
        new PropModal({ isShow: false })
    );

    const GetTreeNhomHangHoa = async () => {
        const list = await GroupProductService.GetTreeNhomHangHoa();
        setAllNhomHangHoa(list.items);
    };
    const nhomDichVu = allNhomHangHoa.filter((x) => !x.laNhomHangHoa);
    const nhomHangHoa = allNhomHangHoa.filter((x) => x.laNhomHangHoa);

    const GetListNhanVien = async () => {
        const data = await NhanVienService.search('', { skipCount: 0, maxResultCount: 100 });
        setAllNhanVien([...data.items]);
    };

    const PageLoad = async () => {
        await GetTreeNhomHangHoa();
        await GetListNhanVien();
        await FirstLoad_getSetDataFromCache();
        afterRender.current = true;
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // avoid load again
        }
        PageLoad();
    }, [customerChosed]);

    const getListHangHoa_groupbyNhom = async () => {
        const input = {
            IdNhomHangHoas: idNhomHang,
            TextSearch: '',
            IdLoaiHangHoa: idLoaiHangHoa,
            CurrentPage: 0,
            PageSize: 50
        };
        const data = await ProductService.GetDMHangHoa_groupByNhom(input);
        setListProduct(data);
    };

    React.useEffect(() => {
        if (isFirstRender.current) return;
        getListHangHoa_groupbyNhom();
    }, [idNhomHang, idLoaiHangHoa]);

    // only used when change textseach
    const debounceDropDown = useRef(
        debounce(async (input: any) => {
            const data = await ProductService.GetDMHangHoa_groupByNhom(input);
            setListProduct(data);
        }, 500)
    ).current;

    React.useEffect(() => {
        if (!afterRender.current) return;
        // if search, reset inhom +loaihang
        const input = {
            IdNhomHangHoas: '',
            TextSearch: txtSearch,
            IdLoaiHangHoa: 0,
            CurrentPage: 0,
            PageSize: 50
        };

        debounceDropDown(input);
    }, [txtSearch]);

    // filter list product
    const choseNhomDichVu = async (item: any) => {
        setIdNhomHang(item.id);
        setIdLoaiHangHoa(0);
    };

    const choseLoaiHang = (type: number) => {
        setTxtSearch('');
        setIdNhomHang('');
        setIdLoaiHangHoa(type);
    };
    // end filter

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
                dbDexie.hoaDon.add(dataHD);
            } else {
                // get hoadon + cthd
                const hdctCache = data[0].hoaDonChiTiet ?? [];
                setHoaDon(data[0]);
                setHoaDonChiTiet(hdctCache);

                setPropMauIn((old: any) => {
                    return {
                        ...old,
                        // contentHtml: content,
                        hoadon: data[0],
                        khachhang: { ...customerChosed },
                        hoadonChiTiet: [...hdctCache],
                        chinhanh: {
                            tenChiNhanh: 'CTCP SSOFT VIỆT NAM',
                            soDienThoai: '0973474985',
                            logo: logo
                        }
                    };
                });
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
            tongThueChiTiet = 0,
            tongTienHang = 0,
            thanhtiensauVAT = 0;

        for (let i = 0; i < hoaDonChiTiet.length; i++) {
            const itFor = hoaDonChiTiet[i];
            tongTienHangChuaCK += itFor.soLuong * itFor.donGiaTruocCK;
            tongTienHang += itFor.thanhTienSauCK ?? 0;
            tongChietKhau += (itFor.tienChietKhau ?? 0) * itFor.soLuong;
            tongThueChiTiet += (itFor.tienThue ?? 0) * itFor.soLuong;
            thanhtiensauVAT += itFor.thanhTienSauVAT ?? 0;
        }
        const dataHD = {
            ...hoadon,
            tongTienHangChuaChietKhau: tongTienHangChuaCK,
            tongChietKhauHangHoa: tongChietKhau,
            tongTienHang: tongTienHang,
            tongTienThue: tongThueChiTiet,
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

        setPropMauIn((old: any) => {
            return {
                ...old,
                // contentHtml: content,
                hoadon: dataHD,
                khachhang: { ...customerChosed },
                hoadonChiTiet: [...hoaDonChiTiet],
                chinhanh: {
                    tenChiNhanh: 'CTCP SSOFT VIỆT NAM',
                    soDienThoai: '0973474985',
                    logo: logo
                }
            };
        });
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
                        dbDexie.hoaDon.add(dataHD);
                    }
                });
        }
    };

    useEffect(() => {
        if (!afterRender.current) return;
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
            soLuong: 1,
            expanded: true
        });
        console.log('newCT ', newCT);

        const checkCT = hoaDonChiTiet.filter((x) => x.idDonViQuyDoi === item.idDonViQuyDoi);
        if (checkCT.length === 0) {
            setHoaDonChiTiet((olds: any) => {
                return [newCT, ...olds];
            });
        } else {
            newCT.id = checkCT[0].id; // get ID old --> check update nvThucHien + chietkhau
            newCT.soLuong = checkCT[0].soLuong + 1;
            newCT.nhanVienThucHien = checkCT[0].nhanVienThucHien;

            // remove & unshift but keep infor old cthd
            const arrOld = hoaDonChiTiet?.filter((x) => x.idDonViQuyDoi !== item.idDonViQuyDoi);
            setHoaDonChiTiet((olds: any) => {
                return [newCT, ...arrOld];
            });
        }
        setCTHDDoing(newCT);
    };

    // auto update cthd
    useEffect(() => {
        if (!afterRender.current) return;
        Update_HoaDonChiTiet();
        UpdateHoaHongDichVu_forNVThucHien();
    }, [cthdDoing]);

    const UpdateHoaHongDichVu_forNVThucHien = () => {
        // update for all nvth thuoc ctDoing
        setHoaDonChiTiet(
            hoaDonChiTiet.map((x) => {
                if (x.id === cthdDoing.id) {
                    return {
                        ...x,
                        nhanVienThucHien: x.nhanVienThucHien?.map((nv) => {
                            if (nv.ptChietKhau > 0) {
                                return {
                                    ...nv,
                                    tienChietKhau: (nv.ptChietKhau * (x.thanhTienSauCK ?? 0)) / 100
                                };
                            } else {
                                return {
                                    ...nv,
                                    tienChietKhau: (nv.chietKhauMacDinh ?? 0) * x.soLuong
                                };
                            }
                        })
                    };
                } else {
                    return x;
                }
            })
        );
    };

    const Update_HoaDonChiTiet = () => {
        setHoaDonChiTiet(
            hoaDonChiTiet.map((x) => {
                if (x.id === cthdDoing.id) {
                    return {
                        ...x,
                        tienChietKhau:
                            (x.pTChietKhau ?? 0) > 0
                                ? (x.donGiaTruocCK * (x.pTChietKhau ?? 0)) / 100
                                : x.tienChietKhau,
                        tienThue:
                            (x.pTThue ?? 0) > 0
                                ? ((x.donGiaSauCK ?? 0) * (x.pTThue ?? 0)) / 100
                                : x.tienThue
                    };
                } else {
                    return x;
                }
            })
        );
    };

    const showPopNhanVienThucHien = (item: HoaDonChiTietDto) => {
        setPropNVThucHien((old) => {
            return { ...old, isShow: true, isNew: true, item: item, id: item.id };
        });
    };
    const AgreeNVThucHien = (lstNVChosed: any) => {
        // update cthd + save to cache
        setHoaDonChiTiet(
            hoaDonChiTiet.map((x) => {
                if (propNVThucHien.item.id === x.id) {
                    return { ...x, nhanVienThucHien: lstNVChosed };
                } else {
                    return x;
                }
            })
        );
    };
    const RemoveNVThucHien = (cthd: any, nv: any) => {
        setHoaDonChiTiet(
            hoaDonChiTiet.map((x) => {
                if (x.id === cthd.id) {
                    return {
                        ...x,
                        nhanVienThucHien: x.nhanVienThucHien?.filter(
                            (nvth) => nvth.idNhanVien !== nv.idNhanVien
                        )
                    };
                } else {
                    return x;
                }
            })
        );
    };

    // modal chitiet giohang
    const showPopChiTietGioHang = (item: HoaDonChiTietDto) => {
        setTriggerModalEditGioHang((old) => {
            return { ...old, isShow: true, isNew: true, item: item, id: item.id };
        });
    };
    const AgreeGioHang = (ctUpdate: PageHoaDonChiTietDto) => {
        // update cthd + save to cache
        setHoaDonChiTiet(
            hoaDonChiTiet.map((item: any, index: number) => {
                if (item.id === ctUpdate.id) {
                    return {
                        ...item,
                        soLuong: ctUpdate.soLuong,
                        donGiaTruocCK: ctUpdate.donGiaTruocCK,
                        pTChietKhau: ctUpdate.pTChietKhau,
                        tienChietKhau: ctUpdate.tienChietKhau,
                        donGiaSauCK: ctUpdate.donGiaSauCK,
                        donGiaSauVAT: ctUpdate.donGiaSauVAT,
                        thanhTienTruocCK: ctUpdate.thanhTienTruocCK,
                        thanhTienSauCK: ctUpdate.thanhTienSauCK,
                        thanhTienSauVAT: ctUpdate.thanhTienSauVAT
                    };
                } else {
                    return item;
                }
            })
        );
    };

    // end modal chi tiet

    const RemoveCache = async () => {
        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon.id)
            .delete()
            .then((deleteCount: any) =>
                console.log('idhoadondelete ', hoadon.id, 'deletecount', deleteCount)
            );
        await dbDexie.khachCheckIn
            .where('idCheckIn')
            .equals(customerChosed.idCheckIn)
            .delete()
            .then((deleteCount: any) =>
                console.log(
                    'idcheckindelete ',
                    customerChosed.idCheckIn,
                    'deletecount',
                    deleteCount
                )
            );
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });

    const checkSave = async () => {
        if (hoaDonChiTiet.length === 0) {
            setObjAlert({
                show: true,
                type: 2,
                mes: 'Vui lòng nhập chi tiết hóa đơn '
            });
            return false;
        }
        return true;
    };

    const saveHoaDon = async () => {
        if (clickSSave) return; // avoid click douple
        setClickSave(true);

        const check = await checkSave();
        if (!check) {
            return;
        }

        const hodaDonDB = await HoaDonService.CreateHoaDon(hoadon);

        //checkout + insert tbl checkin_hoadon
        await CheckinService.UpdateTrangThaiCheckin(customerChosed.idCheckIn, 2);
        await CheckinService.InsertCheckInHoaDon({
            idCheckIn: customerChosed.idCheckIn,
            idHoaDon: hodaDonDB.id
        });

        // save soquy (todo POS, ChuyenKhoan)
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
        await SoQuyServices.CreateQuyHoaDon(quyHD); // todo hoahong NV hoadon

        setObjAlert({
            show: true,
            type: 1,
            mes: 'Thanh toán hóa đơn thành công'
        });

        // print
        setPropMauIn((old: any) => {
            return {
                ...old,
                hoadon: {
                    ...old.hoadon,
                    maHoaDon: hodaDonDB.maHoaDon,
                    daThanhToan: quyHD.tongTienThu // why not get daThanhToan
                }
            };
        });
        handlePrint();

        // reset after save
        setClickSave(false);

        setHoaDonChiTiet([]);
        setHoaDon(new PageHoaDonDto({ idKhachHang: null }));
        await RemoveCache();
    };
    const [layout, setLayout] = useState(false);
    const handleLayoutToggle = () => {
        setLayout(!layout);
    };

    return (
        <>
            <ModelNhanVienThucHien triggerModal={propNVThucHien} handleSave={AgreeNVThucHien} />
            <ModalEditChiTietGioHang
                trigger={triggerModalEditGioHang}
                dataNhanVien={allNhanVien}
                handleSave={AgreeGioHang}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>

            <div style={{ display: 'none' }}>
                <MauInHoaDon ref={componentRef} props={propMauIn} />
            </div>
            <Grid
                container
                spacing={3}
                marginTop="21px"
                paddingLeft="2.2222222222222223vw"
                paddingBottom="24px"
                sx={{
                    '& > div': {
                        paddingTop: '0!important'
                    }
                }}>
                <Grid item container md={8} spacing={3} marginTop={layout ? '-60px' : '-24px'}>
                    {layout && (
                        <TextField
                            fullWidth
                            sx={{
                                backgroundColor: '#fff',
                                borderColor: '#CFD3D4!important',
                                borderWidth: '1px!important',
                                maxWidth: '60%',
                                boxShadow: ' 0px 20px 100px 0px #0000000D',

                                marginLeft: 'auto'
                            }}
                            size="small"
                            className="search-field"
                            variant="outlined"
                            type="search"
                            placeholder="Tìm kiếm"
                            value={txtSearch}
                            onChange={(event) => {
                                setTxtSearch(event.target.value);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    )}
                    <Grid item md={5} lg={layout ? 12 : 5}>
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                boxShadow: ' 0px 20px 100px 0px #0000000D',
                                padding: '16px 24px',
                                height: '100%',
                                overflowX: 'hidden',
                                maxHeight: '77vh',
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '7px'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    bgcolor: 'rgba(0,0,0,0.1)',
                                    borderRadius: '8px'
                                }
                            }}>
                            <Box>
                                <Typography
                                    variant="h3"
                                    fontSize="18px"
                                    color="#4C4B4C"
                                    fontWeight="700"
                                    onClick={() => choseLoaiHang(2)}>
                                    Nhóm dịch vụ
                                </Typography>
                                <List
                                    sx={{
                                        display: layout ? 'flex' : 'block',
                                        columnGap: '12px',
                                        flexWrap: layout ? 'nowrap' : 'wrap',
                                        overflowX: 'auto',
                                        '&::-webkit-scrollbar': {
                                            width: '7px',
                                            height: '7px'
                                        },
                                        '&::-webkit-scrollbar-thumb:horizontal': {
                                            bgcolor: 'rgba(0,0,0,0.1)',
                                            borderRadius: '8px'
                                        }
                                    }}>
                                    {nhomDichVu.map((nhomDV, index) => (
                                        <ListItem
                                            key={index}
                                            onClick={() => choseNhomDichVu(nhomDV)}
                                            sx={{
                                                gap: '6px',
                                                padding: '10px',
                                                overflow: 'hidden',
                                                backgroundColor: nhomDV.color,
                                                borderRadius: '8px',
                                                marginTop: '12px',
                                                cursor: 'pointer',
                                                transition: '.4s',
                                                minWidth: layout ? '200px' : 'unset',
                                                position: 'relative',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    height: '100%',
                                                    width: '100%',
                                                    left: '0',
                                                    bottom: '0',
                                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                                    zIndex: '0',
                                                    opacity: '0',
                                                    transition: '.4s'
                                                },
                                                '&:hover::after': {
                                                    opacity: '1'
                                                }
                                            }}>
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: '0',
                                                    position: 'relative',
                                                    zIndex: '2'
                                                }}>
                                                <IconDv style={{ color: '#F1FAFF' }} />
                                            </ListItemIcon>
                                            <ListItemText
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        color: '#F1FAFF',
                                                        whiteSpace: 'nowrap',
                                                        width: '100%',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        fontWeight: '700',
                                                        position: 'relative',
                                                        zIndex: '2'
                                                    }
                                                }}
                                                title={nhomDV.tenNhomHang}>
                                                {nhomDV.tenNhomHang}
                                            </ListItemText>
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
                                    marginTop="12px"
                                    onClick={() => choseLoaiHang(1)}>
                                    Sản phẩm
                                </Typography>
                                <List
                                    sx={{
                                        display: layout ? 'flex' : 'block',
                                        columnGap: '12px',
                                        flexWrap: layout ? 'nowrap' : 'wrap',
                                        overflowX: 'auto',
                                        '&::-webkit-scrollbar': {
                                            width: '7px',
                                            height: '7px'
                                        },
                                        '&::-webkit-scrollbar-thumb:horizontal': {
                                            bgcolor: 'rgba(0,0,0,0.1)',
                                            borderRadius: '8px'
                                        }
                                    }}>
                                    {nhomHangHoa.map((nhomHH, index) => (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                gap: '6px',
                                                padding: '10px',
                                                borderWidth: '1px',
                                                borderStyle: 'solid',
                                                bgcolor: nhomHH.color,
                                                borderRadius: '8px',
                                                marginTop: '12px',
                                                minWidth: layout ? '200px' : 'unset',
                                                cursor: 'pointer',
                                                transition: '.4s',
                                                position: 'relative',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    height: '100%',
                                                    width: '100%',
                                                    left: '0',
                                                    bottom: '0',
                                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                                    zIndex: '0',
                                                    opacity: '0',
                                                    transition: '.4s'
                                                },
                                                '&:hover::after': {
                                                    opacity: '1'
                                                }
                                            }}
                                            onClick={() => choseNhomDichVu(nhomHH)}>
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: '0',
                                                    position: 'relative',
                                                    zIndex: '2'
                                                }}>
                                                <IconDv style={{ color: '#F1FAFF' }} />
                                            </ListItemIcon>
                                            <ListItemText
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        color: '#F1FAFF',
                                                        whiteSpace: 'nowrap',
                                                        width: '100%',
                                                        fontWeight: '700',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        position: 'relative',
                                                        zIndex: '2'
                                                    }
                                                }}
                                                title={nhomHH.tenNhomHang}>
                                                {nhomHH.tenNhomHang}
                                            </ListItemText>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item md={7} lg={layout ? 12 : 7} sx={{ marginTop: '-58px' }}>
                        <Box display="flex" flexDirection="column">
                            {!layout && (
                                <TextField
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#fff',
                                        borderColor: '#CFD3D4!important',
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
                                    value={txtSearch}
                                    onChange={(event) => {
                                        setTxtSearch(event.target.value);
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                            <Box
                                display="flex"
                                flexDirection="column"
                                gap="24px"
                                padding="16px"
                                marginTop="16px"
                                sx={{
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    maxHeight: '77vh',
                                    overflowX: 'hidden',
                                    overflowY: 'auto',
                                    '&::-webkit-scrollbar': {
                                        width: '7px'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        bgcolor: 'rgba(0,0,0,0.1)',
                                        borderRadius: '8px'
                                    }
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
                                                        minHeight="104px"
                                                        padding="8px 12px 9px 12px"
                                                        display="flex"
                                                        flexDirection="column"
                                                        justifyContent="space-between"
                                                        gap="16px"
                                                        borderRadius="4px"
                                                        sx={{
                                                            border: '1px solid transparent',
                                                            cursor: 'pointer',
                                                            transition: '.4s',
                                                            backgroundColor: '#F2EBF0',
                                                            '&:hover': {
                                                                borderColor: '#7C3367'
                                                            }
                                                        }}
                                                        onClick={() => {
                                                            choseChiTiet(item, index);
                                                        }}>
                                                        <Typography
                                                            variant="h5"
                                                            fontSize="12px"
                                                            fontWeight="700"
                                                            color="#333233"
                                                            title={item.tenHangHoa}
                                                            sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitBoxOrient: 'vertical',
                                                                WebkitLineClamp: 2,
                                                                maxHeight: '32px'
                                                            }}>
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
                </Grid>
                <Grid item md={4} sx={{ marginTop: '-74px' }}>
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            height: '100%',
                            maxHeight: '86vh',
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            padding: '24px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            '&::-webkit-scrollbar': {
                                width: '7px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                bgcolor: 'rgba(0,0,0,0.1)',
                                borderRadius: '8px'
                            }
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
                                <Button sx={{ marginLeft: 'auto' }} onClick={handleLayoutToggle}>
                                    <img
                                        src={dotIcon}
                                        style={{
                                            filter: 'brightness(0) saturate(100%) invert(11%) sepia(2%) saturate(2336%) hue-rotate(295deg) brightness(93%) contrast(94%)'
                                        }}
                                    />
                                </Button>
                            </Box>
                        </Box>
                        {/* 1 row chi tiet */}
                        {hoaDonChiTiet?.map((ct: any, index) => (
                            <Box
                                padding="12px"
                                borderRadius="8px"
                                border="1px solid #F2F2F2"
                                marginTop="24px"
                                key={index}>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center">
                                    <Box width="100%">
                                        <Typography
                                            variant="body1"
                                            fontSize="16px"
                                            color="#7C3367"
                                            fontWeight="400"
                                            lineHeight="24px"
                                            sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: '1',
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                            title={ct.tenHangHoa}>
                                            {ct.tenHangHoa}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <Typography
                                            color="#000"
                                            variant="body1"
                                            fontSize="16px"
                                            fontWeight="400"
                                            sx={{ display: 'flex', gap: '8px' }}
                                            onClick={() => showPopChiTietGioHang(ct)}>
                                            <span> {ct.soLuong + 'x'} </span>
                                            <span> {Utils.formatNumber(ct.donGiaSauCK)}</span>
                                        </Typography>
                                        <Box
                                            sx={{
                                                marginLeft: '8px',
                                                display: 'flex',
                                                gap: '10px'
                                            }}>
                                            <Button
                                                sx={{
                                                    minWidth: '0',
                                                    padding: '0',
                                                    '&:hover': {
                                                        filter: ' brightness(0) saturate(100%) invert(25%) sepia(16%) saturate(2588%) hue-rotate(267deg) brightness(96%) contrast(88%)'
                                                    }
                                                }}
                                                onClick={() => showPopNhanVienThucHien(ct)}>
                                                <UserIcon style={{ cursor: 'pointer' }} />
                                            </Button>
                                            <Button
                                                sx={{
                                                    minWidth: '0',
                                                    padding: '0',
                                                    '&:hover svg': {
                                                        filter: 'brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(3282%) hue-rotate(337deg) brightness(85%) contrast(105%)'
                                                    }
                                                }}>
                                                <DeleteIcon
                                                    style={{
                                                        cursor: 'pointer',
                                                        color: '#999699'
                                                    }}
                                                    onClick={() => {
                                                        deleteChiTietHoaDon(ct);
                                                    }}
                                                />
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                                {/* nhan vien thuc hien */}

                                {ct.nhanVienThucHien.length > 0 && (
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        flexWrap="wrap"
                                        gap="8px"
                                        mt="8px">
                                        <Typography
                                            variant="body2"
                                            fontSize="12px"
                                            color="#666466"
                                            lineHeight="16px">
                                            Nhân viên :
                                        </Typography>
                                        {ct.nhanVienThucHien.map((nv: any, index3: any) => (
                                            <Typography
                                                variant="body1"
                                                fontSize="12px"
                                                lineHeight="16px"
                                                color="#4C4B4C"
                                                display="flex"
                                                alignItems="center"
                                                sx={{
                                                    backgroundColor: '#F2EBF0',
                                                    padding: '4px 8px',
                                                    gap: '10px',
                                                    borderRadius: '100px',
                                                    '& .remove-NV:hover img': {
                                                        filter: 'brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(3282%) hue-rotate(337deg) brightness(85%) contrast(105%)'
                                                    },
                                                    flexGrow: '1',
                                                    width: 'calc(50% - 69px)'
                                                }}
                                                key={index3}>
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden'
                                                    }}
                                                    title={nv.tenNhanVien}>
                                                    {nv.tenNhanVien}
                                                </Box>
                                                <span
                                                    className="remove-NV"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => RemoveNVThucHien(ct, nv)}>
                                                    <img src={closeIcon} alt="close" />
                                                </span>
                                            </Typography>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        ))}
                        <Box marginTop="auto">
                            <Box pt="24px">
                                <Typography
                                    variant="h3"
                                    color="#333233"
                                    fontSize="14px"
                                    fontWeight="500"
                                    mb="8px">
                                    Mã giảm giá
                                </Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Nhập mã"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VoucherIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <Button
                                                variant="text"
                                                sx={{
                                                    padding: '0',
                                                    transition: '.4s',
                                                    bgcolor: 'transparent!important',
                                                    color: '#4C4B4C',
                                                    '&:hover': {
                                                        color: '#7C3367'
                                                    }
                                                }}>
                                                Áp dụng
                                            </Button>
                                        )
                                    }}
                                    sx={{ '& input': { fontSize: '14px' } }}
                                />
                            </Box>
                            <Box borderTop="1px solid #F2F2F2" marginY="16px"></Box>
                            <Box>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="16px"
                                    pt="16px"
                                    pb="32px"
                                    borderRadius="12px"
                                    paddingX="16px"
                                    bgcolor="#F9F9F9">
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="h6" fontSize="14px" color="#3B4758">
                                            Tổng tiền hàng
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            fontSize="12px"
                                            color="#3B4758">
                                            {Utils.formatNumber(hoadon.tongTienHangChuaChietKhau)}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="h6" fontSize="14px" color="#3B4758">
                                            Giảm giá
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            fontSize="12px"
                                            color="#3B4758">
                                            {Utils.formatNumber(hoadon.tongChietKhauHangHoa)}
                                        </Typography>
                                    </Box>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        borderBottom="1px solid #CBADC2"
                                        pb="8px">
                                        <Typography variant="h6" fontSize="14px" color="#3B4758">
                                            Tổng giảm giá
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            fontSize="12px"
                                            color="#3B4758">
                                            {Utils.formatNumber(hoadon.tongChietKhauHangHoa)}
                                        </Typography>
                                    </Box>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        mt="8px">
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
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: '#fff',
                                        textTransform: 'unset!important',
                                        backgroundColor: '#7C3367!important',
                                        paddingY: '12px',
                                        mt: '24px'
                                    }}
                                    className="btn-container-hover"
                                    onClick={saveHoaDon}>
                                    Thanh Toán
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};
export default PageBanHang;
