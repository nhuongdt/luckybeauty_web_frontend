import {
    Box,
    Radio,
    Button,
    TextField,
    Typography,
    IconButton,
    ButtonGroup,
    Grid,
    RadioGroup,
    FormControlLabel,
    Input,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import React, { useContext, useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { Guid } from 'guid-typescript';
import { format } from 'date-fns';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppConsts, { ISelect } from '../../../../lib/appconst';
import utils from '../../../../utils/utils';
import { AppContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
import QuyChiTietDto from '../../../../services/so_quy/QuyChiTietDto';
import QuyHoaDonDto from '../../../../services/so_quy/QuyHoaDonDto';
import SoQuyServices from '../../../../services/so_quy/SoQuyServices';
import DateTimePickerCustom from '../../../../components/DatetimePicker/DateTimePickerCustom';
import DialogButtonClose from '../../../../components/Dialog/ButtonClose';
import HoaDonService from '../../../../services/ban_hang/HoaDonService';
import PageHoaDonDto from '../../../../services/ban_hang/PageHoaDonDto';

const themeDate = createTheme({
    components: {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    border: 'none',
                    '& fieldset': {
                        border: 'none',
                        borderRadius: '0px',
                        borderBottom: '1px solid black'
                    }
                }
            }
        }
    }
});

