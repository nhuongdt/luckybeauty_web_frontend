import * as React from 'react';
import {
    Grid,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Stack,
    Button,
    Container,
    Link
} from '@mui/material';
import { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

import { Search, DeleteOutline } from '@mui/icons-material';

import { PagedResultDto } from '../../services/dto/pagedResultDto';
import ProductService from '../../services/product/ProductService';
import GroupProductService from '../../services/product/GroupProductService';
import { ModelNhomHangHoa } from '../../services/product/dto';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AiOutlineDelete } from 'react-icons/ai';
import { Clear } from '@mui/icons-material';
import HoaDonContext from './HoaDonContext';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import HoaDonService from '../../services/ban_hang/HoaDonService';

import { dbDexie } from '../../lib/dexie/dexieDB';

import Utils from '../../utils/utils';

const shortNameCus = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minWidth: 'unset',
                    borderRadius: '35px',
                    width: '37px',
                    height: '35px',
                    border: 'none',
                    backgroundColor: '#e4cdde',
                    color: '#7C3367'
                }
            }
        }
    }
});

export default function PageBanHang({ customerChosed, idNhomHang }: any) {
    const history = useNavigate();
    const [hoadon, setHoadon] = useState<PageHoaDonDto>(new PageHoaDonDto({ idKhachHang: null }));
    const [listProduct, setListProduct] = useState([]);
    const [hoaDonChiTiet, setHoaDonChiTiet] = useState<PageHoaDonChiTietDto[]>([]);
    const [clickSSave, setClickSave] = useState(false);

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

    useEffect(() => {
        GetDMHangHoa_groupByNhom();
    }, [idNhomHang]);

    const PageLoad = () => {
        // GetDMHangHoa_groupByNhom();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        if (customerChosed) {
            // check exist hoadon of customer (todo)

            setHoadon((old: any) => {
                return {
                    ...old,
                    idKhachHang: customerChosed.idKhachHang,
                    maKhachHang: customerChosed.maKhachHang,
                    tenKhachHang: customerChosed.tenKhachHang,
                    soDienThoai: customerChosed.soDienThoai,
                    tongTichDiem: customerChosed.tongTichDiem
                };
            });
            // setHoaDonChiTiet((arrOld: any) => {
            //     return { ...arrOld, idHoaDon: hoadon.id };
            // });
        }
    }, []);

    const updateCurrentInvoice = () => {
        let tongTienHangChuaCK = 0,
            tongChietKhau = 0,
            tongTienHang = 0;
        for (let i = 0; i < hoaDonChiTiet.length; i++) {
            console.log('into');
            const itFor = hoaDonChiTiet[i];
            tongTienHangChuaCK += itFor.soLuong * itFor.donGiaTruocCK;
            tongTienHang += itFor.thanhTien ?? 0;
            tongChietKhau += itFor.tienChietKhau ?? 0;
        }
        setHoadon((old) => {
            return {
                ...old,
                tongTienHangChuaChietKhau: tongTienHangChuaCK,
                tongTienHang: tongTienHang,
                tongChietKhauHangHoa: tongChietKhau,
                tongThanhToan: tongTienHang
            };
        });
    };

    const deleteChiTietHoaDon = (item: any) => {
        setHoaDonChiTiet(hoaDonChiTiet.filter((x) => x.idDonViQuyDoi !== item.idDonViQuyDoi));
    };

    useEffect(() => {
        updateCurrentInvoice();
    }, [hoaDonChiTiet]);

    const choseChiTiet = async (item: any, index: any) => {
        console.log('item ', hoaDonChiTiet);
        const newCT = new PageHoaDonChiTietDto({
            idDonViQuyDoi: item.idDonViQuyDoi,
            maHangHoa: item.maHangHoa,
            tenHangHoa: item.tenHangHoa,
            giaBan: item.giaBan,
            thanhTien: item.giaBan,
            idNhomHangHoa: item.idNhomHangHoa,
            idHangHoa: item.id,
            soLuong: 1
        });

        const checkCT = hoaDonChiTiet.filter((x) => x.idDonViQuyDoi === item.idDonViQuyDoi);

        if (checkCT.length === 0) {
            setHoaDonChiTiet((olds: any) => {
                return [newCT, ...olds];
            });

            // add to cache Dexie
            try {
                const newX = await dbDexie.hoaDonChiTiet.add(newCT);
                console.log('newX', newX);
            } catch (err) {
                console.log('eer');
            }
        } else {
            checkCT[0].soLuong += 1;
            checkCT[0].thanhTien = checkCT[0].soLuong * checkCT[0].donGiaTruocCK;

            // remove & unshift but keep infor old cthd
            const arrOld = hoaDonChiTiet?.filter((x) => x.idDonViQuyDoi !== item.idDonViQuyDoi);
            setHoaDonChiTiet((olds: any) => {
                return [checkCT[0], ...arrOld];
            });
        }

        // updateCurrentInvoice();
    };

    const saveHoaDon = async () => {
        setClickSave(true);
        const myData = {
            hoadon: hoadon,
            hoadonChiTiet: hoaDonChiTiet
        };
        const data = await HoaDonService.CreateHoaDon2(myData);
        console.log(data);
    };

    return (
        <>
            <Grid item xs={9} sm={5} lg={6} md={5} className="page-ban-hang">
                <Grid item xs={12} sm={12} md={12} lg={12} className="nhom-dich-vu">
                    <Box className="page-title-search">
                        <TextField
                            placeholder="Tìm dịch vụ"
                            size="small"
                            fullWidth
                            style={{ padding: '5px 16px' }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                )
                            }}></TextField>
                    </Box>
                </Grid>

                {/* all list sp nhom */}
                <Box style={{ overflowY: 'auto', maxHeight: 600 }}>
                    {listProduct.map((nhom: any, index: any) => (
                        <Grid
                            key={index}
                            container
                            className="center"
                            columnSpacing={2}
                            rowSpacing={1}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Typography className="nhom-dich-vu">{nhom.tenNhomHang}</Typography>
                            </Grid>
                            {nhom.hangHoas.map((item: any, index2: any) => (
                                <Grid
                                    key={item.id}
                                    item
                                    xs={3}
                                    sm={3}
                                    md={3}
                                    lg={3}
                                    onClick={() => {
                                        choseChiTiet(item, index);
                                    }}>
                                    <Stack display="column" padding={1} className="infor-dich-vu">
                                        <Typography className="ten-dich-vu">
                                            {item.tenHangHoa}
                                        </Typography>
                                        <Typography>{Utils.formatNumber(item.giaBan)}</Typography>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Box>
            </Grid>
            {/* end list sp nhom */}
            <Grid item xs={12} sm={4} lg={4} md={4} className="page-ban-hang">
                <Stack display="column" spacing={2}>
                    <Stack sx={{ flexDirection: 'row' }}>
                        <ThemeProvider theme={shortNameCus}>
                            <Button>TM</Button>
                        </ThemeProvider>
                        <Box sx={{ paddingLeft: '8px' }}>
                            <Typography className="cusname">
                                <Link href="#aaa">{hoadon?.tenKhachHang}</Link>
                            </Typography>
                            <Typography className="cusphone" sx={{ color: '#acaca5' }}>
                                {hoadon?.soDienThoai}
                            </Typography>
                        </Box>
                    </Stack>

                    {/* 1 chi tiet hoadon */}
                    {hoaDonChiTiet?.map((ct: any, index) => (
                        <Box key={index}>
                            <Stack sx={{ flexDirection: 'row' }}>
                                <Grid container>
                                    <Grid item xs={12} sm={7} md={7} lg={7}>
                                        <Typography color="#7c3367">{ct.tenHangHoa}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={5} md={5} lg={5}>
                                        <Stack
                                            sx={{
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end'
                                            }}>
                                            <Typography
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 500
                                                }}>
                                                {ct.soLuong}
                                            </Typography>
                                            <Typography
                                                width={25}
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 500
                                                }}>
                                                x
                                            </Typography>
                                            <Typography style={{ fontWeight: 500 }}>
                                                {Utils.formatNumber(ct.giaBan)}
                                            </Typography>
                                            <Box width={35}>
                                                <AiOutlineDelete
                                                    style={{
                                                        float: 'right',
                                                        fontSize: '18px',
                                                        color: '#b25656'
                                                    }}
                                                    onClick={() => {
                                                        deleteChiTietHoaDon(ct);
                                                    }}
                                                />
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Stack>
                            {ct.nhanVienThucHien.length > 0 && (
                                <Stack>
                                    <Grid container>
                                        <Grid item xs={4} sm={4} md={2} lg={2}>
                                            <Typography
                                                style={{
                                                    fontSize: '12px'
                                                }}>
                                                Nhân viên:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8} sm={8} md={10} lg={10}>
                                            <Stack sx={{ flexDirection: 'row' }}>
                                                {/* 1 nhan vien */}
                                                <Stack
                                                    sx={{ flexDirection: 'row' }}
                                                    className="nvthuchien">
                                                    <Box className="cuspoint">
                                                        Nguyễn Lê Hải Phong
                                                    </Box>
                                                    <Box style={{ paddingLeft: '5px' }}>
                                                        <Clear
                                                            style={{
                                                                fontSize: '12px'
                                                            }}
                                                        />
                                                    </Box>
                                                </Stack>
                                                {/* end 1 nhan vien */}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Stack>
                            )}
                        </Box>
                    ))}
                    {/* end 1 chi tiet hoadon */}

                    <Stack
                        spacing={2}
                        style={{ position: 'absolute', bottom: 32, right: 0 }}
                        width={28 / 100}>
                        <Grid container sx={{ paddingRight: '16px' }} rowSpacing={2}>
                            <Grid item xs={12} sm={4} lg={4} md={4}>
                                Tổng tiền hàng
                            </Grid>
                            <Grid item xs={12} sm={8} lg={8} md={8}>
                                <Typography className="tongtien">
                                    {Utils.formatNumber(hoadon.tongTienHangChuaChietKhau)}
                                </Typography>
                            </Grid>
                            {/* <Grid item xs={12} sm={4} lg={4} md={4}>
                                Chiết khấu
                            </Grid>
                            <Grid item xs={12} sm={8} lg={8} md={8}>
                                <Typography className="tongtien">
                                    {Utils.formatNumber(hoadon.tongTienHangChuaChietKhau)}
                                </Typography>
                            </Grid> */}
                            <Grid item xs={12} sm={4} lg={4} md={4}>
                                Tổng giảm giá
                            </Grid>
                            <Grid item xs={12} sm={8} lg={8} md={8}>
                                <Typography className="tongtien">
                                    {Utils.formatNumber(hoadon.tongChietKhauHangHoa)}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={4}
                                lg={4}
                                md={4}
                                style={{ fontSize: '16px', fontWeight: 500 }}>
                                Tổng thanh toán
                            </Grid>
                            <Grid item xs={12} sm={8} lg={8} md={8}>
                                <Typography
                                    style={{
                                        float: 'right',
                                        fontSize: '16px',
                                        fontWeight: 500
                                    }}>
                                    {Utils.formatNumber(hoadon.tongThanhToan)}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                lg={12}
                                md={12}
                                style={{ paddingTop: '32px' }}>
                                <Button
                                    variant="contained"
                                    className="button-container"
                                    fullWidth
                                    sx={{ height: 45 }}
                                    onClick={saveHoaDon}>
                                    Thanh toán
                                </Button>
                            </Grid>
                        </Grid>
                    </Stack>
                </Stack>
            </Grid>
        </>
    );
}
