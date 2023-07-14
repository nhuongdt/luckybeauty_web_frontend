import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
// TbCurrencyDong
import {
    Dialog,
    DialogTitle,
    Typography,
    DialogContent,
    TextField,
    Grid,
    Stack,
    Button,
    Radio,
    DialogActions,
    Autocomplete,
    Avatar,
    Popover,
    FormControlLabel,
    ToggleButton,
    RadioGroup,
    AccordionSummary,
    Box,
    AccordionDetails,
    Link,
    IconButton,
    ButtonGroup
} from '@mui/material';
import {
    Percent,
    Add,
    Remove,
    MoreHoriz,
    ExpandMore,
    ExpandLess,
    Close
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PageHoaDonChiTietDto from '../../../services/ban_hang/PageHoaDonChiTietDto';
import Utils from '../../../utils/utils'; // func common
import AutocompleteProduct from '../../../components/Autocomplete/Product';
import { NumericFormat } from 'react-number-format';
import { Guid } from 'guid-typescript';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { width } from '@mui/system';
import ProductService from '../../../services/product/ProductService';
import ModalSearchProduct from '../../product/modal_search_product';
const themInputChietKhau = createTheme({
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    paddingRight: '0px'
                }
            }
        }
    }
});

export default function ModalEditChiTietGioHang({
    isShow,
    formType = 0, // 1.form banhang, 0.other
    hoadonChiTiet,
    handleSave,
    handleClose
}: any) {
    const [isSave, setIsSave] = useState(false);
    const [popover, setPopover] = useState({
        anchorEl: null,
        open: false,
        item: { id: '', ptChietKhau: 0, tienChietKhau: 0, donGiaTruocCK: 0 }
    });
    const [idCTHD, setIdCTHD] = useState('');
    const [lstCTHoaDon, setLstCTHoaDon] = useState<PageHoaDonChiTietDto[]>([]);
    const displayComponent = formType === 1 ? 'none' : '';
    const [itemVisibility, setItemVisibility] = useState<boolean[]>(lstCTHoaDon.map(() => false)); //expaned cthd
    const [showModalSeachProduct, setShowModalSeachProduct] = useState(false);

    const toggleVisibility = (index: number) => {
        const updatedVisibility = [...itemVisibility];
        updatedVisibility[index] = !updatedVisibility[index];
        setItemVisibility(updatedVisibility);
    };

    React.useEffect(() => {
        setIsSave(false);
        setLstCTHoaDon(hoadonChiTiet);

        if (formType === 0) {
            setLstCTHoaDon(
                hoadonChiTiet.map((item: PageHoaDonChiTietDto) => {
                    return {
                        ...item,
                        expanded: true
                    };
                })
            );
        } else {
            setItemVisibility([true]);
        }

        console.log('into _ModalEditChiTietGioHang');
    }, [isShow]);

    const handleChangeGiaBan = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item: any) => {
                if (item.id === id) {
                    const giaBanNew = Utils.formatNumberToFloat(event.target.value);
                    let dongiaSauCK = item.donGiaSauCK;
                    let tienCK = item.tienChietKhau;
                    if (item.ptChietKhau > 0) {
                        tienCK = (item.ptChietKhau * giaBanNew) / 100;
                        dongiaSauCK = giaBanNew - tienCK;
                    } else {
                        tienCK = 0; // reset tienCK if change dongia
                        dongiaSauCK = giaBanNew;
                    }

                    return {
                        ...item,
                        tienChietKhau: tienCK,
                        donGiaSauCK: dongiaSauCK,
                        donGiaTruocCK: giaBanNew,
                        donGiaSauVAT: dongiaSauCK,
                        thanhTienTruocCK: giaBanNew * item.soLuong,
                        thanhTienSauCK: dongiaSauCK * item.soLuong,
                        thanhTienSauVAT: dongiaSauCK * item.soLuong
                    };
                } else {
                    return item;
                }
            })
        );
    };

    const handleChangeSoLuong = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item: any, index: number) => {
                if (item.id === id) {
                    const sluongNew = Utils.formatNumberToFloat(event.target.value);
                    return {
                        ...item,
                        soLuong: sluongNew,
                        thanhTienTruocCK: sluongNew * item.donGiaTruocCK,
                        thanhTienSauCK: sluongNew * item.donGiaSauCK,
                        thanhTienSauVAT: sluongNew * item.donGiaSauVAT
                    };
                } else {
                    return item;
                }
            })
        );
    };

    const tangSoLuong = (id: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item: any) => {
                if (item.id === id) {
                    const sluongNew = item.soLuong + 1;
                    return {
                        ...item,
                        soLuong: sluongNew,
                        thanhTienTruocCK: sluongNew * item.donGiaTruocCK,
                        thanhTienSauCK: sluongNew * item.donGiaSauCK,
                        thanhTienSauVAT: sluongNew * item.donGiaSauVAT
                    };
                } else {
                    return item;
                }
            })
        );
    };
    const giamSoLuong = (id: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item: any, index: number) => {
                if (item.id === id) {
                    const sluongNew = item.soLuong > 0 ? item.soLuong - 1 : 0;
                    return {
                        ...item,
                        soLuong: sluongNew,
                        thanhTienTruocCK: sluongNew * item.donGiaTruocCK,
                        thanhTienSauCK: sluongNew * item.donGiaSauCK,
                        thanhTienSauVAT: sluongNew * item.donGiaSauVAT
                    };
                } else {
                    return item;
                }
            })
        );
    };

    const choseProduct = (productChosed: any, indexCT: any) => {
        if (productChosed === null) {
            setLstCTHoaDon(
                lstCTHoaDon.map((item: any, index: number) => {
                    if (index === indexCT) {
                        return {
                            ...item,
                            tenHangHoa: '',
                            maHangHoa: '',
                            id: null,
                            idDonViQuyDoi: null,
                            idHangHoa: null
                        };
                    } else {
                        return item;
                    }
                })
            );
        } else {
            setLstCTHoaDon(
                lstCTHoaDon.map((item: PageHoaDonChiTietDto, index: number) => {
                    if (index === indexCT) {
                        const ptChietKhau = item?.ptChietKhau ?? 0;
                        let tienCK = item?.tienChietKhau ?? 0;
                        let dongiasauCK = item?.donGiaSauCK ?? 0;
                        if (ptChietKhau ?? 0 > 0) {
                            tienCK = (ptChietKhau * productChosed.giaBan) / 100;
                            dongiasauCK = productChosed.giaBan - tienCK;
                        } else {
                            if (tienCK > productChosed.giaBan) {
                                tienCK = 0;
                                dongiasauCK = productChosed.giaBan;
                            } else {
                                dongiasauCK = productChosed.giaBan - tienCK;
                            }
                        }

                        return {
                            ...item,
                            idHangHoa: productChosed.idHangHoa,
                            idDonViQuyDoi: productChosed.idDonViQuyDoi,
                            idNhomHangHoa: productChosed.idNhomHangHoa,
                            maHangHoa: productChosed.maHangHoa,
                            tenHangHoa: productChosed.tenHangHoa,
                            donGiaTruocCK: productChosed.giaBan,
                            thanhTienTruocCK: productChosed.giaBan * item.soLuong,
                            donGiaSauCK: dongiasauCK,
                            thanhTienSauCK: dongiasauCK * item.soLuong,
                            donGiaSauVAT: dongiasauCK,
                            thanhTienSauVAT: dongiasauCK * item.soLuong
                        };
                    } else {
                        return item;
                    }
                })
            );
        }
    };

    const changeLoaiChietKhau = (laPhanTramNew: boolean, idCTHD: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item: PageHoaDonChiTietDto) => {
                if (item.id === idCTHD) {
                    const laPhanTramOld = item?.laPTChietKhau;
                    const giaBan = item?.donGiaTruocCK ?? 0;

                    let ptCKNew = 0,
                        tienCKNew = item?.tienChietKhau ?? 0;
                    if (laPhanTramOld) {
                        if (!laPhanTramNew) {
                            // % to vnd
                            tienCKNew = ((item?.ptChietKhau ?? 0) * giaBan) / 100;
                        }
                    } else {
                        if (laPhanTramNew) {
                            // vnd to %
                            ptCKNew = giaBan > 0 ? ((item?.tienChietKhau ?? 0) / giaBan) * 100 : 0;
                        }
                    }
                    const dongiasauCK = giaBan - tienCKNew;
                    return {
                        ...item,
                        laPTChietKhau: laPhanTramNew,
                        ptChietKhau: ptCKNew,
                        tienChietKhau: tienCKNew,
                        donGiaSauCK: dongiasauCK,
                        thanhTienSauCK: dongiasauCK * item.soLuong,
                        donGiaSauVAT: dongiasauCK,
                        thanhTienSauVAT: dongiasauCK * item.soLuong
                    };
                } else {
                    return item;
                }
            })
        );
    };

    const changeGtriChietKhau = (gtriCK: any, idCTHD: string) => {
        const gtriCKNew = Utils.formatNumberToFloat(gtriCK);
        setLstCTHoaDon(
            lstCTHoaDon.map((item: PageHoaDonChiTietDto) => {
                if (item.id === idCTHD) {
                    const laPtram = item.laPTChietKhau;
                    let tienCK = gtriCKNew;
                    if (laPtram) {
                        tienCK = (gtriCKNew * item.donGiaTruocCK) / 100;
                    }

                    const dongiasauCK = item.donGiaTruocCK - tienCK;
                    return {
                        ...item,
                        ptChietKhau: laPtram ? gtriCKNew : 0,
                        tienChietKhau: tienCK,
                        donGiaSauCK: dongiasauCK,
                        donGiaSauVAT: dongiasauCK,
                        thanhTienSauCK: dongiasauCK * item.soLuong,
                        thanhTienSauVAT: dongiasauCK * item.soLuong
                    };
                } else {
                    return item;
                }
            })
        );
    };

    const xoaChiTietHoaDon = (item: PageHoaDonChiTietDto) => {
        setLstCTHoaDon(lstCTHoaDon.filter((x: PageHoaDonChiTietDto) => x.id !== item.id));
    };

    const addNewChiTiet = (item: any) => {
        const ctNew = new PageHoaDonChiTietDto({
            maHangHoa: item.mahangHoa,
            tenHangHoa: item.tenHangHoa,
            idDonViQuyDoi: item.idDonViQuyDoi,
            idHangHoa: item.idHangHoa,
            idNhomHangHoa: item.idNhomHangHoa,
            giaBan: item.giaBan
        });
        const checkCT = lstCTHoaDon.filter(
            (x: PageHoaDonChiTietDto) => x.idDonViQuyDoi === item.idDonViQuyDoi
        );
        console.log('checkCT ', checkCT);
        if (checkCT.length === 0) {
            // unshift
            setLstCTHoaDon([ctNew, ...lstCTHoaDon]);
        } else {
            const sluongNew = checkCT[0].soLuong + 1;
            // don't remove: keep id at db
            setLstCTHoaDon(
                lstCTHoaDon.map((itemCT: PageHoaDonChiTietDto) => {
                    if (itemCT.id === checkCT[0].id) {
                        return {
                            ...itemCT,
                            soLuong: sluongNew,
                            thanhTienSauCK: (itemCT.donGiaSauCK ?? 0) * sluongNew,
                            thanhTienSauVAT: (itemCT.donGiaSauVAT ?? 0) * sluongNew
                        };
                    } else {
                        return itemCT;
                    }
                })
            );
        }
        setShowModalSeachProduct(false);
    };

    const closeModal = () => {
        setIsSave(false);
        handleClose();
    };

    const agrreGioHang = async () => {
        setIsSave(true);
        if (formType === 1) {
            handleSave(lstCTHoaDon[0]); // object
        } else {
            // update Db
            handleSave(lstCTHoaDon);

            // assign again STT of cthd before save
            const dataSave = [...lstCTHoaDon];
            dataSave.map((x: PageHoaDonChiTietDto, index: number) => {
                x.stt = index + 1;
            });
            await HoaDonService.Update_ChiTietHoaDon(lstCTHoaDon, hoadonChiTiet[0]?.idHoaDon);
        }
    };

    return (
        <>
            <ModalSearchProduct
                isShow={showModalSeachProduct}
                handlClose={() => setShowModalSeachProduct(false)}
                handleChoseProduct={addNewChiTiet}
            />
            <Dialog open={isShow} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle className="dialog-title">Chỉnh sửa giỏ hàng</DialogTitle>
                <DialogContent>
                    {/* 1 row */}
                    {lstCTHoaDon.map((ct: any, index: number) => (
                        <Grid
                            container
                            key={index}
                            padding={2.5}
                            paddingLeft={formType === 1 ? '20px' : '10px'}
                            border={1}
                            borderColor="#cccc"
                            borderRadius={1}
                            marginBottom={formType === 1 ? 0 : '10px'}>
                            <Grid
                                item
                                xs={formType === 1 ? 0 : 2}
                                sm={formType === 1 ? 0 : 1}
                                md={formType === 1 ? 0 : 1}
                                lg={formType === 1 ? 0 : 1}
                                style={{ display: displayComponent }}>
                                <Close
                                    sx={{ width: 40, height: 40, color: 'red', padding: '8px' }}
                                    onClick={() => xoaChiTietHoaDon(ct)}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={formType === 1 ? 12 : 10}
                                sm={formType === 1 ? 12 : 11}
                                md={formType === 1 ? 12 : 11}
                                lg={formType === 1 ? 12 : 11}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={9} md={9} lg={9}>
                                        <Typography
                                            style={{
                                                fontWeight: 600,
                                                display: formType === 3 ? 'none' : ''
                                            }}>
                                            {ct?.tenHangHoa}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={formType === 1 ? 12 : 10}
                                        sm={formType === 1 ? 3 : 1}
                                        md={formType === 1 ? 3 : 2}
                                        lg={formType === 1 ? 3 : 2}>
                                        <Stack direction="row" spacing={1} justifyContent="end">
                                            <Typography
                                                style={{
                                                    fontWeight: 500,
                                                    textAlign: 'right',
                                                    color: '#7c3367'
                                                }}>
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    ct?.thanhTienSauVAT
                                                )}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    {/* // man hinh thu ngan: khong hien icon toogle  */}
                                    {formType !== 1 && (
                                        <Grid item xs={2} sm={1} md={1} lg={1}>
                                            <Box onClick={() => toggleVisibility(index)}>
                                                <ExpandMore
                                                    sx={{
                                                        display:
                                                            formType !== 1 && !itemVisibility[index]
                                                                ? ''
                                                                : 'none'
                                                    }}
                                                />
                                                <ExpandLess
                                                    sx={{
                                                        display:
                                                            formType !== 1 && itemVisibility[index]
                                                                ? ''
                                                                : 'none'
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    )}

                                    <Grid item xs={12} sm={7} md={7} lg={7}>
                                        <Stack direction="column" spacing={1}>
                                            <Typography variant="body2">Giá bán</Typography>

                                            <NumericFormat
                                                size="small"
                                                fullWidth
                                                value={ct.donGiaTruocCK}
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                customInput={TextField}
                                                onChange={(event: any) =>
                                                    handleChangeGiaBan(event, ct.id)
                                                }
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={5} md={5} lg={5}>
                                        <Stack direction="column" spacing={1}>
                                            <Typography
                                                sx={{
                                                    textAlign: {
                                                        lg: 'center',
                                                        md: 'center',
                                                        xs: 'left'
                                                    }
                                                }}
                                                variant="body2">
                                                Số lượng
                                            </Typography>
                                            <Stack direction="row" spacing={1}>
                                                <Remove
                                                    className="btnIcon"
                                                    onClick={() => giamSoLuong(ct.id)}
                                                />
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    value={ct.soLuong}
                                                    onChange={(event: any) =>
                                                        handleChangeSoLuong(event, ct.id)
                                                    }></TextField>
                                                <Add
                                                    className="btnIcon"
                                                    onClick={() => tangSoLuong(ct.id)}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        md={7}
                                        lg={7}
                                        sm={7}
                                        sx={{
                                            display: itemVisibility[index] ? '' : 'none'
                                        }}>
                                        <Stack direction="column" spacing={1}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Stack direction="row" spacing={1}>
                                                    <Typography variant="body2">
                                                        Chiết khấu
                                                    </Typography>
                                                    <span
                                                        style={{
                                                            fontSize: '10px',
                                                            textAlign: 'right',
                                                            float: 'right',
                                                            color: 'red',
                                                            display: 'none'
                                                        }}>
                                                        -{Utils.formatNumber(ct?.tienChietKhau)}
                                                    </span>
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    spacing="4px"
                                                    style={{
                                                        fontSize: '10px',
                                                        textAlign: 'right',
                                                        float: 'right',
                                                        color: 'red',
                                                        display: ct?.tienChietKhau > 0 ? '' : 'none'
                                                    }}>
                                                    -
                                                    {new Intl.NumberFormat('vi-VN').format(
                                                        ct?.tienChietKhau
                                                    )}
                                                </Stack>
                                            </Stack>

                                            <NumericFormat
                                                size="small"
                                                fullWidth
                                                value={
                                                    ct.ptChietKhau > 0
                                                        ? ct.ptChietKhau
                                                        : ct.tienChietKhau
                                                }
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                customInput={TextField}
                                                onChange={(event: any) =>
                                                    changeGtriChietKhau(event.target.value, ct.id)
                                                }
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        md={5}
                                        lg={5}
                                        sm={5}
                                        sx={{
                                            display: itemVisibility[index] ? '' : 'none'
                                        }}>
                                        <ButtonGroup style={{ paddingTop: '28px' }} fullWidth>
                                            <Button
                                                className={
                                                    ct.laPTChietKhau
                                                        ? 'button-outline'
                                                        : 'button-not-active'
                                                }
                                                onClick={() => changeLoaiChietKhau(true, ct.id)}>
                                                %
                                            </Button>
                                            <Button
                                                className={
                                                    !ct.laPTChietKhau
                                                        ? 'button-outline'
                                                        : 'button-not-active'
                                                }
                                                onClick={() => changeLoaiChietKhau(false, ct.id)}>
                                                đ
                                            </Button>
                                        </ButtonGroup>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        style={{ display: 'none' }}>
                                        <Stack direction="column" spacing={1}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Stack direction="row" spacing={1}>
                                                    <Typography variant="body2">
                                                        Chiết khấu
                                                    </Typography>
                                                    <span
                                                        style={{
                                                            fontSize: '10px',
                                                            textAlign: 'right',
                                                            float: 'right',
                                                            color: 'red',
                                                            display: 'none'
                                                        }}>
                                                        -{Utils.formatNumber(ct?.tienChietKhau)}
                                                    </span>
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    spacing="4px"
                                                    style={{
                                                        fontSize: '10px',
                                                        textAlign: 'right',
                                                        float: 'right',
                                                        color: 'red',
                                                        display: ct?.tienChietKhau > 0 ? '' : 'none'
                                                    }}>
                                                    <span>
                                                        -
                                                        {new Intl.NumberFormat('vi-VN').format(
                                                            ct?.tienChietKhau
                                                        )}
                                                    </span>
                                                </Stack>
                                            </Stack>

                                            <NumericFormat
                                                size="small"
                                                fullWidth
                                                value={
                                                    ct.ptChietKhau > 0
                                                        ? ct.ptChietKhau
                                                        : ct.tienChietKhau
                                                }
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                customInput={TextField}
                                                onChange={(event: any) =>
                                                    changeGtriChietKhau(event.target.value, ct.id)
                                                }
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        style={{ display: 'none' }}>
                                        <FormControlLabel
                                            value="true"
                                            control={
                                                <Radio size="small" checked={ct.laPTChietKhau} />
                                            }
                                            label="%"
                                            onChange={() => changeLoaiChietKhau(true, ct.id)}
                                        />
                                        <FormControlLabel
                                            value="false"
                                            control={
                                                <Radio size="small" checked={!ct.laPTChietKhau} />
                                            }
                                            label="đ"
                                            onChange={() => changeLoaiChietKhau(false, ct.id)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                    <Grid container paddingTop={2}>
                        <Grid item xs={1} />
                        <Grid item xs={11}>
                            <Stack style={{ display: displayComponent }}>
                                <Link
                                    color="#7c3367"
                                    sx={{ fontSize: '14px' }}
                                    onClick={() => setShowModalSeachProduct(true)}>
                                    <Add />
                                    Thêm dịch vụ
                                </Link>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* end 1 row */}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" className="button-container" onClick={agrreGioHang}>
                        {formType == 1 ? 'Đồng ý' : 'Lưu'}
                    </Button>
                    <Button variant="outlined" className="button-outline" onClick={closeModal}>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
