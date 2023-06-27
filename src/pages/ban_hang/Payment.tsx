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
            name: 'Tiền mặt',
            detail: {
                tienKhachTra: '20800đ',
                tienThua: '90000đ'
            }
        },
        {
            icon: NganHang,
            name: 'Thẻ ngân hàng',
            detail: {
                tienKhachTra: '2900đ',
                tienThua: '49000đ'
            }
        },
        {
            icon: ChuyenKhoan,
            name: 'Chuyển khoản',
            detail: {
                tienKhachTra: '92000đ',
                tienThua: '400000đ'
            }
        }
    ];
    const [selectedItem, setSelectedItem] = React.useState<number | -1>(-1);
    const HandleSelected = (index: number) => {
        setSelectedItem(index);
    };

    const selectedPayment = PaymentsList[selectedItem];
    return (
        <Box>
            <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <IconButton
                    onClick={onClick}
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
                    Hình thức thanh toán
                </Typography>
            </Box>
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
                                borderColor: selectedItem === index ? '#7C3367' : '#CDC9CD',
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
                <Box>
                    {PaymentsList.map((item, index) => (
                        <Box key={index}>
                            <Box>
                                <Typography
                                    variant="h3"
                                    color="#000"
                                    fontSize="18px"
                                    fontWeight="700">
                                    HIHI
                                </Typography>
                                <Box>
                                    <Typography
                                        variant="body1"
                                        fontSize="14px"
                                        fontWeight="400"
                                        color="#666466">
                                        Tiền khách trả
                                    </Typography>
                                    <TextField fullWidth size="small" placeholder="đ" />
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};
export default Payments;
