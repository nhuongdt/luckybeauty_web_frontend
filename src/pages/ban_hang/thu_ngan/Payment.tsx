import React, { useEffect } from 'react';
import { Box, Typography, Grid, IconButton, TextField } from '@mui/material';
import { ReactComponent as ArrowLeft } from '../../../images/arrow_back.svg';
import { ReactComponent as TienMat } from '../../../images/tien-mat.svg';
import { ReactComponent as NganHang } from '../../../images/ngan-hang.svg';
import { ReactComponent as ChuyenKhoan } from '../../../images/chuyen-khoan.svg';
import { ReactComponent as IconTitleTienmat } from '../../../images/wallet-3.svg';
import { ReactComponent as IconNganhang } from '../../../images/iconNganHang.svg';
import Card1 from '../../../images/card1.svg';
import Card2 from '../../../images/card2.svg';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import { ReactComponent as TickIcon } from '../../../images/checkIcon.svg';
interface ChildComponent {
    handleClickPrev: () => void;
    formShow?: number;
    tongPhaiTra?: number;
}
const Payments: React.FC<ChildComponent> = ({ handleClickPrev, formShow, tongPhaiTra = 0 }) => {
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
    const tientip = ['5%', '10%', '15%', 'Tùy chỉnh'];

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
    const [selectedTientip, setSelectedTienTip] = React.useState(-1);
    const handleSelectedTientip = (index: number) => {
        setSelectedTienTip(index);
    };
    const Cards = [
        {
            name: 'Đinh Tuấn Tài',
            icon: Card1
        },
        {
            name: 'Phan Thị Quỳnh',
            icon: Card2
        }
    ];
    const [onCard, setOnCard] = React.useState(-1);
    const handleSelectedCard = (index: number) => {
        setOnCard(index);
    };
    return (
        <Box>
            <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <IconButton
                    onClick={handleClickPrev}
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
                    Chọn thanh toán
                </Typography>
            </Box>
            <Box sx={{ marginTop: '24px' }}>
                <Typography fontSize="16px" fontWeight="700" color="#4C4B4C" variant="h3">
                    Tiền tip
                </Typography>
                <Grid container spacing="1.6vw" mt="-8px" sx={{ maxWidth: '70%' }}>
                    {tientip.map((item, index) => (
                        <Grid item xs={3} key={index}>
                            <Box
                                onClick={() => handleSelectedTientip(index)}
                                textAlign="center"
                                padding="16px"
                                border="1px solid #CDC9CD"
                                borderRadius="8px"
                                sx={{
                                    bgcolor: selectedTientip === index ? ' #F2EBF0' : '#fff',
                                    borderColor: selectedTientip === index ? '#7C3367' : '#CDC9CD',
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

                <Box sx={{ marginTop: '24px' }}>
                    <Typography fontSize="16px" fontWeight="700" color="#4C4B4C" variant="h3">
                        Hình thức thanh toán
                    </Typography>
                    <Grid container spacing={3} mt="-8px" sx={{ maxWidth: '90%' }}>
                        {PaymentsList.map((item, index) => (
                            <Grid item key={index} md={3} sm={4} xs={12}>
                                <Box
                                    onClick={() => HandleSelected(index)}
                                    textAlign="center"
                                    padding={{ md: 2, sm: '24px 10px', lg: 2, xs: 1 }}
                                    border="1px solid #CDC9CD"
                                    borderRadius="8px"
                                    sx={{
                                        position: 'relative',
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
                                        fontSize="14px"
                                        variant="h3"
                                        fontWeight="400"
                                        color="#333233">
                                        {item.name}
                                    </Typography>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            right: '-4px',
                                            display: 'flex',
                                            opacity: selectedItem === index ? '1' : '0',
                                            transition: '.3s',
                                            top: '-4px',
                                            height: '14px',
                                            width: '14px',
                                            bgcolor: '#fff',
                                            borderRadius: '50%',
                                            '& svg': {
                                                width: '14px',
                                                height: '14px'
                                            }
                                        }}>
                                        <TickIcon />
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    {selectedItem !== -1 && (
                        <>
                            <Box mt="24px">
                                <Box
                                    sx={{
                                        padding: '16px',
                                        bgcolor: '#fff',
                                        borderRadius: '8px',
                                        position: 'relative',
                                        boxShadow: '0px 5px 18px 0px #28293D12'
                                    }}>
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            '& svg': {
                                                width: '16px',
                                                height: '16px'
                                            }
                                        }}>
                                        <CloseIcon />
                                    </IconButton>
                                    <Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                            <IconTitleTienmat />
                                            <Typography
                                                variant="h3"
                                                color="#000"
                                                fontSize="14px"
                                                fontWeight="700">
                                                Tiền mặt
                                            </Typography>
                                        </Box>
                                        <Box
                                            mt="12px"
                                            sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography
                                                variant="body1"
                                                fontSize="14px"
                                                fontWeight="400"
                                                color="#666466"
                                                minWidth="105px">
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
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        boxShadow: '0px 5px 18px 0px #28293D12',
                                        bgcolor: '#fff',
                                        marginTop: '16px',
                                        padding: '16px',
                                        position: 'relative',
                                        borderRadius: '8px'
                                    }}>
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            '& svg': {
                                                width: '16px',
                                                height: '16px'
                                            }
                                        }}>
                                        <CloseIcon />
                                    </IconButton>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <IconNganhang />
                                        <Typography
                                            variant="h3"
                                            color="#000"
                                            fontSize="14px"
                                            fontWeight="700">
                                            Thẻ ngân hàng
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                                        {Cards.map((item, index) => (
                                            <Box
                                                onClick={() => handleSelectedCard(index)}
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    '&:hover p': {
                                                        color: '#7C3367'
                                                    }
                                                }}>
                                                <Box
                                                    sx={{
                                                        padding: '10px',
                                                        border: `1px solid ${
                                                            onCard === index ? '#7C3367' : '#CDC9CD'
                                                        }`,
                                                        transition: '.3s',
                                                        cursor: 'pointer',
                                                        borderRadius: '8px',
                                                        width: 'fit-content'
                                                    }}>
                                                    <Box
                                                        sx={{
                                                            width: 'fit-content',
                                                            img: {
                                                                objectFit: 'contain',
                                                                width: '100%'
                                                            }
                                                        }}>
                                                        <img src={item.icon} alt="card" />
                                                    </Box>
                                                </Box>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: '#333233',
                                                        fontSize: '14px',
                                                        textTransform: 'uppercase',
                                                        transition: '.3s'
                                                    }}>
                                                    {item.name}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Box mt="12px" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography
                                            variant="body1"
                                            fontSize="14px"
                                            fontWeight="400"
                                            color="#666466"
                                            minWidth="105px">
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
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                <Typography
                                    variant="body1"
                                    sx={{ fontSize: '14px', color: '#4C4B4C', marginTop: '8px' }}>
                                    Tiền thừa trả khách
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ fontSize: '14px', color: '#333233', fontWeight: '700' }}>
                                    0.00
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
export default Payments;
