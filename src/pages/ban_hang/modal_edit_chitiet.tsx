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
    AccordionDetails
} from '@mui/material';
import { Percent, Add, Remove, MoreHoriz, ExpandMore, Close } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import Utils from '../../utils/utils'; // func common

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

export function popupChietKhau(params: any) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}>
                <Stack direction="row" spacing={1}>
                    <Typography variant="body2">Chiết khấu</Typography>
                    <TextField size="small" fullWidth></TextField>
                    <FormControlLabel value="female" control={<Radio size="small" />} label="%" />
                    <FormControlLabel value="male" control={<Radio size="small" />} label="vnd" />
                </Stack>
            </Popover>
        </>
    );
}

export default function ModalEditChiTietGioHang({ trigger, handleSave, dataNhanVien }: any) {
    const [isShow, setIsShow] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [errPhone, setErrPhone] = useState(false);
    const [errCheckIn, setErrCheckIn] = useState(false);
    const isFirstRender = useRef(true);
    const [ctDoing, setCTDoing] = useState<PageHoaDonChiTietDto>(
        new PageHoaDonChiTietDto({ id: '' })
    );

    console.log('ModalEditChiTietGioHang ', trigger);
    React.useEffect(() => {
        // if (isFirstRender.current) {
        //     isFirstRender.current = false;
        //     return;
        // }
        if (trigger.isShow) {
            setIsShow(true);
            setCTDoing(trigger.item);
            setIsSave(false);
        }
    }, [trigger]);

    const agree = () => {
        console.log(555);
        handleSave(ctDoing);
    };

    return (
        <>
            <Dialog open={isShow} onClose={() => setIsShow(false)} fullWidth maxWidth="sm">
                <DialogTitle className="dialog-title">Chỉnh sửa giỏ hàng</DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={1}>
                            <Close sx={{ width: 45, height: 48, color: 'red', padding: '10px' }} />
                        </Grid>
                        <Grid item xs={11}>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Grid item xs={12} sm={10} md={10} lg={10}>
                                        <Typography style={{ fontWeight: 500 }}>
                                            {ctDoing.tenHangHoa}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={2} md={2} lg={2}>
                                        <Typography style={{ fontWeight: 500, textAlign: 'right' }}>
                                            {Utils.formatNumber(ctDoing.giaBan)}
                                        </Typography>
                                    </Grid>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={1}>
                                        <Grid item xs={7} sm={7} md={7} lg={7}>
                                            <Stack direction="column" spacing={1}>
                                                <Typography variant="body2">Giá bán </Typography>
                                                <ThemeProvider theme={themInputChietKhau}>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        error={isSave}
                                                        helperText={
                                                            isSave ? 'Vui lòng nhập đơn giá' : ''
                                                        }
                                                        onChange={(event) => {
                                                            setIsSave(false);
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <ToggleButton
                                                                    value="bold"
                                                                    aria-label="bold"
                                                                    size="small"
                                                                    title="Chiết khấu">
                                                                    <MoreHoriz />
                                                                </ToggleButton>
                                                            )
                                                        }}></TextField>
                                                </ThemeProvider>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={5} sm={5} md={5} lg={5}>
                                            <Stack direction="column" spacing={1}>
                                                <Typography
                                                    sx={{ textAlign: 'center' }}
                                                    variant="body2">
                                                    Số lượng{' '}
                                                </Typography>
                                                <Stack direction="row" spacing={1}>
                                                    <Remove className="btnIcon" />
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        error={isSave}
                                                        helperText={
                                                            isSave ? 'Vui lòng nhập đơn giá' : ''
                                                        }
                                                        onChange={(event) => {
                                                            setIsSave(false);
                                                        }}></TextField>
                                                    <Add className="btnIcon" />
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12}>
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
                                </AccordionDetails>
                            </Accordion>
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
