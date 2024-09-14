import {
    Stack,
    Button,
    Typography,
    Avatar,
    Grid,
    debounce,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    IconButton,
    CircularProgress
} from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useEffect, useRef, useState } from 'react';
import GroupProductService from '../../../services/product/GroupProductService';
import {
    IHangHoaGroupTheoNhomDto,
    ModelHangHoaDto,
    ModelNhomHangHoa,
    PagedProductSearchDto
} from '../../../services/product/dto';
import { IList } from '../../../services/dto/IList';
import ProductService from '../../../services/product/ProductService';
import khachHangService from '../../../services/khach-hang/khachHangService';
import { Guid } from 'guid-typescript';
import { CreateOrEditKhachHangDto } from '../../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import PageHoaDonChiTietDto from '../../../services/ban_hang/PageHoaDonChiTietDto';
import HoaDonChiTietDto from '../../../services/ban_hang/HoaDonChiTietDto';
import { NumericFormat } from 'react-number-format';
import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import PaymentsForm from './Payment';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import CreateOrEditCustomerDialog from '../../customer/components/create-or-edit-customer-modal';

import utils from '../../../utils/utils';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
import QuyChiTietDto from '../../../services/so_quy/QuyChiTietDto';
import { HINH_THUC_THANH_TOAN, LoaiChungTu, TrangThaiCheckin } from '../../../lib/appconst';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';
import nhatKyHoatDongService from '../../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import { CreateNhatKyThaoTacDto } from '../../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import { format } from 'date-fns';
import HoaDonDto from '../../../services/ban_hang/HoaDonDto';
import MenuWithDataFromDB from '../../../components/Menu/MenuWithData_fromDB';
import { TypeSearchfromDB } from '../../../enum/TypeSearch_fromDB';
import { KhachHangDto } from '../../../services/khach-hang/dto/KhachHangDto';
import { dbDexie } from '../../../lib/dexie/dexieDB';
import CheckinService from '../../../services/check_in/CheckinService';
import { KHCheckInDto } from '../../../services/check_in/CheckinDto';
import TrangThaiBooking from '../../../enum/TrangThaiBooking';

export type IPropsPageThuNgan = {
    txtSearch: string;
    loaiHoaDon: number;
    customerIdChosed: string;
    idChiNhanhChosed: string;

    idCheckIn?: string;
    arrIdNhomHangFilter?: string[];
    onSetActiveTabLoaiHoaDon: (idLoaiChungTu: number) => void;
};

