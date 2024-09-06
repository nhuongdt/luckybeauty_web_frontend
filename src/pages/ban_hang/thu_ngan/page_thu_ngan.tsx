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
    TextField
} from '@mui/material';
import { ReactComponent as Logo } from '../../../images/Logo_Lucky_Beauty.svg';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

import { FC, useEffect, useRef, useState } from 'react';
import GroupProductService from '../../../services/product/GroupProductService';
import { IHangHoaGroupTheoNhomDto, ModelHangHoaDto, ModelNhomHangHoa } from '../../../services/product/dto';
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

export type IPropsPageThuNgan = {
    txtSearch: string;
    customerIdChosed?: string;
    loaiHoaDon?: number;
};

export default function PageThuNgan(props: IPropsPageThuNgan) {
    const { txtSearch, customerIdChosed, loaiHoaDon } = props;
    const firstLoad = useRef(true);
    const [expandSearchCus, setExpandSearchCus] = useState(false);
    const ref = handleClickOutside(() => setExpandSearchCus(false));

    const [isThanhToanTienMat, setIsThanhToanTienMat] = useState(true);
    const [idNhomHang, setIdNhomHang] = useState('');
    const [idLoaiHangHoa, setIdLoaiHangHoa] = useState(0);
    const [sumTienKhachTra, setSumTienKhachTra] = useState(0);
    const [tienThuaTraKhach, setTienThuaTraKhach] = useState(0);

    const [allNhomHangHoa, setAllNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);
    const [listProduct, setListProduct] = useState<IHangHoaGroupTheoNhomDto[]>([]);

    const [customerChosed, setCustomerChosed] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);

    const [hoaDon, setHoaDon] = useState<PageHoaDonDto>(
        new PageHoaDonDto({
            idKhachHang: null,
            tenKhachHang: 'Khách lẻ',
            idChiNhanh: ''
        })
    );
    const [hoaDonChiTiet, setHoaDonChiTiet] = useState<PageHoaDonChiTietDto[]>([]);
    const [cthdDoing, setCTHDDoing] = useState<PageHoaDonChiTietDto>(
        new PageHoaDonChiTietDto({ id: '', expanded: false })
    );

    const GetTreeNhomHangHoa = async () => {
        const list = await GroupProductService.GetTreeNhomHangHoa();
        setAllNhomHangHoa(list.items);
    };
    const getListHangHoa_groupbyNhom = async (txtSearch: string) => {
        const input = {
            IdNhomHangHoas: idNhomHang,
            TextSearch: txtSearch,
            IdLoaiHangHoa: idLoaiHangHoa,
            CurrentPage: 0,
            PageSize: 50
        };
        const data = await ProductService.GetDMHangHoa_groupByNhom(input);
        setListProduct(data);
    };
    const PageLoad = () => {
        GetTreeNhomHangHoa();
    };

    const cthd_SumThanhTienTruocCK = hoaDonChiTiet?.reduce((currentValue: number, item: PageHoaDonChiTietDto) => {
        return (item?.thanhTienTruocCK ?? 0) + currentValue;
    }, 0);
    const cthd_SumTienChietKhau = hoaDonChiTiet?.reduce((currentValue: number, item: PageHoaDonChiTietDto) => {
        return (item?.tienChietKhau ?? 0) * item.soLuong + currentValue;
    }, 0);
    const cthd_SumTienThue = hoaDonChiTiet?.reduce((currentValue: number, item: PageHoaDonChiTietDto) => {
        return (item?.tienThue ?? 0) * item.soLuong + currentValue;
    }, 0);

    useEffect(() => {
        // change cthd --> update hoadon
        const sumThanhTienSauCK = cthd_SumThanhTienTruocCK - cthd_SumTienChietKhau;
        const sumThanhTienSauVAT = sumThanhTienSauCK - cthd_SumTienThue;
        setSumTienKhachTra(sumThanhTienSauVAT);
        setTienThuaTraKhach(0);
        setHoaDon({
            ...hoaDon,
            tongTienHangChuaChietKhau: cthd_SumThanhTienTruocCK,
            tongChietKhauHangHoa: cthd_SumTienChietKhau,
            tongTienHang: sumThanhTienSauCK,
            tongTienHDSauVAT: sumThanhTienSauVAT,
            tongThanhToan: sumThanhTienSauVAT - (hoaDon?.tongGiamGiaHD ?? 0)
        });
    }, [cthd_SumThanhTienTruocCK, cthd_SumTienChietKhau, cthd_SumTienThue]);

    const GetInforCustomer_byId = async (cusId?: string) => {
        const customer = await khachHangService.getKhachHang(cusId ?? Guid.EMPTY);
        setCustomerChosed(customer);
    };

    useEffect(() => {
        GetInforCustomer_byId(customerIdChosed);
    }, [customerIdChosed]);

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

    const changeNgayLapHoaDon = async (dt: string) => {
        setHoaDon({
            ...hoaDon,
            ngayLapHoaDon: dt
        });
        // await dbDexie.hoaDon.update(hoadon?.id, {
        //     ngayLapHoaDon: dt
        // });
        // update ngaycheckin??
    };
    return (
        <>
            <Grid container minHeight={'86vh'} maxHeight={'86vh'}>
                {!isThanhToanTienMat ? (
                    <Grid item xs={7}>
                        <PaymentsForm
                            tongPhaiTra={hoaDon?.tongThanhToan ?? 0}
                            onClose={() => setIsThanhToanTienMat(true)}
                        />
                    </Grid>
                ) : (
                    <Grid item xs={7} borderRight={'1px solid rgb(224, 228, 235)'}>
                        <Stack spacing={2} overflow={'auto'} maxHeight={'84vh'}>
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
                        <Stack spacing={2} zIndex={1}>
                            <Stack
                                direction={'row'}
                                paddingBottom={2}
                                maxHeight={57}
                                borderBottom={'1px solid #cccc'}
                                justifyContent={'space-between'}>
                                <Stack ref={ref} spacing={0.5} minWidth={300} zIndex={2}>
                                    <Stack
                                        direction={'row'}
                                        spacing={0.5}
                                        alignItems={'center'}
                                        onClick={() => setExpandSearchCus(!expandSearchCus)}>
                                        <Avatar />
                                        <Stack spacing={1}>
                                            <Typography variant="body2" fontWeight={500}>
                                                {customerChosed?.tenKhachHang}
                                            </Typography>
                                            <Typography color={'#ccc'} variant="caption">
                                                {customerChosed?.soDienThoai}
                                            </Typography>
                                        </Stack>
                                    </Stack>

                                    {expandSearchCus && (
                                        <AutocompleteCustomer
                                            style={{ padding: 1, zIndex: 10, backgroundColor: 'white' }}
                                            idChosed={customerChosed?.id}
                                            handleChoseItem={(item: any) => {
                                                {
                                                    if (item !== null) {
                                                        setCustomerChosed({
                                                            ...customerChosed,
                                                            id: item?.id,
                                                            maKhachHang: item?.maKhachHang,
                                                            tenKhachHang: item?.tenKhachHang,
                                                            soDienThoai: item?.soDienThoai
                                                        });
                                                    }
                                                }
                                            }}
                                        />
                                    )}
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
                                        defaultVal={hoaDon?.ngayLapHoaDon}
                                        handleChangeDate={changeNgayLapHoaDon}
                                    />
                                </Stack>
                            </Stack>

                            <Stack overflow={'auto'} maxHeight={350} spacing={2} paddingBottom={2} zIndex={3}>
                                {hoaDonChiTiet
                                    ?.sort((x, y) => {
                                        // sap xep STT giamdan
                                        const a = x.stt;
                                        const b = y.stt;
                                        return a > b ? -1 : a < b ? 1 : 0;
                                    })
                                    .map((cthd, index) => (
                                        <Grid container key={index} paddingBottom={2} borderBottom={'1px solid #cccc'}>
                                            <Grid item xs={12} lg={7}>
                                                <Typography className="text-cursor">{cthd?.tenHangHoa}</Typography>
                                            </Grid>
                                            <Grid item xs={12} lg={5}>
                                                <Grid container>
                                                    <Grid item xs={6}>
                                                        <Stack
                                                            spacing={1}
                                                            direction={'row'}
                                                            textAlign={'right'}
                                                            alignItems={'center'}
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
                                                            justifyContent={'end'}>
                                                            <Typography fontWeight={500}>
                                                                {Intl.NumberFormat('vi-VN').format(
                                                                    cthd?.thanhTienSauCK ?? 0
                                                                )}
                                                            </Typography>
                                                            <DeleteOutlinedIcon
                                                                className="text-danger"
                                                                onClick={() => removeCTHD(cthd)}
                                                            />
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
                                        {Intl.NumberFormat('vi-VN').format(hoaDon?.tongTienHang ?? 0)}
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
                                    // onChange={(event) => {
                                    //     const arrQCT = lstQuyCT.map((itemQuy: QuyChiTietDto) => {
                                    //         return {
                                    //             ...itemQuy,
                                    //             tienThu: utils.formatNumberToFloat(event.target.value)
                                    //         };
                                    //     });
                                    //     assignThongTinThanhToan(arrQCT);
                                    // }}
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
                                    spacing={1}>
                                    <CheckOutlinedIcon />
                                    <Typography fontSize={'16px'} padding={2} fontWeight={500}>
                                        THANH TOÁN
                                    </Typography>
                                </Stack>
                                {/* <Button variant="contained" size="large" sx={{ fontSize: '18px', padding: '12px' }}>
                                    Thanh toán
                                </Button> */}
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
