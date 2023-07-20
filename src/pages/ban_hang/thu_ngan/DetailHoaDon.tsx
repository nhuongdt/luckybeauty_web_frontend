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
    FormControlLabel
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import React, { useEffect, useState } from 'react';
import { util } from 'prettier';
import utils from '../../../utils/utils';
import { NumericFormat } from 'react-number-format';
import AppConsts from '../../../lib/appconst';
interface Detail {
    toggleDetail: () => void;
}
const DetailHoaDon = ({ toggleDetail, tongTienHang, hinhThucTT = 1 }: any) => {
    const [chietKhau, setChietKhau] = React.useState(0);
    const selectedChietKhau = (value: number) => {
        setChietKhau(value);
    };
    const payments = [...AppConsts.hinhThucThanhToan, { id: 0, text: 'Kết hợp' }];
    const ketHop = [
        {
            name: 'Tiền mặt',
            price: 777777
        },
        {
            name: 'Quẹt thẻ',
            price: 99999
        },
        {
            name: 'Chuyển khoản',
            price: 307600
        }
    ];
    const [selectedPayment, setSelectedPayment] = React.useState(0);
    const selectedPayments = (index: number) => {
        setSelectedPayment(index);
    };
    const [total, setTotal] = React.useState(0);

    const [valuePrice, setValuePrice] = React.useState(0);

    const [tongGiamGiaHD, setTongGiamGiaHD] = useState(0);
    const [ptGiamGiaHD, setPTGiamGiaHD] = useState(0);
    const [laPTGiamGia, setlaPTGiamGia] = useState(true);
    // const [tongThanhToan, setTongThanhToan] = useState(0);

    const tongThanhToan = tongTienHang - tongGiamGiaHD;

    const onClickPTramVND = (newVal: boolean) => {
        let gtriPT = 0;
        if (!laPTGiamGia) {
            if (newVal && tongTienHang > 0) {
                gtriPT = (tongGiamGiaHD / tongTienHang) * 100;
                setPTGiamGiaHD(gtriPT);
            }
        }
        setlaPTGiamGia(newVal);
    };

    const onChangeGtriGiamGia = (gtri: string) => {
        let gtriNew = utils.formatNumberToFloat(gtri);
        if (gtriNew > tongTienHang) {
            gtriNew = tongTienHang;
        }
        let gtriVND = 0;
        if (tongTienHang > 0) {
            if (laPTGiamGia) {
                gtriVND = (gtriNew * tongTienHang) / 100;
                setPTGiamGiaHD(gtriNew);
            } else {
                gtriVND = gtriNew;
            }
        }
        setTongGiamGiaHD(gtriVND);
    };

    const gtriXX = laPTGiamGia ? ptGiamGiaHD : tongGiamGiaHD;
    return (
        <>
            <Box
                sx={{
                    padding: '24px',
                    border: '1px solid var(--color-main)',
                    borderRadius: '12px',
                    bgcolor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h3" color="#29303D" fontSize="24px" fontWeight="700">
                        Chi tiết hóa đơn
                    </Typography>
                    <IconButton
                        sx={{
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}
                        onClick={toggleDetail}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {' '}
                    <Typography variant="body1" color="#3B4758" fontSize="14px">
                        Tổng tiền hàng
                    </Typography>
                    <Typography variant="body1" color="#29303D" fontWeight="700" fontSize="14px">
                        {new Intl.NumberFormat('vi-VN').format(tongTienHang)}
                    </Typography>
                </Box>
                <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" color="#3B4758" fontSize="14px">
                        Giảm giá
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'stretch',
                            gap: '16px'
                        }}>
                        <NumericFormat
                            size="medium"
                            fullWidth
                            value={gtriXX}
                            decimalSeparator=","
                            thousandSeparator="."
                            isAllowed={(values) => {
                                const floatValue = values.floatValue;
                                if (laPTGiamGia) return (floatValue ?? 0) <= 100; // neu %: khong cho phep nhap qua 100%
                                if (!laPTGiamGia) return (floatValue ?? 0) <= tongTienHang;
                                return true;
                            }}
                            sx={{
                                '& input': {
                                    paddingY: '13.5px'
                                }
                            }}
                            customInput={TextField}
                            onChange={(event: any) => onChangeGtriGiamGia(event.target.value)}
                        />
                        <ButtonGroup
                            sx={{
                                '& button': {
                                    transition: '.3s'
                                }
                            }}>
                            <Button
                                onClick={() => onClickPTramVND(true)}
                                sx={{
                                    bgcolor: laPTGiamGia ? '#fff' : 'rgba(61, 71, 92, 0.1)',
                                    color: laPTGiamGia ? '#3D475C' : 'rgba(194, 201, 214, 0.7)'
                                }}>
                                %
                            </Button>
                            <Button
                                onClick={() => onClickPTramVND(false)}
                                sx={{
                                    color: !laPTGiamGia ? '#3D475C' : 'rgba(194, 201, 214, 0.7)',
                                    borderLeft: '0!important',
                                    bgcolor: !laPTGiamGia ? '#fff' : 'rgba(61, 71, 92, 0.1)'
                                }}>
                                đ
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Box>
                <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" color="#3D475C" fontWeight="700" fontSize="16px">
                        Thanh toán
                    </Typography>
                    <Typography variant="body1" color="#29303D" fontWeight="700" fontSize="16px">
                        {new Intl.NumberFormat('vi-VN').format(tongThanhToan)}
                    </Typography>
                </Box>
                <Grid container justifyContent="space-between" alignItems="center" rowGap="16px">
                    <Grid item xs="auto">
                        <Typography
                            variant="body1"
                            color="#3D475C"
                            fontWeight="700"
                            fontSize="14px">
                            Tiền khách trả
                        </Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <RadioGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                            {payments.map((item, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={
                                        <Radio
                                            value={item.id}
                                            checked={selectedPayment === index}
                                            onChange={() => selectedPayments(index)}
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
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            defaultValue="777.777"
                            sx={{
                                '& input': {
                                    paddingY: '13.5px'
                                }
                            }}
                        />
                    </Grid>
                    {selectedPayment === 3 ? (
                        <Grid xs={12} container spacing="16px">
                            {ketHop.map((item, index) => (
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
                                            {item.name}
                                        </Typography>
                                        <input type="number" value={valuePrice} />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    ) : undefined}
                    <Grid item xs={12} container justifyContent="space-between">
                        <Grid item xs="auto">
                            <Typography
                                variant="body1"
                                color="#3D475C"
                                fontWeight="400"
                                fontSize="14px">
                                Tiền thừa
                            </Typography>
                        </Grid>
                        <Grid xs="auto" item>
                            <Typography
                                variant="body1"
                                color="#29303D"
                                fontWeight="700"
                                fontSize="14px">
                                0
                            </Typography>
                        </Grid>
                    </Grid>
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
                    <textarea placeholder="nội dung"></textarea>
                </Box>
                <Button
                    variant="contained"
                    className="btn-container-hover"
                    sx={{ width: '158px', margin: 'auto', paddingY: '14px', fontSize: '16px' }}>
                    Thanh toán
                </Button>
            </Box>
        </>
    );
};
export default DetailHoaDon;
