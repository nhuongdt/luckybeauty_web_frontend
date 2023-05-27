import * as React from 'react';
import { useState } from 'react';
// TbCurrencyDong
import { TbCurrencyDong } from 'react-icons/tb';
import {
    Dialog,
    DialogTitle,
    Typography,
    DialogContent,
    TextField,
    Grid,
    Stack,
    Button,
    Box,
    DialogActions,
    IconButton,
    Divider,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import { Percent, Search } from '@mui/icons-material';
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

export default function ModalEditChiTietGioHang({ trigger, handleSave }: any) {
    const [isShow, setIsShow] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [errPhone, setErrPhone] = useState(false);
    const [errCheckIn, setErrCheckIn] = useState(false);

    const [ctDoing, setCTDoing] = useState<PageHoaDonChiTietDto>(
        new PageHoaDonChiTietDto({ id: '' })
    );

    console.log('ModalEditChiTietGioHang ', trigger);
    React.useEffect(() => {
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
                <DialogTitle>Chỉnh sửa giỏ hàng</DialogTitle>
                <DialogContent>
                    <Grid container rowSpacing={2} columnSpacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Typography style={{ fontWeight: 500, textAlign: 'right' }}>
                                {ctDoing.tenHangHoa}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Đơn giá"
                                label="Đơn giá"
                                error={isSave}
                                helperText={isSave ? 'Vui lòng nhập đơn giá' : ''}
                                onChange={(event) => {
                                    setIsSave(false);
                                }}></TextField>
                        </Grid>
                        <Grid item xs={12} sm={5} md={5} lg={5}>
                            <TextField
                                size="small"
                                fullWidth
                                error={isSave}
                                placeholder="Số lượng"
                                helperText={isSave ? 'Vui lòng nhập số lượng' : ''}
                                label="Số lượng"
                                onChange={(event) => {
                                    setIsSave(false);
                                }}></TextField>
                        </Grid>
                        <Grid item xs={12} sm={7} md={7} lg={7}>
                            <ThemeProvider theme={themInputChietKhau}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    error={isSave}
                                    label="Chiết khấu"
                                    placeholder="Chiết khấu"
                                    helperText={isSave ? 'Vui lòng nhập đơn giá' : ''}
                                    onChange={(event) => {
                                        setIsSave(false);
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <ToggleButtonGroup>
                                                <ToggleButton
                                                    value="bold"
                                                    aria-label="bold"
                                                    size="small">
                                                    <Percent />
                                                </ToggleButton>
                                                <ToggleButton
                                                    value="italic"
                                                    aria-label="italic"
                                                    size="small">
                                                    <TbCurrencyDong
                                                        style={{ fontSize: '1.5rem' }}
                                                    />
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        )
                                    }}></TextField>
                            </ThemeProvider>
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
