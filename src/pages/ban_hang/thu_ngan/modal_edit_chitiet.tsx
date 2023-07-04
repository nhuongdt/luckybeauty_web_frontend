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
    IconButton
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
const gtriCK2 = [0];
export function PopupChietKhau({ props, handleClose, handleChangeChietKhau }: any) {
    const [laPhanTram, setLaPhanTram] = useState('true');
    const [gtriCK, setGtriCK] = useState(0);
    const textInput = useRef<HTMLInputElement>(null);
    useEffect(() => {
        textInput.current?.focus();
    }, []);

    React.useEffect(() => {
        if (props?.item?.ptChietKhau > 0) {
            setLaPhanTram('true');
            setGtriCK(props?.item?.ptChietKhau);
        } else {
            if (props?.item?.tienChietKhau === 0) {
                setLaPhanTram('true');
            } else {
                setLaPhanTram('false');
            }
            setGtriCK(props?.item?.tienChietKhau);
        }
        gtriCK2[0] = gtriCK;
    }, [props?.item]);

    const changeChietKhau = (event: any) => {
        handleChangeChietKhau(laPhanTram, Utils.formatNumberToFloat(event.target.value));
    };

    const handleChangeLoaiChietKhau = (event: any) => {
        setLaPhanTram(event.target.value);
        handleChangeChietKhau(event.target.value, Utils.formatNumberToFloat(gtriCK));
    };

    return (
        <>
            <Popover
                open={props.open}
                anchorEl={props.anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}>
                <Box>
                    <Stack direction="column" spacing={1} padding={2} width={280}>
                        <Typography variant="body2">Chiết khấu</Typography>
                        <Stack direction="row" spacing={1}>
                            <NumericFormat
                                fullWidth
                                id="txtChietKhau"
                                value={gtriCK}
                                size="small"
                                thousandSeparator
                                customInput={TextField}
                                onChange={(event) => changeChietKhau(event.target.value)}
                            />
                            <FormControlLabel
                                value="true"
                                control={<Radio size="small" checked={laPhanTram === 'true'} />}
                                label="%"
                                onChange={(event) => handleChangeLoaiChietKhau(event)}
                            />
                            <FormControlLabel
                                value="false"
                                control={<Radio size="small" checked={laPhanTram === 'false'} />}
                                label="đ"
                                onChange={(event) => handleChangeLoaiChietKhau(event)}
                            />
                        </Stack>
                    </Stack>
                </Box>
            </Popover>
        </>
    );
}

