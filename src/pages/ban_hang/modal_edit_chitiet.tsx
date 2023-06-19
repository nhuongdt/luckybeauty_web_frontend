import * as React from 'react';
import { useState, useRef } from 'react';
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
    Accordion,
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
import { InputPropNumber, InputNumber } from '../../services/dto/InputFormat';
import { NumericFormatCustom } from '../../components/TextField/NumericFormat';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

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

export function PopupChietKhau({ props, handleClose }: any) {
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
                            <TextField size="small" fullWidth></TextField>
                            <FormControlLabel
                                value="female"
                                control={<Radio size="small" />}
                                label="%"
                            />
                            <FormControlLabel
                                value="male"
                                control={<Radio size="small" />}
                                label="đ"
                            />
                        </Stack>
                    </Stack>
                </Box>
            </Popover>
        </>
    );
}

export default function ModalEditChiTietGioHang({ trigger, handleSave, dataNhanVien }: any) {
    const [isShow, setIsShow] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [popover, setPopover] = useState({ anchorEl: null, open: false });
    const [ctDoing, setCTDoing] = useState<PageHoaDonChiTietDto>(
        new PageHoaDonChiTietDto({ id: '', expanded: true })
    );

    const [giaBan, setGiaBan] = React.useState<InputNumber>({
        textMask: '000-0000',
        numberFormat: ''
    });

    const handleChangeGiaBan = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGiaBan({
            ...giaBan,
            numberFormat: event.target.value
        });
        console.log(44, event.target.value);

        setCTDoing((old: any) => {
            return {
                ...old,
                donGiaTruocCK: event.target.value,
                thanhTienTruocCK: Utils.formatNumberToFloat(event.target.value) * old.soLuong
            };
        });
    };

    console.log('ModalEditChiTietGioHang ', trigger.item);
    React.useEffect(() => {
        if (trigger.isShow) {
            setIsShow(true);
            setCTDoing(trigger.item);
            setIsSave(false);

            setGiaBan({
                ...giaBan,
                numberFormat: trigger.item.donGiaTruocCK
            });
        }
        return () => setIsShow(false); // chưa biết chỗ return này có mục đích gì, viết vậy thôi
    }, [trigger]);

    const showPopChietKhau = (event: any) => {
        setPopover({ anchorEl: event.currentTarget, open: true });
    };
    const hidePopChietKhau = () => {
        setPopover({ anchorEl: null, open: false });
    };

    const handleChangeSoLuong = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCTDoing((old: any) => {
            return {
                ...old,
                soLuong: event.target.value,
                thanhTienTruocCK: Utils.formatNumberToFloat(event.target.value) * old.giaBan
            };
        });
    };

    const choseProduct = (item: any) => {
        if (item === null) {
            setCTDoing((old: any) => {
                return {
                    ...old,
                    tenHangHoa: '',
                    maHangHoa: '',
                    id: null,
                    idDonViQuyDoi: null,
                    idHangHoa: null
                };
            });
            setGiaBan({
                ...giaBan,
                numberFormat: '0'
            });
        } else {
            setGiaBan({
                ...giaBan,
                numberFormat: item.giaBan
            });
            setCTDoing((old: any) => {
                return {
                    ...old,
                    idHangHoa: item.id,
                    idDonViQuyDoi: item.idDonViQuyDoi,
                    idNhomHangHoa: item.idNhomHangHoa,
                    maHangHoa: item.maHangHoa,
                    tenHangHoa: item.tenHangHoa,
                    donGiaTruocCK: item.giaBan,
                    thanhTienTruocCK: item.giaBan * old.soLuong
                };
            });
        }
    };

    const agree = () => {
        console.log(555);
        handleSave(ctDoing);
    };

    return (
        <>
            <PopupChietKhau props={popover} handleClose={hidePopChietKhau} />
            <Dialog open={isShow} onClose={() => setIsShow(false)} fullWidth maxWidth="sm">
                <DialogTitle className="dialog-title">Chỉnh sửa giỏ hàng</DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={1}>
                            <Close sx={{ width: 40, height: 40, color: 'red', padding: '8px' }} />
                        </Grid>
                        <Grid item xs={11}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={9} md={9} lg={9}>
                                    <AutocompleteProduct
                                        handleChoseItem={choseProduct}
                                        productChosed={ctDoing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <Stack direction="row" spacing={1} justifyContent="end">
                                        <Typography style={{ fontWeight: 500, textAlign: 'right' }}>
                                            {Utils.formatNumber(ctDoing?.thanhTienTruocCK)}
                                        </Typography>
                                        <ExpandMore />
                                        <ExpandLess sx={{ display: 'none' }} />
                                    </Stack>
                                </Grid>
                                <Grid item xs={7} sm={7} md={7} lg={7}>
                                    <Stack direction="column" spacing={1}>
                                        <Typography variant="body2">Giá bán </Typography>
                                        <ThemeProvider theme={themInputChietKhau}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                error={isSave}
                                                value={giaBan.numberFormat}
                                                helperText={isSave ? 'Vui lòng nhập đơn giá' : ''}
                                                onChange={handleChangeGiaBan}
                                                InputProps={{
                                                    endAdornment: (
                                                        <ToggleButton
                                                            value="bold"
                                                            aria-label="bold"
                                                            size="small"
                                                            title="Chiết khấu"
                                                            onClick={(event) => {
                                                                showPopChietKhau(event);
                                                            }}>
                                                            <MoreHoriz />
                                                        </ToggleButton>
                                                    ),
                                                    inputComponent: NumericFormatCustom as any
                                                }}></TextField>
                                        </ThemeProvider>
                                    </Stack>
                                </Grid>
                                <Grid item xs={5} sm={5} md={5} lg={5}>
                                    <Stack direction="column" spacing={1}>
                                        <Typography sx={{ textAlign: 'center' }} variant="body2">
                                            Số lượng
                                        </Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Remove className="btnIcon" />
                                            <TextField
                                                size="small"
                                                fullWidth
                                                value={ctDoing.soLuong}
                                                error={isSave}
                                                helperText={isSave ? 'Vui lòng nhập đơn giá' : ''}
                                                onChange={handleChangeSoLuong}></TextField>
                                            <Add className="btnIcon" />
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

                            <Stack paddingTop={2}>
                                <Link color="#7c3367" sx={{ fontSize: '14px' }}>
                                    <Add />
                                    Thêm dịch vụ
                                </Link>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" className="button-outline">
                        Hủy
                    </Button>
                    <Button variant="contained" className="button-container">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
