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
    FormControlLabel,
    Box,
    Link,
    IconButton,
    ButtonGroup
} from '@mui/material';
import { Add, Remove, ExpandMore, ExpandLess, Close } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';
import PageHoaDonChiTietDto from '../../../services/ban_hang/PageHoaDonChiTietDto';
import Utils from '../../../utils/utils'; // func common
import { NumericFormat } from 'react-number-format';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
import ModalSearchProduct from '../../product/modal_search_product';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
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

export const ConstFormNumber = {
    BAN_HANG: 1,
    OTHER: 0
};

export default function ModalEditChiTietGioHang({
    isShow,
    formType = 0, // 1.form banhang, 0.other
    hoadonChiTiet,
    handleSave,
    handleClose
}: any) {
    const [isSave, setIsSave] = useState(false);

    const [idCTHD, setIdCTHD] = useState('');
    const [lstCTHoaDon, setLstCTHoaDon] = useState<PageHoaDonChiTietDto[]>([]);
    const displayComponent = formType === ConstFormNumber.BAN_HANG ? 'none' : '';
    const [itemVisibility, setItemVisibility] = useState<boolean[]>(lstCTHoaDon.map(() => false)); //expaned cthd
    const [showModalSeachProduct, setShowModalSeachProduct] = useState(false);

    const toggleVisibility = (index: number) => {
        const updatedVisibility = [...itemVisibility];
        updatedVisibility[index] = !updatedVisibility[index];
        setItemVisibility(updatedVisibility);
    };

    React.useEffect(() => {
        setIsSave(false);
        const arr = hoadonChiTiet.map((ct: PageHoaDonChiTietDto) => {
            return {
                ...ct,
                laPTChietKhau: (ct?.ptChietKhau ?? 0) > 0 || (ct?.tienChietKhau ?? 0) === 0
            };
        });
        setLstCTHoaDon(arr);

        if (formType === ConstFormNumber.OTHER) {
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
    }, [isShow]);

    const handleChangeGiaBan = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item) => {
                if (item.id === id) {
                    const giaBanNew = Utils.formatNumberToFloat(event.target.value);
                    let dongiaSauCK = item.donGiaSauCK;
                    let tienCK = item.tienChietKhau;
                    if ((item?.ptChietKhau ?? 0) > 0) {
                        tienCK = ((item?.ptChietKhau ?? 0) * giaBanNew) / 100;
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

    const handleChangeSoLuong = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item) => {
                if (item.id === id) {
                    const sluongNew = Utils.formatNumberToFloat(event.target.value);
                    return {
                        ...item,
                        soLuong: sluongNew,
                        thanhTienTruocCK: sluongNew * item.donGiaTruocCK,
                        thanhTienSauCK: sluongNew * (item?.donGiaSauCK ?? 0),
                        thanhTienSauVAT: sluongNew * (item?.donGiaSauVAT ?? 0)
                    };
                } else {
                    return item;
                }
            })
        );
    };

    const tangSoLuong = (id: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item) => {
                if (item.id === id) {
                    const sluongNew = item.soLuong + 1;
                    return {
                        ...item,
                        soLuong: sluongNew,
                        thanhTienTruocCK: sluongNew * (item?.donGiaTruocCK ?? 0),
                        thanhTienSauCK: sluongNew * (item?.donGiaSauCK ?? 0),
                        thanhTienSauVAT: sluongNew * (item?.donGiaSauVAT ?? 0)
                    };
                } else {
                    return item;
                }
            })
        );
    };
    const giamSoLuong = (id: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item) => {
                if (item.id === id) {
                    const sluongNew = item.soLuong > 0 ? item.soLuong - 1 : 0;
                    return {
                        ...item,
                        soLuong: sluongNew,
                        thanhTienTruocCK: sluongNew * (item?.donGiaTruocCK ?? 0),
                        thanhTienSauCK: sluongNew * (item?.donGiaSauCK ?? 0),
                        thanhTienSauVAT: sluongNew * (item?.donGiaSauVAT ?? 0)
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
                        } else {
                            // keep %
                            ptCKNew = item?.ptChietKhau ?? 0;
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
            maHangHoa: item?.maHangHoa,
            tenHangHoa: item.tenHangHoa,
            idDonViQuyDoi: item.idDonViQuyDoi,
            idHangHoa: item.idHangHoa,
            idNhomHangHoa: item.idNhomHangHoa,
            giaBan: item.giaBan
        });
        const checkCT = lstCTHoaDon.filter((x: PageHoaDonChiTietDto) => x.idDonViQuyDoi === item.idDonViQuyDoi);
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
        if (formType === ConstFormNumber.BAN_HANG) {
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
    const chietKhau = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

    const onClickPtramChietKhau = (gtri: number, idCTHD: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item: PageHoaDonChiTietDto) => {
                if (item.id === idCTHD) {
                    const tienCK = (gtri * item.donGiaTruocCK) / 100;
                    const dongiasauCK = item.donGiaTruocCK - tienCK;
                    return {
                        ...item,
                        ptChietKhau: gtri,
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

    return (
        <>
            <ModalSearchProduct
                isShow={showModalSeachProduct}
                handlClose={() => setShowModalSeachProduct(false)}
                handleChoseProduct={addNewChiTiet}
            />
            <Dialog open={isShow} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ color: '#29303D', fontWeight: '700', fontSize: '24px' }}>
                    Chỉnh sửa giỏ hàng
                </DialogTitle>
                <IconButton
                    onClick={closeModal}
                    sx={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        '&:hover svg': {
                            filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                        }
                    }}>
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ paddingTop: 0 }}>
                    {/* 1 row */}
                    {lstCTHoaDon.map((ct: PageHoaDonChiTietDto, index: number) => (
                        <Grid
                            container
                            key={index}
                            padding="16px 0px"
                            borderBottom={formType === ConstFormNumber.BAN_HANG ? '' : '1px dashed green'}
                            borderRadius={1}
                            marginBottom={formType === ConstFormNumber.BAN_HANG ? 0 : '10px'}>
                            <Grid
                                item
                                xs={formType === ConstFormNumber.BAN_HANG ? 0 : 2}
                                sm={formType === ConstFormNumber.BAN_HANG ? 0 : 1}
                                md={formType === ConstFormNumber.BAN_HANG ? 0 : 1}
                                lg={formType === ConstFormNumber.BAN_HANG ? 0 : 1}
                                sx={{
                                    display: displayComponent
                                }}>
                                <Close
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        color: 'red',
                                        padding: '8px',
                                        marginTop: '-10px'
                                    }}
                                    onClick={() => xoaChiTietHoaDon(ct)}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={formType === ConstFormNumber.BAN_HANG ? 12 : 10}
                                sm={formType === ConstFormNumber.BAN_HANG ? 12 : 11}
                                md={formType === ConstFormNumber.BAN_HANG ? 12 : 11}
                                lg={formType === ConstFormNumber.BAN_HANG ? 12 : 11}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={9} md={9} lg={9}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                                // maxWidth: '80%'
                                            }}>
                                            {/* <Box
                                                sx={{
                                                    bgcolor: '#E5F3FF',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '4px'
                                                }}></Box> */}
                                            <Typography
                                                title={ct?.tenHangHoa}
                                                sx={{
                                                    fontWeight: 600,
                                                    display: formType === 3 ? 'none' : '',
                                                    color: '#3B4758',
                                                    maxWidth: 'calc(100% - 48px)',
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                {ct?.tenHangHoa}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={formType === ConstFormNumber.BAN_HANG ? 12 : 10}
                                        sm={formType === ConstFormNumber.BAN_HANG ? 3 : 1}
                                        md={formType === ConstFormNumber.BAN_HANG ? 3 : 2}
                                        lg={formType === ConstFormNumber.BAN_HANG ? 3 : 2}>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="end"
                                            height="100%"
                                            alignItems="center">
                                            <Typography
                                                sx={{
                                                    fontWeight: 500,
                                                    textAlign: 'right',
                                                    color: 'var(--color-main)'
                                                }}>
                                                {new Intl.NumberFormat('vi-VN').format(ct?.thanhTienSauVAT ?? 0)}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    {/* // man hinh thu ngan: khong hien icon toogle  */}
                                    {formType !== ConstFormNumber.BAN_HANG && (
                                        <Grid item xs={2} sm={1} md={1} lg={1}>
                                            <Box onClick={() => toggleVisibility(index)} sx={{ cursor: 'pointer' }}>
                                                <ExpandMore
                                                    sx={{
                                                        display:
                                                            formType !== ConstFormNumber.BAN_HANG &&
                                                            !itemVisibility[index]
                                                                ? ''
                                                                : 'none'
                                                    }}
                                                />
                                                <ExpandLess
                                                    sx={{
                                                        display:
                                                            formType !== ConstFormNumber.BAN_HANG &&
                                                            itemVisibility[index]
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
                                                onChange={(event) => handleChangeGiaBan(event, ct.id)}
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
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{ '& .btnIcon': { cursor: 'pointer' } }}>
                                                <Remove className="btnIcon" onClick={() => giamSoLuong(ct.id)} />
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    value={ct.soLuong}
                                                    onChange={(event) => handleChangeSoLuong(event, ct.id)}></TextField>
                                                <Add className="btnIcon" onClick={() => tangSoLuong(ct.id)} />
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        md={10}
                                        lg={10}
                                        sm={10}
                                        sx={{
                                            display: itemVisibility[index] ? '' : 'none'
                                        }}>
                                        <Stack direction="column" spacing={1}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Stack direction="row" spacing={1}>
                                                    <Typography variant="body2">Giảm giá</Typography>
                                                    <span
                                                        style={{
                                                            fontSize: '10px',
                                                            textAlign: 'right',
                                                            float: 'right',
                                                            color: 'red',
                                                            display: 'none'
                                                        }}>
                                                        -{new Intl.NumberFormat('vi-VN').format(ct?.tienChietKhau ?? 0)}
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
                                                        display: (ct?.tienChietKhau ?? 0) > 0 ? '' : 'none'
                                                    }}>
                                                    -{new Intl.NumberFormat('vi-VN').format(ct?.tienChietKhau ?? 0)}
                                                </Stack>
                                            </Stack>

                                            <NumericFormat
                                                size="small"
                                                fullWidth
                                                value={(ct.ptChietKhau ?? 0) > 0 ? ct.ptChietKhau : ct.tienChietKhau}
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                customInput={TextField}
                                                onChange={(event) => changeGtriChietKhau(event.target.value, ct.id)}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        md={2}
                                        lg={2}
                                        sm={2}
                                        sx={{
                                            display: itemVisibility[index] ? '' : 'none'
                                        }}>
                                        <ButtonGroup
                                            sx={{
                                                paddingTop: '26.58px',
                                                maxWidth: '100%',
                                                '& button': {
                                                    minWidth: '38px !important',
                                                    height: '35.69px'
                                                }
                                            }}
                                            fullWidth>
                                            <Button
                                                sx={{
                                                    bgcolor: ct.laPTChietKhau ? 'var(--color-main)' : '',
                                                    color: ct.laPTChietKhau ? 'white' : 'var(--color-main)',
                                                    '&:hover ': {
                                                        bgcolor: 'var(--color-main)',
                                                        color: 'white'
                                                    }
                                                }}
                                                onClick={() => changeLoaiChietKhau(true, ct.id)}>
                                                %
                                            </Button>
                                            <Button
                                                sx={{
                                                    bgcolor: !ct.laPTChietKhau ? ' var(--color-main)' : '',
                                                    color: !ct.laPTChietKhau ? 'white' : 'var(--color-main)',
                                                    '&:hover ': {
                                                        bgcolor: 'var(--color-main)',
                                                        color: 'white'
                                                    }
                                                }}
                                                onClick={() => changeLoaiChietKhau(false, ct.id)}>
                                                đ
                                            </Button>
                                        </ButtonGroup>
                                    </Grid>
                                    {formType === ConstFormNumber.BAN_HANG && ct.laPTChietKhau && (
                                        <Grid item xs={12} md={12}>
                                            <Stack spacing={1} direction={'row'} flexWrap="wrap" useFlexGap>
                                                {chietKhau.map((item, index) => (
                                                    <Button
                                                        key={index}
                                                        onClick={() => onClickPtramChietKhau(item, ct.id)}
                                                        sx={{
                                                            minWidth: 'unset',
                                                            flexGrow: '1',
                                                            fontSize: '12px',
                                                            color:
                                                                ct.ptChietKhau === item ? 'white' : 'var(--color-main)',
                                                            paddingY: '8px ',
                                                            textAlign: 'center',
                                                            border: '1px solid var(--color-main)',
                                                            borderRadius: '4px',
                                                            bgcolor: ct.ptChietKhau === item ? 'var(--color-main)' : '',
                                                            '&:hover ': {
                                                                bgcolor: 'var(--color-main)',
                                                                color: 'white'
                                                            }
                                                        }}>
                                                        {item} %
                                                    </Button>
                                                ))}
                                            </Stack>
                                        </Grid>
                                    )}
                                    <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'none' }}>
                                        <Stack direction="column" spacing={1}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Stack direction="row" spacing={1}>
                                                    <Typography variant="body2">Chiết khấu</Typography>
                                                    <span
                                                        style={{
                                                            fontSize: '10px',
                                                            textAlign: 'right',
                                                            float: 'right',
                                                            color: 'red',
                                                            display: 'none'
                                                        }}>
                                                        -{' '}
                                                        {new Intl.NumberFormat('vi-VN').format(ct?.tienChietKhau ?? 0)}
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
                                                        display: (ct?.tienChietKhau ?? 0) > 0 ? '' : 'none'
                                                    }}>
                                                    <span>
                                                        -{new Intl.NumberFormat('vi-VN').format(ct?.tienChietKhau ?? 0)}
                                                    </span>
                                                </Stack>
                                            </Stack>

                                            <NumericFormat
                                                size="small"
                                                fullWidth
                                                value={(ct?.ptChietKhau ?? 0) > 0 ? ct.ptChietKhau : ct.tienChietKhau}
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                customInput={TextField}
                                                onChange={(event) => changeGtriChietKhau(event.target.value, ct.id)}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'none' }}>
                                        <FormControlLabel
                                            value="true"
                                            control={<Radio size="small" checked={ct.laPTChietKhau} />}
                                            label="%"
                                            onChange={() => changeLoaiChietKhau(true, ct.id)}
                                        />
                                        <FormControlLabel
                                            value="false"
                                            control={<Radio size="small" checked={!ct.laPTChietKhau} />}
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
                            <Stack
                                style={{ display: displayComponent }}
                                sx={{
                                    '& a': {
                                        color: 'var(--color-main)'
                                    }
                                }}>
                                <Link
                                    sx={{
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    onClick={() => setShowModalSeachProduct(true)}>
                                    <Add />
                                    Thêm dịch vụ
                                </Link>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* end 1 row */}

                    <Grid item xs={12} md={12}>
                        <Stack spacing={1} direction={'row'} justifyContent={'flex-end'}>
                            <Button variant="outlined" className="button-outline" onClick={closeModal}>
                                Hủy
                            </Button>
                            <Button variant="contained" className="button-container" onClick={agrreGioHang}>
                                Lưu
                            </Button>
                        </Stack>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
