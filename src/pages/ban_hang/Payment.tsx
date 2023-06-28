import React from 'react';
import { Box, Typography, Grid, IconButton, TextField } from '@mui/material';
import { ReactComponent as ArrowLeft } from '../../images/arrow_back.svg';
import { ReactComponent as TienMat } from '../../images/tien-mat.svg';
import { ReactComponent as NganHang } from '../../images/ngan-hang.svg';
import { ReactComponent as ChuyenKhoan } from '../../images/chuyen-khoan.svg';
interface ChildComponent {
    onClick: () => void;
}
const Payments: React.FC<ChildComponent> = ({ onClick }) => {
    const PaymentsList = [
        {
            icon: TienMat,
            name: 'Tiền mặt'
        },
        {
            icon: NganHang,
            name: 'Thẻ ngân hàng'
        },
        {
            icon: ChuyenKhoan,
            name: 'Chuyển khoản'
        }
    ];
    const tientip = ['Không tip', '5%', '10%', '15%', 'Tùy chỉnh'];

    const [selectedItem, setSelectedItem] = React.useState<number | -1>(-1);
    const HandleSelected = (index: number) => {
        setSelectedItem(index);
    };
    const formatCurrency = (value: number) => {
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
        return formatter.format(value);
    };

    const ProposePrice = [100000, 150000, 200000, 300000, 400000, 500000];
    const [TienKhachTra, setTienKhachTra] = React.useState<number>(0);
    const newValue = formatCurrency(TienKhachTra);
    const HandleTienKhachTra = (index: number) => {
        setTienKhachTra(ProposePrice[index]);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTienKhachTra(parseInt(event.target.value));
    };
    const [Payment, setPayment] = React.useState<number>(1);
    const nextComponent = () => {
        setPayment((prevCount: number) => (prevCount >= 2 ? 2 : prevCount + 1));
    };
    const prevComponent = () => {
        setPayment((prevCount: number) => (prevCount <= 1 ? 1 : prevCount - 1));
        if (Payment === 1) {
            onClick();
        }
    };
    return (
        <Box>
            <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <IconButton
                    onClick={prevComponent}
                    sx={{
                        '& svg': {
                            width: '18px',
                            height: '18px'
                        },
                        '&:hover svg': {
                            filter: 'brightness(0) saturate(100%) invert(26%) sepia(8%) saturate(4987%) hue-rotate(266deg) brightness(93%) contrast(90%)'
                        }
                    }}>
                    <ArrowLeft />
                </IconButton>
                <Typography variant="h3" fontSize="18px" color="#000" fontWeight="700">
                    {Payment === 1 ? 'Tiền tip' : 'Hình thức thanh toán'}
                </Typography>
            </Box>
            <Box>
                {Payment === 1 ? (
                    <Grid container spacing="1.6vw" mt="-8px">
                        {tientip.map((item, index) => (
                            <Grid item xs={3} key={index}>
                                <Box
                                    onClick={nextComponent}
                                    textAlign="center"
                                    padding="24px"
                                    border="1px solid #CDC9CD"
                                    borderRadius="8px"
                                    sx={{
                                        bgcolor: '#fff',
                                        borderColor: '#CDC9CD',
                                        cursor: 'pointer',
                                        transition: '.4s',
                                        '&:hover': {
                                            borderColor: '#7C3367'
                                        }
                                    }}>
                                    <Typography
                                        fontSize="16px"
                                        variant="h3"
                                        fontWeight="400"
                                        color="#333233">
                                        {item}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box>
                        <Grid container spacing={3} mt="-8px">
                            {PaymentsList.map((item, index) => (
                                <Grid item key={index} md={3}>
                                    <Box
                                        onClick={() => HandleSelected(index)}
                                        textAlign="center"
                                        padding="24px"
                                        border="1px solid #CDC9CD"
                                        borderRadius="8px"
                                        sx={{
                                            bgcolor: selectedItem === index ? ' #F2EBF0' : '#fff',
                                            borderColor:
                                                selectedItem === index ? '#7C3367' : '#CDC9CD',
                                            cursor: 'pointer',
                                            transition: '.4s',
                                            '& svg': {
                                                width: '32px',
                                                height: '32px'
                                            },
                                            '&:hover': {
                                                borderColor: '#7C3367'
                                            }
                                        }}>
                                        <item.icon />
                                        <Typography
                                            mt="8px"
                                            fontSize="16px"
                                            variant="h3"
                                            fontWeight="400"
                                            color="#333233">
                                            {item.name}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                        {selectedItem !== -1 && (
                            <Box mt="24px">
                                <Box>
                                    <Box>
                                        <Typography
                                            variant="h3"
                                            color="#000"
                                            fontSize="18px"
                                            fontWeight="700">
                                            {selectedItem === 0
                                                ? 'Tiền mặt'
                                                : selectedItem === 1
                                                ? 'Thẻ ngân hàng'
                                                : selectedItem === 2
                                                ? 'Chuyển khoản'
                                                : undefined}
                                        </Typography>
                                        <Box mt="12px">
                                            <Typography
                                                variant="body1"
                                                fontSize="14px"
                                                fontWeight="400"
                                                color="#666466">
                                                Tiền khách trả
                                            </Typography>

                                            <TextField
                                                type="number"
                                                value={TienKhachTra !== 0 ? TienKhachTra : ''}
                                                onChange={handleChange}
                                                fullWidth
                                                placeholder="đ"
                                                sx={{
                                                    bgcolor: '#fff',
                                                    mt: '4px',
                                                    '& input': {
                                                        appearance: 'textfield',
                                                        paddingY: '13.5px'
                                                    },
                                                    '& input::-webkit-outer-spin-button,& input::-webkit-inner-spin-button':
                                                        {
                                                            appearance: 'none'
                                                        }
                                                }}
                                            />
                                        </Box>
                                        <Grid container mt="24px" spacing="1.6vw">
                                            {ProposePrice.map((item, index) => (
                                                <Grid item xs={2} key={index}>
                                                    <Box
                                                        onClick={() => HandleTienKhachTra(index)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            height: '56px',
                                                            border: '1px solid #E6E1E6',
                                                            borderRadius: '8px',
                                                            fontSize: '16px',
                                                            color: '#333233',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            pl: '16px',
                                                            bgcolor: '#fff',
                                                            transition: '.4s',
                                                            '&:hover': {
                                                                borderColor: '#7C3367'
                                                            }
                                                        }}>
                                                        {formatCurrency(item)}
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};
export default Payments;
