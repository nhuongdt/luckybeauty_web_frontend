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
    Link
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
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import Utils from '../../utils/utils'; // func common
import AutocompleteProduct from '../../components/Autocomplete/Product';
import { NumericFormat } from 'react-number-format';

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
                setGtriCK(props?.item?.tienChietKhau);
            } else {
                setLaPhanTram('false');
                setGtriCK(props?.item?.ptChietKhau);
            }
        }
        document.getElementById('txtChietKhau')?.focus();
        console.log(1, document.getElementById('txtChietKhau'));
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
                                onChange={(event) => changeChietKhau(event)}
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
    trigger,
    handleSave,
    dataNhanVien,
    formType = 1 // 1.form banhang, 0.other
}: any) {
    const [isShow, setIsShow] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [popover, setPopover] = useState({
        anchorEl: null,
        open: false,
        item: { id: '', ptChietKhau: 0, tienChietKhau: 0 }
    });
    const [idCTHD, setIdCTHD] = useState('');
    const [lstCTHoaDon, setLstCTHoaDon] = useState<PageHoaDonChiTietDto[]>([]);

    const displayComponent = formType === 1 ? 'none' : '';

    console.log('ModalEditChiTietGioHang ', trigger.item);
    React.useEffect(() => {
        if (trigger.isShow) {
            setIsShow(true);
            setIsSave(false);
            if (formType === 1) {
                setLstCTHoaDon([trigger.item]);
                setIdCTHD(trigger?.item?.id);
            } else {
                // get all cthd by IdHoaDon / or get cthd by this id
                console.log('todo');
            }
        }
        return () => setIsShow(false); // chưa biết chỗ return này có mục đích gì, viết vậy thôi
    }, [trigger]);

    const handleChangeGiaBan = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item: any, index: number) => {
                if (item.id === id) {
                    const giaBanNew = Utils.formatNumberToFloat(event.target.value);
                    let dongiaSauCK = item.donGiaSauCK;
                    let tienCK = item.tienChietKhau;
                    if (item.pTChietKhau > 0) {
                        tienCK = (item.pTChietKhau * giaBanNew) / 100;
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
            item: { id: item.id, ptChietKhau: item.pTChietKhau, tienChietKhau: item.tienChietKhau }
        });
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
                    const sluongNew = item.soLuong - 1;
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

    const choseProduct = (item: any) => {
        // todo check id
        if (item === null) {
            setLstCTHoaDon(
                lstCTHoaDon.map((item: any, index: number) => {
                    if (item.id === idCTHD) {
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
                lstCTHoaDon.map((item: any, index: number) => {
                    if (item.id === idCTHD) {
                        return {
                            ...item,
                            idHangHoa: item.id,
                            idDonViQuyDoi: item.idDonViQuyDoi,
                            idNhomHangHoa: item.idNhomHangHoa,
                            maHangHoa: item.maHangHoa,
                            tenHangHoa: item.tenHangHoa,
                            donGiaTruocCK: item.giaBan,
                            thanhTienTruocCK: item.giaBan * item.soLuong
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
                            pTChietKhau: gtriCK,
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
                            pTChietKhau: 0,
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

    const agrreGioHang = () => {
        setIsShow(false);
        setIsSave(true);
        handleSave(lstCTHoaDon[0]);
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
                onClose={() => {
                    setIsShow(false);
                    setIsSave(false);
                }}
                fullWidth
                maxWidth="sm">
                <DialogTitle className="dialog-title">Chỉnh sửa giỏ hàng</DialogTitle>
                <DialogContent>
                    {/* 1 row */}
                    {lstCTHoaDon.map((ct: any, index: number) => (
                        <Grid container key={index}>
                            <Grid
                                item
                                xs={formType === 1 ? 0 : 1}
                                style={{ display: displayComponent }}>
                                <Close
                                    sx={{ width: 40, height: 40, color: 'red', padding: '8px' }}
                                />
                            </Grid>
                            <Grid item xs={formType === 1 ? 12 : 11}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={9} md={9} lg={9}>
                                        <div style={{ display: displayComponent }}>
                                            <AutocompleteProduct
                                                handleChoseItem={choseProduct}
                                                productChosed={ct}
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
                                            <ExpandMore sx={{ display: displayComponent }} />
                                            <ExpandLess sx={{ display: displayComponent }} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={7} sm={7} md={7} lg={7}>
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
                                                        {ct.pTChietKhau > 0
                                                            ? ct.pTChietKhau
                                                            : Utils.formatNumber(ct?.tienChietKhau)}
                                                    </span>
                                                    <span>{ct.pTChietKhau > 0 ? '%' : 'đ'}</span>
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
                                                    InputProps={{
                                                        endAdornment: (
                                                            <ToggleButton
                                                                value="bold"
                                                                aria-label="bold"
                                                                size="small"
                                                                title="Chiết khấu"
                                                                onClick={(event) => {
                                                                    showPopChietKhau(event, ct);
                                                                }}>
                                                                <MoreHoriz />
                                                            </ToggleButton>
                                                        )
                                                    }}
                                                />
                                            </ThemeProvider>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={5} sm={5} md={5} lg={5}>
                                        <Stack direction="column" spacing={1}>
                                            <Typography
                                                sx={{ textAlign: 'center' }}
                                                variant="body2">
                                                Số lượng
                                            </Typography>
                                            <Stack direction="row" spacing={1}>
                                                <Remove
                                                    sx={{
                                                        border: '1px solid #cccc',
                                                        borderRadius: '4px',
                                                        height: '40px',
                                                        width: '40px',
                                                        padding: '10px'
                                                    }}
                                                    //className="btnIcon"
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
                                                    sx={{
                                                        border: '1px solid #cccc',
                                                        borderRadius: '4px',
                                                        height: '40px',
                                                        width: '40px',
                                                        padding: '10px'
                                                    }}
                                                    //className="btnIcon"
                                                    onClick={() => tangSoLuong(ct.id)}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        style={{ display: 'none' }}>
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
                                </Grid>

                                <Stack paddingTop={2} style={{ display: displayComponent }}>
                                    <Link color="#7c3367" sx={{ fontSize: '14px' }}>
                                        <Add />
                                        Thêm dịch vụ
                                    </Link>
                                </Stack>
                            </Grid>
                        </Grid>
                    ))}

                    {/* end 1 row */}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        sx={{
                            color: '#7c3367',
                            borderColor: '#7c3367',
                            textTransform: 'capitalize'
                        }}
                        //className="button-outline"
                        onClick={() => {
                            setIsShow(false);
                            setIsSave(false);
                        }}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        //className="button-container"
                        sx={{ background: '#7c3367', color: '#FFF', textTransform: 'capitalize' }}
                        onClick={agrreGioHang}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