const ModalPhieuThuHoaDon = ({ isShow, idQuyHD = null, onClose, onOk }: any) => {
    const arrHinhThucThanhToan = [...AppConsts.hinhThucThanhToan, { value: 0, text: 'Kết hợp' }];
    const appContext = useContext(AppContext);
    const chinhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanhCurrent?.id;
    const [tienThuaTraKhach, setTienThuaTraKhach] = useState(0);
    const [sumTienKhachTra, setSumTienKhachTra] = useState(0);
    const [idHinhThucTT, setIdHinhThucTT] = React.useState(1);
    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(new PageHoaDonDto({ tenKhachHang: '' }));
    const [quyHDOld, setQuyHDOld] = useState(
        new QuyHoaDonDto({
            id: Guid.create().toString(),
            idChiNhanh: idChiNhanh,
            idLoaiChungTu: 11,
            tongTienThu: 0,
            idDoiTuongNopTien: null,
            hinhThucThanhToan: 1,
            hachToanKinhDoanh: true,
            ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm')
        })
    );

    const [quyHoaDon, setQuyHoaDon] = useState<QuyHoaDonDto>(
        new QuyHoaDonDto({
            id: Guid.create().toString(),
            idChiNhanh: idChiNhanh,
            idLoaiChungTu: 11,
            tongTienThu: 0,
            idDoiTuongNopTien: null,
            hinhThucThanhToan: 1,
            hachToanKinhDoanh: true,
            ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm')
        })
    );

    const getInforQuyHoaDon = async () => {
        if (utils.checkNull(idQuyHD)) return;
        const data = await SoQuyServices.GetInforQuyHoaDon_byId(idQuyHD ?? '');

        if (data !== null) {
            const quyCT = data.quyHoaDon_ChiTiet;
            if (quyCT !== undefined && quyCT?.length > 0) {
                const dataHoaDon = await HoaDonService.GetInforHoaDon_byId(quyCT[0].idHoaDonLienQuan ?? '');
                if (dataHoaDon.length > 0) {
                    setHoaDon(dataHoaDon[0]);
                }

                setQuyHoaDon({
                    ...quyHoaDon,
                    id: data.id,
                    idChiNhanh: data.idChiNhanh,
                    idLoaiChungTu: data.idLoaiChungTu,
                    ngayLapHoaDon: data.ngayLapHoaDon,
                    maHoaDon: data.maHoaDon,
                    noiDungThu: data.noiDungThu,
                    tongTienThu: data.tongTienThu,
                    hachToanKinhDoanh: data.hachToanKinhDoanh,
                    loaiDoiTuong: quyCT[0]?.idNhanVien != null ? 3 : 1,
                    idDoiTuongNopTien: quyCT[0]?.idNhanVien != null ? quyCT[0]?.idNhanVien : quyCT[0]?.idKhachHang,
                    hinhThucThanhToan: quyCT[0].hinhThucThanhToan,
                    idKhoanThuChi: quyCT[0].idKhoanThuChi,
                    idTaiKhoanNganHang: quyCT[0].idTaiKhoanNganHang,
                    quyHoaDon_ChiTiet: quyCT
                });
                setIdHinhThucTT(quyCT?.length > 1 ? 0 : quyCT[0].hinhThucThanhToan);
                setSumTienKhachTra(data.tongTienThu);

                // bind hoadonlienquan
            }
        }
    };

    // change at child --> update to parent
    useEffect(() => {
        getInforQuyHoaDon();
    }, [isShow]);

    const onChangeTienKhachTra = (gtri: string, loai: number) => {
        //
    };

    const choseHinhThucThanhToan = (item: ISelect) => {
        setIdHinhThucTT(item.value as unknown as number);
        if (item.value !== 0) {
            // setLstQuyCT(() => [
            //     new QuyChiTietDto({
            //         tienThu: khachPhaiTra,
            //         hinhThucThanhToan: item.value as number
            //     })
            // ]);
        } else {
            //SetQuyCT_ifKetHop();
        }
    };

    const clickThanhToan = async () => {
        //
    };

    const savePhieuThu = async () => {
        //
    };

    return (
        <>
            <Dialog open={isShow} maxWidth="md" onClose={onClose}>
                <DialogTitle>
                    <Typography className="modal-title">Thông tin phiếu thu</Typography>
                    <DialogButtonClose onClose={onClose} />
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" color="#3D475C" fontWeight="700" fontSize="16px">
                                Tổng tiền thu
                            </Typography>
                            <Typography variant="body1" color="#29303D" fontWeight="700" fontSize="16px">
                                {new Intl.NumberFormat('vi-VN').format(quyHoaDon?.tongTienThu)}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: 'var(--color-bg)',
                                borderRadius: '4px',
                                paddingTop: 2,
                                padding: '16px'
                            }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6} padding={2}>
                                    <Stack spacing={2}>
                                        <Stack spacing={2} direction={'row'} alignItems={'end'}>
                                            <Stack flex={4}>
                                                <Typography variant="body2">Mã phiếu thu</Typography>
                                            </Stack>
                                            <Stack flex={8}>
                                                <TextField
                                                    fullWidth
                                                    variant="standard"
                                                    size="small"
                                                    value={quyHoaDon.maHoaDon}
                                                />
                                            </Stack>
                                        </Stack>
                                        <Stack spacing={2} direction={'row'} alignItems={'end'}>
                                            <Stack flex={4}>
                                                <Typography variant="body2">Ngày lập phiếu</Typography>
                                            </Stack>
                                            <Stack flex={8}>
                                                <ThemeProvider theme={themeDate}>
                                                    <DateTimePickerCustom
                                                        props={{ width: '100%' }}
                                                        defaultVal={quyHoaDon.ngayLapHoaDon}
                                                        handleChangeDate={(dt: string) => {
                                                            //
                                                        }}
                                                    />
                                                </ThemeProvider>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6} padding={2}>
                                    <Stack spacing={2}>
                                        <Stack spacing={2} direction={'row'} alignItems={'end'}>
                                            <Stack flex={4}>
                                                <Typography variant="body2">Hóa đơn</Typography>
                                            </Stack>
                                            <Stack flex={8}>
                                                <Typography color="#29303D" fontWeight="600" fontSize="14px">
                                                    {hoadon.maHoaDon}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack spacing={2} direction={'row'} alignItems={'end'}>
                                            <Stack flex={4}>
                                                <Typography variant="body2">Khách hàng</Typography>
                                            </Stack>
                                            <Stack flex={8}>
                                                <Typography color="#29303D" fontWeight="600" fontSize="14px">
                                                    {hoadon.tenKhachHang}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                        <Grid container justifyContent="space-between" alignItems="center" rowGap="16px">
                            <Grid item xs="auto">
                                <Typography variant="body1" color="#3D475C" fontWeight="700" fontSize="14px">
                                    Tiền khách trả
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                <RadioGroup
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        '& label:last-of-type': {
                                            marginRight: '0'
                                        }
                                    }}>
                                    {arrHinhThucThanhToan.map((item, index) => (
                                        <FormControlLabel
                                            key={index}
                                            control={
                                                <Radio
                                                    size="small"
                                                    value={item.value}
                                                    checked={idHinhThucTT === item.value}
                                                    onChange={() => {
                                                        choseHinhThucThanhToan(item);
                                                    }}
                                                />
                                            }
                                            label={item.text}
                                            sx={{
                                                '& .MuiFormControlLabel-label': {
                                                    color: 'rgba(0, 0, 0, 0.85)',
                                                    fontSize: '14px'
                                                }
                                            }}
                                        />
                                    ))}
                                </RadioGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <NumericFormat
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            paddingY: '13.5px',
                                            textAlign: 'right'
                                        }
                                    }}
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    customInput={TextField}
                                    value={sumTienKhachTra}
                                    onChange={(event) => onChangeTienKhachTra(event.target.value, idHinhThucTT)}
                                />

                                {/* {hinhThucTT === 0 && (
                                <NumericFormat
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            paddingY: '13.5px',
                                            textAlign: 'right'
                                        }
                                    }}
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    customInput={TextField}
                                    value={tienKhachTraMax}
                                    onChange={(event) =>
                                        setTienKhachTraMax(utils.formatNumberToFloat(event.target.value))
                                    }
                                />
                            )} */}
                            </Grid>
                            {quyHoaDon?.quyHoaDon_ChiTiet !== undefined && quyHoaDon?.quyHoaDon_ChiTiet?.length > 1 ? (
                                <Grid container spacing="16px">
                                    {quyHoaDon?.quyHoaDon_ChiTiet?.map((item, index) => (
                                        <Grid item xs={4} key={index}>
                                            <Box
                                                sx={{
                                                    border: '1px solid #C2C9D6',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    padding: '8px 16px',
                                                    '& input': {
                                                        border: '0',
                                                        width: '100%',
                                                        textAlign: 'right',
                                                        color: '#525F7A',
                                                        fontSizze: '16px',
                                                        outline: 'none'
                                                    },
                                                    '& input::-webkit-outer-spin-button,& input::-webkit-inner-spin-button':
                                                        {
                                                            WebkitAppearance: 'none',
                                                            margin: '0'
                                                        }
                                                }}>
                                                <Typography variant="body1" color="#525F7A" fontSize="12px">
                                                    {
                                                        arrHinhThucThanhToan.filter(
                                                            (x: ISelect) => x.value === item.hinhThucThanhToan
                                                        )[0].text
                                                    }
                                                </Typography>

                                                <NumericFormat
                                                    size="small"
                                                    fullWidth
                                                    decimalSeparator=","
                                                    thousandSeparator="."
                                                    customInput={Input}
                                                    sx={{
                                                        '&:before': {
                                                            borderBottom: 'none'
                                                        }
                                                    }}
                                                    value={item.tienThu}
                                                    onChange={(event) =>
                                                        onChangeTienKhachTra(event.target.value, item.hinhThucThanhToan)
                                                    }
                                                />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : undefined}
                            {tienThuaTraKhach !== 0 && (
                                <Grid container justifyContent="space-between">
                                    <Grid item xs="auto">
                                        <Typography variant="body1" color="#3D475C" fontWeight="400" fontSize="14px">
                                            {tienThuaTraKhach > 0 ? 'Tiền thừa' : 'Tiên khách thiếu'}
                                        </Typography>
                                    </Grid>
                                    <Grid xs="auto" item>
                                        <Typography variant="body1" color="#29303D" fontWeight="700" fontSize="14px">
                                            {new Intl.NumberFormat('vi-VN').format(Math.abs(tienThuaTraKhach))}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                        <Box
                            sx={{
                                '& textarea': {
                                    height: '80px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    borderColor: '#C2C9D6',
                                    outline: 'none',
                                    color: '#A3ADC2',
                                    padding: '8px'
                                }
                            }}>
                            <Typography fontSize="14px" color="#525F7A">
                                Ghi chú
                            </Typography>
                            <textarea
                                value={quyHoaDon.noiDungThu}
                                onChange={(e) => setQuyHoaDon({ ...quyHoaDon, noiDungThu: e.target.value })}></textarea>
                        </Box>
                        <Stack>
                            <Button
                                variant="contained"
                                sx={{
                                    width: '158px',
                                    marginX: 'auto',
                                    mt: 'auto',
                                    mb: '5px',
                                    paddingY: '14px',
                                    fontSize: '16px'
                                }}
                                onClick={clickThanhToan}>
                                Cập nhật
                            </Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default ModalPhieuThuHoaDon;
