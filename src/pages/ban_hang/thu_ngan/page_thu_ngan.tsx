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
    IconButton
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
import AutocompleteCustomer from '../../../components/Autocomplete/Customer';
import { handleClickOutside } from '../../../utils/customReactHook';
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
import { HINH_THUC_THANH_TOAN, LoaiChungTu } from '../../../lib/appconst';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';
import nhatKyHoatDongService from '../../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import { CreateNhatKyThaoTacDto } from '../../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import { format } from 'date-fns';
import HoaDonDto from '../../../services/ban_hang/HoaDonDto';
import MenuWithDataFromDB from '../../../components/Menu/MenuWithData_fromDB';
import { TypeSearchfromDB } from '../../../enum/TypeSearch_fromDB';
import { ResetTvRounded } from '@mui/icons-material';
import { KhachHangDto } from '../../../services/khach-hang/dto/KhachHangDto';
import datLichService from '../../../services/dat-lich/datLichService';

export type IPropsPageThuNgan = {
    txtSearch: string;
    loaiHoaDon?: number;
    customerIdChosed?: string;
    idChiNhanhChosed: string;
    booingId?: string;
    arrIdNhomHangFilter?: string[];
};

export default function PageThuNgan(props: IPropsPageThuNgan) {
    const { txtSearch, customerIdChosed, loaiHoaDon, idChiNhanhChosed, booingId, arrIdNhomHangFilter } = props;
    const firstLoad = useRef(true);
    const [anchorDropdownCustomer, setAnchorDropdownCustomer] = useState<null | HTMLElement>(null);
    const expandSearchCus = Boolean(anchorDropdownCustomer);

    const [isSavingHoaDon, setIsSavingHoaDon] = useState(false);
    const [isThanhToanTienMat, setIsThanhToanTienMat] = useState(true);
    const [idNhomHang, setIdNhomHang] = useState('');
    const [idLoaiHangHoa, setIdLoaiHangHoa] = useState(0);
    const [sumTienKhachTra, setSumTienKhachTra] = useState(0);
    const [tienThuaTraKhach, setTienThuaTraKhach] = useState(0);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });
    const [arrIdNhomHangChosed, setArrIdNhomHangChosed] = useState<string[]>([]);
    const [nhomHangHoaChosed, setNhomHangHoaChosed] = useState<ModelNhomHangHoa[]>([]);
    const [listProduct, setListProduct] = useState<IHangHoaGroupTheoNhomDto[]>([]);

    const [customerChosed, setCustomerChosed] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);

    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(
        new PageHoaDonDto({
            idKhachHang: customerIdChosed as unknown as undefined,
            idLoaiChungTu: loaiHoaDon,
            tenKhachHang: 'Khách lẻ',
            idChiNhanh: idChiNhanhChosed
        })
    );
    const [hoaDonChiTiet, setHoaDonChiTiet] = useState<PageHoaDonChiTietDto[]>([]);
    const [cthdDoing, setCTHDDoing] = useState<PageHoaDonChiTietDto>(
        new PageHoaDonChiTietDto({ id: '', expanded: false })
    );

    const [isShowModalAddCus, setIsShowModalAddCus] = useState(false);
    const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);

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
            IdLoaiHangHoa: idLoaiHangHoa,
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
            IdLoaiHangHoa: idLoaiHangHoa,
            CurrentPage: 0,
            PageSize: 50
        } as PagedProductSearchDto;
        const data = await ProductService.GetDMHangHoa_groupByNhom(input);
        setListProduct(data);
    };

    const GetInforBooking_byId = async (bookingId: string) => {
        const ctLichHen = await datLichService.GetInforBooking_byID(bookingId);
        for (let i = 0; i < (ctLichHen?.length ?? 0); i++) {
            const itFor = ctLichHen[i];
            for (let j = 0; j < (itFor?.details?.length ?? 0); j++) {
                const forIn = itFor?.details?.[j];
                if (forIn) {
                    const newObj: ModelHangHoaDto = {
                        id: forIn?.idHangHoa,
                        idDonViQuyDoi: forIn?.idDonViQuyDoi,
                        maHangHoa: forIn?.maHangHoa,
                        tenHangHoa: forIn?.tenHangHoa,
                        giaBan: forIn?.giaBan,
                        idNhomHangHoa: forIn?.idNhomHangHoa,
                        tenNhomHang: forIn?.tenNhomHang,
                        donViQuiDois: []
                    };
                    choseProduct(newObj);
                }
            }
        }
    };

    useEffect(() => {
        setArrIdNhomHangChosed(arrIdNhomHangFilter ?? []);
    }, [arrIdNhomHangFilter]);

    useEffect(() => {
        GetInforBooking_byId(booingId ?? '');
    }, [booingId]);

    useEffect(() => {
        GetListNhomHangHoa_byId(arrIdNhomHangChosed ?? []);
        getListHangHoa_groupbyNhom_filterNhom(arrIdNhomHangChosed ?? []);
    }, [arrIdNhomHangChosed]);

    const GetInforCustomer_byId = async (cusId?: string) => {
        const customer = await khachHangService.getKhachHang(cusId ?? Guid.EMPTY);
        setCustomerChosed(customer);
    };

    useEffect(() => {
        GetInforCustomer_byId(customerIdChosed);
    }, [customerIdChosed]);

    useEffect(() => {
        // change at main_page
        setHoaDon({ ...hoadon, idChiNhanh: idChiNhanhChosed, idLoaiChungTu: loaiHoaDon as number });
    }, [loaiHoaDon, idChiNhanhChosed]);

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

    const removeCTHD = (item: HoaDonChiTietDto) => {
        setHoaDonChiTiet(hoaDonChiTiet?.filter((x) => x?.idDonViQuyDoi !== item?.idDonViQuyDoi));
    };

    const choseProduct = (item: ModelHangHoaDto) => {
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

            //UpdateHoaHongDichVu_forNVThucHien(newCT.id, newCT?.thanhTienSauCK ?? 0);
        } else {
            setHoaDonChiTiet([newCT, ...hoaDonChiTiet]);
        }
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

    const changeCustomer_fromModalAdd = (customer?: KhachHangDto) => {
        setIsShowModalAddCus(false);
        if (customer) {
            setCustomerChosed({
                ...customerChosed,
                id: customer?.id?.toString(),
                maKhachHang: customer?.maKhachHang,
                tenKhachHang: customer?.tenKhachHang ?? 'Khách lẻ',
                soDienThoai: customer?.soDienThoai ?? ''
            });
            setHoaDon({ ...hoadon, idKhachHang: customer?.id?.toString() });
        }
    };

    const changeCustomer = (item: IList) => {
        setAnchorDropdownCustomer(null);
        setCustomerChosed({
            ...customerChosed,
            id: item?.id,
            maKhachHang: item?.text, // todo makhachhang
            tenKhachHang: item?.text ?? 'Khách lẻ',
            soDienThoai: item?.text2 ?? ''
        });
        setHoaDon({ ...hoadon, idKhachHang: item?.id });
    };

    const RemoveCustomer = () => {
        setHoaDon({ ...hoadon, idKhachHang: null });
        setCustomerChosed({
            ...customerChosed,
            id: Guid.EMPTY,
            maKhachHang: 'KL', // todo makhachhang
            tenKhachHang: 'Khách lẻ',
            soDienThoai: ''
        });
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
        // await dbDexie.hoaDon.update(hoadon?.id, {
        //     ngayLapHoaDon: dt
        // });
        // update ngaycheckin??
    };

    const onClickConfirmDelete = () => {
        //
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
        if (utils.checkNull(hoadon?.idKhachHang) || hoadon?.idKhachHang === Guid.EMPTY) {
            if (sumTienKhachTra < hoadon?.tongThanhToan) {
                setObjAlert({
                    show: true,
                    type: 2,
                    mes: 'Là khách lẻ. Không cho phép nợ'
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

    const ResetState_AfterSave = () => {
        setIsSavingHoaDon(false);
        setIsThanhToanTienMat(true);

        setHoaDonChiTiet([]);
        setHoaDon(
            new PageHoaDonDto({
                id: Guid.create().toString(),
                idLoaiChungTu: loaiHoaDon,
                idKhachHang: customerIdChosed as unknown as undefined,
                idChiNhanh: idChiNhanhChosed,
                tenKhachHang: 'Khách lẻ'
            })
        );
        setCustomerChosed({
            ...customerChosed,
            id: '',
            maKhachHang: 'KL',
            tenKhachHang: 'Khách lẻ',
            soDienThoai: '',
            tongTichDiem: 0,
            avatar: ''
        } as CreateOrEditKhachHangDto);
    };

    const saveDiarySoQuy = async (maHoaDon: string, quyHD: QuyHoaDonDto) => {
        let ptThanhToan = '';
        const itemMat = quyHD?.quyHoaDon_ChiTiet?.filter((x) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.TIEN_MAT);
        if ((itemMat?.length ?? 0) > 0) {
            ptThanhToan += 'Tiền mặt, ';
        }
        const itemCK = quyHD?.quyHoaDon_ChiTiet?.filter(
            (x) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.CHUYEN_KHOAN
        );
        if ((itemCK?.length ?? 0) > 0) {
            ptThanhToan += 'Chuyển khoản, ';
        }
        const itemPos = quyHD?.quyHoaDon_ChiTiet?.filter((x) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.QUYET_THE);
        if ((itemPos?.length ?? 0) > 0) {
            ptThanhToan += 'POS';
        }
        ptThanhToan = utils.Remove_LastComma(ptThanhToan);
        const diary = {
            idChiNhanh: idChiNhanhChosed,
            noiDung: `Thêm mới phiếu thu ${quyHD?.maHoaDon} cho hóa đơn ${maHoaDon}`,
            chucNang: 'Thêm mới phiếu thu',
            noiDungChiTiet: `<b> Chi tiết phiếu thu: </b> <br /> Mã phiếu thu: ${
                quyHD?.maHoaDon
            }  <br /> Ngày lập: ${format(new Date(quyHD?.ngayLapHoaDon), 'dd/MM/yyyy HH:mm')} <br /> Khách hàng: ${
                quyHD?.tenNguoiNop
            }  <br /> Tổng tiền:  ${Intl.NumberFormat('vi-VN').format(
                quyHD?.tongTienThu
            )} <br /> Phương thức thanh toán: ${ptThanhToan} `,
            loaiNhatKy: 1
        } as CreateNhatKyThaoTacDto;
        nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    const savePhieuThu = async (hoadon: HoaDonDto) => {
        const quyCT = new QuyChiTietDto({
            idHoaDonLienQuan: hoadon.id as unknown as null,
            idKhachHang: (hoadon?.idKhachHang ?? null) as unknown as null,
            hinhThucThanhToan: HINH_THUC_THANH_TOAN.TIEN_MAT,
            tienThu: sumTienKhachTra
        });
        quyCT.maHoaDonLienQuan = hoadon.maHoaDon;

        const lstQCT_After = SoQuyServices.AssignAgainQuyChiTiet([quyCT], sumTienKhachTra, hoadon?.tongThanhToan ?? 0);

        const tongThu = lstQCT_After.reduce((currentValue: number, item) => {
            return currentValue + item.tienThu;
        }, 0);
        if (tongThu > 0) {
            const quyHD = new QuyHoaDonDto({
                idChiNhanh: idChiNhanhChosed,
                idLoaiChungTu: LoaiChungTu.PHIEU_THU,
                ngayLapHoaDon: hoadon.ngayLapHoaDon,
                tongTienThu: tongThu,
                noiDungThu: hoadon?.ghiChuHD
            });
            quyHD.quyHoaDon_ChiTiet = [quyCT];
            const dataPT = await SoQuyServices.CreateQuyHoaDon(quyHD);
            if (dataPT) {
                quyHD.maHoaDon = dataPT?.maHoaDon;
                quyHD.tenNguoiNop = customerChosed?.tenKhachHang; // used to print qrCode
                await saveDiarySoQuy(hoadon?.maHoaDon, quyHD);
            }
        }
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

            // save soquy
            await savePhieuThu(hoadonDB);

            ResetState_AfterSave();
        }
    };

    return (
        <>
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={onClickConfirmDelete}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
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
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
