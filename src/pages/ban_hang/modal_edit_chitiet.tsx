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
import { Guid } from 'guid-typescript';
import HoaDonService from '../../services/ban_hang/HoaDonService';

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
            } else {
                setLaPhanTram('false');
            }
            setGtriCK(props?.item?.tienChietKhau);
        }
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
                        const ptChietKhau = item?.pTChietKhau ?? 0;
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
            handleSave(lstCTHoaDon); // lst object
            await HoaDonService.Update_ChiTietHoaDon(lstCTHoaDon, hoadonChiTiet[0]?.idHoaDon);
        }
    };

    return (
        <>
            <PopupChietKhau
                props={popover}
                handleClose={hidePopChietKhau}
                handleChangeChietKhau={changeChietKhau}
            />
            <Dialog open={isShow} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle className="dialog-title">Chỉnh sửa giỏ hàng</DialogTitle>
                <DialogContent>
                    {/* 1 row */}
                    {lstCTHoaDon.map((ct: any, index: number) => (
                        <Grid container key={index} paddingTop={2}>
                            <Grid
                                item
                                xs={formType === 1 ? 0 : 1}
                                style={{ display: displayComponent }}>
                                <Close
                                    sx={{ width: 40, height: 40, color: 'red', padding: '8px' }}
                                    onClick={() => xoaChiTietHoaDon(ct)}
                                />
                            </Grid>
                            <Grid item xs={formType === 1 ? 12 : 11}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={9} md={9} lg={9}>
                                        <div style={{ display: displayComponent }}>
                                            <AutocompleteProduct
                                                handleChoseItem={(item: any) =>
                                                    choseProduct(item, index)
                                                }
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
                                            <ExpandMore
                                                sx={{ display: ct?.expanded ? '' : 'none' }}
                                            />
                                            <ExpandLess
                                                sx={{
                                                    display: !ct?.expanded ? '' : 'none'
                                                }}
                                            />
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
                    <Button variant="outlined" className="button-outline" onClick={closeModal}>
                        Hủy
                    </Button>
                    <Button variant="contained" className="button-container" onClick={agrreGioHang}>
                        {formType == 1 ? 'Đồng ý' : 'Lưu'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