export default function PageThuNgan(props: IPropsPageThuNgan) {
    const {
        txtSearch,
        loaiHoaDon,
        customerIdChosed,
        idChiNhanhChosed,
        idCheckIn,
        arrIdNhomHangFilter,
        onSetActiveTabLoaiHoaDon
    } = props;
    const firstLoad = useRef(true);
    const firstLoad_changeLoaiHD = useRef(true);
    const [anchorDropdownCustomer, setAnchorDropdownCustomer] = useState<null | HTMLElement>(null);
    const expandSearchCus = Boolean(anchorDropdownCustomer);

    const [isSavingHoaDon, setIsSavingHoaDon] = useState(false);
    const [isThanhToanTienMat, setIsThanhToanTienMat] = useState(true);
    const [sumTienKhachTra, setSumTienKhachTra] = useState(0);
    const [tienThuaTraKhach, setTienThuaTraKhach] = useState(0);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [arrIdNhomHangChosed, setArrIdNhomHangChosed] = useState<string[]>([]);
    const [nhomHangHoaChosed, setNhomHangHoaChosed] = useState<ModelNhomHangHoa[]>([]);
    const [listProduct, setListProduct] = useState<IHangHoaGroupTheoNhomDto[]>([]);
    const [isShowModalAddCus, setIsShowModalAddCus] = useState(false);
    const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);
    const [customerChosed, setCustomerChosed] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);
    const [hoaDonChiTiet, setHoaDonChiTiet] = useState<PageHoaDonChiTietDto[]>([]);
    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(
        new PageHoaDonDto({
            idKhachHang: null,
            idLoaiChungTu: LoaiChungTu.HOA_DON_BAN_LE,
            tenKhachHang: 'Khách lẻ',
            idChiNhanh: idChiNhanhChosed
        })
    );
    const [cthdDoing, setCTHDDoing] = useState<PageHoaDonChiTietDto>(
        new PageHoaDonChiTietDto({ id: '', expanded: false })
    );

    const [confirmDialog, setConfirmDialog] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    const GetListNhomHangHoa_byId = async (arrIdNhomHangFilter: string[]) => {
        const list = await GroupProductService.GetListNhomHangHoa_byId(arrIdNhomHangFilter);
        setNhomHangHoaChosed(list);
    };

    const BoChon1NhomHang = (idNhomHang: string) => {
        setArrIdNhomHangChosed(arrIdNhomHangChosed?.filter((x) => x !== idNhomHang));
    };
    const BoChonAllNhomHang = () => {
        setArrIdNhomHangChosed([]);
    };

    const getListHangHoa_groupbyNhom = async (txtSearch: string) => {
        const input = {
            IdNhomHangHoas: [],
            TextSearch: txtSearch,
            IdLoaiHangHoa: 0, // all
            CurrentPage: 0,
            PageSize: 50
        } as PagedProductSearchDto;
        const data = await ProductService.GetDMHangHoa_groupByNhom(input);
        setListProduct(data);
    };

    const getListHangHoa_groupbyNhom_filterNhom = async (arrIdNhomHang: string[]) => {
        const input = {
            IdNhomHangHoas: arrIdNhomHang,
            TextSearch: txtSearch,
            IdLoaiHangHoa: 0, // all
            CurrentPage: 0,
            PageSize: 50
        } as PagedProductSearchDto;
        const data = await ProductService.GetDMHangHoa_groupByNhom(input);
        setListProduct(data);
    };

    useEffect(() => {
        setArrIdNhomHangChosed(arrIdNhomHangFilter ?? []);
    }, [arrIdNhomHangFilter]);

    useEffect(() => {
        GetListNhomHangHoa_byId(arrIdNhomHangChosed ?? []);
        getListHangHoa_groupbyNhom_filterNhom(arrIdNhomHangChosed ?? []);
    }, [arrIdNhomHangChosed]);

    const GetInforCustomer_byId = async (cusId: string) => {
        const customer = await khachHangService.getKhachHang(cusId);
        setCustomerChosed(customer);
    };

    const InitData_forHoaDon = async (idKhachHang: string, idChiNhanh: string, idCheckIn: string) => {
        console.log('idKhachHang', idKhachHang, 'idChiNhanh ', idChiNhanh, 'idCheckIn ', idCheckIn);
        const hdCache = await dbDexie.hoaDon.where('idCheckIn').equals(idCheckIn).toArray();
        if (hdCache?.length > 0) {
            setHoaDon({
                ...hdCache[0]
            });
            setHoaDonChiTiet([...(hdCache[0]?.hoaDonChiTiet ?? [])]);
            onSetActiveTabLoaiHoaDon(hdCache[0]?.idLoaiChungTu ?? LoaiChungTu.HOA_DON_BAN_LE);
        } else {
            onSetActiveTabLoaiHoaDon(LoaiChungTu.HOA_DON_BAN_LE);

            setHoaDon({
                ...hoadon,
                idKhachHang: idKhachHang,
                idChiNhanh: idChiNhanh,
                idLoaiChungTu: LoaiChungTu.HOA_DON_BAN_LE,
                idCheckIn: idCheckIn
            });
            // add to cache if not exists
            const dataHD: PageHoaDonDto = {
                ...hoadon,
                idKhachHang: idKhachHang,
                idChiNhanh: idChiNhanh,
                idLoaiChungTu: LoaiChungTu.HOA_DON_BAN_LE,
                idCheckIn: idCheckIn
            };
            await dbDexie.hoaDon.add(dataHD);
        }
    };

    const ChangeLoaiHoaDon = async (loaiHoaDon: number) => {
        setHoaDon({ ...hoadon, idLoaiChungTu: loaiHoaDon });

        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o) => (o.idLoaiChungTu = loaiHoaDon));
    };

    useEffect(() => {
        // firstload: auto set loaiHoadon = HOA_DON_BAN_LE
        InitData_forHoaDon(customerIdChosed, idChiNhanhChosed, idCheckIn ?? Guid.EMPTY);
    }, [idChiNhanhChosed, idCheckIn, customerIdChosed]);

    useEffect(() => {
        // update loaiHoaDon if change tab
        if (firstLoad_changeLoaiHD.current) {
            firstLoad_changeLoaiHD.current = false;
            return;
        }
        ChangeLoaiHoaDon(loaiHoaDon);
    }, [loaiHoaDon]);

    useEffect(() => {
        GetInforCustomer_byId(customerIdChosed);
    }, [customerIdChosed]);

    // useEffect(() => {
    //     // change at main_page
    //     console.log('changeloaiHD ', loaiHoaDon, idChiNhanhChosed);
    //     setHoaDon({ ...hoadon, idChiNhanh: idChiNhanhChosed, idLoaiChungTu: loaiHoaDon as number });
    // }, [loaiHoaDon, idChiNhanhChosed]);

    const PageLoad = () => {
        //
    };

    const cthd_SumThanhTienTruocCK = hoaDonChiTiet?.reduce((prevValue: number, item: PageHoaDonChiTietDto) => {
        return (item?.thanhTienTruocCK ?? 0) + prevValue;
    }, 0);
    const cthd_SumTienChietKhau = hoaDonChiTiet?.reduce((prevValue: number, item: PageHoaDonChiTietDto) => {
        return (item?.tienChietKhau ?? 0) * item.soLuong + prevValue;
    }, 0);
    const cthd_SumTienThue = hoaDonChiTiet?.reduce((prevValue: number, item: PageHoaDonChiTietDto) => {
        return (item?.tienThue ?? 0) * item.soLuong + prevValue;
    }, 0);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        console.log('changeCTHD ', idCheckIn);
        // change cthd --> update hoadon
        const sumThanhTienSauCK = cthd_SumThanhTienTruocCK - cthd_SumTienChietKhau;
        const sumThanhTienSauVAT = sumThanhTienSauCK - cthd_SumTienThue;
        setSumTienKhachTra(sumThanhTienSauVAT);
        setTienThuaTraKhach(0);
        setHoaDon({
            ...hoadon,
            tongTienHangChuaChietKhau: cthd_SumThanhTienTruocCK,
            tongChietKhauHangHoa: cthd_SumTienChietKhau,
            tongTienHang: sumThanhTienSauCK,
            tongTienHDSauVAT: sumThanhTienSauVAT,
            tongThanhToan: sumThanhTienSauVAT - (hoadon?.tongGiamGiaHD ?? 0)
        });
        dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => {
                o.tongTienHangChuaChietKhau = cthd_SumThanhTienTruocCK;
                o.tongChietKhauHangHoa = cthd_SumTienChietKhau;
                o.tongTienHang = sumThanhTienSauCK;
                o.tongTienHDSauVAT = sumThanhTienSauVAT;
                o.tongThanhToan = sumThanhTienSauVAT - (hoadon?.tongGiamGiaHD ?? 0);
            });
    }, [cthd_SumThanhTienTruocCK, cthd_SumTienChietKhau, cthd_SumTienThue]);

    useEffect(() => {
        PageLoad();
    }, []);

    // only used when change textsearch
    const debounceSearchHangHoa = useRef(
        debounce(async (txtSearch: string) => {
            getListHangHoa_groupbyNhom(txtSearch);
        }, 500)
    ).current;

    useEffect(() => {
        debounceSearchHangHoa(txtSearch);
    }, [txtSearch]);

    const removeCTHD = async (item: HoaDonChiTietDto) => {
        setHoaDonChiTiet(hoaDonChiTiet?.filter((x) => x?.idDonViQuyDoi !== item?.idDonViQuyDoi));
        const cthd = hoaDonChiTiet?.filter((x) => x?.idDonViQuyDoi !== item?.idDonViQuyDoi);
        await UpdateCTHD_toCache([...cthd]);
    };

    const choseProduct = (item: ModelHangHoaDto) => {
        let cthdLast: PageHoaDonChiTietDto[] = [];
        const newCT = new PageHoaDonChiTietDto({
            idDonViQuyDoi: item?.idDonViQuyDoi as unknown as undefined,
            maHangHoa: item?.maHangHoa,
            tenHangHoa: item?.tenHangHoa,
            giaBan: item?.giaBan as undefined,
            idNhomHangHoa: item?.idNhomHangHoa as undefined,
            idHangHoa: item?.id as undefined,
            soLuong: 1,
            expanded: false
        });
        const itemCTHD = hoaDonChiTiet?.filter((x) => x.idDonViQuyDoi === item.idDonViQuyDoi);
        if (itemCTHD?.length > 0) {
            const slNew = itemCTHD[0].soLuong + 1;
            newCT.id = itemCTHD[0].id;
            newCT.soLuong = slNew;
            newCT.giaBan = itemCTHD[0]?.giaBan ?? 0;
            newCT.ptChietKhau = itemCTHD[0]?.ptChietKhau ?? 0;
            newCT.ptThue = itemCTHD[0]?.ptThue ?? 0;
            if (newCT.ptChietKhau > 0) {
                newCT.tienChietKhau = (newCT.ptChietKhau * newCT.giaBan) / 100;
            } else {
                newCT.tienChietKhau = itemCTHD[0]?.tienChietKhau ?? 0;
            }
            if (newCT.ptThue > 0) {
                newCT.tienThue = (newCT.ptThue * (newCT?.donGiaSauCK ?? 0)) / 100;
            } else {
                newCT.tienThue = itemCTHD[0]?.tienChietKhau ?? 0;
            }

            // remove & add again
            const arr = hoaDonChiTiet?.filter((x) => x.idDonViQuyDoi !== item.idDonViQuyDoi);
            setHoaDonChiTiet([newCT, ...arr]);

            cthdLast = [newCT, ...arr];
            //UpdateHoaHongDichVu_forNVThucHien(newCT.id, newCT?.thanhTienSauCK ?? 0);
        } else {
            setHoaDonChiTiet([newCT, ...hoaDonChiTiet]);
            cthdLast = [newCT, ...hoaDonChiTiet];
        }
        UpdateCTHD_toCache(cthdLast);
    };

    const UpdateCTHD_toCache = async (cthdNew: PageHoaDonChiTietDto[]) => {
        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => (o.hoaDonChiTiet = cthdNew));
    };

    const UpdateHoaHongDichVu_forNVThucHien = (idCTHD: string, thanhTienSauCK: number) => {
        setHoaDonChiTiet(
            hoaDonChiTiet.map((x) => {
                if (x.id === idCTHD) {
                    return {
                        ...x,
                        nhanVienThucHien: x.nhanVienThucHien?.map((nv) => {
                            if (nv.ptChietKhau > 0) {
                                return {
                                    ...nv,
                                    tienChietKhau: (nv.ptChietKhau * thanhTienSauCK) / 100
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

    const changeCustomer_fromModalAdd = async (customer?: KhachHangDto) => {
        setIsShowModalAddCus(false);
        if (customer) {
            setCustomerChosed({
                ...customerChosed,
                id: customer?.id?.toString(),
                maKhachHang: customer?.maKhachHang,
                tenKhachHang: customer?.tenKhachHang ?? 'Khách lẻ',
                soDienThoai: customer?.soDienThoai ?? ''
            });

            const idCheckin = await InsertCustomer_toCheckIn(customer?.id?.toString());

            setHoaDon({ ...hoadon, idKhachHang: customer?.id?.toString(), idCheckIn: idCheckin });

            await dbDexie.hoaDon
                .where('id')
                .equals(hoadon?.id)
                .modify((o: PageHoaDonDto) => {
                    o.idKhachHang = customer?.id?.toString();
                    o.idCheckIn = idCheckin;
                });
        }
    };

    const InsertCustomer_toCheckIn = async (customerId: string): Promise<string> => {
        const objCheckInNew: KHCheckInDto = {
            id: Guid.EMPTY,
            idKhachHang: customerId,
            dateTimeCheckIn: hoadon?.ngayLapHoaDon,
            idChiNhanh: idChiNhanhChosed,
            trangThai: TrangThaiCheckin.DOING,
            ghiChu: ''
        };
        const dataCheckIn = await CheckinService.InsertCustomerCheckIn(objCheckInNew);
        return dataCheckIn.id;
    };

    const changeCustomer = async (item: IList) => {
        setAnchorDropdownCustomer(null);
        setCustomerChosed({
            ...customerChosed,
            id: item?.id,
            maKhachHang: item?.text, // todo makhachhang
            tenKhachHang: item?.text ?? 'Khách lẻ',
            soDienThoai: item?.text2 ?? ''
        });

        const idCheckin = await InsertCustomer_toCheckIn(item?.id ?? Guid.EMPTY);

        setHoaDon({ ...hoadon, idKhachHang: item?.id, idCheckIn: idCheckin });

        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => {
                o.idKhachHang = item?.id;
                o.idCheckIn = idCheckin;
            });
    };

    const AgreeChangeRemoveCustomer = async () => {
        setConfirmDialog({ ...confirmDialog, show: false });
        setHoaDon({ ...hoadon, idKhachHang: null });
        setCustomerChosed({
            ...customerChosed,
            id: Guid.EMPTY,
            maKhachHang: 'KL', // todo makhachhang
            tenKhachHang: 'Khách lẻ',
            soDienThoai: ''
        });
        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => (o.idKhachHang = null));
    };

    const RemoveCustomer = async () => {
        // if (!utils.checkNull_OrEmpty(hoadon?.idCheckIn)) {
        //     setConfirmDialog({
        //         ...confirmDialog,
        //         show: true,
        //         mes: 'Khách hàng đang check in. Bạn có chắc chắn muốn thay đổi khách hàng không?',
        //         title: 'Xác nhận hủy'
        //     });
        //     return;
        // }
        await AgreeChangeRemoveCustomer();
    };

    const showModalAddCustomer = () => {
        setIsShowModalAddCus(true);
        setNewCus({
            ...newCus,
            id: Guid.EMPTY,
            maKhachHang: '',
            tenKhachHang: '',
            soDienThoai: '',
            diaChi: '',
            idNhomKhach: '',
            idNguonKhach: '',
            gioiTinhNam: false,
            moTa: '',
            idLoaiKhach: 1
        });
    };

    const changeNgayLapHoaDon = async (dt: string) => {
        setHoaDon({
            ...hoadon,
            ngayLapHoaDon: dt
        });
        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => (o.ngayLapHoaDon = dt));
    };

    const onClickConfirmDelete = async () => {
        const idCheckinDelete = hoadon?.idCheckIn ?? Guid.EMPTY;
        await CheckinService.UpdateTrangThaiCheckin(idCheckinDelete, TrangThaiCheckin.DELETED);
        await CheckinService.UpdateTrangThaiBooking_byIdCheckIn(idCheckinDelete, TrangThaiBooking.Confirm);
        await AgreeChangeRemoveCustomer();
    };

    const checkSaveInvoice = async () => {
        if (hoaDonChiTiet.length === 0) {
            setObjAlert({
                show: true,
                type: 2,
                mes: 'Vui lòng nhập chi tiết hóa đơn '
            });
            return false;
        }
        if (utils.checkNull_OrEmpty(hoadon?.idKhachHang)) {
            if (sumTienKhachTra < hoadon?.tongThanhToan) {
                setObjAlert({
                    show: true,
                    type: 2,
                    mes: 'Là khách lẻ. Không cho phép nợ'
                });
                return false;
            }
        }
        if (hoadon?.idLoaiChungTu === LoaiChungTu.GOI_DICH_VU) {
            if (utils.checkNull_OrEmpty(hoadon?.idKhachHang)) {
                setObjAlert({
                    show: true,
                    type: 2,
                    mes: 'Vui lòng chọn khách hàng khi mua gói dịch vụ'
                });
                return false;
            }
        }
        // if (lstQuyCT.length === 0) {
        //     setObjAlert({
        //         show: true,
        //         type: 2,
        //         mes: 'Vui lòng chọn hình thức thanh toán '
        //     });
        //     return false;
        // }

        // const itemPos = lstQuyCT.filter((x: QuyChiTietDto) => x.hinhThucThanhToan === 3);
        // if (itemPos.length > 0 && utils.checkNull(itemPos[0].idTaiKhoanNganHang)) {
        //     setObjAlert({
        //         show: true,
        //         type: 2,
        //         mes: 'Vui lòng chọn tài khoản POS'
        //     });
        //     return false;
        // }

        // const itemCK = lstQuyCT.filter((x: QuyChiTietDto) => x.hinhThucThanhToan === 2);
        // if (itemCK.length > 0 && utils.checkNull(itemCK[0].idTaiKhoanNganHang)) {
        //     setObjAlert({
        //         show: true,
        //         type: 2,
        //         mes: 'Vui lòng chọn tài khoản chuyển khoản'
        //     });
        //     return false;
        // }

        return true;
    };

    const ResetState_AfterSave = async () => {
        setIsSavingHoaDon(false);
        setIsThanhToanTienMat(true);

        setHoaDonChiTiet([]);
        const newHD = new PageHoaDonDto({
            id: Guid.create().toString(),
            idLoaiChungTu: LoaiChungTu.HOA_DON_BAN_LE,
            idKhachHang: customerIdChosed as unknown as undefined,
            idChiNhanh: idChiNhanhChosed,
            tenKhachHang: 'Khách lẻ'
        });
        setHoaDon({ ...newHD });
        setCustomerChosed({
            ...customerChosed,
            id: '',
            maKhachHang: 'KL',
            tenKhachHang: 'Khách lẻ',
            soDienThoai: '',
            tongTichDiem: 0,
            avatar: ''
        } as CreateOrEditKhachHangDto);

        await dbDexie.hoaDon.where('id').equals(hoadon?.id).delete();
        await dbDexie.hoaDon.add(newHD); // alway add newHD with KhachLe after save
    };

    const saveDiaryHoaDon = async (maHoaDon: string, ngaylapHoaDonDB: string) => {
        let sDetails = '';
        for (let i = 0; i < hoaDonChiTiet?.length; i++) {
            const itFor = hoaDonChiTiet[i];
            sDetails += ` <br /> ${i + 1}. ${itFor?.tenHangHoa} (${itFor?.maHangHoa}): ${
                itFor?.soLuong
            } x  ${Intl.NumberFormat('vi-VN').format(itFor?.donGiaTruocCK)}  =  ${Intl.NumberFormat('vi-VN').format(
                itFor?.thanhTienSauCK ?? 0
            )}`;
        }

        let txtKhachHang = '';
        if (utils.checkNull(customerChosed?.soDienThoai)) {
            txtKhachHang = `${customerChosed?.tenKhachHang}`;
        } else {
            txtKhachHang = ` ${customerChosed?.tenKhachHang} (${customerChosed?.soDienThoai})`;
        }

        const diary = {
            idChiNhanh: idChiNhanhChosed,
            noiDung: `Thêm mới hóa đơn ${maHoaDon}, khách hàng: ${txtKhachHang}`,
            chucNang: 'Thêm mới hóa đơn',
            noiDungChiTiet: `<b> Thông tin hóa đơn: </b> <br /> Mã hóa đơn: ${maHoaDon}  <br />Ngày lập: ${format(
                new Date(ngaylapHoaDonDB),
                'dd/MM/yyyy HH:mm'
            )} <br /> Khách hàng: ${txtKhachHang}  <br /> Tổng tiền:  ${Intl.NumberFormat('vi-VN').format(
                hoadon?.tongTienHangChuaChietKhau
            )} <br /> Chiết khấu hàng:  ${Intl.NumberFormat('vi-VN').format(hoadon?.tongChietKhauHangHoa)}
            <br /> Giảm giá hóa đơn:  ${Intl.NumberFormat('vi-VN').format(
                hoadon?.tongGiamGiaHD
            )}  <br /> <b> Thông tin chi tiết: </b> ${sDetails}`,
            loaiNhatKy: 1
        } as CreateNhatKyThaoTacDto;
        nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    const thanhToanAtPaymentForm = async (
        tienMat: number,
        tienCK: number,
        tienPOS: number,
        idTaiKhoanCK: string | null,
        idTaiKHoanPos: string | null
    ) => {
        const hoadonDB = await saveHoaDon();
        if (hoadonDB) {
            await SoQuyServices.savePhieuThu_forHoaDon({
                phaiTT: hoadon?.tongThanhToan ?? 0,
                tienmat: tienMat,
                tienCK: tienCK,
                tienPOS: tienPOS,
                idTaiKhoanChuyenKhoan: idTaiKhoanCK as null,
                idTaiKhoanPOS: idTaiKHoanPos as null,
                hoadon: {
                    maHoaDon: hoadonDB?.maHoaDon,
                    id: (hoadonDB?.id ?? null) as unknown as null,
                    idKhachHang: customerChosed?.id as unknown as null,
                    idChiNhanh: idChiNhanhChosed as unknown as null,
                    ngayLapHoaDon: hoadonDB?.ngayLapHoaDon,
                    tenKhachHang: customerChosed?.tenKhachHang,
                    ghiChuHD: ''
                }
            });
        }
    };

    const saveHoaDon = async () => {
        setIsSavingHoaDon(true);
        if (isSavingHoaDon) return;

        const checkSave = await checkSaveInvoice();
        if (!checkSave) {
            setIsSavingHoaDon(false);
            return;
        }

        const dataSave = { ...hoadon };
        dataSave.hoaDonChiTiet = hoaDonChiTiet;
        dataSave?.hoaDonChiTiet?.map((x: PageHoaDonChiTietDto, index: number) => {
            x.stt = index + 1; // update STT for cthd
        });
        const hoadonDB = await HoaDonService.CreateHoaDon(dataSave);
        if (hoadonDB != null) {
            setObjAlert({
                show: true,
                type: 1,
                mes: 'Thanh toán hóa đơn thành công'
            });

            await saveDiaryHoaDon(hoadonDB?.maHoaDon, hoadonDB?.ngayLapHoaDon);

            // await savePhieuThu(hoadonDB);
            await CheckinService.UpdateTrangThaiCheckin(hoadon?.idCheckIn, TrangThaiCheckin.COMPLETED);
            await CheckinService.Update_IdHoaDon_toCheckInHoaDon(hoadon?.idCheckIn, hoadonDB.id);

            if (isThanhToanTienMat) {
                await SoQuyServices.savePhieuThu_forHoaDon({
                    phaiTT: hoadon?.tongThanhToan ?? 0,
                    tienmat: sumTienKhachTra,
                    hoadon: {
                        maHoaDon: hoadonDB?.maHoaDon,
                        id: (hoadonDB?.id ?? null) as unknown as null,
                        idKhachHang: customerChosed?.id as unknown as null,
                        idChiNhanh: idChiNhanhChosed as unknown as null,
                        ngayLapHoaDon: hoadon?.ngayLapHoaDon,
                        tenKhachHang: customerChosed?.tenKhachHang,
                        ghiChuHD: ''
                    }
                });
            }

            ResetState_AfterSave();
            return hoadonDB;
        }
    };

    return (
        <>
            <ConfirmDelete
                isShow={confirmDialog.show}
                title={confirmDialog.title}
                mes={confirmDialog.mes}
                onOk={onClickConfirmDelete}
                onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <CreateOrEditCustomerDialog
                visible={isShowModalAddCus}
                onCancel={() => setIsShowModalAddCus(false)}
                onOk={changeCustomer_fromModalAdd}
                title="Thêm mới khách hàng"
                formRef={newCus}
            />
            <Grid container minHeight={'86vh'} maxHeight={'86vh'}>
                {!isThanhToanTienMat ? (
                    <Grid item xs={7}>
                        <PaymentsForm
                            tongPhaiTra={hoadon?.tongThanhToan ?? 0}
                            onClose={() => setIsThanhToanTienMat(true)}
                            onSaveHoaDon={thanhToanAtPaymentForm}
                        />
                    </Grid>
                ) : (
                    <Grid item xs={7} borderRight={'1px solid rgb(224, 228, 235)'}>
                        <Stack spacing={2} overflow={'auto'} maxHeight={'84vh'}>
                            {(nhomHangHoaChosed?.length ?? 0) > 0 && (
                                <Stack spacing={2}>
                                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                        <Typography fontWeight={500}>Nhóm hàng đã chọn</Typography>
                                        <Stack
                                            direction={'row'}
                                            spacing={1}
                                            alignItems={'center'}
                                            color={'brown'}
                                            sx={{ cursor: 'pointer' }}>
                                            <Typography fontSize={13} onClick={() => BoChonAllNhomHang()}>
                                                Bỏ chọn tất cả
                                            </Typography>
                                            <CloseOutlinedIcon sx={{ width: 15, height: 15 }} />
                                        </Stack>
                                    </Stack>
                                    <Stack direction={'row'} spacing={1} sx={{ overflowX: 'auto' }}>
                                        {nhomHangHoaChosed?.map((x, index) => (
                                            <Stack key={index} padding={1} bgcolor={'#f0e0da'} borderRadius={4}>
                                                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                                    <Typography
                                                        fontWeight={500}
                                                        className="lableOverflow"
                                                        maxWidth={300}
                                                        title={x?.tenNhomHang ?? ''}>
                                                        {x?.tenNhomHang}
                                                    </Typography>
                                                    <CloseOutlinedIcon
                                                        sx={{ width: 20, height: 20, cursor: 'pointer' }}
                                                        onClick={() => BoChon1NhomHang(x?.id ?? '')}
                                                    />
                                                </Stack>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Stack>
                            )}

                            {listProduct.map((nhom: IHangHoaGroupTheoNhomDto, index: number) => (
                                <Stack key={index}>
                                    <Typography fontSize={16} fontWeight={500} marginBottom={0.5}>
                                        {nhom?.tenNhomHang}
                                    </Typography>
                                    <Grid container spacing={2} paddingRight={2}>
                                        {nhom?.hangHoas.map((item, index2) => (
                                            <Grid key={index2} item lg={4}>
                                                <Stack
                                                    padding={2}
                                                    title={item.tenHangHoa}
                                                    sx={{
                                                        backgroundColor: 'var(--color-bg)',
                                                        border: '1px solid transparent',
                                                        '&:hover': {
                                                            borderColor: 'var(--color-main)',
                                                            cursor: 'pointer'
                                                        }
                                                    }}>
                                                    <Stack spacing={2} onClick={() => choseProduct(item)}>
                                                        <Typography
                                                            fontWeight={500}
                                                            variant="body2"
                                                            sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                width: '100%'
                                                            }}>
                                                            {item?.tenHangHoa}
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            {Intl.NumberFormat('vi-VN').format(item?.giaBan as number)}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Stack>
                            ))}
                        </Stack>
                    </Grid>
                )}

                <Grid item xs={5}>
                    <Stack marginLeft={4} position={'relative'} height={'100%'}>
                        <Stack>
                            <Stack
                                direction={'row'}
                                paddingBottom={2}
                                maxHeight={57}
                                borderBottom={'1px solid #cccc'}
                                justifyContent={'space-between'}>
                                <Stack>
                                    <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                                        <Avatar />
                                        <Stack
                                            spacing={1}
                                            onClick={(event) => {
                                                setAnchorDropdownCustomer(event.currentTarget);
                                            }}>
                                            <Stack
                                                direction={'row'}
                                                alignItems={'center'}
                                                spacing={1}
                                                title="Thay đổi khách hàng"
                                                sx={{ cursor: 'pointer' }}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={500}
                                                    className="lableOverflow"
                                                    maxWidth={350}>
                                                    {customerChosed?.tenKhachHang}
                                                </Typography>
                                                {!utils.checkNull_OrEmpty(customerChosed?.id ?? '') ? (
                                                    <CloseOutlinedIcon
                                                        color="error"
                                                        titleAccess="Bỏ chọn khách hàng"
                                                        sx={{ width: 20, cursor: 'pointer' }}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            RemoveCustomer();
                                                        }}
                                                    />
                                                ) : (
                                                    <IconButton
                                                        aria-label="add-customer"
                                                        color="primary"
                                                        title="Thêm khách hàng mới"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            showModalAddCustomer();
                                                        }}>
                                                        <AddOutlinedIcon color="info" sx={{ width: 20 }} />
                                                    </IconButton>
                                                )}
                                            </Stack>

                                            <Typography color={'#ccc'} variant="caption">
                                                {customerChosed?.soDienThoai}
                                            </Typography>
                                        </Stack>
                                    </Stack>

                                    <MenuWithDataFromDB
                                        typeSearch={TypeSearchfromDB.CUSTOMER}
                                        open={expandSearchCus}
                                        anchorEl={anchorDropdownCustomer}
                                        handleClose={() => setAnchorDropdownCustomer(null)}
                                        handleChoseItem={changeCustomer}
                                    />
                                </Stack>

                                <Stack
                                    alignItems={'end'}
                                    sx={{
                                        '& fieldset': {
                                            border: 'none'
                                        },
                                        ' & input': {
                                            textAlign: 'right'
                                        }
                                    }}>
                                    <DatePickerCustom
                                        props={{ width: '100%' }}
                                        defaultVal={hoadon?.ngayLapHoaDon}
                                        handleChangeDate={changeNgayLapHoaDon}
                                    />
                                </Stack>
                            </Stack>

                            <Stack overflow={'auto'} maxHeight={350} zIndex={3}>
                                {hoaDonChiTiet
                                    ?.sort((x, y) => {
                                        // sap xep STT giamdan
                                        const a = x.stt;
                                        const b = y.stt;
                                        return a > b ? -1 : a < b ? 1 : 0;
                                    })
                                    .map((cthd, index) => (
                                        <Grid
                                            container
                                            key={index}
                                            borderBottom={'1px solid #cccc'}
                                            alignItems={'baseline'}
                                            padding={'8px 0px'}>
                                            <Grid item xs={12} lg={7}>
                                                <Typography className="text-cursor">{cthd?.tenHangHoa}</Typography>
                                            </Grid>
                                            <Grid item xs={12} lg={5}>
                                                <Grid container alignItems={'baseline'}>
                                                    <Grid item xs={6}>
                                                        <Stack
                                                            spacing={1}
                                                            direction={'row'}
                                                            textAlign={'right'}
                                                            justifyContent={'end'}>
                                                            <Stack
                                                                direction={'row'}
                                                                spacing={1}
                                                                flex={1}
                                                                justifyContent={'end'}>
                                                                <Typography fontWeight={500}>
                                                                    {cthd?.soLuong}
                                                                </Typography>
                                                                <Typography>x</Typography>
                                                            </Stack>
                                                            <Typography
                                                                className="text-cursor"
                                                                flex={3}
                                                                textAlign={'left'}>
                                                                {Intl.NumberFormat('vi-VN').format(cthd?.giaBan ?? 0)}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Stack
                                                            spacing={1}
                                                            direction={'row'}
                                                            textAlign={'right'}
                                                            justifyContent={'end'}
                                                            alignItems={'center'}>
                                                            <Typography fontWeight={500}>
                                                                {Intl.NumberFormat('vi-VN').format(
                                                                    cthd?.thanhTienSauCK ?? 0
                                                                )}
                                                            </Typography>
                                                            <IconButton
                                                                aria-label="Xóa chi tiết hóa đơn"
                                                                title="Xóa chi tiết hóa đơn"
                                                                onClick={() => removeCTHD(cthd)}>
                                                                <DeleteOutlinedIcon color="error" />
                                                            </IconButton>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                            </Stack>
                        </Stack>
                        <Stack
                            zIndex={4}
                            sx={{
                                backgroundColor: 'rgb(245 241 241)',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 'auto',
                                padding: '16px',
                                boxSizing: 'border-box'
                            }}>
                            <Stack spacing={2}>
                                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: 500 }}>Tổng thanh toán</Typography>
                                    <Typography sx={{ fontSize: '18px', fontWeight: 500 }}>
                                        {Intl.NumberFormat('vi-VN').format(hoadon?.tongTienHang ?? 0)}
                                    </Typography>
                                </Stack>
                                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Typography fontWeight={500}>Tiền khách đưa</Typography>
                                    <RadioGroup
                                        sx={{ display: 'flex', flexDirection: 'row' }}
                                        onChange={(event) => {
                                            const newVal = (event.target as HTMLInputElement).value;
                                            const isTienMat = newVal?.toLocaleLowerCase() === 'true';
                                            setIsThanhToanTienMat(isTienMat);
                                        }}>
                                        <FormControlLabel
                                            value={true}
                                            label={'Tiền mặt'}
                                            checked={isThanhToanTienMat}
                                            control={<Radio size="small" />}
                                        />
                                        <FormControlLabel
                                            sx={{
                                                marginRight: 0
                                            }}
                                            value={false}
                                            label={'Hình thức khác'}
                                            checked={!isThanhToanTienMat}
                                            control={<Radio size="small" />}
                                        />
                                    </RadioGroup>
                                </Stack>
                                <NumericFormat
                                    size="small"
                                    fullWidth
                                    value={sumTienKhachTra}
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    sx={{
                                        '& input': {
                                            textAlign: 'right',
                                            fontWeight: '700',
                                            color: '#3D475C',
                                            fontSize: '18px',
                                            padding: '12px'
                                        }
                                    }}
                                    customInput={TextField}
                                    onChange={(event) => {
                                        setSumTienKhachTra(utils.formatNumberToFloat(event.target.value));
                                    }}
                                />

                                {isSavingHoaDon ? (
                                    <Stack
                                        sx={{
                                            backgroundColor: isThanhToanTienMat ? '#1976d2' : '#e5ebed',
                                            borderRadius: '8px',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: 'white'
                                        }}
                                        direction={'row'}
                                        spacing={1}>
                                        <CircularProgress />
                                        <Typography fontSize={'16px'} padding={2} fontWeight={500}>
                                            Đang lưu
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <Stack
                                        sx={{
                                            backgroundColor: isThanhToanTienMat ? '#1976d2' : '#e5ebed',
                                            borderRadius: '8px',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: 'white'
                                        }}
                                        direction={'row'}
                                        spacing={1}
                                        onClick={saveHoaDon}>
                                        <CheckOutlinedIcon />
                                        <Typography fontSize={'16px'} padding={2} fontWeight={500}>
                                            THANH TOÁN
                                        </Typography>
                                    </Stack>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