export default function ModalEditChiTietGioHang({
    isShow,
    formType = 0, // 1.form banhang, 0.other
    hoadonChiTiet,
    dataNhanVien = [],
    handleSave,
    handleClose
}: any) {
    const [isSave, setIsSave] = useState(false);
    const [popover, setPopover] = useState({
        anchorEl: null,
        open: false,
        item: { id: '', ptChietKhau: 0, tienChietKhau: 0 }
    });
    const [idCTHD, setIdCTHD] = useState('');
    const [lstCTHoaDon, setLstCTHoaDon] = useState<PageHoaDonChiTietDto[]>([]);

    const displayComponent = formType === 1 ? 'none' : '';

    React.useEffect(() => {
        setIsSave(false);
        setLstCTHoaDon(hoadonChiTiet);
        // if (hoadonChiTiet?.length === 1) setIdCTHD(hoadonChiTiet[0]?.id);

        if (formType === 0) {
            setLstCTHoaDon(
                hoadonChiTiet.map((item: PageHoaDonChiTietDto) => {
                    return {
                        ...item,
                        expanded: true
                    };
                })
            );
        }

        console.log('into _ModalEditChiTietGioHang');
    }, [isShow]);

    const handleChangeGiaBan = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item: any, index: number) => {
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

    const showPopChietKhau = (event: any, item: any) => {
        setPopover({
            anchorEl: event.currentTarget,
            open: true,
            item: { id: item.id, ptChietKhau: item.ptChietKhau, tienChietKhau: item.tienChietKhau }
        });
        setIdCTHD(item.id);
    };
    const hidePopChietKhau = () => {
        setPopover({
            anchorEl: null,
            open: false,
            item: { id: '', ptChietKhau: 0, tienChietKhau: 0 }
        });
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
            lstCTHoaDon.map((item: any, index: number) => {
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

    const changeChietKhau = (laPTram = 'true', gtriCK = 0) => {
        if (laPTram === 'true') {
            setLstCTHoaDon(
                lstCTHoaDon.map((item: any, index: number) => {
                    if (item.id === idCTHD) {
                        const tienCK = (gtriCK * item.donGiaTruocCK) / 100;
                        const dongiasauCK = item.donGiaTruocCK - tienCK;
                        return {
                            ...item,
                            ptChietKhau: gtriCK,
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
        } else {
            setLstCTHoaDon(
                lstCTHoaDon.map((item: any, index: number) => {
                    if (item.id === idCTHD) {
                        const dongiasauCK = item.donGiaTruocCK - gtriCK;
                        return {
                            ...item,
                            ptChietKhau: 0,
                            tienChietKhau: gtriCK,
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
        }
    };

    const xoaChiTietHoaDon = (item: PageHoaDonChiTietDto) => {
        setLstCTHoaDon(lstCTHoaDon.filter((x: PageHoaDonChiTietDto) => x.id !== item.id));
    };

    const addNewChiTiet = () => {
        const newID = Guid.create().toString();
        const ctNew = new PageHoaDonChiTietDto({ id: newID, expanded: true });
        setLstCTHoaDon([...lstCTHoaDon, ctNew]);
        setIdCTHD(newID);
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
    const [itemVisibility, setItemVisibility] = useState<boolean[]>(lstCTHoaDon.map(() => false));

    const toggleVisibility = (index: number) => {
        const updatedVisibility = [...itemVisibility];
        updatedVisibility[index] = !updatedVisibility[index];
        setItemVisibility(updatedVisibility);
    };
    return (
        <>
            <PopupChietKhau
                props={popover}
                handleClose={hidePopChietKhau}
                handleChangeChietKhau={changeChietKhau}
            />
            <Dialog
                open={isShow}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                sx={{ paddingX: '24px' }}>
                <DialogTitle className="dialog-title" fontSize="24px" fontWeight="700">
                    Cập nhật hóa đơn
                </DialogTitle>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: '5px',
                        top: '8px',
                        width: 'fit-content',
                        '& svg': {
                            color: '#666466'
                        },
                        '&:hover svg': {
                            color: 'red'
                        }
                    }}>
                    {' '}
                    <Close />
                </IconButton>
                <DialogContent sx={{ bgcolor: '#F9FAFC' }}>
                    <Typography
                        variant="h4"
                        color="#666466"
                        fontSize="16px"
                        fontWeight="700"
                        mt="24px">
                        Chi tiết hóa đơn
                    </Typography>
                    {/* 1 row */}
                    {lstCTHoaDon.map((ct: any, index: number) => (
                        <Grid
                            container
                            key={index}
                            paddingTop={2}
                            sx={{
                                position: 'relative',
                                marginTop: '16px',
                                bgcolor: '#fff',
                                borderRadius: '8px',
                                '& input': {
                                    fontSize: '14px!important'
                                },
                                '& .itemHidden': {
                                    transition: 'max-height .6s, padding 0.4s',
                                    overflow: 'hidden',
                                    maxHeight: itemVisibility[index] ? '0px' : '135px',
                                    paddingTop: itemVisibility[index] ? '0px' : '16px'
                                }
                            }}>
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    spacing={2}
                                    sx={{
                                        paddingTop: '24px',
                                        paddingBottom: '0px',
                                        bgcolor: '#fff',
                                        margin: '0',
                                        width: '100%',
                                        borderRadius: '8px',
                                        paddingRight: '12px'
                                    }}>
                                    <Grid item xs={12} sm={9} md={9} lg={9}>
                                        <div style={{ display: displayComponent }}>
                                            <AutocompleteProduct
                                                handleChoseItem={(item: any) =>
                                                    choseProduct(item, index)
                                                }
                                                productChosed={ct}
                                                sx={{ fontSize: '14px' }}
                                            />
                                        </div>
                                        <Typography
                                            style={{
                                                fontWeight: 600,
                                                display: formType === 1 ? '' : 'none'
                                            }}>
                                            {ct?.tenHangHoa}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3}>
                                        <Stack direction="row" spacing={1} justifyContent="end">
                                            <Typography
                                                style={{
                                                    fontWeight: 500,
                                                    textAlign: 'right',
                                                    color: '#7c3367'
                                                }}>
                                                {Utils.formatNumber(ct?.thanhTienSauVAT)}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} lg={7} className="itemHidden">
                                        <Stack direction="column" spacing={1}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Stack direction="row" spacing={1}>
                                                    <Typography variant="body2">Giá bán</Typography>
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
                                                        -{' '}
                                                        {ct.ptChietKhau > 0
                                                            ? ct.ptChietKhau
                                                            : Utils.formatNumber(ct?.tienChietKhau)}
                                                    </span>
                                                    <span>{ct.ptChietKhau > 0 ? '%' : 'đ'}</span>
                                                </Stack>
                                            </Stack>

                                            <ThemeProvider theme={themInputChietKhau}>
                                                <NumericFormat
                                                    size="small"
                                                    fullWidth
                                                    value={ct.donGiaTruocCK}
                                                    thousandSeparator
                                                    customInput={TextField}
                                                    onChange={(event: any) =>
                                                        handleChangeGiaBan(event, ct.id)
                                                    }
                                                />
                                            </ThemeProvider>
                                        </Stack>
                                    </Grid>
                                    <Grid
                                        className="itemHidden"
                                        item
                                        xs={5}
                                        sm={5}
                                        md={5}
                                        lg={5}
                                        sx={{ display: 'flex', gap: '16px' }}>
                                        <Stack direction="column" spacing={1}>
                                            <Typography variant="body2">Chiết khấu</Typography>

                                            <NumericFormat
                                                fullWidth
                                                // ô này sẽ hiển thị giá trị của chiết khấu sau khi nhập xong ở trong poppup ví dụ: 100.000đ hoặc 30%
                                                size="small"
                                                defaultValue={0}
                                                thousandSeparator
                                                customInput={TextField}
                                                onClick={(event: any) => {
                                                    showPopChietKhau(event, ct);
                                                }}
                                            />
                                        </Stack>
                                        <Stack direction="column" spacing={1}>
                                            <Typography variant="body2">Số lượng</Typography>

                                            <Stack
                                                direction="row"
                                                sx={{
                                                    '& button': {
                                                        padding: '0',
                                                        border: '1px solid #cccc',
                                                        transition: '.4s',
                                                        cursor: 'pointer',

                                                        minWidth: '30px',
                                                        '& button:hover': {
                                                            borderColor: '#7C3367'
                                                        },
                                                        borderRadius: '4px'
                                                    }
                                                }}>
                                                <Button
                                                    className="btn-outline-hover"
                                                    sx={{
                                                        borderBottomRightRadius: 'unset!important',
                                                        borderTopRightRadius: 'unset!important'
                                                    }}
                                                    onClick={() => giamSoLuong(ct.id)}>
                                                    <RemoveIcon
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: '#4C4B4C'
                                                        }}
                                                        //className="btnIcon"
                                                    />
                                                </Button>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        maxWidth: '54px',
                                                        'input::-webkit-outer-spin-button,input::-webkit-inner-spin-button':
                                                            {
                                                                WebkitAppearance: 'none'
                                                            },
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 'unset',
                                                            borderX: 'unset'
                                                        },
                                                        bgcolor: '#F5F5F5'
                                                    }}
                                                    type="number"
                                                    inputProps={{ min: 0 }}
                                                    value={ct.soLuong}
                                                    onChange={(event: any) =>
                                                        handleChangeSoLuong(event, ct.id)
                                                    }
                                                />
                                                <Button
                                                    className="btn-outline-hover"
                                                    sx={{
                                                        borderTopLeftRadius: '0!important',
                                                        borderBottomLeftRadius: '0!important'
                                                    }}
                                                    onClick={() => tangSoLuong(ct.id)}>
                                                    <AddIcon
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: '#4C4B4C'
                                                        }}
                                                        //className="btnIcon"
                                                    />
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} style={{ display: 'none' }}>
                                        <Stack direction="column" spacing={1}>
                                            <Typography variant="body2">Nhân viên </Typography>
                                            <Autocomplete
                                                size="small"
                                                fullWidth
                                                multiple
                                                isOptionEqualToValue={(option, value) =>
                                                    option.id === value.id
                                                }
                                                options={dataNhanVien}
                                                getOptionLabel={(option: any) =>
                                                    option.tenNhanVien ? option.tenNhanVien : ''
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Chọn nhân viên"
                                                    />
                                                )}
                                                renderOption={(props, option) => {
                                                    return (
                                                        <li {...props}>
                                                            <Grid container alignItems="center">
                                                                <Grid
                                                                    item
                                                                    sx={{
                                                                        display: 'flex',
                                                                        width: 44
                                                                    }}>
                                                                    <Avatar />
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    sx={{
                                                                        width: 'calc(100% - 44px)',
                                                                        wordWrap: 'break-word'
                                                                    }}>
                                                                    <Typography
                                                                        style={{
                                                                            fontSize: '14px'
                                                                        }}>
                                                                        {option.tenNhanVien}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </li>
                                                    );
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Close
                                        sx={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '12px',
                                            width: 30,
                                            height: 30,
                                            color: '#666466',
                                            padding: '8px',
                                            cursor: 'pointer',
                                            transition: '.4s',
                                            '&:hover': {
                                                color: 'red'
                                            }
                                        }}
                                        onClick={() => xoaChiTietHoaDon(ct)}
                                    />
                                </Grid>
                                <Box sx={{ textAlign: 'right' }}>
                                    <IconButton
                                        onClick={() => toggleVisibility(index)}
                                        sx={{
                                            width: 'fit-content',
                                            marginLeft: 'auto!important',
                                            '&:hover svg': {
                                                color: '#7C3367'
                                            }
                                        }}>
                                        <ExpandMore
                                            sx={{
                                                display: itemVisibility[index] ? '' : 'none'
                                            }}
                                        />
                                        <ExpandLess
                                            sx={{
                                                display: !itemVisibility[index] ? '' : 'none'
                                            }}
                                        />
                                    </IconButton>
                                </Box>
                            </Grid>
                        </Grid>
                    ))}
                    <Grid container paddingTop={2}>
                        <Grid item xs={12}>
                            <Stack style={{ display: displayComponent }}>
                                <Link
                                    color="#7c3367"
                                    sx={{ fontSize: '14px' }}
                                    onClick={addNewChiTiet}>
                                    <Add />
                                    Thêm dịch vụ
                                </Link>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* end 1 row */}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        className="button-outline btn-outline-hover"
                        onClick={closeModal}
                        sx={{ color: '#965C85' }}>
                        Hủy
                    </Button>

                    <Button
                        className="btn-container-hover"
                        variant="contained"
                        sx={{ background: '#7c3367', color: '#FFF', textTransform: 'capitalize' }}
                        onClick={agrreGioHang}>
                        {formType == 1 ? 'Đồng ý' : 'Lưu'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
